import fs from "fs";
import path from "path";
import crypto from "crypto";
import config from "../../../config";
import { INarrationVoice } from "./narration.interface";

const CACHE_DIR = path.join(process.cwd(), "uploads", "narration-cache");

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// Predefined voices list from ElevenLabs default library
const PREDEFINED_VOICES: INarrationVoice[] = [
  {
    voiceId: "21m00Tcm4TlvDq8ikWAM",
    name: "Rachel",
    category: "premade",
    description: "Female, warm, professional, narration.",
  },
  {
    voiceId: "AZnzlk1XvdvUeBnXmlld",
    name: "Domi",
    category: "premade",
    description: "Female, strong, expressive, story narration.",
  },
  {
    voiceId: "EXAVITQu4vr4xnSDxMaL",
    name: "Bella",
    category: "premade",
    description: "Female, soft, conversational, audiobook.",
  },
  {
    voiceId: "ErXwobaYiN019PkySvjV",
    name: "Antoni",
    category: "premade",
    description: "Male, deep, storytelling, dramatic narration.",
  },
  {
    voiceId: "TxGEqn7nUaMrCDpxEM3W",
    name: "Liam",
    category: "premade",
    description: "Male, clear, modern narration.",
  },
  {
    voiceId: "pNInz6obpgDQ51uUP53s",
    name: "Adam",
    category: "premade",
    description: "Male, deep, narration, generic.",
  },
  {
    voiceId: "VR6A4UBqgJJeeQsKdWkP",
    name: "Arnold",
    category: "premade",
    description: "Male, crisp, high quality.",
  },
];

const getVoices = (): INarrationVoice[] => {
  return PREDEFINED_VOICES;
};

const synthesizeTTS = async (
  text: string,
  voiceId: string,
  storyId: string,
  chapterId: string
): Promise<string> => {
  const hashInput = `${text}_${voiceId}`;
  const hash = crypto.createHash("md5").update(hashInput).digest("hex");
  const filename = `narration-${hash}.mp3`;
  const filePath = path.join(CACHE_DIR, filename);

  // Return cached file path if it exists
  if (fs.existsSync(filePath)) {
    return filename;
  }

  const apiKey = config.elevenlabs_api_key;
  if (!apiKey || apiKey === "YOUR_ELEVENLABS_API_KEY") {
    // Write a dummy/mock silent MP3 if key is missing or dummy
    // A tiny 1-second silent MP3 base64:
    const mockMp3Base64 =
      "SUQzBAAAAAAAAFRYWFgAAAASAAADbWlub25lLmNvbQBURVhUAAAAEgAAA21pbm9uZS5jb20A//uQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABEaWNhcwAAABcAAAADAAEAAAAA//uQZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGFtZQG1wN21hY2gAAAAA//uQZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVkJDAM1tOW5jSwAAAAA=";
    const buffer = Buffer.from(mockMp3Base64, "base64");
    await fs.promises.writeFile(filePath, buffer);
    return filename;
  }

  try {
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ElevenLabs API returned ${response.status}: ${errorText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.promises.writeFile(filePath, buffer);

    return filename;
  } catch (error) {
    console.error("ElevenLabs synthesis error, falling back to mock file:", error);
    // Fallback to writing a mock file
    const mockMp3Base64 =
      "SUQzBAAAAAAAAFRYWFgAAAASAAADbWlub25lLmNvbQBURVhUAAAAEgAAA21pbm9uZS5jb20A//uQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABEaWNhcwAAABcAAAADAAEAAAAA//uQZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGFtZQG1wN21hY2gAAAAA//uQZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVkJDAM1tOW5jSwAAAAA=";
    const buffer = Buffer.from(mockMp3Base64, "base64");
    await fs.promises.writeFile(filePath, buffer);
    return filename;
  }
};

export const NarrationService = {
  getVoices,
  synthesizeTTS,
  CACHE_DIR,
};
