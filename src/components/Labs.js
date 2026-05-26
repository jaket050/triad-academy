import React, { useState, useEffect, useMemo } from 'react';
import { Atom, Calculator, Code2 } from 'lucide-react';
import { icon, Pill } from './shared.js';
import { LAB_IDS } from '../constants.js';
import { PredictionPanel } from './AiTutor.js';
const h = React.createElement;

export const MODEL_DATASETS = [
  {
    id: 'study-score',
    name: 'Study Time -> Quiz Score',
    xLabel: 'Study hours',
    yLabel: 'Quiz score',
    story: 'A tiny dataset about how practice time relates to assessment results.',
    aiConnection: 'A model learns a rule from examples, then uses that rule to predict a new outcome.',
    points: [
      [1, 52],
      [2, 57],
      [3, 63],
      [4, 67],
      [5, 74],
      [6, 78],
      [7, 83],
      [8, 88],
    ],
    initialSlope: 4,
    initialIntercept: 48,
    predictionX: 6.5,
  },
  {
    id: 'temperature-sales',
    name: 'Temperature -> Lemonade Sales',
    xLabel: 'Temperature',
    yLabel: 'Cups sold',
    story: 'A simple business dataset where warmer days usually produce more sales.',
    aiConnection: 'Forecasting systems often start by finding relationships between measurable inputs and future demand.',
    points: [
      [60, 18],
      [65, 23],
      [70, 31],
      [75, 36],
      [80, 44],
      [85, 50],
      [90, 58],
      [95, 65],
    ],
    initialSlope: 1,
    initialIntercept: -38,
    predictionX: 82,
  },
  {
    id: 'practice-reaction',
    name: 'Practice Reps -> Reaction Time',
    xLabel: 'Practice reps',
    yLabel: 'Reaction time ms',
    story: 'A performance dataset where more repetitions tend to lower reaction time.',
    aiConnection: 'Models can learn negative relationships too: more of one input can predict less of an output.',
    points: [
      [1, 430],
      [2, 405],
      [3, 385],
      [4, 360],
      [5, 344],
      [6, 326],
      [7, 310],
      [8, 296],
    ],
    initialSlope: -18,
    initialIntercept: 448,
    predictionX: 6.5,
  },
];

export function RangeSlider({ label, value, min, max, step = 1, unit = '', onChange }) {
  return h(
    'label',
    { className: 'block rounded-lg border border-slate-200 bg-slate-50 p-3' },
    h(
      'div',
      { className: 'mb-2 flex items-center justify-between gap-4 text-sm' },
      h('span', { className: 'font-semibold text-slate-700' }, label),
      h('span', { className: 'rounded-md bg-white px-2 py-1 font-bold text-ink' }, `${value}${unit}`),
    ),
    h('input', {
      className: 'w-full accent-blue-700',
      type: 'range',
      min,
      max,
      step,
      value,
      onChange: (event) => onChange(Number(event.target.value)),
    }),
  );
}

export function SvgFrame({ children, viewBox = '0 0 420 260' }) {
  return h(
    'svg',
    {
      className: 'h-64 w-full rounded-lg border border-slate-200 bg-white',
      role: 'img',
      viewBox,
    },
    children,
  );
}

