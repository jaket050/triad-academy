export const projectTracks = [
  {
    id: 'project-function-grapher',
    level: 'Beginner',
    title: 'Function Grapher Mini App',
    goal: 'Build a small tool that calculates y = mx + b for different inputs and explains the result.',
    finalBuild: 'A working function grapher that accepts slope, intercept, and x values, then displays outputs and a short explanation.',
    stages: [
      {
        title: 'Plan the rule',
        tasks: ['Define inputs x, m, and b', 'Write the output formula in words', 'List two example inputs and outputs'],
        codeCheckpoint: 'Create a `lineOutput(x, m, b)` function.',
      },
      {
        title: 'Test the rule',
        tasks: ['Run positive slope cases', 'Run negative slope cases', 'Check intercept-only changes'],
        codeCheckpoint: 'Add at least two console checks for expected y values.',
      },
      {
        title: 'Explain the graph',
        tasks: ['Explain slope in one sentence', 'Explain intercept in one sentence', 'Connect the formula to the Function Visualizer lab'],
        codeCheckpoint: 'Return both the numeric output and an explanation string.',
      },
    ],
  },
  {
    id: 'project-flashcard-reviewer',
    level: 'Beginner',
    title: 'Flashcard Review Tracker',
    goal: 'Build a tiny state manager for saving whether flashcards were answered correctly.',
    finalBuild: 'A flashcard state object that records results and identifies cards that need review.',
    stages: [
      {
        title: 'Design state',
        tasks: ['Choose a card id format', 'Choose result values', 'Explain why state must persist'],
        codeCheckpoint: 'Create an empty `flashcardState` object.',
      },
      {
        title: 'Save results',
        tasks: ['Write a save function', 'Preserve old cards', 'Update one card at a time'],
        codeCheckpoint: 'Implement `saveFlashcardResult(state, cardId, result)`.',
      },
      {
        title: 'Find review cards',
        tasks: ['Filter incorrect cards', 'Return card ids', 'Explain why review matters'],
        codeCheckpoint: 'Create a `cardsToReview(state)` helper.',
      },
    ],
  },
  {
    id: 'project-projectile-dashboard',
    level: 'Intermediate',
    title: 'Projectile Motion Dashboard',
    goal: 'Build a calculation dashboard for projectile range, height, and flight time.',
    finalBuild: 'A projectile calculator that compares two launch settings and explains the tradeoff between height and range.',
    stages: [
      {
        title: 'Break velocity into components',
        tasks: ['Convert angle to radians', 'Calculate horizontal velocity', 'Calculate vertical velocity'],
        codeCheckpoint: 'Create `projectileComponents(speed, angleDegrees)`.',
      },
      {
        title: 'Calculate outcomes',
        tasks: ['Estimate flight time', 'Estimate range', 'Estimate max height'],
        codeCheckpoint: 'Create `projectileStats(speed, angleDegrees)`.',
      },
      {
        title: 'Compare two launches',
        tasks: ['Run two launch angles', 'Identify which range is larger', 'Explain why 45 degrees is special in ideal conditions'],
        codeCheckpoint: 'Create `compareLaunches(a, b)`.',
      },
    ],
  },
  {
    id: 'project-complexity-lab',
    level: 'Intermediate',
    title: 'Algorithm Complexity Report',
    goal: 'Build a small report that compares O(log n), O(n), and O(n^2) as input grows.',
    finalBuild: 'A complexity comparison table with a written recommendation for which algorithm scales best.',
    stages: [
      {
        title: 'Generate growth values',
        tasks: ['Choose input sizes', 'Calculate log, linear, and quadratic values', 'Store each row'],
        codeCheckpoint: 'Create `complexityRows(inputSizes)`.',
      },
      {
        title: 'Compare costs',
        tasks: ['Find the largest cost per row', 'Explain why small n can hide problems', 'Mark when quadratic becomes expensive'],
        codeCheckpoint: 'Create `mostExpensive(row)`.',
      },
      {
        title: 'Write recommendation',
        tasks: ['Choose the best scaling pattern', 'Explain the tradeoff', 'Connect to search algorithms'],
        codeCheckpoint: 'Return a recommendation string from the data.',
      },
    ],
  },
  {
    id: 'project-mini-ai-trainer',
    level: 'AI',
    title: 'Mini AI Training Loop',
    goal: 'Build a simplified training loop that predicts, measures error, and updates one weight.',
    finalBuild: 'A one-weight model that improves over several training examples and reports loss history.',
    stages: [
      {
        title: 'Create prediction function',
        tasks: ['Represent weight as a number', 'Predict output from input', 'Compare prediction to answer'],
        codeCheckpoint: 'Create `predict(weight, input)` and `error(prediction, answer)`.',
      },
      {
        title: 'Update the model',
        tasks: ['Calculate adjustment direction', 'Apply learning rate', 'Return a new weight'],
        codeCheckpoint: 'Implement `trainingStep(weight, input, answer, learningRate)`.',
      },
      {
        title: 'Track learning',
        tasks: ['Loop over examples', 'Save loss values', 'Explain whether learning improved'],
        codeCheckpoint: 'Create `train(weight, examples, learningRate, epochs)`.',
      },
    ],
  },
  {
    id: 'project-ai-study-coach',
    level: 'AI',
    title: 'AI Study Coach Planner',
    goal: 'Design a rule-based study coach that recommends a lesson, review item, and build challenge from learner state.',
    finalBuild: 'A planner function that takes progress data and returns a daily study plan with reasons.',
    stages: [
      {
        title: 'Define learner state',
        tasks: ['List progress inputs', 'List weak-work signals', 'List available next actions'],
        codeCheckpoint: 'Create a sample `learnerState` object.',
      },
      {
        title: 'Choose recommendations',
        tasks: ['Find next incomplete lesson', 'Find highest-priority review item', 'Find incomplete build challenge'],
        codeCheckpoint: 'Create `makeStudyPlan(learnerState)`.',
      },
      {
        title: 'Explain the plan',
        tasks: ['Add reasons for each recommendation', 'Estimate time', 'Add one reflection question'],
        codeCheckpoint: 'Return `{ lesson, review, build, why, estimate }`.',
      },
    ],
  },
];
