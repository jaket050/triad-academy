import { useState, useEffect } from 'react';
import {
  STORAGE_KEY, SESSION_KEY, PREDICTION_KEY, BUILD_KEY, SOLVE_KEY,
  REVIEW_KEY, THINKING_KEY, ARCHITECTURE_KEY, PROJECTS_KEY,
  AI_TUTOR_CHAT_KEY, DEBUG_KEY, CODE_READING_KEY, KARPATHY_KEY,
  PILOT_TEST_KEY, FOUNDATION_KEY,
} from './constants.js';

export const PILOT_PRE_QUESTIONS = [
  'In your own words, what does a function do?',
  'If y = 2x + 1 and x is 3, what do you predict y will be?',
  'What is one thing you do when code does not behave the way you expected?',
];

export const PILOT_POST_QUESTIONS = [
  'After the session, how would you explain a function to a beginner?',
  'What changed in your understanding of predictions, tests, or debugging?',
  'Which activity taught you the most: lesson, lab, or applied task? Why?',
];

export const PILOT_STEPS = [
  { id: 'pre-test', title: 'Pre-test', minutes: 4, href: '#pilot-pre-test', detail: 'Answer baseline questions and set before-confidence.' },
  { id: 'lesson', title: 'Lesson', minutes: 8, href: '#math-inputs-and-outputs', detail: 'Complete the assigned function lesson gate.' },
  { id: 'lab', title: 'Lab', minutes: 6, href: '#labs', detail: 'Use the Function Visualizer prediction cycle.' },
  { id: 'applied-task', title: 'Applied task', minutes: 6, href: '#build-function-rule-builder', detail: 'Complete Function Rule Builder with passing tests.' },
  { id: 'post-test', title: 'Post-test', minutes: 4, href: '#pilot-post-test', detail: 'Answer final questions and after-confidence.' },
  { id: 'feedback', title: 'Feedback', minutes: 2, href: '#pilot-test', detail: 'Record friction and export results.' },
];

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

export function useLessonProgress() {
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

export function todayKey() {
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

export function useDailySessions() {
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

export function usePredictions() {
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

export function useBuildModeState() {
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

export function useDebugModeState() {
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

export function useCodeReadingState() {
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

export function useKarpathyProgress() {
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

export function hasPilotData(pilotState = {}) {
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

export function usePilotTest() {
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

export function useFoundationState() {
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

export function useSolveState() {
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

export function useReviewHistory() {
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

export function useThinkingState() {
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

export function useArchitectureProgress() {
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

export function useProjectProgress() {
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

export function useAiTutorChats() {
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

export function streakFromHistory(history = []) {
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