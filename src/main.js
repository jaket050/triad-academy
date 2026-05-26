import React, { useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Atom, Calculator, Code2, Gauge, PenLine } from 'lucide-react';
import { deepLessons } from './curriculum.js';
import { buildChallenges } from './buildChallenges.js';
import { debugChallenges } from './debugChallenges.js';
import { codeReadingChallenges } from './codeReadingChallenges.js';
import { karpathyMilestones, nextKarpathyMilestone } from './karpathyPath.js';
import { thinkingChallenges } from './thinkingChallenges.js';
import { recommendedArchitectureLesson } from './curriculumArchitecture.js';
import { adaptiveLessonForSkill, evaluateSkillGraph, weakestUnlockedSkill } from './skillGraph.js';
import './styles.css';
import { TRIAD_STORAGE_KEYS, LAB_IDS } from './constants.js';
import { hasPilotData, useLessonProgress, useDailySessions, usePredictions, useBuildModeState, useDebugModeState, useCodeReadingState, useKarpathyProgress, usePilotTest, useFoundationState, useSolveState, useReviewHistory, useThinkingState, useArchitectureProgress, useProjectProgress, useAiTutorChats } from './hooks.js';
import { icon, PilotStartChoiceModal, ConfirmActionModal } from './components/shared.js';
import { Sidebar, MobileNav } from './components/Sidebar.js';
import { EmptyLessonsState, SubjectSection } from './components/LessonCard.js';
import { InteractiveLabs, DataModelPlayground } from './components/Labs.js';
import { BuildMode } from './components/BuildMode.js';
import { DebugMode } from './components/DebugMode.js';
import { CodeReadingMode } from './components/CodeReadingMode.js';
import { KarpathyPath } from './components/KarpathyPathView.js';
import { ThinkingLab } from './components/ThinkingLab.js';
import { PilotTestMode } from './components/PilotTestMode.js';
import { CurriculumMap, CurriculumFilters } from './components/CurriculumMap.js';
import { Dashboard } from './components/Dashboard.js';
import { ProjectTracks } from './components/ProjectTracks.js';
import { ReviewQueue, buildReviewQueue } from './components/ReviewQueue.js';
import { SkillGraph } from './components/SkillGraphView.js';
import { FoundationModePanel, FoundationModeToggle } from './components/FoundationMode.js';
import { DailyCoach } from './components/DailyCoach.js';

const h = React.createElement;



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
