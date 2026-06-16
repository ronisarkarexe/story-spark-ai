export interface IStoryVisualizerPayload {
  title: string;
  content: string;
  genre?: string;
  language?: string;
}

export interface IStoryboardScene {
  sceneNumber: number;
  caption: string;
  imagePrompt: string;
  imageUrl?: string;
  imageStatus?: "generated" | "failed" | "pending";
}

export interface IStoryVisualizerResult {
  scenes: IStoryboardScene[];
  styleGuide: string;
}
