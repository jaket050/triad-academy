import React, { useState, useEffect } from 'react';
import { SelfGradeButtons, ReinforcementPanel } from './shared.js';
const h = React.createElement;

export function normalizedWords(value) {
  return (value || '')
    .toLowerCase()
    .replace(/[^a-z0-9+\-*/=\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

export function coreIdeaCatalog() {
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

export function termAppears(text, words, term) {
  const lower = text.toLowerCase();
  if (term.length <= 2 || /[+\-*/=]/.test(term) || term.includes(' ')) return lower.includes(term);
  return words.includes(term);
}

export function analyzeFallbackAnswer(userInput, expectedConcept) {
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

export function scoreFromKeywords(userInput, expectedConcept) {
  return analyzeFallbackAnswer(userInput, expectedConcept).correctnessScore;
}

export function basicAiFallback(userInput, expectedConcept) {
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

export function localTutorReply(message, expectedConcept) {
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

export function AiTutorChat({ chatId, contextTitle, expectedConcept, userWork = '', chatStore }) {
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

export function FeedbackList({ title, items, empty }) {
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

export function AiFeedbackPanel({ inputType, userInput, expectedConcept, contextTitle, fallbackFeedback }) {
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

export function PredictionPanel({ itemId, prompt, predictionStore, children, expectedIdea }) {
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