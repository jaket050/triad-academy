import { debugChallenges } from './debugChallenges.js';
import { codeReadingChallenges } from './codeReadingChallenges.js';
import { karpathyMilestones } from './karpathyPath.js';

export const skillNodes = [
  { id: 'variables', label: 'Variables', category: 'Math / CS', dependsOn: [], x: 70, y: 70, keywords: ['variable', 'unknown', 'state'] },
  { id: 'equations', label: 'Equations', category: 'Math', dependsOn: ['variables'], x: 190, y: 70, keywords: ['equation', 'balance', 'solve'] },
  { id: 'functions', label: 'Functions', category: 'Math / CS', dependsOn: ['variables', 'equations'], x: 320, y: 70, keywords: ['function', 'input', 'output'] },
  { id: 'graphs', label: 'Graphs', category: 'Math', dependsOn: ['functions'], x: 450, y: 70, keywords: ['graph', 'coordinate', 'axis'] },
  { id: 'slope', label: 'Slope', category: 'Math / Physics', dependsOn: ['graphs'], x: 580, y: 70, keywords: ['slope', 'rate', 'linear'] },
  { id: 'derivatives', label: 'Derivatives', category: 'Calculus', dependsOn: ['slope', 'exponents'], x: 710, y: 70, keywords: ['derivative', 'instantaneous', 'gradient', 'chain rule', 'composition'] },

  { id: 'probability', label: 'Probability', category: 'Math / AI', dependsOn: ['fractions'], x: 190, y: 190, keywords: ['probability', 'chance', 'expected'] },
  { id: 'fractions', label: 'Fractions', category: 'Math', dependsOn: ['variables'], x: 70, y: 190, keywords: ['fraction', 'ratio', 'part'] },
  { id: 'exponents', label: 'Exponents', category: 'Math', dependsOn: ['variables'], x: 320, y: 190, keywords: ['exponent', 'power', 'squared', 'cubed', 'root', 'scientific notation', 'growth'] },
  { id: 'logarithms', label: 'Logarithms', category: 'Math / CS', dependsOn: ['exponents', 'functions'], x: 70, y: 310, keywords: ['logarithm', 'log', 'natural log', 'log base', 'bits', 'cross-entropy'] },
  { id: 'vectors', label: 'Vectors', category: 'Math / Physics', dependsOn: ['graphs'], x: 450, y: 190, keywords: ['vector', 'component', 'matrix'] },
  { id: 'motion', label: 'Motion', category: 'Physics', dependsOn: ['slope', 'vectors'], x: 580, y: 190, keywords: ['motion', 'velocity', 'position'] },
  { id: 'forces', label: 'Forces', category: 'Physics', dependsOn: ['motion', 'vectors'], x: 710, y: 190, keywords: ['force', 'mass', 'acceleration'] },
  { id: 'energy', label: 'Energy', category: 'Physics', dependsOn: ['forces'], x: 840, y: 190, keywords: ['energy', 'work', 'momentum'] },
  { id: 'matrices', label: 'Matrices', category: 'Math', dependsOn: ['vectors', 'exponents'], x: 940, y: 190, keywords: ['matrix', 'multiplication', 'transpose', 'linear independence', 'basis', 'symmetric'] },

  { id: 'conditionals', label: 'Conditionals', category: 'CS', dependsOn: ['variables'], x: 190, y: 310, keywords: ['conditional', 'if', 'branch'] },
  { id: 'loops', label: 'Loops', category: 'CS', dependsOn: ['conditionals'], x: 320, y: 310, keywords: ['loop', 'repeat', 'for each'] },
  { id: 'data-structures', label: 'Data Structures', category: 'CS', dependsOn: ['loops'], x: 450, y: 310, keywords: ['array', 'object', 'stack', 'queue', 'graph'] },
  { id: 'algorithms', label: 'Algorithms', category: 'CS', dependsOn: ['data-structures'], x: 580, y: 310, keywords: ['algorithm', 'search', 'sort', 'big-o'] },
  { id: 'debugging', label: 'Debugging', category: 'CS', dependsOn: ['functions', 'conditionals'], x: 710, y: 310, keywords: ['debug', 'test', 'error', 'edge'] },
  { id: 'recursion', label: 'Recursion', category: 'CS', dependsOn: ['functions', 'loops'], x: 940, y: 310, keywords: ['recursion', 'recursive', 'base case', 'call stack', 'factorial', 'fibonacci', 'traversal'] },
  { id: 'ai-training', label: 'AI Training', category: 'AI', dependsOn: ['functions', 'probability', 'derivatives', 'algorithms', 'logarithms', 'matrices'], x: 840, y: 310, keywords: ['ai', 'model', 'loss', 'training', 'backpropagation', 'backprop', 'chain rule'] },

  { id: 'grammar', label: 'Grammar', category: 'Language', dependsOn: [], x: 70, y: 430, keywords: ['noun', 'verb', 'grammar', 'sentence'] },
  { id: 'clarity', label: 'Clarity', category: 'Language', dependsOn: ['grammar'], x: 190, y: 430, keywords: ['clear', 'specific', 'sentence'] },
  { id: 'argument', label: 'Argument', category: 'Thinking', dependsOn: ['clarity'], x: 320, y: 430, keywords: ['argument', 'claim', 'evidence', 'premise'] },
  { id: 'critical-thinking', label: 'Critical Thinking', category: 'Thinking', dependsOn: ['argument', 'probability'], x: 450, y: 430, keywords: ['critical', 'ambiguous', 'counterexample', 'bias'] },
  { id: 'communication', label: 'Communication', category: 'Language / AI', dependsOn: ['clarity', 'argument'], x: 580, y: 430, keywords: ['explain', 'persuasion', 'communication'] },
];

