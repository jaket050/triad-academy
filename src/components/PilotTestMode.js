import React, { useState } from 'react';
import { buildChallenges } from '../buildChallenges.js';
import { PILOT_PRE_QUESTIONS, PILOT_POST_QUESTIONS, PILOT_STEPS } from '../hooks.js';
import { icon, Pill } from './shared.js';
import { PlanRow } from './DailyCoach.js';
import { hasText, testsPassed, completionItems, CompletionChecklist } from './BuildMode.js';
import { RangeSlider } from './Labs.js';
import { Metric } from './shared.js';

const h = React.createElement;

export function PilotQuestionSet({ id, title, questions, answers, onChange }) {
  return h(
    'section',
    { className: 'rounded-lg border border-slate-200 bg-white p-4', id },
    h('h3', { className: 'text-sm font-bold uppercase tracking-wide text-slate-500' }, title),
    h(
      'div',
      { className: 'mt-3 space-y-3' },
      questions.map((question, index) =>
        h(
          'label',
          { className: 'block', key: question },
          h('span', { className: 'text-sm font-semibold leading-6 text-slate-700' }, question),
          h('textarea', {
            className: 'mt-2 min-h-20 w-full resize-y rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-ink outline-none transition focus:border-cobalt focus:bg-white focus:ring-2 focus:ring-blue-100',
            value: answers[index] || '',
            onChange: (event) => onChange(index, event.target.value),
          }),
        ),
      ),
    ),
  );
}

