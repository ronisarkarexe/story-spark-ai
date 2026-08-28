export interface ActionPacingDensityAnalysis {
  actionDensityScore: number;
  paceCategory: string;
}

export function calculateActionPacingDensity(text: string): ActionPacingDensityAnalysis {
  if (!text || typeof text !== 'string' || !text.trim()) {
    return {
      actionDensityScore: 0,
      paceCategory: 'Leisurely',
    };
  }

  const words = text.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return {
      actionDensityScore: 0,
      paceCategory: 'Leisurely',
    };
  }

  const actionKeywords = [
    'run', 'jump', 'dash', 'leap', 'strike', 'sprint', 'dodge',
    'charge', 'rush', 'grab', 'shoot', 'fight', 'chase', 'escape',
  ];

  let actionHits = 0;
  words.forEach((w) => {
    if (actionKeywords.some((k) => w.includes(k))) actionHits++;
  });

  const rawRatio = (actionHits / words.length) * 100;
  const score = Math.min(100, Math.round(rawRatio * 5));

  let pace = 'Moderate';
  if (score > 50) pace = 'Fast Paced';
  else if (score < 20) pace = 'Leisurely';

  return {
    actionDensityScore: score,
    paceCategory: pace,
  };
}
