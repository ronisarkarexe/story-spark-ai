export interface FoilPair {
  protagonist: string;
  foil: string;
  contrast: string;
  suggestion: string;
}

export const analyzeFoilCharacters = (): FoilPair[] => {
  return [
    {
      protagonist: "Emma",
      foil: "Luna",
      contrast: "Emma is logical while Luna acts emotionally.",
      suggestion: "Increase scenes showing their different decision-making styles.",
    },
    {
      protagonist: "Alex",
      foil: "Ryan",
      contrast: "Alex avoids conflict whereas Ryan welcomes it.",
      suggestion: "Use more dialogue to emphasize their opposite personalities.",
    },
    {
      protagonist: "Sophia",
      foil: "Mia",
      contrast: "Sophia is optimistic while Mia is pessimistic.",
      suggestion: "Strengthen emotional conflicts between both characters.",
    },
  ];
};