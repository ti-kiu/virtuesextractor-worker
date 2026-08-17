// Scoring algorithm for Soul Virtues Extractor
import { questions, virtueNames } from './questions';

export interface VirtueScores {
  determination: number;
  bravery: number;
  justice: number;
  kindness: number;
  patience: number;
  integrity: number;
  perseverance: number;
}

export interface QuizResult {
  scores: VirtueScores;
  percentages: VirtueScores;
  primaryVirtue: string;
  secondaryVirtue: string;
  totalQuestions: number;
  answeredQuestions: number;
}

// Calculate raw scores from answers
export function calculateScores(answers: Record<number, number>): VirtueScores {
  const scores: VirtueScores = {
    determination: 0,
    bravery: 0,
    justice: 0,
    kindness: 0,
    patience: 0,
    integrity: 0,
    perseverance: 0
  };

  // Count max possible score per virtue
  const maxScores: VirtueScores = {
    determination: 0,
    bravery: 0,
    justice: 0,
    kindness: 0,
    patience: 0,
    integrity: 0,
    perseverance: 0
  };

  // Calculate raw scores and max possible scores
  questions.forEach(question => {
    const answerIndex = answers[question.id];
    if (answerIndex !== undefined && question.options[answerIndex]) {
      const selectedOption = question.options[answerIndex];
      Object.entries(selectedOption.scores).forEach(([virtue, score]) => {
        if (virtue in scores) {
          scores[virtue as keyof VirtueScores] += score;
        }
      });
    }

    // Calculate max possible score for each virtue from this question
    question.options.forEach(option => {
      Object.entries(option.scores).forEach(([virtue, score]) => {
        if (virtue in maxScores) {
          maxScores[virtue as keyof VirtueScores] = Math.max(
            maxScores[virtue as keyof VirtueScores],
            score
          );
        }
      });
    });
  });

  return scores;
}

// Calculate percentages (0-100)
export function calculatePercentages(scores: VirtueScores): VirtueScores {
  // Max possible score per virtue across all questions
  const maxPossible: VirtueScores = {
    determination: 0,
    bravery: 0,
    justice: 0,
    kindness: 0,
    patience: 0,
    integrity: 0,
    perseverance: 0
  };

  // Calculate max possible for each virtue
  questions.forEach(question => {
    question.options.forEach(option => {
      Object.entries(option.scores).forEach(([virtue, score]) => {
        if (virtue in maxPossible) {
          maxPossible[virtue as keyof VirtueScores] += score;
        }
      });
    });
  });

  // Calculate percentages
  const percentages: VirtueScores = {
    determination: 0,
    bravery: 0,
    justice: 0,
    kindness: 0,
    patience: 0,
    integrity: 0,
    perseverance: 0
  };

  Object.keys(scores).forEach(virtue => {
    const key = virtue as keyof VirtueScores;
    if (maxPossible[key] > 0) {
      percentages[key] = Math.round((scores[key] / maxPossible[key]) * 100);
    }
  });

  return percentages;
}

// Get primary and secondary virtues
export function getTopVirtues(percentages: VirtueScores): { primary: string; secondary: string } {
  const sorted = Object.entries(percentages)
    .sort(([, a], [, b]) => b - a);

  return {
    primary: sorted[0][0],
    secondary: sorted[1][0]
  };
}

// Main scoring function
export function scoreQuiz(answers: Record<number, number>): QuizResult {
  const scores = calculateScores(answers);
  const percentages = calculatePercentages(scores);
  const { primary, secondary } = getTopVirtues(percentages);

  return {
    scores,
    percentages,
    primaryVirtue: primary,
    secondaryVirtue: secondary,
    totalQuestions: questions.length,
    answeredQuestions: Object.keys(answers).length
  };
}

// Generate a text summary of the result
export function generateSummary(result: QuizResult): string {
  const { percentages, primaryVirtue, secondaryVirtue } = result;

  const sortedVirtues = Object.entries(percentages)
    .sort(([, a], [, b]) => b - a);

  let summary = `Your Soul Virtues Profile:\n\n`;

  sortedVirtues.forEach(([virtue, percentage]) => {
    const name = virtueNames[virtue as keyof typeof virtueNames];
    const bar = '█'.repeat(Math.floor(percentage / 5)) + '░'.repeat(20 - Math.floor(percentage / 5));
    summary += `${name.padEnd(15)} ${bar} ${percentage}%\n`;
  });

  summary += `\nPrimary Virtue: ${virtueNames[primaryVirtue as keyof typeof virtueNames]}\n`;
  summary += `Secondary Virtue: ${virtueNames[secondaryVirtue as keyof typeof virtueNames]}\n`;

  return summary;
}
