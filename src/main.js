import React, { useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';
import {
  Atom,
  Beaker,
  BrainCircuit,
  Bug,
  Calculator,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Code2,
  Compass,
  CalendarCheck,
  FlaskConical,
  Gauge,
  LayoutDashboard,
  PenLine,
  PlayCircle,
  RotateCcw,
  Rocket,
  Search,
  Sparkles,
  ClipboardList,
} from 'lucide-react';
import { deepLessons } from './curriculum.js';
import { buildChallenges } from './buildChallenges.js';
import { debugChallenges } from './debugChallenges.js';
import { codeReadingChallenges } from './codeReadingChallenges.js';
import { karpathyMilestones, karpathyPhases, nextKarpathyMilestone } from './karpathyPath.js';
import { thinkingChallenges } from './thinkingChallenges.js';
import { architectureLessons, architectureStats, curriculumArchitecture, isArchitectureLessonUnlocked, recommendedArchitectureLesson } from './curriculumArchitecture.js';
import { projectTracks } from './projectTracks.js';
import { adaptiveLessonForSkill, evaluateSkillGraph, weakestUnlockedSkill } from './skillGraph.js';
import './styles.css';

const h = React.createElement;
const STORAGE_KEY = 'triad-academy-progress-v1';
const SESSION_KEY = 'triad-academy-session-history-v1';
const PREDICTION_KEY = 'triad-academy-predictions-v1';
const BUILD_KEY = 'triad-academy-build-mode-v1';
const SOLVE_KEY = 'triad-academy-solve-before-reveal-v1';
const REVIEW_KEY = 'triad-academy-review-history-v1';
const THINKING_KEY = 'triad-academy-thinking-lab-v1';
const ARCHITECTURE_KEY = 'triad-academy-curriculum-path-v1';
const PROJECTS_KEY = 'triad-academy-project-tracks-v1';
const AI_TUTOR_CHAT_KEY = 'triad-academy-ai-tutor-chat-v1';
const DEBUG_KEY = 'triad-academy-debug-mode-v1';
const CODE_READING_KEY = 'triad-academy-code-reading-v1';
const KARPATHY_KEY = 'triad-academy-karpathy-path-v1';
const PILOT_TEST_KEY = 'triad-academy-pilot-test-v1';
const FOUNDATION_KEY = 'triad-academy-foundation-mode-v1';
const TRIAD_STORAGE_KEYS = [
  STORAGE_KEY,
  SESSION_KEY,
  PREDICTION_KEY,
  BUILD_KEY,
  SOLVE_KEY,
  REVIEW_KEY,
  THINKING_KEY,
  ARCHITECTURE_KEY,
  PROJECTS_KEY,
  AI_TUTOR_CHAT_KEY,
  DEBUG_KEY,
  CODE_READING_KEY,
  KARPATHY_KEY,
  PILOT_TEST_KEY,
  FOUNDATION_KEY,
];
const LAB_IDS = ['lab-function-visualizer', 'lab-projectile-motion', 'lab-algorithm-complexity'];
const MODEL_DATASETS = [
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

const PILOT_PRE_QUESTIONS = [
  'In your own words, what does a function do?',
  'If y = 2x + 1 and x is 3, what do you predict y will be?',
  'What is one thing you do when code does not behave the way you expected?',
];

const PILOT_POST_QUESTIONS = [
  'After the session, how would you explain a function to a beginner?',
  'What changed in your understanding of predictions, tests, or debugging?',
  'Which activity taught you the most: lesson, lab, or applied task? Why?',
];

const PILOT_STEPS = [
  { id: 'pre-test', title: 'Pre-test', minutes: 4, href: '#pilot-pre-test', detail: 'Answer baseline questions and set before-confidence.' },
  { id: 'lesson', title: 'Lesson', minutes: 8, href: '#math-inputs-and-outputs', detail: 'Complete the assigned function lesson gate.' },
  { id: 'lab', title: 'Lab', minutes: 6, href: '#labs', detail: 'Use the Function Visualizer prediction cycle.' },
  { id: 'applied-task', title: 'Applied task', minutes: 6, href: '#build-function-rule-builder', detail: 'Complete Function Rule Builder with passing tests.' },
  { id: 'post-test', title: 'Post-test', minutes: 4, href: '#pilot-post-test', detail: 'Answer final questions and after-confidence.' },
  { id: 'feedback', title: 'Feedback', minutes: 2, href: '#pilot-test', detail: 'Record friction and export results.' },
];

const FOUNDATION_CONCEPTS = [
  {
    id: 'foundation-functions',
    title: 'Functions: Inputs and Outputs',
    labHref: '#labs',
    buildHref: '#build-function-rule-builder',
    microLessons: [
      {
        id: 'foundation-inputs',
        title: 'What is an input?',
        explanation: 'An input is what you put in. It is the starting value.',
        examples: ['Put 3 into a rule.', 'Type your name into a form.', 'Set speed to 20 in a simulator.'],
        representations: {
          numbers: 'Input: 4',
          visual: 'Move a slider. The slider value is the input.',
          code: 'lineOutput(4, 2, 1)',
          realWorld: 'A vending machine input is the button you press.',
        },
        questions: [
          { prompt: 'In lineOutput(3, 2, 1), what is x?', answer: '3', feedback: 'Yes. x is the first input.' },
          { prompt: 'If a slider is set to 7, what is the input?', answer: '7', feedback: 'Yes. The slider value is the input.' },
          { prompt: 'In score(10), what number goes in?', answer: '10', feedback: 'Yes. 10 goes into the rule.' },
        ],
        variations: [
          { prompt: 'In lineOutput(5, 2, 1), what is x?', answer: '5' },
          { prompt: 'If a slider is set to 9, what is the input?', answer: '9' },
        ],
      },
      {
        id: 'foundation-outputs',
        title: 'What is an output?',
        explanation: 'An output is what comes out after the rule runs.',
        examples: ['Input 3 gives output 7.', 'A calculator shows 12.', 'A model predicts 85.'],
        representations: {
          numbers: 'Input 4 -> Output 9',
          visual: 'A point appears on a graph after the input is chosen.',
          code: 'return y',
          realWorld: 'A vending machine output is the snack.',
        },
        questions: [
          { prompt: 'If input 3 gives 7, what is the output?', answer: '7', feedback: 'Yes. 7 came out.' },
          { prompt: 'If a calculator shows 12, what is the output?', answer: '12', feedback: 'Yes. The displayed result is the output.' },
          { prompt: 'If y = 2x and x = 5, what is y?', answer: '10', feedback: 'Yes. 2 times 5 gives 10.' },
        ],
        variations: [
          { prompt: 'If input 4 gives 9, what is the output?', answer: '9' },
          { prompt: 'If y = 3x and x = 2, what is y?', answer: '6' },
        ],
      },
      {
        id: 'foundation-match-input-output',
        title: 'Match inputs to outputs',
        explanation: 'A function pairs each input with an output.',
        examples: ['1 -> 3', '2 -> 5', '3 -> 7', 'Each input has a matching output.'],
        representations: {
          numbers: '2 -> 5',
          visual: 'A table row connects one input to one output.',
          code: 'return 2 * x + 1',
          realWorld: 'A recipe input is cups of flour. The output is dough amount.',
        },
        questions: [
          { prompt: 'In 2 -> 5, what output matches input 2?', answer: '5', feedback: 'Yes. 2 matches with 5.' },
          { prompt: 'In 4 -> 11, what input makes 11?', answer: '4', feedback: 'Yes. 4 is paired with 11.' },
          { prompt: 'If x is 6 and output is 13, what does x equal?', answer: '6', feedback: 'Yes. x is the input.' },
        ],
        variations: [
          { prompt: 'In 3 -> 8, what output matches input 3?', answer: '8' },
          { prompt: 'In 5 -> 12, what input makes 12?', answer: '5' },
        ],
      },
      {
        id: 'foundation-find-rule',
        title: 'Find the rule',
        explanation: 'A rule tells how to turn the input into the output.',
        examples: ['Input 1 -> 3 means maybe double and add 1.', 'Input 2 -> 5 also fits double and add 1.', 'Input 3 -> 7 confirms the pattern.'],
        representations: {
          numbers: 'y = 2x + 1',
          visual: 'A straight line shows the same rule again and again.',
          code: 'const y = 2 * x + 1',
          realWorld: 'A taxi fare can be a starting fee plus dollars per mile.',
        },
        questions: [
          { prompt: 'Rule: double x. If x = 4, what is the output?', answer: '8', feedback: 'Yes. Double 4 is 8.' },
          { prompt: 'Rule: add 3. If x = 5, what is the output?', answer: '8', feedback: 'Yes. 5 plus 3 is 8.' },
          { prompt: 'Rule: 2x + 1. If x = 3, what is y?', answer: '7', feedback: 'Yes. 2 times 3 plus 1 is 7.' },
        ],
        variations: [
          { prompt: 'Rule: double x. If x = 6, what is the output?', answer: '12' },
          { prompt: 'Rule: 2x + 1. If x = 4, what is y?', answer: '9' },
        ],
      },
      {
        id: 'foundation-change-inputs',
        title: 'Change inputs, watch outputs',
        explanation: 'When the input changes, the output may change too.',
        examples: ['If x goes from 2 to 3, y may go from 5 to 7.', 'Changing slope changes outputs faster.', 'Changing intercept shifts outputs up or down.'],
        representations: {
          numbers: 'x = 2 gives 5. x = 3 gives 7.',
          visual: 'The graph point moves when the input changes.',
          code: 'lineOutput(x, m, b)',
          realWorld: 'More study time can change a predicted quiz score.',
        },
        questions: [
          { prompt: 'Rule: y = 2x + 1. If x changes from 2 to 3, does y change?', answer: 'yes', feedback: 'Yes. The output changes from 5 to 7.' },
          { prompt: 'Rule: y = x + 4. If x = 6, what is y?', answer: '10', feedback: 'Yes. 6 plus 4 is 10.' },
          { prompt: 'If the input changes, what should you check next: input or output?', answer: 'output', feedback: 'Yes. Check what came out.' },
        ],
        variations: [
          { prompt: 'Rule: y = x + 4. If x = 8, what is y?', answer: '12' },
          { prompt: 'If x changes, should you expect the output might change?', answer: 'yes' },
        ],
      },
    ],
  },
];

const lessons = {
  math: {
    title: 'Math',
    icon: Calculator,
    color: 'text-cobalt',
    lessons: [
      {
        id: 'math-numbers-variables-equations',
        title: 'Numbers, Variables, and Equations',
        level: 'Foundation',
        bigIdea: 'Numbers measure amounts. Variables name amounts that can change or are not known yet. Equations say two expressions have the same value.',
        whyItMatters: 'Equations turn vague questions into solvable statements, from budgeting to engineering. AI systems also use variables and equations internally when they turn data into predictions.',
        mentalModel: 'Think of a variable as a labeled empty box. An equation is a balance scale: whatever is on the left must match whatever is on the right.',
        guidedExample: 'If x + 4 = 10, the box plus 4 balances with 10. Subtract 4 from both sides and x = 6.',
        bridge: 'Physics uses variables like time, mass, and speed. Computer science uses variables to store values while a program runs.',
        prediction: {
          question: 'If y - 3 = 9, what value do you predict y must have?',
          answer: 'y must be 12 because 12 - 3 = 9.',
        },
        quiz: {
          question: 'What does a variable usually represent?',
          options: ['A value that can change or is unknown', 'Only the number zero', 'A drawing tool for graphs', 'A force acting on an object'],
          correctIndex: 0,
          feedback: [
            'Correct. A variable is a name for a value you can use in reasoning.',
            'No. A variable can equal zero, but it can represent many values.',
            'Not quite. Variables can be graphed, but they are not drawing tools.',
            'No. Force is a physics quantity that can be stored in a variable.',
          ],
        },
      },
      {
        id: 'math-algebra-solving-unknowns',
        title: 'Algebra and Solving Unknowns',
        level: 'Foundation',
        bigIdea: 'Algebra is the art of rearranging relationships so the unknown value becomes clear.',
        whyItMatters: 'Solving unknowns helps you compare plans, predict outcomes, and reverse-engineer missing information. AI training often solves for values that make predictions fit data better.',
        mentalModel: 'Solving an equation is like carefully untangling a knot. You undo operations in reverse order while keeping both sides balanced.',
        guidedExample: 'For 3x + 2 = 14, subtract 2 to get 3x = 12. Divide by 3 to get x = 4.',
        bridge: 'Algebra powers physics formulas such as F = ma and computer programs that calculate missing values from known inputs.',
        prediction: {
          question: 'If 2x + 5 = 17, what operation should you do first?',
          answer: 'Subtract 5 from both sides first, giving 2x = 12.',
        },
        quiz: {
          question: 'Why do we do the same operation to both sides of an equation?',
          options: ['To keep the equation balanced', 'To make numbers larger', 'To change the meaning of the unknown', 'To avoid using variables'],
          correctIndex: 0,
          feedback: [
            'Correct. Equal changes preserve equality.',
            'No. Sometimes numbers get smaller; balance is the goal.',
            'No. The unknown keeps its meaning while we reveal its value.',
            'No. Algebra depends on variables.',
          ],
        },
      },
      {
        id: 'math-functions-graphs',
        title: 'Functions and Graphs',
        level: 'Foundation',
        bigIdea: 'A function connects each input to an output. A graph shows that relationship as a picture.',
        whyItMatters: 'Graphs make patterns visible in prices, motion, climate, code performance, and AI predictions. Seeing the shape helps you understand behavior quickly.',
        mentalModel: 'A function is a machine; a graph is its trail. Every point on the graph says, "this input produced this output."',
        guidedExample: 'For f(x) = 2x + 1, input 0 gives 1, input 1 gives 3, and input 2 gives 5. Plotting those points creates a straight line.',
        bridge: 'Physics graphs position over time, and CS functions turn inputs into outputs just like math functions do.',
        prediction: {
          question: 'If f(x) = x + 5, what do you predict happens to the graph when x increases by 1?',
          answer: 'The output also increases by 1, so the graph rises steadily.',
        },
        quiz: {
          question: 'What does one point on a function graph show?',
          options: ['One input-output pair', 'Only the largest output', 'The unit of measurement', 'The computer memory address'],
          correctIndex: 0,
          feedback: [
            'Correct. A point like (2, 5) means input 2 gives output 5.',
            'No. A graph contains many points, not only the largest one.',
            'No. Units help interpret graphs but are not the point itself.',
            'No. Memory addresses are a computer science detail.',
          ],
        },
      },
      {
        id: 'math-slope-rate-change',
        title: 'Slope and Rate of Change',
        level: 'Core',
        bigIdea: 'Slope measures how much the output changes when the input changes by one step.',
        whyItMatters: 'Slope describes speed, growth, cost per item, and trends in data. In AI, rates of change guide how a model adjusts during training.',
        mentalModel: 'Slope is the steepness of a ramp. A larger positive slope climbs faster; a negative slope goes downward as you move right.',
        guidedExample: 'If a line goes from (1, 3) to (4, 9), slope = (9 - 3) / (4 - 1) = 2. The output rises 2 for each 1 step in input.',
        bridge: 'In physics, velocity is the slope of a position-time graph. In CS, performance graphs show how runtime changes as input grows.',
        prediction: {
          question: 'If a line has slope -3, what happens to y when x increases by 1?',
          answer: 'y decreases by 3.',
        },
        quiz: {
          question: 'Which phrase best describes slope?',
          options: ['Change in output divided by change in input', 'The starting point of every graph', 'The total area under a curve', 'A list of program instructions'],
          correctIndex: 0,
          feedback: [
            'Correct. Slope is rise over run.',
            'No. The starting point may be an intercept, not slope.',
            'No. Area under a curve connects to integrals.',
            'No. Instructions belong to programming.',
          ],
        },
      },
      {
        id: 'math-systems-equations',
        title: 'Systems of Equations',
        level: 'Core',
        bigIdea: 'A system of equations is a set of relationships that must all be true at the same time.',
        whyItMatters: 'Systems help solve mixtures, schedules, budgets, and engineering constraints. AI and graphics often solve many equations together to fit models or render scenes.',
        mentalModel: 'Each equation is a rule. The solution is the place where all the rules agree.',
        guidedExample: 'If x + y = 10 and x = 6, then y must be 4. Both equations are true at the same time.',
        bridge: 'Physics uses systems to model connected forces. Computer science uses systems when multiple constraints must be satisfied together.',
        prediction: {
          question: 'If two lines cross once, how many solutions do you predict their system has?',
          answer: 'One solution, located at the crossing point.',
        },
        quiz: {
          question: 'What is a solution to a system of equations?',
          options: ['Values that make every equation true', 'Any number on the page', 'Only the largest variable', 'A graph with no labels'],
          correctIndex: 0,
          feedback: [
            'Correct. A system solution must satisfy all equations.',
            'No. Random numbers usually do not satisfy every relationship.',
            'No. The solution can include several variables.',
            'No. A graph can show a system, but labels do not define the solution.',
          ],
        },
      },
      {
        id: 'math-exponents-logarithms',
        title: 'Exponents and Logarithms',
        level: 'Core',
        bigIdea: 'Exponents describe repeated multiplication. Logarithms reverse exponents by asking what power was used.',
        whyItMatters: 'Exponential growth appears in populations, interest, sound, data storage, and algorithms. Logarithms help compress huge ranges into understandable scales.',
        mentalModel: 'An exponent is a growth engine. A logarithm is the detective that asks, "how many times did we multiply?"',
        guidedExample: '2 to the 3rd power is 8. So log base 2 of 8 is 3 because 2 had to be multiplied by itself 3 times to reach 8.',
        bridge: 'Waves use logarithmic decibels, and CS uses logarithms to describe efficient search in sorted data.',
        prediction: {
          question: 'If 10 to the 4th power is 10,000, what is log base 10 of 10,000?',
          answer: 'It is 4 because 10 uses power 4 to make 10,000.',
        },
        quiz: {
          question: 'What does a logarithm undo?',
          options: ['An exponent', 'A unit conversion', 'A force', 'A loop condition'],
          correctIndex: 0,
          feedback: [
            'Correct. Logs and exponents are inverse ideas.',
            'No. Unit conversions are separate measurement tools.',
            'No. Force is a physical interaction.',
            'No. Loop conditions are programming logic.',
          ],
        },
      },
      {
        id: 'math-trigonometry-basics',
        title: 'Trigonometry Basics',
        level: 'Core',
        bigIdea: 'Trigonometry connects angles with side lengths and circular motion.',
        whyItMatters: 'Trig helps with navigation, architecture, waves, games, robotics, and projectile motion. AI systems for vision and robotics often use geometry and angles.',
        mentalModel: 'Sine and cosine are shadow-makers. As a point moves around a circle, cosine gives its horizontal shadow and sine gives its vertical shadow.',
        guidedExample: 'In a right triangle, sine of an angle equals opposite side divided by hypotenuse. If opposite is 3 and hypotenuse is 5, sin(angle) = 3/5 = 0.6.',
        bridge: 'Physics uses trig to split motion into horizontal and vertical parts. Computer graphics uses trig to rotate objects.',
        prediction: {
          question: 'If a projectile launches at a steeper angle, what happens to its vertical component?',
          answer: 'The vertical component increases because more of the speed points upward.',
        },
        quiz: {
          question: 'What does sine relate in a right triangle?',
          options: ['Opposite side divided by hypotenuse', 'Mass times acceleration', 'Input size squared', 'The number of variables'],
          correctIndex: 0,
          feedback: [
            'Correct. Sine connects an angle to opposite over hypotenuse.',
            'No. Mass times acceleration is force.',
            'No. Input size squared is an algorithm growth pattern.',
            'No. Variables are algebra symbols.',
          ],
        },
      },
      {
        id: 'math-calculus-derivatives',
        title: 'Calculus: Derivatives',
        level: 'Advanced',
        bigIdea: 'A derivative measures the instant rate of change of a function.',
        whyItMatters: 'Derivatives describe velocity, growth, optimization, and sensitivity. Machine learning uses derivatives to reduce loss during training.',
        mentalModel: 'Zoom in on a smooth curve until it looks almost straight. The slope of that tiny straight piece is the derivative at that point.',
        guidedExample: 'If s(t) = t squared, then its derivative is 2t. At t = 4, the rate of change is 8 units per second.',
        bridge: 'Physics uses derivatives for velocity and acceleration. AI uses them to decide how to update model weights.',
        prediction: {
          question: 'If a position graph is flat at one moment, what do you predict the velocity is at that moment?',
          answer: 'The velocity is zero because the position is not changing at that instant.',
        },
        quiz: {
          question: 'What does the derivative of position with respect to time give?',
          options: ['Velocity', 'Mass', 'Probability', 'Memory usage'],
          correctIndex: 0,
          feedback: [
            'Correct. Velocity is the rate of change of position.',
            'No. Mass is not a rate of change.',
            'No. Probability measures uncertainty.',
            'No. Memory usage is a computing resource.',
          ],
        },
      },
      {
        id: 'math-probability-expected-value',
        title: 'Probability and Expected Value',
        level: 'Core',
        bigIdea: 'Probability measures uncertainty. Expected value is the long-run average outcome if a situation repeats many times.',
        whyItMatters: 'Expected value guides choices in games, insurance, medicine, forecasting, and AI decision systems. It helps compare uncertain options rationally.',
        mentalModel: 'Expected value is the average you would expect after many repeats, not a promise for the next single try.',
        guidedExample: 'If a game pays 10 dollars with probability 0.2 and 0 dollars otherwise, expected value is 10 x 0.2 + 0 x 0.8 = 2 dollars.',
        bridge: 'Physics uses probability in measurement uncertainty. AI uses probabilities and expected outcomes when choosing among possible actions.',
        prediction: {
          question: 'If a 1 dollar prize has a 50 percent chance, what is its expected value?',
          answer: 'The expected value is 50 cents because 1 x 0.5 = 0.5.',
        },
        quiz: {
          question: 'What is expected value?',
          options: ['The probability-weighted average outcome', 'The biggest possible outcome only', 'A guarantee for the next trial', 'The slope of a line'],
          correctIndex: 0,
          feedback: [
            'Correct. Expected value combines outcomes with their probabilities.',
            'No. It accounts for all outcomes, not only the biggest one.',
            'No. It describes long-run average behavior.',
            'No. Slope measures rate of change.',
          ],
        },
      },
      {
        id: 'math-linear-algebra-vectors-matrices',
        title: 'Linear Algebra: Vectors and Matrices',
        level: 'Advanced',
        bigIdea: 'Vectors store quantities with direction or multiple components. Matrices organize numbers that can transform vectors or represent relationships.',
        whyItMatters: 'Linear algebra powers 3D graphics, physics simulations, data science, and modern AI. Neural networks are built from many matrix operations.',
        mentalModel: 'A vector is an arrow or a row of features. A matrix is a machine that can stretch, rotate, mix, or project those features.',
        guidedExample: 'The vector [3, 4] can represent moving 3 units right and 4 units up. Its length is 5 by the Pythagorean theorem.',
        bridge: 'Physics uses vectors for forces and velocity. Computer science uses matrices to process images, graphs, and AI model weights.',
        prediction: {
          question: 'If a force has components [0, 10], which direction do you predict it points?',
          answer: 'It points straight upward because the horizontal component is 0 and the vertical component is positive.',
        },
        quiz: {
          question: 'Why are vectors useful?',
          options: ['They can store direction and multiple components', 'They only store true or false', 'They erase uncertainty', 'They prevent loops in code'],
          correctIndex: 0,
          feedback: [
            'Correct. Vectors are compact ways to represent multi-part quantities.',
            'No. Booleans store true or false.',
            'No. Probability handles uncertainty.',
            'No. Loop control is a programming issue.',
          ],
        },
      },
    ],
  },
  physics: {
    title: 'Physics',
    icon: Atom,
    color: 'text-fern',
    lessons: [
      {
        id: 'physics-measurement-units-estimation',
        title: 'Measurement, Units, and Estimation',
        level: 'Foundation',
        bigIdea: 'Physics begins by measuring the world with units and making reasonable estimates when exact values are unavailable.',
        whyItMatters: 'Good measurement prevents bad designs, unsafe machines, and misleading data. AI systems also depend on clean units and sensible input scales.',
        mentalModel: 'A number without a unit is like an address without a street name. The unit tells what kind of quantity the number describes.',
        guidedExample: 'A desk might be about 1.2 meters long. Saying "1.2" alone is incomplete; saying "1.2 meters" makes the measurement meaningful.',
        bridge: 'Math handles unit conversions, and CS programs must track units carefully to avoid silent calculation errors.',
        prediction: {
          question: 'Which is more reasonable for the height of a door: 2 meters or 20 meters?',
          answer: '2 meters is reasonable. 20 meters would be taller than a many-story building.',
        },
        quiz: {
          question: 'Why are units important?',
          options: ['They tell what a number measures', 'They make every number larger', 'They replace equations', 'They are only needed in chemistry'],
          correctIndex: 0,
          feedback: [
            'Correct. Units give physical meaning to numbers.',
            'No. Units do not make values larger or smaller by themselves.',
            'No. Equations still matter.',
            'No. Units are essential throughout science and engineering.',
          ],
        },
      },
      {
        id: 'physics-motion-position-velocity-acceleration',
        title: 'Motion: Position, Velocity, Acceleration',
        level: 'Foundation',
        bigIdea: 'Motion describes how position changes over time. Velocity is change in position, and acceleration is change in velocity.',
        whyItMatters: 'Motion matters for driving, sports, robotics, rockets, and animation. AI systems that navigate the world must predict motion to act safely.',
        mentalModel: 'Position is where you are, velocity is how fast your position changes, and acceleration is how fast your velocity changes.',
        guidedExample: 'If a runner moves from 10 meters to 18 meters between 2 and 4 seconds, average velocity is (18 - 10) / (4 - 2) = 4 meters per second.',
        bridge: 'Calculus links these ideas mathematically, and CS simulations update position and velocity step by step.',
        prediction: {
          question: 'If velocity stays constant, what do you predict acceleration is?',
          answer: 'Acceleration is zero because velocity is not changing.',
        },
        quiz: {
          question: 'Which quantity measures change in velocity?',
          options: ['Acceleration', 'Position', 'Mass', 'Voltage'],
          correctIndex: 0,
          feedback: [
            'Correct. Acceleration is the rate of change of velocity.',
            'No. Position tells location.',
            'No. Mass describes inertia.',
            'No. Voltage belongs to electricity.',
          ],
        },
      },
      {
        id: 'physics-graphing-motion',
        title: 'Graphing Motion',
        level: 'Core',
        bigIdea: 'Motion graphs show how position, velocity, or acceleration changes over time.',
        whyItMatters: 'Graphs reveal patterns that raw numbers hide. Robots, vehicles, and AI trackers use motion data to predict what happens next.',
        mentalModel: 'A motion graph is a story told with axes: time usually moves right, and the vertical value shows what is changing.',
        guidedExample: 'On a position-time graph, a steeper line means faster motion. A flat line means the object is not changing position.',
        bridge: 'Slope from math becomes velocity in physics, and CS uses plotted sensor data to debug moving systems.',
        prediction: {
          question: 'If a position-time graph curves upward and gets steeper, what happens to speed?',
          answer: 'Speed increases because the slope of the position graph is increasing.',
        },
        quiz: {
          question: 'What does slope on a position-time graph represent?',
          options: ['Velocity', 'Mass', 'Energy stored in a battery', 'A loop count'],
          correctIndex: 0,
          feedback: [
            'Correct. The slope of position over time is velocity.',
            'No. Mass is not read from graph slope here.',
            'No. Battery energy is a different quantity.',
            'No. Loop count is a programming idea.',
          ],
        },
      },
      {
        id: 'physics-forces-newtons-laws',
        title: "Forces and Newton's Laws",
        level: 'Core',
        bigIdea: 'Forces are pushes or pulls. Newtons laws explain how forces change motion and why objects resist changes to their motion.',
        whyItMatters: 'Forces shape bridges, vehicles, sports, machines, and robots. AI-controlled robots still have to obey physical laws when they move.',
        mentalModel: 'An object keeps doing what it is doing unless a net force changes its motion. More mass means more resistance to change.',
        guidedExample: 'If a 2 kg object accelerates at 3 meters per second squared, net force is F = ma = 6 newtons.',
        bridge: 'Algebra rearranges F = ma, and CS simulations use the law to update virtual objects realistically.',
        prediction: {
          question: 'If net force is zero, what do you predict happens to an objects velocity?',
          answer: 'Its velocity stays constant. It may be still, or it may keep moving at the same speed and direction.',
        },
        quiz: {
          question: 'What does F = ma connect?',
          options: ['Force, mass, and acceleration', 'Voltage, current, and resistance', 'Probability and expected value', 'Arrays and objects'],
          correctIndex: 0,
          feedback: [
            'Correct. Net force equals mass times acceleration.',
            'No. Voltage, current, and resistance are linked by Ohms law.',
            'No. That is a probability idea.',
            'No. Those are computer science structures.',
          ],
        },
      },
      {
        id: 'physics-friction-constraints',
        title: 'Friction and Constraints',
        level: 'Core',
        bigIdea: 'Friction resists sliding motion, and constraints limit how objects are allowed to move.',
        whyItMatters: 'Friction makes walking, braking, gripping, and machines possible, but it also wastes energy as heat. Robots need friction and constraints to interact with the world.',
        mentalModel: 'Friction is the surface saying "not so fast." A constraint is a rule like "stay on this track" or "move only along this rope."',
        guidedExample: 'A box on a rough floor needs a push large enough to overcome static friction before it starts sliding.',
        bridge: 'Inequalities in math can describe limits, and game engines use constraints to keep simulated objects believable.',
        prediction: {
          question: 'If a floor becomes smoother, what do you predict happens to the friction force?',
          answer: 'The friction force usually decreases, so objects slide more easily.',
        },
        quiz: {
          question: 'What does friction usually do?',
          options: ['Opposes relative sliding motion', 'Creates energy from nothing', 'Removes the need for mass', 'Sorts data faster'],
          correctIndex: 0,
          feedback: [
            'Correct. Friction acts against sliding or attempted sliding.',
            'No. Friction transforms mechanical energy into heat; it does not create energy.',
            'No. Mass still matters.',
            'No. Sorting is an algorithms topic.',
          ],
        },
      },
      {
        id: 'physics-work-energy',
        title: 'Work and Energy',
        level: 'Core',
        bigIdea: 'Work transfers energy when a force moves something over a distance. Energy is the capacity to cause change.',
        whyItMatters: 'Work and energy explain engines, batteries, muscles, roller coasters, and power use. AI can optimize energy systems, but conservation rules still apply.',
        mentalModel: 'Energy is a budget for change. Work is one way to move that budget from one place or form to another.',
        guidedExample: 'If you push with 10 newtons over 3 meters in the direction of motion, you do 30 joules of work.',
        bridge: 'Algebra calculates work, physics explains energy transfer, and CS models energy in simulations and optimization tools.',
        prediction: {
          question: 'If you push hard on a wall but it does not move, how much mechanical work do you predict you do on the wall?',
          answer: 'Zero mechanical work, because work needs displacement in the direction of force.',
        },
        quiz: {
          question: 'What must happen for a force to do mechanical work?',
          options: ['The object must move through a distance', 'The object must be blue', 'The force must be random', 'The code must use a loop'],
          correctIndex: 0,
          feedback: [
            'Correct. Work involves force through displacement.',
            'No. Color is irrelevant.',
            'No. The force does not need to be random.',
            'No. Loops are not required for physical work.',
          ],
        },
      },
      {
        id: 'physics-momentum',
        title: 'Momentum',
        level: 'Core',
        bigIdea: 'Momentum measures motion using mass and velocity. It is conserved in many collision situations.',
        whyItMatters: 'Momentum explains crashes, sports impacts, rockets, and recoil. Robots and simulations need momentum to predict collisions realistically.',
        mentalModel: 'Momentum is how hard it is to stop something that is moving. Heavy and fast objects have more momentum.',
        guidedExample: 'A 4 kg cart moving at 3 meters per second has momentum p = mv = 12 kg meters per second.',
        bridge: 'Vectors from math describe momentum direction, and CS collision engines use conservation rules to update motion.',
        prediction: {
          question: 'Which has more momentum: a slow bicycle or a fast truck?',
          answer: 'The fast truck usually has much more momentum because both mass and velocity are large.',
        },
        quiz: {
          question: 'What is the formula for momentum?',
          options: ['p = mv', 'F = qE', 'V = IR', 'n squared'],
          correctIndex: 0,
          feedback: [
            'Correct. Momentum equals mass times velocity.',
            'No. That formula belongs to electric force.',
            'No. V = IR is Ohms law.',
            'No. n squared describes algorithm growth.',
          ],
        },
      },
      {
        id: 'physics-waves-frequency',
        title: 'Waves and Frequency',
        level: 'Core',
        bigIdea: 'A wave carries energy through a pattern that repeats. Frequency tells how many cycles happen each second.',
        whyItMatters: 'Sound, light, radio, earthquakes, and medical imaging all involve waves. AI systems process wave-like signals in audio, speech, and sensors.',
        mentalModel: 'A wave is a repeated wiggle moving through space or a medium. Frequency is how quickly the wiggle repeats.',
        guidedExample: 'A sound wave at 440 hertz vibrates 440 times per second. That frequency is heard as the musical note A above middle C.',
        bridge: 'Trigonometry describes waves with sine and cosine, and CS stores sound waves as sampled data.',
        prediction: {
          question: 'If frequency increases, what do you predict happens to the pitch of a sound?',
          answer: 'The pitch gets higher.',
        },
        quiz: {
          question: 'What does frequency measure?',
          options: ['Cycles per second', 'Mass per meter', 'The slope of a line only', 'The number of objects in an array'],
          correctIndex: 0,
          feedback: [
            'Correct. Frequency is measured in hertz, or cycles per second.',
            'No. That would be a kind of density.',
            'No. Slope is a math rate, not frequency by itself.',
            'No. Array length is a CS idea.',
          ],
        },
      },
      {
        id: 'physics-electricity-vir',
        title: 'Electricity: Voltage, Current, Resistance',
        level: 'Core',
        bigIdea: 'Voltage pushes electric charge, current is the flow of charge, and resistance opposes that flow.',
        whyItMatters: 'Electricity powers computers, homes, sensors, and robots. AI hardware depends on carefully controlled electrical circuits.',
        mentalModel: 'Think of a circuit like water pipes: voltage is pressure, current is flow, and resistance is a narrow section that limits flow.',
        guidedExample: 'Ohms law says V = IR. If current is 2 amps through 5 ohms, voltage is 10 volts.',
        bridge: 'Algebra solves circuit relationships, and computer hardware uses electrical states to represent information.',
        prediction: {
          question: 'If voltage stays the same and resistance increases, what happens to current?',
          answer: 'Current decreases because I = V / R.',
        },
        quiz: {
          question: 'What does resistance do in a circuit?',
          options: ['Opposes current', 'Stores source code', 'Measures uncertainty', 'Makes gravity stronger'],
          correctIndex: 0,
          feedback: [
            'Correct. Resistance limits current flow.',
            'No. Source code is stored in digital memory.',
            'No. Probability measures uncertainty.',
            'No. Gravity is separate from electrical resistance.',
          ],
        },
      },
      {
        id: 'physics-circuits-computation',
        title: 'Circuits and Computation',
        level: 'Advanced',
        bigIdea: 'Circuits can control electrical signals, and carefully arranged signals can represent logic and computation.',
        whyItMatters: 'Every computer, phone, and AI accelerator is built from circuits that manipulate bits. Computation is physical, not just abstract.',
        mentalModel: 'A circuit is a decision path for electricity. Logic gates are tiny decision makers that turn input signals into output signals.',
        guidedExample: 'An AND gate outputs 1 only when both inputs are 1. If either input is 0, the output is 0.',
        bridge: 'Boolean algebra from math describes logic gates, and CS builds programs on top of layers of circuit behavior.',
        prediction: {
          question: 'What do you predict an AND gate outputs when inputs are 1 and 0?',
          answer: 'It outputs 0 because both inputs are not 1.',
        },
        quiz: {
          question: 'Why do circuits matter for computer science?',
          options: ['They physically implement logic and memory', 'They remove the need for algorithms', 'They make all programs correct', 'They only measure projectile motion'],
          correctIndex: 0,
          feedback: [
            'Correct. Computation is built from physical circuits.',
            'No. Algorithms still define what computation should do.',
            'No. Circuits do not guarantee program correctness.',
            'No. Circuits can measure motion, but their role is much broader.',
          ],
        },
      },
    ],
  },
  cs: {
    title: 'Computer Science',
    icon: Code2,
    color: 'text-ember',
    lessons: [
      {
        id: 'cs-how-computers-think',
        title: 'How Computers Think',
        level: 'Foundation',
        bigIdea: 'Computers follow exact instructions using simple operations on stored information.',
        whyItMatters: 'Understanding this helps you write clearer programs and judge AI tools more realistically. Computers are fast and literal, not naturally wise.',
        mentalModel: 'A computer is an extremely fast rule follower. It does not guess your intent unless a program or model has been built to handle that uncertainty.',
        guidedExample: 'If you tell a computer to add 2 and 3, it follows the instruction exactly. If you give unclear instructions, it cannot automatically know what you meant.',
        bridge: 'Math gives exact rules, and physics provides the circuits that make those rules run on real hardware.',
        prediction: {
          question: 'If instructions are ambiguous, what do you predict a normal program does?',
          answer: 'It follows the written instructions, fails, or produces unintended behavior. It does not magically infer the right goal.',
        },
        quiz: {
          question: 'What is a computer especially good at?',
          options: ['Following precise instructions quickly', 'Understanding vague intent perfectly', 'Ignoring data', 'Breaking physics laws'],
          correctIndex: 0,
          feedback: [
            'Correct. Speed and precision are core strengths.',
            'No. Vague intent requires careful design or AI support.',
            'No. Computers process data.',
            'No. Computers are physical systems.',
          ],
        },
      },
      {
        id: 'cs-variables-data-types',
        title: 'Variables and Data Types',
        level: 'Foundation',
        bigIdea: 'Variables store values, and data types describe what kind of value is stored.',
        whyItMatters: 'Correct data types prevent bugs and make programs easier to reason about. AI pipelines also need well-structured data to learn from examples.',
        mentalModel: 'A variable is a labeled container. The data type tells whether the container holds a number, text, true/false value, list, or object.',
        guidedExample: 'age = 16 stores a number, while name = "Maya" stores text. You can do arithmetic with age but not with name in the same way.',
        bridge: 'Math variables represent quantities, while CS variables store values in memory while a program runs.',
        prediction: {
          question: 'What problem might happen if a program treats the text "5" like the number 5?',
          answer: 'It may concatenate text instead of doing arithmetic, or it may throw a type error.',
        },
        quiz: {
          question: 'What does a data type describe?',
          options: ['The kind of value stored', 'The color of the screen', 'The force on an object', 'The height of a graph'],
          correctIndex: 0,
          feedback: [
            'Correct. Types describe categories like number, string, boolean, and object.',
            'No. Screen color is a display property.',
            'No. Force is physics.',
            'No. Graph height is visual, not a data type.',
          ],
        },
      },
      {
        id: 'cs-conditionals',
        title: 'Conditionals',
        level: 'Foundation',
        bigIdea: 'Conditionals let programs choose different actions based on whether a statement is true or false.',
        whyItMatters: 'Conditionals power logins, games, recommendations, safety checks, and interactive apps. AI systems often sit inside larger programs that still use clear rules.',
        mentalModel: 'A conditional is a fork in the road: if this is true, go one way; otherwise, go another way.',
        guidedExample: 'If temperature < 32, show "freezing warning." Otherwise, show "above freezing." The program responds to the value.',
        bridge: 'Inequalities from math become decisions in code, and physics simulations use conditionals for collisions and limits.',
        prediction: {
          question: 'If score is 85 and the rule is score >= 90, does the condition pass?',
          answer: 'No. 85 is less than 90, so the condition is false.',
        },
        quiz: {
          question: 'What does an if statement do?',
          options: ['Runs code based on a condition', 'Repeats forever by itself', 'Stores every file on a computer', 'Measures voltage'],
          correctIndex: 0,
          feedback: [
            'Correct. If statements control which branch runs.',
            'No. Repetition is handled by loops.',
            'No. File storage is separate.',
            'No. Voltage is a physics/electronics quantity.',
          ],
        },
      },
      {
        id: 'cs-loops',
        title: 'Loops',
        level: 'Foundation',
        bigIdea: 'Loops repeat instructions while a condition is true or for a set number of steps.',
        whyItMatters: 'Loops process lists, animate motion, run simulations, and train AI over many examples. Without loops, programs would be painfully repetitive.',
        mentalModel: 'A loop is a controlled repeat button. The key word is controlled: it needs a stopping rule.',
        guidedExample: 'A loop can print numbers 1 through 5 by increasing a counter each time and stopping after 5.',
        bridge: 'Physics simulations loop through time steps, and math sequences use repeated patterns.',
        prediction: {
          question: 'If a loop condition never becomes false, what happens?',
          answer: 'The loop keeps running, causing an infinite loop unless something stops the program.',
        },
        quiz: {
          question: 'Why are loops useful?',
          options: ['They repeat work without rewriting the same code', 'They make all code run instantly', 'They replace variables', 'They remove uncertainty from probability'],
          correctIndex: 0,
          feedback: [
            'Correct. Loops make repeated work concise and consistent.',
            'No. Loops still take time to run.',
            'No. Loops often depend on variables.',
            'No. Probability still handles uncertainty.',
          ],
        },
      },
      {
        id: 'cs-functions',
        title: 'Functions',
        level: 'Foundation',
        bigIdea: 'A function is a reusable block of code that can take inputs, perform work, and return an output.',
        whyItMatters: 'Functions make programs organized, testable, and easier to change. AI models can also be viewed as functions from input data to predictions.',
        mentalModel: 'A function is a named mini-machine. You feed it inputs, it follows its instructions, and it gives back a result.',
        guidedExample: 'double(x) returns x * 2. double(7) returns 14.',
        bridge: 'Math functions and code functions share the input-output idea, and physics formulas can be packaged as functions in simulations.',
        prediction: {
          question: 'If square(x) returns x * x, what does square(6) return?',
          answer: 'It returns 36.',
        },
        quiz: {
          question: 'What is a major benefit of functions?',
          options: ['Reusing logic without rewriting it', 'Making variables impossible', 'Preventing all bugs automatically', 'Changing gravity'],
          correctIndex: 0,
          feedback: [
            'Correct. Functions package reusable logic.',
            'No. Functions often use variables.',
            'No. Functions help testing, but bugs can still happen.',
            'No. Gravity is not changed by code functions.',
          ],
        },
      },
      {
        id: 'cs-arrays-objects',
        title: 'Arrays and Objects',
        level: 'Core',
        bigIdea: 'Arrays store ordered collections, while objects store named pieces of information.',
        whyItMatters: 'Most real programs handle groups of data, not single values. AI datasets, game entities, users, and lab measurements all need structure.',
        mentalModel: 'An array is like a numbered shelf. An object is like an index card with labeled fields.',
        guidedExample: 'scores = [80, 92, 75] is an array. student = { name: "Ari", score: 92 } is an object.',
        bridge: 'Vectors in math resemble arrays of numbers, and physics objects can store mass, position, and velocity as fields.',
        prediction: {
          question: 'If you need to store a students name and grade together, would an object or a single number fit better?',
          answer: 'An object fits better because it can label multiple related values.',
        },
        quiz: {
          question: 'What is an array best for?',
          options: ['An ordered collection of values', 'Only one true/false value', 'A force diagram', 'A logarithm rule'],
          correctIndex: 0,
          feedback: [
            'Correct. Arrays store multiple values in order.',
            'No. A boolean stores true or false.',
            'No. Force diagrams are physics representations.',
            'No. Logarithms are math functions.',
          ],
        },
      },
      {
        id: 'cs-data-structures',
        title: 'Data Structures',
        level: 'Core',
        bigIdea: 'A data structure organizes information so a program can use it efficiently.',
        whyItMatters: 'Search engines, maps, databases, games, and AI systems rely on the right structures. Good organization can change a slow idea into a practical tool.',
        mentalModel: 'Choosing a data structure is choosing a container: a stack is a pile, a queue is a line, a tree branches, and a graph connects nodes.',
        guidedExample: 'A browser back button behaves like a stack: the last page you visited is the first one you return to.',
        bridge: 'Graphs connect to math networks and physics systems, while AI uses tensors, trees, and graphs to represent data.',
        prediction: {
          question: 'Which structure fits a waiting line: stack or queue?',
          answer: 'A queue fits because the first person in line is served first.',
        },
        quiz: {
          question: 'Which structure is best for representing connected cities and roads?',
          options: ['Graph', 'Single boolean', 'Plain number', 'One character'],
          correctIndex: 0,
          feedback: [
            'Correct. Graphs represent nodes and connections.',
            'No. A boolean is too small for a network.',
            'No. One number cannot represent all relationships.',
            'No. One character cannot hold a road network.',
          ],
        },
      },
      {
        id: 'cs-algorithms-big-o',
        title: 'Algorithms and Big-O',
        level: 'Core',
        bigIdea: 'An algorithm is a step-by-step method. Big-O describes how its work grows as input size increases.',
        whyItMatters: 'Scaling determines whether software stays fast with real data. AI, search, maps, and apps all depend on algorithms that grow reasonably.',
        mentalModel: 'Big-O is a growth warning label. It tells you whether extra input causes a small, medium, or explosive increase in work.',
        guidedExample: 'Checking every pair in a list of n items is often O(n squared). If n doubles, the work can become about four times larger.',
        bridge: 'Math describes growth rates, and the complexity lab lets you see how O(log n), O(n), and O(n squared) separate as n increases.',
        prediction: {
          question: 'As n gets very large, which grows faster: n or n squared?',
          answer: 'n squared grows much faster.',
        },
        quiz: {
          question: 'What does Big-O describe?',
          options: ['How work grows with input size', 'The exact brand of computer', 'The voltage in a wire', 'The answer to every bug'],
          correctIndex: 0,
          feedback: [
            'Correct. Big-O focuses on growth as inputs scale.',
            'No. Hardware affects speed but not the algorithmic growth label.',
            'No. Voltage is an electrical quantity.',
            'No. Debugging still requires investigation.',
          ],
        },
      },
      {
        id: 'cs-debugging-testing',
        title: 'Debugging and Testing',
        level: 'Core',
        bigIdea: 'Debugging finds why code behaves incorrectly. Testing checks whether code behaves as expected.',
        whyItMatters: 'Reliable software needs evidence, not hope. Tests protect apps, robots, financial systems, and AI pipelines from silent mistakes.',
        mentalModel: 'Debugging is detective work. Testing is building checkpoints so the same mistake is easier to catch next time.',
        guidedExample: 'If a function should return 10 but returns 9, a test can expose the mismatch. Debugging then traces the inputs and steps to find the cause.',
        bridge: 'Science experiments compare predictions to observations; software tests compare expected output to actual output.',
        prediction: {
          question: 'If a bug appears only for negative numbers, what kind of test should you add?',
          answer: 'Add a test with negative inputs so the case is checked automatically in the future.',
        },
        quiz: {
          question: 'What is the main purpose of a test?',
          options: ['Check whether code meets an expected behavior', 'Make code visually colorful', 'Replace all human thinking', 'Measure projectile height'],
          correctIndex: 0,
          feedback: [
            'Correct. Tests compare actual behavior with expected behavior.',
            'No. Visual style is separate.',
            'No. Tests support thinking; they do not replace it.',
            'No. Projectile height belongs to a physics simulation.',
          ],
        },
      },
      {
        id: 'cs-ai-basics-models-loss-training',
        title: 'AI Basics: Models, Loss, Training',
        level: 'Advanced',
        bigIdea: 'An AI model learns a function from examples. Loss measures error, and training adjusts the model to reduce that error.',
        whyItMatters: 'AI supports search, translation, tutoring, medical imaging, robotics, and science. Understanding training helps you use AI critically instead of treating it as magic.',
        mentalModel: 'A model is a prediction machine with adjustable knobs. Loss tells how wrong it was. Training turns the knobs to make future predictions less wrong.',
        guidedExample: 'If a model predicts 290,000 dollars for a house worth 300,000 dollars, the error contributes to loss. Training changes weights so similar predictions move closer to reality.',
        bridge: 'AI combines functions, probability, derivatives, data structures, algorithms, and physical hardware that performs the computation.',
        prediction: {
          question: 'If training lowers loss on useful examples, what do you predict happens to model predictions?',
          answer: 'They usually improve, because the model has adjusted toward smaller errors.',
        },
        quiz: {
          question: 'What is loss in machine learning?',
          options: ['A measure of prediction error', 'A guarantee that the answer is true', 'The voltage in a circuit', 'A type of loop'],
          correctIndex: 0,
          feedback: [
            'Correct. Loss measures how wrong predictions are.',
            'No. AI predictions are not guaranteed true.',
            'No. Voltage is an electrical quantity.',
            'No. Loops can be used in training, but loss is not a loop.',
          ],
        },
      },
    ],
  },
};

const curriculum = withSubjectShell(deepLessons);

function withSubjectShell(source) {
  const shell = {
    math: { icon: Calculator, color: 'text-cobalt' },
    physics: { icon: Atom, color: 'text-fern' },
    cs: { icon: Code2, color: 'text-ember' },
    language: { icon: PenLine, color: 'text-fuchsia-700' },
  };

  return Object.fromEntries(
    Object.entries(source).map(([key, subject]) => [
      key,
      {
        ...subject,
        icon: shell[key].icon,
        color: shell[key].color,
      },
    ]),
  );
}

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveProgress(progress) {
  try {
    if (Object.keys(progress).length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Browsers can block storage in private or restricted modes.
  }
}

function useLessonProgress() {
  const [progress, setProgress] = useState(loadProgress);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  function updateLesson(id, values) {
    setProgress((current) => ({
      ...current,
      [id]: {
        ...(current[id] || {}),
        ...values,
      },
    }));
  }

  function resetProgress() {
    setProgress({});
  }

  return [progress, updateLesson, resetProgress];
}

function todayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function loadSessions() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY)) || { activeDate: null, history: [] };
  } catch {
    return { activeDate: null, history: [] };
  }
}

