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
      model: "dall-e-3",
      prompt,
      size: "1024x1024",
      quality: "low",
      n: 1,
    }),
    signal: controller.signal,
  }).finally(() => clearTimeout(timeoutId));

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as OpenAIImageResponse;
  const image = data.data?.[0];
  if (image?.url) {
    return image.url;
  }

  if (image?.b64_json) {
    return `data:image/png;base64,${image.b64_json}`;
  }

  return null;
};

export const generateStoryboardImage = async (
  prompt: string
): Promise<string | null> => {
  const provider = getProvider();

  if (!provider) {
    return null;
  }

  if (provider === "openai") {
    return generateWithOpenAI(prompt);
  }

  return null;
};
