import React, { useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronRight } from 'lucide-react';
import { buildChallenges } from '../buildChallenges.js';
import { FOUNDATION_CONCEPTS } from '../foundationContent.js';
import { icon, Pill, SelfGradeButtons, ReinforcementPanel, FilterSelect } from './shared.js';
import { AiFeedbackPanel, AiTutorChat } from './AiTutor.js';
import { EmptyLessonsState } from './LessonCard.js';
import { PlanRow } from './DailyCoach.js';

const h = React.createElement;

export function statusLabel(status) {
  if (status === 'complete') return 'Complete';
  if (status === 'in-progress') return 'In Progress';
  return 'Not Started';
}

export function hasText(value, min = 40) {
  return (value || '').trim().length >= min;
}

function needsConcreteExample(value) {
  const text = (value || '').toLowerCase();
  const abstractPhrases = ['machine learning', 'ai', 'artificial intelligence', 'systems', 'models', 'algorithm', 'algorithms', 'data'];
  const hasAbstractPhrase = abstractPhrases.some((phrase) => text.includes(phrase));
  const hasConcreteSignal = /\d/.test(text) || /\b(for example|example|such as|like|if x|when x|input|output)\b/.test(text);
  return hasAbstractPhrase && !hasConcreteSignal;
}

function terminologyWarnings(lesson, responseText) {
  const lessonText = `${lesson.title} ${lesson.bigIdea} ${lesson.whyItMatters} ${lesson.mentalModel} ${lesson.guidedExample} ${lesson.bridge}`.toLowerCase();
  const response = (responseText || '').toLowerCase();
  const warnings = [];
  const involvesSlopeIntercept = lessonText.includes('slope') && lessonText.includes('intercept');

  if (involvesSlopeIntercept && /\bx[-\s]?intercept\b/.test(response)) {
    warnings.push('Check your terminology: this lesson uses the y-intercept, not the x-intercept.');
  }

  return warnings;
}

export function testsPassed(result, testCases = []) {
  const total = testCases.length;
  const passed = result?.testResults?.filter((test) => test.passed).length || 0;
  return total > 0 && passed === total;
}

function parseBuildAnswer(value) {
  const trimmed = (value || '').trim();
  if (!trimmed) return '';
  try {
    return JSON.parse(trimmed);
  } catch {
    const numeric = Number(trimmed);
    return Number.isNaN(numeric) ? trimmed.toLowerCase() : numeric;
  }
}

function buildReasoningPrompt(challenge) {
  const firstTest = challenge.testCases?.[0];
  if (!firstTest) {
    return {
      question: `Before coding, predict the key output for ${challenge.concept}.`,
      expected: '',
    };
  }

  return {
    question: `No code yet: what should ${firstTest.expression} return?`,
    expected: firstTest.expected,
  };
}

function isBuildReasoningCorrect(answer, expected) {
  return valuesEqual(parseBuildAnswer(answer), expected);
}

export function completionItems(items) {
  return items.map(([label, done]) => ({ label, done: Boolean(done) }));
}

export function CompletionChecklist({ title = 'Before marking complete', items }) {
  const remaining = items.filter((item) => !item.done);

  return h(
    'section',
    { className: `rounded-lg border p-4 ${remaining.length ? 'border-amber-100 bg-amber-50' : 'border-emerald-100 bg-emerald-50'}` },
    h('h4', { className: `text-sm font-bold uppercase tracking-wide ${remaining.length ? 'text-amber-800' : 'text-emerald-800'}` }, title),
    h(
      'ul',
      { className: `mt-3 space-y-2 text-sm leading-6 ${remaining.length ? 'text-amber-950' : 'text-emerald-950'}` },
      items.map((item) => h('li', { className: 'flex gap-2', key: item.label }, h('span', { className: 'font-bold' }, item.done ? 'Done' : 'Todo'), h('span', null, item.label))),
    ),
    remaining.length ? h('p', { className: 'mt-3 text-sm font-semibold text-amber-900' }, `Still needed: ${remaining.map((item) => item.label).join('; ')}.`) : null,
  );
}


