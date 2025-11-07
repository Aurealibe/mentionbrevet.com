/**
 * Color mappings for mention types
 */
export const MENTION_COLORS = {
  sm: '#EF4444',    // red-500
  ab: '#F97316',    // orange-500
  b: '#EAB308',     // yellow-500
  tb: '#22C55E',    // green-500
  fel: '#3B82F6',   // blue-500
} as const;

/**
 * Chart color mappings for mention types
 */
export const CHART_COLORS = {
  sm: 'rgba(239, 68, 68, 0.6)',    // red with opacity
  ab: 'rgba(249, 115, 22, 0.6)',   // orange with opacity
  b: 'rgba(234, 179, 8, 0.6)',     // yellow with opacity
  tb: 'rgba(34, 197, 94, 0.6)',    // green with opacity
  fel: 'rgba(59, 130, 246, 0.6)',  // blue with opacity
} as const;

/**
 * Border colors for chart points
 */
export const CHART_BORDER_COLORS = {
  sm: 'rgba(239, 68, 68, 1)',
  ab: 'rgba(249, 115, 22, 1)',
  b: 'rgba(234, 179, 8, 1)',
  tb: 'rgba(34, 197, 94, 1)',
  fel: 'rgba(59, 130, 246, 1)',
} as const;

/**
 * Ranking colors
 */
export const RANKING_COLORS = {
  green: '#22C55E',
  yellow: '#EAB308',
  red: '#EF4444',
  blue: '#3B82F6',
} as const;

/**
 * Get color for a mention type
 */
export const getMentionColor = (
  mentionType: keyof typeof MENTION_COLORS
): string => {
  return MENTION_COLORS[mentionType];
};

/**
 * Get chart color for a mention type
 */
export const getChartColor = (
  mentionType: keyof typeof CHART_COLORS
): string => {
  return CHART_COLORS[mentionType];
};

/**
 * Get border color for a chart point
 */
export const getChartBorderColor = (
  mentionType: keyof typeof CHART_BORDER_COLORS
): string => {
  return CHART_BORDER_COLORS[mentionType];
};

/**
 * Get Tailwind class for mention type
 */
export const getMentionColorClass = (
  mentionType: keyof typeof MENTION_COLORS
): string => {
  const classes = {
    sm: 'text-red-500',
    ab: 'text-orange-500',
    b: 'text-yellow-500',
    tb: 'text-green-500',
    fel: 'text-blue-500',
  };
  return classes[mentionType];
};

/**
 * Get background color class for mention type
 */
export const getMentionBgColorClass = (
  mentionType: keyof typeof MENTION_COLORS
): string => {
  const classes = {
    sm: 'bg-red-500',
    ab: 'bg-orange-500',
    b: 'bg-yellow-500',
    tb: 'bg-green-500',
    fel: 'bg-blue-500',
  };
  return classes[mentionType];
};

/**
 * Gradient colors for comparison (1st to 5th place)
 */
export const COMPARISON_GRADIENT = {
  1: { bg: 'bg-green-600', hex: '#16a34a' },
  2: { bg: 'bg-green-500', hex: '#22c55e' },
  3: { bg: 'bg-yellow-500', hex: '#eab308' },
  4: { bg: 'bg-orange-500', hex: '#f97316' },
  5: { bg: 'bg-red-500', hex: '#ef4444' },
} as const;

/**
 * Get comparison color based on position and total count
 */
export const getComparisonColor = (position: number, total: number = 5): { bg: string; hex: string } => {
  // Special cases for smaller comparisons
  if (total === 2) {
    // 2 prénoms: vert ou rouge
    return position === 1
      ? { bg: 'bg-green-500', hex: '#22c55e' }
      : { bg: 'bg-red-500', hex: '#ef4444' };
  }

  if (total === 3) {
    // 3 prénoms: vert, orange, rouge
    if (position === 1) return { bg: 'bg-green-500', hex: '#22c55e' };
    if (position === 2) return { bg: 'bg-orange-500', hex: '#f97316' };
    return { bg: 'bg-red-500', hex: '#ef4444' };
  }

  if (total === 4) {
    // 4 prénoms: vert foncé, vert clair, orange, rouge
    if (position === 1) return { bg: 'bg-green-600', hex: '#16a34a' };
    if (position === 2) return { bg: 'bg-green-500', hex: '#22c55e' };
    if (position === 3) return { bg: 'bg-orange-500', hex: '#f97316' };
    return { bg: 'bg-red-500', hex: '#ef4444' };
  }

  // 5 prénoms: gradient complet
  const clampedPosition = Math.min(Math.max(position, 1), 5) as keyof typeof COMPARISON_GRADIENT;
  return COMPARISON_GRADIENT[clampedPosition];
};