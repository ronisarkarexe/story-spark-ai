export interface ICharacter {
  name: string;
  role: string;
  personality: string;
}

export interface IAIModel {
  prompt: string;
  wordLength: number;
  numStories: number;
  language?: string;
  tone?: string;
  genre?: string;
  characters?: ICharacter[];
}

export interface IStory {
  title: string;
  content: string;
  tag: string;
  imageURL?: string;
  language?: string;
}

export interface IAlternateEnding {
  style: string;
  ending: string;
  fullStory: string;
}

export type RemixType = "setting" | "perspective" | "time_period" | "tone" | "gender_swap";

export interface ITranslatePayload {
  title: string;
  content: string;
  targetLanguage: string;
}

export interface IRemixPayload {
  title: string;
  content: string;
  tag: string;
  remixType: RemixType;
  remixOption?: string;
  language?: string;
}

export interface IAlternateEndingPayload {
  title: string;
  content: string;
  tag: string;
  language?: string;
}
export interface IChatMessage {
  role: "user" | "model";
  parts: string;
}

export interface IChatPayload {
  message: string;
  history?: IChatMessage[];
}
