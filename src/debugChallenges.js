export const debugChallenges = [
  {
    id: 'debug-js-sum-cart',
    category: 'JavaScript fundamentals',
    difficulty: 'Beginner',
    title: 'Cart Total Returns a String',
    expectedBehavior: 'addPrices([2, 3, 4]) should return the number 9.',
    brokenCode: `function addPrices(prices) {
  let total = "";
  for (const price of prices) {
    total = total + price;
  }
  return total;
}`,
    testCases: [
      { name: 'adds three prices', expression: 'addPrices([2, 3, 4])', expected: 9 },
      { name: 'empty cart is zero', expression: 'addPrices([])', expected: 0 },
    ],
    hints: ['Check the starting value of total.', 'A string plus a number makes a string in JavaScript.', 'Start total at 0, not an empty string.'],
    modelExplanation: 'The accumulator started as an empty string, so JavaScript performed string concatenation. Starting total at 0 makes each update numeric addition.',
    skillIds: ['variables', 'loops', 'debugging'],
  },
  {
    id: 'debug-js-off-by-one',
    category: 'JavaScript fundamentals',
    difficulty: 'Beginner',
    title: 'Loop Reads Past the End',
    expectedBehavior: 'firstLetters(["math", "physics"]) should return ["m", "p"] without adding undefined.',
    brokenCode: `function firstLetters(words) {
  const letters = [];
  for (let i = 0; i <= words.length; i++) {
    letters.push(words[i][0]);
  }
  return letters;
}`,
    testCases: [
      { name: 'two words', expression: 'firstLetters(["math", "physics"])', expected: ['m', 'p'] },
      { name: 'one word', expression: 'firstLetters(["code"])', expected: ['c'] },
    ],
    hints: ['Look at the loop condition.', 'The last valid index is length - 1.', 'Use i < words.length.'],
    modelExplanation: 'The loop used <=, so it tried to read words[words.length], which does not exist. Arrays stop at index length - 1.',
    skillIds: ['loops', 'data-structures', 'debugging'],
  },
  {
    id: 'debug-js-condition',
    category: 'JavaScript fundamentals',
    difficulty: 'Beginner',
    title: 'Threshold Logic Is Backward',
    expectedBehavior: 'isPassing(score) should return true for scores 70 or above.',
    brokenCode: `function isPassing(score) {
  if (score > 70) {
    return false;
  }
  return true;
}`,
    testCases: [
      { name: '70 passes', expression: 'isPassing(70)', expected: true },
      { name: '50 fails', expression: 'isPassing(50)', expected: false },
      { name: '90 passes', expression: 'isPassing(90)', expected: true },
    ],
    hints: ['Write the rule in plain English first.', 'The function should return true when score is at least 70.', 'Use score >= 70.'],
    modelExplanation: 'The condition reversed the meaning of passing. The rule is score >= 70, so the boolean expression can be returned directly.',
    skillIds: ['conditionals', 'debugging'],
  },
  {
    id: 'debug-js-state-mutation',
    category: 'JavaScript fundamentals',
    difficulty: 'Intermediate',
    title: 'Progress Update Loses Old State',
    expectedBehavior: 'saveProgress should keep previous lessons while updating one lesson.',
    brokenCode: `function saveProgress(state, lessonId, complete) {
  return {
    [lessonId]: { complete }
  };
}`,
    testCases: [
      { name: 'keeps old lesson', expression: 'saveProgress({ "math-1": { complete: true } }, "cs-1", false)', expected: { 'math-1': { complete: true }, 'cs-1': { complete: false } } },
      { name: 'updates existing lesson', expression: 'saveProgress({ "math-1": { complete: false } }, "math-1", true)', expected: { 'math-1': { complete: true } } },
    ],
    hints: ['The returned object only has one key.', 'Preserve the old state before replacing one entry.', 'Use object spread: { ...state, [lessonId]: ... }.'],
    modelExplanation: 'The function replaced the entire state object with one lesson. A safe state update copies the previous object and then overwrites the changed lesson.',
    skillIds: ['variables', 'data-structures', 'debugging'],
  },
  {
    id: 'debug-alg-linear-search',
    category: 'Algorithm bugs',
    difficulty: 'Beginner',
    title: 'Search Stops Too Early',
    expectedBehavior: 'linearSearch should check every item and return the index of the target, or -1.',
    brokenCode: `function linearSearch(list, target) {
  for (let i = 0; i < list.length; i++) {
    if (list[i] === target) {
      return i;
    } else {
      return -1;
    }
  }
  return -1;
}`,
    testCases: [
      { name: 'finds second item', expression: 'linearSearch(["a", "b", "c"], "b")', expected: 1 },
      { name: 'missing item', expression: 'linearSearch([4, 5, 6], 7)', expected: -1 },
    ],
    hints: ['What happens after the first item is not the target?', 'Do not return -1 until the whole loop is done.', 'Move return -1 after the loop.'],
    modelExplanation: 'The else branch returned -1 on the first non-match, so the loop never checked later items. Search should fail only after every item has been checked.',
    skillIds: ['loops', 'algorithms', 'debugging'],
  },
  {
    id: 'debug-alg-max-value',
    category: 'Algorithm bugs',
    difficulty: 'Intermediate',
    title: 'Maximum Fails for Negative Numbers',
    expectedBehavior: 'maxValue([-8, -3, -10]) should return -3.',
    brokenCode: `function maxValue(numbers) {
  let max = 0;
  for (const number of numbers) {
    if (number > max) {
      max = number;
    }
  }
  return max;
}`,
    testCases: [
      { name: 'positive values', expression: 'maxValue([2, 9, 4])', expected: 9 },
      { name: 'negative values', expression: 'maxValue([-8, -3, -10])', expected: -3 },
    ],
    hints: ['The starting max is already bigger than every negative number.', 'Start with the first item instead of 0.', 'Use numbers[0] as the initial max.'],
    modelExplanation: 'The algorithm assumed 0 was a safe starting maximum. That fails when all values are negative. Initializing from the data avoids a fake value.',
    skillIds: ['loops', 'algorithms', 'debugging'],
  },
  {
    id: 'debug-alg-average',
    category: 'Algorithm bugs',
    difficulty: 'Intermediate',
    title: 'Average Divides Inside the Loop',
    expectedBehavior: 'average([2, 4, 6]) should return 4.',
    brokenCode: `function average(numbers) {
  let total = 0;
  for (const number of numbers) {
    total += number;
    total = total / numbers.length;
  }
  return total;
}`,
    testCases: [
      { name: 'simple average', expression: 'average([2, 4, 6])', expected: 4 },
      { name: 'single value', expression: 'average([10])', expected: 10 },
    ],
    hints: ['Separate accumulating from calculating the final average.', 'Only divide once after the sum is complete.', 'Move total / numbers.length outside the loop.'],
    modelExplanation: 'The code divided the running total on every pass, which changed the sum before all values were added. First sum all values, then divide once.',
    skillIds: ['fractions', 'loops', 'algorithms'],
  },
  {
    id: 'debug-math-line-model',
    category: 'Math/modeling bugs',
    difficulty: 'Beginner',
    title: 'Line Formula Uses the Wrong Operation',
    expectedBehavior: 'lineOutput(3, 2, 1) should compute y = mx + b and return 7.',
    brokenCode: `function lineOutput(x, m, b) {
  return m + x + b;
}`,
    testCases: [
      { name: 'positive slope', expression: 'lineOutput(3, 2, 1)', expected: 7 },
      { name: 'zero intercept', expression: 'lineOutput(5, 4, 0)', expected: 20 },
    ],
    hints: ['In y = mx + b, m and x are multiplied.', 'Addition is only for the intercept after mx.', 'Use m * x + b.'],
    modelExplanation: 'The formula added m and x instead of multiplying them. Slope tells how many y-units per x-unit, so it must scale x by multiplication.',
    skillIds: ['functions', 'slope', 'equations'],
  },
  {
    id: 'debug-math-probability',
    category: 'Math/modeling bugs',
    difficulty: 'Beginner',
    title: 'Probability Uses Whole Over Part',
    expectedBehavior: 'probability(3, 12) should return 0.25.',
    brokenCode: `function probability(successes, totalTrials) {
  return totalTrials / successes;
}`,
    testCases: [
      { name: 'three of twelve', expression: 'probability(3, 12)', expected: 0.25 },
      { name: 'half', expression: 'probability(5, 10)', expected: 0.5 },
    ],
    hints: ['Probability is part divided by whole.', 'Successes are the part; total trials are the whole.', 'Return successes / totalTrials.'],
    modelExplanation: 'The code inverted the ratio. Probability estimates the fraction of trials that succeeded, so the numerator should be successes.',
    skillIds: ['fractions', 'probability'],
  },
  {
    id: 'debug-math-motion-step',
    category: 'Math/modeling bugs',
    difficulty: 'Intermediate',
    title: 'Position Update Forgets Time',
    expectedBehavior: 'updatePosition(10, 3, 2) should return 16.',
    brokenCode: `function updatePosition(position, velocity, deltaTime) {
  return position + velocity;
}`,
    testCases: [
      { name: 'two second step', expression: 'updatePosition(10, 3, 2)', expected: 16 },
      { name: 'half second step', expression: 'updatePosition(5, 8, 0.5)', expected: 9 },
    ],
    hints: ['Velocity is distance per unit time.', 'Displacement is velocity times time.', 'Use position + velocity * deltaTime.'],
    modelExplanation: 'The code treated velocity as if it were already displacement. A simulation step must multiply velocity by the time interval.',
    skillIds: ['motion', 'slope', 'functions'],
  },
  {
    id: 'debug-ai-loss-sign',
    category: 'AI/training loop bugs',
    difficulty: 'Advanced',
    title: 'Training Update Moves the Wrong Way',
    expectedBehavior: 'When prediction is too high, the weight should decrease.',
    brokenCode: `function trainingStep(weight, input, answer, learningRate) {
  const prediction = weight * input;
  const error = prediction - answer;
  return weight + learningRate * error * input;
}`,
    testCases: [
      { name: 'prediction too high decreases weight', expression: 'trainingStep(2, 3, 3, 0.1)', expected: 1.1 },
      { name: 'prediction too low increases weight', expression: 'trainingStep(1, 4, 8, 0.1)', expected: 2.6 },
    ],
    hints: ['The update should reduce error, not amplify it.', 'Gradient descent subtracts the gradient.', 'Use weight - learningRate * error * input.'],
    modelExplanation: 'The code added the gradient, so it moved uphill on the loss surface. Gradient descent subtracts the gradient to reduce loss.',
    skillIds: ['ai-training', 'derivatives', 'functions'],
  },
  {
    id: 'debug-ai-loss-average',
    category: 'AI/training loop bugs',
    difficulty: 'Advanced',
    title: 'Loss Is Not Averaged',
    expectedBehavior: 'meanSquaredError([2, 4], [1, 5]) should return 1.',
    brokenCode: `function meanSquaredError(predictions, answers) {
  let total = 0;
  for (let i = 0; i < predictions.length; i++) {
    const error = predictions[i] - answers[i];
    total += error * error;
  }
  return total;
}`,
    testCases: [
      { name: 'two errors', expression: 'meanSquaredError([2, 4], [1, 5])', expected: 1 },
      { name: 'perfect predictions', expression: 'meanSquaredError([3, 7], [3, 7])', expected: 0 },
    ],
    hints: ['Mean means average.', 'The code calculates total squared error.', 'Divide total by predictions.length.'],
    modelExplanation: 'The function returned the sum of squared errors, not the mean. Mean squared error divides the total squared error by the number of examples.',
    skillIds: ['ai-training', 'probability', 'algorithms'],
  },
];
