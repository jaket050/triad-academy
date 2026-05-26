import React, { useState } from 'react';
import { Bug, CheckCircle2, ChevronDown, ChevronRight } from 'lucide-react';
import { debugChallenges } from '../debugChallenges.js';
import { icon, Pill, FilterSelect, ReinforcementPanel } from './shared.js';
import { PlanRow } from './DailyCoach.js';
import { hasText, CodeRunner, completionItems, CompletionChecklist } from './BuildMode.js';
import { EmptyLessonsState } from './LessonCard.js';

const h = React.createElement;

export function DebugChallengeCard({ challenge, saved, updateDebugChallenge }) {
  const [open, setOpen] = useState(false);
  const state = {
    code: challenge.brokenCode,
    explanation: '',
    hintLevel: 0,
    modelExplanationViewed: false,
    status: 'not-started',
    lastResult: null,
    ...(saved || {}),
  };
  const complete = state.status === 'complete';
  const codeEdited = state.code !== challenge.brokenCode;
  const attempted = Boolean(state.lastResult || state.explanation.trim() || codeEdited);
  const passed = state.lastResult?.testResults?.filter((test) => test.passed).length || 0;
  const total = challenge.testCases.length;
  const allPassed = total > 0 && passed === total;
  const visibleHints = challenge.hints.slice(0, state.hintLevel);
  const explanationReady = hasText(state.explanation);
  const debugChecklist = completionItems([
    ['Edit the broken code', codeEdited],
    ['Make all tests pass', allPassed],
    ['Explain what was broken with at least 40 characters', explanationReady],
  ]);
  const debugReady = debugChecklist.every((item) => item.done);

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
          h(Pill, { tone: allPassed ? 'green' : 'slate' }, state.lastResult ? `${passed}/${total} tests` : `${total} tests`),
        ),
        h('h3', { className: 'text-lg font-bold text-ink' }, challenge.title),
        h('p', { className: 'mt-1 text-sm leading-6 text-slate-600' }, challenge.expectedBehavior),
      ),
      icon(open ? ChevronDown : ChevronRight, { className: 'shrink-0 text-slate-500' }),
    ),
    open
      ? h(
          'div',
          { className: 'space-y-4 border-t border-slate-200 px-5 py-5' },
          h(PlanRow, { label: 'Expected behavior' }, challenge.expectedBehavior),
          h(CodeRunner, {
            challenge,
            code: state.code,
            title: 'Debugging Environment',
            description: 'Fix the broken JavaScript, run tests, read the failure messages, and revise like an engineer.',
            codeEdited,
            initialResult: state.lastResult,
            returnPrompt: 'What should the fixed code return for each failing case?',
            onCodeChange: (code) => updateDebugChallenge(challenge.id, { code }),
            onResetCode: () => updateDebugChallenge(challenge.id, { code: challenge.brokenCode, lastResult: null, status: 'not-started' }),
            onResult: (result) => {
              const resultPassed = result.testResults.filter((test) => test.passed).length;
              updateDebugChallenge(challenge.id, {
                lastResult: result,
                status: resultPassed === challenge.testCases.length ? 'in-progress' : 'in-progress',
                lastRunAt: new Date().toISOString(),
              });
            },
          }),
          h(
            'section',
            { className: 'rounded-lg border border-blue-100 bg-blue-50 p-4' },
            h('h4', { className: 'text-sm font-bold uppercase tracking-wide text-blue-700' }, 'Hint system'),
            visibleHints.length
              ? h('div', { className: 'mt-3 space-y-2' }, visibleHints.map((hint, index) => h('p', { className: 'rounded-lg bg-white p-3 text-sm leading-6 text-blue-950', key: hint }, `Hint ${index + 1}: ${hint}`)))
              : h('p', { className: 'mt-2 text-sm leading-6 text-blue-950' }, 'Try running the tests first, then reveal one hint at a time.'),
            h(
              'button',
              {
                className: `mt-3 rounded-lg px-3 py-2 text-sm font-bold text-white transition ${state.hintLevel < challenge.hints.length ? 'bg-cobalt hover:bg-blue-800' : 'cursor-not-allowed bg-slate-300'}`,
                disabled: state.hintLevel >= challenge.hints.length,
                onClick: () => updateDebugChallenge(challenge.id, { hintLevel: Math.min(challenge.hints.length, state.hintLevel + 1) }),
              },
              state.hintLevel < challenge.hints.length ? 'Reveal next hint' : 'All hints shown',
            ),
          ),
          h(
            'section',
            { className: 'rounded-lg border border-slate-200 p-4' },
            h('label', { className: 'text-sm font-bold uppercase tracking-wide text-slate-500' }, 'What was broken and why?'),
            h('textarea', {
              className: 'mt-3 min-h-24 w-full resize-y rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-ink outline-none transition focus:border-cobalt focus:bg-white focus:ring-2 focus:ring-blue-100',
              placeholder: 'Explain the bug in plain English. Name the wrong assumption, the failing case, and the fix.',
              value: state.explanation,
              onChange: (event) => updateDebugChallenge(challenge.id, { explanation: event.target.value }),
            }),
          ),
          h(
            'section',
            { className: 'rounded-lg border border-emerald-100 bg-emerald-50 p-4' },
            h('h4', { className: 'text-sm font-bold uppercase tracking-wide text-emerald-800' }, 'Model explanation'),
            h(
              'button',
              {
                className: `mt-3 rounded-lg px-3 py-2 text-sm font-bold text-white transition ${attempted ? 'bg-fern hover:bg-emerald-800' : 'cursor-not-allowed bg-slate-300'}`,
                disabled: !attempted,
                onClick: () => updateDebugChallenge(challenge.id, { modelExplanationViewed: true }),
              },
              state.modelExplanationViewed ? 'Model explanation shown' : 'Show model explanation',
            ),
            !attempted ? h('p', { className: 'mt-2 text-sm leading-6 text-emerald-950' }, 'Run tests, edit code, or write your explanation before revealing the model explanation.') : null,
            state.modelExplanationViewed ? h('p', { className: 'mt-3 text-sm leading-7 text-emerald-950' }, challenge.modelExplanation) : null,
          ),
          h(CompletionChecklist, { items: debugChecklist }),
          h(
            'button',
            {
              className: `inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold text-white shadow-soft transition ${
                complete ? 'bg-fern hover:bg-emerald-800' : debugReady ? 'bg-cobalt hover:bg-blue-800' : 'cursor-not-allowed bg-slate-300'
              }`,
              disabled: !complete && !debugReady,
              onClick: () => {
                if (complete || debugReady) updateDebugChallenge(challenge.id, { status: complete ? 'in-progress' : 'complete' });
              },
            },
            icon(CheckCircle2),
            complete ? 'Completed' : 'Mark complete',
          ),
          complete ? h(ReinforcementPanel, { kind: 'debug', item: challenge }) : null,
        )
      : null,
  );
}

