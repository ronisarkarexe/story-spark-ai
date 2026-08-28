export interface DialogueRatioAnalysis {
  dialoguePercentage: number;
  balanceCategory: string;
}

export function calculateStoryDialogueRatio(text: string): DialogueRatioAnalysis {
  if (!text || typeof text !== 'string' || !text.trim()) {
    return {
      dialoguePercentage: 0,
      balanceCategory: 'Narrative Heavy',
    };
  }

  const quotes = text.match(/"([^"]*)"|'([^']*)'/g);
  const totalLength = text.trim().length;
  if (totalLength === 0 || !quotes || quotes.length === 0) {
    return {
      dialoguePercentage: 0,
      balanceCategory: 'Narrative Heavy',
    };
  }

  let dialogueLength = 0;
  for (const q of quotes) {
    dialogueLength += q.length;
  }

  const percentage = Math.min(100, Math.round((dialogueLength / totalLength) * 100));

  let category = 'Balanced';
  if (percentage > 60) category = 'Dialogue Heavy';
  else if (percentage < 20) category = 'Narrative Heavy';

  return {
    dialoguePercentage: percentage,
    balanceCategory: category,
  };
}
