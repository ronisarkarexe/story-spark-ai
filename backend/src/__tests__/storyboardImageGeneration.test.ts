import { generateStoryboardImage } from "../utils/storyboard_image_generation";
import config from "../config";

jest.mock("../config", () => ({
  __esModule: true,
  default: {
    image_generation_provider: "",
    image_generation_api_key: "",
    openai_key: "",
    gemini_api_key: "",
    gemini_image_model: "imagen-3.0-generate-002",
  },
}));

describe("storyboard_image_generation", () => {
  let originalFetch: typeof fetch;

  beforeAll(() => {
    originalFetch = global.fetch;
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset config values
    config.image_generation_provider = "";
    config.image_generation_api_key = "";
    config.openai_key = "";
    config.gemini_api_key = "";
    config.gemini_image_model = "imagen-3.0-generate-002";
  });

  describe("Provider routing logic", () => {
    it("returns null if no provider and no keys are set", async () => {
      const result = await generateStoryboardImage("Test prompt");
      expect(result).toBeNull();
    });

    it("routes to OpenAI when provider is 'openai' and key is set", async () => {
      config.image_generation_provider = "openai";
      config.openai_key = "sk-mock-openai-key";

      const mockJsonPromise = Promise.resolve({
        data: [{ b64_json: "mockbase64openai" }],
      });
      const mockFetchPromise = Promise.resolve({
        ok: true,
        json: () => mockJsonPromise,
      } as Response);
      global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);

      const result = await generateStoryboardImage("Test prompt");
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.openai.com/v1/images/generations",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            Authorization: "Bearer sk-mock-openai-key",
          }),
        })
      );
      expect(result).toBe("data:image/png;base64,mockbase64openai");
    });

    it("routes to Google when provider is 'google' and key is set", async () => {
      config.image_generation_provider = "google";
      config.gemini_api_key = "mock-gemini-key";

      const mockJsonPromise = Promise.resolve({
        predictions: [{ bytesBase64Encoded: "mockbase64google", mimeType: "image/jpeg" }],
      });
      const mockFetchPromise = Promise.resolve({
        ok: true,
        json: () => mockJsonPromise,
      } as Response);
      global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);

      const result = await generateStoryboardImage("Test prompt");
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        "https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=mock-gemini-key",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
          body: JSON.stringify({
            instances: [{ prompt: "Test prompt" }],
            parameters: {
              sampleCount: 1,
              outputMimeType: "image/jpeg",
            },
          }),
        })
      );
      expect(result).toBe("data:image/jpeg;base64,mockbase64google");
    });

    it("routes to Google when provider is 'gemini' and key is set", async () => {
      config.image_generation_provider = "gemini";
      config.gemini_api_key = "mock-gemini-key";

      const mockJsonPromise = Promise.resolve({
        predictions: [{ bytesBase64Encoded: "mockbase64google", mimeType: "image/png" }],
      });
      const mockFetchPromise = Promise.resolve({
        ok: true,
        json: () => mockJsonPromise,
      } as Response);
      global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);

      const result = await generateStoryboardImage("Test prompt");
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(result).toBe("data:image/png;base64,mockbase64google");
    });
  });

  describe("Fallback chain routing", () => {
    it("falls back to OpenAI if provider is unset but OpenAI API key is set", async () => {
      config.openai_key = "sk-mock-openai-key";

      const mockJsonPromise = Promise.resolve({
        data: [{ url: "https://openai.com/mock.png" }],
      });
      const mockFetchPromise = Promise.resolve({
        ok: true,
        json: () => mockJsonPromise,
      } as Response);
      global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);

      const result = await generateStoryboardImage("Test prompt");
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.openai.com/v1/images/generations",
        expect.any(Object)
      );
      expect(result).toBe("https://openai.com/mock.png");
    });

    it("falls back to Google if provider and OpenAI keys are unset but Gemini API key is set", async () => {
      config.gemini_api_key = "mock-gemini-key";

      const mockJsonPromise = Promise.resolve({
        predictions: [{ bytesBase64Encoded: "mockbase64google" }],
      });
      const mockFetchPromise = Promise.resolve({
        ok: true,
        json: () => mockJsonPromise,
      } as Response);
      global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);

      const result = await generateStoryboardImage("Test prompt");
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        "https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=mock-gemini-key",
        expect.any(Object)
      );
      expect(result).toBe("data:image/jpeg;base64,mockbase64google");
    });
  });

  describe("Error handling", () => {
    it("returns null if OpenAI fetch fails", async () => {
      config.image_generation_provider = "openai";
      config.openai_key = "sk-mock-openai-key";

      const mockFetchPromise = Promise.resolve({
        ok: false,
      } as Response);
      global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);

      const result = await generateStoryboardImage("Test prompt");
      expect(result).toBeNull();
    });

    it("returns null if Google fetch fails", async () => {
      config.image_generation_provider = "google";
      config.gemini_api_key = "mock-gemini-key";

      const mockFetchPromise = Promise.resolve({
        ok: false,
      } as Response);
      global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);

      const result = await generateStoryboardImage("Test prompt");
      expect(result).toBeNull();
    });

    it("returns null if Google API returns empty predictions", async () => {
      config.image_generation_provider = "google";
      config.gemini_api_key = "mock-gemini-key";

      const mockJsonPromise = Promise.resolve({
        predictions: [],
      });
      const mockFetchPromise = Promise.resolve({
        ok: true,
        json: () => mockJsonPromise,
      } as Response);
      global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);

      const result = await generateStoryboardImage("Test prompt");
      expect(result).toBeNull();
    });
  });
});
