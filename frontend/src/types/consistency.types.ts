export interface ICharacterProfile {
  name: string;
  traits: string[];
  abilities: string[];
  relationships: { target: string; relationshipType: string }[];
}

export interface ITimelineEvent {
  chapter: number;
  description: string;
  entitiesInvolved: string[];
}

export interface IContradiction {
  type: string;
  description: string;
  suggestedFix: string;
}

export interface IConsistencyReport {
  postId: string;
  score: number;
  characters: ICharacterProfile[];
  timeline: ITimelineEvent[];
  contradictions: IContradiction[];
  createdAt?: string;
  updatedAt?: string;
}
