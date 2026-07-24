describe("generateStoryboardImage", () => {
  const OLD_ENV = process.env;
  const ORIGINAL_FETCH = global.fetch;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    process.env.IMAGE_GENERATION_PROVIDER = "openai";
    process.env.IMAGE_GENERATION_API_KEY = "test-api-key";
  });

  afterEach(() => {
    global.fetch = ORIGINAL_FETCH;
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  const mockGenerationResponse = (body: unknown) => {
    return {
      ok: true,
      json: async () => body,
    } as Response;
  };

  const mockImageDownloadResponse = (
    bytes: Uint8Array,
    contentType = "image/png"
  ) => {
    return {
      ok: true,
      headers: { get: () => contentType },
      arrayBuffer: async () => bytes.buffer,
    } as unknown as Response;
  };

  it("fetches the temporary OpenAI url server-side and returns a persisted data URI instead of the raw url (#4284)", async () => {
    const temporaryUrl = "https://oaidalleapiprodscus.blob.core.windows.net/temp/image.png";
    const imageBytes = new Uint8Array([1, 2, 3, 4]);

    const fetchMock = jest
      .fn()
      // 1st call: the image generation request
      .mockResolvedValueOnce(
        mockGenerationResponse({ data: [{ url: temporaryUrl }] })
      )
      // 2nd call: re-fetching the temporary url's bytes
      .mockResolvedValueOnce(mockImageDownloadResponse(imageBytes));
    global.fetch = fetchMock as unknown as typeof fetch;

    const { generateStoryboardImage } = await import(
      "../storyboard_image_generation"
    );

    const result = await generateStoryboardImage("a cat in a hat");

    // The raw temporary url must never be returned/persisted as-is.
    expect(result).not.toBe(temporaryUrl);
    expect(result).not.toContain(temporaryUrl);

    // It should be re-persisted as a self-contained base64 data URI.
    expect(result).toBe(
      `data:image/png;base64,${Buffer.from(imageBytes).toString("base64")}`
    );

    // Confirms we actually went back out to the temporary url to fetch bytes.
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[1][0]).toBe(temporaryUrl);
  });

  it("returns null (mapped to imageStatus: failed by the caller) when the temporary url can no longer be fetched", async () => {
    const temporaryUrl = "https://oaidalleapiprodscus.blob.core.windows.net/temp/expired.png";

    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce(
        mockGenerationResponse({ data: [{ url: temporaryUrl }] })
      )
      // Simulates the url having already expired by the time we re-fetch it.
      .mockResolvedValueOnce({ ok: false } as Response);
    global.fetch = fetchMock as unknown as typeof fetch;

    const { generateStoryboardImage } = await import(
      "../storyboard_image_generation"
    );

    const result = await generateStoryboardImage("a cat in a hat");

    expect(result).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("leaves the b64_json branch untouched, since it never returns a temporary link", async () => {
    const fetchMock = jest.fn().mockResolvedValueOnce(
      mockGenerationResponse({ data: [{ b64_json: "aGVsbG8=" }] })
    );
    global.fetch = fetchMock as unknown as typeof fetch;

    const { generateStoryboardImage } = await import(
      "../storyboard_image_generation"
    );

    const result = await generateStoryboardImage("a cat in a hat");

    expect(result).toBe("data:image/png;base64,aGVsbG8=");
    // Only the generation call — no extra fetch, since there's no url to persist.
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("returns null when neither url nor b64_json is present", async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce(mockGenerationResponse({ data: [{}] }));
    global.fetch = fetchMock as unknown as typeof fetch;

    const { generateStoryboardImage } = await import(
      "../storyboard_image_generation"
    );

    const result = await generateStoryboardImage("a cat in a hat");

    expect(result).toBeNull();
  });

  it("returns null without calling fetch when no provider is configured", async () => {
    process.env.IMAGE_GENERATION_PROVIDER = "";

    const fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;

    const { generateStoryboardImage } = await import(
      "../storyboard_image_generation"
    );

    const result = await generateStoryboardImage("a cat in a hat");

    expect(result).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});