export function FunctionVisualizer({ predictionStore }) {
  const [slope, setSlope] = useState(1);
  const [intercept, setIntercept] = useState(0);
  const width = 420;
  const height = 260;
  const pad = 30;
  const xMin = -10;
  const xMax = 10;
  const yMin = -10;
  const yMax = 10;
  const points = Array.from({ length: 81 }, (_, index) => {
    const x = xMin + (index / 80) * (xMax - xMin);
    const y = slope * x + intercept;
    const px = pad + ((x - xMin) / (xMax - xMin)) * (width - pad * 2);
    const py = height - pad - ((Math.max(yMin, Math.min(yMax, y)) - yMin) / (yMax - yMin)) * (height - pad * 2);
    return `${px},${py}`;
  }).join(' ');
  const xAxis = height - pad - ((0 - yMin) / (yMax - yMin)) * (height - pad * 2);
  const yAxis = pad + ((0 - xMin) / (xMax - xMin)) * (width - pad * 2);
  const sampleInput = 3;
  const sampleOutput = slope * sampleInput + intercept;

  return h(
    LabCard,
    {
      title: 'Function Visualizer',
      prediction: 'Before moving the sliders, predict what happens when slope becomes negative. Does the line rise or fall as x increases?',
      iconType: Calculator,
    },
    h(
      PredictionPanel,
      {
        itemId: 'lab-function-visualizer',
        prompt: 'If slope increases while intercept stays the same, what do you think happens to the line?',
        predictionStore,
        expectedIdea:
          'Increasing slope makes the line steeper.\nPositive slope rises left to right.\nNegative slope falls left to right.\nIntercept moves the line up or down without changing steepness.',
      },
      h(
        'div',
        { className: 'grid gap-5 lg:grid-cols-[260px_1fr]' },
        h(
          'div',
          { className: 'space-y-3' },
          h(RangeSlider, { label: 'Slope', value: slope, min: -5, max: 5, step: 0.5, onChange: setSlope }),
          h(RangeSlider, { label: 'Intercept', value: intercept, min: -8, max: 8, step: 1, onChange: setIntercept }),
          h('div', { className: 'rounded-lg bg-blue-50 p-4 text-sm leading-7 text-blue-950' }, `Rule: y = ${slope}x ${intercept < 0 ? '- ' : '+ '}${Math.abs(intercept)}. When x is ${sampleInput}, y is ${sampleOutput}.`),
        ),
        h(
          'div',
          null,
          h(
            SvgFrame,
            null,
            h('line', { x1: pad, y1: xAxis, x2: width - pad, y2: xAxis, stroke: '#cbd5e1', strokeWidth: 1.5 }),
            h('line', { x1: yAxis, y1: pad, x2: yAxis, y2: height - pad, stroke: '#cbd5e1', strokeWidth: 1.5 }),
            [-10, -5, 5, 10].map((tick) => h('line', { key: `x-${tick}`, x1: pad + ((tick - xMin) / (xMax - xMin)) * (width - pad * 2), y1: pad, x2: pad + ((tick - xMin) / (xMax - xMin)) * (width - pad * 2), y2: height - pad, stroke: '#eef2f7' })),
            [-10, -5, 5, 10].map((tick) => h('line', { key: `y-${tick}`, x1: pad, y1: height - pad - ((tick - yMin) / (yMax - yMin)) * (height - pad * 2), x2: width - pad, y2: height - pad - ((tick - yMin) / (yMax - yMin)) * (height - pad * 2), stroke: '#eef2f7' })),
            h('polyline', { points, fill: 'none', stroke: '#2156a3', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 4 }),
            h('text', { x: width - 46, y: xAxis - 8, fill: '#64748b', fontSize: 12 }, 'x'),
            h('text', { x: yAxis + 8, y: 22, fill: '#64748b', fontSize: 12 }, 'y'),
          ),
          h('p', { className: 'mt-3 text-sm leading-7 text-slate-700' }, `Slope controls tilt: ${slope > 0 ? 'positive slope rises left to right' : slope < 0 ? 'negative slope falls left to right' : 'zero slope makes a flat line'}. Intercept controls where the line crosses the y-axis, so changing it moves the whole line up or down without changing its tilt.`),
        ),
      ),
    ),
  );
}

