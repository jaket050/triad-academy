import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { architectureLessons, architectureStats, curriculumArchitecture, isArchitectureLessonUnlocked } from '../curriculumArchitecture.js';
import { icon, Pill, FilterSelect, Metric } from './shared.js';

const h = React.createElement;

export function CurriculumProgress({ subjects }) {
  return h(
    'section',
    { className: 'grid gap-3 sm:grid-cols-3' },
    subjects.map((subject) => {
      const percent = subject.total ? Math.round((subject.completed / subject.total) * 100) : 0;

      return h(
        'article',
        { className: 'rounded-lg border border-slate-200 bg-white p-4 shadow-sm', key: subject.title },
        h('div', { className: 'flex items-center justify-between gap-3' }, h('div', { className: 'flex items-center gap-2 font-bold' }, icon(subject.icon, { className: subject.color }), subject.title), h(Pill, { tone: percent === 100 ? 'green' : 'slate' }, `${subject.total} lessons`)),
        h('div', { className: 'mt-4 h-2 overflow-hidden rounded-full bg-slate-100' }, h('div', { className: 'h-full rounded-full bg-cobalt', style: { width: `${percent}%` } })),
        h('p', { className: 'mt-3 text-sm font-semibold text-slate-700' }, `${subject.completed} of ${subject.total} complete`),
      );
    }),
  );
}

export function CurriculumMap({ architectureProgress, toggleArchitectureLesson, recommendedPathLesson }) {
  const [subjectId, setSubjectId] = useState(curriculumArchitecture[0].id);
  const [stageId, setStageId] = useState(curriculumArchitecture[0].stages[0].id);
  const selectedSubject = curriculumArchitecture.find((subject) => subject.id === subjectId) || curriculumArchitecture[0];
  const selectedStage = selectedSubject.stages.find((stage) => stage.id === stageId) || selectedSubject.stages[0];
  const completedCount = architectureLessons.filter((lesson) => architectureProgress[lesson.id]).length;

  function selectSubject(nextSubjectId) {
    const nextSubject = curriculumArchitecture.find((subject) => subject.id === nextSubjectId) || curriculumArchitecture[0];
    setSubjectId(nextSubject.id);
    setStageId(nextSubject.stages[0].id);
  }

  return h(
    'section',
    { className: 'space-y-4 scroll-mt-6', id: 'curriculum-map' },
    h(
      'div',
      { className: 'rounded-lg border border-slate-200 bg-white p-5 shadow-sm' },
      h('p', { className: 'text-sm font-semibold uppercase tracking-wide text-fern' }, 'Curriculum Architecture'),
      h('h2', { className: 'mt-1 text-2xl font-bold' }, 'Map the full learning path'),
      h('p', { className: 'mt-3 max-w-3xl text-sm leading-7 text-slate-700' }, 'This map defines the long-range structure before every lesson is fully authored: subject to stage to module to lesson, with dependencies, exercises, build links, and review priorities. Locked steps open when prerequisites are complete.'),
      h(
        'div',
        { className: 'mt-5 grid gap-3 sm:grid-cols-4' },
        h(Metric, { label: 'Subjects', value: architectureStats.subjects }),
        h(Metric, { label: 'Stages', value: architectureStats.stages }),
        h(Metric, { label: 'Modules', value: architectureStats.modules }),
        h(Metric, { label: 'Path lessons', value: `${completedCount}/${architectureStats.lessons}` }),
      ),
      recommendedPathLesson
        ? h(
            'div',
            { className: 'mt-4 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950' },
            h('p', { className: 'font-bold' }, 'Recommended next path lesson'),
            h('p', null, `${recommendedPathLesson.subjectTitle} -> ${recommendedPathLesson.stageTitle} -> ${recommendedPathLesson.moduleTitle}`),
            h('p', null, recommendedPathLesson.title),
          )
        : null,
    ),
    h(
      'div',
      { className: 'grid gap-4 lg:grid-cols-[240px_1fr]' },
      h(
        'div',
        { className: 'space-y-2 rounded-lg border border-slate-200 bg-white p-3 shadow-sm' },
        curriculumArchitecture.map((subject) =>
          h(
            'button',
            {
              className: `w-full rounded-lg px-3 py-2 text-left text-sm font-bold transition ${subject.id === selectedSubject.id ? 'bg-cobalt text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`,
              key: subject.id,
              onClick: () => selectSubject(subject.id),
            },
            subject.title,
          ),
        ),
      ),
      h(
        'div',
        { className: 'space-y-4' },
        h(
          'div',
          { className: 'flex gap-2 overflow-x-auto rounded-lg border border-slate-200 bg-white p-3 shadow-sm' },
          selectedSubject.stages.map((stage) =>
            h(
              'button',
              {
                className: `shrink-0 rounded-lg px-3 py-2 text-sm font-bold transition ${stage.id === selectedStage.id ? 'bg-fern text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`,
                key: stage.id,
                onClick: () => setStageId(stage.id),
              },
              `${stage.order}. ${stage.title}`,
            ),
          ),
        ),
        h(
          'div',
          { className: 'space-y-3' },
          selectedStage.modules.map((module) =>
            h(
              'article',
              { className: 'rounded-lg border border-slate-200 bg-white p-4 shadow-sm', key: module.id },
              h('div', { className: 'flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between' }, h('div', null, h('h3', { className: 'font-bold text-ink' }, module.title), h('p', { className: 'mt-1 text-sm text-slate-600' }, `${module.lessons.length} lessons -> ${module.exercises.length} exercises -> ${module.buildChallenges.length} build links -> ${module.reviewItems.length} review items`)), h(Pill, { tone: 'blue' }, `Module ${module.order}`)),
              h(
                'div',
                { className: 'mt-3 grid gap-2' },
                module.lessons.map((lesson) => {
                  const complete = Boolean(architectureProgress[lesson.id]);
                  const unlocked = isArchitectureLessonUnlocked(lesson, architectureProgress);
                  return h(
                    'div',
                    { className: `rounded-lg border p-3 ${complete ? 'border-emerald-200 bg-emerald-50' : unlocked ? 'border-blue-100 bg-blue-50' : 'border-slate-200 bg-slate-50'}`, key: lesson.id },
                    h('div', { className: 'flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between' }, h('div', null, h('p', { className: 'text-sm font-bold text-ink' }, lesson.title), h('p', { className: 'mt-1 text-xs leading-5 text-slate-600' }, `Prerequisites: ${lesson.prerequisites.length ? lesson.prerequisites.join(', ') : 'none'} | Labs: ${lesson.connectedLabs.join(', ')} | Build: ${lesson.connectedBuildChallenges.join(', ')} | Review: ${lesson.reviewPriority} | Skill: ${lesson.skillCategory}`)), h(Pill, { tone: complete ? 'green' : unlocked ? 'blue' : 'slate' }, complete ? 'Complete' : unlocked ? 'Unlocked' : 'Locked')),
                    h(
                      'button',
                      {
                        className: `mt-3 rounded-lg px-3 py-2 text-sm font-bold text-white transition ${unlocked || complete ? 'bg-cobalt hover:bg-blue-800' : 'cursor-not-allowed bg-slate-300'}`,
                        disabled: !unlocked && !complete,
                        onClick: () => toggleArchitectureLesson(lesson.id),
                      },
                      complete ? 'Mark incomplete' : 'Mark path step complete',
                    ),
                  );
                }),
              ),
            ),
          ),
        ),
      ),
    ),
  );
}


