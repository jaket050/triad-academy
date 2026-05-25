const feedbackSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    correctnessScore: { type: 'integer' },
    clarityScore: { type: 'integer' },
    missingConcepts: { type: 'array', items: { type: 'string' } },
    suggestions: { type: 'array', items: { type: 'string' } },
    strengths: { type: 'array', items: { type: 'string' } },
  },
  required: ['correctnessScore', 'clarityScore', 'missingConcepts', 'suggestions', 'strengths'],
};

const chatSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    reply: { type: 'string' },
    tutorMove: { type: 'string', enum: ['hint', 'question', 'reflection', 'next-step'] },
    suggestedQuestion: { type: 'string' },
  },
  required: ['reply', 'tutorMove', 'suggestedQuestion'],
};

function outputText(response) {
  if (response.output_text) return response.output_text;

  return (response.output || [])
    .flatMap((item) => item.content || [])
    .filter((content) => content.type === 'output_text' && content.text)
    .map((content) => content.text)
    .join('\n');
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, body: JSON.stringify({ error: 'OPENAI_API_KEY is not configured' }) };
    }

    const { mode, inputType, userInput, expectedConcept, contextTitle, userWork, messages } = JSON.parse(event.body || '{}');

    if (mode === 'chat') {
      if (!expectedConcept || !contextTitle || !Array.isArray(messages)) {
        return { statusCode: 400, body: JSON.stringify({ error: 'contextTitle, expectedConcept, and messages are required for chat mode' }) };
      }

      const recentMessages = messages
        .slice(-10)
        .filter((message) => ['user', 'assistant'].includes(message.role) && typeof message.content === 'string')
        .map((message) => ({
          role: message.role,
          content: message.content.slice(0, 1200),
        }));

      const response = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
          input: [
            {
              role: 'system',
              content:
                'You are Triad Academy AI Tutor in interactive mode. Guide the learner with hints, checks, and questions. Do not give the full answer immediately. If the learner asks for the answer, ask for their first step or give one small hint first. Be warm, concise, and beginner-friendly. Return JSON only.',
            },
            {
              role: 'user',
              content: JSON.stringify({
                contextTitle,
                expectedConcept,
                currentUserWork: userWork || '',
                instruction:
                  'Respond to the latest learner message. Prefer a hint or question over a direct solution. Help them compare their idea to the expected concept and choose a next step.',
              }),
            },
            ...recentMessages,
          ],
          text: {
            format: {
              type: 'json_schema',
              name: 'triad_ai_tutor_chat',
              strict: true,
              schema: chatSchema,
            },
          },
          max_output_tokens: 500,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return { statusCode: response.status, body: JSON.stringify({ error: errorText || response.statusText }) };
      }

      const data = await response.json();
      return { statusCode: 200, body: JSON.stringify(JSON.parse(outputText(data))) };
    }

    if (!userInput || !expectedConcept) {
      return { statusCode: 400, body: JSON.stringify({ error: 'userInput and expectedConcept are required' }) };
    }

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
        input: [
          {
            role: 'system',
            content:
              'You are Triad Academy AI Tutor. Give kind, specific feedback for a beginner. Grade only the submitted response against the expected concept. Return JSON only.',
          },
          {
            role: 'user',
            content: JSON.stringify({
              inputType,
              contextTitle,
              expectedConcept,
              userInput,
              rubric:
                'Correctness measures whether the idea matches the expected concept. Clarity measures whether the explanation is understandable. Missing concepts should be concrete. Suggestions should be short, actionable, and beginner-friendly.',
            }),
          },
        ],
        text: {
          format: {
            type: 'json_schema',
            name: 'triad_ai_feedback',
            strict: true,
            schema: feedbackSchema,
          },
        },
        max_output_tokens: 650,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { statusCode: response.status, body: JSON.stringify({ error: errorText || response.statusText }) };
    }

    const data = await response.json();
    return { statusCode: 200, body: JSON.stringify(JSON.parse(outputText(data))) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message || 'AI feedback failed' }) };
  }
}