function detectKeyConcepts(challenge, state) {
  const text = `${state.pseudocode || ''} ${state.notes || ''}`.toLowerCase();

  return challenge.keyConcepts.map((concept) => ({
    label: concept.label,
    present: concept.keywords.some((keyword) => text.includes(keyword.toLowerCase())),
  }));
}

function BasicFeedback({ detected }) {
  const present = detected.filter((item) => item.present);
  const missing = detected.filter((item) => !item.present);

  return h(
    'section',
    { className: 'rounded-lg border border-slate-200 p-4' },
    h('h4', { className: 'text-sm font-bold uppercase tracking-wide text-slate-500' }, 'Basic feedback'),
    h('p', { className: 'mt-2 text-sm leading-6 text-slate-600' }, 'This is keyword-based feedback, not AI grading. Use it as a checklist, then self-assess honestly.'),
    h(
      'div',
      { className: 'mt-3 grid gap-3 md:grid-cols-2' },
      h(
        'div',
        { className: 'rounded-lg bg-emerald-50 p-3' },
        h('p', { className: 'text-sm font-bold text-emerald-800' }, 'Concepts that appear present'),
        h('ul', { className: 'mt-2 space-y-1 text-sm text-emerald-900' }, present.length ? present.map((item) => h('li', { key: item.label }, item.label)) : h('li', null, 'None detected yet')),
      ),
      h(
        'div',
        { className: 'rounded-lg bg-amber-50 p-3' },
        h('p', { className: 'text-sm font-bold text-amber-800' }, 'Concepts that may be missing'),
        h('ul', { className: 'mt-2 space-y-1 text-sm text-amber-900' }, missing.length ? missing.map((item) => h('li', { key: item.label }, item.label)) : h('li', null, 'All key concepts detected')),
      ),
    ),
  );
}

function valuesEqual(actual, expected) {
  if (typeof actual === 'number' && typeof expected === 'number') {
    return Math.abs(actual - expected) < 1e-9;
  }

  if (actual && expected && typeof actual === 'object' && typeof expected === 'object') {
    const actualKeys = Object.keys(actual);
    const expectedKeys = Object.keys(expected);
    return (
      actualKeys.length === expectedKeys.length &&
      expectedKeys.every((key) => valuesEqual(actual[key], expected[key]))
    );
  }

  return JSON.stringify(actual) === JSON.stringify(expected);
}

function runJavaScriptTests(code, testCases = []) {
  const logs = [];
  const testResults = [];
  const testConsole = {
    log: (...items) => logs.push(items.map((item) => (typeof item === 'string' ? item : JSON.stringify(item))).join(' ')),
  };

  for (const test of testCases) {
    try {
      const actual = Function('console', `"use strict";\n${code}\nreturn (${test.expression});`)(testConsole);
      testResults.push({
        ...test,
        actual,
        passed: valuesEqual(actual, test.expected),
      });
    } catch (error) {
      testResults.push({
        ...test,
        actual: error.message,
        passed: false,
        error: true,
      });
    }
  }

  return { logs, testResults };
}

