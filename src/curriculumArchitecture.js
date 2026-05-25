const subjectBlueprints = [
  {
    id: 'math',
    title: 'Math',
    skillCategory: 'quantitative reasoning',
    stages: [
      ['number-sense', 'Number Sense and Arithmetic', ['Place value systems', 'Fractions and ratios', 'Decimals and precision', 'Signed quantities', 'Estimation', 'Exponents and powers']],
      ['algebra', 'Algebraic Reasoning', ['Variables and expressions', 'Equation balance', 'Inequalities and constraints', 'Systems of equations', 'Symbolic modeling']],
      ['functions', 'Functions and Graphs', ['Input-output rules', 'Coordinate graphs', 'Linear models', 'Nonlinear patterns', 'Graph interpretation', 'Logarithms']],
      ['geometry', 'Geometry and Trigonometry', ['Angles and shapes', 'Similarity and scale', 'Triangle tools', 'Trigonometric components', 'Coordinate geometry']],
      ['calculus', 'Calculus Foundations', ['Limits', 'Instantaneous rate', 'Derivative rules', 'Composition and chain rule', 'Accumulation', 'Sensitivity']],
      ['probability', 'Probability and Statistics', ['Chance models', 'Expected value', 'Data summaries', 'Variation and spread', 'Correlation and causation']],
      ['linear-algebra', 'Linear Algebra', ['Vectors', 'Vector operations', 'Dot products', 'Matrices', 'Matrix multiplication', 'Transpose and independence', 'Linear systems']],
      ['optimization', 'Optimization and AI Math', ['Error and loss', 'Gradients', 'Learning rates', 'Normalization', 'Generalization']],
    ],
  },
  {
    id: 'physics',
    title: 'Physics',
    skillCategory: 'physical modeling',
    stages: [
      ['measurement', 'Measurement and Scientific Thinking', ['Units and dimensions', 'Precision', 'Estimation', 'Variables in experiments', 'Uncertainty']],
      ['motion', 'Motion and Kinematics', ['Reference frames', 'Average velocity', 'Acceleration', 'Free fall', 'Projectile components']],
      ['forces', 'Forces and Newtonian Mechanics', ['Inertia', 'Net force', 'Newton second law', 'Friction', 'Support forces']],
      ['energy', 'Energy and Momentum', ['Work', 'Kinetic energy', 'Potential energy', 'Energy conservation', 'Momentum conservation']],
      ['waves', 'Waves and Oscillations', ['Oscillation', 'Frequency and period', 'Amplitude', 'Resonance', 'Interference']],
      ['electricity', 'Electricity and Circuits', ['Charge', 'Voltage', 'Current', 'Resistance', 'Circuit paths']],
      ['systems', 'Systems, Constraints, and Modeling', ['Free-body diagrams', 'Degrees of freedom', 'Equilibrium', 'Feedback loops', 'Model assumptions']],
      ['computation', 'Physics to Computation Bridges', ['Numerical simulation', 'Sensors and data', 'Control systems', 'Digital twins', 'Physics-informed AI']],
    ],
  },
  {
    id: 'cs',
    title: 'Computer Science',
    skillCategory: 'computational thinking',
    stages: [
      ['thinking', 'Computational Thinking', ['Decomposition', 'Abstraction', 'Algorithms as recipes', 'State and change', 'Inputs and outputs']],
      ['programming', 'Programming Fundamentals', ['Variables', 'Data types', 'Conditionals', 'Loops', 'Functions', 'Recursion']],
      ['structures', 'Data Structures', ['Arrays', 'Objects and records', 'Stacks', 'Queues', 'Graphs']],
      ['algorithms', 'Algorithms and Big-O', ['Linear search', 'Binary search', 'Sorting', 'Growth rates', 'Tradeoffs']],
      ['debugging', 'Debugging and Testing', ['Error messages', 'Reproducing bugs', 'Unit tests', 'Edge cases', 'Refactoring']],
      ['systems', 'Systems and Architecture', ['Memory and storage', 'CPU instructions', 'Operating systems', 'Networks', 'Security basics']],
      ['data-ai', 'Data and AI Foundations', ['Tables and datasets', 'Features and labels', 'Training and validation', 'Loss functions', 'Data quality']],
      ['software', 'Building Real Software', ['User stories', 'Stateful interfaces', 'Persistence', 'APIs and boundaries', 'Shipping and iteration']],
    ],
  },
  {
    id: 'language',
    title: 'Language & Thinking',
    skillCategory: 'communication and reasoning',
    stages: [
      ['grammar', 'Grammar Foundations', ['Nouns', 'Verbs', 'Modifiers', 'Sentence structure', 'Punctuation']],
      ['clarity', 'Clear Sentences', ['Actors and actions', 'Specific nouns', 'Strong verbs', 'Removing clutter', 'Revision passes']],
      ['paragraphs', 'Paragraph Logic', ['Topic sentences', 'Evidence', 'Explanation', 'Transitions', 'Paragraph revision']],
      ['ambiguity', 'Precision and Ambiguity', ['Pronoun clarity', 'Scope', 'Definitions', 'Operational language', 'Edge cases in wording']],
      ['arguments', 'Argument Structure', ['Claims', 'Premises', 'Evidence quality', 'Counterexamples', 'Conclusions']],
      ['persuasion', 'Persuasion and Rhetoric', ['Audience', 'Framing', 'Ethos and trust', 'Fair uncertainty', 'Call to action']],
      ['explanation', 'Explaining Complex Ideas', ['Analogy', 'Layered explanation', 'Examples', 'Compression', 'Teaching checks']],
      ['critical-reading', 'Critical Reading', ['Source evaluation', 'Graph reading', 'Assumption checks', 'Bias detection', 'AI output review']],
    ],
  },
  {
    id: 'neural-ai',
    title: 'Neural Networks & AI',
    skillCategory: 'machine learning systems',
    stages: [
      ['ai-orientation', 'AI Orientation', ['Models as functions', 'Prediction tasks', 'Data examples', 'Evaluation', 'Human oversight']],
      ['perceptrons', 'Neurons and Perceptrons', ['Weighted sums', 'Activation', 'Decision boundaries', 'Feature scaling', 'Simple classifiers']],
      ['networks', 'Network Architecture', ['Layers', 'Parameters', 'Forward pass', 'Nonlinearity', 'Representations']],
      ['training', 'Training Loops', ['Loss', 'Backprop intuition', 'Gradient descent', 'Batching', 'Validation']],
      ['data', 'Data Pipelines', ['Collection', 'Cleaning', 'Splits', 'Labels', 'Augmentation']],
      ['evaluation', 'Evaluation and Safety', ['Accuracy limits', 'Confusion matrices', 'Calibration', 'Bias checks', 'Failure modes']],
      ['applications', 'AI Applications', ['Text models', 'Vision models', 'Recommendation', 'Agents', 'Robotics']],
      ['deployment', 'AI Product Deployment', ['APIs', 'Monitoring', 'Latency', 'Cost control', 'Responsible iteration']],
    ],
  },
];

