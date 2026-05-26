import React, { useState, useMemo } from 'react';
import { CalendarCheck, PlayCircle } from 'lucide-react';
import { icon, Pill, StepList, SolveBeforeReveal } from './shared.js';
import { streakFromHistory, todayKey } from '../hooks.js';
import { FOUNDATION_CONCEPTS } from '../foundationContent.js';
const h = React.createElement;

export function recommendLab(lesson) {
  const text = `${lesson.subjectTitle} ${lesson.title} ${lesson.bigIdea}`.toLowerCase();

  if (text.includes('motion') || text.includes('velocity') || text.includes('trigonometry') || text.includes('projectile') || text.includes('forces')) {
    return {
      name: 'Projectile Motion Simulator',
      reason: 'It turns rates, vectors, and physical change into a visible path you can adjust.',
    };
  }

  if (text.includes('algorithm') || text.includes('big-o') || text.includes('data structure') || text.includes('ai') || text.includes('computation')) {
    return {
      name: 'Algorithm Complexity Visualizer',
      reason: 'It shows how different growth patterns separate as input size increases.',
    };
  }

  return {
    name: 'Function Visualizer',
    reason: 'It connects equations, inputs, outputs, slope, and graphs in one simple model.',
  };
}

export function miniBuildFor(lesson) {
  const subject = lesson.subjectTitle;
  const title = lesson.title.toLowerCase();

  if (subject === 'Math') {
    if (title.includes('probability')) return 'Create a tiny decision table comparing two uncertain choices with expected value.';
    if (title.includes('vectors') || title.includes('trigonometry')) return 'Sketch a two-component vector and label what each component means.';
    return 'Make a two-row input-output table, then turn it into a rule or graph.';
  }

  if (subject === 'Physics') {
    if (title.includes('electric') || title.includes('circuit')) return 'Draw a simple circuit or logic gate and label what flows or changes at each point.';
    if (title.includes('waves')) return 'Sketch one wave and label wavelength, amplitude, and frequency.';
    return 'Draw a simple physical situation and label the quantities that change over time.';
  }

  if (title.includes('debug')) return 'Write one test case for a tiny function, including the expected result.';
  if (title.includes('algorithm') || title.includes('data')) return 'Compare two ways to organize the same data and explain which one would scale better.';
  if (title.includes('ai')) return 'Write a three-step model loop: predict, measure loss, adjust.';
  return 'Write pseudocode for a small tool that uses today’s idea.';
}

export function reflectionFor(lesson) {
  if (lesson.subjectTitle === 'Math') {
    return 'What would the graph, equation, or numbers look like if the situation doubled in size?';
  }

  if (lesson.subjectTitle === 'Physics') {
    return 'Which quantity in this situation is changing, and what causes that change?';
  }

  return 'What input does this computing idea need, what output should it produce, and where could it fail?';
}

export function estimateFor(level) {
  if (level === 'Advanced') return '45-55 minutes';
  if (level === 'Core') return '35-45 minutes';
  return '25-35 minutes';
}

export function buildDailyPlan(lessonQueue, lessonProgress) {
  const nextIncomplete = lessonQueue.find((item) => !lessonProgress[item.id]?.complete);
  const lesson = nextIncomplete || lessonQueue[0];
  const lab = recommendLab(lesson);

  return {
    lesson,
    lab,
    allComplete: !nextIncomplete,
    miniBuild: miniBuildFor(lesson),
    reflection: reflectionFor(lesson),
    estimatedTime: estimateFor(lesson.level),
    practiceProblem: lesson.learning?.practiceProblems?.[0],
  };
}


export function PlanRow({ label, children }) {
  return h(
    'div',
    { className: 'rounded-lg border border-slate-200 bg-slate-50 p-4' },
    h('p', { className: 'text-xs font-bold uppercase tracking-wide text-slate-500' }, label),
    h('div', { className: 'mt-2 text-sm leading-7 text-slate-700' }, children),
  );
}

export function answerMatches(userAnswer, expectedAnswer) {
  const user = String(userAnswer || '').trim().toLowerCase();
  const expected = String(expectedAnswer || '').trim().toLowerCase();
  return user === expected;
}