function saveSessions(sessions) {
  try {
    if (sessions.activeDate || sessions.activePlan || sessions.history?.length) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessions));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  } catch {
    // Browsers can block storage in private or restricted modes.
  }
}

function useDailySessions() {
  const [sessions, setSessions] = useState(loadSessions);

  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  function startSession(plan) {
    setSessions((current) => ({
      ...current,
      activeDate: todayKey(),
      activePlan: {
        date: todayKey(),
        lessonId: plan.lesson.id,
        lessonTitle: plan.lesson.title,
        subject: plan.lesson.subjectTitle,
      },
    }));
  }

  function completeSession(plan) {
    setSessions((current) => {
      const date = todayKey();
      const history = current.history || [];
      const withoutToday = history.filter((entry) => entry.date !== date);

      return {
        ...current,
        activeDate: date,
        activePlan: {
          date,
          lessonId: plan.lesson.id,
          lessonTitle: plan.lesson.title,
          subject: plan.lesson.subjectTitle,
        },
        history: [
          ...withoutToday,
          {
            date,
            completedAt: new Date().toISOString(),
            lessonId: plan.lesson.id,
            lessonTitle: plan.lesson.title,
            subject: plan.lesson.subjectTitle,
            lab: plan.lab.name,
          },
        ],
      };
    });
  }

  function resetSessions() {
    setSessions({ activeDate: null, history: [] });
  }

  return [sessions, startSession, completeSession, resetSessions];
}

