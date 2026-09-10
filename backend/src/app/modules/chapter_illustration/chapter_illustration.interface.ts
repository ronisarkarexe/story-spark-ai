export interface IChapterIllustrationPayload {
  chapterId: string;
  chapterTitle: string;
  chapterContent: string;
  storyContext?: string;
  imagePrompt?: string;
  style?: "realistic" | "illustration" | "cartoon" | "watercolor" | "sketch";
  quality?: "standard" | "hd";
}

export interface IChapterIllustrationResult {
  chapterId: string;
  imageUrl: string;
  imageStatus: "generated" | "cached" | "failed";
  generatedAt: Date;
  cacheKey?: string;
}

export interface IImageCache {
  _id?: string;
  cacheKey: string;
  imageUrl: string;
  prompt: string;
  provider: string;
  createdAt: Date;
  expiresAt: Date;
  usageCount: number;
}

export interface IImageGenerationConfig {
  provider: "openai" | "stability" | "replicate" | "huggingface";
  apiKey: string;
  model?: string;
  size?: string;
}