export function DailyCoach({ lessonQueue, lessonProgress, sessions, startSession, completeSession, recommendedBuild, recommendedDebug, recommendedCodeReading, recommendedKarpathyMilestone, reviewItem, languageLesson, thinkingChallenge, recommendedPathLesson, weakSkill, adaptiveSkillLesson, solveStore, foundationState }) {
  const plan = useMemo(() => buildDailyPlan(lessonQueue, lessonProgress), [lessonQueue, lessonProgress]);
  const date = todayKey();
  const history = sessions.history || [];
  const completedToday = history.some((entry) => entry.date === date);
  const startedToday = sessions.activeDate === date;
  const streak = streakFromHistory(history);
  const recentHistory = [...history].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);
  const foundationCompleted = FOUNDATION_CONCEPTS[0].microLessons.filter((lesson) => foundationState?.progress?.[lesson.id]?.complete).length;
  const foundationReview = foundationCompleted
    ? `Review: you learned this earlier. Practice inputs and outputs again in the Function Visualizer or Function Rule Builder.`
    : 'Start Foundation Mode with: What is an input?';

  return h(
    'section',
    { className: 'space-y-4 scroll-mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm', id: 'daily-coach' },
    h(
      'div',
      { className: 'flex flex-col gap-4 md:flex-row md:items-start md:justify-between' },
      h(
        'div',
        null,
        h('p', { className: 'text-sm font-semibold uppercase tracking-wide text-fern' }, 'Daily Coach'),
        h('h2', { className: 'mt-1 text-2xl font-bold' }, 'Today’s study plan'),
        h('p', { className: 'mt-3 max-w-3xl text-sm leading-7 text-slate-700' }, 'This plan uses your saved lesson progress to choose the next useful step, then pairs it with a lab, a mini-build, and a reflection.'),
      ),
      h(
        'div',
        { className: 'rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-900' },
        `${streak} day streak`,
      ),
    ),
    h(
      'div',
      { className: 'grid gap-3 lg:grid-cols-2' },
      h(PlanRow, { label: 'Foundation review' }, foundationReview),
      h(
        PlanRow,
        { label: plan.allComplete ? 'Review lesson' : 'Next incomplete lesson' },
        h('strong', { className: 'text-ink' }, `${plan.lesson.subjectTitle}: ${plan.lesson.title}`),
        h('span', null, ` (${plan.lesson.level})`),
        plan.allComplete ? h('p', { className: 'mt-1' }, 'All lessons are complete, so today is a review-and-apply session.') : null,
      ),
      h(
        PlanRow,
        { label: 'Review item' },
        reviewItem
          ? [
              h('strong', { className: 'text-ink', key: 'title' }, reviewItem.title),
              h('p', { className: 'mt-1', key: 'reason' }, reviewItem.reason),
              h('a', { className: 'mt-2 inline-flex rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs font-bold text-blue-700', href: reviewItem.href, key: 'link' }, 'Open review item'),
            ]
          : 'No review item is due today. Weak or unfinished work will appear here automatically.',
      ),
      h(
        PlanRow,
        { label: 'Adaptive skill focus' },
        weakSkill
          ? [
              h('strong', { className: 'text-ink', key: 'skill' }, `${weakSkill.label} (${weakSkill.score}/100)`),
              h('p', { className: 'mt-1', key: 'why' }, adaptiveSkillLesson ? `Practice with: ${adaptiveSkillLesson.subjectTitle}: ${adaptiveSkillLesson.title}` : 'Use a connected lab, build challenge, or review item to strengthen this skill.'),
              adaptiveSkillLesson ? h('a', { className: 'mt-2 inline-flex rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs font-bold text-blue-700', href: `#${adaptiveSkillLesson.id}`, key: 'link' }, 'Open adaptive lesson') : null,
            ]
          : 'Keep working; the skill graph will adapt as more performance data appears.',
      ),
      h(PlanRow, { label: 'Architecture path lesson' }, recommendedPathLesson ? `${recommendedPathLesson.subjectTitle} -> ${recommendedPathLesson.stageTitle} -> ${recommendedPathLesson.moduleTitle} -> ${recommendedPathLesson.title}` : 'All architecture path steps are complete.'),
      h(PlanRow, { label: 'Recommended build challenge' }, h('strong', { className: 'text-ink' }, recommendedBuild?.concept || 'Build Mode review'), h('p', { className: 'mt-1' }, recommendedBuild?.goal || 'Complete or revise one Build Mode challenge.')),
      h(
        PlanRow,
        { label: 'Debug challenge' },
        recommendedDebug
          ? [
              h('strong', { className: 'text-ink', key: 'title' }, recommendedDebug.title),
              h('p', { className: 'mt-1', key: 'expected' }, recommendedDebug.expectedBehavior),
              h('a', { className: 'mt-2 inline-flex rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs font-bold text-blue-700', href: `#${recommendedDebug.id}`, key: 'link' }, 'Open debug challenge'),
            ]
          : 'All debug challenges are complete. Revisit one and explain the bug more clearly.',
      ),
      h(
        PlanRow,
        { label: 'Code reading challenge' },
        recommendedCodeReading
          ? [
              h('strong', { className: 'text-ink', key: 'title' }, recommendedCodeReading.title),
              h('p', { className: 'mt-1', key: 'context' }, recommendedCodeReading.context),
              h('a', { className: 'mt-2 inline-flex rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs font-bold text-blue-700', href: `#${recommendedCodeReading.id}`, key: 'link' }, 'Open code reading'),
            ]
          : 'All code reading challenges are complete. Revisit one and explain the control flow again.',
      ),
      h(
        PlanRow,
        { label: 'Karpathy Path milestone' },
        recommendedKarpathyMilestone
          ? [
              h('strong', { className: 'text-ink', key: 'title' }, recommendedKarpathyMilestone.title),
              h('p', { className: 'mt-1', key: 'why' }, recommendedKarpathyMilestone.whyItMatters),
              h('a', { className: 'mt-2 inline-flex rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs font-bold text-blue-700', href: `#${recommendedKarpathyMilestone.id}`, key: 'link' }, 'Open milestone'),
            ]
          : 'All Karpathy Path milestones are complete. Revisit one and improve the build notes.',
      ),
      h(
        PlanRow,
        { label: 'Language lesson' },
        languageLesson
          ? [
              h('strong', { className: 'text-ink', key: 'title' }, languageLesson.title),
              h('p', { className: 'mt-1', key: 'idea' }, languageLesson.bigIdea),
              h('a', { className: 'mt-2 inline-flex rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs font-bold text-blue-700', href: `#${languageLesson.id}`, key: 'link' }, 'Open language lesson'),
            ]
          : 'All language lessons are complete. Revisit one and explain it more clearly.',
      ),
      h(
        PlanRow,
        { label: 'Thinking challenge' },
        thinkingChallenge
          ? [
              h('strong', { className: 'text-ink', key: 'title' }, thinkingChallenge.title),
              h('p', { className: 'mt-1', key: 'problem' }, thinkingChallenge.problem),
              h('a', { className: 'mt-2 inline-flex rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs font-bold text-blue-700', href: `#${thinkingChallenge.id}`, key: 'link' }, 'Open challenge'),
            ]
          : 'All Thinking Lab challenges are complete. Try improving one reflection.',
      ),
      h(PlanRow, { label: 'Subject and stage' }, `${plan.lesson.subjectTitle} · ${plan.lesson.stage}`),
      h(PlanRow, { label: 'Recommended lab' }, h('strong', { className: 'text-ink' }, plan.lab.name), h('p', { className: 'mt-1' }, plan.lab.reason)),
      h(PlanRow, { label: 'Mini-build task' }, plan.miniBuild),
      h(
        PlanRow,
        { label: 'Practice problem' },
        plan.practiceProblem
          ? h(SolveBeforeReveal, {
              itemId: `daily-${date}-${plan.lesson.id}`,
              prompt: h('p', null, plan.practiceProblem.prompt),
              revealTitle: 'solution',
              revealContent: h(StepList, { items: plan.practiceProblem.solution }),
              solveStore,
            })
          : 'Write one concrete example that uses today’s concept.',
      ),
      h(PlanRow, { label: 'Reflection question' }, plan.reflection),
      h(PlanRow, { label: 'Estimated time' }, plan.estimatedTime),
      h(PlanRow, { label: 'Why this lesson matters' }, plan.lesson.whyItMatters),
    ),
    h(
      'div',
      { className: 'flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between' },
      h(
        'div',
        { className: 'text-sm leading-6 text-slate-600' },
        completedToday
          ? 'Today’s session is marked complete. Nice: the streak counter has this date.'
          : startedToday
            ? 'Session started. Work through the lesson, try the lab, then mark it complete.'
            : 'Start the session when you are ready; completion is saved by date.',
      ),
      h(
        'div',
        { className: 'flex flex-wrap gap-2' },
        h(
          'button',
          {
            className: 'inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-4 py-2.5 text-sm font-bold text-blue-700 transition hover:bg-blue-50',
            onClick: () => startSession(plan),
          },
          icon(PlayCircle),
          startedToday ? 'Session started' : 'Start today’s session',
        ),
        h(
          'button',
          {
            className: `inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold text-white shadow-soft transition ${
              completedToday ? 'bg-fern hover:bg-emerald-800' : 'bg-cobalt hover:bg-blue-800'
            }`,
            onClick: () => completeSession(plan),
          },
          icon(CalendarCheck),
          completedToday ? 'Session complete' : 'Mark session complete',
        ),
      ),
    ),
    recentHistory.length
      ? h(
          'div',
          { className: 'border-t border-slate-200 pt-4' },
          h('h3', { className: 'text-sm font-bold uppercase tracking-wide text-slate-500' }, 'Recent sessions'),
          h(
            'div',
            { className: 'mt-3 grid gap-2' },
            recentHistory.map((entry) =>
              h(
                'div',
                { className: 'flex flex-col gap-1 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700 sm:flex-row sm:items-center sm:justify-between', key: `${entry.date}-${entry.lessonId}` },
                h('span', { className: 'font-semibold text-ink' }, entry.date),
                h('span', null, `${entry.subject}: ${entry.lessonTitle}`),
              ),
            ),
          ),
        )
      : null,
  );
}