export function CodeRunner({ challenge, code, onCodeChange, onResetCode, onResult, title = 'Coding Environment', description = 'Write JavaScript, run the tests, and use the console output to debug.', initialResult = null, codeEdited = true, returnPrompt = 'What should this function return for each test case?' }) {
  const [result, setResult] = useState(initialResult);

  useEffect(() => {
    setResult(initialResult || null);
  }, [initialResult]);

  function runCode() {
    if (!codeEdited) return;
    const nextResult = runJavaScriptTests(code, challenge.testCases || []);
    setResult(nextResult);
    onResult?.(nextResult);
  }

  const passed = result?.testResults.filter((test) => test.passed).length || 0;
  const total = challenge.testCases?.length || 0;

  return h(
    'section',
    { className: 'rounded-lg border border-slate-200 bg-slate-950 p-4 text-white' },
    h(
      'div',
      { className: 'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between' },
      h('div', null, h('h4', { className: 'text-sm font-bold uppercase tracking-wide text-slate-300' }, title), h('p', { className: 'mt-1 text-sm leading-6 text-slate-300' }, description)),
      h(
        'div',
        { className: 'flex flex-wrap gap-2' },
        h('button', { className: `rounded-lg px-3 py-2 text-sm font-bold text-white transition ${codeEdited ? 'bg-emerald-600 hover:bg-emerald-500' : 'cursor-not-allowed bg-slate-600'}`, disabled: !codeEdited, onClick: runCode }, 'Run Tests'),
        h('button', { className: 'rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm font-bold text-slate-100 transition hover:bg-slate-800', onClick: onResetCode }, 'Reset code'),
      ),
    ),
    !codeEdited ? h('p', { className: 'mt-3 rounded-lg bg-amber-100 p-3 text-sm font-semibold text-amber-950' }, 'Edit the starter code before running tests. This makes sure you engage with the implementation instead of checking the untouched scaffold.') : null,
    h('textarea', {
      className: 'mt-4 min-h-64 w-full resize-y rounded-lg border border-slate-700 bg-slate-900 p-4 font-mono text-sm leading-6 text-emerald-50 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-900',
      spellCheck: false,
      value: code,
      onChange: (event) => onCodeChange(event.target.value),
    }),
    h(
      'div',
      { className: 'mt-4 grid gap-3 lg:grid-cols-2' },
      h(
        'div',
        { className: 'rounded-lg border border-slate-700 bg-slate-900 p-3' },
        h('p', { className: 'text-xs font-bold uppercase tracking-wide text-slate-400' }, 'Basic test cases'),
        h('p', { className: 'mt-2 rounded-lg bg-slate-800 p-2 text-sm leading-6 text-slate-200' }, returnPrompt),
        h(
          'div',
          { className: 'mt-3 space-y-2' },
          (challenge.testCases || []).map((test) =>
            h('div', { className: 'rounded-lg bg-slate-800 p-2 text-sm leading-6 text-slate-200', key: test.name }, h('p', { className: 'font-bold text-white' }, test.name), h('p', null, test.expression), h('p', null, `Expected: ${JSON.stringify(test.expected)}`)),
          ),
        ),
      ),
      h(
        'div',
        { className: 'rounded-lg border border-slate-700 bg-black p-3' },
        h('p', { className: 'text-xs font-bold uppercase tracking-wide text-slate-400' }, 'Output console'),
        result
          ? h(
              'div',
              { className: 'mt-3 space-y-2 font-mono text-sm leading-6' },
              h('p', { className: passed === total ? 'text-emerald-300' : 'text-amber-300' }, `${passed}/${total} tests passed`),
              result.testResults.map((test) =>
                h(
                  'div',
                  { className: `rounded-lg p-2 ${test.passed ? 'bg-emerald-950 text-emerald-100' : 'bg-rose-950 text-rose-100'}`, key: test.name },
                  h('p', { className: 'font-bold' }, `${test.passed ? 'PASS' : 'FAIL'} ${test.name}`),
                  h('p', null, `Expected: ${JSON.stringify(test.expected)}`),
                  h('p', null, `Actual: ${JSON.stringify(test.actual)}`),
                  !test.passed ? h('p', { className: 'mt-1 text-rose-100' }, test.error ? 'Plain English: the code threw an error before it could return the expected value.' : 'Plain English: the function returned a different value than the test expected. Trace the inputs and return statement.') : null,
                ),
              ),
              result.logs.length ? h('div', { className: 'border-t border-slate-800 pt-2 text-slate-300' }, result.logs.map((line, index) => h('p', { key: `${line}-${index}` }, line))) : null,
            )
          : h('p', { className: 'mt-3 text-sm leading-6 text-slate-400' }, 'Run code to see test results here.'),
      ),
    ),
  );
}

