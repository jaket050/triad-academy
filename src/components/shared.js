import React, { useState } from 'react';
import { ChevronDown, ChevronRight, RotateCcw } from 'lucide-react';
const h = React.createElement;

export function slug(value) {
  return value.toLowerCase().replaceAll(' ', '-');
}

export function icon(iconType, props = {}) {
  return h(iconType, { size: 18, 'aria-hidden': true, ...props });
}

export function Pill({ children, tone = 'slate' }) {
  const tones = {
    slate: 'bg-slate-100 text-slate-700',
    green: 'bg-emerald-50 text-emerald-700',
    blue: 'bg-blue-50 text-blue-700',
    amber: 'bg-amber-50 text-amber-700',
  };

  return h('span', { className: `rounded-md px-2.5 py-1 text-xs font-bold ${tones[tone]}` }, children);
}

export function SelfGradeButtons({ value, onChange }) {
  return h(
    'div',
    { className: 'mt-2 flex flex-wrap gap-2' },
    [
      ['correct', 'Correct'],
      ['partially-correct', 'Partially correct'],
      ['incorrect', 'Incorrect'],
    ].map(([grade, label]) =>
      h(
        'button',
        {
          className: `rounded-lg border px-3 py-2 text-sm font-bold transition ${
            value === grade ? 'border-blue-300 bg-blue-50 text-blue-800' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
          }`,
          key: grade,
          onClick: () => onChange(grade),
        },
        label,
      ),
    ),
  );
}


export function LessonBlock({ label, children }) {
  return h(
    'section',
    { className: 'border-t border-slate-200 pt-5 first:border-t-0 first:pt-0' },
    h('h4', { className: 'mb-2 text-sm font-bold uppercase tracking-wide text-slate-500' }, label),
    h('p', { className: 'text-sm leading-7 text-slate-700' }, children),
  );
}

