export const karpathyMilestones = [
  {
    id: 'kp-scalar-autodiff-engine',
    phaseId: 'mathematical-foundations',
    title: 'Scalar Autodiff Engine',
    whyItMatters: 'Autodiff is the engine under modern neural network training. Building a scalar version makes gradients feel mechanical instead of magical.',
    conceptsRequired: ['functions', 'derivatives', 'computational graphs', 'chain rule', 'tests'],
    buildSteps: ['Create a Value object that stores data and gradient.', 'Track parent values and the operation that created each result.', 'Implement add and multiply.', 'Backpropagate gradients in reverse topological order.'],
    successCriteria: ['Can compute a forward value.', 'Can compute gradients for a small expression.', 'Can explain why reverse order matters.'],
    stretchGoal: 'Add tanh or ReLU and visualize the graph.',
    reflectionPrompt: 'Where did the gradient come from at each operation?',
    skillIds: ['functions', 'derivatives', 'debugging'],
  },
  {
    id: 'kp-computational-graph-visualizer',
    phaseId: 'computational-graphs',
    title: 'Computational Graph Visualizer',
    whyItMatters: 'Graphs reveal how values depend on earlier values, which is the structure backpropagation uses.',
    conceptsRequired: ['nodes', 'edges', 'dependencies', 'forward pass', 'reverse pass'],
    buildSteps: ['Represent each operation as a node.', 'Draw arrows from inputs to outputs.', 'Show computed values beside nodes.', 'Highlight the reverse path used for gradients.'],
    successCriteria: ['Can display a small expression graph.', 'Can explain parent-child dependencies.', 'Can trace forward and backward passes.'],
    stretchGoal: 'Animate backpropagation one node at a time.',
    reflectionPrompt: 'How does a graph make hidden dependencies visible?',
    skillIds: ['graphs', 'data-structures', 'ai-training'],
  },
  {
    id: 'kp-gradient-descent-trainer',
    phaseId: 'gradient-descent',
    title: 'Gradient Descent Trainer',
    whyItMatters: 'Gradient descent is how models improve from mistakes. A tiny trainer connects loss, gradient, learning rate, and update steps.',
    conceptsRequired: ['loss', 'gradient direction', 'learning rate', 'training loop'],
    buildSteps: ['Choose a simple dataset.', 'Make predictions with one weight.', 'Measure squared error.', 'Update the weight opposite the gradient.', 'Plot loss over time.'],
    successCriteria: ['Loss decreases on a simple dataset.', 'Learning rate can be tuned.', 'Bad learning rates show instability.'],
    stretchGoal: 'Add validation examples and compare training vs validation loss.',
    reflectionPrompt: 'What evidence tells you the model is learning rather than just changing?',
    skillIds: ['ai-training', 'derivatives', 'probability'],
  },
  {
    id: 'kp-single-neuron-classifier',
    phaseId: 'neural-networks',
    title: 'Single Neuron Classifier',
    whyItMatters: 'A neuron is a weighted sum plus an activation. Building one clarifies what larger neural networks repeat at scale.',
    conceptsRequired: ['vectors', 'dot product', 'bias', 'activation', 'classification'],
    buildSteps: ['Represent inputs as a feature vector.', 'Compute weighted sum plus bias.', 'Apply an activation function.', 'Compare prediction to a label.', 'Adjust weights from error.'],
    successCriteria: ['Can classify a tiny dataset better than chance.', 'Can explain weight, bias, and activation roles.', 'Can inspect a wrong prediction.'],
    stretchGoal: 'Draw the decision boundary.',
    reflectionPrompt: 'What does the neuron learn: a rule, a boundary, or both?',
    skillIds: ['vectors', 'functions', 'ai-training'],
  },
  {
    id: 'kp-mlp-from-scratch',
    phaseId: 'neural-networks',
    title: 'MLP From Scratch',
    whyItMatters: 'A multilayer perceptron shows how simple neurons compose into nonlinear functions.',
    conceptsRequired: ['layers', 'activation functions', 'parameters', 'backpropagation'],
    buildSteps: ['Create neuron, layer, and network structures.', 'Run a forward pass through layers.', 'Compute loss.', 'Backpropagate through all parameters.', 'Train on a tiny classification problem.'],
    successCriteria: ['Network output changes after training.', 'Loss decreases.', 'Can explain why nonlinear activation matters.'],
    stretchGoal: 'Compare one hidden layer with two hidden layers.',
    reflectionPrompt: 'Why can stacked simple functions learn a more complex boundary?',
    skillIds: ['functions', 'ai-training', 'data-structures'],
  },
  {
    id: 'kp-activation-function-explorer',
    phaseId: 'neural-networks',
    title: 'Activation Function Explorer',
    whyItMatters: 'Activations decide how signals flow through a network and whether the model can learn nonlinear patterns.',
    conceptsRequired: ['nonlinear functions', 'ReLU', 'tanh', 'saturation', 'gradients'],
    buildSteps: ['Plot ReLU and tanh.', 'Pass sample values through each activation.', 'Compare gradients.', 'Show how dead or saturated units affect learning.'],
    successCriteria: ['Can describe ReLU and tanh behavior.', 'Can explain why nonlinearity matters.', 'Can identify saturation.'],
    stretchGoal: 'Add sigmoid and compare all three.',
    reflectionPrompt: 'What does an activation allow a network to do that a plain line cannot?',
    skillIds: ['functions', 'graphs', 'derivatives'],
  },
  {
    id: 'kp-tokenizer-builder',
    phaseId: 'language-models',
    title: 'Tokenizer Builder',
    whyItMatters: 'Language models do not read raw meaning directly. They first turn text into tokens the model can count and predict.',
    conceptsRequired: ['strings', 'vocabulary', 'mapping', 'encoding', 'decoding'],
    buildSteps: ['Collect a small text sample.', 'Build a vocabulary of characters or words.', 'Map tokens to numbers.', 'Encode text into ids.', 'Decode ids back into text.'],
    successCriteria: ['Can encode and decode a phrase.', 'Unknown tokens are handled deliberately.', 'Can explain why models need numeric inputs.'],
    stretchGoal: 'Implement a simple pair-merge tokenizer.',
    reflectionPrompt: 'What information is kept or lost when text becomes tokens?',
    skillIds: ['data-structures', 'algorithms', 'communication'],
  },
  {
    id: 'kp-bigram-language-model',
    phaseId: 'language-models',
    title: 'Bigram Language Model',
    whyItMatters: 'A bigram model is the smallest useful language model: it predicts the next token from the current token.',
    conceptsRequired: ['probability', 'counts', 'sampling', 'training data'],
    buildSteps: ['Count token pairs.', 'Convert counts into probabilities.', 'Sample the next token.', 'Generate short text.', 'Compare generated text with training data.'],
    successCriteria: ['Can produce text from learned transition probabilities.', 'Can explain why output is patterned but limited.', 'Can inspect bad generations.'],
    stretchGoal: 'Add smoothing for unseen pairs.',
    reflectionPrompt: 'What can a bigram model learn, and what can it never know?',
    skillIds: ['probability', 'data-structures', 'ai-training'],
  },
  {
    id: 'kp-embedding-visualizer',
    phaseId: 'language-models',
    title: 'Embedding Visualizer',
    whyItMatters: 'Embeddings turn tokens into vectors, letting models represent similarity and context numerically.',
    conceptsRequired: ['vectors', 'features', 'distance', 'similarity'],
    buildSteps: ['Assign tiny vectors to tokens.', 'Plot tokens in 2D.', 'Measure distances between tokens.', 'Update vectors from a toy objective.', 'Observe clusters.'],
    successCriteria: ['Can explain tokens as vectors.', 'Can compare similarity with distance or dot product.', 'Can interpret a small embedding plot.'],
    stretchGoal: 'Animate vector movement during training.',
    reflectionPrompt: 'What does closeness in an embedding space mean, and when can it mislead?',
    skillIds: ['vectors', 'graphs', 'ai-training'],
  },
  {
    id: 'kp-attention-visualizer',
    phaseId: 'transformers',
    title: 'Attention Visualizer',
    whyItMatters: 'Attention lets each token decide which other tokens matter for the next representation.',
    conceptsRequired: ['queries', 'keys', 'values', 'dot product', 'weights'],
    buildSteps: ['Create small token vectors.', 'Compute query-key scores.', 'Normalize scores into weights.', 'Blend value vectors.', 'Draw an attention heatmap.'],
    successCriteria: ['Can compute one attention row.', 'Can explain weighted averaging.', 'Can read a simple attention heatmap.'],
    stretchGoal: 'Add multiple attention heads.',
    reflectionPrompt: 'How is attention different from reading tokens strictly left to right?',
    skillIds: ['vectors', 'probability', 'ai-training'],
  },
  {
    id: 'kp-mini-transformer-block',
    phaseId: 'transformers',
    title: 'Mini Transformer Block',
    whyItMatters: 'A transformer block combines attention and a small neural network into the repeating unit behind modern language models.',
    conceptsRequired: ['attention', 'residual connections', 'normalization', 'MLP'],
    buildSteps: ['Run token vectors through attention.', 'Add a residual connection.', 'Apply a tiny feedforward network.', 'Add another residual connection.', 'Track shapes at each step.'],
    successCriteria: ['Can describe each sublayer role.', 'Can keep tensor shapes consistent.', 'Can explain why residual paths help.'],
    stretchGoal: 'Stack two blocks and compare outputs.',
    reflectionPrompt: 'What problem does each part of the block solve?',
    skillIds: ['ai-training', 'vectors', 'data-structures'],
  },
  {
    id: 'kp-mini-gpt-text-generator',
    phaseId: 'transformers',
    title: 'Mini GPT Text Generator',
    whyItMatters: 'A tiny GPT-style generator pulls the whole path together: tokens, embeddings, attention, training, and sampling.',
    conceptsRequired: ['tokenization', 'language modeling', 'transformer blocks', 'sampling'],
    buildSteps: ['Prepare a tiny text dataset.', 'Tokenize text.', 'Train next-token prediction.', 'Sample tokens autoregressively.', 'Decode tokens into text.'],
    successCriteria: ['Can generate short text.', 'Can explain next-token prediction.', 'Can identify limitations from tiny data and tiny model size.'],
    stretchGoal: 'Add temperature control for sampling.',
    reflectionPrompt: 'What parts of the generated text come from data, model structure, and randomness?',
    skillIds: ['ai-training', 'probability', 'algorithms'],
  },
];