function BuildInterventionPanel({ challenge, reason }) {
  return h(
    'section',
    { className: 'rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950' },
    h('h4', { className: 'text-sm font-bold uppercase tracking-wide text-amber-800' }, 'Need a smaller step?'),
    h('p', { className: 'mt-2 font-semibold' }, reason),
    h('div', { className: 'mt-3 grid gap-3 md:grid-cols-3' },
      h('div', { className: 'rounded-lg bg-white p-3' }, h('p', { className: 'font-bold text-amber-900' }, 'Hint'), h('p', { className: 'mt-1' }, challenge.hint)),
      h('div', { className: 'rounded-lg bg-white p-3' }, h('p', { className: 'font-bold text-amber-900' }, 'Simpler version'), h('p', { className: 'mt-1' }, `Name the inputs first. Then do one operation. Then return the result.`)),
      h('div', { className: 'rounded-lg bg-white p-3' }, h('p', { className: 'font-bold text-amber-900' }, 'Example'), h('p', { className: 'mt-1' }, challenge.expectedAnswer)),
    ),
  );
}

function BuildChallengeCard({ challenge, saved, updateChallenge, chatStore }) {
  const [open, setOpen] = useState(false);
  const [idle, setIdle] = useState(false);
  const state = {
    pseudocode: '',
    code: challenge.starterCode || '',
    notes: '',
    status: 'not-started',
    hintViewed: false,
    lastResult: null,
    ownershipReflection: {},
    bridgeAnswer: '',
    bridgeCorrect: false,
    buildStep: 'bridge',
    logicBlank: '',
    failedRuns: 0,
    ...(saved || {}),
  };
  const complete = state.status === 'complete';
  const beginner = challenge.difficulty === 'Beginner';
  const reasoning = buildReasoningPrompt(challenge);
  const detected = detectKeyConcepts(challenge, state);
  const codeEdited = (state.code || '') !== (challenge.starterCode || '');
  const testsRun = Boolean(state.lastResult);
  const allTestsPass = testsPassed(state.lastResult, challenge.testCases || []);
  const notesReady = hasText(state.notes);
  const ownershipReflection = state.ownershipReflection || {};
  const ownershipReflectionText = `${ownershipReflection.what || ''} ${ownershipReflection.why || ''} ${ownershipReflection.where || ''}`;
  const ownershipReady = hasText(ownershipReflectionText);
  const bridgeCorrect = Boolean(state.bridgeCorrect || isBuildReasoningCorrect(state.bridgeAnswer, reasoning.expected));
  const logicReady = beginner ? Boolean(state.logicBlank?.trim()) : Boolean(state.pseudocode?.trim());
  const canWriteCode = bridgeCorrect && (!beginner || (logicReady && notesReady));
  const showStuckPanel = idle || (!codeEdited && state.buildStep === 'code') || (state.failedRuns || 0) >= 2;
  const buildChecklist = completionItems([
    ['Answer the reasoning bridge correctly', bridgeCorrect],
    [beginner ? 'Complete fill-in and explanation steps' : 'Unlock coding with the reasoning bridge', canWriteCode],
    ['Edit the starter code', codeEdited],
    ['Run the tests', testsRun],
    ['Make all tests pass', allTestsPass],
    ['Write implementation notes with at least 40 characters', notesReady],
    ['Complete ownership reflection with at least 40 characters total', ownershipReady],
  ]);
  const buildReady = buildChecklist.every((item) => item.done);

  useEffect(() => {
    if (!open || complete) return undefined;
    setIdle(false);
    const timer = window.setTimeout(() => setIdle(true), 10000);
    return () => window.clearTimeout(timer);
  }, [open, complete, state.pseudocode, state.code, state.notes, state.logicBlank, state.bridgeAnswer, state.lastResult]);

  function setStep(step) {
    updateChallenge(challenge.id, { buildStep: step });
  }

  function updateBridgeAnswer(value) {
    updateChallenge(challenge.id, {
      bridgeAnswer: value,
      bridgeCorrect: isBuildReasoningCorrect(value, reasoning.expected),
    });
  }

  function handleTestResult(result) {
    const passed = testsPassed(result, challenge.testCases || []);
    updateChallenge(challenge.id, {
      lastResult: result,
      lastRunAt: new Date().toISOString(),
      failedRuns: passed ? 0 : (state.failedRuns || 0) + 1,
    });
  }

  function updateOwnershipReflection(field, value) {
    updateChallenge(challenge.id, {
      ownershipReflection: {
        ...ownershipReflection,
        [field]: value,
      },
    });
  }

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
        h('div', { className: 'mb-2 flex flex-wrap gap-2' }, h(Pill, { tone: complete ? 'green' : state.status === 'in-progress' ? 'amber' : 'slate' }, statusLabel(state.status)), h(Pill, { tone: 'blue' }, challenge.subject), h(Pill, { tone: 'slate' }, challenge.difficulty)),
        h('h3', { className: 'text-lg font-bold text-ink' }, challenge.concept),
        h('p', { className: 'mt-1 text-sm leading-6 text-slate-600' }, challenge.goal),
      ),
      icon(open ? ChevronDown : ChevronRight, { className: 'shrink-0 text-slate-500' }),
    ),
    open
      ? h(
          'div',
          { className: 'space-y-4 border-t border-slate-200 px-5 py-5' },
          h(PlanRow, { label: 'Concept' }, challenge.concept),
          h(PlanRow, { label: 'Task' }, challenge.goal),
          h(
            'section',
            { className: 'rounded-lg border border-slate-200 bg-slate-50 p-4' },
            h('h4', { className: 'text-sm font-bold uppercase tracking-wide text-slate-500' }, beginner ? 'Guided build path' : 'Build path'),
            h(
              'div',
              { className: 'mt-3 flex flex-wrap gap-2' },
              h(Pill, { tone: bridgeCorrect ? 'green' : 'amber' }, '1. Reason'),
              h(Pill, { tone: logicReady ? 'green' : bridgeCorrect ? 'blue' : 'slate' }, beginner ? '2. Fill logic' : '2. Plan'),
              h(Pill, { tone: notesReady ? 'green' : logicReady ? 'blue' : 'slate' }, '3. Explain'),
              h(Pill, { tone: codeEdited ? 'green' : canWriteCode ? 'blue' : 'slate' }, '4. Code'),
            ),
          ),
          h(
            'section',
            { className: 'rounded-lg border border-slate-200 p-4' },
            h('h4', { className: 'text-sm font-bold uppercase tracking-wide text-slate-500' }, 'Bridge question'),
            h('p', { className: 'mt-2 text-sm font-semibold leading-6 text-ink' }, reasoning.question),
            h('p', { className: 'mt-1 text-sm leading-6 text-slate-600' }, 'Predict the output before coding.'),
            h('input', {
              className: 'mt-3 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-ink outline-none transition focus:border-cobalt focus:bg-white focus:ring-2 focus:ring-blue-100',
              placeholder: 'Type the expected result',
              value: state.bridgeAnswer || '',
              onChange: (event) => updateBridgeAnswer(event.target.value),
            }),
            state.bridgeAnswer?.trim()
              ? h('p', { className: `mt-2 text-sm font-bold ${bridgeCorrect ? 'text-emerald-700' : 'text-amber-700'}` }, bridgeCorrect ? 'Correct. Now build the logic.' : 'Not yet. Recheck the inputs and the rule.')
              : null,
          ),
          beginner
            ? h(
                'section',
                { className: `rounded-lg border p-4 ${bridgeCorrect ? 'border-slate-200' : 'border-slate-200 bg-slate-50 opacity-70'}` },
                h('h4', { className: 'text-sm font-bold uppercase tracking-wide text-slate-500' }, 'Step 1: Fill in the logic'),
                h('p', { className: 'mt-2 text-sm leading-6 text-slate-700' }, challenge.starterPrompt),
                h('p', { className: 'mt-2 rounded-lg bg-blue-50 p-3 text-sm font-semibold text-blue-950' }, 'Complete this idea: result = ____'),
                h('textarea', {
                  className: 'mt-3 min-h-20 w-full resize-y rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-ink outline-none transition focus:border-cobalt focus:bg-white focus:ring-2 focus:ring-blue-100',
                  disabled: !bridgeCorrect,
                  placeholder: 'Write the operation in plain English or code.',
                  value: state.logicBlank || '',
                  onChange: (event) => updateChallenge(challenge.id, { logicBlank: event.target.value, pseudocode: event.target.value, buildStep: 'explain' }),
                }),
              )
            : h(
                'section',
                { className: `rounded-lg border p-4 ${bridgeCorrect ? 'border-slate-200' : 'border-slate-200 bg-slate-50 opacity-70'}` },
                h('label', { className: 'text-sm font-bold uppercase tracking-wide text-slate-500' }, 'Plan'),
                h('p', { className: 'mt-2 text-sm leading-6 text-slate-700' }, 'Write the steps first. Keep it short: inputs, operation, output.'),
                h('textarea', {
                  className: 'mt-3 min-h-28 w-full resize-y rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-ink outline-none transition focus:border-cobalt focus:bg-white focus:ring-2 focus:ring-blue-100',
                  disabled: !bridgeCorrect,
                  placeholder: 'Inputs -> operation -> output',
                  value: state.pseudocode,
                  onChange: (event) => updateChallenge(challenge.id, { pseudocode: event.target.value, buildStep: 'explain' }),
                }),
              ),
          h(
            'section',
            { className: `rounded-lg border p-4 ${logicReady ? 'border-slate-200' : 'border-slate-200 bg-slate-50 opacity-70'}` },
            h('label', { className: 'text-sm font-bold uppercase tracking-wide text-slate-500' }, beginner ? 'Step 2: Explain logic' : 'Explain logic'),
            h('p', { className: 'mt-2 text-sm leading-6 text-slate-700' }, 'Explain what your solution will do. Use at least 40 characters.'),
            h('textarea', {
              className: 'mt-3 min-h-24 w-full resize-y rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-ink outline-none transition focus:border-cobalt focus:bg-white focus:ring-2 focus:ring-blue-100',
              disabled: !logicReady,
              placeholder: 'Name the inputs, the operation, and the output.',
              value: state.notes,
              onChange: (event) => updateChallenge(challenge.id, { notes: event.target.value, buildStep: 'code' }),
            }),
          ),
          h(
            'div',
            { className: 'rounded-lg border border-blue-100 bg-blue-50 p-4' },
            h(
              'button',
              {
                className: 'rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-100',
                onClick: () => updateChallenge(challenge.id, { hintViewed: true }),
              },
              state.hintViewed ? 'Hint shown' : 'Reveal hint',
            ),
            state.hintViewed ? h('p', { className: 'mt-3 text-sm leading-7 text-blue-950' }, challenge.hint) : null,
          ),
          h(
            'div',
            { className: 'rounded-lg border border-blue-100 bg-blue-50 p-4' },
            h(
              'button',
              {
                className: 'rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-100',
                onClick: () => updateChallenge(challenge.id, { modelAnswerViewed: true }),
              },
              state.modelAnswerViewed ? 'Model answer shown' : 'Show Model Answer',
            ),
            state.modelAnswerViewed
              ? h('p', { className: 'mt-3 whitespace-pre-wrap text-sm leading-7 text-blue-950' }, challenge.expectedAnswer)
              : null,
          ),
          showStuckPanel
            ? h(BuildInterventionPanel, {
                challenge,
                reason: (state.failedRuns || 0) >= 2 ? 'The tests have failed a few times. Shrink the problem and compare one input to one expected output.' : idle ? 'You have been paused for a bit. Try the smaller version below.' : 'Coding is locked until you change the starter code.',
              })
            : null,
          canWriteCode
            ? h(CodeRunner, {
                challenge,
                code: state.code || challenge.starterCode || '',
                codeEdited,
                initialResult: state.lastResult,
                returnPrompt: 'What should this function return for each test input?',
                onCodeChange: (code) => updateChallenge(challenge.id, { code, buildStep: 'code' }),
                onResetCode: () => updateChallenge(challenge.id, { code: challenge.starterCode || '', lastResult: null, failedRuns: 0 }),
                onResult: handleTestResult,
              })
            : h(
                'section',
                { className: 'rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700' },
                h('h4', { className: 'text-sm font-bold uppercase tracking-wide text-slate-500' }, beginner ? 'Step 3: Write full solution' : 'Code locked'),
                h('p', { className: 'mt-2' }, 'Coding unlocks after the reasoning bridge and explanation steps are complete. This keeps the build connected to the concept instead of turning into guessing.'),
              ),
          h('div', { className: 'flex flex-wrap gap-2' }, h(Pill, { tone: codeEdited ? 'green' : 'amber' }, `Code edited: ${codeEdited ? 'Yes' : 'No'}`), h(Pill, { tone: testsRun ? 'blue' : 'slate' }, testsRun ? 'Tests run' : 'Tests not run'), h(Pill, { tone: allTestsPass ? 'green' : 'amber' }, allTestsPass ? 'Tests passed' : 'Tests need work')),
          allTestsPass
            ? h(
                'section',
                { className: 'rounded-lg border border-emerald-100 bg-emerald-50 p-4' },
                h('h4', { className: 'text-sm font-bold uppercase tracking-wide text-emerald-800' }, 'Ownership reflection'),
                h('p', { className: 'mt-2 text-sm leading-6 text-emerald-950' }, 'Before marking complete, prove this is yours. Answer all three prompts with at least 40 characters total.'),
                [
                  ['what', 'What does this function do?'],
                  ['why', 'Why does it work?'],
                  ['where', 'Where could it be used?'],
                ].map(([field, label]) =>
                  h(
                    'label',
                    { className: 'mt-3 block', key: field },
                    h('span', { className: 'text-sm font-bold text-emerald-900' }, label),
                    h('textarea', {
                      className: 'mt-2 min-h-20 w-full resize-y rounded-lg border border-emerald-200 bg-white p-3 text-sm leading-6 text-ink outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100',
                      placeholder: 'Write in your own words.',
                      value: ownershipReflection[field] || '',
                      onChange: (event) => updateOwnershipReflection(field, event.target.value),
                    }),
                  ),
                ),
                h('p', { className: `mt-3 text-sm font-bold ${ownershipReady ? 'text-emerald-800' : 'text-amber-800'}` }, ownershipReady ? 'Ownership reflection complete.' : `${ownershipReflectionText.trim().length}/40 characters written.`),
              )
            : h('p', { className: 'rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-600' }, 'Ownership reflection unlocks after all tests pass.'),
          h(BasicFeedback, { detected }),
          h(AiFeedbackPanel, {
            inputType: 'build mode pseudocode',
            userInput: `${state.pseudocode}\n\nNotes: ${state.notes}`,
            expectedConcept: `${challenge.expectedAnswer}\nKey concepts: ${challenge.keyConcepts.map((concept) => concept.label).join(', ')}`,
            contextTitle: challenge.concept,
            fallbackFeedback: {
              correctnessScore: Math.round((detected.filter((item) => item.present).length / Math.max(1, detected.length)) * 100),
              clarityScore: Math.min(100, Math.max(30, Math.round(`${state.pseudocode} ${state.notes}`.trim().split(/\s+/).filter(Boolean).length * 4))),
              missingConcepts: detected.filter((item) => !item.present).map((item) => item.label),
              suggestions: ['Compare your pseudocode with the model answer.', 'Add any missing inputs, operations, or output steps.', 'Write one note about edge cases.'],
              strengths: detected.filter((item) => item.present).map((item) => `Includes ${item.label}`),
              fallback: true,
            },
          }),
          h(AiTutorChat, {
            chatId: `build-${challenge.id}`,
            contextTitle: `Build Mode: ${challenge.concept}`,
            expectedConcept: `${challenge.expectedAnswer}\nKey concepts: ${challenge.keyConcepts.map((concept) => concept.label).join(', ')}`,
            userWork: `Pseudocode:\n${state.pseudocode || 'not written yet'}\n\nNotes:\n${state.notes || 'not written yet'}\n\nCode:\n${state.code || 'not written yet'}`,
            chatStore,
          }),
          h(
            'section',
            { className: 'rounded-lg border border-slate-200 p-4' },
            h('h4', { className: 'text-sm font-bold uppercase tracking-wide text-slate-500' }, 'Self-grade'),
            h('p', { className: 'mt-2 text-sm leading-6 text-slate-600' }, 'Use the model answer, checklist, and basic feedback to grade your own work.'),
            h(SelfGradeButtons, {
              value: state.grade,
              onChange: (grade) =>
                updateChallenge(challenge.id, {
                  grade,
                  detectedKeyConcepts: detected,
                }),
            }),
          ),
          h(
            'section',
            { className: 'rounded-lg border border-slate-200 p-4' },
            h('h4', { className: 'text-sm font-bold uppercase tracking-wide text-slate-500' }, 'Self-check checklist'),
            h(
              'ul',
              { className: 'mt-3 space-y-2 text-sm leading-6 text-slate-700' },
              challenge.checklist.map((item) => h('li', { className: 'flex gap-2', key: item }, h('span', { className: 'font-bold text-fern' }, '✓'), h('span', null, item))),
            ),
          ),
          h(CompletionChecklist, { items: buildChecklist }),
          h(
            'button',
            {
              className: `inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold text-white shadow-soft transition ${
                complete ? 'bg-fern hover:bg-emerald-800' : buildReady ? 'bg-cobalt hover:bg-blue-800' : 'cursor-not-allowed bg-slate-300'
              }`,
              disabled: !complete && !buildReady,
              onClick: () => {
                if (complete || buildReady) updateChallenge(challenge.id, { status: complete ? 'in-progress' : 'complete' });
              },
            },
            icon(CheckCircle2),
            complete ? 'Completed' : 'Mark complete',
          ),
          complete ? h(ReinforcementPanel, { kind: 'build', item: challenge }) : null,
        )
      : null,
  );
}