export function LearningSection({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return h(
    'section',
    { className: 'overflow-hidden rounded-lg border border-slate-200 bg-white' },
    h(
      'button',
      {
        className: 'flex w-full items-center justify-between gap-4 bg-slate-50 px-4 py-3 text-left text-sm font-bold uppercase tracking-wide text-slate-600 transition hover:bg-slate-100',
        onClick: () => setOpen((value) => !value),
      },
      title,
      icon(open ? ChevronDown : ChevronRight, { className: 'shrink-0 text-slate-500' }),
    ),
    open ? h('div', { className: 'space-y-3 p-4 text-sm leading-7 text-slate-700' }, children) : null,
  );
}

export function StepList({ items }) {
  return h(
    'ol',
    { className: 'space-y-2' },
    items.map((item, index) =>
      h(
        'li',
        { className: 'flex gap-3', key: `${index}-${item}` },
        h('span', { className: 'mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-blue-50 text-xs font-bold text-blue-700' }, index + 1),
        h('span', null, item),
      ),
    ),
  );
}

export function SolveBeforeReveal({ itemId, prompt, revealTitle = 'Solution', revealContent, solveStore }) {
  const [solveState, updateSolve] = solveStore;
  const saved = solveState[itemId] || { attempt: '', revealed: false, reflection: '' };
  const attempted = Boolean(saved.attempt.trim());
  const reflected = Boolean(saved.reflection.trim());

  return h(
    'div',
    { className: 'rounded-lg border border-slate-200 bg-slate-50 p-4' },
    h('div', { className: 'mb-3 flex flex-wrap gap-2' }, h(Pill, { tone: attempted ? 'green' : 'slate' }, attempted ? 'Attempted' : 'Not attempted'), h(Pill, { tone: saved.revealed ? 'green' : 'slate' }, saved.revealed ? 'Revealed' : 'Hidden'), h(Pill, { tone: reflected ? 'green' : 'slate' }, reflected ? 'Reflected' : 'Needs reflection')),
    h('div', { className: 'text-sm leading-7 text-slate-700' }, prompt),
    h('label', { className: 'mt-3 block text-sm font-bold uppercase tracking-wide text-slate-500' }, 'Your attempt'),
    h('textarea', {
      className: 'mt-2 min-h-24 w-full resize-y rounded-lg border border-slate-200 bg-white p-3 text-sm leading-6 text-ink outline-none transition focus:border-cobalt focus:ring-2 focus:ring-blue-100',
      placeholder: 'Try it first. Write steps, a guess, a diagram description, or pseudocode.',
      value: saved.attempt,
      onChange: (event) => updateSolve(itemId, { attempt: event.target.value }),
    }),
    h(
      'button',
      {
        className: `mt-3 rounded-lg px-3 py-2 text-sm font-bold text-white transition ${attempted ? 'bg-cobalt hover:bg-blue-800' : 'cursor-not-allowed bg-slate-300'}`,
        disabled: !attempted,
        onClick: () => updateSolve(itemId, { revealed: true }),
      },
      saved.revealed ? `${revealTitle} shown` : `Reveal ${revealTitle}`,
    ),
    saved.revealed
      ? h(
          'div',
          { className: 'mt-4 space-y-3 rounded-lg bg-white p-3' },
          h('h4', { className: 'text-sm font-bold uppercase tracking-wide text-slate-500' }, revealTitle),
          revealContent,
          h('label', { className: 'block text-sm font-bold text-slate-700' }, 'What did you miss?'),
          h('textarea', {
            className: 'min-h-20 w-full resize-y rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-ink outline-none transition focus:border-cobalt focus:bg-white focus:ring-2 focus:ring-blue-100',
            placeholder: 'Name the step, idea, or assumption you would improve next time.',
            value: saved.reflection,
            onChange: (event) => updateSolve(itemId, { reflection: event.target.value }),
          }),
        )
      : null,
  );
}

export function WorkedExample({ example, lessonId, index, solveStore }) {
  return h(
    'article',
    { className: 'rounded-lg border border-slate-200 bg-slate-50 p-4' },
    h('h4', { className: 'font-bold text-ink' }, example.title),
    h(SolveBeforeReveal, {
      itemId: `${lessonId}-worked-${index}`,
      solveStore,
      revealTitle: 'worked solution',
      prompt: h('p', null, h('strong', null, 'Problem: '), example.inputs),
      revealContent: h('div', null, h(StepList, { items: example.steps }), h('p', { className: 'mt-3' }, h('strong', null, 'Output: '), example.output)),
    }),
  );
}

export function PracticeProblem({ problem, lessonId, index, solveStore }) {
  return h(
    'article',
    { className: 'rounded-lg border border-slate-200 bg-slate-50 p-4' },
    h('div', { className: 'mb-2 flex flex-wrap items-center gap-2' }, h(Pill, { tone: index === 0 ? 'blue' : index === 1 ? 'amber' : 'slate' }, problem.difficulty), h('span', { className: 'text-sm font-bold text-slate-600' }, `Problem ${index + 1}`)),
    h(SolveBeforeReveal, {
      itemId: `${lessonId}-practice-${index}`,
      solveStore,
      revealTitle: 'solution',
      prompt: h('p', null, problem.prompt),
      revealContent: h(StepList, { items: problem.solution }),
    }),
  );
}

export function ExplanationModeTabs({ mode, setMode }) {
  const modes = [
    ['eli5', "Explain Like I'm 5"],
    ['standard', 'Standard Explanation'],
    ['deep', 'Deep Dive'],
  ];

  return h(
    'div',
    { className: 'flex flex-wrap gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2' },
    modes.map(([value, label]) =>
      h(
        'button',
        {
          className: `rounded-lg px-3 py-2 text-sm font-bold transition ${
            mode === value ? 'bg-cobalt text-white shadow-soft' : 'bg-white text-slate-700 hover:bg-slate-100'
          }`,
          key: value,
          onClick: () => setMode(value),
        },
        label,
      ),
    ),
  );
}

export function ResetProgressButton({ onReset }) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return h(
      'div',
      { className: 'flex flex-col gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 sm:flex-row sm:items-center sm:justify-between' },
      h('span', { className: 'text-sm font-semibold text-amber-900' }, 'Reset all saved progress and session history?'),
      h(
        'div',
        { className: 'flex gap-2' },
        h('button', { className: 'rounded-lg bg-white px-3 py-2 text-sm font-bold text-slate-700', onClick: () => setConfirming(false) }, 'Cancel'),
        h(
          'button',
          {
            className: 'rounded-lg bg-amber-700 px-3 py-2 text-sm font-bold text-white',
            onClick: () => {
              onReset();
              setConfirming(false);
            },
          },
          'Reset',
        ),
      ),
    );
  }

  return h(
    'button',
    {
      className: 'inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50',
      onClick: () => setConfirming(true),
    },
    icon(RotateCcw),
    'Reset progress',
  );
}

export function ModalShell({ title, body, children, onClose }) {
  return h(
    'div',
    { className: 'fixed inset-0 z-50 grid place-items-center bg-slate-950/50 px-4 py-6' },
    h(
      'section',
      { className: 'w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-soft' },
      h('div', { className: 'flex items-start justify-between gap-4' }, h('div', null, h('h2', { className: 'text-lg font-bold text-ink' }, title), h('p', { className: 'mt-2 text-sm leading-6 text-slate-600' }, body)), onClose ? h('button', { className: 'rounded-lg border border-slate-200 px-2 py-1 text-sm font-bold text-slate-600 hover:bg-slate-50', onClick: onClose }, 'Close') : null),
      h('div', { className: 'mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end' }, children),
    ),
  );
}

export function PilotStartChoiceModal({ onContinue, onRestart, onCancel }) {
  return h(
    ModalShell,
    {
      title: 'Existing pilot test',
      body: 'You have an existing pilot test. Do you want to continue where you left off or restart from a clean pilot session?',
      onClose: onCancel,
    },
    h('button', { className: 'rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50', onClick: onContinue }, 'Continue'),
    h('button', { className: 'rounded-lg bg-cobalt px-4 py-2.5 text-sm font-bold text-white shadow-soft transition hover:bg-blue-800', onClick: onRestart }, 'Restart'),
  );
}

