import React, { useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronRight } from 'lucide-react';
import { karpathyMilestones, karpathyPhases, nextKarpathyMilestone } from '../karpathyPath.js';
import { icon, Pill, StepList, ReinforcementPanel } from './shared.js';
import { PlanRow } from './DailyCoach.js';
import { statusLabel, CodeRunner, completionItems, CompletionChecklist } from './BuildMode.js';
import { SvgFrame } from './Labs.js';

const h = React.createElement;

export function ResourceLinkList({ title, items, getHref, getLabel }) {
  return h(
    'div',
    { className: 'rounded-lg bg-slate-50 p-3' },
    h('p', { className: 'text-xs font-bold uppercase tracking-wide text-slate-500' }, title),
    items?.length
      ? h(
          'div',
          { className: 'mt-2 flex flex-wrap gap-2' },
          items.map((item) =>
            h(
              'a',
              { className: 'rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100', href: getHref(item), key: typeof item === 'string' ? item : item.title },
              getLabel(item),
            ),
          ),
        )
      : h('p', { className: 'mt-2 text-sm text-slate-500' }, 'No linked resources yet.'),
  );
}

export function MilestoneVisualization({ visualization }) {
  if (!visualization) return null;

  if (visualization.type === 'graph') {
    const nodes = visualization.nodes || [];
    return h(
      'div',
      { className: 'rounded-lg border border-slate-200 bg-white p-4' },
      h('h5', { className: 'text-sm font-bold uppercase tracking-wide text-slate-500' }, 'Output visualization'),
      h(
        'div',
        { className: 'mt-3 flex flex-wrap items-center gap-2 text-sm' },
        nodes.map((node, index) =>
          h(
            React.Fragment,
            { key: `${node}-${index}` },
            h('span', { className: 'rounded-lg bg-blue-50 px-3 py-2 font-bold text-blue-800' }, node),
            index < nodes.length - 1 ? h('span', { className: 'font-bold text-slate-400' }, '->') : null,
          ),
        ),
      ),
      visualization.edges?.length ? h('p', { className: 'mt-3 text-sm leading-6 text-slate-600' }, `Edges: ${visualization.edges.join(', ')}`) : null,
    );
  }

  if (visualization.type === 'scatter') {
    const points = visualization.points || [];
    const toX = (x) => 210 + x * 75;
    const toY = (y) => 130 - y * 75;
    return h(
      'div',
      { className: 'rounded-lg border border-slate-200 bg-white p-4' },
      h('h5', { className: 'text-sm font-bold uppercase tracking-wide text-slate-500' }, 'Output visualization'),
      h(
        SvgFrame,
        null,
        h('line', { x1: 30, y1: 130, x2: 390, y2: 130, stroke: '#cbd5e1', strokeWidth: 1.5 }),
        h('line', { x1: 210, y1: 30, x2: 210, y2: 230, stroke: '#cbd5e1', strokeWidth: 1.5 }),
        points.map(([label, x, y]) =>
          h(
            'g',
            { key: label },
            h('circle', { cx: toX(x), cy: toY(y), r: 7, fill: '#2156a3' }),
            h('text', { x: toX(x) + 10, y: toY(y) + 4, fill: '#334155', fontSize: 12 }, label),
          ),
        ),
      ),
    );
  }

  if (visualization.type === 'heatmap') {
    return h(
      'div',
      { className: 'rounded-lg border border-slate-200 bg-white p-4' },
      h('h5', { className: 'text-sm font-bold uppercase tracking-wide text-slate-500' }, 'Output visualization'),
      h(
        'div',
        { className: 'mt-3 grid grid-cols-2 gap-2' },
        (visualization.labels || []).map((label, index) => h('div', { className: `rounded-lg p-4 text-center text-sm font-bold ${index === 0 ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-900'}`, key: label }, label)),
      ),
    );
  }

  return h(
    'div',
    { className: 'rounded-lg border border-slate-200 bg-white p-4' },
    h('h5', { className: 'text-sm font-bold uppercase tracking-wide text-slate-500' }, 'Output visualization'),
    h('div', { className: 'mt-3 flex flex-wrap gap-2' }, (visualization.labels || []).map((label) => h('span', { className: 'rounded-lg bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700', key: label }, label))),
  );
}

