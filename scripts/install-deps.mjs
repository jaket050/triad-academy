import { createRequire } from 'node:module';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const require = createRequire(import.meta.url);
const semver = require('C:/Program Files/nodejs/node_modules/npm/node_modules/semver');

const root = process.cwd();
const nodeModules = path.join(root, 'node_modules');
const tarballDir = path.join(root, '.package-tarballs');
const registry = 'https://registry.npmjs.org';
const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
const queue = [
  ...Object.entries(pkg.dependencies ?? {}).map(([name, range]) => ({ name, range, base: root, lockBase: '' })),
  ...Object.entries(pkg.devDependencies ?? {}).map(([name, range]) => ({ name, range, base: root, lockBase: '' })),
];
const seen = new Set();
const lockPackages = {
  '': {
    name: pkg.name,
    version: pkg.version,
    dependencies: pkg.dependencies,
    devDependencies: pkg.devDependencies,
  },
};

await mkdir(nodeModules, { recursive: true });
await mkdir(tarballDir, { recursive: true });

function packageParts(name) {
  return name.startsWith('@') ? name.split('/') : [name];
}

function packagePath(base, name) {
  return path.join(base, 'node_modules', ...packageParts(name));
}

function lockPath(lockBase, name) {
  return [lockBase, 'node_modules', name].filter(Boolean).join('/');
}

function tarballPath(name, version) {
  return path.join(tarballDir, `${name.replace('/', '__')}-${version}.tgz`);
}

async function registryJson(name) {
  const response = await fetch(`${registry}/${name.replace('/', '%2f')}`);

  if (!response.ok) {
    throw new Error(`Could not fetch ${name}: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function download(url, destination) {
  if (existsSync(destination)) {
    return;
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Could not download ${url}: ${response.status} ${response.statusText}`);
  }

  await writeFile(destination, new Uint8Array(await response.arrayBuffer()));
}

function wantedVersion(metadata, range) {
  if (metadata.versions[range]) {
    return range;
  }

  const versions = Object.keys(metadata.versions).filter((version) => !metadata.versions[version].deprecated);
  const resolved = semver.maxSatisfying(versions, range, { includePrerelease: false });

  if (!resolved) {
    throw new Error(`Could not resolve ${metadata.name}@${range}`);
  }

  return resolved;
}

async function installedVersion(folder) {
  const manifest = path.join(folder, 'package.json');

  if (!existsSync(manifest)) {
    return null;
  }

  return JSON.parse(await readFile(manifest, 'utf8')).version;
}

async function findUsable(base, name, range) {
  let current = base;

  while (current.startsWith(root)) {
    const candidate = packagePath(current, name);
    const version = await installedVersion(candidate);

    if (version && semver.satisfies(version, range)) {
      return candidate;
    }

    const parent = path.dirname(current);

    if (parent === current) {
      break;
    }

    current = parent;
  }

  return null;
}

while (queue.length > 0) {
  const item = queue.shift();
  const metadata = await registryJson(item.name);
  const packageLockPath = lockPath(item.lockBase, item.name);
  const usable = await findUsable(item.base, item.name, item.range);
  const destination = usable ?? packagePath(item.base, item.name);
  const version = (await installedVersion(destination)) ?? wantedVersion(metadata, item.range);
  const key = `${packageLockPath}@${version}`;

  if (seen.has(key)) {
    continue;
  }

  seen.add(key);

  const versionInfo = metadata.versions[version];
  const tarball = tarballPath(item.name, version);

  if (!usable) {
    await mkdir(path.dirname(destination), { recursive: true });
    await download(versionInfo.dist.tarball, tarball);
  }

  if (!existsSync(path.join(destination, 'package.json'))) {
    await mkdir(destination, { recursive: true });
    execFileSync('tar', ['-xzf', tarball, '-C', destination, '--strip-components', '1'], {
      stdio: 'inherit',
    });
  }

  lockPackages[packageLockPath] = {
    version,
    resolved: versionInfo.dist.tarball,
    integrity: versionInfo.dist.integrity,
    dependencies: versionInfo.dependencies,
    optionalDependencies: versionInfo.optionalDependencies,
    bin: versionInfo.bin,
    engines: versionInfo.engines,
  };

  for (const [name, range] of Object.entries({
    ...(versionInfo.dependencies ?? {}),
    ...(versionInfo.optionalDependencies ?? {}),
  })) {
    queue.push({ name, range, base: destination, lockBase: packageLockPath });
  }

  console.log(`${usable ? 'found' : 'installed'} ${item.name}@${version}`);
}

const lock = {
  name: pkg.name,
  version: pkg.version,
  lockfileVersion: 3,
  requires: true,
  packages: lockPackages,
};

await writeFile(path.join(root, 'package-lock.json'), `${JSON.stringify(lock, null, 2)}\n`);

const binDir = path.join(nodeModules, '.bin');
await mkdir(binDir, { recursive: true });

for (const [command, target] of Object.entries({
  vite: '../vite/bin/vite.js',
  tailwindcss: '../tailwindcss/lib/cli.js',
})) {
  await writeFile(path.join(binDir, `${command}.cmd`), `@ECHO off\r\nnode "%~dp0\\${target}" %*\r\n`);
}
