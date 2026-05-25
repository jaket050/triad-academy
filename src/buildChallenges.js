export const buildChallenges = [
  {
    id: 'build-function-rule-builder',
    subject: 'Math',
    difficulty: 'Beginner',
    concept: 'y = mx + b',
    goal: 'Write pseudocode that takes x, m, and b and returns y.',
    starterPrompt: 'Design a tiny function called lineOutput. It should receive x, slope m, and intercept b, then calculate the output y.',
    hint: 'Multiply x by m, then add b.',
    checklist: ['Names the inputs x, m, and b', 'Multiplies m by x before adding b', 'Returns or displays the final y value'],
    expectedAnswer: 'function lineOutput(x, m, b): y = m * x + b; return y',
    starterCode: `function lineOutput(x, m, b) {
  // Return y for the rule y = mx + b.
  return 0;
}`,
    testCases: [
      { name: 'positive slope', expression: 'lineOutput(3, 2, 1)', expected: 7 },
      { name: 'negative slope', expression: 'lineOutput(4, -1, 10)', expected: 6 },
    ],
    keyConcepts: [
      { label: 'input x', keywords: ['x', 'input'] },
      { label: 'multiply by slope/m', keywords: ['multiply', '*', 'm', 'slope'] },
      { label: 'add intercept/b', keywords: ['add', '+', 'b', 'intercept'] },
      { label: 'return y/output', keywords: ['return', 'output', 'y'] },
    ],
  },
  {
    id: 'build-probability-estimator',
    subject: 'Math',
    difficulty: 'Beginner',
    concept: 'Probability as part / whole',
    goal: 'Write pseudocode that estimates event probability from total trials and successful outcomes.',
    starterPrompt: 'Create a procedure that receives totalTrials and successes, checks that totalTrials is not zero, and returns an estimated probability.',
    hint: 'Successful outcomes divided by total trials.',
    checklist: ['Uses successes and totalTrials', 'Handles totalTrials of zero safely', 'Returns a probability between 0 and 1'],
    expectedAnswer: 'if totalTrials is 0, stop with an error; probability = successes / totalTrials; return probability',
    starterCode: `function estimateProbability(successes, totalTrials) {
  // Return successes divided by totalTrials.
  // If totalTrials is 0, return 0.
  return 0;
}`,
    testCases: [
      { name: 'half probability', expression: 'estimateProbability(5, 10)', expected: 0.5 },
      { name: 'zero trials guard', expression: 'estimateProbability(3, 0)', expected: 0 },
    ],
    keyConcepts: [
      { label: 'successful outcomes', keywords: ['success', 'successful', 'outcomes'] },
      { label: 'total trials', keywords: ['total', 'trials'] },
      { label: 'divide successes by total', keywords: ['divide', '/', 'successes / total', 'success / total'] },
      { label: 'return probability', keywords: ['return', 'probability'] },
    ],
  },
  {
    id: 'build-vector-similarity-sketch',
    subject: 'Math',
    difficulty: 'Advanced',
    concept: 'Vectors and comparison',
    goal: 'Explain how you would compare two users based on feature lists.',
    starterPrompt: 'Imagine each user is represented by a list of numbers: study time, completed labs, quiz accuracy, and streak. Describe how to compare matching features.',
    hint: 'Compare matching features and measure closeness.',
    checklist: ['Treats each user as a vector of matching features', 'Compares corresponding features', 'Explains what a smaller or larger difference means'],
    expectedAnswer: 'Represent each user as a vector of matching features. Compare each matching feature, combine the differences or similarities, and treat smaller distance or higher similarity as more alike.',
    starterCode: `function vectorDistance(a, b) {
  // Compare matching features and return total absolute distance.
  return 0;
}`,
    testCases: [
      { name: 'same vector', expression: 'vectorDistance([1, 2, 3], [1, 2, 3])', expected: 0 },
      { name: 'feature distance', expression: 'vectorDistance([1, 4, 2], [3, 1, 2])', expected: 5 },
    ],
    keyConcepts: [
      { label: 'feature lists/vectors', keywords: ['feature', 'features', 'vector', 'list'] },
      { label: 'compare matching features', keywords: ['compare', 'matching', 'same feature'] },
      { label: 'measure closeness', keywords: ['close', 'closeness', 'distance', 'similar'] },
      { label: 'combine scores', keywords: ['sum', 'average', 'combine', 'score'] },
    ],
  },
  {
    id: 'build-motion-step-simulator',
    subject: 'Physics',
    difficulty: 'Beginner',
    concept: 'Position update',
    goal: 'Write pseudocode that updates position using velocity and time.',
    starterPrompt: 'Build one simulation step. It should take oldPosition, velocity, and deltaTime, then calculate the next position.',
    hint: 'new position = old position + velocity x time.',
    checklist: ['Uses old position, velocity, and time step', 'Calculates displacement from velocity times time', 'Stores or returns the new position'],
    expectedAnswer: 'newPosition = oldPosition + velocity * deltaTime; return newPosition',
    starterCode: `function updatePosition(oldPosition, velocity, deltaTime) {
  // Use old position + velocity * time.
  return oldPosition;
}`,
    testCases: [
      { name: 'forward motion', expression: 'updatePosition(10, 3, 2)', expected: 16 },
      { name: 'backward motion', expression: 'updatePosition(5, -2, 4)', expected: -3 },
    ],
    keyConcepts: [
      { label: 'old position input', keywords: ['old position', 'oldposition', 'position'] },
      { label: 'velocity input', keywords: ['velocity', 'speed'] },
      { label: 'time step input', keywords: ['time', 'deltatime', 'dt'] },
      { label: 'position plus velocity times time', keywords: ['+', 'add', '*', 'velocity *', 'velocity x'] },
    ],
  },
  {
    id: 'build-force-calculator',
    subject: 'Physics',
    difficulty: 'Beginner',
    concept: 'F = ma',
    goal: 'Write pseudocode that calculates force from mass and acceleration.',
    starterPrompt: 'Create a force calculator. It should receive mass and acceleration, then return the net force required.',
    hint: 'Multiply mass by acceleration.',
    checklist: ['Uses mass as an input', 'Uses acceleration as an input', 'Calculates force with F = m x a'],
    expectedAnswer: 'force = mass * acceleration; return force',
    starterCode: `function calculateForce(mass, acceleration) {
  // Use F = ma.
  return 0;
}`,
    testCases: [
      { name: 'basic force', expression: 'calculateForce(5, 2)', expected: 10 },
      { name: 'negative acceleration', expression: 'calculateForce(3, -4)', expected: -12 },
    ],
    keyConcepts: [
      { label: 'mass input', keywords: ['mass', 'm'] },
      { label: 'acceleration input', keywords: ['acceleration', 'a'] },
      { label: 'multiply mass and acceleration', keywords: ['multiply', '*', 'x', 'mass * acceleration', 'm * a'] },
      { label: 'return force', keywords: ['return', 'force', 'f'] },
    ],
  },
  {
    id: 'build-energy-tracker',
    subject: 'Physics',
    difficulty: 'Intermediate',
    concept: 'Energy transformation',
    goal: 'Explain how you would track potential energy becoming kinetic energy.',
    starterPrompt: 'Describe a simple energy tracker for a cart rolling down a hill. Track height energy, motion energy, and losses from friction.',
    hint: 'Identify before state, after state, and losses.',
    checklist: ['Identifies starting potential energy', 'Tracks increasing kinetic energy', 'Accounts for losses such as heat or sound'],
    expectedAnswer: 'Store starting potential energy from height. As height decreases, reduce potential energy and increase kinetic energy. Track losses such as heat or sound separately.',
    starterCode: `function trackEnergy(startPotential, endPotential, losses) {
  // Return an object with kinetic energy gained and total accounted energy.
  return { kinetic: 0, totalAccounted: 0 };
}`,
    testCases: [
      { name: 'energy transfer', expression: 'trackEnergy(100, 40, 10)', expected: { kinetic: 50, totalAccounted: 100 } },
      { name: 'no losses', expression: 'trackEnergy(80, 20, 0)', expected: { kinetic: 60, totalAccounted: 80 } },
    ],
    keyConcepts: [
      { label: 'potential energy before state', keywords: ['potential', 'height', 'before', 'start'] },
      { label: 'kinetic energy after state', keywords: ['kinetic', 'motion', 'after'] },
      { label: 'energy transformation', keywords: ['transform', 'becomes', 'convert', 'change'] },
      { label: 'losses/friction', keywords: ['loss', 'friction', 'heat', 'sound'] },
    ],
  },
  {
    id: 'build-flashcard-state-manager',
    subject: 'Computer Science',
    difficulty: 'Beginner',
    concept: 'State',
    goal: 'Write pseudocode for saving whether a flashcard is correct or incorrect.',
    starterPrompt: 'Design a simple state update. It should receive a card id and a result, then save that result for later review.',
    hint: 'Store card id and result.',
    checklist: ['Stores a card identifier', 'Stores correct or incorrect result', 'Updates review state without losing previous cards'],
    expectedAnswer: 'saveResult(cardId, result): flashcardState[cardId] = result; keep the rest of the flashcard state unchanged',
    starterCode: `function saveFlashcardResult(state, cardId, result) {
  // Return a new state object with this card result saved.
  return state;
}`,
    testCases: [
      { name: 'saves result', expression: 'saveFlashcardResult({}, "card-1", "correct")', expected: { 'card-1': 'correct' } },
      { name: 'keeps previous cards', expression: 'saveFlashcardResult({ "card-0": "incorrect" }, "card-1", "correct")', expected: { 'card-0': 'incorrect', 'card-1': 'correct' } },
    ],
    keyConcepts: [
      { label: 'card id', keywords: ['card id', 'cardid', 'id'] },
      { label: 'correct/incorrect result', keywords: ['correct', 'incorrect', 'result'] },
      { label: 'save/update state', keywords: ['save', 'store', 'update', 'state'] },
      { label: 'preserve other cards', keywords: ['keep', 'preserve', 'previous', 'other'] },
    ],
  },
  {
    id: 'build-search-algorithm',
    subject: 'Computer Science',
    difficulty: 'Intermediate',
    concept: 'Linear search',
    goal: 'Write pseudocode to find a target item in a list.',
    starterPrompt: 'Write a search procedure. It should check each item in order and stop when the target is found.',
    hint: 'Check each item one at a time until found.',
    checklist: ['Loops through the list', 'Compares each item to the target', 'Returns found position or a clear not-found result'],
    expectedAnswer: 'for each item in list: if item equals target, return its index or item; after the loop, return not found',
    starterCode: `function linearSearch(list, target) {
  // Return the index of target, or -1 if missing.
  return -1;
}`,
    testCases: [
      { name: 'finds item', expression: 'linearSearch(["a", "b", "c"], "b")', expected: 1 },
      { name: 'missing item', expression: 'linearSearch([4, 5, 6], 7)', expected: -1 },
    ],
    keyConcepts: [
      { label: 'loop through list', keywords: ['loop', 'for each', 'each item', 'list'] },
      { label: 'compare item to target', keywords: ['compare', 'equals', 'target', '=='] },
      { label: 'stop or return when found', keywords: ['return', 'found', 'stop', 'index'] },
      { label: 'not found case', keywords: ['not found', 'missing', 'false', '-1'] },
    ],
  },
  {
    id: 'build-mini-ai-training-loop',
    subject: 'Computer Science',
    difficulty: 'Advanced',
    concept: 'Model, prediction, loss, update',
    goal: 'Write pseudocode for a simplified training loop.',
    starterPrompt: 'Sketch a training loop over examples. For each example, predict, compare with the answer, calculate error, and adjust the model.',
    hint: 'predict -> compare to answer -> calculate error -> adjust.',
    checklist: ['Loops over training examples', 'Computes prediction and loss', 'Updates model based on error'],
    expectedAnswer: 'for each training example: prediction = model(input); loss = compare prediction to answer; update model to reduce loss; repeat over examples',
    starterCode: `function trainingStep(weight, input, answer, learningRate) {
  // prediction = weight * input
  // error = prediction - answer
  // return adjusted weight
  return weight;
}`,
    testCases: [
      { name: 'moves weight down when prediction is high', expression: 'trainingStep(2, 3, 3, 0.1)', expected: 1.1 },
      { name: 'moves weight up when prediction is low', expression: 'trainingStep(1, 4, 8, 0.1)', expected: 2.6 },
    ],
    keyConcepts: [
      { label: 'loop over examples', keywords: ['loop', 'for each', 'examples', 'training'] },
      { label: 'make prediction', keywords: ['predict', 'prediction', 'model'] },
      { label: 'calculate loss/error', keywords: ['loss', 'error', 'compare'] },
      { label: 'update model', keywords: ['update', 'adjust', 'weights', 'model'] },
    ],
  },
];
