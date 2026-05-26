import React, { useState } from 'react';
import { icon, Pill, SelfGradeButtons } from './shared.js';
import { FOUNDATION_CONCEPTS } from '../foundationContent.js';
const h = React.createElement;

export function MicroLessonCard({ lesson, index, saved, updateFoundationItem }) {
  const state = saved || { answers: {}, correct: {}, variation: 0, complete: false };
  const variation = state.variation || 0;
  const questions = lesson.questions.map((question, questionIndex) => {
    const replacement = lesson.variations?.[(variation + questionIndex) % (lesson.variations?.length || 1)];
    return variation > 0 && replacement ? { ...question, ...replacement, feedback: question.feedback } : question;
  });
  const allCorrect = questions.every((_, questionIndex) => state.correct?.[questionIndex]);

  function updateAnswer(questionIndex, value, answer) {
    updateFoundationItem(lesson.id, {
      answers: {
        ...(state.answers || {}),
        [questionIndex]: value,
      },
      correct: {
        ...(state.correct || {}),
        [questionIndex]: answerMatches(value, answer),
      },
      complete: false,
    });
  }

  function newExample() {
    updateFoundationItem(lesson.id, {
      variation: variation + 1,
      answers: {},
      correct: {},
      complete: false,
    });
  }

  return h(
    'article',
    { className: 'rounded-lg border border-slate-200 bg-white p-5 shadow-sm' },
    h('div', { className: 'flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between' }, h('div', null, h('p', { className: 'text-xs font-bold uppercase tracking-wide text-fern' }, `Micro-lesson ${index + 1}`), h('h3', { className: 'mt-1 text-xl font-bold text-ink' }, lesson.title)), h(Pill, { tone: state.complete ? 'green' : allCorrect ? 'blue' : 'amber' }, state.complete ? 'Complete' : allCorrect ? 'Ready' : 'Practice')),
    h('p', { className: 'mt-4 max-w-2xl text-base font-semibold leading-7 text-slate-700' }, lesson.explanation),
    h(
      'section',
      { className: 'mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4' },
      h('h4', { className: 'text-sm font-bold uppercase tracking-wide text-slate-500' }, 'Examples'),
      h('div', { className: 'mt-3 grid gap-2 sm:grid-cols-2' }, lesson.examples.map((example) => h('p', { className: 'rounded-lg bg-white p-3 text-sm font-semibold text-slate-700', key: example }, example))),
    ),
    h(
      'section',
      { className: 'mt-4 rounded-lg border border-blue-100 bg-blue-50 p-4' },
      h('h4', { className: 'text-sm font-bold uppercase tracking-wide text-blue-700' }, 'Same idea, four ways'),
      h(
        'div',
        { className: 'mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4' },
        Object.entries(lesson.representations).map(([label, value]) => h('div', { className: 'rounded-lg bg-white p-3 text-sm leading-6 text-blue-950', key: label }, h('p', { className: 'font-bold capitalize text-blue-700' }, label), h('p', null, value))),
      ),
    ),
    h(
      'section',
      { className: 'mt-4 rounded-lg border border-slate-200 p-4' },
      h('h4', { className: 'text-sm font-bold uppercase tracking-wide text-slate-500' }, 'Quick questions'),
      h(
        'div',
        { className: 'mt-3 space-y-3' },
        questions.map((question, questionIndex) => {
          const value = state.answers?.[questionIndex] || '';
          const answered = value.trim().length > 0;
          const correct = Boolean(state.correct?.[questionIndex]);
          return h(
            'label',
            { className: 'block rounded-lg border border-slate-200 bg-slate-50 p-3', key: `${question.prompt}-${questionIndex}` },
            h('span', { className: 'text-sm font-semibold leading-6 text-ink' }, question.prompt),
            h('input', {
              className: 'mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-ink outline-none transition focus:border-cobalt focus:ring-2 focus:ring-blue-100',
              value,
              onChange: (event) => updateAnswer(questionIndex, event.target.value, question.answer),
            }),
            answered ? h('p', { className: `mt-2 text-sm font-bold ${correct ? 'text-emerald-700' : 'text-amber-700'}` }, correct ? question.feedback || 'Correct.' : 'Try again. Look at the examples, then answer one small step.') : null,
          );
        }),
      ),
      h(
        'div',
        { className: 'mt-4 flex flex-wrap gap-2' },
        h('button', { className: 'rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-100', onClick: newExample }, 'Same idea, different numbers'),
        h('button', { className: 'rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50', onClick: newExample }, 'Try again with a new example'),
        h(
          'button',
          {
            className: `rounded-lg px-3 py-2 text-sm font-bold text-white transition ${allCorrect ? 'bg-cobalt hover:bg-blue-800' : 'cursor-not-allowed bg-slate-300'}`,
            disabled: !allCorrect,
            onClick: () => updateFoundationItem(lesson.id, { complete: true }),
          },
          state.complete ? 'Micro-lesson complete' : 'Mark micro-lesson complete',
        ),
      ),
    ),
  );
}

