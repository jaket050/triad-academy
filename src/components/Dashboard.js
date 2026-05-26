import React from 'react';
import { Pill, ResetProgressButton } from './shared.js';
import { CurriculumProgress } from './CurriculumMap.js';

const h = React.createElement;

export function Dashboard({ completedCount, totalLessons, nextLesson, onReset, onStartPilot, subjectProgress, buildCompleted, totalBuild, nextBuild, debugCompleted, totalDebug, nextDebug, codeReadingCompleted, totalCodeReading, nextCodeReading, karpathyCompleted, totalKarpathy, nextKarpathyMilestone, labCompletion, buildGradeSummary, thinkingCompleted, totalThinking, recommendedPathLesson, weakSkill }) {
  const percent = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;
  const language = subjectProgress.find((subject) => subject.title === 'Language & Thinking') || { completed: 0, total: 0 };
  const skillCompleted = completedCount + labCompletion.completed + buildCompleted + debugCompleted + codeReadingCompleted + karpathyCompleted + thinkingCompleted;
  const skillTotal = totalLessons + labCompletion.total + totalBuild + totalDebug + totalCodeReading + totalKarpathy + totalThinking;

  return h(
    'section',
    { className: 'border border-[#2a2a2a] bg-[#111111] p-5', id: 'dashboard' },
    h('div', { className: 'flex flex-col gap-4 md:flex-row md:items-center md:justify-between' }, h('div', null, h('p', { className: 'text-sm font-bold uppercase tracking-widest text-[#00ff88]' }, 'Dashboard'), h('h2', { className: 'mt-1 text-2xl font-bold text-[#e0e0e0]' }, 'Build the same idea from three angles')), h(Pill, { tone: percent === 100 ? 'green' : 'blue' }, `${percent}% complete`)),
    h('p', { className: 'mt-4 max-w-3xl text-sm leading-7 text-[#888888]' }, 'Triad Academy links math, physics, and computer science so each subject reinforces the others. Start with a lesson, make a prediction, answer the quiz, explain the idea, then build a small piece of logic.'),
    h(
      'div',
      { className: 'mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-6' },
      h('div', { className: 'border border-[#2a2a2a] border-l-2 border-l-[#00ff88] bg-[#0d0d0d] p-4' }, h('p', { className: 'text-[11px] font-bold uppercase tracking-widest text-[#00ff88]' }, 'Lessons completed'), h('p', { className: 'mt-2 text-2xl font-bold text-[#e0e0e0]' }, `${completedCount} / ${totalLessons}`)),
      h('div', { className: 'border border-[#2a2a2a] border-l-2 border-l-[#00ff88] bg-[#0d0d0d] p-4' }, h('p', { className: 'text-[11px] font-bold uppercase tracking-widest text-[#00ff88]' }, 'Language progress'), h('p', { className: 'mt-2 text-2xl font-bold text-[#e0e0e0]' }, `${language.completed} / ${language.total}`)),
      h('div', { className: 'border border-[#2a2a2a] border-l-2 border-l-[#00ff88] bg-[#0d0d0d] p-4' }, h('p', { className: 'text-[11px] font-bold uppercase tracking-widest text-[#00ff88]' }, 'Lab predictions reflected'), h('p', { className: 'mt-2 text-2xl font-bold text-[#e0e0e0]' }, `${labCompletion.completed} / ${labCompletion.total}`)),
      h('div', { className: 'border border-[#2a2a2a] border-l-2 border-l-[#00ff88] bg-[#0d0d0d] p-4' }, h('p', { className: 'text-[11px] font-bold uppercase tracking-widest text-[#00ff88]' }, 'Build challenges completed'), h('p', { className: 'mt-2 text-2xl font-bold text-[#e0e0e0]' }, `${buildCompleted} / ${totalBuild}`)),
      h('div', { className: 'border border-[#2a2a2a] border-l-2 border-l-[#00ff88] bg-[#0d0d0d] p-4' }, h('p', { className: 'text-[11px] font-bold uppercase tracking-widest text-[#00ff88]' }, 'Debug challenges fixed'), h('p', { className: 'mt-2 text-2xl font-bold text-[#e0e0e0]' }, `${debugCompleted} / ${totalDebug}`)),
      h('div', { className: 'border border-[#2a2a2a] border-l-2 border-l-[#00ff88] bg-[#0d0d0d] p-4' }, h('p', { className: 'text-[11px] font-bold uppercase tracking-widest text-[#00ff88]' }, 'Code reading complete'), h('p', { className: 'mt-2 text-2xl font-bold text-[#e0e0e0]' }, `${codeReadingCompleted} / ${totalCodeReading}`)),
      h('div', { className: 'border border-[#2a2a2a] border-l-2 border-l-[#00ff88] bg-[#0d0d0d] p-4' }, h('p', { className: 'text-[11px] font-bold uppercase tracking-widest text-[#00ff88]' }, 'Karpathy milestones'), h('p', { className: 'mt-2 text-2xl font-bold text-[#e0e0e0]' }, `${karpathyCompleted} / ${totalKarpathy}`)),
      h('div', { className: 'border border-[#2a2a2a] border-l-2 border-l-[#00ff88] bg-[#0d0d0d] p-4' }, h('p', { className: 'text-[11px] font-bold uppercase tracking-widest text-[#00ff88]' }, 'Thinking Lab progress'), h('p', { className: 'mt-2 text-2xl font-bold text-[#e0e0e0]' }, `${thinkingCompleted} / ${totalThinking}`)),
      h('div', { className: 'border border-[#2a2a2a] border-l-2 border-l-[#00ff88] bg-[#0d0d0d] p-4' }, h('p', { className: 'text-[11px] font-bold uppercase tracking-widest text-[#00ff88]' }, 'Total skill coverage'), h('p', { className: 'mt-2 text-2xl font-bold text-[#e0e0e0]' }, `${skillCompleted} / ${skillTotal}`)),
      h('div', { className: 'border border-[#2a2a2a] border-l-2 border-l-[#00ff88] bg-[#0d0d0d] p-4' }, h('p', { className: 'text-[11px] font-bold uppercase tracking-widest text-[#00ff88]' }, 'Today’s recommended build'), h('p', { className: 'mt-2 text-sm font-bold leading-6 text-[#e0e0e0]' }, nextBuild ? nextBuild.concept : 'Review completed builds'), h('p', { className: 'mt-1 text-sm leading-6 text-[#888888]' }, nextBuild ? nextBuild.goal : 'All build challenges are complete. Revisit one and improve your pseudocode.')),
    ),
    h(
      'div',
      { className: 'mt-3 border border-[#2a2a2a] bg-[#0d0d0d] p-4 text-sm leading-6 text-[#888888]' },
      h('p', { className: 'font-bold text-[#e0e0e0]' }, 'Adaptive skill focus: '),
      weakSkill ? h('p', null, `${weakSkill.label} is currently ${weakSkill.score}/100. It depends on ${weakSkill.dependsOnLabels.length ? weakSkill.dependsOnLabels.join(', ') : 'no prior skills'}.`) : h('p', null, 'Complete more work to generate an adaptive skill focus.'),
    ),
    h(
      'div',
      { className: 'mt-3 border border-[#2a2a2a] bg-[#0d0d0d] p-4 text-sm leading-6 text-[#888888]' },
      h('p', { className: 'font-bold text-[#e0e0e0]' }, 'Recommended architecture path: '),
      recommendedPathLesson ? h('p', null, `${recommendedPathLesson.subjectTitle} -> ${recommendedPathLesson.stageTitle} -> ${recommendedPathLesson.moduleTitle} -> ${recommendedPathLesson.title}`) : h('p', null, 'All architecture path steps are complete.'),
    ),
    h(
      'div',
      { className: 'mt-3 border border-[#2a2a2a] bg-[#0d0d0d] p-4 text-sm leading-6 text-[#888888]' },
      h('span', { className: 'font-bold text-[#e0e0e0]' }, 'Build grading summary: '),
      `${buildGradeSummary.correct} correct, ${buildGradeSummary.partial} partially correct, ${buildGradeSummary.incorrect} incorrect, ${buildGradeSummary.ungraded} ungraded. Basic feedback is keyword-based, so your self-assessment still matters.`,
    ),
    h(
      'div',
      { className: 'mt-5 flex flex-col gap-3 sm:flex-row sm:items-center' },
      nextLesson
        ? h(
            'a',
            {
              className: 'inline-flex items-center justify-center border border-[#00ff88] bg-[#00ff88] px-4 py-2.5 text-sm font-bold text-[#0d0d0d] transition hover:opacity-90',
              href: `#${nextLesson.id}`,
            },
            `Continue: ${nextLesson.title}`,
          )
        : h('div', { className: 'border border-[#1a2e22] bg-[#0d1a12] px-4 py-3 text-sm font-semibold text-[#00ff88]' }, 'All curriculum lessons are complete. Labs and reflections are ready for review.'),
      nextBuild
        ? h(
            'a',
            {
              className: 'inline-flex items-center justify-center border border-[#00cc66] bg-[#00cc66] px-4 py-2.5 text-sm font-bold text-[#0d0d0d] transition hover:opacity-90',
              href: `#${nextBuild.id}`,
            },
            `Continue Building: ${nextBuild.concept}`,
          )
        : h('div', { className: 'border border-[#1a2e22] bg-[#0d1a12] px-4 py-3 text-sm font-semibold text-[#00ff88]' }, 'All build challenges are complete.'),
      nextDebug
        ? h(
            'a',
            {
              className: 'inline-flex items-center justify-center border border-[#3a2800] px-4 py-2.5 text-sm font-bold text-[#ffaa33] transition hover:bg-[#1a1200]',
              href: `#${nextDebug.id}`,
            },
            `Debug: ${nextDebug.title}`,
          )
        : h('div', { className: 'border border-[#1a2e22] bg-[#0d1a12] px-4 py-3 text-sm font-semibold text-[#00ff88]' }, 'All debug challenges are complete.'),
      nextCodeReading
        ? h(
            'a',
            {
              className: 'inline-flex items-center justify-center border border-[#1f3828] px-4 py-2.5 text-sm font-bold text-[#00ff88] transition hover:bg-[#0d1a12]',
              href: `#${nextCodeReading.id}`,
            },
            `Read: ${nextCodeReading.title}`,
          )
        : h('div', { className: 'border border-[#1a2e22] bg-[#0d1a12] px-4 py-3 text-sm font-semibold text-[#00ff88]' }, 'All code reading challenges are complete.'),
      nextKarpathyMilestone
        ? h(
            'a',
            {
              className: 'inline-flex items-center justify-center border border-[#1f3828] px-4 py-2.5 text-sm font-bold text-[#00ff88] transition hover:bg-[#0d1a12]',
              href: `#${nextKarpathyMilestone.id}`,
            },
            `Karpathy: ${nextKarpathyMilestone.title}`,
          )
        : h('div', { className: 'border border-[#1a2e22] bg-[#0d1a12] px-4 py-3 text-sm font-semibold text-[#00ff88]' }, 'Karpathy Path complete.'),
      h(
        'button',
        {
          className: 'inline-flex items-center justify-center border border-[#2a2a2a] px-4 py-2.5 text-sm font-bold text-[#00ff88] transition hover:border-[#00ff88] hover:bg-[#001a0d]',
          onClick: onStartPilot,
        },
        'Start Pilot Test',
      ),
      h(ResetProgressButton, { onReset }),
    ),
    h(
      'div',
      { className: 'mt-5 grid gap-3 sm:grid-cols-3' },
      [
        ['Math gives the language', 'Functions, change, and uncertainty help describe patterns.'],
        ['Physics gives the world', 'Motion, forces, and energy make abstract ideas concrete.'],
        ['CS gives the tools', 'Programs, structures, and AI turn ideas into working systems.'],
      ].map(([title, body]) => h('div', { className: 'border border-[#2a2a2a] border-l-2 border-l-[#00ff88] bg-[#0d0d0d] p-4', key: title }, h('h3', { className: 'text-sm font-bold text-[#e0e0e0]' }, title), h('p', { className: 'mt-2 text-sm leading-6 text-[#888888]' }, body))),
    ),
    h('div', { className: 'mt-5' }, h(CurriculumProgress, { subjects: subjectProgress })),
  );
}

