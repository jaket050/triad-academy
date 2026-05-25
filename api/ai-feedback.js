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

async function parseBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body);

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}

function outputText(response) {
  if (response.output_text) return response.output_text;

  return (response.output || [])
    .flatMap((item) => item.content || [])
    .filter((content) => content.type === 'output_text' && content.text)
    .map((content) => content.text)
    .join('\n');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: 'OPENAI_API_KEY is not configured' });
      return;
    }

    const payload = await parseBody(req);
    const { mode, inputType, userInput, expectedConcept, contextTitle, userWork, messages } = payload;

    if (mode === 'chat') {
      if (!expectedConcept || !contextTitle || !Array.isArray(messages)) {
        res.status(400).json({ error: 'contextTitle, expectedConcept, and messages are required for chat mode' });
        return;
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
        res.status(response.status).json({ error: errorText || response.statusText });
        return;
      }

      const data = await response.json();
      res.status(200).json(JSON.parse(outputText(data)));
      return;
    }

    if (!userInput || !expectedConcept) {
      res.status(400).json({ error: 'userInput and expectedConcept are required' });
      return;
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
      res.status(response.status).json({ error: errorText || response.statusText });
      return;
    }

    const data = await response.json();
    res.status(200).json(JSON.parse(outputText(data)));
  } catch (error) {
    res.status(500).json({ error: error.message || 'AI feedback failed' });
  }
}