export function FoundationModePanel({ foundationState, updateFoundationItem }) {
  const concept = FOUNDATION_CONCEPTS[0];
  const progress = foundationState.progress || {};
  const completed = concept.microLessons.filter((lesson) => progress[lesson.id]?.complete).length;
  const nextLesson = concept.microLessons.find((lesson) => !progress[lesson.id]?.complete) || concept.microLessons[0];

  return h(
    'section',
    { className: 'space-y-4 scroll-mt-6', id: 'foundation-mode' },
    h(
      'div',
      { className: 'rounded-lg border border-slate-200 bg-white p-5 shadow-sm' },
      h('p', { className: 'text-sm font-semibold uppercase tracking-wide text-fern' }, 'Foundation Mode'),
      h('h2', { className: 'mt-1 text-2xl font-bold' }, 'Tiny steps before full lessons'),
      h('p', { className: 'mt-3 max-w-3xl text-sm leading-7 text-slate-700' }, 'Start here if normal lessons feel too fast. Each step is short, repeated, and checked before you move on.'),
      h('div', { className: 'mt-4 flex flex-wrap gap-2' }, h(Pill, { tone: completed === concept.microLessons.length ? 'green' : 'blue' }, `${completed}/${concept.microLessons.length} micro-lessons complete`), h(Pill, { tone: 'amber' }, `Next: ${nextLesson.title}`)),
    ),
    h(
      'div',
      { className: 'rounded-lg border border-amber-100 bg-amber-50 p-4 text-sm leading-6 text-amber-950' },
      h('p', { className: 'font-bold' }, 'Review: you learned this earlier'),
      h('p', { className: 'mt-1' }, 'Inputs and outputs come back in the Function Visualizer lab and the Function Rule Builder build challenge.'),
      h('div', { className: 'mt-3 flex flex-wrap gap-2' }, h('a', { className: 'rounded-lg bg-white px-3 py-2 text-sm font-bold text-amber-800', href: concept.labHref }, 'Open lab'), h('a', { className: 'rounded-lg bg-white px-3 py-2 text-sm font-bold text-amber-800', href: concept.buildHref }, 'Open build')),
    ),
    h('div', { className: 'space-y-4' }, concept.microLessons.map((lesson, index) => h(MicroLessonCard, { lesson, index, saved: progress[lesson.id], updateFoundationItem, key: lesson.id }))),
  );
}


export function FoundationModeToggle({ mode, setMode }) {
  return h(
    'div',
    { className: 'inline-flex border border-[#2a2a2a] bg-[#111111] p-1' },
    [
      ['standard', 'Standard Mode'],
      ['foundation', 'Foundation Mode'],
    ].map(([value, label]) =>
      h(
        'button',
        {
          className: `px-3 py-2 text-sm font-bold transition ${mode === value ? 'bg-[#00ff88] text-[#0d0d0d]' : 'text-[#888888] hover:bg-[#1a1a1a] hover:text-[#e0e0e0]'}`,
          key: value,
          onClick: () => setMode(value),
        },
        label,
      ),
    ),
  );
}