const executableProjects = {
  'kp-scalar-autodiff-engine': {
    dataset: 'Expression: c = a * b + a, with a = 2 and b = 3.',
    starterCode: `class Value {
  constructor(data) {
    this.data = data;
    this.grad = 0;
  }

  add(other) {
    return new Value(0);
  }

  mul(other) {
    return new Value(0);
  }

  backward() {
    this.grad = 1;
  }
}`,
    testCases: [
      { name: 'addition stores forward value', expression: 'new Value(2).add(new Value(3)).data', expected: 5 },
      { name: 'multiplication stores forward value', expression: 'new Value(2).mul(new Value(3)).data', expected: 6 },
    ],
    visualization: { type: 'graph', nodes: ['a=2', 'b=3', 'a*b=6', '+a', 'c=8'], edges: ['a->a*b', 'b->a*b', 'a*b->c', 'a->c'] },
    debugScenarios: ['If every result is zero, inspect add and mul return values.', 'If gradients never change, inspect what backward is responsible for in your design.'],
  },
  'kp-computational-graph-visualizer': {
    dataset: 'Nodes for a tiny expression graph: a, b, multiply, output.',
    starterCode: `function buildGraph() {
  return {
    nodes: [],
    edges: []
  };
}`,
    testCases: [
      { name: 'creates four nodes', expression: 'buildGraph().nodes.length', expected: 4 },
      { name: 'creates three edges', expression: 'buildGraph().edges.length', expected: 3 },
    ],
    visualization: { type: 'graph', nodes: ['a', 'b', '*', 'output'], edges: ['a->*', 'b->*', '*->output'] },
    debugScenarios: ['If a graph looks disconnected, compare every edge endpoint with a real node id.', 'If the output appears before inputs, inspect graph order versus dependency order.'],
  },
  'kp-gradient-descent-trainer': {
    dataset: 'Tiny linear data: x values [1, 2, 3], y values [2, 4, 6].',
    starterCode: `const data = [[1, 2], [2, 4], [3, 6]];

function predict(weight, x) {
  return weight * x;
}

function mse(weight) {
  return 0;
}

function train(weight, learningRate, steps) {
  return weight;
}`,
    testCases: [
      { name: 'prediction uses weight times input', expression: 'predict(2, 4)', expected: 8 },
      { name: 'perfect weight has zero loss', expression: 'mse(2)', expected: 0 },
      { name: 'training moves toward weight 2', expression: 'train(0, 0.1, 20) > 1.5', expected: true },
    ],
    visualization: { type: 'line', points: [[1, 2], [2, 4], [3, 6]], line: 'y = 2x target' },
    debugScenarios: ['If loss rises, check the sign of the update.', 'If training is frozen, check whether the loop updates weight each step.'],
  },
  'kp-single-neuron-classifier': {
    dataset: 'OR gate examples: [0,0]->0, [1,0]->1, [0,1]->1, [1,1]->1.',
    starterCode: `function step(value) {
  return value >= 0 ? 1 : 0;
}

function neuron(inputs, weights, bias) {
  return 0;
}`,
    testCases: [
      { name: 'OR false case', expression: 'neuron([0, 0], [1, 1], -0.5)', expected: 0 },
      { name: 'OR true case', expression: 'neuron([1, 0], [1, 1], -0.5)', expected: 1 },
      { name: 'OR both true', expression: 'neuron([1, 1], [1, 1], -0.5)', expected: 1 },
    ],
    visualization: { type: 'classification', labels: ['00 -> 0', '10 -> 1', '01 -> 1', '11 -> 1'] },
    debugScenarios: ['If [0,0] returns 1, inspect the bias threshold.', 'If every case returns 0, inspect the weighted sum.'],
  },
  'kp-mlp-from-scratch': {
    dataset: 'XOR examples where one active input is true and two matching inputs are false.',
    starterCode: `function relu(x) {
  return Math.max(0, x);
}

function tinyMlp(x1, x2) {
  const h1 = 0;
  const h2 = 0;
  return h1 + h2 > 0 ? 1 : 0;
}`,
    testCases: [
      { name: 'XOR 0,0', expression: 'tinyMlp(0, 0)', expected: 0 },
      { name: 'XOR 1,0', expression: 'tinyMlp(1, 0)', expected: 1 },
      { name: 'XOR 0,1', expression: 'tinyMlp(0, 1)', expected: 1 },
      { name: 'XOR 1,1', expression: 'tinyMlp(1, 1)', expected: 0 },
    ],
    visualization: { type: 'classification', labels: ['Hidden units can carve space into pieces.', 'Output combines hidden features.'] },
    debugScenarios: ['If XOR acts like OR, inspect the case [1,1].', 'If hidden units are never positive, inspect ReLU inputs and biases.'],
  },
  'kp-activation-function-explorer': {
    dataset: 'Inputs from -2 to 2 passed through ReLU and tanh.',
    starterCode: `function relu(x) {
  return 0;
}

function tanhApprox(x) {
  return Math.tanh(x);
}

function activationTable(values) {
  return values.map((x) => [x, relu(x), tanhApprox(x)]);
}`,
    testCases: [
      { name: 'ReLU clips negative', expression: 'relu(-2)', expected: 0 },
      { name: 'ReLU keeps positive', expression: 'relu(3)', expected: 3 },
      { name: 'table has one row per input', expression: 'activationTable([-1, 0, 1]).length', expected: 3 },
    ],
    visualization: { type: 'curve', labels: ['ReLU: flat for negatives, line for positives', 'tanh: smooth between -1 and 1'] },
    debugScenarios: ['If negative ReLU values survive, check the max operation.', 'If the table length is wrong, inspect map return behavior.'],
  },
  'kp-tokenizer-builder': {
    dataset: 'Text sample: "hi ai".',
    starterCode: `function buildVocab(text) {
  return [];
}

function encode(text, vocab) {
  return [];
}

function decode(ids, vocab) {
  return "";
}`,
    testCases: [
      { name: 'vocab has unique characters', expression: 'buildVocab("hi ai").length', expected: 4 },
      { name: 'encode returns one id per character', expression: 'encode("hi", buildVocab("hi ai")).length', expected: 2 },
      { name: 'decode reverses encode', expression: 'decode(encode("hi", buildVocab("hi ai")), buildVocab("hi ai"))', expected: 'hi' },
    ],
    visualization: { type: 'tokens', labels: ['h -> id', 'i -> id', 'space -> id', 'a -> id'] },
    debugScenarios: ['If ids change between encode and decode, make vocab order stable.', 'If spaces disappear, check whether the tokenizer preserves every character.'],
  },
  'kp-bigram-language-model': {
    dataset: 'Training text: "abab".',
    starterCode: `function countBigrams(text) {
  return {};
}

function nextToken(counts, token) {
  return "";
}`,
    testCases: [
      { name: 'counts ab twice', expression: 'countBigrams("abab")["a"]["b"]', expected: 2 },
      { name: 'counts ba once', expression: 'countBigrams("abab")["b"]["a"]', expected: 1 },
      { name: 'predicts b after a', expression: 'nextToken(countBigrams("abab"), "a")', expected: 'b' },
    ],
    visualization: { type: 'graph', nodes: ['a', 'b'], edges: ['a->b count 2', 'b->a count 1'] },
    debugScenarios: ['If the final pair is missing, inspect loop bounds.', 'If nextToken returns random results, choose the highest count deterministically first.'],
  },
  'kp-embedding-visualizer': {
    dataset: 'Tiny embeddings for king, queen, cat, dog.',
    starterCode: `const embeddings = {
  king: [1, 1],
  queen: [1, 0.9],
  cat: [-1, -1],
  dog: [-0.9, -1]
};

function distance(a, b) {
  return 0;
}

function nearest(word) {
  return "";
}`,
    testCases: [
      { name: 'zero distance to self', expression: 'distance(embeddings.king, embeddings.king)', expected: 0 },
      { name: 'queen nearest king', expression: 'nearest("king")', expected: 'queen' },
    ],
    visualization: { type: 'scatter', points: [['king', 1, 1], ['queen', 1, 0.9], ['cat', -1, -1], ['dog', -0.9, -1]] },
    debugScenarios: ['If a word is nearest to itself, skip the query word in nearest.', 'If distances are negative, inspect the square root and squared differences.'],
  },
  'kp-attention-visualizer': {
    dataset: 'Query [1,0], keys [[1,0], [0,1]], values ["self", "other"].',
    starterCode: `function dot(a, b) {
  return 0;
}

function softmax(scores) {
  return scores;
}

function attentionWeights(query, keys) {
  return keys.map((key) => dot(query, key));
}`,
    testCases: [
      { name: 'dot aligned vectors', expression: 'dot([1, 0], [1, 0])', expected: 1 },
      { name: 'dot perpendicular vectors', expression: 'dot([1, 0], [0, 1])', expected: 0 },
      { name: 'softmax sums to one', expression: 'Math.round(softmax([1, 0]).reduce((a, b) => a + b, 0) * 1000) / 1000', expected: 1 },
    ],
    visualization: { type: 'heatmap', labels: ['self strong', 'other weak'] },
    debugScenarios: ['If attention weights do not sum to one, inspect softmax normalization.', 'If aligned tokens score low, inspect dot product indexing.'],
  },
  'kp-mini-transformer-block': {
    dataset: 'Two token vectors passing through attention, residual add, and feedforward transform.',
    starterCode: `function addVectors(a, b) {
  return [];
}

function feedForward(vector) {
  return vector.map((x) => x * 2);
}

function transformerBlock(token, attentionOutput) {
  const withResidual = [];
  return feedForward(withResidual);
}`,
    testCases: [
      { name: 'adds vectors componentwise', expression: 'addVectors([1, 2], [3, 4])', expected: [4, 6] },
      { name: 'feedforward doubles values', expression: 'feedForward([2, -1])', expected: [4, -2] },
      { name: 'block adds residual then transforms', expression: 'transformerBlock([1, 2], [3, 4])', expected: [8, 12] },
    ],
    visualization: { type: 'pipeline', labels: ['token', 'attention', 'residual add', 'feedforward', 'output'] },
    debugScenarios: ['If shapes mismatch, check vector lengths before adding.', 'If residual is ignored, output will only reflect attentionOutput.'],
  },
  'kp-mini-gpt-text-generator': {
    dataset: 'Tiny next-token map for text generation.',
    starterCode: `const nextMap = {
  h: "i",
  i: "!",
  "!": " "
};

function generate(start, steps) {
  let text = start;
  let current = start;
  for (let i = 0; i < steps; i++) {
    current = "";
    text += current;
  }
  return text;
}`,
    testCases: [
      { name: 'generates one next token', expression: 'generate("h", 1)', expected: 'hi' },
      { name: 'generates two next tokens', expression: 'generate("h", 2)', expected: 'hi!' },
    ],
    visualization: { type: 'tokens', labels: ['h', 'i', '!', ' '] },
    debugScenarios: ['If generation repeats blanks, inspect how current is updated.', 'If text loses the prompt, inspect text accumulation.'],
  },
};

