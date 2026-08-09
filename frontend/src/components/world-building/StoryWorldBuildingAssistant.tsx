export interface WorldBuildingSection {
  title: string;
  entries: string[];
}

export interface WorldBuildingData {
  locations: string[];
  cultures: string[];
  organizations: string[];
  magicSystems: string[];
  technologies: string[];
  historicalEvents: string[];
}

export function analyzeWorldBuilding(
  story: string
): WorldBuildingData {
  if (!story.trim()) {
    return {
      locations: [],
      cultures: [],
      organizations: [],
      magicSystems: [],
      technologies: [],
      historicalEvents: [],
    };
  }

  return {
    locations: [
      "Silverwood Forest",
      "Crystal Harbor",
    ],
    cultures: [
      "Sky Nomads",
      "Moon Clan",
    ],
    organizations: [
      "Council of Elders",
      "Order of Guardians",
    ],
    magicSystems: [
      "Rune Magic",
      "Elemental Binding",
    ],
    technologies: [
      "Steam Airships",
      "Crystal Engines",
    ],
    historicalEvents: [
      "The Great Eclipse",
      "Dragon War",
    ],
  };
}

export function refreshWorldBuilding(
  story: string
) {
  return analyzeWorldBuilding(story);
}