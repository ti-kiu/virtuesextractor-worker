// DeepSeek API integration for Soul Virtues Extractor
import { VirtueScores } from './scoring';
import { virtueNames, virtueDescriptions } from './questions';

interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface DeepSeekResponse {
  id: string;
  choices: {
    message: {
      content: string;
    };
  }[];
}

export class DeepSeekAPI {
  private apiKey: string;
  private apiUrl: string;

  constructor(apiKey: string, apiUrl: string = 'https://api.deepseek.com') {
    this.apiKey = apiKey;
    this.apiUrl = apiUrl;
  }

  async chat(messages: DeepSeekMessage[], maxTokens: number = 2000): Promise<string> {
    const response = await fetch(`${this.apiUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        temperature: 0.7,
        max_tokens: maxTokens
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data: DeepSeekResponse = await response.json();
    return data.choices[0].message.content;
  }

  // Generate AI report based on virtue scores
  async generateReport(
    percentages: VirtueScores,
    primaryVirtue: string,
    secondaryVirtue: string
  ): Promise<string> {
    const sortedVirtues = Object.entries(percentages)
      .sort(([, a], [, b]) => b - a);

    const virtueList = sortedVirtues
      .map(([virtue, pct]) => `${virtueNames[virtue as keyof typeof virtueNames]}: ${pct}%`)
      .join('\n');

    const systemPrompt = `You are a wise and empathetic soul analyst. Your role is to provide deep, personalized insights based on someone's soul virtues profile.

You speak with warmth, wisdom, and genuine care. You avoid generic statements and instead provide specific, actionable insights that feel personal.

Your analysis should:
1. Acknowledge their strengths with specific examples of how they manifest
2. Gently explore their lower virtues as growth opportunities
3. Connect their virtue profile to real-life scenarios
4. Offer a balanced perspective that celebrates their unique combination
5. End with an encouraging message about their potential

Keep the tone conversational but profound. Use metaphors and imagery that resonate with the "soul" theme.

Format: Use paragraphs, not bullet points. Keep it under 400 words.`;

    const userPrompt = `Here is my soul virtues profile:

${virtueList}

My primary virtue is ${virtueNames[primaryVirtue as keyof typeof virtueNames]} (${percentages[primaryVirtue as keyof typeof percentages]}%).
My secondary virtue is ${virtueNames[secondaryVirtue as keyof typeof virtueNames]} (${percentages[secondaryVirtue as keyof typeof percentages]}%).

Please provide a deep, personalized analysis of my soul virtues profile. Help me understand what these scores mean for my life, relationships, and personal growth.`;

    return this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]);
  }

  // Answer follow-up questions about the report
  async askFollowUp(
    reportContext: string,
    question: string,
    conversationHistory: DeepSeekMessage[] = []
  ): Promise<string> {
    const systemPrompt = `You are a wise and empathetic soul analyst continuing a conversation about someone's soul virtues profile. 

You have access to their report and should reference it when relevant. Be conversational, warm, and insightful. Keep responses concise but meaningful (under 200 words).

Previous report context:
${reportContext}`;

    const messages: DeepSeekMessage[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: question }
    ];

    return this.chat(messages);
  }

  // Generate a 30-day growth plan based on lowest virtue
  async generateGrowthPlan(
    lowestVirtue: string,
    lowestPercentage: number
  ): Promise<string> {
    const virtueName = virtueNames[lowestVirtue as keyof typeof virtueNames];
    const virtueDesc = virtueDescriptions[lowestVirtue as keyof typeof virtueDescriptions];

    const systemPrompt = `You are a personal growth coach specializing in virtue development. Create a practical, achievable 30-day growth plan.

Your plan should:
1. Start with small, easy actions and gradually increase difficulty
2. Include daily micro-practices (5-10 minutes)
3. Provide weekly themes and milestones
4. Be specific and actionable
5. Include reflection prompts
6. Be encouraging and realistic

Format as a day-by-day plan with clear instructions. Keep it concise but comprehensive.`;

    const userPrompt = `Create a 30-day growth plan for someone whose lowest virtue is ${virtueName} (${lowestPercentage}%).

Virtue description: ${virtueDesc}

Please provide a structured plan that helps them develop this virtue through daily practice. Include specific actions, reflection prompts, and weekly milestones.`;

    return this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ], 4000);
  }

  // Generate couple compatibility report
  async generateCoupleMatchReport(
    profileAPercentages: VirtueScores,
    profileAName: string,
    profileBPercentages: VirtueScores,
    profileBName: string
  ): Promise<string> {
    const formatProfile = (name: string, pcts: VirtueScores) => {
      const sorted = Object.entries(pcts).sort(([, a], [, b]) => b - a);
      const list = sorted
        .map(([v, pct]) => `${virtueNames[v as keyof typeof virtueNames]}: ${pct}%`)
        .join('\n');
      return `${name}:\n${list}`;
    };

    const systemPrompt = `You are a relationship compatibility analyst specializing in virtue-based soul connections. Your role is to analyze how two people's soul virtue profiles complement each other.

Your analysis should:
1. Highlight complementary virtues and how they strengthen the relationship
2. Identify potential friction points where virtues may clash
3. Explain how each person's strengths can support the other's growth
4. Provide a compatibility summary with specific insights
5. Offer practical advice for deepening the connection

Be warm, insightful, and encouraging. Use metaphors that resonate with the "soul connection" theme.
Keep the tone conversational but profound. Format in paragraphs, not bullet points. Under 500 words.`;

    const userPrompt = `Here are the soul virtue profiles of two people:

${formatProfile(profileAName, profileAPercentages)}

${formatProfile(profileBName, profileBPercentages)}

Please provide a deep compatibility analysis. How do their virtue profiles complement each other? What are the strengths of this connection? What should they be mindful of?`;

    return this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]);
  }

  // Generate family circle report
  async generateFamilyReport(
    profiles: { name: string; percentages: VirtueScores }[]
  ): Promise<string> {
    const formatProfile = (p: { name: string; percentages: VirtueScores }) => {
      const sorted = Object.entries(p.percentages).sort(([, a], [, b]) => b - a);
      const list = sorted
        .map(([v, pct]) => `  ${virtueNames[v as keyof typeof virtueNames]}: ${pct}%`)
        .join('\n');
      return `${p.name}:\n${list}`;
    };

    const profileList = profiles.map(formatProfile).join('\n\n');

    const systemPrompt = `You are a family dynamics analyst specializing in virtue-based soul connections. Your role is to analyze how a family's virtue profiles create a unique family dynamic.

Your analysis should:
1. Identify the family's collective strengths (shared high virtues)
2. Highlight how each member's unique virtues contribute to the family
3. Identify potential areas of tension and how to navigate them
4. Describe the family's overall "soul signature"
5. Provide actionable advice for family harmony and mutual growth

Be warm, celebratory, and insightful. Use metaphors that resonate with the "soul family" theme.
Keep the tone conversational but profound. Format in paragraphs, not bullet points. Under 600 words.`;

    const userPrompt = `Here are the soul virtue profiles of a family:

${profileList}

Please analyze this family's virtue dynamics. How do their profiles complement each other? What is the family's collective strength? How can they support each other's growth?`;

    return this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ], 3000);
  }

  // Generate team building report
  async generateTeamReport(
    profiles: { name: string; percentages: VirtueScores }[]
  ): Promise<string> {
    const formatProfile = (p: { name: string; percentages: VirtueScores }) => {
      const sorted = Object.entries(p.percentages).sort(([, a], [, b]) => b - a);
      const top3 = sorted.slice(0, 3)
        .map(([v, pct]) => `${virtueNames[v as keyof typeof virtueNames]}: ${pct}%`)
        .join(', ');
      return `${p.name} — Top: ${top3}`;
    };

    const profileList = profiles.map(formatProfile).join('\n');

    // Calculate team averages
    const teamAverages: VirtueScores = {
      determination: 0, bravery: 0, justice: 0, kindness: 0,
      patience: 0, integrity: 0, perseverance: 0
    };
    for (const p of profiles) {
      for (const key of Object.keys(teamAverages) as (keyof VirtueScores)[]) {
        teamAverages[key] += p.percentages[key];
      }
    }
    for (const key of Object.keys(teamAverages) as (keyof VirtueScores)[]) {
      teamAverages[key] = Math.round(teamAverages[key] / profiles.length);
    }
    const avgSorted = Object.entries(teamAverages).sort(([, a], [, b]) => b - a);
    const teamStrengths = avgSorted.slice(0, 3)
      .map(([v, pct]) => `${virtueNames[v as keyof typeof virtueNames]}: ${pct}% avg`)
      .join(', ');
    const teamWeaknesses = avgSorted.slice(-2)
      .map(([v, pct]) => `${virtueNames[v as keyof typeof virtueNames]}: ${pct}% avg`)
      .join(', ');

    const systemPrompt = `You are a team dynamics analyst specializing in virtue-based team composition. Your role is to analyze how a team's collective virtue profiles affect team performance and dynamics.

Your analysis should:
1. Identify the team's collective strengths and how they manifest at work
2. Highlight each member's unique contribution to the team
3. Identify gaps or areas where the team may need external support
4. Suggest optimal role alignments based on virtue profiles
5. Provide actionable team-building recommendations

Be professional yet warm, insightful, and practical. Format in paragraphs, not bullet points. Under 500 words.`;

    const userPrompt = `Here are the soul virtue profiles of a team (${profiles.length} members):

${profileList}

Team strengths (highest avg virtues): ${teamStrengths}
Team growth areas (lowest avg virtues): ${teamWeaknesses}

Please analyze this team's dynamics. How can their virtue profiles be leveraged for peak performance? What are the blind spots? How should they structure collaboration?`;

    return this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ], 3000);
  }
}
