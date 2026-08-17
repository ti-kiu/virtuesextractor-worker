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

  async chat(messages: DeepSeekMessage[]): Promise<string> {
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
        max_tokens: 2000
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

My primary virtue is ${virtueNames[primaryVirtue as keyof typeof virtueNames]} (${percentages[primaryVirtue as keyof typeof VirtueScores]}%).
My secondary virtue is ${virtueNames[secondaryVirtue as keyof typeof virtueNames]} (${percentages[secondaryVirtue as keyof typeof VirtueScores]}%).

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
    ]);
  }
}
