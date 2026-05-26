import React, { useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronRight, PenLine } from 'lucide-react';
import { icon, slug, Pill, SelfGradeButtons, LessonBlock, LearningSection, StepList, SolveBeforeReveal, WorkedExample, PracticeProblem, ExplanationModeTabs, ReinforcementPanel } from './shared.js';
import { AiTutorChat, AiFeedbackPanel, PredictionPanel } from './AiTutor.js';
import { hasText, completionItems, CompletionChecklist, terminologyWarnings } from './BuildMode.js';
const h = React.createElement;

export function Eli5Explanation({ lesson }) {
  return h(
    'div',
    { className: 'space-y-4' },
    h(
      LearningSection,
      { title: "Explain Like I'm 5", defaultOpen: true },
      h('p', null, `This lesson is about ${lesson.title.toLowerCase()}.`),
      h('p', null, lesson.bigIdea),
      h('p', null, `Imagine a simple machine: you put something in, something happens, and you look at what comes out. ${lesson.mentalModel}`),
    ),
    h(
      LearningSection,
      { title: 'Tiny Example', defaultOpen: true },
      h('p', null, lesson.guidedExample),
      h('p', null, 'Say what changed, say what stayed the same, then check if the answer makes sense.'),
    ),
    h(
      LearningSection,
      { title: 'Why It Helps Your Thinking' },
      h('p', null, `This helps because ${lesson.bridge}`),
      h('p', null, 'When you can explain the small version, the bigger version becomes less scary.'),
    ),
  );
}

export function DeepDiveExplanation({ lesson, solveStore }) {
  const learning = lesson.learning;

  return h(
    'div',
    { className: 'space-y-4' },
    h(LearningSection, { title: 'Formal Definition', defaultOpen: true }, h('p', null, learning.formalIdea.definition), h('p', null, learning.formalIdea.terminology)),
    h(LearningSection, { title: 'Derivation / Reasoning', defaultOpen: true }, h(StepList, { items: learning.derivation })),
    h(LearningSection, { title: 'Worked Examples' }, learning.workedExamples.map((example, index) => h(WorkedExample, { example, lessonId: lesson.id, index, solveStore, key: example.title }))),
    h(LearningSection, { title: 'Practice Problems' }, learning.practiceProblems.map((problem, index) => h(PracticeProblem, { problem, lessonId: lesson.id, index, solveStore, key: `${lesson.id}-${index}` }))),
    h(
      LearningSection,
      { title: 'Precise Connections' },
      h('p', null, h('strong', null, 'Math: '), learning.connections.math),
      h('p', null, h('strong', null, 'Physics: '), learning.connections.physics),
      h('p', null, h('strong', null, 'Computer Science: '), learning.connections.computerScience),
      h('p', null, h('strong', null, 'AI / real systems: '), learning.connections.ai),
    ),
    h(LearningSection, { title: 'Build Link' }, h('p', null, learning.buildLink)),
  );
}

export function LessonLearningSections({ lesson, solveStore, mode = 'standard' }) {
  if (mode === 'eli5') return h(Eli5Explanation, { lesson });
  if (mode === 'deep') return h(DeepDiveExplanation, { lesson, solveStore });

  const learning = lesson.learning;

  if (!learning) {
    return h(
      'div',
      { className: 'space-y-5' },
      h(LessonBlock, { label: 'Big Idea' }, lesson.bigIdea),
      h(LessonBlock, { label: 'Why It Matters' }, lesson.whyItMatters),
      h(LessonBlock, { label: 'Mental Model' }, lesson.mentalModel),
      h(LessonBlock, { label: 'Guided Example' }, lesson.guidedExample),
      h(LessonBlock, { label: 'Bridge' }, lesson.bridge),
    );
  }

  return h(
    'div',
    { className: 'space-y-4' },
    h(LearningSection, { title: '1. Intuition', defaultOpen: true }, h('p', null, learning.intuition.plainEnglish), h('p', null, learning.intuition.concept)),
    h(LearningSection, { title: '2. Formal Idea' }, h('p', null, learning.formalIdea.definition), h('p', null, learning.formalIdea.terminology)),
    h(LearningSection, { title: '3. Derivation / Reasoning' }, h(StepList, { items: learning.derivation })),
    h(LearningSection, { title: '4. Worked Examples' }, learning.workedExamples.map((example, index) => h(WorkedExample, { example, lessonId: lesson.id, index, solveStore, key: example.title }))),
    h(LearningSection, { title: '5-6. Practice Problems + Solve-Before-Reveal Solutions' }, learning.practiceProblems.map((problem, index) => h(PracticeProblem, { problem, lessonId: lesson.id, index, solveStore, key: `${lesson.id}-${index}` }))),
    h(
      LearningSection,
      { title: '7. Common Mistakes' },
      learning.commonMistakes.map((item) => h('div', { className: 'rounded-lg bg-amber-50 p-3', key: item.mistake }, h('p', { className: 'font-bold text-amber-900' }, item.mistake), h('p', { className: 'mt-1 text-amber-900' }, item.whyWrong))),
    ),
    h(
      LearningSection,
      { title: '8. Connections' },
      h('p', null, h('strong', null, 'Math: '), learning.connections.math),
      h('p', null, h('strong', null, 'Physics: '), learning.connections.physics),
      h('p', null, h('strong', null, 'Computer Science: '), learning.connections.computerScience),
      h('p', null, h('strong', null, 'AI / real systems: '), learning.connections.ai),
    ),
    h(LearningSection, { title: '9. Build Link' }, h('p', null, learning.buildLink)),
  );
}

