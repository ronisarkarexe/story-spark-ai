// frontend/src/types/scene.ts

export interface SceneScore {
  id: number;
  title: string;
  importance: number; // Score between 0 and 100
  reasons: string[];
  recommendation: string;
  needsRevision: boolean;
}

export interface SceneAnalysisResponse {
  scenes: SceneScore[];
  averageImportance: number;
  totalScenes: number;
  scenesNeedingRevision: number;
}