const lessonTypes = ['concept', 'worked example', 'application'];
const buildRefs = [
  'build-function-rule-builder',
  'build-probability-estimator',
  'build-vector-similarity-sketch',
  'build-motion-step-simulator',
  'build-force-calculator',
  'build-energy-tracker',
  'build-flashcard-state-manager',
  'build-search-algorithm',
  'build-mini-ai-training-loop',
];

function slug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function connectedLabs(subjectId, moduleTitle) {
  const text = `${subjectId} ${moduleTitle}`.toLowerCase();

  if (text.includes('motion') || text.includes('force') || text.includes('physics') || text.includes('trig')) {
    return ['lab-projectile-motion'];
  }

  if (text.includes('algorithm') || text.includes('network') || text.includes('ai') || text.includes('data') || text.includes('search')) {
    return ['lab-algorithm-complexity'];
  }

  return ['lab-function-visualizer'];
}

function buildLesson(subject, stage, moduleTitle, stageIndex, moduleIndex, lessonIndex, previousLessonId, order) {
  const lessonType = lessonTypes[lessonIndex];
  const id = `${subject.id}-${stage[0]}-${slug(moduleTitle)}-${lessonIndex + 1}`;
  const moduleSlug = `${subject.id}-${stage[0]}-${slug(moduleTitle)}`;
  const priority = lessonIndex === 0 ? 'high' : lessonIndex === 1 ? 'medium' : 'spiral';
  const buildIndex = (stageIndex + moduleIndex + lessonIndex) % buildRefs.length;

  return {
    id,
    title: `${moduleTitle}: ${lessonType}`,
    subjectId: subject.id,
    subject: subject.title,
    stageId: `${subject.id}-${stage[0]}`,
    moduleId: moduleSlug,
    order,
    progressionOrder: order,
    prerequisites: previousLessonId ? [previousLessonId] : [],
    dependencyChain: previousLessonId ? [previousLessonId, id] : [id],
    connectedLabs: connectedLabs(subject.id, moduleTitle),
    connectedBuildChallenges: [buildRefs[buildIndex]],
    reviewPriority: priority,
    skillCategory: subject.skillCategory,
    exercises: [
      {
        id: `${id}-predict`,
        type: 'prediction',
        prompt: `Predict how ${moduleTitle.toLowerCase()} changes the way you solve a problem.`,
      },
      {
        id: `${id}-apply`,
        type: 'application',
        prompt: `Apply ${moduleTitle.toLowerCase()} to one math, physics, CS, language, or AI example.`,
      },
    ],
    buildChallenges: [buildRefs[buildIndex]],
    reviewItems: [
      {
        id: `${id}-review`,
        reason: `Review ${moduleTitle.toLowerCase()} because it supports later ${subject.title} modules.`,
        priority,
      },
    ],
    contentStatus: 'metadata-only',
  };
}

