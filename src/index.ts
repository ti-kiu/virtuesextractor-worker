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

      // Share routes
      if (path === '/api/share/create' && request.method === 'POST') {
        return await handleShareCreate(request, env);
      }

      if (path.startsWith('/api/share/') && request.method === 'GET') {
        const shareId = path.split('/api/share/')[1];
        if (shareId) return await handleShareGet(shareId, env);
      }

      // Family circle routes
      if (path === '/api/family/create' && request.method === 'POST') {
        return await handleFamilyCreate(request, env);
      }

      if (path === '/api/family/join' && request.method === 'POST') {
        return await handleFamilyJoin(request, env);
      }

      if (path === '/api/family/analyze' && request.method === 'POST') {
        return await handleFamilyAnalyze(request, env);
      }

      // Couple match routes
      if (path === '/api/couple/match' && request.method === 'POST') {
        return await handleCoupleMatch(request, env);
      }

      if (path === '/api/couple/analyze' && request.method === 'POST') {
        return await handleCoupleAnalyze(request, env);
      }

      // Team building routes
      if (path === '/api/team/create' && request.method === 'POST') {
        return await handleTeamCreate(request, env);
      }

      if (path === '/api/team/add-member' && request.method === 'POST') {
        return await handleTeamAddMember(request, env);
      }

      if (path === '/api/team/analyze' && request.method === 'POST') {
        return await handleTeamAnalyze(request, env);
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

// ============================================================
// SHARE ENDPOINTS
// ============================================================

// Create a shareable link for a quiz result
async function handleShareCreate(request: Request, env: Env): Promise<Response> {
  const { quizId } = await request.json() as { quizId: string };

  if (!quizId) {
    return jsonResponse({ error: 'Missing quiz ID' }, 400);
  }

  const quizData = await env.QUIZ_KV.get(quizId);
  if (!quizData) {
    return jsonResponse({ error: 'Quiz not found' }, 404);
  }

  const quiz = JSON.parse(quizData);

  if (!quiz.result) {
    return jsonResponse({ error: 'Quiz not completed yet' }, 400);
  }

  const shareId = generateId();

  await env.QUIZ_KV.put(`share:${shareId}`, JSON.stringify({
    shareId,
    quizId,
    result: quiz.result,
    summary: quiz.report || null,
    createdAt: new Date().toISOString()
  }), { expirationTtl: 604800 });

  return jsonResponse({
    shareId,
    shareUrl: `https://soulvirtues-api.fuyuanzeng520.workers.dev/api/share/${shareId}`
  });
}

// Get a shared result by share ID
async function handleShareGet(shareId: string, env: Env): Promise<Response> {
  const shareData = await env.QUIZ_KV.get(`share:${shareId}`);

  if (!shareData) {
    return jsonResponse({ error: 'Shared result not found or expired' }, 404);
  }

  const share = JSON.parse(shareData);

  return jsonResponse({
    shareId: share.shareId,
    result: share.result,
    summary: share.summary,
    createdAt: share.createdAt
  });
}

// ============================================================
// FAMILY CIRCLE ENDPOINTS
// ============================================================

// Create a family circle
async function handleFamilyCreate(request: Request, env: Env): Promise<Response> {
  const { quizId, name } = await request.json() as { quizId: string; name: string };

  if (!quizId) {
    return jsonResponse({ error: 'Missing quiz ID' }, 400);
  }

  const quizData = await env.QUIZ_KV.get(quizId);
  if (!quizData) {
    return jsonResponse({ error: 'Quiz not found' }, 404);
  }

  const quiz = JSON.parse(quizData);

  if (!quiz.result) {
    return jsonResponse({ error: 'Quiz not completed yet' }, 400);
  }

  const familyId = generateId();
  const memberName = name || 'Member 1';

  await env.QUIZ_KV.put(`family:${familyId}`, JSON.stringify({
    familyId,
    members: [{
      name: memberName,
      quizId,
      percentages: quiz.result.percentages,
      primaryVirtue: quiz.result.primaryVirtue,
      secondaryVirtue: quiz.result.secondaryVirtue,
      joinedAt: new Date().toISOString()
    }],
    createdAt: new Date().toISOString()
  }), { expirationTtl: 604800 });

  return jsonResponse({
    familyId,
    members: [{ name: memberName, primaryVirtue: quiz.result.primaryVirtue }],
    message: 'Family circle created. Share the familyId to invite others.'
  });
}

// Join an existing family circle
async function handleFamilyJoin(request: Request, env: Env): Promise<Response> {
  const { familyId, quizId, name } = await request.json() as {
    familyId: string; quizId: string; name: string;
  };

  if (!familyId || !quizId) {
    return jsonResponse({ error: 'Missing required fields' }, 400);
  }

  const familyData = await env.QUIZ_KV.get(`family:${familyId}`);
  if (!familyData) {
    return jsonResponse({ error: 'Family circle not found' }, 404);
  }

  const quizData = await env.QUIZ_KV.get(quizId);
  if (!quizData) {
    return jsonResponse({ error: 'Quiz not found' }, 404);
  }

  const family = JSON.parse(familyData);
  const quiz = JSON.parse(quizData);

  if (!quiz.result) {
    return jsonResponse({ error: 'Quiz not completed yet' }, 400);
  }

  if (family.members.some((m: any) => m.quizId === quizId)) {
    return jsonResponse({ error: 'This quiz result is already in the family circle' }, 400);
  }

  if (family.members.length >= 10) {
    return jsonResponse({ error: 'Family circle is full (max 10 members)' }, 400);
  }

  const memberName = name || `Member ${family.members.length + 1}`;

  family.members.push({
    name: memberName,
    quizId,
    percentages: quiz.result.percentages,
    primaryVirtue: quiz.result.primaryVirtue,
    secondaryVirtue: quiz.result.secondaryVirtue,
    joinedAt: new Date().toISOString()
  });

  await env.QUIZ_KV.put(`family:${familyId}`, JSON.stringify(family), { expirationTtl: 604800 });

  return jsonResponse({
    familyId,
    memberCount: family.members.length,
    members: family.members.map((m: any) => ({ name: m.name, primaryVirtue: m.primaryVirtue })),
    message: `${memberName} joined the family circle!`
  });
}

// Generate AI family analysis
async function handleFamilyAnalyze(request: Request, env: Env): Promise<Response> {
  const { familyId } = await request.json() as { familyId: string };

  if (!familyId) {
    return jsonResponse({ error: 'Missing family ID' }, 400);
  }

  const familyData = await env.QUIZ_KV.get(`family:${familyId}`);
  if (!familyData) {
    return jsonResponse({ error: 'Family circle not found' }, 404);
  }

  const family = JSON.parse(familyData);

  if (family.members.length < 2) {
    return jsonResponse({ error: 'Need at least 2 members for family analysis' }, 400);
  }

  const deepseek = new DeepSeekAPI(env.DEEPSEEK_API_KEY, env.DEEPSEEK_API_URL);

  try {
    const report = await deepseek.generateFamilyReport(
      family.members.map((m: any) => ({ name: m.name, percentages: m.percentages }))
    );

    family.report = report;
    family.reportGeneratedAt = new Date().toISOString();
    await env.QUIZ_KV.put(`family:${familyId}`, JSON.stringify(family), { expirationTtl: 604800 });

    return jsonResponse({ familyId, report, memberCount: family.members.length });
  } catch (error) {
    console.error('DeepSeek API error:', error);
    return jsonResponse({ error: 'Failed to generate family analysis' }, 500);
  }
}

// ============================================================
// COUPLE MATCH ENDPOINTS
// ============================================================

// Compare two quiz results for couple compatibility
async function handleCoupleMatch(request: Request, env: Env): Promise<Response> {
  const { quizIdA, quizIdB, nameA, nameB } = await request.json() as {
    quizIdA: string; quizIdB: string; nameA?: string; nameB?: string;
  };

  if (!quizIdA || !quizIdB) {
    return jsonResponse({ error: 'Missing both quiz IDs' }, 400);
  }

  const [quizDataA, quizDataB] = await Promise.all([
    env.QUIZ_KV.get(quizIdA),
    env.QUIZ_KV.get(quizIdB)
  ]);

  if (!quizDataA || !quizDataB) {
    return jsonResponse({ error: 'One or both quizzes not found' }, 404);
  }

  const quizA = JSON.parse(quizDataA);
  const quizB = JSON.parse(quizDataB);

  if (!quizA.result || !quizB.result) {
    return jsonResponse({ error: 'Both quizzes must be completed' }, 400);
  }

  const percentagesA = quizA.result.percentages as Record<string, number>;
  const percentagesB = quizB.result.percentages as Record<string, number>;
  const virtues = Object.keys(percentagesA);
  let totalDiff = 0;
  const virtueCompatibility: Record<string, number> = {};

  for (const virtue of virtues) {
    const diff = Math.abs(percentagesA[virtue] - percentagesB[virtue]);
    totalDiff += diff;
    virtueCompatibility[virtue] = Math.round(100 - diff);
  }

  const overallCompatibility = Math.round(100 - (totalDiff / virtues.length));
  const complementaryVirtues = virtues.filter(v => virtueCompatibility[v] >= 80);
  const frictionVirtues = virtues.filter(v => virtueCompatibility[v] < 50);

  return jsonResponse({
    matchId: generateId(),
    personA: { name: nameA || 'Person A', percentages: quizA.result.percentages, primaryVirtue: quizA.result.primaryVirtue },
    personB: { name: nameB || 'Person B', percentages: quizB.result.percentages, primaryVirtue: quizB.result.primaryVirtue },
    compatibility: {
      overall: overallCompatibility,
      byVirtue: virtueCompatibility,
      complementary: complementaryVirtues,
      frictionPoints: frictionVirtues
    }
  });
}

// Generate AI couple compatibility analysis
async function handleCoupleAnalyze(request: Request, env: Env): Promise<Response> {
  const { quizIdA, quizIdB, nameA, nameB } = await request.json() as {
    quizIdA: string; quizIdB: string; nameA?: string; nameB?: string;
  };

  if (!quizIdA || !quizIdB) {
    return jsonResponse({ error: 'Missing both quiz IDs' }, 400);
  }

  const [quizDataA, quizDataB] = await Promise.all([
    env.QUIZ_KV.get(quizIdA),
    env.QUIZ_KV.get(quizIdB)
  ]);

  if (!quizDataA || !quizDataB) {
    return jsonResponse({ error: 'One or both quizzes not found' }, 404);
  }

  const quizA = JSON.parse(quizDataA);
  const quizB = JSON.parse(quizDataB);

  if (!quizA.result || !quizB.result) {
    return jsonResponse({ error: 'Both quizzes must be completed' }, 400);
  }

  const deepseek = new DeepSeekAPI(env.DEEPSEEK_API_KEY, env.DEEPSEEK_API_URL);

  try {
    const report = await deepseek.generateCoupleMatchReport(
      quizA.result.percentages, nameA || 'Person A',
      quizB.result.percentages, nameB || 'Person B'
    );

    const coupleId = generateId();
    await env.QUIZ_KV.put(`couple:${coupleId}`, JSON.stringify({
      coupleId, quizIdA, quizIdB, report,
      createdAt: new Date().toISOString()
    }), { expirationTtl: 604800 });

    return jsonResponse({ coupleId, report });
  } catch (error) {
    console.error('DeepSeek API error:', error);
    return jsonResponse({ error: 'Failed to generate couple analysis' }, 500);
  }
}

// ============================================================
// TEAM BUILDING ENDPOINTS
// ============================================================

// Create a team for team building analysis
async function handleTeamCreate(request: Request, env: Env): Promise<Response> {
  const { quizId, name, teamName } = await request.json() as {
    quizId: string; name: string; teamName?: string;
  };

  if (!quizId) {
    return jsonResponse({ error: 'Missing quiz ID' }, 400);
  }

  const quizData = await env.QUIZ_KV.get(quizId);
  if (!quizData) {
    return jsonResponse({ error: 'Quiz not found' }, 404);
  }

  const quiz = JSON.parse(quizData);

  if (!quiz.result) {
    return jsonResponse({ error: 'Quiz not completed yet' }, 400);
  }

  const teamId = generateId();
  const memberName = name || 'Member 1';

  await env.QUIZ_KV.put(`team:${teamId}`, JSON.stringify({
    teamId,
    teamName: teamName || 'My Team',
    members: [{
      name: memberName,
      quizId,
      percentages: quiz.result.percentages,
      primaryVirtue: quiz.result.primaryVirtue,
      secondaryVirtue: quiz.result.secondaryVirtue,
      addedAt: new Date().toISOString()
    }],
    createdAt: new Date().toISOString()
  }), { expirationTtl: 604800 });

  return jsonResponse({
    teamId,
    teamName: teamName || 'My Team',
    members: [{ name: memberName, primaryVirtue: quiz.result.primaryVirtue }],
    message: 'Team created. Share the teamId to invite others.'
  });
}

// Add a member to an existing team
async function handleTeamAddMember(request: Request, env: Env): Promise<Response> {
  const { teamId, quizId, name } = await request.json() as {
    teamId: string; quizId: string; name: string;
  };

  if (!teamId || !quizId) {
    return jsonResponse({ error: 'Missing required fields' }, 400);
  }

  const teamData = await env.QUIZ_KV.get(`team:${teamId}`);
  if (!teamData) {
    return jsonResponse({ error: 'Team not found' }, 404);
  }

  const quizData = await env.QUIZ_KV.get(quizId);
  if (!quizData) {
    return jsonResponse({ error: 'Quiz not found' }, 404);
  }

  const team = JSON.parse(teamData);
  const quiz = JSON.parse(quizData);

  if (!quiz.result) {
    return jsonResponse({ error: 'Quiz not completed yet' }, 400);
  }

  if (team.members.some((m: any) => m.quizId === quizId)) {
    return jsonResponse({ error: 'This quiz result is already in the team' }, 400);
  }

  if (team.members.length >= 20) {
    return jsonResponse({ error: 'Team is full (max 20 members)' }, 400);
  }

  const memberName = name || `Member ${team.members.length + 1}`;

  team.members.push({
    name: memberName,
    quizId,
    percentages: quiz.result.percentages,
    primaryVirtue: quiz.result.primaryVirtue,
    secondaryVirtue: quiz.result.secondaryVirtue,
    addedAt: new Date().toISOString()
  });

  await env.QUIZ_KV.put(`team:${teamId}`, JSON.stringify(team), { expirationTtl: 604800 });

  return jsonResponse({
    teamId,
    teamName: team.teamName,
    memberCount: team.members.length,
    members: team.members.map((m: any) => ({ name: m.name, primaryVirtue: m.primaryVirtue })),
    message: `${memberName} joined the team!`
  });
}

// Generate AI team building analysis
async function handleTeamAnalyze(request: Request, env: Env): Promise<Response> {
  const { teamId } = await request.json() as { teamId: string };

  if (!teamId) {
    return jsonResponse({ error: 'Missing team ID' }, 400);
  }

  const teamData = await env.QUIZ_KV.get(`team:${teamId}`);
  if (!teamData) {
    return jsonResponse({ error: 'Team not found' }, 404);
  }

  const team = JSON.parse(teamData);

  if (team.members.length < 2) {
    return jsonResponse({ error: 'Need at least 2 members for team analysis' }, 400);
  }

  const deepseek = new DeepSeekAPI(env.DEEPSEEK_API_KEY, env.DEEPSEEK_API_URL);

  try {
    const report = await deepseek.generateTeamReport(
      team.members.map((m: any) => ({ name: m.name, percentages: m.percentages }))
    );

    team.report = report;
    team.reportGeneratedAt = new Date().toISOString();
    await env.QUIZ_KV.put(`team:${teamId}`, JSON.stringify(team), { expirationTtl: 604800 });

    return jsonResponse({ teamId, teamName: team.teamName, report, memberCount: team.members.length });
  } catch (error) {
    console.error('DeepSeek API error:', error);
    return jsonResponse({ error: 'Failed to generate team analysis' }, 500);
  }
}
