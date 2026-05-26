import React from 'react';
import { Beaker, BrainCircuit, Bug, Calculator, CheckCircle2, ClipboardList, Code2, Compass, LayoutDashboard, Rocket, Search, Sparkles } from 'lucide-react';
import { icon, slug } from './shared.js';
const h = React.createElement;

export function Sidebar({ completedCount, totalLessons, subjectProgress, pilotFocus = false, foundationMode = false }) {
  const fullNavItems = [
    ['Dashboard', LayoutDashboard, '#dashboard', null],
    ['Foundation', Sparkles, '#foundation-mode', null],
    ['Pilot Test', ClipboardList, '#pilot-test', null],
    ['Curriculum Map', Compass, '#curriculum-map', null],
    ['Skill Graph', Sparkles, '#skill-graph', null],
    ['Karpathy Path', BrainCircuit, '#karpathy-path', null],
    ...subjectProgress.map((subject) => [subject.title, subject.icon, `#${slug(subject.title)}`, subject.total]),
    ['Review', ClipboardList, '#review', null],
    ['Labs', Beaker, '#labs', null],
    ['Data Playground', BrainCircuit, '#data-model-playground', null],
    ['Build Mode', Code2, '#build-mode', null],
    ['Debug Mode', Bug, '#debug-mode', null],
    ['Code Reading', Search, '#code-reading', null],
    ['Thinking Lab', Sparkles, '#thinking-lab', null],
    ['Projects', Rocket, '#projects', null],
    ['Daily Coach', BrainCircuit, '#daily-coach', null],
  ];
  const navItems = pilotFocus
    ? [
        ['Dashboard', LayoutDashboard, '#dashboard', null],
        ['Pilot Test', ClipboardList, '#pilot-test', null],
      ]
    : foundationMode
      ? [
          ['Dashboard', LayoutDashboard, '#dashboard', null],
          ['Foundation', Sparkles, '#foundation-mode', null],
          ['Math', Calculator, '#math', null],
          ['Labs', Beaker, '#labs', null],
          ['Build Mode', Code2, '#build-mode', null],
          ['Review', ClipboardList, '#review', null],
          ['Daily Coach', BrainCircuit, '#daily-coach', null],
        ]
    : fullNavItems;

  return h(
    'aside',
    { className: 'hidden w-72 shrink-0 border-r border-[#2a2a2a] bg-[#0d0d0d] px-5 py-6 lg:flex lg:flex-col' },
    h(
      'div',
      { className: 'mb-8 flex items-center gap-3' },
      h('div', { className: 'grid h-11 w-11 place-items-center bg-[#00ff88]' }, icon(Compass, { size: 23, className: 'text-[#0d0d0d]' })),
      h('div', null, h('p', { className: 'text-sm font-bold uppercase tracking-widest text-[#00ff88]' }, 'Triad'), h('h1', { className: 'text-xl font-bold leading-tight text-[#e0e0e0]' }, 'Academy')),
    ),
    h(
      'nav',
      { className: 'space-y-1' },
      navItems.map(([label, itemIcon, href, count]) =>
        h(
          'a',
          {
            className: 'group flex items-center gap-3 px-3 py-3 text-sm font-medium text-[#888888] transition hover:bg-[#1a1a1a] hover:text-[#e0e0e0]',
            href,
            key: label,
          },
          icon(itemIcon, { className: 'text-[#555555] transition group-hover:text-[#00ff88]' }),
          h('span', { className: 'flex-1' }, label),
          count ? h('span', { className: 'bg-[#1a1a1a] px-2 py-0.5 text-xs font-bold text-[#555555]' }, count) : null,
        ),
      ),
    ),
    pilotFocus ? h('p', { className: 'mt-4 border border-[#1a2e22] bg-[#0d1a12] p-3 text-xs font-semibold leading-5 text-[#00ff88]' }, 'Pilot focus mode is active. Finish the guided session before returning to the full menu.') : null,
    h(
      'div',
      { className: 'mt-auto border border-[#2a2a2a] bg-[#111111] p-4' },
      h('div', { className: 'mb-3 flex items-center gap-2 text-sm font-semibold text-[#e0e0e0]' }, icon(CheckCircle2, { className: 'text-[#00ff88]' }), 'Progress'),
      h('p', { className: 'text-sm leading-6 text-[#888888]' }, `${completedCount} of ${totalLessons} lessons complete. Your answers and explanations stay in this browser.`),
    ),
  );
}

export function MobileNav({ subjectProgress, pilotFocus = false, foundationMode = false }) {
  const fullItems = [
    ['Dashboard', '#dashboard'],
    ['Foundation', '#foundation-mode'],
    ['Pilot', '#pilot-test'],
    ['Map', '#curriculum-map'],
    ['Skills', '#skill-graph'],
    ['Karpathy', '#karpathy-path'],
    ...subjectProgress.map((subject) => [subject.title, `#${slug(subject.title)}`]),
    ['Review', '#review'],
    ['Labs', '#labs'],
    ['Data', '#data-model-playground'],
    ['Build', '#build-mode'],
    ['Debug', '#debug-mode'],
    ['Read', '#code-reading'],
    ['Thinking', '#thinking-lab'],
    ['Coach', '#daily-coach'],
  ];
  const items = pilotFocus
    ? [
        ['Dashboard', '#dashboard'],
        ['Pilot', '#pilot-test'],
      ]
    : foundationMode
      ? [
          ['Dashboard', '#dashboard'],
          ['Foundation', '#foundation-mode'],
          ['Math', '#math'],
          ['Labs', '#labs'],
          ['Build', '#build-mode'],
          ['Review', '#review'],
          ['Coach', '#daily-coach'],
        ]
    : fullItems;

  return h(
    'nav',
    { className: 'flex gap-2 overflow-x-auto pb-1 lg:hidden' },
    items.map(([label, href]) =>
      h(
        'a',
        {
          className: 'shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700',
          href,
          key: label,
        },
        label,
      ),
    ),
  );
}