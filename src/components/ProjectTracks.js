import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { projectTracks } from '../projectTracks.js';
import { icon, Pill } from './shared.js';

const h = React.createElement;

function projectStepCount(project) {
  return project.stages.reduce((total, stage) => total + stage.tasks.length + 1, 1);
}

function projectCompletedSteps(project, saved) {
  const steps = saved?.steps || {};
  const stageSteps = project.stages.reduce((total, stage, stageIndex) => {
    const taskCount = stage.tasks.filter((_, taskIndex) => steps[`${stageIndex}-task-${taskIndex}`]).length;
    const checkpointCount = steps[`${stageIndex}-checkpoint`] ? 1 : 0;
    return total + taskCount + checkpointCount;
  }, 0);

  return stageSteps + (saved?.finalComplete ? 1 : 0);
}

export function ProjectTrackCard({ project, saved, toggleProjectStep, toggleProjectFinal }) {
  const [open, setOpen] = useState(false);
  const completed = projectCompletedSteps(project, saved);
  const total = projectStepCount(project);
  const percent = total ? Math.round((completed / total) * 100) : 0;

  return h(
    'article',
    { className: 'overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm' },
    h(
      'button',
      {
        className: 'flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-50',
        onClick: () => setOpen((value) => !value),
      },
      h(
        'div',
        { className: 'min-w-0' },
        h('div', { className: 'mb-2 flex flex-wrap gap-2' }, h(Pill, { tone: project.level === 'AI' ? 'amber' : project.level === 'Intermediate' ? 'blue' : 'green' }, project.level), h(Pill, { tone: percent === 100 ? 'green' : 'slate' }, `${completed}/${total} steps`)),
        h('h3', { className: 'text-lg font-bold text-ink' }, project.title),
        h('p', { className: 'mt-1 text-sm leading-6 text-slate-600' }, project.goal),
      ),
      icon(open ? ChevronDown : ChevronRight, { className: 'shrink-0 text-slate-500' }),
    ),
    h('div', { className: 'h-2 bg-slate-100' }, h('div', { className: 'h-full bg-cobalt', style: { width: `${percent}%` } })),
    open
      ? h(
          'div',
          { className: 'space-y-4 border-t border-slate-200 px-5 py-5' },
          project.stages.map((stage, stageIndex) =>
            h(
              'section',
              { className: 'rounded-lg border border-slate-200 p-4', key: stage.title },
              h('h4', { className: 'font-bold text-ink' }, stage.title),
              h(
                'div',
                { className: 'mt-3 space-y-2' },
                stage.tasks.map((task, taskIndex) => {
                  const stepId = `${stageIndex}-task-${taskIndex}`;
                  const checked = Boolean(saved?.steps?.[stepId]);
                  return h(
                    'label',
                    { className: 'flex items-start gap-3 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-700', key: task },
                    h('input', { className: 'mt-1 accent-blue-700', type: 'checkbox', checked, onChange: () => toggleProjectStep(project.id, stepId) }),
                    h('span', null, task),
                  );
                }),
              ),
              h(
                'label',
                { className: 'mt-3 flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm leading-6 text-blue-950' },
                h('input', { className: 'mt-1 accent-blue-700', type: 'checkbox', checked: Boolean(saved?.steps?.[`${stageIndex}-checkpoint`]), onChange: () => toggleProjectStep(project.id, `${stageIndex}-checkpoint`) }),
                h('span', null, h('strong', null, 'Code checkpoint: '), stage.codeCheckpoint),
              ),
            ),
          ),
          h(
            'section',
            { className: 'rounded-lg border border-emerald-100 bg-emerald-50 p-4' },
            h('h4', { className: 'font-bold text-emerald-950' }, 'Final build'),
            h('p', { className: 'mt-2 text-sm leading-7 text-emerald-950' }, project.finalBuild),
            h(
              'label',
              { className: 'mt-3 flex items-start gap-3 text-sm font-semibold text-emerald-950' },
              h('input', { className: 'mt-1 accent-emerald-700', type: 'checkbox', checked: Boolean(saved?.finalComplete), onChange: () => toggleProjectFinal(project.id) }),
              'Final build complete',
            ),
          ),
        )
      : null,
  );
}

export function ProjectTracks({ projectProgress, toggleProjectStep, toggleProjectFinal }) {
  const totalSteps = projectTracks.reduce((total, project) => total + projectStepCount(project), 0);
  const completedSteps = projectTracks.reduce((total, project) => total + projectCompletedSteps(project, projectProgress[project.id]), 0);

  return h(
    'section',
    { className: 'space-y-4 scroll-mt-6', id: 'projects' },
    h(
      'div',
      { className: 'rounded-lg border border-slate-200 bg-white p-5 shadow-sm' },
      h('div', { className: 'mb-3 flex items-center gap-2 font-bold' }, icon(Rocket, { className: 'text-ember' }), 'Project Tracks'),
      h('h2', { className: 'text-2xl font-bold' }, 'Turn lessons into finished builds'),
      h('p', { className: 'mt-3 max-w-3xl text-sm leading-7 text-slate-700' }, 'Projects are guided paths with stages, tasks, code checkpoints, and a final build. They connect the curriculum to practical work without needing every feature to be perfect on the first pass.'),
      h('div', { className: 'mt-4' }, h(Pill, { tone: completedSteps === totalSteps ? 'green' : 'blue' }, `${completedSteps}/${totalSteps} project steps complete`)),
    ),
    h('div', { className: 'grid gap-4' }, projectTracks.map((project) => h(ProjectTrackCard, { project, saved: projectProgress[project.id], toggleProjectStep, toggleProjectFinal, key: project.id }))),
  );
}

