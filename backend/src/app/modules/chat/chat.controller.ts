import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';

// Force it to look for the .env file in multiple possible locations
dotenv.config(); 
dotenv.config({ path: path.join(process.cwd(), '.env') }); 
dotenv.config({ path: path.join(process.cwd(), 'backend', '.env') });

export const generateResponse = async (req: Request, res: Response): Promise<any> => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    // DEBUG CHECK 1: Did we actually load the key?
    if (!apiKey || apiKey.includes("paste_your_actual_api_key")) {
       return res.status(500).json({ 
         success: false, 
         message: "DEBUG ERROR: The API key is missing. Node.js cannot find your .env file!" 
       });
    }

    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ success: false, message: "Prompt is required" });

    // Initialize AI inside the function so it doesn't crash on startup
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Send the prompt to Google
    const result = await model.generateContent(prompt);
    
    return res.status(200).json({
      success: true,
      data: result.response.text()
    });

  } catch (error: any) {
    // DEBUG CHECK 2: What did Google say?
    console.error("Gemini API Error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "DEBUG ERROR: Google rejected the API call.",
      reason: error.message || "Unknown error"
    });
  }
};