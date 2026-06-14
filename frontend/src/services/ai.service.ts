import axios from "axios";
import { getBaseUrl } from "../helpers/config";

const API_BASE = getBaseUrl();

export interface IChatMessage {
  role: "user" | "model";
  parts: string;
}

export const chatWithAI = async (message: string, history: IChatMessage[] = []) => {
  const response = await axios.post(`${API_BASE}/ai_model/chat`, {
    message,
    history,
  }, {
    withCredentials: true,
  });

  return response.data.data;
};

export const chatWithAIFree = async (message: string, history: IChatMessage[] = []) => {
  const response = await axios.post(`${API_BASE}/ai_model/chat-free`, {
    message,
    history,
  }, {
    withCredentials: true,
  });

  return response.data.data;
};
