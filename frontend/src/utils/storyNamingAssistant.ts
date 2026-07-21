export type EntityType =
  | "Character"
  | "City"
  | "Kingdom"
  | "Artifact"
  | "Organization"
  | "Planet";

export interface NameSuggestion {
  id: number;
  name: string;
  entityType: EntityType;
}

const nameDatabase: Record<string, Record<EntityType, string[]>> = {
  Fantasy: {
    Character: ["Aelric", "Lyra", "Thalion", "Seraphine"],
    City: ["Silverhaven", "Moonreach", "Eldoria"],
    Kingdom: ["Valoria", "Drakenfall"],
    Artifact: ["Blade of Eternity", "Crystal Crown"],
    Organization: ["Order of Dawn", "Shadow Council"],
    Planet: ["Aetheris", "Lumora"],
  },
  SciFi: {
    Character: ["Nova", "Kael", "Orion", "Zara"],
    City: ["Neo Prime", "Helix Station"],
    Kingdom: ["Galactic Union", "Nova Dominion"],
    Artifact: ["Quantum Core", "Void Relic"],
    Organization: ["Stellar Command", "Axiom Labs"],
    Planet: ["Xenora", "Titanis"],
  },
};

export function generateNames(
  genre: string,
  entityType: EntityType
): NameSuggestion[] {
  const names =
    nameDatabase[genre]?.[entityType] ?? [];

  return names.map((name, index) => ({
    id: index + 1,
    name,
    entityType,
  }));
}