export function CurriculumFilters({ filters, setFilters, resultCount, stages }) {
  function update(name, value) {
    setFilters((current) => ({ ...current, [name]: value }));
  }

  return h(
    'section',
    { className: 'rounded-lg border border-slate-200 bg-white p-4 shadow-sm' },
    h(
      'div',
      { className: 'grid gap-3 md:grid-cols-[1fr_160px_150px_190px_160px]' },
      h(
        'label',
        { className: 'block' },
        h('span', { className: 'mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500' }, 'Search lessons'),
        h(
          'div',
          { className: 'flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 focus-within:border-cobalt focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100' },
          icon(Search, { className: 'text-slate-400' }),
          h('input', {
            className: 'w-full bg-transparent text-sm outline-none',
            placeholder: 'Search title, idea, or bridge',
            value: filters.query,
            onChange: (event) => update('query', event.target.value),
          }),
        ),
      ),
      h(
        'label',
        { className: 'block' },
        h('span', { className: 'mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500' }, 'Stage'),
        h(
          'select',
          {
            className: 'w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold outline-none focus:border-cobalt focus:bg-white focus:ring-2 focus:ring-blue-100',
            value: filters.stage,
            onChange: (event) => update('stage', event.target.value),
          },
          ['All', ...stages].map((value) => h('option', { key: value, value }, value)),
        ),
      ),
      h(
        'label',
        { className: 'block' },
        h('span', { className: 'mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500' }, 'Subject'),
        h(
          'select',
          {
            className: 'w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold outline-none focus:border-cobalt focus:bg-white focus:ring-2 focus:ring-blue-100',
            value: filters.subject,
            onChange: (event) => update('subject', event.target.value),
          },
          ['All', 'Math', 'Physics', 'Computer Science', 'Language & Thinking'].map((value) => h('option', { key: value, value }, value)),
        ),
      ),
      h(
        'label',
        { className: 'block' },
        h('span', { className: 'mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500' }, 'Level'),
        h(
          'select',
          {
            className: 'w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold outline-none focus:border-cobalt focus:bg-white focus:ring-2 focus:ring-blue-100',
            value: filters.level,
            onChange: (event) => update('level', event.target.value),
          },
          ['All', 'Foundation', 'Core', 'Advanced'].map((value) => h('option', { key: value, value }, value)),
        ),
      ),
      h(
        'label',
        { className: 'block' },
        h('span', { className: 'mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500' }, 'Completion'),
        h(
          'select',
          {
            className: 'w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold outline-none focus:border-cobalt focus:bg-white focus:ring-2 focus:ring-blue-100',
            value: filters.status,
            onChange: (event) => update('status', event.target.value),
          },
          ['All', 'Incomplete', 'Complete'].map((value) => h('option', { key: value, value }, value)),
        ),
      ),
    ),
    h('p', { className: 'mt-3 text-sm font-semibold text-slate-600' }, `${resultCount} lessons match the current filters.`),
  );
}