export function ConfirmActionModal({ title, body, confirmLabel, confirmClassName = 'bg-amber-700 hover:bg-amber-800', onConfirm, onCancel }) {
  return h(
    ModalShell,
    { title, body, onClose: onCancel },
    h('button', { className: 'rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50', onClick: onCancel }, 'Cancel'),
    h('button', { className: `rounded-lg px-4 py-2.5 text-sm font-bold text-white shadow-soft transition ${confirmClassName}`, onClick: onConfirm }, confirmLabel),
  );
}
export function reinforcementFor(kind, item = {}) {
  const title = item.title || item.concept || 'this step';
  const defaults = {
    lesson: {
      bullets: ['You checked understanding with a quiz before moving on.', 'You explained the idea in your own words.', 'Practice attempts make the concept easier to retrieve later.'],
      connection: 'This same learning loop appears in debugging and model training: predict, test, explain, revise.',
      nextStep: 'Use a related lab or build challenge to turn the concept into action.',
    },
    lab: {
      bullets: ['A prediction gives your brain something to compare against reality.', 'Changing controls reveals cause and effect.', 'Reflection turns a visual result into a reusable idea.'],
      connection: 'Labs connect math rules to physical simulations, code behavior, and AI model outputs.',
      nextStep: 'Write one sentence explaining which input changed the output most.',
    },
    build: {
      bullets: ['Working code has to satisfy real tests, not just sound plausible.', 'Inputs, operations, and outputs must line up exactly.', 'Notes help you explain implementation choices.'],
      connection: 'Build work connects math formulas to executable computer science.',
      nextStep: 'Try one edge case and explain what the function should return.',
    },
    debug: {
      bullets: ['A failing test is evidence, not a verdict.', 'Good debugging compares expected and actual behavior.', 'A root-cause explanation helps prevent the same bug later.'],
      connection: 'Debugging mirrors science: observe, hypothesize, test, revise.',
      nextStep: 'Create one new test that would have caught the bug earlier.',
    },
    reading: {
      bullets: ['Reading code means tracing values over time.', 'Prediction reveals whether you understand control flow.', 'Explaining a snippet builds engineering fluency.'],
      connection: 'Code reading supports debugging, architecture work, and AI training loops.',
      nextStep: 'Change one input mentally and predict how the output changes.',
    },
    pilot: {
      bullets: ['A focused pilot compares before and after understanding.', 'Friction notes show where the product needs clearer teaching.', 'Outcome data reveals whether practice changed confidence and skill.'],
      connection: 'Pilot testing applies scientific thinking to product learning design.',
      nextStep: 'Export the JSON and compare pre-test, post-test, and friction notes.',
    },
    karpathy: {
      bullets: ['Executable milestones turn theory into working systems.', 'Passing tests show the core behavior is real.', 'Reflection connects code mechanics to neural-network concepts.'],
      connection: 'Neural networks combine math, code, debugging, and data modeling.',
      nextStep: 'Extend the project with the stretch goal or a new test case.',
    },
  };

  const data = defaults[kind] || defaults.lesson;
  return {
    title: `What you just learned from ${title}`,
    ...data,
  };
}

export function ReinforcementPanel({ kind, item }) {
  const data = reinforcementFor(kind, item);

  return h(
    'section',
    { className: 'rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950' },
    h('h4', { className: 'text-sm font-bold uppercase tracking-wide text-emerald-800' }, 'What you just learned'),
    h('ul', { className: 'mt-3 space-y-1' }, data.bullets.map((bullet) => h('li', { className: 'flex gap-2', key: bullet }, h('span', { className: 'font-bold' }, '-'), h('span', null, bullet)))),
    h('p', { className: 'mt-3' }, h('strong', null, 'Connection: '), data.connection),
    h('p', { className: 'mt-1' }, h('strong', null, 'Next step: '), data.nextStep),
  );
}

export function FilterSelect({ label, value, options, onChange }) {
  return h(
    'label',
    { className: 'block' },
    h('span', { className: 'mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500' }, label),
    h(
      'select',
      {
        className: 'w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold outline-none focus:border-cobalt focus:bg-white focus:ring-2 focus:ring-blue-100',
        value,
        onChange: (event) => onChange(event.target.value),
      },
      options.map((option) => {
        const optionValue = Array.isArray(option) ? option[0] : option;
        const optionLabel = Array.isArray(option) ? option[1] : option;
        return h('option', { key: optionValue, value: optionValue }, optionLabel);
      }),
    ),
  );
}

export function Metric({ label, value, color = '#172033' }) {
  return h(
    'div',
    { className: 'flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2' },
    h('span', { className: 'text-slate-600' }, label),
    h('span', { className: 'font-bold', style: { color } }, value),
  );
}