export function BuildMode({ buildState, updateChallenge, chatStore, foundationState }) {
  const [filters, setFilters] = useState({ subject: 'All', difficulty: 'All', status: 'All' });
  const hasFoundationReview = FOUNDATION_CONCEPTS[0].microLessons.some((lesson) => foundationState?.progress?.[lesson.id]?.complete);
  const visible = buildChallenges.filter((challenge) => {
    const saved = buildState[challenge.id];
    const status = saved?.status || 'not-started';

    return (
      (filters.subject === 'All' || challenge.subject === filters.subject) &&
      (filters.difficulty === 'All' || challenge.difficulty === filters.difficulty) &&
      (filters.status === 'All' || status === filters.status)
    );
  });

  function updateFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value }));
  }

  return h(
    'section',
    { className: 'space-y-4 scroll-mt-6', id: 'build-mode' },
    h(
      'div',
      { className: 'rounded-lg border border-slate-200 bg-white p-5 shadow-sm' },
      h('p', { className: 'text-sm font-semibold uppercase tracking-wide text-fern' }, 'Build Mode'),
      h('h2', { className: 'mt-1 text-2xl font-bold' }, 'Turn concepts into working logic.'),
      h('p', { className: 'mt-3 max-w-3xl text-sm leading-7 text-slate-700' }, 'Reason first. Fill the logic. Explain it. Then code and pass the tests.'),
      hasFoundationReview ? h('p', { className: 'mt-3 rounded-lg bg-amber-50 p-3 text-sm font-bold text-amber-900' }, 'Review: you learned this earlier. Function Rule Builder uses inputs, a rule, and an output.') : null,
      h(
        'div',
        { className: 'mt-5 grid gap-3 sm:grid-cols-3' },
        h(FilterSelect, { label: 'Subject', value: filters.subject, options: ['All', 'Math', 'Physics', 'Computer Science'], onChange: (value) => updateFilter('subject', value) }),
        h(FilterSelect, { label: 'Difficulty', value: filters.difficulty, options: ['All', 'Beginner', 'Intermediate', 'Advanced'], onChange: (value) => updateFilter('difficulty', value) }),
        h(FilterSelect, { label: 'Status', value: filters.status, options: [['All', 'All'], ['not-started', 'Not Started'], ['in-progress', 'In Progress'], ['complete', 'Complete']], onChange: (value) => updateFilter('status', value) }),
      ),
    ),
    visible.length
      ? h('div', { className: 'space-y-4' }, visible.map((challenge) => h(BuildChallengeCard, { challenge, saved: buildState[challenge.id], updateChallenge, chatStore, key: challenge.id })))
      : h(EmptyLessonsState, { message: 'No build challenges match the current filters.' }),
  );
}