export const labSkillMap = {
  'lab-function-visualizer': ['functions', 'graphs', 'slope'],
  'lab-projectile-motion': ['vectors', 'motion', 'forces'],
  'lab-algorithm-complexity': ['loops', 'algorithms', 'critical-thinking'],
};

export const buildSkillMap = {
  'build-function-rule-builder': ['functions', 'slope'],
  'build-probability-estimator': ['fractions', 'probability'],
  'build-vector-similarity-sketch': ['vectors', 'ai-training'],
  'build-motion-step-simulator': ['motion', 'loops'],
  'build-force-calculator': ['forces', 'equations'],
  'build-energy-tracker': ['energy', 'motion'],
  'build-flashcard-state-manager': ['variables', 'data-structures'],
  'build-search-algorithm': ['loops', 'algorithms'],
  'build-mini-ai-training-loop': ['ai-training', 'functions', 'derivatives'],
};

export const debugSkillMap = Object.fromEntries(debugChallenges.map((challenge) => [challenge.id, challenge.skillIds]));
export const codeReadingSkillMap = Object.fromEntries(codeReadingChallenges.map((challenge) => [challenge.id, challenge.skillIds]));
export const karpathySkillMap = Object.fromEntries(karpathyMilestones.map((milestone) => [milestone.id, milestone.skillIds]));

