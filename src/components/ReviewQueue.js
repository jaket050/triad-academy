import React from 'react';
import { icon, Pill } from './shared.js';
import { todayKey } from '../hooks.js';
const h = React.createElement;

export function buildReviewQueue({ lessonQueue, lessonProgress, solveState, predictionState, buildState, debugState, codeReadingState, karpathyProgress, foundationState, reviewHistory }) {
  const reviewedToday = new Set(reviewHistory.filter((entry) => entry.date === todayKey()).map((entry) => entry.itemId));
  const queue = [];
  const completedFoundation = FOUNDATION_CONCEPTS[0].microLessons.filter((lesson) => foundationState?.progress?.[lesson.id]?.complete);

  if (completedFoundation.length && !reviewedToday.has('foundation-functions-review')) {
    queue.push({
      id: 'foundation-functions-review',
      type: 'Foundation review',
      title: 'Review: you learned this earlier',
      reason: 'Practice inputs and outputs again so the idea stays easy before labs and builds.',
      href: '#foundation-mode',
    });
  }

  lessonQueue.forEach((lesson) => {
    const answer = lessonProgress[lesson.id]?.quizAnswer;
    if (typeof answer === 'number' && answer !== lesson.quiz.correctIndex) {
      queue.push({
        id: `quiz-${lesson.id}`,
        type: 'Lesson quiz',
        title: `${lesson.subjectTitle}: ${lesson.title}`,
        reason: 'Quiz answer was incorrect.',
        href: `#${lesson.id}`,
      });
    }
  });

  Object.entries(solveState).forEach(([itemId, state]) => {
    if (state.attempt?.trim() && !state.reflection?.trim()) {
      queue.push({
        id: `solve-${itemId}`,
        type: 'Practice reflection',
        title: itemId.startsWith('daily-') ? 'Daily Coach practice problem' : 'Lesson practice or worked example',
        reason: 'Attempted but not reflected after reveal.',
        href: itemId.startsWith('daily-') ? '#daily-coach' : `#${itemId.split('-practice-')[0].split('-worked-')[0]}`,
      });
    }
  });

  LAB_IDS.forEach((labId) => {
    const state = predictionState[labId];
    if (state?.labGrade === 'incorrect' || state?.labGrade === 'partially-correct') {
      const titles = {
        'lab-function-visualizer': 'Function Visualizer',
        'lab-projectile-motion': 'Projectile Motion Simulator',
        'lab-algorithm-complexity': 'Algorithm Complexity Visualizer',
      };
      queue.push({
        id: `lab-${labId}`,
        type: 'Lab prediction',
        title: titles[labId],
        reason: `Lab prediction was graded ${state.labGrade === 'incorrect' ? 'incorrect' : 'partially correct'}.`,
        href: '#labs',
      });
    }
  });

  buildChallenges.forEach((challenge) => {
    const state = buildState[challenge.id];
    if (!state || state.status !== 'complete' || state.grade === 'partially-correct' || state.grade === 'incorrect') {
      queue.push({
        id: `build-${challenge.id}`,
        type: 'Build challenge',
        title: challenge.concept,
        reason: state?.grade === 'partially-correct' || state?.grade === 'incorrect' ? `Build challenge graded ${state.grade === 'incorrect' ? 'incorrect' : 'partially correct'}.` : 'Build challenge is incomplete.',
        href: `#${challenge.id}`,
      });
    }
  });

  debugChallenges.forEach((challenge) => {
    const state = debugState[challenge.id];
    const passed = state?.lastResult?.testResults?.filter((test) => test.passed).length || 0;
    const total = challenge.testCases.length;
    const hasFailedRun = state?.lastResult && passed < total;

    if (!state || state.status !== 'complete' || hasFailedRun) {
      queue.push({
        id: `debug-${challenge.id}`,
        type: 'Debug challenge',
        title: challenge.title,
        reason: hasFailedRun ? `${passed}/${total} tests passed on the last run.` : 'Debug challenge is incomplete.',
        href: `#${challenge.id}`,
      });
    }
  });

  codeReadingChallenges.forEach((challenge) => {
    const state = codeReadingState[challenge.id];
    const incorrectPrediction = state?.predictionResult === 'incorrect';

    if (!state || state.status !== 'complete' || incorrectPrediction) {
      queue.push({
        id: `code-reading-${challenge.id}`,
        type: 'Code reading',
        title: challenge.title,
        reason: incorrectPrediction ? 'Prediction was marked incorrect after revealing the result.' : 'Code reading challenge is incomplete.',
        href: `#${challenge.id}`,
      });
    }
  });

  karpathyMilestones.forEach((milestone) => {
    const state = karpathyProgress[milestone.id];
    if (!state || state.status !== 'complete') {
      queue.push({
        id: `karpathy-${milestone.id}`,
        type: 'Karpathy milestone',
        title: milestone.title,
        reason: state?.reflection?.trim() ? 'Milestone reflection started but not completed.' : 'Milestone is incomplete.',
        href: `#${milestone.id}`,
      });
    }
  });

  return queue.filter((item) => !reviewedToday.has(item.id)).slice(0, 24);
}

