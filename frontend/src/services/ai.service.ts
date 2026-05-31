import axios from "axios";

const API_BASE = import.meta.env.VITE_BASE_URL || "http://localhost:5000/api/v1";

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
