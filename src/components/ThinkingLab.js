import React, { useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronRight } from 'lucide-react';
import { thinkingChallenges } from '../thinkingChallenges.js';
import { icon, Pill } from './shared.js';
import { PlanRow } from './DailyCoach.js';

const h = React.createElement;

export function ThinkingChallengeCard({ challenge, saved, updateThinking }) {
  const [open, setOpen] = useState(false);
  const state = saved || { attempt: '', revealed: false, reflection: '', complete: false };
  const attempted = Boolean(state.attempt.trim());
  const reflected = Boolean(state.reflection.trim());

  return h(
    'article',
    { className: 'scroll-mt-24 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm', id: challenge.id },
    h(
      'button',
      {
        className: 'flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-50',
        onClick: () => setOpen((value) => !value),
      },
      h(
        'div',
        { className: 'min-w-0' },
        h('div', { className: 'mb-2 flex flex-wrap gap-2' }, h(Pill, { tone: state.complete ? 'green' : attempted ? 'amber' : 'slate' }, state.complete ? 'Complete' : attempted ? 'In Progress' : 'Not Started'), h(Pill, { tone: 'blue' }, challenge.type), h(Pill, { tone: 'slate' }, challenge.difficulty)),
        h('h3', { className: 'text-lg font-bold text-ink' }, challenge.title),
      ),
      icon(open ? ChevronDown : ChevronRight, { className: 'shrink-0 text-slate-500' }),
    ),
    open
      ? h(
          'div',
          { className: 'space-y-4 border-t border-slate-200 px-5 py-5' },
          h(PlanRow, { label: 'Problem statement' }, challenge.problem),
          h(
            'section',
            { className: 'rounded-lg border border-slate-200 p-4' },
            h('label', { className: 'text-sm font-bold uppercase tracking-wide text-slate-500' }, 'Your attempt'),
            h('textarea', {
              className: 'mt-3 min-h-28 w-full resize-y rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-ink outline-none transition focus:border-cobalt focus:bg-white focus:ring-2 focus:ring-blue-100',
              placeholder: 'Try the puzzle, explain your pattern, or describe your reasoning before revealing the answer.',
              value: state.attempt,
              onChange: (event) => updateThinking(challenge.id, { attempt: event.target.value }),
            }),
            h(
              'button',
              {
                className: `mt-3 rounded-lg px-3 py-2 text-sm font-bold text-white transition ${attempted ? 'bg-cobalt hover:bg-blue-800' : 'cursor-not-allowed bg-slate-300'}`,
                disabled: !attempted,
                onClick: () => updateThinking(challenge.id, { revealed: true }),
              },
              state.revealed ? 'Solution shown' : 'Reveal solution',
            ),
          ),
          state.revealed
            ? h(
                'section',
                { className: 'space-y-3 rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-sm leading-7 text-emerald-950' },
                h('h4', { className: 'text-sm font-bold uppercase tracking-wide text-emerald-800' }, 'Solution'),
                h('p', null, challenge.solution),
                h('h4', { className: 'text-sm font-bold uppercase tracking-wide text-emerald-800' }, 'Reasoning'),
                h('p', null, challenge.reasoning),
                h('label', { className: 'block text-sm font-bold text-emerald-900' }, 'What did this teach you?'),
                h('textarea', {
                  className: 'min-h-20 w-full resize-y rounded-lg border border-emerald-200 bg-white p-3 text-sm leading-6 text-ink outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100',
                  placeholder: 'Name the clue, assumption, or strategy you will remember.',
                  value: state.reflection,
                  onChange: (event) => updateThinking(challenge.id, { reflection: event.target.value }),
                }),
              )
            : null,
          h(
            'button',
            {
              className: `inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold text-white shadow-soft transition ${
                state.complete ? 'bg-fern hover:bg-emerald-800' : 'bg-cobalt hover:bg-blue-800'
              }`,
              onClick: () => updateThinking(challenge.id, { complete: !state.complete }),
            },
            icon(CheckCircle2),
            state.complete ? 'Completed' : reflected ? 'Mark complete' : 'Mark complete',
          ),
        )
      : null,
  );
}

export function ThinkingLab({ thinkingState, updateThinking }) {
  const completed = thinkingChallenges.filter((challenge) => thinkingState[challenge.id]?.complete).length;

  return h(
    'section',
    { className: 'space-y-4 scroll-mt-6', id: 'thinking-lab' },
    h(
      'div',
      { className: 'rounded-lg border border-slate-200 bg-white p-5 shadow-sm' },
      h('p', { className: 'text-sm font-semibold uppercase tracking-wide text-fern' }, 'Thinking Lab'),
      h('h2', { className: 'mt-1 text-2xl font-bold' }, 'Practice logic, creativity, and judgment'),
      h('p', { className: 'mt-3 max-w-3xl text-sm leading-7 text-slate-700' }, 'These challenges make thinking visible: predict, try, reveal, then explain the reasoning. They are small on purpose, but each one trains a useful mental move.'),
      h('div', { className: 'mt-4' }, h(Pill, { tone: completed === thinkingChallenges.length ? 'green' : 'blue' }, `${completed}/${thinkingChallenges.length} complete`)),
    ),
    h('div', { className: 'space-y-4' }, thinkingChallenges.map((challenge) => h(ThinkingChallengeCard, { challenge, saved: thinkingState[challenge.id], updateThinking, key: challenge.id }))),
  );
}

