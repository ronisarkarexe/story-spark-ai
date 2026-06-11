import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { getDialogueFingerprint } from "./dialogue-fingerprint.service";

vi.mock("axios");

describe("Dialogue Fingerprint Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully fetch dialogue fingerprint from the API", async () => {
    const mockResponse = {
      data: {
        success: true,
        data: {
          characters: [
            {
              character: "Emma",
              dialogues: ["I won't give up."],
              fingerprint: {
                tone: "Encouraging",
                averageSentenceLength: 9,
                contractionRate: 0.45,
                frequentWords: ["give", "up"],
                catchphrases: ["won't give up"],
              },
              distinctivenessScore: 82,
            },
          ],
          similarities: [
            {
              characterA: "Emma",
              characterB: "Liam",
              similarity: 78,
              flagged: true,
            },
          ],
          recommendations: [
            {
              character: "Liam",
              suggestion: "Give Liam more contractions to sound casual.",
            },
          ],
        },
      },
    };

    vi.mocked(axios.post).mockResolvedValueOnce(mockResponse);

    const result = await getDialogueFingerprint("story-123");

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("/stories/story-123/dialogue-fingerprint"),
      {},
      { withCredentials: true }
    );
    expect(result.characters[0].character).toBe("Emma");
    expect(result.similarities[0].flagged).toBe(true);
    expect(result.recommendations[0].character).toBe("Liam");
  });
});
