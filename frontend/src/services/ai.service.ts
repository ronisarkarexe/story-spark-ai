import axios from "axios";

export interface IChatMessage {
  role: "user" | "model";
  parts: string;
}

// Point this directly to the Express route we just secured!
const API_URL = "http://localhost:5000/api/v1/chat/ask";

export const chatWithAI = async (message: string, history: IChatMessage[] = []) => {
  try {
    const response = await axios.post(API_URL, {
      prompt: message,
      // Note: We are sending history just in case you want to upgrade your backend later to remember context!
      history: history 
    });
    
    // Our backend returns { success: true, data: "AI response here" }
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Since we bypassed the auth/payment gates for now, the free version does the exact same thing
export const chatWithAIFree = async (message: string, history: IChatMessage[] = []) => {
  return chatWithAI(message, history);
};