export function LessonCard({ lesson, saved, updateLesson, defaultOpen, predictionStore, solveStore, chatStore }) {
  const [open, setOpen] = useState(defaultOpen);
  const [explanationMode, setExplanationMode] = useState('standard');
  const [solveState] = solveStore;
  const selected = saved?.quizAnswer;
  const complete = Boolean(saved?.complete);
  const explanation = saved?.explanation || '';
  const explanationParts = saved?.explanationParts || { what: '', why: '', example: '' };
  const explanationCombined = `${explanationParts.what || ''}\n${explanationParts.why || ''}\n${explanationParts.example || ''}`.trim();
  const termWarnings = terminologyWarnings(lesson, explanationCombined);
  const explanationFields = [
    ['what', 'What is happening?'],
    ['why', 'Why does it happen?'],
    ['example', 'Give one concrete example.'],
  ];
  const explanationReady = explanationFields.every(([field]) => hasText(explanationParts[field], 15));
  const hasQuizAnswer = typeof selected === 'number';
  const practiceProblems = lesson.learning?.practiceProblems || [];
  const hasPracticeAttempt =
    practiceProblems.length === 0 ||
    practiceProblems.some((_, index) => Boolean(solveState[`${lesson.id}-practice-${index}`]?.attempt?.trim()));
  const lessonChecklist = completionItems([
    ['Answer the quiz', hasQuizAnswer],
    ['Complete all three Explain-It fields', explanationReady],
    ...(practiceProblems.length ? [['Attempt at least one visible practice problem', hasPracticeAttempt]] : []),
  ]);
  const lessonReady = lessonChecklist.every((item) => item.done);

  return h(
    'article',
    { className: 'scroll-mt-24 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm', id: lesson.id },
    h(
      'button',
      {
        className: 'flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-50',
        onClick: () => setOpen((value) => !value),
      },
      h(
        'div',
        { className: 'min-w-0' },
        h('div', { className: 'mb-2 flex flex-wrap items-center gap-2' }, h(Pill, { tone: complete ? 'green' : 'blue' }, complete ? 'Complete' : lesson.level), lesson.stage ? h(Pill, { tone: 'slate' }, lesson.stage) : null, hasQuizAnswer ? h(Pill, { tone: selected === lesson.quiz.correctIndex ? 'green' : 'amber' }, selected === lesson.quiz.correctIndex ? 'Quiz correct' : 'Review quiz') : null),
        h('h3', { className: 'text-lg font-bold leading-6 text-ink' }, lesson.title),
      ),
      icon(open ? ChevronDown : ChevronRight, { className: 'shrink-0 text-slate-500' }),
    ),
    open
      ? h(
          'div',
          { className: 'space-y-5 border-t border-slate-200 px-5 py-5' },
          h(ExplanationModeTabs, { mode: explanationMode, setMode: setExplanationMode }),
          h(LessonLearningSections, { lesson, solveStore, mode: explanationMode }),
          h(
            PredictionPanel,
            {
              itemId: `lesson-${lesson.id}`,
              prompt: `Before reading the answer: ${lesson.prediction.question} What do you think this concept helps you understand or build?`,
              predictionStore,
            },
            h('p', { className: 'text-sm leading-7 text-blue-900' }, lesson.prediction.answer),
          ),
          h(
            'section',
            { className: 'rounded-lg border border-slate-200 p-4' },
            h('h4', { className: 'mb-3 text-sm font-bold uppercase tracking-wide text-slate-500' }, 'Quick Quiz'),
            h('p', { className: 'mb-3 text-sm font-semibold leading-6 text-ink' }, lesson.quiz.question),
            h(
              'div',
              { className: 'grid gap-2' },
              lesson.quiz.options.map((option, index) =>
                {
                  const isSelected = selected === index;
                  const isCorrect = index === lesson.quiz.correctIndex;
                  const showCorrectAfterAnswer = hasQuizAnswer && isCorrect;

                  return (
                h(
                  'button',
                  {
                    className: `rounded-lg border px-3 py-3 text-left text-sm leading-6 transition ${
                      isSelected
                        ? isCorrect
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                          : 'border-amber-300 bg-amber-50 text-amber-900'
                        : showCorrectAfterAnswer
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`,
                    key: option,
                    onClick: () => updateLesson(lesson.id, { quizAnswer: index }),
                  },
                  h('span', null, option),
                  showCorrectAfterAnswer ? h('span', { className: 'ml-2 text-xs font-bold uppercase tracking-wide text-emerald-700' }, 'Correct') : null,
                )
                  );
                }
              ),
            ),
            hasQuizAnswer
              ? h(
                  'div',
                  { className: `mt-3 rounded-lg p-3 text-sm leading-7 ${selected === lesson.quiz.correctIndex ? 'bg-emerald-50 text-emerald-900' : 'bg-amber-50 text-amber-900'}` },
                  h('p', { className: 'font-bold' }, selected === lesson.quiz.correctIndex ? 'Correct answer' : 'Review the correct answer'),
                  h('p', null, `Correct answer: ${lesson.quiz.options[lesson.quiz.correctIndex]}`),
                  h('p', null, lesson.quiz.feedback[selected]),
                )
              : null,
          ),
          practiceProblems.length
            ? h(
                'section',
                { className: 'rounded-lg border border-blue-100 bg-blue-50 p-4' },
                h('div', { className: 'mb-3 flex flex-wrap items-center gap-2' }, h('h4', { className: 'text-sm font-bold uppercase tracking-wide text-blue-700' }, 'Practice Problem'), h(Pill, { tone: hasPracticeAttempt ? 'green' : 'amber' }, hasPracticeAttempt ? 'Attempt written' : 'Required')),
                h('p', { className: 'mb-3 text-sm leading-6 text-blue-950' }, 'Try one problem before marking the lesson complete. You can reveal the solution only after writing an attempt.'),
                h(PracticeProblem, { problem: practiceProblems[0], lessonId: lesson.id, index: 0, solveStore, key: `${lesson.id}-visible-practice` }),
              )
            : null,
          h(
            'section',
            { className: 'rounded-lg border border-slate-200 p-4' },
            h('div', { className: 'mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-500' }, icon(PenLine, { size: 17 }), 'Explain It'),
            h(
              'div',
              { className: 'mb-3 rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm leading-6 text-blue-950' },
              h('p', { className: 'font-bold text-blue-800' }, 'Answer all three. Each needs at least 15 characters.'),
            ),
            h(
              'div',
              { className: 'space-y-3' },
              explanationFields.map(([field, label]) => {
                const value = explanationParts[field] || '';
                const valid = hasText(value, 15);
                const needsConcrete = needsConcreteExample(value);
                const fieldWarnings = terminologyWarnings(lesson, value);
                return h(
                  'label',
                  { className: 'block', key: field },
                  h('span', { className: 'text-sm font-bold text-slate-700' }, label),
                  h('textarea', {
                    className: `mt-2 min-h-20 w-full resize-y rounded-lg border p-3 text-sm leading-6 text-ink outline-none transition focus:border-cobalt focus:bg-white focus:ring-2 focus:ring-blue-100 ${needsConcrete || (value.trim() && !valid) ? 'border-amber-300 bg-amber-50' : 'border-slate-200 bg-slate-50'}`,
                    placeholder: label,
                    value,
                    onChange: (event) =>
                      updateLesson(lesson.id, {
                        explanationParts: {
                          ...explanationParts,
                          [field]: event.target.value,
                        },
                        explanation: `${field === 'what' ? event.target.value : explanationParts.what || ''}\n${field === 'why' ? event.target.value : explanationParts.why || ''}\n${field === 'example' ? event.target.value : explanationParts.example || ''}`.trim(),
                      }),
                  }),
                  needsConcrete ? h('p', { className: 'mt-1 rounded-lg bg-amber-50 p-2 text-xs font-bold text-amber-800' }, 'Try to stay concrete. Use numbers or a simple example.') : null,
                  fieldWarnings.length ? h('p', { className: 'mt-1 rounded-lg bg-amber-50 p-2 text-xs font-bold text-amber-800' }, fieldWarnings[0]) : null,
                  valid ? h('p', { className: 'mt-1 text-xs font-bold text-emerald-700' }, 'Ready') : h('p', { className: 'mt-1 text-xs font-bold text-amber-700' }, `${value.trim().length}/15 characters`),
                );
              }),
            ),
            termWarnings.length
              ? h(
                  'div',
                  { className: 'mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm font-bold text-amber-900' },
                  termWarnings.map((warning) => h('p', { key: warning }, warning)),
                )
              : null,
            h(AiFeedbackPanel, {
              inputType: 'explain-it response',
              userInput: explanationCombined,
              expectedConcept: `${lesson.bigIdea}\n${lesson.mentalModel}\n${lesson.guidedExample}\n${lesson.bridge}`,
              contextTitle: `${lesson.subjectTitle || lesson.subject}: ${lesson.title}`,
            }),
          ),
          h(AiTutorChat, {
            chatId: `lesson-${lesson.id}`,
            contextTitle: `${lesson.subjectTitle || lesson.subject}: ${lesson.title}`,
            expectedConcept: `${lesson.bigIdea}\n${lesson.mentalModel}\n${lesson.guidedExample}\n${lesson.bridge}`,
            userWork: `Quiz answer: ${hasQuizAnswer ? lesson.quiz.options[selected] : 'not answered yet'}\nExplain-it response: ${explanationCombined || explanation || 'not written yet'}`,
            chatStore,
          }),
          h(CompletionChecklist, { items: lessonChecklist }),
          h(
            'button',
            {
              className: `inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold text-white shadow-soft transition ${
                complete ? 'bg-fern hover:bg-emerald-800' : lessonReady ? 'bg-cobalt hover:bg-blue-800' : 'cursor-not-allowed bg-slate-300'
              }`,
              disabled: !complete && !lessonReady,
              onClick: () => {
                if (complete || lessonReady) updateLesson(lesson.id, { complete: !complete });
              },
            },
            icon(CheckCircle2),
            complete ? 'Completed' : 'Mark Complete',
          ),
          complete ? h(ReinforcementPanel, { kind: 'lesson', item: lesson }) : null,
        )
      : null,
  );
}