function loadPredictionState() {
  try {
    return JSON.parse(localStorage.getItem(PREDICTION_KEY)) || {};
  } catch {
    return {};
  }
}

function savePredictionState(predictions) {
  try {
    if (Object.keys(predictions).length) {
      localStorage.setItem(PREDICTION_KEY, JSON.stringify(predictions));
    } else {
      localStorage.removeItem(PREDICTION_KEY);
    }
  } catch {
    // Browsers can block storage in private or restricted modes.
  }
}

function usePredictions() {
  const [predictions, setPredictions] = useState(loadPredictionState);

  useEffect(() => {
    savePredictionState(predictions);
  }, [predictions]);

  function updatePrediction(itemId, values) {
    setPredictions((current) => ({
      ...current,
      [itemId]: {
        prediction: '',
        locked: false,
        reflection: '',
        result: '',
        ...(current[itemId] || {}),
        ...values,
      },
    }));
  }

  function resetPredictions() {
    setPredictions({});
  }

  return [predictions, updatePrediction, resetPredictions];
}

function loadBuildState() {
  try {
    return JSON.parse(localStorage.getItem(BUILD_KEY)) || {};
  } catch {
    return {};
  }
}

function saveBuildState(buildState) {
  try {
    if (Object.keys(buildState).length) {
      localStorage.setItem(BUILD_KEY, JSON.stringify(buildState));
    } else {
      localStorage.removeItem(BUILD_KEY);
    }
  } catch {
    // Browsers can block storage in private or restricted modes.
  }
}

function useBuildModeState() {
  const [buildState, setBuildState] = useState(loadBuildState);

  useEffect(() => {
    saveBuildState(buildState);
  }, [buildState]);

  function updateChallenge(challengeId, values) {
    setBuildState((current) => {
      const previous = current[challengeId] || {
        pseudocode: '',
        code: '',
        notes: '',
        ownershipReflection: {},
        status: 'not-started',
        hintViewed: false,
        grade: '',
        modelAnswerViewed: false,
        detectedKeyConcepts: [],
      };
      const next = { ...previous, ...values };

      if (
        next.status === 'not-started' &&
        ((values.pseudocode !== undefined && values.pseudocode.trim()) ||
          (values.code !== undefined && values.code.trim()) ||
          (values.notes !== undefined && values.notes.trim()) ||
          (values.ownershipReflection !== undefined &&
            Object.values(values.ownershipReflection || {}).some((value) => String(value || '').trim())) ||
          (values.bridgeAnswer !== undefined && values.bridgeAnswer.trim()) ||
          (values.logicBlank !== undefined && values.logicBlank.trim()))
      ) {
        next.status = 'in-progress';
      }
      if (values.pseudocode !== undefined || values.notes !== undefined) {
        const challenge = buildChallenges.find((item) => item.id === challengeId);
        if (challenge) {
          next.detectedKeyConcepts = detectKeyConcepts(challenge, next);
        }
      }

      return {
        ...current,
        [challengeId]: next,
      };
    });
  }

  function resetBuildState() {
    setBuildState({});
  }

  return [buildState, updateChallenge, resetBuildState];
}

function loadDebugState() {
  try {
    return JSON.parse(localStorage.getItem(DEBUG_KEY)) || {};
  } catch {
    return {};
  }
}

function saveDebugState(debugState) {
  try {
    if (Object.keys(debugState).length) {
      localStorage.setItem(DEBUG_KEY, JSON.stringify(debugState));
    } else {
      localStorage.removeItem(DEBUG_KEY);
    }
  } catch {
    // Browsers can block storage in private or restricted modes.
  }
}

function useDebugModeState() {
  const [debugState, setDebugState] = useState(loadDebugState);

  useEffect(() => {
    saveDebugState(debugState);
  }, [debugState]);

  function updateDebugChallenge(challengeId, values) {
    setDebugState((current) => {
      const challenge = debugChallenges.find((item) => item.id === challengeId);
      const previous = current[challengeId] || {
        code: challenge?.brokenCode || '',
        explanation: '',
        hintLevel: 0,
        modelExplanationViewed: false,
        status: 'not-started',
        lastResult: null,
      };
      const next = { ...previous, ...values };

      if (
        next.status === 'not-started' &&
        ((values.code !== undefined && values.code !== challenge?.brokenCode) || (values.explanation !== undefined && values.explanation.trim()) || values.lastResult)
      ) {
        next.status = 'in-progress';
      }

      return {
        ...current,
        [challengeId]: next,
      };
    });
  }

  function resetDebugState() {
    setDebugState({});
  }

  return [debugState, updateDebugChallenge, resetDebugState];
}

function loadCodeReadingState() {
  try {
    return JSON.parse(localStorage.getItem(CODE_READING_KEY)) || {};
  } catch {
    return {};
  }
}

function saveCodeReadingState(codeReadingState) {
  try {
    if (Object.keys(codeReadingState).length) {
      localStorage.setItem(CODE_READING_KEY, JSON.stringify(codeReadingState));
    } else {
      localStorage.removeItem(CODE_READING_KEY);
    }
  } catch {
    // Browsers can block storage in private or restricted modes.
  }
}

function useCodeReadingState() {
  const [codeReadingState, setCodeReadingState] = useState(loadCodeReadingState);

  useEffect(() => {
    saveCodeReadingState(codeReadingState);
  }, [codeReadingState]);

  function updateCodeReadingChallenge(challengeId, values) {
    setCodeReadingState((current) => {
      const previous = current[challengeId] || {
        answer: '',
        explanation: '',
        outputRevealed: false,
        annotationsShown: false,
        predictionResult: '',
        status: 'not-started',
      };
      const next = { ...previous, ...values };

      if (
        next.status === 'not-started' &&
        ((values.answer !== undefined && values.answer.trim()) || values.outputRevealed || (values.explanation !== undefined && values.explanation.trim()))
      ) {
        next.status = 'in-progress';
      }

      return {
        ...current,
        [challengeId]: next,
      };
    });
  }

  function resetCodeReadingState() {
    setCodeReadingState({});
  }

  return [codeReadingState, updateCodeReadingChallenge, resetCodeReadingState];
}

function loadKarpathyProgress() {
  try {
    return JSON.parse(localStorage.getItem(KARPATHY_KEY)) || {};
  } catch {
    return {};
  }
}

function saveKarpathyProgress(progress) {
  try {
    if (Object.keys(progress).length) {
      localStorage.setItem(KARPATHY_KEY, JSON.stringify(progress));
    } else {
      localStorage.removeItem(KARPATHY_KEY);
    }
  } catch {
    // Browsers can block storage in private or restricted modes.
  }
}

function useKarpathyProgress() {
  const [karpathyProgress, setKarpathyProgress] = useState(loadKarpathyProgress);

  useEffect(() => {
    saveKarpathyProgress(karpathyProgress);
  }, [karpathyProgress]);

  function updateKarpathyMilestone(milestoneId, values) {
    setKarpathyProgress((current) => {
      const previous = current[milestoneId] || {
        status: 'not-started',
        reflection: '',
        notes: '',
        code: milestone?.starterCode || '',
        lastResult: null,
      };
      const next = { ...previous, ...values };

      if (
        next.status === 'not-started' &&
        ((values.reflection !== undefined && values.reflection.trim()) ||
          (values.notes !== undefined && values.notes.trim()) ||
          (values.code !== undefined && values.code !== milestone?.starterCode) ||
          values.lastResult)
      ) {
        next.status = 'in-progress';
      }

      return {
        ...current,
        [milestoneId]: next,
      };
    });
  }

  function resetKarpathyProgress() {
    setKarpathyProgress({});
  }

  return [karpathyProgress, updateKarpathyMilestone, resetKarpathyProgress];
}

function emptyPilotSession() {
  return {
    startedAt: '',
    completedAt: '',
    steps: {},
    currentStepId: '',
    lastCompletedStepId: '',
    blockedMessage: '',
    preAnswers: {},
    postAnswers: {},
    confidenceBefore: '',
    confidenceAfter: '',
    friction: '',
    feedback: '',
  };
}

function hasPilotData(pilotState = {}) {
  return Boolean(
    pilotState.startedAt ||
      pilotState.completedAt ||
      pilotState.currentStepId ||
      pilotState.lastCompletedStepId ||
      pilotState.blockedMessage ||
      Object.keys(pilotState.steps || {}).length ||
      Object.keys(pilotState.preAnswers || {}).length ||
      Object.keys(pilotState.postAnswers || {}).length ||
      pilotState.confidenceBefore ||
      pilotState.confidenceAfter ||
      pilotState.friction ||
      pilotState.feedback,
  );
}

function loadPilotTest() {
  try {
    return JSON.parse(localStorage.getItem(PILOT_TEST_KEY)) || emptyPilotSession();
  } catch {
    return emptyPilotSession();
  }
}

function savePilotTest(pilotState) {
  try {
    if (pilotState.startedAt || Object.keys(pilotState.steps || {}).length) {
      localStorage.setItem(PILOT_TEST_KEY, JSON.stringify(pilotState));
    } else {
      localStorage.removeItem(PILOT_TEST_KEY);
    }
  } catch {
    // Browsers can block storage in private or restricted modes.
  }
}

function usePilotTest() {
  const [pilotState, setPilotState] = useState(loadPilotTest);

  useEffect(() => {
    savePilotTest(pilotState);
  }, [pilotState]);

  function updatePilot(values) {
    setPilotState((current) => ({ ...current, ...values }));
  }

  function startPilot() {
    setPilotState((current) => ({
      ...emptyPilotSession(),
      ...current,
      startedAt: current.startedAt || new Date().toISOString(),
    }));
    window.location.hash = 'pilot-test';
  }

  function restartPilot() {
    try {
      localStorage.removeItem(PILOT_TEST_KEY);
    } catch {
      // Browsers can block storage in private or restricted modes.
    }
    setPilotState({
      ...emptyPilotSession(),
      startedAt: new Date().toISOString(),
      currentStepId: PILOT_STEPS[0]?.id || '',
    });
    window.location.hash = 'pilot-test';
  }

  function completePilot() {
    setPilotState((current) => ({
      ...current,
      completedAt: new Date().toISOString(),
      steps: PILOT_STEPS.reduce((steps, step) => ({ ...steps, [step.id]: true }), current.steps || {}),
    }));
  }

  function resetPilot() {
    try {
      localStorage.removeItem(PILOT_TEST_KEY);
    } catch {
      // Browsers can block storage in private or restricted modes.
    }
    setPilotState(emptyPilotSession());
    window.location.hash = 'pilot-test';
  }

  return [pilotState, updatePilot, startPilot, completePilot, resetPilot, restartPilot];
}

function loadFoundationState() {
  try {
    const saved = JSON.parse(localStorage.getItem(FOUNDATION_KEY)) || {};
    return { progress: {}, ...saved, mode: 'standard' };
  } catch {
    return { mode: 'standard', progress: {} };
  }
}

function saveFoundationState(foundationState) {
  try {
    localStorage.setItem(FOUNDATION_KEY, JSON.stringify(foundationState));
  } catch {
    // Browsers can block storage in private or restricted modes.
  }
}

function useFoundationState() {
  const [foundationState, setFoundationState] = useState(loadFoundationState);

  useEffect(() => {
    saveFoundationState(foundationState);
  }, [foundationState]);

  function setFoundationMode(mode) {
    setFoundationState((current) => ({ ...current, mode }));
  }

  function updateFoundationItem(itemId, values) {
    setFoundationState((current) => ({
      ...current,
      progress: {
        ...(current.progress || {}),
        [itemId]: {
          answers: {},
          correct: {},
          variation: 0,
          complete: false,
          ...(current.progress?.[itemId] || {}),
          ...values,
        },
      },
    }));
  }

  function resetFoundationState() {
    setFoundationState({ mode: 'standard', progress: {} });
  }

  return [foundationState, setFoundationMode, updateFoundationItem, resetFoundationState];
}