export function ProjectileMotionSimulator({ predictionStore }) {
  const [speed, setSpeed] = useState(30);
  const [angle, setAngle] = useState(45);
  const g = 9.8;
  const radians = (angle * Math.PI) / 180;
  const vx = speed * Math.cos(radians);
  const vy = speed * Math.sin(radians);
  const flightTime = (2 * vy) / g;
  const range = vx * flightTime;
  const maxHeight = (vy * vy) / (2 * g);
  const width = 420;
  const height = 260;
  const pad = 28;
  const yScaleMax = Math.max(maxHeight, 1);
  const path = Array.from({ length: 90 }, (_, index) => {
    const t = (index / 89) * flightTime;
    const x = vx * t;
    const y = vy * t - 0.5 * g * t * t;
    const px = pad + (x / Math.max(range, 1)) * (width - pad * 2);
    const py = height - pad - (Math.max(y, 0) / yScaleMax) * (height - pad * 2);
    return `${px},${py}`;
  }).join(' ');

  return h(
    LabCard,
    {
      title: 'Projectile Motion Simulator',
      prediction: 'Before changing the sliders, predict which angle gives a farther shot when launch speed stays the same.',
      iconType: Atom,
    },
    h(
      PredictionPanel,
      {
        itemId: 'lab-projectile-motion',
        prompt: 'If launch angle increases from 30 degrees to 60 degrees, do you think range always increases? Why?',
        predictionStore,
        expectedIdea:
          'Increasing speed generally increases range and height.\nAngle affects the tradeoff between height and distance.\nRange does not always increase as angle increases.\nAround 45 degrees gives maximum range in ideal no-air-resistance conditions.',
      },
      h(
        'div',
        { className: 'grid gap-5 lg:grid-cols-[260px_1fr]' },
        h(
          'div',
          { className: 'space-y-3' },
          h(RangeSlider, { label: 'Launch speed', value: speed, min: 10, max: 60, step: 1, unit: ' m/s', onChange: setSpeed }),
          h(RangeSlider, { label: 'Launch angle', value: angle, min: 10, max: 80, step: 1, unit: ' deg', onChange: setAngle }),
          h(
            'div',
            { className: 'grid gap-2 text-sm' },
            h(Metric, { label: 'Range', value: `${range.toFixed(1)} m` }),
            h(Metric, { label: 'Max height', value: `${maxHeight.toFixed(1)} m` }),
            h(Metric, { label: 'Flight time', value: `${flightTime.toFixed(2)} s` }),
          ),
        ),
        h(
          'div',
          null,
          h(
            SvgFrame,
            null,
            h('line', { x1: pad, y1: height - pad, x2: width - pad, y2: height - pad, stroke: '#cbd5e1', strokeWidth: 2 }),
            h('line', { x1: pad, y1: pad, x2: pad, y2: height - pad, stroke: '#e2e8f0', strokeWidth: 1.5 }),
            h('polyline', { points: path, fill: 'none', stroke: '#387761', strokeLinecap: 'round', strokeLinejoin: 'round', strokeWidth: 4 }),
            h('circle', { cx: pad, cy: height - pad, r: 5, fill: '#c56b35' }),
            h('text', { x: width - 88, y: height - 12, fill: '#64748b', fontSize: 12 }, `${range.toFixed(0)} m`),
            h('text', { x: pad + 8, y: pad + 14, fill: '#64748b', fontSize: 12 }, `${maxHeight.toFixed(0)} m high`),
          ),
          h('p', { className: 'mt-3 text-sm leading-7 text-slate-700' }, `The launch splits into horizontal and vertical components. Horizontal speed is ${vx.toFixed(1)} m/s and mostly carries the projectile forward. Vertical speed is ${vy.toFixed(1)} m/s and fights gravity, which pulls the projectile down at 9.8 m/s squared.`),
        ),
      ),
    ),
  );
}

