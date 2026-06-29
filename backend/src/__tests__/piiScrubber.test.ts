import { scrubPII, piiScrubberMiddleware } from "../app/middleware/pii_scrubber";
import type { Request, Response, NextFunction } from "express";

jest.mock("compromise", () => {
  return jest.fn().mockImplementation((text: string) => ({
    people: () => ({
      out: () => {
        const matches = text.match(/\[NAME:([^\]]+)\]/g) ?? [];
        return matches.map((m) => m.replace("[NAME:", "").replace("]", "").trim());
      },
    }),
  }));
});

function buildMiddlewareMocks(body: Record<string, unknown> = {}) {
  const req = { body: { ...body } } as unknown as Request;
  const res = {} as Response;
  const next: NextFunction = jest.fn();
  return { req, res, next };
}

describe("scrubPII — email redaction", () => {
  it("redacts a plain email address", () => {
    const result = scrubPII("Contact me at alice@example.com please.");
    expect(result).not.toContain("alice@example.com");
    expect(result).toContain("[REDACTED_EMAIL]");
  });

  it("redacts multiple email addresses in the same string", () => {
    const result = scrubPII("From bob@foo.com to carol@bar.org");
    expect(result.match(/\[REDACTED_EMAIL\]/g)?.length).toBe(2);
  });

  it("does not alter a string with no email address", () => {
    const input = "A story about a dragon who lives on a mountain.";
    expect(scrubPII(input)).toBe(input);
  });
});

describe("scrubPII — phone number redaction", () => {
  it("redacts a standard US phone number", () => {
    const result = scrubPII("Call me on 555-867-5309 anytime.");
    expect(result).not.toContain("555-867-5309");
    expect(result).toContain("[REDACTED_PHONE]");
  });

  it("redacts phone numbers with spaces and parentheses", () => {
    const result = scrubPII("Call +1 (555) 867 5309 tomorrow.");
    expect(result).not.toContain("(555) 867 5309");
    expect(result).toContain("[REDACTED_PHONE]");
  });
});

describe("scrubPII — SSN redaction", () => {
  it("redacts a standard US SSN", () => {
    const result = scrubPII("My SSN is 123-45-6789. Please don't share it.");
    expect(result).not.toContain("123-45-6789");
    expect(result).toContain("[REDACTED_SSN]");
  });
});

describe("scrubPII — credit card redaction", () => {
  it("redacts credit-card-like digit sequences", () => {
    const result = scrubPII("Use card 4111 1111 1111 1111 for payment.");
    expect(result).not.toContain("4111 1111 1111 1111");
    expect(result).toContain("[REDACTED_CARD]");
  });
});

describe("scrubPII — address redaction", () => {
  it("redacts a conservative US-style address", () => {
    const result = scrubPII("Send it to 123 Main St for delivery.");
    expect(result).not.toContain("123 Main St");
    expect(result).toContain("[REDACTED_ADDRESS]");
  });

  it("redacts address with directional prefix", () => {
    const result = scrubPII("Send it to 123 N Main St for delivery.");
    expect(result).not.toContain("123 N Main St");
    expect(result).toContain("[REDACTED_ADDRESS]");
  });

  it("redacts address with abbreviated street number + street name + suffix", () => {
    const result = scrubPII("Ship to 456 S. 2nd Ave tomorrow.");
    expect(result).not.toContain("456 S. 2nd Ave");
    expect(result).toContain("[REDACTED_ADDRESS]");
  });
});


describe("scrubPII — ReDoS regression fix", () => {

  const TIMEOUT_MS = 100;

  it("completes in under 100ms when NLP returns (a+)+", () => {
    const input = "Meet [NAME:(a+)+], the hero.";
    const start = Date.now();
    scrubPII(input);
    expect(Date.now() - start).toBeLessThan(TIMEOUT_MS);
  });

  it("completes in under 100ms when NLP returns (a+)+b", () => {
    const input = "The villain is [NAME:(a+)+b].";
    const start = Date.now();
    scrubPII(input);
    expect(Date.now() - start).toBeLessThan(TIMEOUT_MS);
  });

  it("completes in under 100ms when NLP returns all regex metacharacters", () => {
    const input = "Character: [NAME:.*+?^${}()|[\\]].";
    const start = Date.now();
    scrubPII(input);
    expect(Date.now() - start).toBeLessThan(TIMEOUT_MS);
  });

  it("completes in under 100ms when NLP returns ((a+)+)+", () => {
    const input = "The wizard [NAME:((a+)+)+] cast a spell.";
    const start = Date.now();
    scrubPII(input);
    expect(Date.now() - start).toBeLessThan(TIMEOUT_MS);
  });

  it("still redacts the name correctly after escaping", () => {
    const input = "Say hello to [NAME:Merlin].";
  const result = scrubPII(input);
  expect(result).not.toContain("Merlin");
  expect(result).toContain("[REDACTED_NAME]");
});
});

describe("scrubPII — edge cases", () => {
  it("returns empty string unchanged", () => {
    expect(scrubPII("")).toBe("");
  });

  it("handles a prompt with no PII at all", () => {
    const input = "Write a story about a space adventure.";
    expect(scrubPII(input)).toBe(input);
  });
});

describe("scrubPII — idempotency", () => {
  it("is stable when called twice", () => {
    const input = "Contact alice@example.com or call 555-867-5309. 123 Main St";
    const once = scrubPII(input);
    const twice = scrubPII(once);
    expect(twice).toBe(once);
  });

  it("does not further change already-redacted tokens", () => {
    const input = "Already scrubbed: [REDACTED_EMAIL] [REDACTED_PHONE] [REDACTED_NAME]";
    const once = scrubPII(input);
    const twice = scrubPII(once);
    expect(twice).toBe(once);
  });
});


describe("piiScrubberMiddleware — body fields", () => {
  beforeEach(() => jest.clearAllMocks());

  it("scrubs the prompt field and calls next()", () => {
    const { req, res, next } = buildMiddlewareMocks({
      prompt: "Contact alice@example.com",
    });
    piiScrubberMiddleware(req, res, next);
    expect(req.body.prompt).toContain("[REDACTED_EMAIL]");
    expect(next).toHaveBeenCalledWith();
  });

  it("scrubs the content field", () => {
    const { req, res, next } = buildMiddlewareMocks({
      content: "Call 555-123-4567 for details",
    });
    piiScrubberMiddleware(req, res, next);
    expect(req.body.content).toContain("[REDACTED_PHONE]");
    expect(next).toHaveBeenCalledWith();
  });

  it("scrubs the title field", () => {
    const { req, res, next } = buildMiddlewareMocks({
      title: "Story by bob@stories.io",
    });
    piiScrubberMiddleware(req, res, next);
    expect(req.body.title).toContain("[REDACTED_EMAIL]");
    expect(next).toHaveBeenCalledWith();
  });

  it("scrubs the message field", () => {
    const { req, res, next } = buildMiddlewareMocks({
      message: "My number is 800-555-0199",
    });
    piiScrubberMiddleware(req, res, next);
    expect(req.body.message).toContain("[REDACTED_PHONE]");
    expect(next).toHaveBeenCalledWith();
  });

  it("calls next(err) if scrubPII throws", () => {
    const compromise = require("compromise");
    compromise.mockImplementationOnce(() => {
      throw new Error("NLP crashed");
    });
    const { req, res, next } = buildMiddlewareMocks({
      prompt: "some text",
    });
    piiScrubberMiddleware(req, res, next);
    const err = (next as jest.Mock).mock.calls[0][0];
    expect(err).toBeInstanceOf(Error);
    expect(err.message).toBe("NLP crashed");
  });
});