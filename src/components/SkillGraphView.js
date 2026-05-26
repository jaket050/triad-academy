import React from 'react';
import { icon, Pill } from './shared.js';
const h = React.createElement;

export function SkillGraph({ skillLevels, weakSkill, adaptiveLesson }) {
  const byId = Object.fromEntries(skillLevels.map((skill) => [skill.id, skill]));
  const weakAreas = [...skillLevels].filter((skill) => skill.weak).sort((a, b) => a.score - b.score).slice(0, 6);

  function nodeColor(skill) {
    if (!skill.unlocked) return '#cbd5e1';
    if (skill.weak) return '#f97316';
    if (skill.developing) return '#2563eb';
    if (skill.strong) return '#059669';
    return '#64748b';
  }

  return h(
    'section',
    { className: 'space-y-4 scroll-mt-6', id: 'skill-graph' },
    h(
      'div',
      { className: 'rounded-lg border border-slate-200 bg-white p-5 shadow-sm' },
      h('p', { className: 'text-sm font-semibold uppercase tracking-wide text-fern' }, 'Skill Graph'),
      h('h2', { className: 'mt-1 text-2xl font-bold' }, 'See how skills depend on each other'),
      h('p', { className: 'mt-3 max-w-3xl text-sm leading-7 text-slate-700' }, 'The graph estimates skill levels from quiz results, lesson completions, explanations, labs, Build Mode grades, code attempts, and solve-before-reveal reflections. Orange nodes are weak unlocked areas to revisit.'),
      weakSkill
        ? h(
            'div',
            { className: 'mt-4 rounded-lg border border-amber-100 bg-amber-50 p-4 text-sm leading-6 text-amber-950' },
            h('p', { className: 'font-bold' }, `Adaptive focus: ${weakSkill.label}`),
            h('p', null, adaptiveLesson ? `Recommended lesson: ${adaptiveLesson.subjectTitle}: ${adaptiveLesson.title}` : 'Practice this skill through a connected lab, build challenge, or review item.'),
          )
        : null,
    ),
    h(
      'div',
      { className: 'overflow-x-auto rounded-lg border border-slate-200 bg-white p-4 shadow-sm' },
      h(
        'svg',
        { role: 'img', style: { width: '980px', height: '530px' }, viewBox: '0 0 930 500' },
        skillLevels.flatMap((skill) =>
          skill.dependsOn.map((dependencyId) => {
            const dependency = byId[dependencyId];
            if (!dependency) return null;
            return h('line', {
              key: `${dependencyId}-${skill.id}`,
              x1: dependency.x,
              y1: dependency.y,
              x2: skill.x,
              y2: skill.y,
              stroke: '#cbd5e1',
              strokeWidth: 2,
            });
          }),
        ),
        skillLevels.map((skill) =>
          h(
            'g',
            { key: skill.id },
            h('circle', { cx: skill.x, cy: skill.y, r: 28, fill: nodeColor(skill), opacity: skill.unlocked ? 1 : 0.6 }),
            h('text', { x: skill.x, y: skill.y + 5, textAnchor: 'middle', className: 'fill-white text-xs font-bold' }, skill.score),
            h('text', { x: skill.x, y: skill.y + 45, textAnchor: 'middle', className: 'fill-slate-700 text-xs font-bold' }, skill.label),
          ),
        ),
      ),
    ),
    h(
      'div',
      { className: 'grid gap-4 lg:grid-cols-2' },
      h(
        'div',
        { className: 'rounded-lg border border-slate-200 bg-white p-5 shadow-sm' },
        h('h3', { className: 'text-sm font-bold uppercase tracking-wide text-slate-500' }, 'Weak areas'),
        weakAreas.length
          ? h(
              'div',
              { className: 'mt-3 space-y-2' },
              weakAreas.map((skill) =>
                h(
                  'div',
                  { className: 'rounded-lg bg-amber-50 p-3 text-sm leading-6 text-amber-950', key: skill.id },
                  h('p', { className: 'font-bold' }, `${skill.label}: ${skill.score}/100`),
                  h('p', null, `Depends on: ${skill.dependsOnLabels.length ? skill.dependsOnLabels.join(', ') : 'none'}`),
                ),
              ),
            )
          : h('p', { className: 'mt-3 text-sm leading-6 text-slate-600' }, 'No weak unlocked skills yet. As you answer quizzes, reflect on labs, and complete builds, this section becomes more specific.'),
      ),
      h(
        'div',
        { className: 'rounded-lg border border-slate-200 bg-white p-5 shadow-sm' },
        h('h3', { className: 'text-sm font-bold uppercase tracking-wide text-slate-500' }, 'Skill levels'),
        h(
          'div',
          { className: 'mt-3 grid gap-2 sm:grid-cols-2' },
          skillLevels.map((skill) =>
            h(
              'div',
              { className: 'rounded-lg bg-slate-50 p-3', key: skill.id },
              h('div', { className: 'flex items-center justify-between gap-2' }, h('p', { className: 'text-sm font-bold text-ink' }, skill.label), h(Pill, { tone: skill.weak ? 'amber' : skill.strong ? 'green' : 'blue' }, `${skill.score}`)),
              h('div', { className: 'mt-2 h-2 overflow-hidden rounded-full bg-slate-200' }, h('div', { className: 'h-full rounded-full', style: { width: `${skill.score}%`, backgroundColor: nodeColor(skill) } })),
            ),
          ),
        ),
      ),
    ),
  );
}