function loadSolveState() {
  try {
    return JSON.parse(localStorage.getItem(SOLVE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveSolveState(solveState) {
  try {
    if (Object.keys(solveState).length) {
      localStorage.setItem(SOLVE_KEY, JSON.stringify(solveState));
    } else {
      localStorage.removeItem(SOLVE_KEY);
    }
  } catch {
    // Browsers can block storage in private or restricted modes.
  }
}

function useSolveState() {
  const [solveState, setSolveState] = useState(loadSolveState);

  useEffect(() => {
    saveSolveState(solveState);
  }, [solveState]);

  function updateSolve(itemId, values) {
    setSolveState((current) => ({
      ...current,
      [itemId]: {
        attempt: '',
        revealed: false,
        reflection: '',
        ...(current[itemId] || {}),
        ...values,
      },
    }));
  }

  function resetSolveState() {
    setSolveState({});
  }

  return [solveState, updateSolve, resetSolveState];
}

function loadReviewHistory() {
  try {
    return JSON.parse(localStorage.getItem(REVIEW_KEY)) || [];
  } catch {
    return [];
  }
}

function saveReviewHistory(history) {
  try {
    if (history.length) {
      localStorage.setItem(REVIEW_KEY, JSON.stringify(history));
    } else {
      localStorage.removeItem(REVIEW_KEY);
    }
  } catch {
    // Browsers can block storage in private or restricted modes.
  }
}

function useReviewHistory() {
  const [history, setHistory] = useState(loadReviewHistory);

  useEffect(() => {
    saveReviewHistory(history);
  }, [history]);

  function markReviewed(item) {
    setHistory((current) => [
      ...current.filter((entry) => entry.itemId !== item.id || entry.date !== todayKey()),
      {
        itemId: item.id,
        type: item.type,
        title: item.title,
        reason: item.reason,
        href: item.href,
        date: todayKey(),
        reviewedAt: new Date().toISOString(),
      },
    ]);
  }

  function resetReviewHistory() {
    setHistory([]);
  }

  return [history, markReviewed, resetReviewHistory];
}

function loadThinkingState() {
  try {
    return JSON.parse(localStorage.getItem(THINKING_KEY)) || {};
  } catch {
    return {};
  }
}

function saveThinkingState(thinkingState) {
  try {
    if (Object.keys(thinkingState).length) {
      localStorage.setItem(THINKING_KEY, JSON.stringify(thinkingState));
    } else {
      localStorage.removeItem(THINKING_KEY);
    }
  } catch {
    // Browsers can block storage in private or restricted modes.
  }
}

function useThinkingState() {
  const [thinkingState, setThinkingState] = useState(loadThinkingState);

  useEffect(() => {
    saveThinkingState(thinkingState);
  }, [thinkingState]);

  function updateThinking(challengeId, values) {
    setThinkingState((current) => ({
      ...current,
      [challengeId]: {
        attempt: '',
        revealed: false,
        reflection: '',
        complete: false,
        ...(current[challengeId] || {}),
        ...values,
      },
    }));
  }

  function resetThinkingState() {
    setThinkingState({});
  }

  return [thinkingState, updateThinking, resetThinkingState];
}

function loadArchitectureProgress() {
  try {
    return JSON.parse(localStorage.getItem(ARCHITECTURE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveArchitectureProgress(progress) {
  try {
    if (Object.keys(progress).length) {
      localStorage.setItem(ARCHITECTURE_KEY, JSON.stringify(progress));
    } else {
      localStorage.removeItem(ARCHITECTURE_KEY);
    }
  } catch {
    // Browsers can block storage in private or restricted modes.
  }
}

function useArchitectureProgress() {
  const [architectureProgress, setArchitectureProgress] = useState(loadArchitectureProgress);

  useEffect(() => {
    saveArchitectureProgress(architectureProgress);
  }, [architectureProgress]);

  function toggleArchitectureLesson(lessonId) {
    setArchitectureProgress((current) => {
      if (current[lessonId]) {
        const next = { ...current };
        delete next[lessonId];
        return next;
      }

      return {
        ...current,
        [lessonId]: { complete: true, completedAt: new Date().toISOString() },
      };
    });
  }

  function resetArchitectureProgress() {
    setArchitectureProgress({});
  }

  const completed = Object.fromEntries(Object.entries(architectureProgress).filter(([, value]) => value?.complete));

  return [completed, toggleArchitectureLesson, resetArchitectureProgress];
}

function loadProjectProgress() {
  try {
    return JSON.parse(localStorage.getItem(PROJECTS_KEY)) || {};
  } catch {
    return {};
  }
}

function saveProjectProgress(progress) {
  try {
    if (Object.keys(progress).length) {
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(progress));
    } else {
      localStorage.removeItem(PROJECTS_KEY);
    }
  } catch {
    // Browsers can block storage in private or restricted modes.
  }
}

function useProjectProgress() {
  const [projectProgress, setProjectProgress] = useState(loadProjectProgress);

  useEffect(() => {
    saveProjectProgress(projectProgress);
  }, [projectProgress]);

  function toggleProjectStep(projectId, stepId) {
    setProjectProgress((current) => {
      const project = current[projectId] || { steps: {}, finalComplete: false };
      return {
        ...current,
        [projectId]: {
          ...project,
          steps: {
            ...project.steps,
            [stepId]: !project.steps?.[stepId],
          },
        },
      };
    });
  }

  function toggleProjectFinal(projectId) {
    setProjectProgress((current) => {
      const project = current[projectId] || { steps: {}, finalComplete: false };
      return {
        ...current,
        [projectId]: {
          ...project,
          finalComplete: !project.finalComplete,
        },
      };
    });
  }

  function resetProjectProgress() {
    setProjectProgress({});
  }

  return [projectProgress, toggleProjectStep, toggleProjectFinal, resetProjectProgress];
}

function loadAiTutorChats() {
  try {
    return JSON.parse(localStorage.getItem(AI_TUTOR_CHAT_KEY)) || {};
  } catch {
    return {};
  }
}

function saveAiTutorChats(chats) {
  try {
    if (Object.keys(chats).length) {
      localStorage.setItem(AI_TUTOR_CHAT_KEY, JSON.stringify(chats));
    } else {
      localStorage.removeItem(AI_TUTOR_CHAT_KEY);
    }
  } catch {
    // Browsers can block storage in private or restricted modes.
  }
}

function useAiTutorChats() {
  const [chats, setChats] = useState(loadAiTutorChats);

  useEffect(() => {
    saveAiTutorChats(chats);
  }, [chats]);

  function updateChat(chatId, messages) {
    setChats((current) => ({
      ...current,
      [chatId]: messages,
    }));
  }

  function resetChat(chatId) {
    setChats((current) => {
      const next = { ...current };
      delete next[chatId];
      return next;
    });
  }

  function resetAiTutorChats() {
    setChats({});
  }

  return [chats, updateChat, resetChat, resetAiTutorChats];
}

function streakFromHistory(history = []) {
  const completedDates = new Set(history.map((entry) => entry.date));
  const [year, month, day] = todayKey().split('-').map(Number);
  const cursor = new Date(year, month - 1, day);
  let streak = 0;

  const keyFor = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  while (completedDates.has(keyFor(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function slug(value) {
  return value.toLowerCase().replaceAll(' ', '-');
}

function icon(iconType, props = {}) {
  return h(iconType, { size: 18, 'aria-hidden': true, ...props });
}

function Pill({ children, tone = 'slate' }) {
  const tones = {
    slate: 'bg-slate-100 text-slate-700',
    green: 'bg-emerald-50 text-emerald-700',
    blue: 'bg-blue-50 text-blue-700',
    amber: 'bg-amber-50 text-amber-700',
  };

  return h('span', { className: `rounded-md px-2.5 py-1 text-xs font-bold ${tones[tone]}` }, children);
}

function SelfGradeButtons({ value, onChange }) {
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

function normalizedWords(value) {
  return (value || '')
    .toLowerCase()
    .replace(/[^a-z0-9+\-*/=\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function coreIdeaCatalog() {
  return [
    { label: 'inputs', terms: ['input', 'inputs', 'x', 'argument', 'value put in'] },
    { label: 'outputs', terms: ['output', 'outputs', 'return', 'returns', 'result', 'y', 'comes out'] },
    { label: 'rule or function', terms: ['rule', 'function', 'maps', 'turns', 'takes', 'gives'] },
    { label: 'multiply', terms: ['multiply', 'times', '*', 'product'] },
    { label: 'add', terms: ['add', 'plus', '+', 'sum'] },
    { label: 'slope', terms: ['slope', 'steeper', 'rise', 'tilt'] },
    { label: 'intercept', terms: ['intercept', 'shift', 'up', 'down'] },
    { label: 'change', terms: ['change', 'rate', 'derivative', 'increase', 'decrease'] },
    { label: 'probability', terms: ['probability', 'chance', 'uncertain', 'uncertainty', 'likely'] },
    { label: 'force', terms: ['force', 'mass', 'acceleration', 'f=ma', 'f = ma'] },
    { label: 'energy', terms: ['energy', 'conservation', 'kinetic', 'potential'] },
    { label: 'loop', terms: ['loop', 'repeat', 'each', 'iterate', 'for'] },
    { label: 'condition', terms: ['if', 'condition', 'branch', 'otherwise'] },
    { label: 'data structure', terms: ['array', 'object', 'list', 'store', 'state'] },
    { label: 'model training', terms: ['model', 'prediction', 'loss', 'error', 'train', 'update', 'weight'] },
  ];
}

function termAppears(text, words, term) {
  const lower = text.toLowerCase();
  if (term.length <= 2 || /[+\-*/=]/.test(term) || term.includes(' ')) return lower.includes(term);
  return words.includes(term);
}

function analyzeFallbackAnswer(userInput, expectedConcept) {
  const answer = (userInput || '').trim();
  const expected = (expectedConcept || '').trim();
  const answerWords = normalizedWords(answer);
  const expectedWords = normalizedWords(expected);
  const stopWords = new Set(['about', 'after', 'again', 'because', 'before', 'being', 'between', 'could', 'every', 'first', 'should', 'their', 'there', 'these', 'thing', 'this', 'those', 'through', 'using', 'where', 'which', 'while', 'would']);
  const expectedKeywords = [...new Set(expectedWords.filter((word) => word.length > 4 && !stopWords.has(word)))].slice(0, 18);
  const presentKeywords = expectedKeywords.filter((word) => termAppears(answer, answerWords, word));
  const keywordRatio = expectedKeywords.length ? presentKeywords.length / expectedKeywords.length : 0;
  const catalog = coreIdeaCatalog();
  const expectedIdeas = catalog.filter((idea) => idea.terms.some((term) => termAppears(expected, expectedWords, term)));
  const matchedIdeas = expectedIdeas.filter((idea) => idea.terms.some((term) => termAppears(answer, answerWords, term)));
  const missingIdeas = expectedIdeas.filter((idea) => !matchedIdeas.includes(idea));
  const ideaRatio = expectedIdeas.length ? matchedIdeas.length / expectedIdeas.length : 0;
  const hasFormulaShape = /[+\-*/=]/.test(answer) && /[+\-*/=]/.test(expected);
  const hasConcreteExample = /\d/.test(answer) || answerWords.some((word) => ['example', 'case', 'input', 'output'].includes(word));
  const answerTooShort = answerWords.length < 4;

  let correctnessScore = 35;
  if (!answer) {
    correctnessScore = 0;
  } else if (matchedIdeas.length) {
    correctnessScore = Math.max(60, Math.round(62 + ideaRatio * 22 + Math.min(keywordRatio, 0.4) * 20));
  } else if (keywordRatio >= 0.35 || hasFormulaShape) {
    correctnessScore = 60;
  } else if (keywordRatio >= 0.18) {
    correctnessScore = Math.round(46 + keywordRatio * 50);
  } else if (answerTooShort) {
    correctnessScore = 30;
  } else {
    correctnessScore = 42;
  }

  if (correctnessScore >= 60 && correctnessScore < 80 && (ideaRatio >= 0.5 || keywordRatio >= 0.3)) {
    correctnessScore = Math.max(correctnessScore, Math.round(68 + Math.min(0.5, ideaRatio || keywordRatio) * 20));
  }
  if (correctnessScore >= 80 && !hasConcreteExample) correctnessScore = Math.min(correctnessScore, 88);

  return {
    correctnessScore: Math.max(0, Math.min(100, correctnessScore)),
    keywordRatio,
    expectedIdeas,
    matchedIdeas,
    missingIdeas,
    hasConcreteExample,
    answerWords,
  };
}

function scoreFromKeywords(userInput, expectedConcept) {
  return analyzeFallbackAnswer(userInput, expectedConcept).correctnessScore;
}

function basicAiFallback(userInput, expectedConcept) {
  const analysis = analyzeFallbackAnswer(userInput, expectedConcept);
  const wordCount = analysis.answerWords.length;
  const clarityScore = Math.min(100, Math.max(wordCount ? 35 : 0, Math.round(wordCount * 5 + (/[.!?]/.test(userInput) ? 10 : 0))));
  const mostlyCorrect = analysis.correctnessScore >= 75;
  const partiallyCorrect = analysis.correctnessScore >= 60 && analysis.correctnessScore < 75;
  const missingConcepts = mostlyCorrect
    ? []
    : analysis.missingIdeas.slice(0, 3).map((idea) => `Mention ${idea.label}`)
  const suggestions = [];

  if (!userInput.trim()) {
    suggestions.push('Write one sentence with the main idea.');
  } else {
    if (!analysis.matchedIdeas.length && analysis.expectedIdeas.length) suggestions.push('Name the core idea more directly.');
    if (!analysis.hasConcreteExample) suggestions.push('Add one small example with numbers, inputs, or outputs.');
    if (partiallyCorrect) suggestions.push('You are on the right track. Add the missing piece and one reason why it works.');
    if (mostlyCorrect) suggestions.push('This looks mostly correct. Improve it by adding one precise example or edge case.');
  }

  return {
    correctnessScore: analysis.correctnessScore,
    clarityScore,
    missingConcepts,
    suggestions: suggestions.length ? suggestions : ['Clarify the answer with one concrete example.'],
    strengths: analysis.matchedIdeas.length
      ? analysis.matchedIdeas.map((idea) => `Includes ${idea.label}`)
      : userInput.trim()
        ? ['You made a relevant attempt that can be refined.']
        : [],
    fallback: true,
  };
}

async function requestAiFeedback(payload) {
  const endpoints = ['/api/ai-feedback', '/.netlify/functions/ai-feedback'];
  let lastError = null;

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        lastError = new Error(`Feedback endpoint returned ${response.status}`);
        continue;
      }

      return response.json();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error('AI feedback endpoint unavailable');
}

async function requestAiTutorChat(payload) {
  return requestAiFeedback({ mode: 'chat', ...payload });
}

function localTutorReply(message, expectedConcept) {
  const concept = expectedConcept?.split('\n').find((line) => line.trim()) || 'the main idea';
  const lower = message.toLowerCase();
  const hasNumbers = /\d/.test(lower);
  const hasSteps = ['then', 'first', 'next', 'multiply', 'add', 'shift', 'because', 'so', 'return', 'after'].some((term) => lower.includes(term));

  if (hasNumbers && hasSteps) {
    return {
      reply: `Yes, you are using a concrete example and step-by-step reasoning. A sharper explanation would name the input, the rule that changes it, and the output. Deeper question: what would change if one input were larger, smaller, or negative? Connect that back to: ${concept}`,
      tutorMove: 'deeper-question',
      suggestedQuestion: 'What changes if one input changes?',
      fallback: true,
    };
  }

  if (lower.includes('answer') || lower.includes('solve it') || lower.includes('give me')) {
    return {
      reply: `I can help, but I want you to do the thinking move first. What is the first input, rule, or relationship you can identify? Connect it to: ${concept}`,
      tutorMove: 'question',
      suggestedQuestion: 'What is the first step you would try?',
      fallback: true,
    };
  }

  if (lower.includes('hint') || lower.includes('stuck')) {
    return {
      reply: `Hint: name the known pieces first, then ask what changes or what must be returned. Keep it small: one input, one operation, one output. How does that match ${concept}?`,
      tutorMove: 'hint',
      suggestedQuestion: 'Which part feels unclear: the input, the rule, or the output?',
      fallback: true,
    };
  }

  return {
    reply: `Good starting point. Before I explain more, try one concrete example with simple numbers or a tiny case. What happens step by step, and where does it match ${concept}?`,
    tutorMove: 'next-step',
    suggestedQuestion: 'Can you test your idea with one small example?',
    fallback: true,
  };
}

function AiTutorChat({ chatId, contextTitle, expectedConcept, userWork = '', chatStore }) {
  const [chats, updateChat, resetChat] = chatStore;
  const messages = chats[chatId] || [];
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  async function sendMessage(text = draft) {
    const content = text.trim();
    if (!content || loading) return;

    const userMessage = {
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    };
    const nextMessages = [...messages, userMessage];
    updateChat(chatId, nextMessages);
    setDraft('');
    setLoading(true);
    setStatus('');

    try {
      const result = await requestAiTutorChat({
        contextTitle,
        expectedConcept,
        userWork,
        messages: nextMessages.slice(-10),
      });
      updateChat(chatId, [
        ...nextMessages,
        {
          role: 'assistant',
          content: result.reply,
          tutorMove: result.tutorMove || 'guide',
          suggestedQuestion: result.suggestedQuestion || '',
          createdAt: new Date().toISOString(),
        },
      ]);
      setStatus('Tutor replied.');
    } catch {
      const fallback = localTutorReply(content, expectedConcept);
      updateChat(chatId, [
        ...nextMessages,
        {
          role: 'assistant',
          content: fallback.reply,
          tutorMove: fallback.tutorMove,
          suggestedQuestion: fallback.suggestedQuestion,
          fallback: true,
          createdAt: new Date().toISOString(),
        },
      ]);
      setStatus('AI Tutor is unavailable, so a basic local hint is shown.');
    } finally {
      setLoading(false);
    }
  }

  return h(
    'section',
    { className: 'rounded-lg border border-indigo-100 bg-indigo-50 p-4' },
    h(
      'div',
      { className: 'flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between' },
      h(
        'div',
        null,
        h('h4', { className: 'text-sm font-bold uppercase tracking-wide text-indigo-700' }, 'Interactive AI Tutor'),
        h('p', { className: 'mt-1 text-sm leading-6 text-slate-700' }, 'Ask follow-up questions, request hints, or test your reasoning. The tutor is designed to guide before giving answers.'),
      ),
      messages.length
        ? h(
            'button',
            {
              className: 'rounded-lg border border-indigo-200 bg-white px-3 py-2 text-sm font-bold text-indigo-700 transition hover:bg-indigo-100',
              onClick: () => resetChat(chatId),
            },
            'Reset chat',
          )
        : null,
    ),
    h(
      'div',
      { className: 'mt-4 max-h-80 space-y-3 overflow-y-auto rounded-lg border border-indigo-100 bg-white p-3' },
      messages.length
        ? messages.map((message, index) =>
            h(
              'div',
              {
                className: `rounded-lg p-3 text-sm leading-6 ${message.role === 'user' ? 'ml-8 bg-blue-50 text-blue-950' : 'mr-8 bg-slate-50 text-slate-700'}`,
                key: `${message.createdAt}-${index}`,
              },
              h('p', { className: 'mb-1 text-xs font-bold uppercase tracking-wide text-slate-500' }, message.role === 'user' ? 'You' : `Tutor${message.tutorMove ? `: ${message.tutorMove}` : ''}`),
              h('p', { className: 'whitespace-pre-wrap' }, message.content),
              message.suggestedQuestion ? h('p', { className: 'mt-2 font-semibold text-indigo-700' }, message.suggestedQuestion) : null,
              message.fallback ? h('p', { className: 'mt-2 text-xs font-semibold text-amber-700' }, 'Basic local guidance shown.') : null,
            ),
          )
        : h('p', { className: 'text-sm leading-6 text-slate-500' }, 'No messages yet. Start with a hint request, a question about your attempt, or “ask me a question.”'),
    ),
    h(
      'div',
      { className: 'mt-3 flex flex-wrap gap-2' },
      ['Give me a hint', 'Ask me a question', 'Check my reasoning'].map((prompt) =>
        h(
          'button',
          {
            className: 'rounded-lg border border-indigo-200 bg-white px-3 py-1.5 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100',
            disabled: loading,
            key: prompt,
            onClick: () => sendMessage(prompt),
          },
          prompt,
        ),
      ),
    ),
    h(
      'div',
      { className: 'mt-3 flex flex-col gap-2 sm:flex-row' },
      h('textarea', {
        className: 'min-h-20 flex-1 resize-y rounded-lg border border-indigo-200 bg-white p-3 text-sm leading-6 text-ink outline-none transition focus:border-cobalt focus:ring-2 focus:ring-blue-100',
        placeholder: 'Ask a follow-up or describe where you are stuck.',
        value: draft,
        onChange: (event) => setDraft(event.target.value),
      }),
      h(
        'button',
        {
          className: `rounded-lg px-4 py-2 text-sm font-bold text-white transition sm:self-end ${draft.trim() && !loading ? 'bg-cobalt hover:bg-blue-800' : 'cursor-not-allowed bg-slate-300'}`,
          disabled: !draft.trim() || loading,
          onClick: () => sendMessage(),
        },
        loading ? 'Thinking...' : 'Send',
      ),
    ),
    status ? h('p', { className: `mt-2 text-sm font-semibold ${status.includes('unavailable') ? 'text-amber-700' : 'text-emerald-700'}` }, status) : null,
  );
}

function FeedbackList({ title, items, empty }) {
  return h(
    'div',
    { className: 'rounded-lg bg-slate-50 p-3' },
    h('p', { className: 'text-sm font-bold text-slate-700' }, title),
    h(
      'ul',
      { className: 'mt-2 space-y-1 text-sm leading-6 text-slate-600' },
      items?.length ? items.map((item) => h('li', { key: item }, item)) : h('li', null, empty),
    ),
  );
}

function AiFeedbackPanel({ inputType, userInput, expectedConcept, contextTitle, fallbackFeedback }) {
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const ready = Boolean(userInput?.trim() && expectedConcept?.trim());

  async function getFeedback() {
    if (!ready) return;
    setLoading(true);
    setStatus('');

    try {
      const result = await requestAiFeedback({ inputType, userInput, expectedConcept, contextTitle });
      setFeedback(result);
      setStatus('AI feedback received.');
    } catch {
      setFeedback(fallbackFeedback || basicAiFallback(userInput, expectedConcept));
      setStatus('AI feedback is unavailable, so basic local feedback is shown instead.');
    } finally {
      setLoading(false);
    }
  }

  return h(
    'section',
    { className: 'rounded-lg border border-slate-200 bg-white p-4' },
    h(
      'div',
      { className: 'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between' },
      h('div', null, h('h4', { className: 'text-sm font-bold uppercase tracking-wide text-slate-500' }, 'AI Tutor Feedback'), h('p', { className: 'mt-1 text-sm leading-6 text-slate-600' }, 'Scores are guidance, not a final grade. Use them to revise your thinking.')),
      h(
        'button',
        {
          className: `rounded-lg px-3 py-2 text-sm font-bold text-white transition ${ready && !loading ? 'bg-cobalt hover:bg-blue-800' : 'cursor-not-allowed bg-slate-300'}`,
          disabled: !ready || loading,
          onClick: getFeedback,
        },
        loading ? 'Getting feedback...' : 'Get AI Feedback',
      ),
    ),
    status ? h('p', { className: `mt-3 text-sm font-semibold ${feedback?.fallback ? 'text-amber-700' : 'text-emerald-700'}` }, status) : null,
    feedback
      ? h(
          'div',
          { className: 'mt-4 space-y-3' },
          feedback.fallback ? h('p', { className: 'rounded-lg bg-amber-50 p-3 text-sm leading-6 text-amber-900' }, 'Basic feedback fallback: this is keyword-based, not AI grading.') : null,
          h(
            'div',
            { className: 'grid gap-3 sm:grid-cols-2' },
            h(Metric, { label: 'Correctness score', value: `${feedback.correctnessScore ?? 0}/100`, color: '#1d4ed8' }),
            h(Metric, { label: 'Clarity score', value: `${feedback.clarityScore ?? 0}/100`, color: '#047857' }),
          ),
          h('div', { className: 'grid gap-3 lg:grid-cols-3' }, h(FeedbackList, { title: 'Strengths', items: feedback.strengths, empty: 'No specific strengths returned.' }), h(FeedbackList, { title: 'Missing concepts', items: feedback.missingConcepts, empty: 'No missing concepts flagged.' }), h(FeedbackList, { title: 'Suggestions', items: feedback.suggestions, empty: 'No suggestions returned.' })),
        )
      : null,
  );
}

function PredictionPanel({ itemId, prompt, predictionStore, children, expectedIdea }) {
  const [predictions, updatePrediction] = predictionStore;
  const saved = predictions[itemId] || {
    prediction: '',
    locked: false,
    reflection: '',
    result: '',
    labGrade: '',
    explanationShown: false,
  };
  const reflected = Boolean(saved.reflection?.trim() && (saved.result || saved.labGrade));

  return h(
    'section',
    { className: 'space-y-4 rounded-lg border border-blue-100 bg-blue-50 p-4' },
    h('div', null, h('p', { className: 'text-xs font-bold uppercase tracking-wide text-blue-700' }, 'Predict'), h('p', { className: 'mt-2 text-sm leading-7 text-slate-700' }, prompt)),
    saved.locked
      ? h(
          'div',
          { className: 'rounded-lg border border-blue-200 bg-white p-3' },
          h('p', { className: 'text-xs font-bold uppercase tracking-wide text-blue-700' }, 'Locked prediction'),
          h('p', { className: 'mt-2 whitespace-pre-wrap text-sm leading-7 text-blue-950' }, saved.prediction),
        )
      : h(
          'div',
          { className: 'space-y-3' },
          h('textarea', {
            className: 'min-h-24 w-full resize-y rounded-lg border border-blue-200 bg-white p-3 text-sm leading-6 text-ink outline-none transition focus:border-cobalt focus:ring-2 focus:ring-blue-100',
            placeholder: 'Write what you think will happen before you test it.',
            value: saved.prediction,
            onChange: (event) => updatePrediction(itemId, { prediction: event.target.value }),
          }),
          h(
            'button',
            {
              className: `rounded-lg px-4 py-2.5 text-sm font-bold text-white shadow-soft transition ${
                saved.prediction.trim() ? 'bg-cobalt hover:bg-blue-800' : 'cursor-not-allowed bg-slate-300'
              }`,
              disabled: !saved.prediction.trim(),
              onClick: () => updatePrediction(itemId, { locked: true }),
            },
            'Lock Prediction',
          ),
        ),
    saved.locked
      ? h(
          'div',
          { className: 'space-y-4' },
          h('div', { className: 'rounded-lg border border-slate-200 bg-white p-4' }, h('p', { className: 'mb-3 text-xs font-bold uppercase tracking-wide text-slate-500' }, 'Test'), children),
          expectedIdea
            ? h(
                'div',
                { className: 'rounded-lg border border-slate-200 bg-white p-4' },
                h('p', { className: 'text-xs font-bold uppercase tracking-wide text-slate-500' }, 'Answer key'),
                h(
                  'button',
                  {
                    className: 'mt-3 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-100',
                    onClick: () => updatePrediction(itemId, { explanationShown: true }),
                  },
                  saved.explanationShown ? 'Explanation shown' : 'Show Explanation',
                ),
                saved.explanationShown
                  ? h('div', { className: 'mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700' }, expectedIdea)
                  : null,
                h('p', { className: 'mt-4 text-sm font-semibold text-slate-700' }, 'Self-grade your prediction'),
                h(SelfGradeButtons, { value: saved.labGrade, onChange: (grade) => updatePrediction(itemId, { labGrade: grade }) }),
              )
            : null,
          h(
            'div',
            { className: 'rounded-lg border border-slate-200 bg-white p-4' },
            h('p', { className: 'text-xs font-bold uppercase tracking-wide text-slate-500' }, 'Reflect'),
            h('label', { className: 'mt-3 block text-sm font-semibold text-slate-700' }, 'Were you right, wrong, or partially right?'),
            h(
              'select',
              {
                className: 'mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold outline-none focus:border-cobalt focus:bg-white focus:ring-2 focus:ring-blue-100',
                value: saved.result,
                onChange: (event) => updatePrediction(itemId, { result: event.target.value }),
              },
              [
                ['', 'Choose one'],
                ['right', 'Right'],
                ['partially-right', 'Partially right'],
                ['wrong', 'Wrong'],
              ].map(([value, label]) => h('option', { key: value, value }, label)),
            ),
            h('label', { className: 'mt-3 block text-sm font-semibold text-slate-700' }, 'What actually happened? Why?'),
            h('textarea', {
              className: 'mt-2 min-h-24 w-full resize-y rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-ink outline-none transition focus:border-cobalt focus:bg-white focus:ring-2 focus:ring-blue-100',
              placeholder: 'Compare your prediction with what you observed. What changed your thinking?',
              value: saved.reflection,
              onChange: (event) => updatePrediction(itemId, { reflection: event.target.value }),
            }),
            h(AiFeedbackPanel, {
              inputType: 'prediction reflection',
              userInput: `${saved.prediction}\n\nReflection: ${saved.reflection}`,
              expectedConcept: expectedIdea || prompt,
              contextTitle: itemId,
            }),
          ),
          reflected ? h(ReinforcementPanel, { kind: 'lab', item: { title: itemId.replace('lab-', '').replaceAll('-', ' ') } }) : null,
        )
      : null,
  );
}

function Sidebar({ completedCount, totalLessons, subjectProgress, pilotFocus = false, foundationMode = false }) {
  const fullNavItems = [
    ['Dashboard', LayoutDashboard, '#dashboard', null],
    ['Foundation', Sparkles, '#foundation-mode', null],
    ['Pilot Test', ClipboardList, '#pilot-test', null],
    ['Curriculum Map', Compass, '#curriculum-map', null],
    ['Skill Graph', Sparkles, '#skill-graph', null],
    ['Karpathy Path', BrainCircuit, '#karpathy-path', null],
    ...subjectProgress.map((subject) => [subject.title, subject.icon, `#${slug(subject.title)}`, subject.total]),
    ['Review', ClipboardList, '#review', null],
    ['Labs', Beaker, '#labs', null],
    ['Data Playground', BrainCircuit, '#data-model-playground', null],
    ['Build Mode', Code2, '#build-mode', null],
    ['Debug Mode', Bug, '#debug-mode', null],
    ['Code Reading', Search, '#code-reading', null],
    ['Thinking Lab', Sparkles, '#thinking-lab', null],
    ['Projects', Rocket, '#projects', null],
    ['Daily Coach', BrainCircuit, '#daily-coach', null],
  ];
  const navItems = pilotFocus
    ? [
        ['Dashboard', LayoutDashboard, '#dashboard', null],
        ['Pilot Test', ClipboardList, '#pilot-test', null],
      ]
    : foundationMode
      ? [
          ['Dashboard', LayoutDashboard, '#dashboard', null],
          ['Foundation', Sparkles, '#foundation-mode', null],
          ['Math', Calculator, '#math', null],
          ['Labs', Beaker, '#labs', null],
          ['Build Mode', Code2, '#build-mode', null],
          ['Review', ClipboardList, '#review', null],
          ['Daily Coach', BrainCircuit, '#daily-coach', null],
        ]
    : fullNavItems;

  return h(
    'aside',
    { className: 'hidden w-72 shrink-0 border-r border-[#2a2a2a] bg-[#0d0d0d] px-5 py-6 lg:flex lg:flex-col' },
    h(
      'div',
      { className: 'mb-8 flex items-center gap-3' },
      h('div', { className: 'grid h-11 w-11 place-items-center bg-[#00ff88]' }, icon(Compass, { size: 23, className: 'text-[#0d0d0d]' })),
      h('div', null, h('p', { className: 'text-sm font-bold uppercase tracking-widest text-[#00ff88]' }, 'Triad'), h('h1', { className: 'text-xl font-bold leading-tight text-[#e0e0e0]' }, 'Academy')),
    ),
    h(
      'nav',
      { className: 'space-y-1' },
      navItems.map(([label, itemIcon, href, count]) =>
        h(
          'a',
          {
            className: 'group flex items-center gap-3 px-3 py-3 text-sm font-medium text-[#888888] transition hover:bg-[#1a1a1a] hover:text-[#e0e0e0]',
            href,
            key: label,
          },
          icon(itemIcon, { className: 'text-[#555555] transition group-hover:text-[#00ff88]' }),
          h('span', { className: 'flex-1' }, label),
          count ? h('span', { className: 'bg-[#1a1a1a] px-2 py-0.5 text-xs font-bold text-[#555555]' }, count) : null,
        ),
      ),
    ),
    pilotFocus ? h('p', { className: 'mt-4 border border-[#1a2e22] bg-[#0d1a12] p-3 text-xs font-semibold leading-5 text-[#00ff88]' }, 'Pilot focus mode is active. Finish the guided session before returning to the full menu.') : null,
    h(
      'div',
      { className: 'mt-auto border border-[#2a2a2a] bg-[#111111] p-4' },
      h('div', { className: 'mb-3 flex items-center gap-2 text-sm font-semibold text-[#e0e0e0]' }, icon(CheckCircle2, { className: 'text-[#00ff88]' }), 'Progress'),
      h('p', { className: 'text-sm leading-6 text-[#888888]' }, `${completedCount} of ${totalLessons} lessons complete. Your answers and explanations stay in this browser.`),
    ),
  );
}

function LessonBlock({ label, children }) {
  return h(
    'section',
    { className: 'border-t border-slate-200 pt-5 first:border-t-0 first:pt-0' },
    h('h4', { className: 'mb-2 text-sm font-bold uppercase tracking-wide text-slate-500' }, label),
    h('p', { className: 'text-sm leading-7 text-slate-700' }, children),
  );
}

function LearningSection({ title, children, defaultOpen = false }) {
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

function StepList({ items }) {
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

function SolveBeforeReveal({ itemId, prompt, revealTitle = 'Solution', revealContent, solveStore }) {
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

function WorkedExample({ example, lessonId, index, solveStore }) {
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

function PracticeProblem({ problem, lessonId, index, solveStore }) {
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

function ExplanationModeTabs({ mode, setMode }) {
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

function Eli5Explanation({ lesson }) {
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

function DeepDiveExplanation({ lesson, solveStore }) {
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

function LessonLearningSections({ lesson, solveStore, mode = 'standard' }) {
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

function LessonCard({ lesson, saved, updateLesson, defaultOpen, predictionStore, solveStore, chatStore }) {
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

function EmptyLessonsState({ message }) {
  return h(
    'div',
    { className: 'rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center' },
    h('p', { className: 'text-sm font-semibold text-slate-700' }, message),
    h('p', { className: 'mt-2 text-sm leading-6 text-slate-500' }, 'Try changing the filters or jump to the next open lesson from the dashboard.'),
  );
}

function SubjectSection({ subjectKey, subject, progress, filteredLessons, predictionStore, solveStore, chatStore }) {
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

function RangeSlider({ label, value, min, max, step = 1, unit = '', onChange }) {
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

function SvgFrame({ children, viewBox = '0 0 420 260' }) {
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

function FunctionVisualizer({ predictionStore }) {
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

function ProjectileMotionSimulator({ predictionStore }) {
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

function AlgorithmComplexityVisualizer({ predictionStore }) {
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

function Metric({ label, value, color = '#172033' }) {
  return h(
    'div',
    { className: 'flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2' },
    h('span', { className: 'text-slate-600' }, label),
    h('span', { className: 'font-bold', style: { color } }, value),
  );
}

function LabCard({ title, prediction, iconType, children }) {
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

function modelLoss(points, slope, intercept) {
  return points.reduce((total, [x, y]) => total + (slope * x + intercept - y) ** 2, 0) / points.length;
}

function trainLinearModel(points, slope, intercept, learningRate, steps) {
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

function DataModelPlayground() {
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

function InteractiveLabs({ predictionStore, foundationState }) {
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

function recommendLab(lesson) {
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

function miniBuildFor(lesson) {
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

function reflectionFor(lesson) {
  if (lesson.subjectTitle === 'Math') {
    return 'What would the graph, equation, or numbers look like if the situation doubled in size?';
  }

  if (lesson.subjectTitle === 'Physics') {
    return 'Which quantity in this situation is changing, and what causes that change?';
  }

  return 'What input does this computing idea need, what output should it produce, and where could it fail?';
}

function estimateFor(level) {
  if (level === 'Advanced') return '45-55 minutes';
  if (level === 'Core') return '35-45 minutes';
  return '25-35 minutes';
}

function buildDailyPlan(lessonQueue, lessonProgress) {
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

function buildReviewQueue({ lessonQueue, lessonProgress, solveState, predictionState, buildState, debugState, codeReadingState, karpathyProgress, foundationState, reviewHistory }) {
  const reviewedToday = new Set(reviewHistory.filter((entry) => entry.date === todayKey()).map((entry) => entry.itemId));
  const queue = [];
  const completedFoundation = FOUNDATION_CONCEPTS[0].microLessons.filter((lesson) => foundationState?.progress?.[lesson.id]?.complete);

  if (completedFoundation.length && !reviewedToday.has('foundation-functions-review')) {
    queue.push({
      id: 'foundation-functions-review',
      type: 'Foundation review',
      title: 'Review: you learned this earlier',
      reason: 'Practice inputs and outputs again so the idea stays easy before labs and builds.',
      href: '#foundation-mode',
    });
  }

  lessonQueue.forEach((lesson) => {
    const answer = lessonProgress[lesson.id]?.quizAnswer;
    if (typeof answer === 'number' && answer !== lesson.quiz.correctIndex) {
      queue.push({
        id: `quiz-${lesson.id}`,
        type: 'Lesson quiz',
        title: `${lesson.subjectTitle}: ${lesson.title}`,
        reason: 'Quiz answer was incorrect.',
        href: `#${lesson.id}`,
      });
    }
  });

  Object.entries(solveState).forEach(([itemId, state]) => {
    if (state.attempt?.trim() && !state.reflection?.trim()) {
      queue.push({
        id: `solve-${itemId}`,
        type: 'Practice reflection',
        title: itemId.startsWith('daily-') ? 'Daily Coach practice problem' : 'Lesson practice or worked example',
        reason: 'Attempted but not reflected after reveal.',
        href: itemId.startsWith('daily-') ? '#daily-coach' : `#${itemId.split('-practice-')[0].split('-worked-')[0]}`,
      });
    }
  });

  LAB_IDS.forEach((labId) => {
    const state = predictionState[labId];
    if (state?.labGrade === 'incorrect' || state?.labGrade === 'partially-correct') {
      const titles = {
        'lab-function-visualizer': 'Function Visualizer',
        'lab-projectile-motion': 'Projectile Motion Simulator',
        'lab-algorithm-complexity': 'Algorithm Complexity Visualizer',
      };
      queue.push({
        id: `lab-${labId}`,
        type: 'Lab prediction',
        title: titles[labId],
        reason: `Lab prediction was graded ${state.labGrade === 'incorrect' ? 'incorrect' : 'partially correct'}.`,
        href: '#labs',
      });
    }
  });

  buildChallenges.forEach((challenge) => {
    const state = buildState[challenge.id];
    if (!state || state.status !== 'complete' || state.grade === 'partially-correct' || state.grade === 'incorrect') {
      queue.push({
        id: `build-${challenge.id}`,
        type: 'Build challenge',
        title: challenge.concept,
        reason: state?.grade === 'partially-correct' || state?.grade === 'incorrect' ? `Build challenge graded ${state.grade === 'incorrect' ? 'incorrect' : 'partially correct'}.` : 'Build challenge is incomplete.',
        href: `#${challenge.id}`,
      });
    }
  });

  debugChallenges.forEach((challenge) => {
    const state = debugState[challenge.id];
    const passed = state?.lastResult?.testResults?.filter((test) => test.passed).length || 0;
    const total = challenge.testCases.length;
    const hasFailedRun = state?.lastResult && passed < total;

    if (!state || state.status !== 'complete' || hasFailedRun) {
      queue.push({
        id: `debug-${challenge.id}`,
        type: 'Debug challenge',
        title: challenge.title,
        reason: hasFailedRun ? `${passed}/${total} tests passed on the last run.` : 'Debug challenge is incomplete.',
        href: `#${challenge.id}`,
      });
    }
  });

  codeReadingChallenges.forEach((challenge) => {
    const state = codeReadingState[challenge.id];
    const incorrectPrediction = state?.predictionResult === 'incorrect';

    if (!state || state.status !== 'complete' || incorrectPrediction) {
      queue.push({
        id: `code-reading-${challenge.id}`,
        type: 'Code reading',
        title: challenge.title,
        reason: incorrectPrediction ? 'Prediction was marked incorrect after revealing the result.' : 'Code reading challenge is incomplete.',
        href: `#${challenge.id}`,
      });
    }
  });

  karpathyMilestones.forEach((milestone) => {
    const state = karpathyProgress[milestone.id];
    if (!state || state.status !== 'complete') {
      queue.push({
        id: `karpathy-${milestone.id}`,
        type: 'Karpathy milestone',
        title: milestone.title,
        reason: state?.reflection?.trim() ? 'Milestone reflection started but not completed.' : 'Milestone is incomplete.',
        href: `#${milestone.id}`,
      });
    }
  });

  return queue.filter((item) => !reviewedToday.has(item.id)).slice(0, 24);
}

function ReviewQueue({ reviewQueue, reviewHistory, markReviewed }) {
  const recent = [...reviewHistory].sort((a, b) => b.reviewedAt.localeCompare(a.reviewedAt)).slice(0, 5);

  return h(
    'section',
    { className: 'space-y-4 scroll-mt-6', id: 'review' },
    h(
      'div',
      { className: 'rounded-lg border border-slate-200 bg-white p-5 shadow-sm' },
      h('p', { className: 'text-sm font-semibold uppercase tracking-wide text-fern' }, 'Review Queue'),
      h('h2', { className: 'mt-1 text-2xl font-bold' }, 'Today’s review queue'),
      h('p', { className: 'mt-3 max-w-3xl text-sm leading-7 text-slate-700' }, 'Weak or unfinished material comes back here automatically: missed quizzes, unfinished reflections, weak lab predictions, incomplete builds, failing debug challenges, and code reading predictions that need review.'),
    ),
    reviewQueue.length
      ? h(
          'div',
          { className: 'space-y-3' },
          reviewQueue.map((item) =>
            h(
              'article',
              { className: 'rounded-lg border border-slate-200 bg-white p-4 shadow-sm', key: item.id },
              h('div', { className: 'flex flex-col gap-3 md:flex-row md:items-start md:justify-between' }, h('div', null, h('div', { className: 'mb-2 flex flex-wrap gap-2' }, h(Pill, { tone: 'blue' }, item.type), h(Pill, { tone: 'amber' }, 'Review')), h('h3', { className: 'font-bold text-ink' }, item.title), h('p', { className: 'mt-2 text-sm leading-6 text-slate-600' }, item.reason)), h('div', { className: 'flex flex-wrap gap-2' }, h('a', { className: 'rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700', href: item.href }, 'Jump to item'), h('button', { className: 'rounded-lg bg-cobalt px-3 py-2 text-sm font-bold text-white', onClick: () => markReviewed(item) }, 'Mark reviewed'))),
            ),
          ),
        )
      : h('div', { className: 'rounded-lg border border-emerald-100 bg-emerald-50 p-5 text-sm leading-7 text-emerald-900' }, 'No review items due today. If you miss a quiz, leave a practice reflection unfinished, or mark a lab/build as weak, it will appear here.'),
    recent.length
      ? h(
          'div',
          { className: 'rounded-lg border border-slate-200 bg-white p-5 shadow-sm' },
          h('h3', { className: 'text-sm font-bold uppercase tracking-wide text-slate-500' }, 'Recent review history'),
          h('div', { className: 'mt-3 space-y-2' }, recent.map((entry) => h('div', { className: 'rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700', key: `${entry.itemId}-${entry.reviewedAt}` }, `${entry.date}: ${entry.title}`))),
        )
      : null,
  );
}

function SkillGraph({ skillLevels, weakSkill, adaptiveLesson }) {
  const byId = Object.fromEntries(skillLevels.map((skill) => [skill.id, skill]));
  const weakAreas = [...skillLevels].filter((skill) => skill.weak).sort((a, b) => a.score - b.score).slice(0, 6);

  function nodeColor(skill) {
    if (!skill.unlocked) return '#cbd5e1';
    if (skill.weak) return '#f97316';
    if (skill.developing) return '#2563eb';
    if (skill.strong) return '#059669';
    return '#64748b';
  }

  return h(
    'section',
    { className: 'space-y-4 scroll-mt-6', id: 'skill-graph' },
    h(
      'div',
      { className: 'rounded-lg border border-slate-200 bg-white p-5 shadow-sm' },
      h('p', { className: 'text-sm font-semibold uppercase tracking-wide text-fern' }, 'Skill Graph'),
      h('h2', { className: 'mt-1 text-2xl font-bold' }, 'See how skills depend on each other'),
      h('p', { className: 'mt-3 max-w-3xl text-sm leading-7 text-slate-700' }, 'The graph estimates skill levels from quiz results, lesson completions, explanations, labs, Build Mode grades, code attempts, and solve-before-reveal reflections. Orange nodes are weak unlocked areas to revisit.'),
      weakSkill
        ? h(
            'div',
            { className: 'mt-4 rounded-lg border border-amber-100 bg-amber-50 p-4 text-sm leading-6 text-amber-950' },
            h('p', { className: 'font-bold' }, `Adaptive focus: ${weakSkill.label}`),
            h('p', null, adaptiveLesson ? `Recommended lesson: ${adaptiveLesson.subjectTitle}: ${adaptiveLesson.title}` : 'Practice this skill through a connected lab, build challenge, or review item.'),
          )
        : null,
    ),
    h(
      'div',
      { className: 'overflow-x-auto rounded-lg border border-slate-200 bg-white p-4 shadow-sm' },
      h(
        'svg',
        { role: 'img', style: { width: '980px', height: '530px' }, viewBox: '0 0 930 500' },
        skillLevels.flatMap((skill) =>
          skill.dependsOn.map((dependencyId) => {
            const dependency = byId[dependencyId];
            if (!dependency) return null;
            return h('line', {
              key: `${dependencyId}-${skill.id}`,
              x1: dependency.x,
              y1: dependency.y,
              x2: skill.x,
              y2: skill.y,
              stroke: '#cbd5e1',
              strokeWidth: 2,
            });
          }),
        ),
        skillLevels.map((skill) =>
          h(
            'g',
            { key: skill.id },
            h('circle', { cx: skill.x, cy: skill.y, r: 28, fill: nodeColor(skill), opacity: skill.unlocked ? 1 : 0.6 }),
            h('text', { x: skill.x, y: skill.y + 5, textAnchor: 'middle', className: 'fill-white text-xs font-bold' }, skill.score),
            h('text', { x: skill.x, y: skill.y + 45, textAnchor: 'middle', className: 'fill-slate-700 text-xs font-bold' }, skill.label),
          ),
        ),
      ),
    ),
    h(
      'div',
      { className: 'grid gap-4 lg:grid-cols-2' },
      h(
        'div',
        { className: 'rounded-lg border border-slate-200 bg-white p-5 shadow-sm' },
        h('h3', { className: 'text-sm font-bold uppercase tracking-wide text-slate-500' }, 'Weak areas'),
        weakAreas.length
          ? h(
              'div',
              { className: 'mt-3 space-y-2' },
              weakAreas.map((skill) =>
                h(
                  'div',
                  { className: 'rounded-lg bg-amber-50 p-3 text-sm leading-6 text-amber-950', key: skill.id },
                  h('p', { className: 'font-bold' }, `${skill.label}: ${skill.score}/100`),
                  h('p', null, `Depends on: ${skill.dependsOnLabels.length ? skill.dependsOnLabels.join(', ') : 'none'}`),
                ),
              ),
            )
          : h('p', { className: 'mt-3 text-sm leading-6 text-slate-600' }, 'No weak unlocked skills yet. As you answer quizzes, reflect on labs, and complete builds, this section becomes more specific.'),
      ),
      h(
        'div',
        { className: 'rounded-lg border border-slate-200 bg-white p-5 shadow-sm' },
        h('h3', { className: 'text-sm font-bold uppercase tracking-wide text-slate-500' }, 'Skill levels'),
        h(
          'div',
          { className: 'mt-3 grid gap-2 sm:grid-cols-2' },
          skillLevels.map((skill) =>
            h(
              'div',
              { className: 'rounded-lg bg-slate-50 p-3', key: skill.id },
              h('div', { className: 'flex items-center justify-between gap-2' }, h('p', { className: 'text-sm font-bold text-ink' }, skill.label), h(Pill, { tone: skill.weak ? 'amber' : skill.strong ? 'green' : 'blue' }, `${skill.score}`)),
              h('div', { className: 'mt-2 h-2 overflow-hidden rounded-full bg-slate-200' }, h('div', { className: 'h-full rounded-full', style: { width: `${skill.score}%`, backgroundColor: nodeColor(skill) } })),
            ),
          ),
        ),
      ),
    ),
  );
}

function PlanRow({ label, children }) {
  return h(
    'div',
    { className: 'rounded-lg border border-slate-200 bg-slate-50 p-4' },
    h('p', { className: 'text-xs font-bold uppercase tracking-wide text-slate-500' }, label),
    h('div', { className: 'mt-2 text-sm leading-7 text-slate-700' }, children),
  );
}

function answerMatches(userAnswer, expectedAnswer) {
  const user = String(userAnswer || '').trim().toLowerCase();
  const expected = String(expectedAnswer || '').trim().toLowerCase();
  return user === expected;
}

function MicroLessonCard({ lesson, index, saved, updateFoundationItem }) {
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

function FoundationModePanel({ foundationState, updateFoundationItem }) {
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

function DailyCoach({ lessonQueue, lessonProgress, sessions, startSession, completeSession, recommendedBuild, recommendedDebug, recommendedCodeReading, recommendedKarpathyMilestone, reviewItem, languageLesson, thinkingChallenge, recommendedPathLesson, weakSkill, adaptiveSkillLesson, solveStore, foundationState }) {
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

function statusLabel(status) {
  if (status === 'complete') return 'Complete';
  if (status === 'in-progress') return 'In Progress';
  return 'Not Started';
}

function hasText(value, min = 40) {
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

function testsPassed(result, testCases = []) {
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

function completionItems(items) {
  return items.map(([label, done]) => ({ label, done: Boolean(done) }));
}

function CompletionChecklist({ title = 'Before marking complete', items }) {
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

function reinforcementFor(kind, item = {}) {
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

function ReinforcementPanel({ kind, item }) {
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

function CodeRunner({ challenge, code, onCodeChange, onResetCode, onResult, title = 'Coding Environment', description = 'Write JavaScript, run the tests, and use the console output to debug.', initialResult = null, codeEdited = true, returnPrompt = 'What should this function return for each test case?' }) {
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

function BuildMode({ buildState, updateChallenge, chatStore, foundationState }) {
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

function DebugChallengeCard({ challenge, saved, updateDebugChallenge }) {
  const [open, setOpen] = useState(false);
  const state = {
    code: challenge.brokenCode,
    explanation: '',
    hintLevel: 0,
    modelExplanationViewed: false,
    status: 'not-started',
    lastResult: null,
    ...(saved || {}),
  };
  const complete = state.status === 'complete';
  const codeEdited = state.code !== challenge.brokenCode;
  const attempted = Boolean(state.lastResult || state.explanation.trim() || codeEdited);
  const passed = state.lastResult?.testResults?.filter((test) => test.passed).length || 0;
  const total = challenge.testCases.length;
  const allPassed = total > 0 && passed === total;
  const visibleHints = challenge.hints.slice(0, state.hintLevel);
  const explanationReady = hasText(state.explanation);
  const debugChecklist = completionItems([
    ['Edit the broken code', codeEdited],
    ['Make all tests pass', allPassed],
    ['Explain what was broken with at least 40 characters', explanationReady],
  ]);
  const debugReady = debugChecklist.every((item) => item.done);

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
        h(
          'div',
          { className: 'mb-2 flex flex-wrap gap-2' },
          h(Pill, { tone: complete ? 'green' : attempted ? 'amber' : 'slate' }, complete ? 'Complete' : attempted ? 'In Progress' : 'Not Started'),
          h(Pill, { tone: 'blue' }, challenge.category),
          h(Pill, { tone: allPassed ? 'green' : 'slate' }, state.lastResult ? `${passed}/${total} tests` : `${total} tests`),
        ),
        h('h3', { className: 'text-lg font-bold text-ink' }, challenge.title),
        h('p', { className: 'mt-1 text-sm leading-6 text-slate-600' }, challenge.expectedBehavior),
      ),
      icon(open ? ChevronDown : ChevronRight, { className: 'shrink-0 text-slate-500' }),
    ),
    open
      ? h(
          'div',
          { className: 'space-y-4 border-t border-slate-200 px-5 py-5' },
          h(PlanRow, { label: 'Expected behavior' }, challenge.expectedBehavior),
          h(CodeRunner, {
            challenge,
            code: state.code,
            title: 'Debugging Environment',
            description: 'Fix the broken JavaScript, run tests, read the failure messages, and revise like an engineer.',
            codeEdited,
            initialResult: state.lastResult,
            returnPrompt: 'What should the fixed code return for each failing case?',
            onCodeChange: (code) => updateDebugChallenge(challenge.id, { code }),
            onResetCode: () => updateDebugChallenge(challenge.id, { code: challenge.brokenCode, lastResult: null, status: 'not-started' }),
            onResult: (result) => {
              const resultPassed = result.testResults.filter((test) => test.passed).length;
              updateDebugChallenge(challenge.id, {
                lastResult: result,
                status: resultPassed === challenge.testCases.length ? 'in-progress' : 'in-progress',
                lastRunAt: new Date().toISOString(),
              });
            },
          }),
          h(
            'section',
            { className: 'rounded-lg border border-blue-100 bg-blue-50 p-4' },
            h('h4', { className: 'text-sm font-bold uppercase tracking-wide text-blue-700' }, 'Hint system'),
            visibleHints.length
              ? h('div', { className: 'mt-3 space-y-2' }, visibleHints.map((hint, index) => h('p', { className: 'rounded-lg bg-white p-3 text-sm leading-6 text-blue-950', key: hint }, `Hint ${index + 1}: ${hint}`)))
              : h('p', { className: 'mt-2 text-sm leading-6 text-blue-950' }, 'Try running the tests first, then reveal one hint at a time.'),
            h(
              'button',
              {
                className: `mt-3 rounded-lg px-3 py-2 text-sm font-bold text-white transition ${state.hintLevel < challenge.hints.length ? 'bg-cobalt hover:bg-blue-800' : 'cursor-not-allowed bg-slate-300'}`,
                disabled: state.hintLevel >= challenge.hints.length,
                onClick: () => updateDebugChallenge(challenge.id, { hintLevel: Math.min(challenge.hints.length, state.hintLevel + 1) }),
              },
              state.hintLevel < challenge.hints.length ? 'Reveal next hint' : 'All hints shown',
            ),
          ),
          h(
            'section',
            { className: 'rounded-lg border border-slate-200 p-4' },
            h('label', { className: 'text-sm font-bold uppercase tracking-wide text-slate-500' }, 'What was broken and why?'),
            h('textarea', {
              className: 'mt-3 min-h-24 w-full resize-y rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-ink outline-none transition focus:border-cobalt focus:bg-white focus:ring-2 focus:ring-blue-100',
              placeholder: 'Explain the bug in plain English. Name the wrong assumption, the failing case, and the fix.',
              value: state.explanation,
              onChange: (event) => updateDebugChallenge(challenge.id, { explanation: event.target.value }),
            }),
          ),
          h(
            'section',
            { className: 'rounded-lg border border-emerald-100 bg-emerald-50 p-4' },
            h('h4', { className: 'text-sm font-bold uppercase tracking-wide text-emerald-800' }, 'Model explanation'),
            h(
              'button',
              {
                className: `mt-3 rounded-lg px-3 py-2 text-sm font-bold text-white transition ${attempted ? 'bg-fern hover:bg-emerald-800' : 'cursor-not-allowed bg-slate-300'}`,
                disabled: !attempted,
                onClick: () => updateDebugChallenge(challenge.id, { modelExplanationViewed: true }),
              },
              state.modelExplanationViewed ? 'Model explanation shown' : 'Show model explanation',
            ),
            !attempted ? h('p', { className: 'mt-2 text-sm leading-6 text-emerald-950' }, 'Run tests, edit code, or write your explanation before revealing the model explanation.') : null,
            state.modelExplanationViewed ? h('p', { className: 'mt-3 text-sm leading-7 text-emerald-950' }, challenge.modelExplanation) : null,
          ),
          h(CompletionChecklist, { items: debugChecklist }),
          h(
            'button',
            {
              className: `inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold text-white shadow-soft transition ${
                complete ? 'bg-fern hover:bg-emerald-800' : debugReady ? 'bg-cobalt hover:bg-blue-800' : 'cursor-not-allowed bg-slate-300'
              }`,
              disabled: !complete && !debugReady,
              onClick: () => {
                if (complete || debugReady) updateDebugChallenge(challenge.id, { status: complete ? 'in-progress' : 'complete' });
              },
            },
            icon(CheckCircle2),
            complete ? 'Completed' : 'Mark complete',
          ),
          complete ? h(ReinforcementPanel, { kind: 'debug', item: challenge }) : null,
        )
      : null,
  );
}

function DebugMode({ debugState, updateDebugChallenge }) {
  const [filters, setFilters] = useState({ category: 'All', status: 'All' });
  const visible = debugChallenges.filter((challenge) => {
    const status = debugState[challenge.id]?.status || 'not-started';
    return (filters.category === 'All' || challenge.category === filters.category) && (filters.status === 'All' || status === filters.status);
  });
  const categories = ['All', ...new Set(debugChallenges.map((challenge) => challenge.category))];
  const completed = debugChallenges.filter((challenge) => debugState[challenge.id]?.status === 'complete').length;

  return h(
    'section',
    { className: 'space-y-4 scroll-mt-6', id: 'debug-mode' },
    h(
      'div',
      { className: 'rounded-lg border border-slate-200 bg-white p-5 shadow-sm' },
      h('p', { className: 'text-sm font-semibold uppercase tracking-wide text-fern' }, 'Debug Mode'),
      h('h2', { className: 'mt-1 text-2xl font-bold' }, 'Debug like an engineer'),
      h('p', { className: 'mt-3 max-w-3xl text-sm leading-7 text-slate-700' }, 'Read the expected behavior, run the broken code, use failing tests as clues, explain the root cause, then fix the code. The point is not guessing. The point is narrowing down evidence.'),
      h('div', { className: 'mt-4' }, h(Pill, { tone: completed === debugChallenges.length ? 'green' : 'blue' }, `${completed}/${debugChallenges.length} debug challenges complete`)),
      h(
        'div',
        { className: 'mt-5 grid gap-3 sm:grid-cols-2' },
        h(FilterSelect, { label: 'Category', value: filters.category, options: categories, onChange: (value) => setFilters((current) => ({ ...current, category: value })) }),
        h(FilterSelect, { label: 'Status', value: filters.status, options: [['All', 'All'], ['not-started', 'Not Started'], ['in-progress', 'In Progress'], ['complete', 'Complete']], onChange: (value) => setFilters((current) => ({ ...current, status: value })) }),
      ),
    ),
    visible.length
      ? h('div', { className: 'space-y-4' }, visible.map((challenge) => h(DebugChallengeCard, { challenge, saved: debugState[challenge.id], updateDebugChallenge, key: challenge.id })))
      : h(EmptyLessonsState, { message: 'No debug challenges match the current filters.' }),
  );
}

function CodeReadingChallengeCard({ challenge, saved, updateCodeReadingChallenge }) {
  const [open, setOpen] = useState(false);
  const state = {
    answer: '',
    explanation: '',
    outputRevealed: false,
    annotationsShown: false,
    predictionResult: '',
    status: 'not-started',
    ...(saved || {}),
  };
  const complete = state.status === 'complete';
  const attempted = Boolean(state.answer.trim());
  const lines = challenge.code.split('\n');
  const explanationReady = hasText(state.explanation);
  const readingChecklist = completionItems([
    ['Write a prediction before revealing output', attempted],
    ['Reveal the output/result', state.outputRevealed],
    ['Explain the snippet in your own words with at least 40 characters', explanationReady],
  ]);
  const readingReady = readingChecklist.every((item) => item.done);

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
        h(
          'div',
          { className: 'mb-2 flex flex-wrap gap-2' },
          h(Pill, { tone: complete ? 'green' : attempted ? 'amber' : 'slate' }, complete ? 'Complete' : attempted ? 'In Progress' : 'Not Started'),
          h(Pill, { tone: 'blue' }, challenge.category),
          h(Pill, { tone: state.predictionResult === 'incorrect' ? 'amber' : 'slate' }, challenge.difficulty),
        ),
        h('h3', { className: 'text-lg font-bold text-ink' }, challenge.title),
        h('p', { className: 'mt-1 text-sm leading-6 text-slate-600' }, challenge.context),
      ),
      icon(open ? ChevronDown : ChevronRight, { className: 'shrink-0 text-slate-500' }),
    ),
    open
      ? h(
          'div',
          { className: 'space-y-4 border-t border-slate-200 px-5 py-5' },
          h(PlanRow, { label: 'Plain-English context' }, challenge.context),
          h(
            'section',
            { className: 'rounded-lg border border-slate-200 bg-slate-950 p-4 text-white' },
            h(
              'div',
              { className: 'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between' },
              h('div', null, h('h4', { className: 'text-sm font-bold uppercase tracking-wide text-slate-300' }, 'Code snippet'), h('p', { className: 'mt-1 text-sm leading-6 text-slate-300' }, 'Read slowly. Track values, branches, loops, and return points.')),
              h(
                'button',
                {
                  className: 'rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm font-bold text-slate-100 transition hover:bg-slate-800',
                  onClick: () => updateCodeReadingChallenge(challenge.id, { annotationsShown: !state.annotationsShown }),
                },
                state.annotationsShown ? 'Hide annotations' : 'Show line annotations',
              ),
            ),
            h(
              'div',
              { className: 'mt-4 overflow-x-auto rounded-lg border border-slate-700 bg-slate-900 font-mono text-sm leading-6' },
              lines.map((line, index) =>
                h(
                  'div',
                  { className: 'grid grid-cols-[3rem_1fr] border-b border-slate-800 last:border-b-0', key: `${challenge.id}-line-${index}` },
                  h('span', { className: 'select-none bg-slate-950 px-3 py-2 text-right text-slate-500' }, index + 1),
                  h(
                    'div',
                    { className: 'px-3 py-2' },
                    h('code', { className: 'whitespace-pre text-emerald-50' }, line || ' '),
                    state.annotationsShown
                      ? h('p', { className: 'mt-1 whitespace-normal font-sans text-xs leading-5 text-blue-200' }, challenge.annotations[index] || 'This line supports the surrounding control flow.')
                      : null,
                  ),
                ),
              ),
            ),
          ),
          h(
            'section',
            { className: 'rounded-lg border border-blue-100 bg-blue-50 p-4' },
            h('h4', { className: 'text-sm font-bold uppercase tracking-wide text-blue-700' }, 'Prediction question'),
            h('p', { className: 'mt-2 text-sm font-semibold leading-6 text-blue-950' }, `${challenge.predictionPrompt} What will this output/do?`),
            h('textarea', {
              className: 'mt-3 min-h-24 w-full resize-y rounded-lg border border-blue-200 bg-white p-3 text-sm leading-6 text-ink outline-none transition focus:border-cobalt focus:ring-2 focus:ring-blue-100',
              placeholder: 'Predict the output or behavior before revealing the result.',
              value: state.answer,
              onChange: (event) => updateCodeReadingChallenge(challenge.id, { answer: event.target.value }),
            }),
            h(
              'button',
              {
                className: `mt-3 rounded-lg px-3 py-2 text-sm font-bold text-white transition ${attempted ? 'bg-cobalt hover:bg-blue-800' : 'cursor-not-allowed bg-slate-300'}`,
                disabled: !attempted,
                onClick: () => updateCodeReadingChallenge(challenge.id, { outputRevealed: true }),
              },
              state.outputRevealed ? 'Result revealed' : 'Reveal output/result',
            ),
          ),
          state.outputRevealed
            ? h(
                'section',
                { className: 'space-y-4 rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-sm leading-7 text-emerald-950' },
                h('div', null, h('h4', { className: 'text-sm font-bold uppercase tracking-wide text-emerald-800' }, 'Output / result'), h('p', { className: 'mt-2 rounded-lg bg-white p-3 font-mono text-emerald-950' }, challenge.output)),
                h('div', null, h('h4', { className: 'text-sm font-bold uppercase tracking-wide text-emerald-800' }, 'Control flow'), h('p', { className: 'mt-2' }, challenge.controlFlow)),
                h('div', null, h('h4', { className: 'text-sm font-bold uppercase tracking-wide text-emerald-800' }, 'Check your prediction'), h('p', { className: 'mt-2' }, challenge.expectedIdea), h(SelfGradeButtons, { value: state.predictionResult, onChange: (predictionResult) => updateCodeReadingChallenge(challenge.id, { predictionResult }) })),
              )
            : null,
          h(
            'section',
            { className: 'rounded-lg border border-slate-200 p-4' },
            h('label', { className: 'text-sm font-bold uppercase tracking-wide text-slate-500' }, 'Explain this in your own words'),
            h('textarea', {
              className: 'mt-3 min-h-24 w-full resize-y rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-ink outline-none transition focus:border-cobalt focus:bg-white focus:ring-2 focus:ring-blue-100',
              placeholder: 'Explain the values, branch, loop, or return path as if teaching someone else.',
              value: state.explanation,
              onChange: (event) => updateCodeReadingChallenge(challenge.id, { explanation: event.target.value }),
            }),
          ),
          h(
            'button',
            {
              className: `inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold text-white shadow-soft transition ${
                complete ? 'bg-fern hover:bg-emerald-800' : readingReady ? 'bg-cobalt hover:bg-blue-800' : 'cursor-not-allowed bg-slate-300'
              }`,
              disabled: !complete && !readingReady,
              onClick: () => {
                if (complete || readingReady) updateCodeReadingChallenge(challenge.id, { status: complete ? 'in-progress' : 'complete' });
              },
            },
            icon(CheckCircle2),
            complete ? 'Completed' : 'Mark complete',
          ),
          h(CompletionChecklist, { items: readingChecklist }),
          complete ? h(ReinforcementPanel, { kind: 'code-reading', item: challenge }) : null,
        )
      : null,
  );
}

function CodeReadingMode({ codeReadingState, updateCodeReadingChallenge }) {
  const [filters, setFilters] = useState({ category: 'All', status: 'All' });
  const categories = ['All', ...new Set(codeReadingChallenges.map((challenge) => challenge.category))];
  const visible = codeReadingChallenges.filter((challenge) => {
    const status = codeReadingState[challenge.id]?.status || 'not-started';
    return (filters.category === 'All' || challenge.category === filters.category) && (filters.status === 'All' || status === filters.status);
  });
  const completed = codeReadingChallenges.filter((challenge) => codeReadingState[challenge.id]?.status === 'complete').length;

  return h(
    'section',
    { className: 'space-y-4 scroll-mt-6', id: 'code-reading' },
    h(
      'div',
      { className: 'rounded-lg border border-slate-200 bg-white p-5 shadow-sm' },
      h('p', { className: 'text-sm font-semibold uppercase tracking-wide text-fern' }, 'Code Reading'),
      h('h2', { className: 'mt-1 text-2xl font-bold' }, 'Read code like an engineer'),
      h('p', { className: 'mt-3 max-w-3xl text-sm leading-7 text-slate-700' }, 'Practice tracing code before running it. Predict the result, reveal the output, study the control flow, then explain the snippet in your own words.'),
      h('div', { className: 'mt-4' }, h(Pill, { tone: completed === codeReadingChallenges.length ? 'green' : 'blue' }, `${completed}/${codeReadingChallenges.length} reading challenges complete`)),
      h(
        'div',
        { className: 'mt-5 grid gap-3 sm:grid-cols-2' },
        h(FilterSelect, { label: 'Category', value: filters.category, options: categories, onChange: (value) => setFilters((current) => ({ ...current, category: value })) }),
        h(FilterSelect, { label: 'Status', value: filters.status, options: [['All', 'All'], ['not-started', 'Not Started'], ['in-progress', 'In Progress'], ['complete', 'Complete']], onChange: (value) => setFilters((current) => ({ ...current, status: value })) }),
      ),
    ),
    visible.length
      ? h('div', { className: 'space-y-4' }, visible.map((challenge) => h(CodeReadingChallengeCard, { challenge, saved: codeReadingState[challenge.id], updateCodeReadingChallenge, key: challenge.id })))
      : h(EmptyLessonsState, { message: 'No code reading challenges match the current filters.' }),
  );
}

function ResourceLinkList({ title, items, getHref, getLabel }) {
  return h(
    'div',
    { className: 'rounded-lg bg-slate-50 p-3' },
    h('p', { className: 'text-xs font-bold uppercase tracking-wide text-slate-500' }, title),
    items?.length
      ? h(
          'div',
          { className: 'mt-2 flex flex-wrap gap-2' },
          items.map((item) =>
            h(
              'a',
              { className: 'rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100', href: getHref(item), key: typeof item === 'string' ? item : item.title },
              getLabel(item),
            ),
          ),
        )
      : h('p', { className: 'mt-2 text-sm text-slate-500' }, 'No linked resources yet.'),
  );
}

function MilestoneVisualization({ visualization }) {
  if (!visualization) return null;

  if (visualization.type === 'graph') {
    const nodes = visualization.nodes || [];
    return h(
      'div',
      { className: 'rounded-lg border border-slate-200 bg-white p-4' },
      h('h5', { className: 'text-sm font-bold uppercase tracking-wide text-slate-500' }, 'Output visualization'),
      h(
        'div',
        { className: 'mt-3 flex flex-wrap items-center gap-2 text-sm' },
        nodes.map((node, index) =>
          h(
            React.Fragment,
            { key: `${node}-${index}` },
            h('span', { className: 'rounded-lg bg-blue-50 px-3 py-2 font-bold text-blue-800' }, node),
            index < nodes.length - 1 ? h('span', { className: 'font-bold text-slate-400' }, '->') : null,
          ),
        ),
      ),
      visualization.edges?.length ? h('p', { className: 'mt-3 text-sm leading-6 text-slate-600' }, `Edges: ${visualization.edges.join(', ')}`) : null,
    );
  }

  if (visualization.type === 'scatter') {
    const points = visualization.points || [];
    const toX = (x) => 210 + x * 75;
    const toY = (y) => 130 - y * 75;
    return h(
      'div',
      { className: 'rounded-lg border border-slate-200 bg-white p-4' },
      h('h5', { className: 'text-sm font-bold uppercase tracking-wide text-slate-500' }, 'Output visualization'),
      h(
        SvgFrame,
        null,
        h('line', { x1: 30, y1: 130, x2: 390, y2: 130, stroke: '#cbd5e1', strokeWidth: 1.5 }),
        h('line', { x1: 210, y1: 30, x2: 210, y2: 230, stroke: '#cbd5e1', strokeWidth: 1.5 }),
        points.map(([label, x, y]) =>
          h(
            'g',
            { key: label },
            h('circle', { cx: toX(x), cy: toY(y), r: 7, fill: '#2156a3' }),
            h('text', { x: toX(x) + 10, y: toY(y) + 4, fill: '#334155', fontSize: 12 }, label),
          ),
        ),
      ),
    );
  }

  if (visualization.type === 'heatmap') {
    return h(
      'div',
      { className: 'rounded-lg border border-slate-200 bg-white p-4' },
      h('h5', { className: 'text-sm font-bold uppercase tracking-wide text-slate-500' }, 'Output visualization'),
      h(
        'div',
        { className: 'mt-3 grid grid-cols-2 gap-2' },
        (visualization.labels || []).map((label, index) => h('div', { className: `rounded-lg p-4 text-center text-sm font-bold ${index === 0 ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-900'}`, key: label }, label)),
      ),
    );
  }

  return h(
    'div',
    { className: 'rounded-lg border border-slate-200 bg-white p-4' },
    h('h5', { className: 'text-sm font-bold uppercase tracking-wide text-slate-500' }, 'Output visualization'),
    h('div', { className: 'mt-3 flex flex-wrap gap-2' }, (visualization.labels || []).map((label) => h('span', { className: 'rounded-lg bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700', key: label }, label))),
  );
}

function MilestoneCard({ milestone, saved, updateKarpathyMilestone }) {
  const [open, setOpen] = useState(false);
  const state = { status: 'not-started', reflection: '', notes: '', code: milestone.starterCode || '', lastResult: null, ...(saved || {}) };
  const complete = state.status === 'complete';
  const passed = state.lastResult?.testResults?.filter((test) => test.passed).length || 0;
  const total = milestone.testCases?.length || 0;
  const allPassed = total > 0 && passed === total;
  const codeEdited = (state.code || '') !== (milestone.starterCode || '');
  const reflectionReady = Boolean(state.reflection?.trim());
  const milestoneChecklist = completionItems([
    ['Edit the starter code', codeEdited],
    ['Make all tests pass', allPassed],
    ['Write the milestone reflection', reflectionReady],
  ]);
  const milestoneReady = milestoneChecklist.every((item) => item.done);

  return h(
    'article',
    { className: 'scroll-mt-24 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm', id: milestone.id },
    h(
      'button',
      {
        className: 'flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition hover:bg-slate-50',
        onClick: () => setOpen((value) => !value),
      },
      h(
        'div',
        null,
        h('div', { className: 'mb-2 flex flex-wrap gap-2' }, h(Pill, { tone: complete ? 'green' : state.status === 'in-progress' ? 'amber' : 'slate' }, statusLabel(state.status)), h(Pill, { tone: 'blue' }, 'Executable project'), h(Pill, { tone: allPassed ? 'green' : 'slate' }, total ? `${passed}/${total} tests` : 'No tests')),
        h('h4', { className: 'font-bold text-ink' }, milestone.title),
        h('p', { className: 'mt-1 text-sm leading-6 text-slate-600' }, milestone.whyItMatters),
      ),
      icon(open ? ChevronDown : ChevronRight, { className: 'shrink-0 text-slate-500' }),
    ),
    open
      ? h(
          'div',
          { className: 'space-y-4 border-t border-slate-200 px-4 py-4' },
          h(PlanRow, { label: 'Concepts required' }, milestone.conceptsRequired.join(', ')),
          h(PlanRow, { label: 'Build steps' }, h(StepList, { items: milestone.buildSteps })),
          h(PlanRow, { label: 'Success criteria' }, h(StepList, { items: milestone.successCriteria })),
          h(PlanRow, { label: 'Stretch goal' }, milestone.stretchGoal),
          milestone.dataset ? h(PlanRow, { label: 'Dataset / project context' }, milestone.dataset) : null,
          milestone.starterCode
            ? h(CodeRunner, {
                challenge: milestone,
                code: state.code || milestone.starterCode,
                title: 'Milestone Coding Environment',
                description: 'Run the scaffold, make one focused improvement, test it, and iterate until the project behavior matches the milestone.',
                codeEdited,
                initialResult: state.lastResult,
                returnPrompt: 'What should this milestone function or scaffold produce?',
                onCodeChange: (code) => updateKarpathyMilestone(milestone.id, { code }),
                onResetCode: () => updateKarpathyMilestone(milestone.id, { code: milestone.starterCode, lastResult: null, status: 'not-started' }),
                onResult: (result) => updateKarpathyMilestone(milestone.id, { lastResult: result, lastRunAt: new Date().toISOString() }),
              })
            : null,
          h(MilestoneVisualization, { visualization: milestone.visualization }),
          milestone.debugScenarios?.length
            ? h(
                'section',
                { className: 'rounded-lg border border-amber-100 bg-amber-50 p-4' },
                h('h5', { className: 'text-sm font-bold uppercase tracking-wide text-amber-800' }, 'Debug scenarios'),
                h('div', { className: 'mt-3 space-y-2' }, milestone.debugScenarios.map((scenario) => h('p', { className: 'rounded-lg bg-white p-3 text-sm leading-6 text-amber-950', key: scenario }, scenario))),
              )
            : null,
          h(
            'section',
            { className: 'rounded-lg border border-slate-200 p-4' },
            h('label', { className: 'text-sm font-bold uppercase tracking-wide text-slate-500' }, 'Milestone notes'),
            h('textarea', {
              className: 'mt-3 min-h-20 w-full resize-y rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-ink outline-none transition focus:border-cobalt focus:bg-white focus:ring-2 focus:ring-blue-100',
              placeholder: 'Track design choices, failed attempts, and what you learned.',
              value: state.notes || '',
              onChange: (event) => updateKarpathyMilestone(milestone.id, { notes: event.target.value }),
            }),
            h('label', { className: 'mt-4 block text-sm font-bold uppercase tracking-wide text-slate-500' }, 'Reflection prompt'),
            h('p', { className: 'mt-2 text-sm leading-6 text-slate-700' }, milestone.reflectionPrompt),
            h('textarea', {
              className: 'mt-3 min-h-20 w-full resize-y rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-ink outline-none transition focus:border-cobalt focus:bg-white focus:ring-2 focus:ring-blue-100',
              placeholder: 'Answer the reflection after you have a working or partially working build.',
              value: state.reflection || '',
              onChange: (event) => updateKarpathyMilestone(milestone.id, { reflection: event.target.value }),
            }),
          ),
          h(CompletionChecklist, { title: 'Before completing this milestone', items: milestoneChecklist }),
          h(
            'button',
            {
              className: `inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold text-white shadow-soft transition ${
                complete ? 'bg-fern hover:bg-emerald-800' : milestoneReady ? 'bg-cobalt hover:bg-blue-800' : 'cursor-not-allowed bg-slate-300'
              }`,
              disabled: !complete && !milestoneReady,
              onClick: () => {
                if (complete || milestoneReady) updateKarpathyMilestone(milestone.id, { status: complete ? 'in-progress' : 'complete' });
              },
            },
            icon(CheckCircle2),
            complete ? 'Completed' : 'Mark milestone complete',
          ),
          complete ? h(ReinforcementPanel, { kind: 'karpathy', item: milestone }) : null,
        )
      : null,
  );
}

function KarpathyPath({ karpathyProgress, updateKarpathyMilestone }) {
  const completed = karpathyMilestones.filter((milestone) => karpathyProgress[milestone.id]?.status === 'complete').length;
  const nextMilestone = nextKarpathyMilestone(karpathyProgress);
  const milestoneById = Object.fromEntries(karpathyMilestones.map((milestone) => [milestone.id, milestone]));

  return h(
    'section',
    { className: 'space-y-4 scroll-mt-6', id: 'karpathy-path' },
    h(
      'div',
      { className: 'rounded-lg border border-slate-200 bg-white p-5 shadow-sm' },
      h('p', { className: 'text-sm font-semibold uppercase tracking-wide text-fern' }, 'Karpathy Path'),
      h('h2', { className: 'mt-1 text-2xl font-bold' }, 'Neural Networks From Scratch'),
      h('p', { className: 'mt-3 max-w-3xl text-sm leading-7 text-slate-700' }, 'A first-principles pathway for building neural networks by hand: math, computational graphs, gradient descent, neural nets, language models, and transformers. Each phase links back into Triad Academy lessons and practice modes.'),
      h('div', { className: 'mt-4 flex flex-wrap gap-2' }, h(Pill, { tone: completed === karpathyMilestones.length ? 'green' : 'blue' }, `${completed}/${karpathyMilestones.length} milestones complete`), nextMilestone ? h(Pill, { tone: 'amber' }, `Next: ${nextMilestone.title}`) : h(Pill, { tone: 'green' }, 'Path complete')),
    ),
    h(
      'div',
      { className: 'space-y-4' },
      karpathyPhases.map((phase, index) => {
        const phaseMilestones = phase.milestoneIds.map((id) => milestoneById[id]).filter(Boolean);
        const phaseCompleted = phaseMilestones.filter((milestone) => karpathyProgress[milestone.id]?.status === 'complete').length;

        return h(
          'article',
          { className: 'rounded-lg border border-slate-200 bg-white p-5 shadow-sm', key: phase.id },
          h('div', { className: 'mb-3 flex flex-wrap items-center gap-2' }, h(Pill, { tone: 'blue' }, `Phase ${index + 1}`), h(Pill, { tone: phaseCompleted === phaseMilestones.length ? 'green' : 'slate' }, `${phaseCompleted}/${phaseMilestones.length} milestones`)),
          h('h3', { className: 'text-xl font-bold text-ink' }, phase.title),
          h('p', { className: 'mt-2 text-sm leading-7 text-slate-700' }, phase.goal),
          h('div', { className: 'mt-4' }, h(PlanRow, { label: 'Prerequisite skills' }, phase.prerequisiteSkills.join(', '))),
          h(
            'div',
            { className: 'mt-4 grid gap-3 lg:grid-cols-2' },
            h(ResourceLinkList, { title: 'Existing lessons', items: phase.lessonIds, getHref: (id) => `#${id}`, getLabel: (id) => id.replace(/^[a-z]+-/, '').replaceAll('-', ' ') }),
            h(ResourceLinkList, { title: 'Labs and playgrounds', items: phase.labs, getHref: (item) => item.href, getLabel: (item) => item.title }),
            h(ResourceLinkList, { title: 'Build challenges', items: phase.buildChallengeIds, getHref: (id) => `#${id}`, getLabel: (id) => id.replace('build-', '').replaceAll('-', ' ') }),
            h(ResourceLinkList, { title: 'Debug challenges', items: phase.debugChallengeIds, getHref: (id) => `#${id}`, getLabel: (id) => id.replace('debug-', '').replaceAll('-', ' ') }),
            h(ResourceLinkList, { title: 'Code reading challenges', items: phase.codeReadingChallengeIds, getHref: (id) => `#${id}`, getLabel: (id) => id.replace('read-', '').replaceAll('-', ' ') }),
          ),
          h('div', { className: 'mt-4 space-y-3' }, phaseMilestones.map((milestone) => h(MilestoneCard, { milestone, saved: karpathyProgress[milestone.id], updateKarpathyMilestone, key: milestone.id }))),
        );
      }),
    ),
  );
}

function ThinkingChallengeCard({ challenge, saved, updateThinking }) {
  const [open, setOpen] = useState(false);
  const state = saved || { attempt: '', revealed: false, reflection: '', complete: false };
  const attempted = Boolean(state.attempt.trim());
  const reflected = Boolean(state.reflection.trim());

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
        h('div', { className: 'mb-2 flex flex-wrap gap-2' }, h(Pill, { tone: state.complete ? 'green' : attempted ? 'amber' : 'slate' }, state.complete ? 'Complete' : attempted ? 'In Progress' : 'Not Started'), h(Pill, { tone: 'blue' }, challenge.type), h(Pill, { tone: 'slate' }, challenge.difficulty)),
        h('h3', { className: 'text-lg font-bold text-ink' }, challenge.title),
      ),
      icon(open ? ChevronDown : ChevronRight, { className: 'shrink-0 text-slate-500' }),
    ),
    open
      ? h(
          'div',
          { className: 'space-y-4 border-t border-slate-200 px-5 py-5' },
          h(PlanRow, { label: 'Problem statement' }, challenge.problem),
          h(
            'section',
            { className: 'rounded-lg border border-slate-200 p-4' },
            h('label', { className: 'text-sm font-bold uppercase tracking-wide text-slate-500' }, 'Your attempt'),
            h('textarea', {
              className: 'mt-3 min-h-28 w-full resize-y rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-ink outline-none transition focus:border-cobalt focus:bg-white focus:ring-2 focus:ring-blue-100',
              placeholder: 'Try the puzzle, explain your pattern, or describe your reasoning before revealing the answer.',
              value: state.attempt,
              onChange: (event) => updateThinking(challenge.id, { attempt: event.target.value }),
            }),
            h(
              'button',
              {
                className: `mt-3 rounded-lg px-3 py-2 text-sm font-bold text-white transition ${attempted ? 'bg-cobalt hover:bg-blue-800' : 'cursor-not-allowed bg-slate-300'}`,
                disabled: !attempted,
                onClick: () => updateThinking(challenge.id, { revealed: true }),
              },
              state.revealed ? 'Solution shown' : 'Reveal solution',
            ),
          ),
          state.revealed
            ? h(
                'section',
                { className: 'space-y-3 rounded-lg border border-emerald-100 bg-emerald-50 p-4 text-sm leading-7 text-emerald-950' },
                h('h4', { className: 'text-sm font-bold uppercase tracking-wide text-emerald-800' }, 'Solution'),
                h('p', null, challenge.solution),
                h('h4', { className: 'text-sm font-bold uppercase tracking-wide text-emerald-800' }, 'Reasoning'),
                h('p', null, challenge.reasoning),
                h('label', { className: 'block text-sm font-bold text-emerald-900' }, 'What did this teach you?'),
                h('textarea', {
                  className: 'min-h-20 w-full resize-y rounded-lg border border-emerald-200 bg-white p-3 text-sm leading-6 text-ink outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100',
                  placeholder: 'Name the clue, assumption, or strategy you will remember.',
                  value: state.reflection,
                  onChange: (event) => updateThinking(challenge.id, { reflection: event.target.value }),
                }),
              )
            : null,
          h(
            'button',
            {
              className: `inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold text-white shadow-soft transition ${
                state.complete ? 'bg-fern hover:bg-emerald-800' : 'bg-cobalt hover:bg-blue-800'
              }`,
              onClick: () => updateThinking(challenge.id, { complete: !state.complete }),
            },
            icon(CheckCircle2),
            state.complete ? 'Completed' : reflected ? 'Mark complete' : 'Mark complete',
          ),
        )
      : null,
  );
}

function ThinkingLab({ thinkingState, updateThinking }) {
  const completed = thinkingChallenges.filter((challenge) => thinkingState[challenge.id]?.complete).length;

  return h(
    'section',
    { className: 'space-y-4 scroll-mt-6', id: 'thinking-lab' },
    h(
      'div',
      { className: 'rounded-lg border border-slate-200 bg-white p-5 shadow-sm' },
      h('p', { className: 'text-sm font-semibold uppercase tracking-wide text-fern' }, 'Thinking Lab'),
      h('h2', { className: 'mt-1 text-2xl font-bold' }, 'Practice logic, creativity, and judgment'),
      h('p', { className: 'mt-3 max-w-3xl text-sm leading-7 text-slate-700' }, 'These challenges make thinking visible: predict, try, reveal, then explain the reasoning. They are small on purpose, but each one trains a useful mental move.'),
      h('div', { className: 'mt-4' }, h(Pill, { tone: completed === thinkingChallenges.length ? 'green' : 'blue' }, `${completed}/${thinkingChallenges.length} complete`)),
    ),
    h('div', { className: 'space-y-4' }, thinkingChallenges.map((challenge) => h(ThinkingChallengeCard, { challenge, saved: thinkingState[challenge.id], updateThinking, key: challenge.id }))),
  );
}

function PilotQuestionSet({ id, title, questions, answers, onChange }) {
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

function PilotTestMode({ pilotState, updatePilot, onStartPilot, onResetPilot, onForceResetAllLocalData, completePilot, lessonQueue, lessonProgress, predictionState, buildState, debugState, solveState }) {
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

function FilterSelect({ label, value, options, onChange }) {
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

function CurriculumProgress({ subjects }) {
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

function CurriculumMap({ architectureProgress, toggleArchitectureLesson, recommendedPathLesson }) {
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

function MobileNav({ subjectProgress, pilotFocus = false, foundationMode = false }) {
  const fullItems = [
    ['Dashboard', '#dashboard'],
    ['Foundation', '#foundation-mode'],
    ['Pilot', '#pilot-test'],
    ['Map', '#curriculum-map'],
    ['Skills', '#skill-graph'],
    ['Karpathy', '#karpathy-path'],
    ...subjectProgress.map((subject) => [subject.title, `#${slug(subject.title)}`]),
    ['Review', '#review'],
    ['Labs', '#labs'],
    ['Data', '#data-model-playground'],
    ['Build', '#build-mode'],
    ['Debug', '#debug-mode'],
    ['Read', '#code-reading'],
    ['Thinking', '#thinking-lab'],
    ['Coach', '#daily-coach'],
  ];
  const items = pilotFocus
    ? [
        ['Dashboard', '#dashboard'],
        ['Pilot', '#pilot-test'],
      ]
    : foundationMode
      ? [
          ['Dashboard', '#dashboard'],
          ['Foundation', '#foundation-mode'],
          ['Math', '#math'],
          ['Labs', '#labs'],
          ['Build', '#build-mode'],
          ['Review', '#review'],
          ['Coach', '#daily-coach'],
        ]
    : fullItems;

  return h(
    'nav',
    { className: 'flex gap-2 overflow-x-auto pb-1 lg:hidden' },
    items.map(([label, href]) =>
      h(
        'a',
        {
          className: 'shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700',
          href,
          key: label,
        },
        label,
      ),
    ),
  );
}

function CurriculumFilters({ filters, setFilters, resultCount, stages }) {
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

function ResetProgressButton({ onReset }) {
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

function ModalShell({ title, body, children, onClose }) {
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

function PilotStartChoiceModal({ onContinue, onRestart, onCancel }) {
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

function ConfirmActionModal({ title, body, confirmLabel, confirmClassName = 'bg-amber-700 hover:bg-amber-800', onConfirm, onCancel }) {
  return h(
    ModalShell,
    { title, body, onClose: onCancel },
    h('button', { className: 'rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50', onClick: onCancel }, 'Cancel'),
    h('button', { className: `rounded-lg px-4 py-2.5 text-sm font-bold text-white shadow-soft transition ${confirmClassName}`, onClick: onConfirm }, confirmLabel),
  );
}

function FoundationModeToggle({ mode, setMode }) {
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

function Dashboard({ completedCount, totalLessons, nextLesson, onReset, onStartPilot, subjectProgress, buildCompleted, totalBuild, nextBuild, debugCompleted, totalDebug, nextDebug, codeReadingCompleted, totalCodeReading, nextCodeReading, karpathyCompleted, totalKarpathy, nextKarpathyMilestone, labCompletion, buildGradeSummary, thinkingCompleted, totalThinking, recommendedPathLesson, weakSkill }) {
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

function ProjectTrackCard({ project, saved, toggleProjectStep, toggleProjectFinal }) {
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

function ProjectTracks({ projectProgress, toggleProjectStep, toggleProjectFinal }) {
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

function App() {
  const progress = useLessonProgress();
  const [lessonProgress, , resetProgress] = progress;
  const [sessions, startSession, completeSession, resetSessions] = useDailySessions();
  const predictionStore = usePredictions();
  const [predictionState, , resetPredictions] = predictionStore;
  const solveStore = useSolveState();
  const [solveState, , resetSolveState] = solveStore;
  const [buildState, updateChallenge, resetBuildState] = useBuildModeState();
  const [debugState, updateDebugChallenge, resetDebugState] = useDebugModeState();
  const [codeReadingState, updateCodeReadingChallenge, resetCodeReadingState] = useCodeReadingState();
  const [karpathyProgress, updateKarpathyMilestone, resetKarpathyProgress] = useKarpathyProgress();
  const [pilotState, updatePilot, startPilot, completePilot, resetPilot, restartPilot] = usePilotTest();
  const [reviewHistory, markReviewed, resetReviewHistory] = useReviewHistory();
  const [thinkingState, updateThinking, resetThinkingState] = useThinkingState();
  const [architectureProgress, toggleArchitectureLesson, resetArchitectureProgress] = useArchitectureProgress();
  const [projectProgress, toggleProjectStep, toggleProjectFinal, resetProjectProgress] = useProjectProgress();
  const [foundationState, setFoundationMode, updateFoundationItem, resetFoundationState] = useFoundationState();
  const chatStore = useAiTutorChats();
  const [, , , resetAiTutorChats] = chatStore;
  const [filters, setFilters] = useState({
    query: '',
    subject: 'All',
    stage: 'All',
    level: 'All',
    status: 'All',
  });
  const [pilotStartChoiceOpen, setPilotStartChoiceOpen] = useState(false);
  const [pilotResetConfirmOpen, setPilotResetConfirmOpen] = useState(false);
  const [forceResetConfirmOpen, setForceResetConfirmOpen] = useState(false);
  const foundationMode = foundationState.mode === 'foundation';
  const lessonQueue = useMemo(
    () =>
      Object.entries(curriculum).flatMap(([subjectKey, subject]) =>
        subject.lessons.map((lesson) => ({
          ...lesson,
          subjectKey,
          subjectTitle: lesson.subject || subject.title,
        })),
      ),
    [],
  );
  const completedCount = lessonQueue.filter((lesson) => lessonProgress[lesson.id]?.complete).length;
  const nextLesson = lessonQueue.find((lesson) => !lessonProgress[lesson.id]?.complete);
  const buildCompleted = buildChallenges.filter((challenge) => buildState[challenge.id]?.status === 'complete').length;
  const nextBuild = buildChallenges.find((challenge) => buildState[challenge.id]?.status !== 'complete');
  const debugCompleted = debugChallenges.filter((challenge) => debugState[challenge.id]?.status === 'complete').length;
  const nextDebug = debugChallenges.find((challenge) => debugState[challenge.id]?.status !== 'complete');
  const codeReadingCompleted = codeReadingChallenges.filter((challenge) => codeReadingState[challenge.id]?.status === 'complete').length;
  const nextCodeReading = codeReadingChallenges.find((challenge) => codeReadingState[challenge.id]?.status !== 'complete');
  const karpathyCompleted = karpathyMilestones.filter((milestone) => karpathyProgress[milestone.id]?.status === 'complete').length;
  const recommendedKarpathyMilestone = nextKarpathyMilestone(karpathyProgress);
  const thinkingCompleted = thinkingChallenges.filter((challenge) => thinkingState[challenge.id]?.complete).length;
  const nextThinking = thinkingChallenges.find((challenge) => !thinkingState[challenge.id]?.complete);
  const nextLanguageLesson = lessonQueue.find((lesson) => lesson.subjectTitle === 'Language & Thinking' && !lessonProgress[lesson.id]?.complete);
  const recommendedPathLesson = useMemo(() => recommendedArchitectureLesson(architectureProgress), [architectureProgress]);
  const skillLevels = useMemo(
    () =>
      evaluateSkillGraph({
        lessonQueue,
        lessonProgress,
        buildState,
        debugState,
        codeReadingState,
        karpathyProgress,
        predictionState,
        solveState,
      }),
    [lessonQueue, lessonProgress, buildState, debugState, codeReadingState, karpathyProgress, predictionState, solveState],
  );
  const weakSkill = useMemo(() => weakestUnlockedSkill(skillLevels), [skillLevels]);
  const adaptiveSkillLesson = useMemo(() => adaptiveLessonForSkill(weakSkill, lessonQueue, lessonProgress), [weakSkill, lessonQueue, lessonProgress]);
  const labCompletion = {
    total: LAB_IDS.length,
    completed: LAB_IDS.filter((id) => predictionState[id]?.locked && predictionState[id]?.reflection?.trim() && (predictionState[id]?.labGrade || predictionState[id]?.result)).length,
  };
  const buildGradeSummary = buildChallenges.reduce(
    (summary, challenge) => {
      const grade = buildState[challenge.id]?.grade;
      if (grade === 'correct') summary.correct += 1;
      else if (grade === 'partially-correct') summary.partial += 1;
      else if (grade === 'incorrect') summary.incorrect += 1;
      else summary.ungraded += 1;
      return summary;
    },
    { correct: 0, partial: 0, incorrect: 0, ungraded: 0 },
  );
  const pilotFocus = Boolean(pilotState.startedAt && !pilotState.completedAt);
  const subjectProgress = useMemo(
    () =>
      Object.entries(curriculum).map(([key, subject]) => ({
        key,
        title: subject.title,
        icon: subject.icon,
        color: subject.color,
        total: subject.lessons.length,
        completed: subject.lessons.filter((lesson) => lessonProgress[lesson.id]?.complete).length,
      })),
    [lessonProgress],
  );
  const filteredLessonIds = useMemo(() => {
    const query = filters.query.trim().toLowerCase();

    return new Set(
      lessonQueue
        .filter((lesson) => {
          const complete = Boolean(lessonProgress[lesson.id]?.complete);
          const haystack = `${lesson.title} ${lesson.level} ${lesson.bigIdea} ${lesson.whyItMatters} ${lesson.mentalModel} ${lesson.guidedExample} ${lesson.bridge}`.toLowerCase();

          return (
            (!query || haystack.includes(query)) &&
            (filters.subject === 'All' || lesson.subjectTitle === filters.subject) &&
            (filters.stage === 'All' || lesson.stage === filters.stage) &&
            (filters.level === 'All' || lesson.level === filters.level) &&
            (filters.status === 'All' || (filters.status === 'Complete' ? complete : !complete))
          );
        })
        .map((lesson) => lesson.id),
    );
  }, [filters, lessonProgress, lessonQueue]);
  const resultCount = filteredLessonIds.size;
  const stages = useMemo(() => [...new Set(lessonQueue.map((lesson) => lesson.stage))], [lessonQueue]);
  const reviewQueue = useMemo(
    () =>
      buildReviewQueue({
        lessonQueue,
        lessonProgress,
        solveState,
        predictionState,
        buildState,
        debugState,
        codeReadingState,
        karpathyProgress,
        foundationState,
        reviewHistory,
      }),
    [lessonQueue, lessonProgress, solveState, predictionState, buildState, debugState, codeReadingState, karpathyProgress, foundationState, reviewHistory],
  );
  const recommendedReview = reviewQueue[0];
  const visibleSubjects = Object.entries(curriculum)
    .map(([key, subject]) => ({
      key,
      subject,
      filteredLessons: subject.lessons.filter((lesson) => filteredLessonIds.has(lesson.id)),
    }))
    .filter(({ subject, filteredLessons }) => (foundationMode ? subject.title === 'Math' : filters.subject === 'All' || subject.title === filters.subject || filteredLessons.length > 0));

  function resetAllProgress() {
    resetProgress();
    resetSessions();
    resetBuildState();
    resetDebugState();
    resetCodeReadingState();
    resetKarpathyProgress();
    resetPilot();
    resetPredictions();
    resetSolveState();
    resetReviewHistory();
    resetThinkingState();
    resetArchitectureProgress();
    resetProjectProgress();
    resetAiTutorChats();
    resetFoundationState();
  }

  function forceResetAllLocalData() {
    resetAllProgress();
    try {
      TRIAD_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
    } catch {
      // Browsers can block storage in private or restricted modes.
    }
    setForceResetConfirmOpen(false);
    window.location.hash = 'dashboard';
  }

  function requestPilotStart() {
    if (hasPilotData(pilotState)) {
      setPilotStartChoiceOpen(true);
    } else {
      startPilot();
    }
  }

  function continuePilot() {
    setPilotStartChoiceOpen(false);
    startPilot();
  }

  function restartPilotFromChoice() {
    setPilotStartChoiceOpen(false);
    restartPilot();
  }

  function confirmPilotReset() {
    resetPilot();
    setPilotResetConfirmOpen(false);
  }

  return h(
    'div',
    { className: 'min-h-screen bg-mist text-ink' },
    h(
      'div',
      { className: 'flex min-h-screen' },
      h(Sidebar, { completedCount, totalLessons: lessonQueue.length, subjectProgress, pilotFocus, foundationMode }),
      h(
        'main',
        { className: 'flex-1' },
        h(
          'header',
          { className: 'border-b border-[#2a2a2a] bg-[#0d0d0d] px-5 py-5 lg:px-10' },
          h(
            'div',
            { className: 'mx-auto flex max-w-7xl flex-col gap-4' },
            h(
              'div',
              { className: 'flex flex-col gap-4 md:flex-row md:items-center md:justify-between' },
              h('div', null, h('p', { className: 'text-sm font-bold uppercase tracking-widest text-[#00ff88]' }, 'Learning engine'), h('h1', { className: 'mt-1 text-3xl font-bold tracking-normal text-[#e0e0e0]' }, 'Triad Academy', h('span', { className: 'terminal-cursor' }, '_'))),
              h(FoundationModeToggle, { mode: foundationState.mode, setMode: setFoundationMode }),
              h('div', { className: 'flex items-center gap-2 border border-[#2a2a2a] bg-[#111111] px-3 py-2 text-sm font-semibold text-[#00ff88]' }, icon(Gauge, { className: 'text-[#00ff88]' }), `${completedCount} / ${lessonQueue.length} complete`),
            ),
            h(MobileNav, { subjectProgress, pilotFocus, foundationMode }),
          ),
        ),
        h(
          'div',
          { className: 'mx-auto space-y-8 px-5 py-7 lg:max-w-5xl lg:px-10' },
          h(Dashboard, { completedCount, totalLessons: lessonQueue.length, nextLesson, onReset: resetAllProgress, onStartPilot: requestPilotStart, subjectProgress, buildCompleted, totalBuild: buildChallenges.length, nextBuild, debugCompleted, totalDebug: debugChallenges.length, nextDebug, codeReadingCompleted, totalCodeReading: codeReadingChallenges.length, nextCodeReading, karpathyCompleted, totalKarpathy: karpathyMilestones.length, nextKarpathyMilestone: recommendedKarpathyMilestone, labCompletion, buildGradeSummary, thinkingCompleted, totalThinking: thinkingChallenges.length, recommendedPathLesson, weakSkill }),
          h(FoundationModePanel, { foundationState, updateFoundationItem }),
          h(PilotTestMode, { pilotState, updatePilot, onStartPilot: requestPilotStart, onResetPilot: () => setPilotResetConfirmOpen(true), onForceResetAllLocalData: () => setForceResetConfirmOpen(true), completePilot, lessonQueue, lessonProgress, predictionState, buildState, debugState, solveState }),
          foundationMode ? null : h(CurriculumMap, { architectureProgress, toggleArchitectureLesson, recommendedPathLesson }),
          foundationMode ? null : h(SkillGraph, { skillLevels, weakSkill, adaptiveLesson: adaptiveSkillLesson }),
          foundationMode ? null : h(KarpathyPath, { karpathyProgress, updateKarpathyMilestone }),
          h(ReviewQueue, { reviewQueue, reviewHistory, markReviewed }),
          h(CurriculumFilters, { filters, setFilters, resultCount, stages }),
          visibleSubjects.length
            ? visibleSubjects.map(({ key, subject, filteredLessons }) => h(SubjectSection, { key, subjectKey: key, subject, progress, filteredLessons, predictionStore, solveStore, chatStore }))
            : h(EmptyLessonsState, { message: 'No lessons match the current filters.' }),
          h(InteractiveLabs, { predictionStore, foundationState }),
          foundationMode ? null : h(DataModelPlayground),
          h(BuildMode, { buildState, updateChallenge, chatStore, foundationState }),
          foundationMode ? null : h(DebugMode, { debugState, updateDebugChallenge }),
          foundationMode ? null : h(CodeReadingMode, { codeReadingState, updateCodeReadingChallenge }),
          foundationMode ? null : h(ThinkingLab, { thinkingState, updateThinking }),
          h(DailyCoach, { lessonQueue, lessonProgress, sessions, startSession, completeSession, recommendedBuild: nextBuild, recommendedDebug: nextDebug, recommendedCodeReading: nextCodeReading, recommendedKarpathyMilestone, reviewItem: recommendedReview, languageLesson: nextLanguageLesson, thinkingChallenge: nextThinking, recommendedPathLesson, weakSkill, adaptiveSkillLesson, solveStore, foundationState }),
          foundationMode ? null : h(ProjectTracks, { projectProgress, toggleProjectStep, toggleProjectFinal }),
        ),
        pilotStartChoiceOpen ? h(PilotStartChoiceModal, { onContinue: continuePilot, onRestart: restartPilotFromChoice, onCancel: () => setPilotStartChoiceOpen(false) }) : null,
        pilotResetConfirmOpen
          ? h(ConfirmActionModal, {
              title: 'Reset Pilot Test',
              body: 'Are you sure you want to reset this pilot test? This clears only triad-academy-pilot-test-v1 and does not clear lessons, builds, labs, or other progress.',
              confirmLabel: 'Reset Pilot Test',
              onConfirm: confirmPilotReset,
              onCancel: () => setPilotResetConfirmOpen(false),
            })
          : null,
        forceResetConfirmOpen
          ? h(ConfirmActionModal, {
              title: 'Force Reset All Local Data',
              body: 'This temporary development tool clears lessons, build mode, debug mode, predictions, review history, pilot data, and related Triad Academy local data. Use only when you intentionally want a clean browser state.',
              confirmLabel: 'Force Reset All Data',
              confirmClassName: 'bg-rose-700 hover:bg-rose-800',
              onConfirm: forceResetAllLocalData,
              onCancel: () => setForceResetConfirmOpen(false),
            })
          : null,
      ),
    ),
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(h(App));
