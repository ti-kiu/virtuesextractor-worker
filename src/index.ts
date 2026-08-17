// Soul Virtues Extractor - Cloudflare Worker API
import { questions } from './questions';
import { scoreQuiz, generateSummary, VirtueScores } from './scoring';
import { DeepSeekAPI } from './deepseek';

interface Env {
  DEEPSEEK_API_KEY: string;
  DEEPSEEK_API_URL: string;
  QUIZ_KV: KVNamespace;
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Helper to create JSON response
function jsonResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
}

// Generate unique ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Main worker handler
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // API Routes
      if (path === '/api/quiz/start' && request.method === 'POST') {
        return await handleQuizStart(env);
      }

      if (path === '/api/quiz/answer' && request.method === 'POST') {
        return await handleQuizAnswer(request, env);
      }

      if (path === '/api/quiz/result' && request.method === 'POST') {
        return await handleQuizResult(request, env);
      }

      if (path === '/api/ai/report' && request.method === 'POST') {
        return await handleAIReport(request, env);
      }

      if (path === '/api/ai/ask' && request.method === 'POST') {
        return await handleAIAsk(request, env);
      }

      if (path === '/api/ai/growth-plan' && request.method === 'POST') {
        return await handleGrowthPlan(request, env);
      }

      // Health check
      if (path === '/api/health') {
        return jsonResponse({ status: 'ok', timestamp: new Date().toISOString() });
      }

      // 404 for unknown routes
      return jsonResponse({ error: 'Not found' }, 404);

    } catch (error) {
      console.error('Worker error:', error);
      return jsonResponse({ error: 'Internal server error' }, 500);
    }
  }
};

// Start a new quiz
async function handleQuizStart(env: Env): Promise<Response> {
  const quizId = generateId();

  // Store quiz in KV (expires in 24 hours)
  await env.QUIZ_KV.put(quizId, JSON.stringify({
    id: quizId,
    answers: {},
    startedAt: new Date().toISOString()
  }), { expirationTtl: 86400 });

  // Return quiz ID and questions
  return jsonResponse({
    quizId,
    totalQuestions: questions.length,
    questions: questions.map(q => ({
      id: q.id,
      scenario: q.scenario,
      options: q.options.map(o => ({ text: o.text }))
    }))
  });
}

// Submit an answer
async function handleQuizAnswer(request: Request, env: Env): Promise<Response> {
  const { quizId, questionId, answerIndex } = await request.json() as {
    quizId: string;
    questionId: number;
    answerIndex: number;
  };

  if (!quizId || questionId === undefined || answerIndex === undefined) {
    return jsonResponse({ error: 'Missing required fields' }, 400);
  }

  // Get quiz from KV
  const quizData = await env.QUIZ_KV.get(quizId);
  if (!quizData) {
    return jsonResponse({ error: 'Quiz not found' }, 404);
  }

  const quiz = JSON.parse(quizData);

  // Validate question and answer
  const question = questions.find(q => q.id === questionId);
  if (!question) {
    return jsonResponse({ error: 'Invalid question ID' }, 400);
  }

  if (answerIndex < 0 || answerIndex >= question.options.length) {
    return jsonResponse({ error: 'Invalid answer index' }, 400);
  }

  // Store answer
  quiz.answers[questionId] = answerIndex;

  // Update quiz in KV
  await env.QUIZ_KV.put(quizId, JSON.stringify(quiz), { expirationTtl: 86400 });

  // Get next question
  const answeredIds = Object.keys(quiz.answers).map(Number);
  const nextQuestion = questions.find(q => !answeredIds.includes(q.id));

  return jsonResponse({
    success: true,
    answeredQuestions: answeredIds.length,
    totalQuestions: questions.length,
    nextQuestion: nextQuestion ? {
      id: nextQuestion.id,
      scenario: nextQuestion.scenario,
      options: nextQuestion.options.map(o => ({ text: o.text }))
    } : null,
    isComplete: !nextQuestion
  });
}

// Get quiz result
async function handleQuizResult(request: Request, env: Env): Promise<Response> {
  const { quizId } = await request.json() as { quizId: string };

  if (!quizId) {
    return jsonResponse({ error: 'Missing quiz ID' }, 400);
  }

  // Get quiz from KV
  const quizData = await env.QUIZ_KV.get(quizId);
  if (!quizData) {
    return jsonResponse({ error: 'Quiz not found' }, 404);
  }

  const quiz = JSON.parse(quizData);

  // Check if all questions answered
  if (Object.keys(quiz.answers).length < questions.length) {
    return jsonResponse({
      error: 'Quiz not complete',
      answeredQuestions: Object.keys(quiz.answers).length,
      totalQuestions: questions.length
    }, 400);
  }

  // Calculate scores
  const result = scoreQuiz(quiz.answers);
  const summary = generateSummary(result);

  // Store result in KV
  quiz.result = result;
  quiz.completedAt = new Date().toISOString();
  await env.QUIZ_KV.put(quizId, JSON.stringify(quiz), { expirationTtl: 86400 });

  return jsonResponse({
    quizId,
    result,
    summary
  });
}