export function MilestoneCard({ milestone, saved, updateKarpathyMilestone }) {
  const [open, setOpen] = useState(false);
  const state = { status: 'not-started', reflection: '', notes: '', code: milestone.starterCode || '', lastResult: null, ...(saved || {}) };
  const complete = state.status === 'complete';
  const passed = state.lastResult?.testResults?.filter((test) => test.passed).length || 0;
  const total = milestone.testCases?.length || 0;
  const allPassed = total > 0 && passed === total;
  const codeEdited = (state.code || '') !== (milestone.starterCode || '');
  const reflectionReady = Boolean(state.reflection?.trim());
  const milestoneChecklist = completionItems([
    ['Edit the starter code', codeEdited],
    ['Make all tests pass', allPassed],
    ['Write the milestone reflection', reflectionReady],
  ]);
  const milestoneReady = milestoneChecklist.every((item) => item.done);

  return h(
    'article',
    { className: 'scroll-mt-24 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm', id: milestone.id },
    h(
      'button',
      {
        className: 'flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition hover:bg-slate-50',
        onClick: () => setOpen((value) => !value),
      },
      h(
        'div',
        null,
        h('div', { className: 'mb-2 flex flex-wrap gap-2' }, h(Pill, { tone: complete ? 'green' : state.status === 'in-progress' ? 'amber' : 'slate' }, statusLabel(state.status)), h(Pill, { tone: 'blue' }, 'Executable project'), h(Pill, { tone: allPassed ? 'green' : 'slate' }, total ? `${passed}/${total} tests` : 'No tests')),
        h('h4', { className: 'font-bold text-ink' }, milestone.title),
        h('p', { className: 'mt-1 text-sm leading-6 text-slate-600' }, milestone.whyItMatters),
      ),
      icon(open ? ChevronDown : ChevronRight, { className: 'shrink-0 text-slate-500' }),
    ),
    open
      ? h(
          'div',
          { className: 'space-y-4 border-t border-slate-200 px-4 py-4' },
          h(PlanRow, { label: 'Concepts required' }, milestone.conceptsRequired.join(', ')),
          h(PlanRow, { label: 'Build steps' }, h(StepList, { items: milestone.buildSteps })),
          h(PlanRow, { label: 'Success criteria' }, h(StepList, { items: milestone.successCriteria })),
          h(PlanRow, { label: 'Stretch goal' }, milestone.stretchGoal),
          milestone.dataset ? h(PlanRow, { label: 'Dataset / project context' }, milestone.dataset) : null,
          milestone.starterCode
            ? h(CodeRunner, {
                challenge: milestone,
                code: state.code || milestone.starterCode,
                title: 'Milestone Coding Environment',
                description: 'Run the scaffold, make one focused improvement, test it, and iterate until the project behavior matches the milestone.',
                codeEdited,
                initialResult: state.lastResult,
                returnPrompt: 'What should this milestone function or scaffold produce?',
                onCodeChange: (code) => updateKarpathyMilestone(milestone.id, { code }),
                onResetCode: () => updateKarpathyMilestone(milestone.id, { code: milestone.starterCode, lastResult: null, status: 'not-started' }),
                onResult: (result) => updateKarpathyMilestone(milestone.id, { lastResult: result, lastRunAt: new Date().toISOString() }),
              })
            : null,
          h(MilestoneVisualization, { visualization: milestone.visualization }),
          milestone.debugScenarios?.length
            ? h(
                'section',
                { className: 'rounded-lg border border-amber-100 bg-amber-50 p-4' },
                h('h5', { className: 'text-sm font-bold uppercase tracking-wide text-amber-800' }, 'Debug scenarios'),
                h('div', { className: 'mt-3 space-y-2' }, milestone.debugScenarios.map((scenario) => h('p', { className: 'rounded-lg bg-white p-3 text-sm leading-6 text-amber-950', key: scenario }, scenario))),
              )
            : null,
          h(
            'section',
            { className: 'rounded-lg border border-slate-200 p-4' },
            h('label', { className: 'text-sm font-bold uppercase tracking-wide text-slate-500' }, 'Milestone notes'),
            h('textarea', {
              className: 'mt-3 min-h-20 w-full resize-y rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-ink outline-none transition focus:border-cobalt focus:bg-white focus:ring-2 focus:ring-blue-100',
              placeholder: 'Track design choices, failed attempts, and what you learned.',
              value: state.notes || '',
              onChange: (event) => updateKarpathyMilestone(milestone.id, { notes: event.target.value }),
            }),
            h('label', { className: 'mt-4 block text-sm font-bold uppercase tracking-wide text-slate-500' }, 'Reflection prompt'),
            h('p', { className: 'mt-2 text-sm leading-6 text-slate-700' }, milestone.reflectionPrompt),
            h('textarea', {
              className: 'mt-3 min-h-20 w-full resize-y rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-ink outline-none transition focus:border-cobalt focus:bg-white focus:ring-2 focus:ring-blue-100',
              placeholder: 'Answer the reflection after you have a working or partially working build.',
              value: state.reflection || '',
              onChange: (event) => updateKarpathyMilestone(milestone.id, { reflection: event.target.value }),
            }),
          ),
          h(CompletionChecklist, { title: 'Before completing this milestone', items: milestoneChecklist }),
          h(
            'button',
            {
              className: `inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold text-white shadow-soft transition ${
                complete ? 'bg-fern hover:bg-emerald-800' : milestoneReady ? 'bg-cobalt hover:bg-blue-800' : 'cursor-not-allowed bg-slate-300'
              }`,
              disabled: !complete && !milestoneReady,
              onClick: () => {
                if (complete || milestoneReady) updateKarpathyMilestone(milestone.id, { status: complete ? 'in-progress' : 'complete' });
              },
            },
            icon(CheckCircle2),
            complete ? 'Completed' : 'Mark milestone complete',
          ),
          complete ? h(ReinforcementPanel, { kind: 'karpathy', item: milestone }) : null,
        )
      : null,
  );
}