karpathyMilestones.forEach((milestone) => {
  Object.assign(milestone, executableProjects[milestone.id]);
});

export const karpathyPhases = [
  {
    id: 'mathematical-foundations',
    title: 'Mathematical Foundations',
    goal: 'Build the math vocabulary for functions, vectors, loss, and gradients.',
    prerequisiteSkills: ['Functions', 'Linear functions', 'Vectors', 'Derivatives', 'Loss'],
    lessonIds: ['math-inputs-and-outputs', 'math-linear-functions', 'math-derivative-rules', 'math-error-and-loss', 'math-vectors-as-arrows', 'math-dot-product'],
    labs: [{ title: 'Function Visualizer', href: '#labs' }, { title: 'Data & Model Playground', href: '#data-model-playground' }],
    buildChallengeIds: ['build-function-rule-builder', 'build-vector-similarity-sketch'],
    debugChallengeIds: ['debug-math-line-model', 'debug-ai-loss-average'],
    codeReadingChallengeIds: ['read-data-line-prediction', 'read-data-loss'],
    milestoneIds: ['kp-scalar-autodiff-engine'],
  },
  {
    id: 'computational-graphs',
    title: 'Computational Graphs',
    goal: 'Represent calculations as connected nodes so dependencies and backpropagation become visible.',
    prerequisiteSkills: ['Graphs', 'Objects', 'Functions', 'Debugging'],
    lessonIds: ['cs-objects-and-records', 'cs-graphs', 'cs-functions', 'cs-reading-error-messages'],
    labs: [{ title: 'Function Visualizer', href: '#labs' }],
    buildChallengeIds: ['build-flashcard-state-manager'],
    debugChallengeIds: ['debug-js-state-mutation', 'debug-js-sum-cart'],
    codeReadingChallengeIds: ['read-app-state-render', 'read-app-route'],
    milestoneIds: ['kp-computational-graph-visualizer'],
  },
  {
    id: 'gradient-descent',
    title: 'Gradient Descent',
    goal: 'Train tiny models by measuring error and stepping parameters downhill.',
    prerequisiteSkills: ['Loss', 'Gradient direction', 'Learning rate', 'Loops'],
    lessonIds: ['math-gradient-direction', 'math-learning-rate', 'cs-loss-functions', 'cs-training-and-validation'],
    labs: [{ title: 'Data & Model Playground', href: '#data-model-playground' }],
    buildChallengeIds: ['build-mini-ai-training-loop'],
    debugChallengeIds: ['debug-ai-loss-sign', 'debug-ai-loss-average'],
    codeReadingChallengeIds: ['read-ai-training-step', 'read-ai-epochs'],
    milestoneIds: ['kp-gradient-descent-trainer'],
  },
  {
    id: 'neural-networks',
    title: 'Neural Networks',
    goal: 'Compose neurons into nonlinear models that learn from examples.',
    prerequisiteSkills: ['Vectors', 'Dot product', 'Activation functions', 'Backpropagation'],
    lessonIds: ['math-matrices-as-transformations', 'math-model-fit-and-generalization', 'cs-features-and-labels', 'cs-loss-functions'],
    labs: [{ title: 'Data & Model Playground', href: '#data-model-playground' }],
    buildChallengeIds: ['build-vector-similarity-sketch', 'build-mini-ai-training-loop'],
    debugChallengeIds: ['debug-ai-loss-sign', 'debug-math-probability'],
    codeReadingChallengeIds: ['read-data-line-prediction', 'read-ai-training-step'],
    milestoneIds: ['kp-single-neuron-classifier', 'kp-mlp-from-scratch', 'kp-activation-function-explorer'],
  },
  {
    id: 'language-models',
    title: 'Language Models',
    goal: 'Turn text into tokens and train tiny next-token prediction systems.',
    prerequisiteSkills: ['Probability', 'Data structures', 'Sampling', 'Embeddings'],
    lessonIds: ['cs-tables-and-datasets', 'cs-features-and-labels', 'math-probability-as-long-run-frequency', 'language-explaining-complex-ideas-simply'],
    labs: [{ title: 'Algorithm Complexity Visualizer', href: '#labs' }],
    buildChallengeIds: ['build-search-algorithm', 'build-mini-ai-training-loop'],
    debugChallengeIds: ['debug-alg-linear-search', 'debug-alg-average'],
    codeReadingChallengeIds: ['read-alg-search', 'read-alg-filter', 'read-ai-epochs'],
    milestoneIds: ['kp-tokenizer-builder', 'kp-bigram-language-model', 'kp-embedding-visualizer'],
  },
  {
    id: 'transformers',
    title: 'Transformers',
    goal: 'Understand attention, transformer blocks, and tiny GPT-style generation.',
    prerequisiteSkills: ['Embeddings', 'Attention', 'Matrix operations', 'Training loops'],
    lessonIds: ['math-dot-product', 'math-matrices-as-transformations', 'cs-graphs', 'cs-apis-and-boundaries'],
    labs: [{ title: 'Data & Model Playground', href: '#data-model-playground' }],
    buildChallengeIds: ['build-vector-similarity-sketch', 'build-mini-ai-training-loop'],
    debugChallengeIds: ['debug-ai-loss-sign', 'debug-js-state-mutation'],
    codeReadingChallengeIds: ['read-ai-training-step', 'read-app-route'],
    milestoneIds: ['kp-attention-visualizer', 'kp-mini-transformer-block', 'kp-mini-gpt-text-generator'],
  },
];

export function nextKarpathyMilestone(progress = {}) {
  return karpathyMilestones.find((milestone) => progress[milestone.id]?.status !== 'complete') || null;
}