// Generate AI report
async function handleAIReport(request: Request, env: Env): Promise<Response> {
  const { quizId } = await request.json() as { quizId: string };

  if (!quizId) {
    return jsonResponse({ error: 'Missing quiz ID' }, 400);
  }

  // Get quiz from KV
  const quizData = await env.QUIZ_KV.get(quizId);
  if (!quizData) {
    return jsonResponse({ error: 'Quiz not found' }, 404);
  }

  const quiz = JSON.parse(quizData);

  if (!quiz.result) {
    return jsonResponse({ error: 'Quiz not completed yet' }, 400);
  }

  // Initialize DeepSeek API
  const deepseek = new DeepSeekAPI(env.DEEPSEEK_API_KEY, env.DEEPSEEK_API_URL);

  try {
    const report = await deepseek.generateReport(
      quiz.result.percentages,
      quiz.result.primaryVirtue,
      quiz.result.secondaryVirtue
    );

    // Store report in KV
    quiz.report = report;
    await env.QUIZ_KV.put(quizId, JSON.stringify(quiz), { expirationTtl: 86400 });

    return jsonResponse({
      quizId,
      report
    });
  } catch (error) {
    console.error('DeepSeek API error:', error);
    return jsonResponse({ error: 'Failed to generate report' }, 500);
  }
}

// Handle follow-up questions
async function handleAIAsk(request: Request, env: Env): Promise<Response> {
  const { quizId, question, history = [] } = await request.json() as {
    quizId: string;
    question: string;
    history?: { role: 'user' | 'assistant'; content: string }[];
  };

  if (!quizId || !question) {
    return jsonResponse({ error: 'Missing required fields' }, 400);
  }

  // Get quiz from KV
  const quizData = await env.QUIZ_KV.get(quizId);
  if (!quizData) {
    return jsonResponse({ error: 'Quiz not found' }, 404);
  }

  const quiz = JSON.parse(quizData);

  if (!quiz.report) {
    return jsonResponse({ error: 'No report found. Generate a report first.' }, 400);
  }

  // Initialize DeepSeek API
  const deepseek = new DeepSeekAPI(env.DEEPSEEK_API_KEY, env.DEEPSEEK_API_URL);

  try {
    const answer = await deepseek.askFollowUp(
      quiz.report,
      question,
      history
    );

    return jsonResponse({
      answer,
      history: [
        ...history,
        { role: 'user', content: question },
        { role: 'assistant', content: answer }
      ]
    });
  } catch (error) {
    console.error('DeepSeek API error:', error);
    return jsonResponse({ error: 'Failed to get answer' }, 500);
  }
}

// Generate 30-day growth plan
async function handleGrowthPlan(request: Request, env: Env): Promise<Response> {
  const { quizId } = await request.json() as { quizId: string };

  if (!quizId) {
    return jsonResponse({ error: 'Missing quiz ID' }, 400);
  }

  // Get quiz from KV
  const quizData = await env.QUIZ_KV.get(quizId);
  if (!quizData) {
    return jsonResponse({ error: 'Quiz not found' }, 404);
  }

  const quiz = JSON.parse(quizData);

  if (!quiz.result) {
    return jsonResponse({ error: 'Quiz not completed yet' }, 400);
  }

  // Find lowest virtue
  const percentages = quiz.result.percentages;
  const lowestVirtue = Object.entries(percentages)
    .sort(([, a], [, b]) => (a as number) - (b as number))[0][0];
  const lowestPercentage = percentages[lowestVirtue];

  // Initialize DeepSeek API
  const deepseek = new DeepSeekAPI(env.DEEPSEEK_API_KEY, env.DEEPSEEK_API_URL);

  try {
    const growthPlan = await deepseek.generateGrowthPlan(lowestVirtue, lowestPercentage);

    // Store growth plan in KV
    quiz.growthPlan = growthPlan;
    await env.QUIZ_KV.put(quizId, JSON.stringify(quiz), { expirationTtl: 86400 });

    return jsonResponse({
      quizId,
      lowestVirtue,
      lowestPercentage,
      growthPlan
    });
  } catch (error) {
    console.error('DeepSeek API error:', error);
    return jsonResponse({ error: 'Failed to generate growth plan' }, 500);
  }
}