export function EmptyLessonsState({ message }) {
  return h(
    'div',
    { className: 'rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center' },
    h('p', { className: 'text-sm font-semibold text-slate-700' }, message),
    h('p', { className: 'mt-2 text-sm leading-6 text-slate-500' }, 'Try changing the filters or jump to the next open lesson from the dashboard.'),
  );
}

export function SubjectSection({ subjectKey, subject, progress, filteredLessons, predictionStore, solveStore, chatStore }) {
  const [lessonProgress, updateLesson] = progress;
  const completed = subject.lessons.filter((lesson) => lessonProgress[lesson.id]?.complete).length;
  const allComplete = completed === subject.lessons.length;
  const visibleLessons = filteredLessons ?? subject.lessons;

  return h(
    'section',
    { className: 'scroll-mt-6', id: slug(subject.title) },
    h(
      'div',
      { className: 'mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between' },
      h('div', null, h('p', { className: 'text-sm font-semibold uppercase tracking-wide text-fern' }, 'Lesson Track'), h('h2', { className: 'mt-1 flex items-center gap-2 text-2xl font-bold' }, icon(subject.icon, { className: subject.color, size: 23 }), subject.title)),
      h('div', { className: 'flex flex-wrap gap-2' }, h(Pill, { tone: allComplete ? 'green' : 'slate' }, `${completed}/${subject.lessons.length} complete`), h(Pill, { tone: 'blue' }, `${visibleLessons.length} shown`)),
    ),
    allComplete
      ? h('div', { className: 'mb-4 rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900' }, `${subject.title} is complete. Nice work. You can still reopen lessons, revise explanations, or use the labs for review.`)
      : null,
    h(
      'div',
      { className: 'space-y-4' },
      visibleLessons.length
        ? visibleLessons.map((lesson, index) =>
            h(LessonCard, {
              defaultOpen: index === 0 && subjectKey === 'math',
              key: lesson.id,
              lesson,
              saved: lessonProgress[lesson.id],
              updateLesson,
              predictionStore,
              solveStore,
              chatStore,
            }),
          )
        : h(EmptyLessonsState, { message: `No ${subject.title} lessons match the current filters.` }),
    ),
  );
}