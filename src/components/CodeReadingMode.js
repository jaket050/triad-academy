import React, { useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronRight } from 'lucide-react';
import { codeReadingChallenges } from '../codeReadingChallenges.js';
import { icon, Pill, SelfGradeButtons, FilterSelect, ReinforcementPanel } from './shared.js';
import { PlanRow } from './DailyCoach.js';
import { hasText, completionItems, CompletionChecklist } from './BuildMode.js';
import { EmptyLessonsState } from './LessonCard.js';

const h = React.createElement;

export function CodeReadingChallengeCard({ challenge, saved, updateCodeReadingChallenge }) {
  const [open, setOpen] = useState(false);
  const state = {
    answer: '',
    explanation: '',
    outputRevealed: false,
    annotationsShown: false,
    predictionResult: '',
    status: 'not-started',
    ...(saved || {}),
  };
  const complete = state.status === 'complete';
  const attempted = Boolean(state.answer.trim());
  const lines = challenge.code.split('\n');
  const explanationReady = hasText(state.explanation);
  const readingChecklist = completionItems([
    ['Write a prediction before revealing output', attempted],
    ['Reveal the output/result', state.outputRevealed],
    ['Explain the snippet in your own words with at least 40 characters', explanationReady],
  ]);
  const readingReady = readingChecklist.every((item) => item.done);

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
        h(
          'div',
          { className: 'mb-2 flex flex-wrap gap-2' },
          h(Pill, { tone: complete ? 'green' : attempted ? 'amber' : 'slate' }, complete ? 'Complete' : attempted ? 'In Progress' : 'Not Started'),
          h(Pill, { tone: 'blue' }, challenge.category),
          h(Pill, { tone: state.predictionResult === 'incorrect' ? 'amber' : 'slate' }, challenge.difficulty),
        ),
        h('h3', { className: 'text-lg font-bold text-ink' }, challenge.title),
        h('p', { className: 'mt-1 text-sm leading-6 text-slate-600' }, challenge.context),
      ),
      icon(open ? ChevronDown : ChevronRight, { className: 'shrink-0 text-slate-500' }),
    ),
    open
      ? h(
          'div',
          { className: 'space-y-4 border-t border-slate-200 px-5 py-5' },
          h(PlanRow, { label: 'Plain-English context' }, challenge.context),
          h(
            'section',
            { className: 'rounded-lg border border-slate-200 bg-slate-950 p-4 text-white' },
            h(
              'div',
              { className: 'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between' },
              h('div', null, h('h4', { className: 'text-sm font-bold uppercase tracking-wide text-slate-300' }, 'Code snippet'), h('p', { className: 'mt-1 text-sm leading-6 text-slate-300' }, 'Read slowly. Track values, branches, loops, and return points.')),
              h(
                'button',
                {
                  className: 'rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm font-bold text-slate-100 transition hover:bg-slate-800',
                  onClick: () => updateCodeReadingChallenge(challenge.id, { annotationsShown: !state.annotationsShown }),
                },
                state.annotationsShown ? 'Hide annotations' : 'Show line annotations',
              ),
            ),
            h(
              'div',
              { className: 'mt-4 overflow-x-auto rounded-lg border border-slate-700 bg-slate-900 font-mono text-sm leading-6' },
              lines.map((line, index) =>
                h(
                  'div',
                  { className: 'grid grid-cols-[3rem_1fr] border-b border-slate-800 last:border-b-0', key: `${challenge.id}-line-${index}` },
                  h('span', { className: 'select-none bg-slate-950 px-3 py-2 text-right text-slate-500' }, index + 1),
                  h(
                    'div',
                    { className: 'px-3 py-2' },
                    h('code', { className: 'whitespace-pre text-emerald-50' }, line || ' '),
                    state.annotationsShown
                      ? h('p', { className: 'mt-1 whitespace-normal font-sans text-xs leading-5 text-blue-200' }, challenge.annotations[index] || 'This line supports the surrounding control flow.')
                      : null,
                  ),
                ),
              ),
            ),
          ),
          h(
            'section',
            { className: 'rounded-lg border border-blue-100 bg-blue-50 p-4' },
            h('h4', { className: 'text-sm font-bold uppercase tracking-wide text-blue-700' }, 'Prediction question'),
            h('p', { className: 'mt-2 text-sm font-semibold leading-6 text-blue-950' }, `${challenge.predictionPrompt} What will this output/do?`),
            h('textarea', {
              className: 'mt-3 min-h-24 w-full resize-y rounded-lg border border-blue-200 bg-white p-3 text-sm leading-6 text-ink outline-none transition focus:border-cobalt focus:ring-2 focus:ring-blue-100',
              placeholder: 'Predict the output or behavior before revealing the result.',
              value: state.answer,
              onChange: (event) => updateCodeReadingChallenge(challenge.id, { answer: event.target.value }),
            }),
            h(
              'button',
              {
                className: `mt-3 rounded-lg px-3 py-2 text-sm font-bold text-white transition ${attempted ? 'bg-cobalt hover:bg-blue-800' : 'cursor-not-allowed bg-slate-300'}`,
                disabled: !attempted,
                onClick: () => updateCodeReadingChallenge(challenge.id, { outputRevealed: true }),
              },
              state.outputRevealed ? 'Result revealed' : 'Reveal output/result',
            ),
          ),
          state.outputRevealed
            ? h(
                'section',
                { className: 'space-y-4 rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-sm leading-7 text-emerald-950' },
                h('div', null, h('h4', { className: 'text-sm font-bold uppercase tracking-wide text-emerald-800' }, 'Output / result'), h('p', { className: 'mt-2 rounded-lg bg-white p-3 font-mono text-emerald-950' }, challenge.output)),
                h('div', null, h('h4', { className: 'text-sm font-bold uppercase tracking-wide text-emerald-800' }, 'Control flow'), h('p', { className: 'mt-2' }, challenge.controlFlow)),
                h('div', null, h('h4', { className: 'text-sm font-bold uppercase tracking-wide text-emerald-800' }, 'Check your prediction'), h('p', { className: 'mt-2' }, challenge.expectedIdea), h(SelfGradeButtons, { value: state.predictionResult, onChange: (predictionResult) => updateCodeReadingChallenge(challenge.id, { predictionResult }) })),
              )
            : null,
          h(
            'section',
            { className: 'rounded-lg border border-slate-200 p-4' },
            h('label', { className: 'text-sm font-bold uppercase tracking-wide text-slate-500' }, 'Explain this in your own words'),
            h('textarea', {
              className: 'mt-3 min-h-24 w-full resize-y rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-ink outline-none transition focus:border-cobalt focus:bg-white focus:ring-2 focus:ring-blue-100',
              placeholder: 'Explain the values, branch, loop, or return path as if teaching someone else.',
              value: state.explanation,
              onChange: (event) => updateCodeReadingChallenge(challenge.id, { explanation: event.target.value }),
            }),
          ),
          h(
            'button',
            {
              className: `inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold text-white shadow-soft transition ${
                complete ? 'bg-fern hover:bg-emerald-800' : readingReady ? 'bg-cobalt hover:bg-blue-800' : 'cursor-not-allowed bg-slate-300'
              }`,
              disabled: !complete && !readingReady,
              onClick: () => {
                if (complete || readingReady) updateCodeReadingChallenge(challenge.id, { status: complete ? 'in-progress' : 'complete' });
              },
            },
            icon(CheckCircle2),
            complete ? 'Completed' : 'Mark complete',
          ),
          h(CompletionChecklist, { items: readingChecklist }),
          complete ? h(ReinforcementPanel, { kind: 'code-reading', item: challenge }) : null,
        )
      : null,
  );
}

