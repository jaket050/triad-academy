export const codeReadingChallenges = [
  {
    id: 'read-js-let-update',
    category: 'JavaScript fundamentals',
    difficulty: 'Beginner',
    title: 'Variable Updates',
    context: 'This snippet tracks a score as a learner answers questions.',
    code: `let score = 10;
score = score + 5;
score = score * 2;
console.log(score);`,
    annotations: [
      'Create a variable named score with starting value 10.',
      'Add 5 to the current score, so score becomes 15.',
      'Multiply the current score by 2, so score becomes 30.',
      'Print the final value.',
    ],
    predictionPrompt: 'What will this output?',
    output: '30',
    controlFlow: 'JavaScript runs the lines from top to bottom. Each assignment replaces the old value of score with a new value, so later lines use the updated value.',
    expectedIdea: 'The output is 30 because score changes from 10 to 15 to 30.',
    skillIds: ['variables', 'debugging'],
  },
  {
    id: 'read-js-conditional',
    category: 'JavaScript fundamentals',
    difficulty: 'Beginner',
    title: 'Conditional Branch',
    context: 'This snippet decides whether a quiz result should trigger review.',
    code: `const accuracy = 0.72;
if (accuracy >= 0.8) {
  console.log("move on");
} else {
  console.log("review");
}`,
    annotations: [
      'Store the accuracy as a decimal.',
      'Check whether accuracy is at least 0.8.',
      'This branch runs only if the condition is true.',
      'Otherwise JavaScript enters the else branch.',
      'Print the review message.',
    ],
    predictionPrompt: 'Which message will be printed?',
    output: 'review',
    controlFlow: 'The condition 0.72 >= 0.8 is false, so the if block is skipped and the else block runs.',
    expectedIdea: 'The output is review because 0.72 is below the 0.8 threshold.',
    skillIds: ['conditionals', 'debugging'],
  },
  {
    id: 'read-js-loop-total',
    category: 'JavaScript fundamentals',
    difficulty: 'Beginner',
    title: 'Loop Accumulator',
    context: 'This snippet totals completed lesson minutes.',
    code: `const minutes = [10, 15, 20];
let total = 0;
for (const item of minutes) {
  total += item;
}
console.log(total);`,
    annotations: [
      'Store three minute values in an array.',
      'Start the running total at zero.',
      'Loop once for each item in the array.',
      'Add the current item into total.',
      'End the loop after every item has been used.',
      'Print the accumulated total.',
    ],
    predictionPrompt: 'What number will be printed?',
    output: '45',
    controlFlow: 'The loop visits 10, then 15, then 20. The total changes from 0 to 10 to 25 to 45.',
    expectedIdea: 'The output is 45 because the loop adds all three numbers.',
    skillIds: ['loops', 'data-structures'],
  },
  {
    id: 'read-alg-search',
    category: 'Algorithms',
    difficulty: 'Intermediate',
    title: 'Linear Search Trace',
    context: 'This function scans a list until it finds the target.',
    code: `function findIndex(list, target) {
  for (let i = 0; i < list.length; i++) {
    if (list[i] === target) {
      return i;
    }
  }
  return -1;
}
console.log(findIndex(["a", "b", "c"], "b"));`,
    annotations: [
      'Define a function that receives a list and a target.',
      'Start at index 0 and move forward one index at a time.',
      'Compare the current item with the target.',
      'If the item matches, return the current index immediately.',
      'Close the if block.',
      'Close the loop after every item is checked.',
      'Return -1 only if no match was found.',
      'Call the function and print its result.',
    ],
    predictionPrompt: 'What will this output, and why does the loop stop?',
    output: '1',
    controlFlow: 'The loop checks index 0 first, where the value is "a". That does not match. It then checks index 1, finds "b", returns 1, and stops before checking index 2.',
    expectedIdea: 'The output is 1 because "b" is found at index 1 and return exits the function.',
    skillIds: ['loops', 'algorithms', 'data-structures'],
  },
  {
    id: 'read-alg-filter',
    category: 'Algorithms',
    difficulty: 'Intermediate',
    title: 'Filtering Values',
    context: 'This function keeps only scores that meet a minimum threshold.',
    code: `function passingScores(scores) {
  const result = [];
  for (const score of scores) {
    if (score >= 70) {
      result.push(score);
    }
  }
  return result;
}
console.log(passingScores([65, 70, 92]));`,
    annotations: [
      'Define a function that receives scores.',
      'Create an empty result array.',
      'Loop through each score.',
      'Check whether the score passes the threshold.',
      'Append passing scores to result.',
      'Close the condition.',
      'Close the loop.',
      'Return the filtered array.',
      'Call the function and print the result.',
    ],
    predictionPrompt: 'Which values remain in the returned array?',
    output: '[70, 92]',
    controlFlow: '65 fails the condition, so it is skipped. 70 and 92 pass, so both are pushed into the result array.',
    expectedIdea: 'The output is [70, 92] because only values greater than or equal to 70 are kept.',
    skillIds: ['conditionals', 'loops', 'algorithms'],
  },
  {
    id: 'read-alg-nested-loop',
    category: 'Algorithms',
    difficulty: 'Advanced',
    title: 'Nested Loop Count',
    context: 'This snippet counts pair comparisons, a common source of O(n^2) growth.',
    code: `const items = ["x", "y", "z"];
let comparisons = 0;
for (const a of items) {
  for (const b of items) {
    comparisons++;
  }
}
console.log(comparisons);`,
    annotations: [
      'Create a list with three items.',
      'Start comparison count at zero.',
      'Outer loop chooses one item.',
      'Inner loop goes through every item for each outer item.',
      'Increase the count once per pair.',
      'Close the inner loop.',
      'Close the outer loop.',
      'Print the final count.',
    ],
    predictionPrompt: 'How many comparisons happen?',
    output: '9',
    controlFlow: 'The outer loop runs 3 times. For each outer loop, the inner loop also runs 3 times. That creates 3 x 3 = 9 total comparisons.',
    expectedIdea: 'The output is 9 because nested loops multiply their counts.',
    skillIds: ['loops', 'algorithms', 'critical-thinking'],
  },
  {
    id: 'read-data-line-prediction',
    category: 'Data/modeling',
    difficulty: 'Intermediate',
    title: 'Linear Model Prediction',
    context: 'This tiny model predicts an output from one input using y = mx + b.',
    code: `const model = { slope: 2, intercept: 3 };
const x = 4;
const prediction = model.slope * x + model.intercept;
console.log(prediction);`,
    annotations: [
      'Store model parameters in an object.',
      'Choose an input value.',
      'Compute slope times input, then add intercept.',
      'Print the prediction.',
    ],
    predictionPrompt: 'What prediction does the model make?',
    output: '11',
    controlFlow: 'The model calculates 2 * 4 + 3. Multiplication happens before addition, so the prediction is 8 + 3.',
    expectedIdea: 'The output is 11 because the model applies y = 2x + 3 at x = 4.',
    skillIds: ['functions', 'slope', 'equations'],
  },
  {
    id: 'read-data-loss',
    category: 'Data/modeling',
    difficulty: 'Intermediate',
    title: 'Prediction Error',
    context: 'This snippet measures how far a prediction is from the real answer.',
    code: `const prediction = 18;
const answer = 15;
const error = prediction - answer;
const squaredError = error * error;
console.log(squaredError);`,
    annotations: [
      'Store the model prediction.',
      'Store the correct answer.',
      'Find the signed difference.',
      'Square the difference so negative and positive errors both count as wrong.',
      'Print the squared error.',
    ],
    predictionPrompt: 'What squared error will be printed?',
    output: '9',
    controlFlow: 'The error is 18 - 15 = 3. Squaring gives 3 * 3 = 9.',
    expectedIdea: 'The output is 9 because the prediction is 3 too high and squared error is 3 squared.',
    skillIds: ['functions', 'probability', 'ai-training'],
  },
  {
    id: 'read-ai-training-step',
    category: 'Neural networks / training loops',
    difficulty: 'Advanced',
    title: 'One Weight Update',
    context: 'This simplified training step adjusts one weight after seeing an error.',
    code: `let weight = 2;
const input = 3;
const answer = 3;
const prediction = weight * input;
const error = prediction - answer;
weight = weight - 0.1 * error * input;
console.log(weight);`,
    annotations: [
      'Start with a weight.',
      'Store the input.',
      'Store the target answer.',
      'Make a prediction from weight times input.',
      'Measure how high or low the prediction is.',
      'Move the weight opposite the error direction.',
      'Print the updated weight.',
    ],
    predictionPrompt: 'What is the new weight?',
    output: '1.1',
    controlFlow: 'The prediction is 2 * 3 = 6. The error is 3. The update subtracts 0.1 * 3 * 3 = 0.9, so weight becomes 1.1.',
    expectedIdea: 'The output is 1.1 because the prediction was too high, so the update lowers the weight.',
    skillIds: ['ai-training', 'derivatives', 'functions'],
  },
  {
    id: 'read-ai-epochs',
    category: 'Neural networks / training loops',
    difficulty: 'Advanced',
    title: 'Epoch Counter',
    context: 'Training loops often repeat the same update over many examples or epochs.',
    code: `let steps = 0;
for (let epoch = 1; epoch <= 3; epoch++) {
  for (const example of ["a", "b"]) {
    steps++;
  }
}
console.log(steps);`,
    annotations: [
      'Start counting update steps.',
      'Run epochs 1, 2, and 3.',
      'For each epoch, loop over two examples.',
      'Count one training step per example.',
      'Close the inner loop.',
      'Close the outer loop.',
      'Print the number of training steps.',
    ],
    predictionPrompt: 'How many training steps run?',
    output: '6',
    controlFlow: 'There are 3 epochs and 2 examples per epoch. The inner loop runs twice for each epoch, so steps becomes 3 x 2 = 6.',
    expectedIdea: 'The output is 6 because nested training loops multiply epochs by examples.',
    skillIds: ['ai-training', 'loops', 'algorithms'],
  },
  {
    id: 'read-app-state-render',
    category: 'App/system architecture',
    difficulty: 'Intermediate',
    title: 'State Drives UI',
    context: 'This simplified UI logic chooses text from app state.',
    code: `const state = { complete: false, title: "Functions" };
const label = state.complete
  ? "Review lesson"
  : "Start lesson";
console.log(label + ": " + state.title);`,
    annotations: [
      'Store the current UI state.',
      'Start a conditional expression.',
      'Use this label if complete is true.',
      'Use this label if complete is false.',
      'Print the label and title together.',
    ],
    predictionPrompt: 'What UI label will be printed?',
    output: 'Start lesson: Functions',
    controlFlow: 'state.complete is false, so the conditional expression chooses "Start lesson" and combines it with the lesson title.',
    expectedIdea: 'The output is Start lesson: Functions because UI text is derived from state.complete and state.title.',
    skillIds: ['conditionals', 'variables', 'data-structures'],
  },
  {
    id: 'read-app-route',
    category: 'App/system architecture',
    difficulty: 'Intermediate',
    title: 'Route Matching',
    context: 'This snippet maps a URL hash to the section the app should show.',
    code: `const routes = {
  "#dashboard": "Dashboard",
  "#labs": "Interactive Labs",
  "#debug-mode": "Debug Mode"
};
const hash = "#debug-mode";
console.log(routes[hash] || "Dashboard");`,
    annotations: [
      'Create a lookup object from hash values to page names.',
      'Map dashboard hash.',
      'Map labs hash.',
      'Map debug hash.',
      'Close the route table.',
      'Store the current hash.',
      'Print the matching route, or Dashboard if no route exists.',
    ],
    predictionPrompt: 'Which section name will be printed?',
    output: 'Debug Mode',
    controlFlow: 'The hash "#debug-mode" exists as a key in routes, so the lookup returns "Debug Mode". The fallback is not used.',
    expectedIdea: 'The output is Debug Mode because object lookup finds the matching route key.',
    skillIds: ['data-structures', 'conditionals', 'debugging'],
  },
];