export function PilotTestMode({ pilotState, updatePilot, onStartPilot, onResetPilot, onForceResetAllLocalData, completePilot, lessonQueue, lessonProgress, predictionState, buildState, debugState, solveState }) {
  const [copyStatus, setCopyStatus] = useState('');
  const assignedLesson = lessonQueue.find((lesson) => lesson.id === 'math-inputs-and-outputs');
  const lessonSaved = lessonProgress['math-inputs-and-outputs'] || {};
  const lessonExplanationParts = lessonSaved.explanationParts || {};
  const lessonExplanationReady = ['what', 'why', 'example'].every((field) => hasText(lessonExplanationParts[field], 15));
  const quizCorrect = assignedLesson && typeof lessonSaved.quizAnswer === 'number' ? lessonSaved.quizAnswer === assignedLesson.quiz.correctIndex : false;
  const lessonPracticeAttempted = assignedLesson?.learning?.practiceProblems?.some((_, index) => solveState[`${assignedLesson.id}-practice-${index}`]?.attempt?.trim()) ?? true;
  const buildSaved = buildState['build-function-rule-builder'] || {};
  const debugSaved = debugState['debug-math-line-model'] || {};
  const labSaved = predictionState['lab-function-visualizer'] || {};
  const buildChallenge = buildChallenges.find((challenge) => challenge.id === 'build-function-rule-builder') || buildChallenges[0];
  const buildCodeEdited = Boolean(buildSaved.code && buildSaved.code !== buildChallenge.starterCode);
  const buildAllTestsPass = testsPassed(buildSaved.lastResult, buildChallenge.testCases || []);
  const completedSteps = PILOT_STEPS.filter((step) => pilotState.steps?.[step.id]).length;
  const started = Boolean(pilotState.startedAt);
  const elapsedMinutes = pilotState.startedAt ? Math.max(0, Math.round((Date.now() - new Date(pilotState.startedAt).getTime()) / 60000)) : 0;
  const preReady = PILOT_PRE_QUESTIONS.every((_, index) => (pilotState.preAnswers?.[index] || '').trim().length >= 5) && Boolean(pilotState.confidenceBefore);
  const lessonReady = Boolean(lessonSaved.complete) && typeof lessonSaved.quizAnswer === 'number' && lessonExplanationReady && lessonPracticeAttempted;
  const labReady = Boolean(labSaved.locked && labSaved.reflection?.trim() && (labSaved.labGrade || labSaved.result));
  const appliedReady = buildCodeEdited && Boolean(buildSaved.lastResult) && buildAllTestsPass && hasText(buildSaved.notes);
  const postReady = PILOT_POST_QUESTIONS.every((_, index) => (pilotState.postAnswers?.[index] || '').trim().length >= 5) && Boolean(pilotState.confidenceAfter);
  const feedbackReady = (pilotState.friction || '').trim().length >= 10;
  const readiness = {
    'pre-test': {
      ready: preReady,
      message: 'Answer every pre-test question and choose a before-confidence rating.',
      checklist: completionItems([
        ['Answer all pre-test questions', PILOT_PRE_QUESTIONS.every((_, index) => (pilotState.preAnswers?.[index] || '').trim().length >= 5)],
        ['Choose before-confidence', Boolean(pilotState.confidenceBefore)],
      ]),
    },
    lesson: {
      ready: lessonReady,
      message: 'Complete the assigned lesson gate before moving on.',
      checklist: completionItems([
        ['Lesson marked complete', Boolean(lessonSaved.complete)],
        ['Quiz answered', typeof lessonSaved.quizAnswer === 'number'],
        ['All three Explain-It fields are complete', lessonExplanationReady],
        ['At least one practice attempt written', lessonPracticeAttempted],
      ]),
    },
    lab: {
      ready: labReady,
      message: 'Lock a prediction, test the lab, self-grade, and write a reflection.',
      checklist: completionItems([
        ['Prediction locked', Boolean(labSaved.locked)],
        ['Self-grade selected', Boolean(labSaved.labGrade || labSaved.result)],
        ['Reflection written', Boolean(labSaved.reflection?.trim())],
      ]),
    },
    'applied-task': {
      ready: appliedReady,
      message: 'Edit the Function Rule Builder code, run tests, pass them, and write notes.',
      checklist: completionItems([
        ['Code edited from starter', buildCodeEdited],
        ['Tests run', Boolean(buildSaved.lastResult)],
        ['All tests pass', buildAllTestsPass],
        ['Implementation notes are at least 40 characters', hasText(buildSaved.notes)],
      ]),
    },
    'post-test': {
      ready: postReady,
      message: 'Answer every post-test question and choose an after-confidence rating.',
      checklist: completionItems([
        ['Answer all post-test questions', PILOT_POST_QUESTIONS.every((_, index) => (pilotState.postAnswers?.[index] || '').trim().length >= 5)],
        ['Choose after-confidence', Boolean(pilotState.confidenceAfter)],
      ]),
    },
    feedback: {
      ready: feedbackReady,
      message: 'Write at least one friction note before finishing the pilot.',
      checklist: completionItems([['Friction feedback has at least 10 characters', feedbackReady]]),
    },
  };
  const firstIncomplete = PILOT_STEPS.find((step) => !pilotState.steps?.[step.id]) || PILOT_STEPS[PILOT_STEPS.length - 1];
  const currentStep = PILOT_STEPS.find((step) => step.id === pilotState.currentStepId) || firstIncomplete;
  const currentIndex = Math.max(0, PILOT_STEPS.findIndex((step) => step.id === currentStep.id));
  const currentReadiness = readiness[currentStep.id];
  const pilotResults = {
    savedAt: new Date().toISOString(),
    startedAt: pilotState.startedAt,
    completedAt: pilotState.completedAt,
    elapsedMinutes,
    completedSteps: pilotState.steps || {},
    stepCount: `${completedSteps}/${PILOT_STEPS.length}`,
    confidenceBefore: pilotState.confidenceBefore,
    confidenceAfter: pilotState.confidenceAfter,
    preTestAnswers: pilotState.preAnswers || {},
    postTestAnswers: pilotState.postAnswers || {},
    assignedFlow: {
      lesson: {
        id: 'math-inputs-and-outputs',
        title: assignedLesson?.title || 'Inputs and Outputs',
        complete: Boolean(lessonSaved.complete),
        quizAnswered: typeof lessonSaved.quizAnswer === 'number',
        quizCorrect,
        explanationWritten: lessonExplanationReady,
        practiceAttempted: lessonPracticeAttempted,
      },
      lab: {
        id: 'lab-function-visualizer',
        predictionLocked: Boolean(labSaved.locked),
        reflected: Boolean(labSaved.reflection?.trim()),
        grade: labSaved.labGrade || labSaved.result || '',
      },
      build: {
        id: 'build-function-rule-builder',
        status: buildSaved.status || 'not-started',
        grade: buildSaved.grade || '',
        codeEdited: buildCodeEdited,
        notesReady: hasText(buildSaved.notes),
        testsPass: buildAllTestsPass,
        tests: buildSaved.lastResult || null,
      },
      debug: {
        id: 'debug-math-line-model',
        status: debugSaved.status || 'not-started',
        explanationWritten: Boolean(debugSaved.explanation?.trim()),
        testsPassed: debugSaved.lastResult?.testResults?.filter((test) => test.passed).length || 0,
        testsTotal: debugSaved.lastResult?.testResults?.length || 0,
      },
    },
    userFeedback: {
      friction: pilotState.friction || '',
      feedback: pilotState.feedback || '',
    },
  };
  const exportJson = JSON.stringify(pilotResults, null, 2);

  function updateAnswer(group, index, value) {
    updatePilot({
      [group]: {
        ...(pilotState[group] || {}),
        [index]: value,
      },
    });
  }

  async function copyResults() {
    try {
      await navigator.clipboard.writeText(exportJson);
      setCopyStatus('Pilot JSON copied.');
    } catch {
      setCopyStatus('Copy failed. Select the JSON text manually.');
    }
  }

  function nextStep() {
    if (!currentReadiness.ready) {
      updatePilot({ blockedMessage: currentReadiness.message });
      return;
    }

    const next = PILOT_STEPS[currentIndex + 1];
    updatePilot({
      blockedMessage: '',
      lastCompletedStepId: currentStep.id,
      steps: {
        ...(pilotState.steps || {}),
        [currentStep.id]: true,
      },
      currentStepId: next?.id || currentStep.id,
    });

    if (!next) completePilot();
  }

  function renderCurrentTask() {
    if (currentStep.id === 'pre-test') {
      return h(
        'div',
        { className: 'space-y-4' },
        h(RangeSlider, { label: 'Before confidence', value: Number(pilotState.confidenceBefore || 1), min: 1, max: 5, step: 1, onChange: (value) => updatePilot({ confidenceBefore: String(value) }) }),
        h(PilotQuestionSet, { id: 'pilot-pre-test', title: 'Pre-test questions', questions: PILOT_PRE_QUESTIONS, answers: pilotState.preAnswers || {}, onChange: (index, value) => updateAnswer('preAnswers', index, value) }),
      );
    }

    if (currentStep.id === 'lesson') {
      return h(
        'div',
        { className: 'space-y-4' },
        h(PlanRow, { label: 'Assigned lesson' }, assignedLesson ? `${assignedLesson.subjectTitle || assignedLesson.subject}: ${assignedLesson.title}` : 'Math: Inputs and Outputs'),
        h('a', { className: 'inline-flex rounded-lg bg-cobalt px-4 py-2.5 text-sm font-bold text-white shadow-soft transition hover:bg-blue-800', href: '#math-inputs-and-outputs' }, 'Open assigned lesson'),
      );
    }

    if (currentStep.id === 'lab') {
      return h(
        'div',
        { className: 'space-y-4' },
        h(PlanRow, { label: 'Assigned lab' }, 'Function Visualizer: predict, test, reveal explanation, self-grade, and reflect.'),
        h('a', { className: 'inline-flex rounded-lg bg-cobalt px-4 py-2.5 text-sm font-bold text-white shadow-soft transition hover:bg-blue-800', href: '#labs' }, 'Open Function Visualizer'),
      );
    }

    if (currentStep.id === 'applied-task') {
      return h(
        'div',
        { className: 'space-y-4' },
        h(PlanRow, { label: 'Applied task' }, 'Build Mode: Function Rule Builder. This pilot uses Build instead of Debug for the assigned function concept.'),
        h('a', { className: 'inline-flex rounded-lg bg-cobalt px-4 py-2.5 text-sm font-bold text-white shadow-soft transition hover:bg-blue-800', href: '#build-function-rule-builder' }, 'Open applied task'),
      );
    }

    if (currentStep.id === 'post-test') {
      return h(
        'div',
        { className: 'space-y-4' },
        h(RangeSlider, { label: 'After confidence', value: Number(pilotState.confidenceAfter || 1), min: 1, max: 5, step: 1, onChange: (value) => updatePilot({ confidenceAfter: String(value) }) }),
        h(PilotQuestionSet, { id: 'pilot-post-test', title: 'Post-test questions', questions: PILOT_POST_QUESTIONS, answers: pilotState.postAnswers || {}, onChange: (index, value) => updateAnswer('postAnswers', index, value) }),
      );
    }

    return h(
      'div',
      { className: 'space-y-4' },
      h('label', { className: 'block text-sm font-bold uppercase tracking-wide text-slate-500' }, 'Friction feedback'),
      h('textarea', { className: 'min-h-24 w-full resize-y rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-ink outline-none transition focus:border-cobalt focus:bg-white focus:ring-2 focus:ring-blue-100', placeholder: 'Where did the learner hesitate, get confused, or need help?', value: pilotState.friction || '', onChange: (event) => updatePilot({ friction: event.target.value }) }),
      h('label', { className: 'block text-sm font-bold uppercase tracking-wide text-slate-500' }, 'General pilot notes'),
      h('textarea', { className: 'min-h-24 w-full resize-y rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-ink outline-none transition focus:border-cobalt focus:bg-white focus:ring-2 focus:ring-blue-100', placeholder: 'What seemed effective? What should change before the next pilot?', value: pilotState.feedback || '', onChange: (event) => updatePilot({ feedback: event.target.value }) }),
    );
  }

  return h(
    'section',
    { className: 'space-y-4 scroll-mt-6', id: 'pilot-test' },
    h(
      'div',
      { className: 'rounded-lg border border-slate-200 bg-white p-5 shadow-sm' },
      h('p', { className: 'text-sm font-semibold uppercase tracking-wide text-fern' }, 'Pilot Test Mode'),
      h('h2', { className: 'mt-1 text-2xl font-bold' }, '30-minute guided learning test'),
      h('p', { className: 'mt-3 max-w-3xl text-sm leading-7 text-slate-700' }, 'A focused pilot path: pre-test, one lesson, one lab, one applied build task, post-test, and feedback. The next step unlocks only when the current learning action is done.'),
      h(
        'div',
        { className: 'mt-4 flex flex-wrap gap-2' },
        h(Pill, { tone: started ? 'green' : 'amber' }, started ? `Started ${elapsedMinutes} min ago` : 'Not started'),
        h(Pill, { tone: completedSteps === PILOT_STEPS.length ? 'green' : 'blue' }, `${completedSteps}/${PILOT_STEPS.length} steps`),
        pilotState.completedAt ? h(Pill, { tone: 'green' }, 'Completed') : null,
      ),
      h(
        'div',
        { className: 'mt-5 flex flex-wrap gap-2' },
        h('button', { className: 'rounded-lg bg-cobalt px-4 py-2.5 text-sm font-bold text-white shadow-soft transition hover:bg-blue-800', onClick: onStartPilot }, started ? 'Resume Pilot Test' : 'Start Pilot Test'),
        h('button', { className: 'rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-bold text-amber-800 transition hover:bg-amber-100', onClick: onResetPilot }, 'Reset Pilot Test'),
        h('button', { className: 'rounded-lg border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-bold text-rose-700 transition hover:bg-rose-100', onClick: onForceResetAllLocalData }, 'Force Reset All Local Data'),
        pilotState.completedAt ? h('button', { className: 'rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50', onClick: copyResults }, 'Copy JSON') : null,
      ),
      h('p', { className: 'mt-3 text-xs font-semibold leading-5 text-slate-500' }, 'Pilot reset clears only the pilot-test save key. The force reset button is a temporary development tool for clearing broader local data.'),
    ),
    started
      ? h(
          'div',
          { className: 'space-y-4' },
          h(
            'section',
            { className: 'rounded-lg border border-slate-200 bg-white p-4 shadow-sm' },
            h('div', { className: 'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between' }, h('div', null, h('p', { className: 'text-sm font-bold uppercase tracking-wide text-slate-500' }, `Step ${currentIndex + 1} of ${PILOT_STEPS.length}`), h('h3', { className: 'mt-1 text-xl font-bold text-ink' }, currentStep.title), h('p', { className: 'mt-2 text-sm leading-6 text-slate-600' }, currentStep.detail)), h(Pill, { tone: currentReadiness.ready ? 'green' : 'amber' }, currentReadiness.ready ? 'Ready for next step' : 'Action needed')),
            h('div', { className: 'mt-4 h-2 overflow-hidden rounded-full bg-slate-100' }, h('div', { className: 'h-full rounded-full bg-cobalt transition-all', style: { width: `${Math.round(((currentIndex + (currentReadiness.ready ? 1 : 0)) / PILOT_STEPS.length) * 100)}%` } })),
          ),
          pilotState.lastCompletedStepId ? h(ReinforcementPanel, { kind: 'pilot', item: { title: PILOT_STEPS.find((step) => step.id === pilotState.lastCompletedStepId)?.title || 'pilot step' } }) : null,
          h(
            'section',
            { className: 'space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm' },
            renderCurrentTask(),
            h(CompletionChecklist, { title: 'Current step requirements', items: currentReadiness.checklist }),
            pilotState.blockedMessage && !currentReadiness.ready ? h('p', { className: 'rounded-lg bg-amber-50 p-3 text-sm font-semibold text-amber-900' }, pilotState.blockedMessage) : null,
            h(
              'button',
              {
                className: `inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold text-white shadow-soft transition ${currentReadiness.ready ? 'bg-cobalt hover:bg-blue-800' : 'cursor-not-allowed bg-slate-300'}`,
                disabled: !currentReadiness.ready,
                onClick: nextStep,
              },
              currentStep.id === 'feedback' ? 'Finish Pilot Test' : 'Next Step',
            ),
          ),
          h(
            'section',
            { className: 'rounded-lg border border-slate-200 bg-white p-4 shadow-sm' },
            h('h3', { className: 'text-sm font-bold uppercase tracking-wide text-slate-500' }, 'Observed outcomes'),
            h(
              'div',
              { className: 'mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4' },
              h(Metric, { label: 'Lesson quiz', value: quizCorrect ? 'Correct' : typeof lessonSaved.quizAnswer === 'number' ? 'Incorrect' : 'Not answered', color: quizCorrect ? '#047857' : '#c56b35' }),
              h(Metric, { label: 'Lab reflection', value: labReady ? 'Done' : 'Missing' }),
              h(Metric, { label: 'Build tests', value: buildSaved.lastResult ? `${buildSaved.lastResult.testResults.filter((test) => test.passed).length}/${buildSaved.lastResult.testResults.length}` : 'Not run' }),
              h(Metric, { label: 'Pilot steps', value: `${completedSteps}/${PILOT_STEPS.length}` }),
            ),
          ),
          h(
            'section',
            { className: 'rounded-lg border border-slate-200 bg-white p-4 shadow-sm' },
            h('div', { className: 'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between' }, h('h3', { className: 'text-sm font-bold uppercase tracking-wide text-slate-500' }, 'Export pilot results as JSON'), h('button', { className: 'rounded-lg bg-cobalt px-3 py-2 text-sm font-bold text-white transition hover:bg-blue-800', onClick: copyResults }, 'Copy JSON')),
            copyStatus ? h('p', { className: 'mt-2 text-sm font-semibold text-emerald-700' }, copyStatus) : null,
            h('textarea', { className: 'mt-3 min-h-72 w-full resize-y rounded-lg border border-slate-200 bg-slate-950 p-3 font-mono text-xs leading-5 text-emerald-50 outline-none', readOnly: true, value: exportJson }),
          ),
        )
      : h('div', { className: 'rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm leading-7 text-blue-950' }, 'Start the pilot to enter the guided flow. The app will focus navigation and show one task at a time.'),
  );
}


