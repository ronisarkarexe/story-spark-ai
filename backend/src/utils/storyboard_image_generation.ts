import config from "../config";

const OPENAI_IMAGE_GENERATION_URL = "https://api.openai.com/v1/images/generations";
const IMAGE_REQUEST_TIMEOUT_MS = 45000;
const IMAGE_DOWNLOAD_TIMEOUT_MS = 20000;

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
const persistTemporaryImageUrl = async (
  temporaryUrl: string,
  signal?: AbortSignal
): Promise<string | null> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    IMAGE_DOWNLOAD_TIMEOUT_MS
  );

  let abortHandler: (() => void) | null = null;
  if (signal) {
    if (signal.aborted) {
      clearTimeout(timeoutId);
      controller.abort();
      return null;
    }
    abortHandler = () => {
      controller.abort();
    };
    signal.addEventListener("abort", abortHandler);
  }

  try {
    const response = await fetch(temporaryUrl, { signal: controller.signal });
    if (!response.ok) {
      return null;
    }

    const contentType = response.headers.get("content-type") || "image/png";
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    return `data:${contentType};base64,${base64}`;
  } catch (error) {
    return null;
  } finally {
    clearTimeout(timeoutId);
    if (signal && abortHandler) {
      signal.removeEventListener("abort", abortHandler);
    }
  }
};

const generateWithOpenAI = async (
  prompt: string,
  signal?: AbortSignal
): Promise<string | null> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return null;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    IMAGE_REQUEST_TIMEOUT_MS
  );

  let abortHandler: (() => void) | null = null;
  if (signal) {
    if (signal.aborted) {
      clearTimeout(timeoutId);
      controller.abort();
      return null;
    }
    abortHandler = () => {
      controller.abort();
    };
    signal.addEventListener("abort", abortHandler);
  }

  try {
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
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as OpenAIImageResponse;
    const image = data.data?.[0];

    if (image?.url) {
      // Fetch and re-persist immediately — OpenAI's `url` is temporary by
      // design and will eventually stop working if saved as-is (#4284).
      return await persistTemporaryImageUrl(image.url, signal);
    }

    if (image?.b64_json) {
      return `data:image/png;base64,${image.b64_json}`;
    }

    return null;
  } catch (error) {
    return null;
  } finally {
    clearTimeout(timeoutId);
    if (signal && abortHandler) {
      signal.removeEventListener("abort", abortHandler);
    }
  }
};

export const generateStoryboardImage = async (
  prompt: string,
  signal?: AbortSignal
): Promise<string | null> => {
  const provider = getProvider();

  if (!provider) {
    return null;
  }

  if (provider === "openai") {
    return generateWithOpenAI(prompt, signal);
  }

  return null;
};