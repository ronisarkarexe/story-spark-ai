import config from "../config";

const OPENAI_IMAGE_GENERATION_URL = "https://api.openai.com/v1/images/generations";
const IMAGE_REQUEST_TIMEOUT_MS = 45000;

type OpenAIImageResponse = {
  data?: Array<{
    url?: string;
    b64_json?: string;
  }>;
};

const getProvider = (): string => {
  return (config.image_generation_provider || "").trim().toLowerCase();
};

const getApiKey = (): string => {
  return (
    config.image_generation_api_key ||
    config.openai_key ||
    ""
  ).trim();
};

const generateWithOpenAI = async (prompt: string): Promise<string | null> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return null;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    IMAGE_REQUEST_TIMEOUT_MS
  );

  const response = await fetch(OPENAI_IMAGE_GENERATION_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
      quality: "low",
      n: 1,
    }),
    signal: controller.signal,
  }).finally(() => clearTimeout(timeoutId));

  if (!response.ok) {
  const errorText = await response.text().catch(() => "");
  console.error("OpenAI Image API Error:", response.status, errorText);
  return null;
}

let data: OpenAIImageResponse;

try {
  data = await response.json();
} catch (err) {
  console.error("Failed to parse OpenAI response JSON");
  return null;
}

const image = Array.isArray(data.data) ? data.data[0] : undefined;

if (image?.url) return image.url;

if (image?.b64_json) {
  return `data:image/png;base64,${image.b64_json}`;
}

return null;
};