export function AlgorithmComplexityVisualizer({ predictionStore }) {
  const [n, setN] = useState(40);
  const values = [
    ['O(log n)', Math.log2(n), '#2156a3'],
    ['O(n)', n, '#387761'],
    ['O(n^2)', n * n, '#c56b35'],
  ];
  const width = 420;
  const height = 260;
  const pad = 34;
  const maxLog = Math.log10(100 * 100 + 1);
  const makePath = (fn) =>
    Array.from({ length: 96 }, (_, index) => {
      const input = 5 + (index / 95) * 95;
      const raw = fn(input);
      const px = pad + ((input - 5) / 95) * (width - pad * 2);
      const py = height - pad - (Math.log10(raw + 1) / maxLog) * (height - pad * 2);
      return `${px},${py}`;
    }).join(' ');
  const xPosition = pad + ((n - 5) / 95) * (width - pad * 2);

  return h(
    LabCard,
    {
      title: 'Algorithm Complexity Visualizer',
      prediction: 'Before moving n upward, predict which curve becomes unreasonable first: O(log n), O(n), or O(n squared).',
      iconType: Code2,
    },
    h(
      PredictionPanel,
      {
        itemId: 'lab-algorithm-complexity',
        prompt: 'As n grows, which curve do you think becomes most expensive fastest?',
        predictionStore,
        expectedIdea:
          'O(log n) grows slowest.\nO(n) grows steadily.\nO(n^2) grows fastest.\nAs n gets large, inefficient algorithms become expensive quickly.',
      },
      h(
        'div',
        { className: 'grid gap-5 lg:grid-cols-[260px_1fr]' },
        h(
          'div',
          { className: 'space-y-3' },
          h(RangeSlider, { label: 'Input size n', value: n, min: 5, max: 100, step: 1, onChange: setN }),
          values.map(([label, value, color]) => h(Metric, { key: label, label, value: `${Math.round(value).toLocaleString()} steps`, color })),
        ),
        h(
          'div',
          null,
          h(
            SvgFrame,
            null,
            h('line', { x1: pad, y1: height - pad, x2: width - pad, y2: height - pad, stroke: '#cbd5e1', strokeWidth: 2 }),
            h('line', { x1: pad, y1: pad, x2: pad, y2: height - pad, stroke: '#e2e8f0', strokeWidth: 1.5 }),
            h('polyline', { points: makePath((input) => Math.log2(input)), fill: 'none', stroke: '#2156a3', strokeWidth: 3 }),
            h('polyline', { points: makePath((input) => input), fill: 'none', stroke: '#387761', strokeWidth: 3 }),
            h('polyline', { points: makePath((input) => input * input), fill: 'none', stroke: '#c56b35', strokeWidth: 3 }),
            h('line', { x1: xPosition, y1: pad, x2: xPosition, y2: height - pad, stroke: '#94a3b8', strokeDasharray: '4 4' }),
            h('text', { x: width - 98, y: 36, fill: '#c56b35', fontSize: 12 }, 'O(n^2)'),
            h('text', { x: width - 72, y: 116, fill: '#387761', fontSize: 12 }, 'O(n)'),
            h('text', { x: width - 88, y: 186, fill: '#2156a3', fontSize: 12 }, 'O(log n)'),
          ),
          h('p', { className: 'mt-3 text-sm leading-7 text-slate-700' }, `Scaling matters because small inputs can hide bad choices. At n = ${n}, O(log n) is about ${Math.log2(n).toFixed(1)} steps, O(n) is ${n} steps, and O(n squared) is ${n * n} steps. For large data, the growth pattern matters more than the exact machine speed.`),
        ),
      ),
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

export function LabCard({ title, prediction, iconType, children }) {
  return h(
    'article',
    { className: 'rounded-lg border border-slate-200 bg-white p-5 shadow-sm' },
    h(
      'div',
      { className: 'mb-4 flex items-start gap-3' },
      h('div', { className: 'grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-slate-100 text-cobalt' }, icon(iconType, { size: 20 })),
      h('div', null, h('h3', { className: 'text-lg font-bold text-ink' }, title), h('p', { className: 'mt-2 text-sm leading-7 text-slate-700' }, prediction)),
    ),
    children,
  );
}

export function modelLoss(points, slope, intercept) {
  return points.reduce((total, [x, y]) => total + (slope * x + intercept - y) ** 2, 0) / points.length;
}

export function trainLinearModel(points, slope, intercept, learningRate, steps) {
  let nextSlope = slope;
  let nextIntercept = intercept;
  const history = [];

  for (let step = 0; step < steps; step += 1) {
    const gradients = points.reduce(
      (total, [x, y]) => {
        const error = nextSlope * x + nextIntercept - y;
        return {
          slope: total.slope + error * x,
          intercept: total.intercept + error,
        };
      },
      { slope: 0, intercept: 0 },
    );

    nextSlope -= learningRate * (2 / points.length) * gradients.slope;
    nextIntercept -= learningRate * (2 / points.length) * gradients.intercept;
    history.push(modelLoss(points, nextSlope, nextIntercept));
  }

  return { slope: nextSlope, intercept: nextIntercept, history };
}

export function DataModelPlayground() {
  const [datasetId, setDatasetId] = useState(MODEL_DATASETS[0].id);
  const dataset = MODEL_DATASETS.find((item) => item.id === datasetId) || MODEL_DATASETS[0];
  const [slope, setSlope] = useState(dataset.initialSlope);
  const [intercept, setIntercept] = useState(dataset.initialIntercept);
  const [learningRate, setLearningRate] = useState(0.001);
  const [steps, setSteps] = useState(40);
  const [epochs, setEpochs] = useState(0);
  const [lossHistory, setLossHistory] = useState([modelLoss(dataset.points, dataset.initialSlope, dataset.initialIntercept)]);
  const width = 420;
  const height = 260;
  const pad = 36;
  const xValues = dataset.points.map(([x]) => x);
  const yValues = dataset.points.map(([, y]) => y);
  const xMin = Math.min(...xValues) - 0.5;
  const xMax = Math.max(...xValues) + 0.5;
  const predictionValues = [xMin, xMax].map((x) => slope * x + intercept);
  const yMin = Math.min(...yValues, ...predictionValues) - 8;
  const yMax = Math.max(...yValues, ...predictionValues) + 8;
  const toX = (x) => pad + ((x - xMin) / (xMax - xMin)) * (width - pad * 2);
  const toY = (y) => height - pad - ((y - yMin) / (yMax - yMin)) * (height - pad * 2);
  const loss = modelLoss(dataset.points, slope, intercept);
  const prediction = slope * dataset.predictionX + intercept;
  const linePoints = `${toX(xMin)},${toY(slope * xMin + intercept)} ${toX(xMax)},${toY(slope * xMax + intercept)}`;
  const bestLoss = Math.min(...lossHistory, loss);

  function resetFor(nextDataset = dataset) {
    setSlope(nextDataset.initialSlope);
    setIntercept(nextDataset.initialIntercept);
    setEpochs(0);
    setLossHistory([modelLoss(nextDataset.points, nextDataset.initialSlope, nextDataset.initialIntercept)]);
  }

  function chooseDataset(nextId) {
    const nextDataset = MODEL_DATASETS.find((item) => item.id === nextId) || MODEL_DATASETS[0];
    setDatasetId(nextDataset.id);
    resetFor(nextDataset);
  }

  function train() {
    const result = trainLinearModel(dataset.points, slope, intercept, learningRate, steps);
    setSlope(Number(result.slope.toFixed(4)));
    setIntercept(Number(result.intercept.toFixed(4)));
    setEpochs((value) => value + steps);
    setLossHistory((current) => [...current, ...result.history].slice(-80));
  }

  return h(
    'section',
    { className: 'space-y-4 scroll-mt-6', id: 'data-model-playground' },
    h(
      'div',
      { className: 'rounded-lg border border-slate-200 bg-white p-5 shadow-sm' },
      h('p', { className: 'text-sm font-semibold uppercase tracking-wide text-fern' }, 'Data & Model Playground'),
      h('h2', { className: 'mt-1 text-2xl font-bold' }, 'Train a tiny prediction model'),
      h('p', { className: 'mt-3 max-w-3xl text-sm leading-7 text-slate-700' }, 'Choose a small dataset, tune the line by hand, then train it with gradient descent. The goal is to see how model parameters, loss, and predictions move together.'),
    ),
    h(
      'div',
      { className: 'grid gap-4 lg:grid-cols-[300px_1fr]' },
      h(
        'aside',
        { className: 'space-y-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm' },
        h(
          'label',
          { className: 'block text-sm font-bold uppercase tracking-wide text-slate-500' },
          'Dataset',
          h(
            'select',
            {
              className: 'mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-ink outline-none focus:border-cobalt focus:bg-white focus:ring-2 focus:ring-blue-100',
              value: datasetId,
              onChange: (event) => chooseDataset(event.target.value),
            },
            MODEL_DATASETS.map((item) => h('option', { key: item.id, value: item.id }, item.name)),
          ),
        ),
        h('div', { className: 'rounded-lg bg-blue-50 p-4 text-sm leading-7 text-blue-950' }, h('p', { className: 'font-bold' }, dataset.story), h('p', { className: 'mt-2' }, dataset.aiConnection)),
        h(RangeSlider, { label: 'Slope', value: slope, min: -30, max: 30, step: 0.5, onChange: setSlope }),
        h(RangeSlider, { label: 'Intercept', value: intercept, min: -80, max: 500, step: 1, onChange: setIntercept }),
        h(RangeSlider, { label: 'Learning rate', value: learningRate, min: 0.0001, max: 0.01, step: 0.0001, onChange: setLearningRate }),
        h(RangeSlider, { label: 'Training steps', value: steps, min: 5, max: 200, step: 5, onChange: setSteps }),
        h(
          'div',
          { className: 'flex flex-col gap-2 sm:flex-row lg:flex-col' },
          h(
            'button',
            {
              className: 'rounded-lg bg-cobalt px-4 py-2.5 text-sm font-bold text-white shadow-soft transition hover:bg-blue-800',
              onClick: train,
            },
            'Train model',
          ),
          h(
            'button',
            {
              className: 'rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50',
              onClick: () => resetFor(),
            },
            'Reset model',
          ),
        ),
      ),
      h(
        'div',
        { className: 'space-y-4' },
        h(
          'div',
          { className: 'grid gap-3 sm:grid-cols-2 xl:grid-cols-4' },
          h(Metric, { label: 'Mean squared error', value: loss.toFixed(1), color: loss <= bestLoss ? '#047857' : '#c56b35' }),
          h(Metric, { label: 'Epochs trained', value: epochs.toString(), color: '#2156a3' }),
          h(Metric, { label: `Predict at ${dataset.xLabel} ${dataset.predictionX}`, value: prediction.toFixed(1), color: '#172033' }),
          h(Metric, { label: 'Model rule', value: `y = ${slope.toFixed(2)}x ${intercept < 0 ? '- ' : '+ '}${Math.abs(intercept).toFixed(1)}`, color: '#387761' }),
        ),
        h(
          'div',
          { className: 'rounded-lg border border-slate-200 bg-white p-4 shadow-sm' },
          h(
            SvgFrame,
            null,
            h('line', { x1: pad, y1: height - pad, x2: width - pad, y2: height - pad, stroke: '#cbd5e1', strokeWidth: 2 }),
            h('line', { x1: pad, y1: pad, x2: pad, y2: height - pad, stroke: '#e2e8f0', strokeWidth: 1.5 }),
            dataset.points.map(([x, y]) =>
              h('line', {
                key: `residual-${x}-${y}`,
                x1: toX(x),
                y1: toY(y),
                x2: toX(x),
                y2: toY(slope * x + intercept),
                stroke: '#f97316',
                strokeDasharray: '4 4',
                strokeWidth: 1.5,
              }),
            ),
            h('polyline', { points: linePoints, fill: 'none', stroke: '#2156a3', strokeLinecap: 'round', strokeWidth: 4 }),
            dataset.points.map(([x, y]) => h('circle', { key: `${x}-${y}`, cx: toX(x), cy: toY(y), r: 5, fill: '#387761', stroke: '#ffffff', strokeWidth: 2 })),
            h('text', { x: width - 120, y: height - 12, fill: '#64748b', fontSize: 12 }, dataset.xLabel),
            h('text', { x: pad + 8, y: 22, fill: '#64748b', fontSize: 12 }, dataset.yLabel),
          ),
          h('p', { className: 'mt-3 text-sm leading-7 text-slate-700' }, 'Green dots are real examples. The blue line is the model prediction. Orange dashed lines are errors: shorter residuals mean the model fits the data better. Training changes slope and intercept to reduce those errors.'),
        ),
        h(
          'div',
          { className: 'grid gap-4 lg:grid-cols-2' },
          h(
            'div',
            { className: 'rounded-lg border border-slate-200 bg-white p-4 shadow-sm' },
            h('h3', { className: 'text-sm font-bold uppercase tracking-wide text-slate-500' }, 'Dataset'),
            h(
              'div',
              { className: 'mt-3 grid grid-cols-2 gap-2 text-sm' },
              dataset.points.map(([x, y]) => h('div', { className: 'rounded-lg bg-slate-50 p-2 text-slate-700', key: `${x}-${y}` }, `${dataset.xLabel}: ${x} -> ${dataset.yLabel}: ${y}`)),
            ),
          ),
          h(
            'div',
            { className: 'rounded-lg border border-slate-200 bg-white p-4 shadow-sm' },
            h('h3', { className: 'text-sm font-bold uppercase tracking-wide text-slate-500' }, 'What to notice'),
            h(
              'ul',
              { className: 'mt-3 space-y-2 text-sm leading-6 text-slate-700' },
              [
                'Slope controls how strongly the input changes the prediction.',
                'Intercept moves the prediction line up or down.',
                'Loss measures how wrong the model is across the dataset.',
                'Training is parameter tuning guided by error.',
              ].map((item) => h('li', { className: 'flex gap-2', key: item }, h('span', { className: 'font-bold text-fern' }, '-'), h('span', null, item))),
            ),
          ),
        ),
      ),
    ),
  );
}

export function InteractiveLabs({ predictionStore, foundationState }) {
  const hasFoundationReview = FOUNDATION_CONCEPTS[0].microLessons.some((lesson) => foundationState?.progress?.[lesson.id]?.complete);

  return h(
    'section',
    { className: 'space-y-4 scroll-mt-6', id: 'labs' },
    h(
      'div',
      { className: 'rounded-lg border border-slate-200 bg-white p-5 shadow-sm' },
      h('p', { className: 'text-sm font-semibold uppercase tracking-wide text-fern' }, 'Interactive Labs'),
      h('h2', { className: 'mt-1 text-2xl font-bold' }, 'See the model respond'),
      h('p', { className: 'mt-3 max-w-3xl text-sm leading-7 text-slate-700' }, 'Each lab starts with a prediction, then gives immediate visual feedback as you change the inputs. The goal is to connect formulas, physical behavior, and computational scaling through direct manipulation.'),
      hasFoundationReview ? h('p', { className: 'mt-3 rounded-lg bg-amber-50 p-3 text-sm font-bold text-amber-900' }, 'Review: you learned this earlier. The Function Visualizer uses the same input -> output idea from Foundation Mode.') : null,
    ),
    h(FunctionVisualizer, { predictionStore }),
    h(ProjectileMotionSimulator, { predictionStore }),
    h(AlgorithmComplexityVisualizer, { predictionStore }),
  );
}