export function DebugMode({ debugState, updateDebugChallenge }) {
  const [filters, setFilters] = useState({ category: 'All', status: 'All' });
  const visible = debugChallenges.filter((challenge) => {
    const status = debugState[challenge.id]?.status || 'not-started';
    return (filters.category === 'All' || challenge.category === filters.category) && (filters.status === 'All' || status === filters.status);
  });
  const categories = ['All', ...new Set(debugChallenges.map((challenge) => challenge.category))];
  const completed = debugChallenges.filter((challenge) => debugState[challenge.id]?.status === 'complete').length;

  return h(
    'section',
    { className: 'space-y-4 scroll-mt-6', id: 'debug-mode' },
    h(
      'div',
      { className: 'rounded-lg border border-slate-200 bg-white p-5 shadow-sm' },
      h('p', { className: 'text-sm font-semibold uppercase tracking-wide text-fern' }, 'Debug Mode'),
      h('h2', { className: 'mt-1 text-2xl font-bold' }, 'Debug like an engineer'),
      h('p', { className: 'mt-3 max-w-3xl text-sm leading-7 text-slate-700' }, 'Read the expected behavior, run the broken code, use failing tests as clues, explain the root cause, then fix the code. The point is not guessing. The point is narrowing down evidence.'),
      h('div', { className: 'mt-4' }, h(Pill, { tone: completed === debugChallenges.length ? 'green' : 'blue' }, `${completed}/${debugChallenges.length} debug challenges complete`)),
      h(
        'div',
        { className: 'mt-5 grid gap-3 sm:grid-cols-2' },
        h(FilterSelect, { label: 'Category', value: filters.category, options: categories, onChange: (value) => setFilters((current) => ({ ...current, category: value })) }),
        h(FilterSelect, { label: 'Status', value: filters.status, options: [['All', 'All'], ['not-started', 'Not Started'], ['in-progress', 'In Progress'], ['complete', 'Complete']], onChange: (value) => setFilters((current) => ({ ...current, status: value })) }),
      ),
    ),
    visible.length
      ? h('div', { className: 'space-y-4' }, visible.map((challenge) => h(DebugChallengeCard, { challenge, saved: debugState[challenge.id], updateDebugChallenge, key: challenge.id })))
      : h(EmptyLessonsState, { message: 'No debug challenges match the current filters.' }),
  );
}