export function ReviewQueue({ reviewQueue, reviewHistory, markReviewed }) {
  const recent = [...reviewHistory].sort((a, b) => b.reviewedAt.localeCompare(a.reviewedAt)).slice(0, 5);

  return h(
    'section',
    { className: 'space-y-4 scroll-mt-6', id: 'review' },
    h(
      'div',
      { className: 'rounded-lg border border-slate-200 bg-white p-5 shadow-sm' },
      h('p', { className: 'text-sm font-semibold uppercase tracking-wide text-fern' }, 'Review Queue'),
      h('h2', { className: 'mt-1 text-2xl font-bold' }, 'Today’s review queue'),
      h('p', { className: 'mt-3 max-w-3xl text-sm leading-7 text-slate-700' }, 'Weak or unfinished material comes back here automatically: missed quizzes, unfinished reflections, weak lab predictions, incomplete builds, failing debug challenges, and code reading predictions that need review.'),
    ),
    reviewQueue.length
      ? h(
          'div',
          { className: 'space-y-3' },
          reviewQueue.map((item) =>
            h(
              'article',
              { className: 'rounded-lg border border-slate-200 bg-white p-4 shadow-sm', key: item.id },
              h('div', { className: 'flex flex-col gap-3 md:flex-row md:items-start md:justify-between' }, h('div', null, h('div', { className: 'mb-2 flex flex-wrap gap-2' }, h(Pill, { tone: 'blue' }, item.type), h(Pill, { tone: 'amber' }, 'Review')), h('h3', { className: 'font-bold text-ink' }, item.title), h('p', { className: 'mt-2 text-sm leading-6 text-slate-600' }, item.reason)), h('div', { className: 'flex flex-wrap gap-2' }, h('a', { className: 'rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700', href: item.href }, 'Jump to item'), h('button', { className: 'rounded-lg bg-cobalt px-3 py-2 text-sm font-bold text-white', onClick: () => markReviewed(item) }, 'Mark reviewed'))),
            ),
          ),
        )
      : h('div', { className: 'rounded-lg border border-emerald-100 bg-emerald-50 p-5 text-sm leading-7 text-emerald-900' }, 'No review items due today. If you miss a quiz, leave a practice reflection unfinished, or mark a lab/build as weak, it will appear here.'),
    recent.length
      ? h(
          'div',
          { className: 'rounded-lg border border-slate-200 bg-white p-5 shadow-sm' },
          h('h3', { className: 'text-sm font-bold uppercase tracking-wide text-slate-500' }, 'Recent review history'),
          h('div', { className: 'mt-3 space-y-2' }, recent.map((entry) => h('div', { className: 'rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700', key: `${entry.itemId}-${entry.reviewedAt}` }, `${entry.date}: ${entry.title}`))),
        )
      : null,
  );
}