function clamp(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function lessonSkillIds(lesson) {
  const text = `${lesson.subjectTitle || lesson.subject || ''} ${lesson.stage || ''} ${lesson.title || ''} ${lesson.bigIdea || ''}`.toLowerCase();

  return skillNodes
    .filter((skill) => skill.keywords.some((keyword) => text.includes(keyword)))
    .map((skill) => skill.id)
    .slice(0, 4);
}

function addEvidence(bucket, skillId, points, label) {
  if (!bucket[skillId]) bucket[skillId] = [];
  bucket[skillId].push({ points, label });
}

export function evaluateSkillGraph({ lessonQueue, lessonProgress, buildState, debugState = {}, codeReadingState = {}, karpathyProgress = {}, predictionState, solveState }) {
  const evidence = {};

  lessonQueue.forEach((lesson) => {
    const skillIds = lessonSkillIds(lesson);
    const saved = lessonProgress[lesson.id] || {};

    skillIds.forEach((skillId) => {
      if (saved.complete) addEvidence(evidence, skillId, 18, `${lesson.title} completed`);
      if (typeof saved.quizAnswer === 'number') {
        addEvidence(evidence, skillId, saved.quizAnswer === lesson.quiz.correctIndex ? 30 : 6, `${lesson.title} quiz`);
      }
      if (saved.explanation?.trim()) addEvidence(evidence, skillId, 12, `${lesson.title} explained`);
    });
  });

  Object.entries(solveState).forEach(([itemId, state]) => {
    if (!state.attempt?.trim()) return;
    const lesson = lessonQueue.find((candidate) => itemId.includes(candidate.id));
    if (!lesson) return;

    lessonSkillIds(lesson).forEach((skillId) => {
      addEvidence(evidence, skillId, state.reflection?.trim() ? 10 : 4, `${lesson.title} solve-before-reveal`);
    });
  });

  Object.entries(buildSkillMap).forEach(([challengeId, skillIds]) => {
    const saved = buildState[challengeId] || {};
    skillIds.forEach((skillId) => {
      if (saved.status === 'complete') addEvidence(evidence, skillId, 24, `${challengeId} complete`);
      if (saved.grade === 'correct') addEvidence(evidence, skillId, 25, `${challengeId} correct`);
      else if (saved.grade === 'partially-correct') addEvidence(evidence, skillId, 12, `${challengeId} partial`);
      else if (saved.grade === 'incorrect') addEvidence(evidence, skillId, 3, `${challengeId} incorrect`);
      if (saved.code?.trim()) addEvidence(evidence, skillId, 8, `${challengeId} code attempt`);
    });
  });

  Object.entries(debugSkillMap).forEach(([challengeId, skillIds]) => {
    const saved = debugState[challengeId] || {};
    const challenge = debugChallenges.find((item) => item.id === challengeId);
    const passed = saved.lastResult?.testResults?.filter((test) => test.passed).length || 0;
    const total = challenge?.testCases?.length || 0;

    skillIds.forEach((skillId) => {
      if (saved.code?.trim()) addEvidence(evidence, skillId, 6, `${challengeId} debug attempt`);
      if (total && passed) addEvidence(evidence, skillId, Math.round((passed / total) * 18), `${challengeId} tests passing`);
      if (saved.explanation?.trim()) addEvidence(evidence, skillId, 10, `${challengeId} bug explained`);
      if (saved.status === 'complete') addEvidence(evidence, skillId, 24, `${challengeId} fixed`);
    });
  });

  Object.entries(codeReadingSkillMap).forEach(([challengeId, skillIds]) => {
    const saved = codeReadingState[challengeId] || {};

    skillIds.forEach((skillId) => {
      if (saved.answer?.trim()) addEvidence(evidence, skillId, 6, `${challengeId} code reading prediction`);
      if (saved.outputRevealed) addEvidence(evidence, skillId, 6, `${challengeId} output revealed`);
      if (saved.predictionResult === 'correct') addEvidence(evidence, skillId, 22, `${challengeId} prediction correct`);
      else if (saved.predictionResult === 'partially-correct') addEvidence(evidence, skillId, 12, `${challengeId} prediction partial`);
      else if (saved.predictionResult === 'incorrect') addEvidence(evidence, skillId, 3, `${challengeId} prediction incorrect`);
      if (saved.explanation?.trim()) addEvidence(evidence, skillId, 12, `${challengeId} control flow explained`);
      if (saved.status === 'complete') addEvidence(evidence, skillId, 20, `${challengeId} reading complete`);
    });
  });

  Object.entries(karpathySkillMap).forEach(([milestoneId, skillIds]) => {
    const saved = karpathyProgress[milestoneId] || {};
    const milestone = karpathyMilestones.find((item) => item.id === milestoneId);
    const passed = saved.lastResult?.testResults?.filter((test) => test.passed).length || 0;
    const total = milestone?.testCases?.length || 0;

    skillIds.forEach((skillId) => {
      if (saved.code?.trim()) addEvidence(evidence, skillId, 8, `${milestoneId} executable scaffold`);
      if (total && passed) addEvidence(evidence, skillId, Math.round((passed / total) * 22), `${milestoneId} project tests`);
      if (saved.notes?.trim()) addEvidence(evidence, skillId, 8, `${milestoneId} build notes`);
      if (saved.reflection?.trim()) addEvidence(evidence, skillId, 14, `${milestoneId} reflection`);
      if (saved.status === 'complete') addEvidence(evidence, skillId, 30, `${milestoneId} milestone complete`);
    });
  });

  Object.entries(labSkillMap).forEach(([labId, skillIds]) => {
    const saved = predictionState[labId] || {};
    skillIds.forEach((skillId) => {
      if (saved.locked) addEvidence(evidence, skillId, 6, `${labId} prediction`);
      if (saved.reflection?.trim()) addEvidence(evidence, skillId, 10, `${labId} reflection`);
      if (saved.labGrade === 'correct') addEvidence(evidence, skillId, 24, `${labId} correct`);
      else if (saved.labGrade === 'partially-correct') addEvidence(evidence, skillId, 12, `${labId} partial`);
      else if (saved.labGrade === 'incorrect') addEvidence(evidence, skillId, 2, `${labId} incorrect`);
    });
  });

  const byId = Object.fromEntries(skillNodes.map((skill) => [skill.id, skill]));

  return skillNodes.map((skill) => {
    const items = evidence[skill.id] || [];
    const rawScore = items.reduce((total, item) => total + item.points, 0);
    const prerequisiteScores = skill.dependsOn.map((id) => clamp((evidence[id] || []).reduce((sum, item) => sum + item.points, 0)));
    const score = clamp(rawScore);
    const unlocked = skill.dependsOn.every((id, index) => prerequisiteScores[index] >= 35 || (evidence[id] || []).length > 0);

    return {
      ...skill,
      dependsOnLabels: skill.dependsOn.map((id) => byId[id]?.label || id),
      score,
      evidenceCount: items.length,
      evidence: items.slice(-4),
      weak: unlocked && score < 55,
      developing: unlocked && score >= 55 && score < 80,
      strong: score >= 80,
      unlocked,
    };
  });
}

export function weakestUnlockedSkill(skillLevels) {
  return [...skillLevels]
    .filter((skill) => skill.unlocked)
    .sort((a, b) => a.score - b.score || b.dependsOn.length - a.dependsOn.length)[0];
}

export function adaptiveLessonForSkill(skill, lessonQueue, lessonProgress) {
  if (!skill) return null;

  return (
    lessonQueue.find((lesson) => !lessonProgress[lesson.id]?.complete && lessonSkillIds(lesson).includes(skill.id)) ||
    lessonQueue.find((lesson) => lessonSkillIds(lesson).includes(skill.id)) ||
    null
  );
}
