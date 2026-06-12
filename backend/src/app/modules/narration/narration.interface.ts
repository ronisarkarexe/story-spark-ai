export interface INarrationVoice {
  voiceId: string;
  name: string;
  category: string;
  description?: string;
  previewUrl?: string;
}

export interface INarrationRequest {
  text: string;
  voiceId: string;
  storyId: string;
  chapterId: string;
}