// Interleaved stage sequence: CS Fundamentals (thinking + programming) appear
// after Math Calculus so students have loops, functions, and recursion before
// Physics Bridges (Numerical Simulation, Control Systems, Digital Twins).
// Remaining Math and CS stages follow Physics in the original relative order.
const sequenceOrder = [
  { s: 'math',      t: 'number-sense'     },
  { s: 'math',      t: 'algebra'          },
  { s: 'math',      t: 'functions'        },
  { s: 'math',      t: 'geometry'         },
  { s: 'math',      t: 'calculus'         },
  { s: 'cs',        t: 'thinking'         },
  { s: 'cs',        t: 'programming'      },
  { s: 'physics',   t: 'measurement'      },
  { s: 'physics',   t: 'motion'           },
  { s: 'physics',   t: 'forces'           },
  { s: 'physics',   t: 'energy'           },
  { s: 'physics',   t: 'waves'            },
  { s: 'physics',   t: 'electricity'      },
  { s: 'physics',   t: 'systems'          },
  { s: 'physics',   t: 'computation'      },
  { s: 'math',      t: 'probability'      },
  { s: 'math',      t: 'linear-algebra'   },
  { s: 'math',      t: 'optimization'     },
  { s: 'cs',        t: 'structures'       },
  { s: 'cs',        t: 'algorithms'       },
  { s: 'cs',        t: 'debugging'        },
  { s: 'cs',        t: 'systems'          },
  { s: 'cs',        t: 'data-ai'          },
  { s: 'cs',        t: 'software'         },
  { s: 'language',  t: 'grammar'          },
  { s: 'language',  t: 'clarity'          },
  { s: 'language',  t: 'paragraphs'       },
  { s: 'language',  t: 'ambiguity'        },
  { s: 'language',  t: 'arguments'        },
  { s: 'language',  t: 'persuasion'       },
  { s: 'language',  t: 'explanation'      },
  { s: 'language',  t: 'critical-reading' },
  { s: 'neural-ai', t: 'ai-orientation'   },
  { s: 'neural-ai', t: 'perceptrons'      },
  { s: 'neural-ai', t: 'networks'         },
  { s: 'neural-ai', t: 'training'         },
  { s: 'neural-ai', t: 'data'             },
  { s: 'neural-ai', t: 'evaluation'       },
  { s: 'neural-ai', t: 'applications'     },
  { s: 'neural-ai', t: 'deployment'       },
];

