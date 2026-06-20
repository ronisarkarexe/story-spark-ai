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

describe("scrubPII — new redaction rules", () => {
  it("redacts IPv4 and IPv6 addresses", () => {
    const ipv4 = "The server is at 192.168.1.50 right now.";
    const ipv6 = "Connect to 2001:0db8:85a3:0000:0000:8a2e:0370:7334 please.";
    expect(scrubPII(ipv4)).toBe("The server is at [REDACTED_IP] right now.");
    expect(scrubPII(ipv6)).toBe("Connect to [REDACTED_IP] please.");
  });

  it("redacts SSNs", () => {
    const input = "My SSN is 123-45-6789.";
    expect(scrubPII(input)).toBe("My SSN is [REDACTED_SSN].");
  });

  it("redacts Credit Card numbers", () => {
    const input1 = "My card is 4111-1111-1111-1111.";
    const input2 = "My card is 4111111111111111.";
    expect(scrubPII(input1)).toBe("My card is [REDACTED_CREDIT_CARD].");
    expect(scrubPII(input2)).toBe("My card is [REDACTED_CREDIT_CARD].");
  });

  it("redacts secrets, passwords, and API keys", () => {
    const input1 = "api_key=abcdef123456";
    const input2 = "password: mysecurepassword123";
    expect(scrubPII(input1)).toBe("[REDACTED_SECRET]");
    expect(scrubPII(input2)).toBe("[REDACTED_SECRET]");
  });

  it("redacts street addresses", () => {
    const input = "I live at 1600 Amphitheatre Parkway Mountain View.";
    expect(scrubPII(input)).toBe("I live at [REDACTED_ADDRESS] Mountain View.");
  });

  it("redacts names with casing variations and introductory phrases", () => {
    const input1 = "my name is john doe";
    const input2 = "sincerely, jane smith";
    const input3 = "Meet dr. raj patel at the clinic.";
    expect(scrubPII(input1)).toBe("my name is [REDACTED_NAME]");
    expect(scrubPII(input2)).toBe("sincerely, [REDACTED_NAME]");
    expect(scrubPII(input3)).toBe("Meet dr. [REDACTED_NAME] at the clinic.");
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