export function CodeReadingMode({ codeReadingState, updateCodeReadingChallenge }) {
  const [filters, setFilters] = useState({ category: 'All', status: 'All' });
  const categories = ['All', ...new Set(codeReadingChallenges.map((challenge) => challenge.category))];
  const visible = codeReadingChallenges.filter((challenge) => {
    const status = codeReadingState[challenge.id]?.status || 'not-started';
    return (filters.category === 'All' || challenge.category === filters.category) && (filters.status === 'All' || status === filters.status);
  });
  const completed = codeReadingChallenges.filter((challenge) => codeReadingState[challenge.id]?.status === 'complete').length;

  return h(
    'section',
    { className: 'space-y-4 scroll-mt-6', id: 'code-reading' },
    h(
      'div',
      { className: 'rounded-lg border border-slate-200 bg-white p-5 shadow-sm' },
      h('p', { className: 'text-sm font-semibold uppercase tracking-wide text-fern' }, 'Code Reading'),
      h('h2', { className: 'mt-1 text-2xl font-bold' }, 'Read code like an engineer'),
      h('p', { className: 'mt-3 max-w-3xl text-sm leading-7 text-slate-700' }, 'Practice tracing code before running it. Predict the result, reveal the output, study the control flow, then explain the snippet in your own words.'),
      h('div', { className: 'mt-4' }, h(Pill, { tone: completed === codeReadingChallenges.length ? 'green' : 'blue' }, `${completed}/${codeReadingChallenges.length} reading challenges complete`)),
      h(
        'div',
        { className: 'mt-5 grid gap-3 sm:grid-cols-2' },
        h(FilterSelect, { label: 'Category', value: filters.category, options: categories, onChange: (value) => setFilters((current) => ({ ...current, category: value })) }),
        h(FilterSelect, { label: 'Status', value: filters.status, options: [['All', 'All'], ['not-started', 'Not Started'], ['in-progress', 'In Progress'], ['complete', 'Complete']], onChange: (value) => setFilters((current) => ({ ...current, status: value })) }),
      ),
    ),
    visible.length
      ? h('div', { className: 'space-y-4' }, visible.map((challenge) => h(CodeReadingChallengeCard, { challenge, saved: codeReadingState[challenge.id], updateCodeReadingChallenge, key: challenge.id })))
      : h(EmptyLessonsState, { message: 'No code reading challenges match the current filters.' }),
  );
}