function buildArchitecture() {
  let order = 1;
  let previousLessonId = null;

  const blueprintMap = Object.fromEntries(subjectBlueprints.map((bp) => [bp.id, bp]));
  const builtStageMap = {};

  // Process stages in curriculum sequence order so global lesson order numbers
  // and prerequisite chains follow the interleaved progression.
  for (const { s: subjectId, t: stageId } of sequenceOrder) {
    const subject = blueprintMap[subjectId];
    const stageIndex = subject.stages.findIndex((st) => st[0] === stageId);
    const stage = subject.stages[stageIndex];

    const modules = stage[2].map((moduleTitle, moduleIndex) => {
      const lessons = lessonTypes.map((_, lessonIndex) => {
        const lesson = buildLesson(subject, stage, moduleTitle, stageIndex, moduleIndex, lessonIndex, previousLessonId, order);
        previousLessonId = lesson.id;
        order += 1;
        return lesson;
      });

      return {
        id: lessons[0].moduleId,
        title: moduleTitle,
        order: moduleIndex + 1,
        lessons,
        exercises: lessons.flatMap((lesson) => lesson.exercises),
        buildChallenges: [...new Set(lessons.flatMap((lesson) => lesson.buildChallenges))],
        reviewItems: lessons.flatMap((lesson) => lesson.reviewItems),
      };
    });

    builtStageMap[`${subjectId}:${stageId}`] = {
      id: `${subjectId}-${stageId}`,
      title: stage[1],
      order: stageIndex + 1,
      modules,
      prerequisites: stageIndex > 0 ? [`${subjectId}-${subject.stages[stageIndex - 1][0]}`] : [],
    };
  }

  // Reconstruct the per-subject grouping used by the Curriculum Map display.
  return subjectBlueprints.map((subject) => ({
    id: subject.id,
    title: subject.title,
    skillCategory: subject.skillCategory,
    stages: subject.stages.map((stage) => builtStageMap[`${subject.id}:${stage[0]}`]).filter(Boolean),
    order: subjectBlueprints.findIndex((item) => item.id === subject.id) + 1,
  }));
}

export const curriculumArchitecture = buildArchitecture();

export const architectureLessons = (() => {
  const subjectMap = Object.fromEntries(curriculumArchitecture.map((s) => [s.id, s]));
  return sequenceOrder.flatMap(({ s: subjectId, t: stageId }) => {
    const subject = subjectMap[subjectId];
    const stage = subject?.stages.find((st) => st.id === `${subjectId}-${stageId}`);
    return stage
      ? stage.modules.flatMap((module) =>
          module.lessons.map((lesson) => ({
            ...lesson,
            subjectTitle: subject.title,
            stageTitle: stage.title,
            moduleTitle: module.title,
          })),
        )
      : [];
  });
})();

export const architectureStats = {
  subjects: curriculumArchitecture.length,
  stages: curriculumArchitecture.reduce((total, subject) => total + subject.stages.length, 0),
  modules: curriculumArchitecture.reduce((total, subject) => total + subject.stages.reduce((stageTotal, stage) => stageTotal + stage.modules.length, 0), 0),
  lessons: architectureLessons.length,
};

export function isArchitectureLessonUnlocked(lesson, completed = {}) {
  return lesson.prerequisites.every((id) => completed[id]);
}

export function recommendedArchitectureLesson(completed = {}) {
  return architectureLessons.find((lesson) => !completed[lesson.id] && isArchitectureLessonUnlocked(lesson, completed)) || architectureLessons.find((lesson) => !completed[lesson.id]) || architectureLessons[0];
}
