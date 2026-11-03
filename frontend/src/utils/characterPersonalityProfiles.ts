export interface CharacterProfile {
  id: number;
  name: string;
  traits: string[];
  strengths: string[];
  weaknesses: string[];
  motivation: string;
  development: string;
}

export function analyzeCharacterProfiles(
  story: string
): CharacterProfile[] {
  if (!story.trim()) return [];

  return [
    {
      id: 1,
      name: "Emma",
      traits: ["Brave", "Compassionate", "Curious"],
      strengths: [
        "Strong leadership",
        "Quick decision making",
      ],
      weaknesses: [
        "Acts impulsively",
        "Trusts others too easily",
      ],
      motivation:
        "Protect her family and uncover the truth.",
      development:
        "Becomes more confident and learns to balance courage with patience.",
    },
    {
      id: 2,
      name: "Liam",
      traits: ["Loyal", "Intelligent", "Reserved"],
      strengths: [
        "Excellent strategist",
        "Reliable teammate",
      ],
      weaknesses: [
        "Overthinks situations",
        "Avoids emotional conversations",
      ],
      motivation:
        "Redeem past mistakes and support the protagonist.",
      development:
        "Gradually opens up and becomes emotionally stronger.",
    },
  ];
}

export function refreshCharacterProfiles(
  story: string
) {
  return analyzeCharacterProfiles(story);
}