export function KarpathyPath({ karpathyProgress, updateKarpathyMilestone }) {
  const completed = karpathyMilestones.filter((milestone) => karpathyProgress[milestone.id]?.status === 'complete').length;
  const nextMilestone = nextKarpathyMilestone(karpathyProgress);
  const milestoneById = Object.fromEntries(karpathyMilestones.map((milestone) => [milestone.id, milestone]));

  return h(
    'section',
    { className: 'space-y-4 scroll-mt-6', id: 'karpathy-path' },
    h(
      'div',
      { className: 'rounded-lg border border-slate-200 bg-white p-5 shadow-sm' },
      h('p', { className: 'text-sm font-semibold uppercase tracking-wide text-fern' }, 'Karpathy Path'),
      h('h2', { className: 'mt-1 text-2xl font-bold' }, 'Neural Networks From Scratch'),
      h('p', { className: 'mt-3 max-w-3xl text-sm leading-7 text-slate-700' }, 'A first-principles pathway for building neural networks by hand: math, computational graphs, gradient descent, neural nets, language models, and transformers. Each phase links back into Triad Academy lessons and practice modes.'),
      h('div', { className: 'mt-4 flex flex-wrap gap-2' }, h(Pill, { tone: completed === karpathyMilestones.length ? 'green' : 'blue' }, `${completed}/${karpathyMilestones.length} milestones complete`), nextMilestone ? h(Pill, { tone: 'amber' }, `Next: ${nextMilestone.title}`) : h(Pill, { tone: 'green' }, 'Path complete')),
    ),
    h(
      'div',
      { className: 'space-y-4' },
      karpathyPhases.map((phase, index) => {
        const phaseMilestones = phase.milestoneIds.map((id) => milestoneById[id]).filter(Boolean);
        const phaseCompleted = phaseMilestones.filter((milestone) => karpathyProgress[milestone.id]?.status === 'complete').length;

        return h(
          'article',
          { className: 'rounded-lg border border-slate-200 bg-white p-5 shadow-sm', key: phase.id },
          h('div', { className: 'mb-3 flex flex-wrap items-center gap-2' }, h(Pill, { tone: 'blue' }, `Phase ${index + 1}`), h(Pill, { tone: phaseCompleted === phaseMilestones.length ? 'green' : 'slate' }, `${phaseCompleted}/${phaseMilestones.length} milestones`)),
          h('h3', { className: 'text-xl font-bold text-ink' }, phase.title),
          h('p', { className: 'mt-2 text-sm leading-7 text-slate-700' }, phase.goal),
          h('div', { className: 'mt-4' }, h(PlanRow, { label: 'Prerequisite skills' }, phase.prerequisiteSkills.join(', '))),
          h(
            'div',
            { className: 'mt-4 grid gap-3 lg:grid-cols-2' },
            h(ResourceLinkList, { title: 'Existing lessons', items: phase.lessonIds, getHref: (id) => `#${id}`, getLabel: (id) => id.replace(/^[a-z]+-/, '').replaceAll('-', ' ') }),
            h(ResourceLinkList, { title: 'Labs and playgrounds', items: phase.labs, getHref: (item) => item.href, getLabel: (item) => item.title }),
            h(ResourceLinkList, { title: 'Build challenges', items: phase.buildChallengeIds, getHref: (id) => `#${id}`, getLabel: (id) => id.replace('build-', '').replaceAll('-', ' ') }),
            h(ResourceLinkList, { title: 'Debug challenges', items: phase.debugChallengeIds, getHref: (id) => `#${id}`, getLabel: (id) => id.replace('debug-', '').replaceAll('-', ' ') }),
            h(ResourceLinkList, { title: 'Code reading challenges', items: phase.codeReadingChallengeIds, getHref: (id) => `#${id}`, getLabel: (id) => id.replace('read-', '').replaceAll('-', ' ') }),
          ),
          h('div', { className: 'mt-4 space-y-3' }, phaseMilestones.map((milestone) => h(MilestoneCard, { milestone, saved: karpathyProgress[milestone.id], updateKarpathyMilestone, key: milestone.id }))),
        );
      }),
    ),
  );
}

