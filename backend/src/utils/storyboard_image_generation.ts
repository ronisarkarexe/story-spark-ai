import { generateStoryboardImage } from "../storyboard_image_generation";

// Mock the config module
jest.mock("../../config", () => ({
  default: {
    image_generation_provider: "",
    image_generation_api_key: "",
    openai_key: "",
  },
}));

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Get reference to mocked config
import config from "../../config";
const mockConfig = config as jest.Mocked<typeof config>;

beforeEach(() => {
  jest.clearAllMocks();
  mockConfig.image_generation_provider = "";
  mockConfig.image_generation_api_key = "";
  mockConfig.openai_key = "";
});

describe("generateStoryboardImage", () => {

  it("returns null when no provider is set", async () => {
    mockConfig.image_generation_provider = "";
    const result = await generateStoryboardImage("a dragon in the sky");
    expect(result).toBeNull();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("returns null when provider is openai but no api key is set", async () => {
    mockConfig.image_generation_provider = "openai";
    mockConfig.image_generation_api_key = "";
    mockConfig.openai_key = "";
    const result = await generateStoryboardImage("a dragon in the sky");
    expect(result).toBeNull();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("returns image URL when provider is openai and api key is set", async () => {
    mockConfig.image_generation_provider = "openai";
    mockConfig.openai_key = "test-openai-key";

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: [{ url: "https://example.com/image.png" }],
      }),
    });

    const result = await generateStoryboardImage("a dragon in the sky");
    expect(result).toBe("https://example.com/image.png");
  });

  it("returns base64 image when response contains b64_json", async () => {
    mockConfig.image_generation_provider = "openai";
    mockConfig.openai_key = "test-openai-key";

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: [{ b64_json: "abc123" }],
      }),
    });

    const result = await generateStoryboardImage("a castle at night");
    expect(result).toBe("data:image/png;base64,abc123");
  });

  it("returns null when openai API responds with error", async () => {
    mockConfig.image_generation_provider = "openai";
    mockConfig.openai_key = "test-openai-key";

    mockFetch.mockResolvedValueOnce({ ok: false });

    const result = await generateStoryboardImage("a dragon in the sky");
    expect(result).toBeNull();
  });

  it("returns null when fetch throws an error", async () => {
    mockConfig.image_generation_provider = "openai";
    mockConfig.openai_key = "test-openai-key";

    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const result = await generateStoryboardImage("a dragon in the sky");
    expect(result).toBeNull();
  });

  it("returns null when signal is already aborted", async () => {
    mockConfig.image_generation_provider = "openai";
    mockConfig.openai_key = "test-openai-key";

    const controller = new AbortController();
    controller.abort();

    const result = await generateStoryboardImage("a dragon", controller.signal);
    expect(result).toBeNull();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("uses image_generation_api_key over openai_key when both are set", async () => {
    mockConfig.image_generation_provider = "openai";
    mockConfig.image_generation_api_key = "primary-key";
    mockConfig.openai_key = "fallback-key";

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [{ url: "https://example.com/img.png" }] }),
    });

    await generateStoryboardImage("a sunset");

    const callHeaders = mockFetch.mock.calls[0][1].headers;
    expect(callHeaders["Authorization"]).toBe("Bearer primary-key");
  });

  it("returns null for unknown provider", async () => {
    mockConfig.image_generation_provider = "gemini";

    const result = await generateStoryboardImage("a dragon in the sky");
    expect(result).toBeNull();
    expect(mockFetch).not.toHaveBeenCalled();
  });
});