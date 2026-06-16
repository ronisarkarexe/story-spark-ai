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
<<<<<<< HEAD
  genre?: string; // ← ADDED
=======
  tone?: string;
  genre?: string;
  characters?: ICharacter[];
>>>>>>> 4e00323bafbab3077b109b69274ecb3e313a5d99
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
<<<<<<< HEAD
}
=======
}
export interface IChatMessage {
  role: "user" | "model";
  parts: string;
}

export interface IChatPayload {
  message: string;
  history?: IChatMessage[];
}
>>>>>>> 4e00323bafbab3077b109b69274ecb3e313a5d99
