import { PrenomData } from '@/types';

/**
 * Score weights for each mention type
 */
export const MENTION_WEIGHTS = {
  sm: 0,
  ab: 4,
  b: 6,
  tb: 8,
  fel: 10,
} as const;

/**
 * Calculate the average score for a prenom based on mention rates
 */
export const calculateAverageScore = (data: PrenomData): number => {
  return (
    data.taux_sm * MENTION_WEIGHTS.sm +
    data.taux_ab * MENTION_WEIGHTS.ab +
    data.taux_b * MENTION_WEIGHTS.b +
    data.taux_tb * MENTION_WEIGHTS.tb +
    data.taux_fel * MENTION_WEIGHTS.fel
  );
};

/**
 * Calculate the average score for a specific mention type
 */
export const calculateMentionScore = (
  data: PrenomData,
  mentionType: keyof typeof MENTION_WEIGHTS
): number => {
  const mentionRates = {
    sm: data.taux_sm,
    ab: data.taux_ab,
    b: data.taux_b,
    tb: data.taux_tb,
    fel: data.taux_fel,
  };

  return mentionRates[mentionType] * MENTION_WEIGHTS[mentionType];
};

/**
 * Get ranking color based on position in list
 */
export const getRankingColor = (
  position: number,
  total: number
): 'green' | 'yellow' | 'red' | 'blue' => {
  if (total === 1) return 'blue';
  if (total === 2) return position === 0 ? 'green' : 'red';
  if (position === 0) return 'green';
  if (position === total - 1) return 'red';
  return 'yellow';
};

/**
 * Format score for display
 */
export const formatScore = (score: number): string => {
  return score.toFixed(2);
};

/**
 * Get performance category based on score
 */
export const getPerformanceCategory = (score: number): string => {
  if (score >= 8) return 'Excellent';
  if (score >= 6) return 'Très bien';
  if (score >= 4) return 'Bien';
  if (score >= 2) return 'Assez bien';
  return 'Passable';
};