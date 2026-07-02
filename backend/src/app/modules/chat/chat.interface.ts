export interface IChatMessage {
  role: "user" | "model";
  content: string;
}

export interface IChatPayload {
  messages: IChatMessage[];
}
