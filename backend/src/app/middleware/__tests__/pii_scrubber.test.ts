/**
 * Unit tests for the PII scrubber middleware.
 */
import { scrubPII, piiScrubberMiddleware } from "../pii_scrubber";

describe("scrubPII", () => {
  it("returns falsy values unchanged", () => {
    // scrubPII returns the input as-is when falsy (null, undefined, empty string)
    expect(scrubPII(null as unknown as string)).toBe(null);
    expect(scrubPII(undefined as unknown as string)).toBe(undefined);
    expect(scrubPII("")).toBe("");
  });

  it("redacts email addresses", () => {
    const input = "Contact me at john.doe@example.com for more info.";
    const result = scrubPII(input);
    expect(result).toContain("[REDACTED_EMAIL]");
    expect(result).not.toContain("john.doe@example.com");
  });

  it("redacts multiple email addresses", () => {
    const input = "Email john@example.com or jane@company.org";
    const result = scrubPII(input);
    expect(result).not.toContain("john@example.com");
    expect(result).not.toContain("jane@company.org");
    expect(result).toContain("[REDACTED_EMAIL]");
  });

  it("redacts US phone numbers in 555-867-5309 format", () => {
    const input = "Call me at 555-867-5309 anytime.";
    const result = scrubPII(input);
    expect(result).toContain("[REDACTED_PHONE]");
    expect(result).not.toContain("555-867-5309");
  });

  it("redacts US phone numbers in (555) 867-5309 format", () => {
    const input = "My number is (555) 867-5309.";
    const result = scrubPII(input);
    expect(result).toContain("[REDACTED_PHONE]");
    expect(result).not.toContain("(555) 867-5309");
  });

  it("redacts US phone numbers with dots", () => {
    const input = "Reach me at 555.867.5309.";
    const result = scrubPII(input);
    expect(result).toContain("[REDACTED_PHONE]");
    expect(result).not.toContain("555.867.5309");
  });

  it("redacts SSN in 123-45-6789 format", () => {
    const input = "My SSN is 123-45-6789.";
    const result = scrubPII(input);
    expect(result).toContain("[REDACTED_SSN]");
    expect(result).not.toContain("123-45-6789");
  });

  it("redacts SSN with spaces", () => {
    const input = "SSN: 123 45 6789";
    const result = scrubPII(input);
    expect(result).toContain("[REDACTED_SSN]");
    expect(result).not.toContain("123 45 6789");
  });

  it("redacts credit card-like sequences (13-19 digits)", () => {
    const input = "Card number: 4111 1111 1111 1111";
    const result = scrubPII(input);
    expect(result).toContain("[REDACTED_CARD]");
    expect(result).not.toContain("4111 1111 1111 1111");
  });

  it("returns original text when no PII is present", () => {
    const input = "The quick brown fox jumps over the lazy dog.";
    expect(scrubPII(input)).toBe(input);
  });

  it("does not leave partial email addresses", () => {
    const input = "Email: test@domain.com please";
    const result = scrubPII(input);
    expect(result).not.toContain("@domain.com");
    expect(result).toContain("[REDACTED_EMAIL]");
  });
});

describe("piiScrubberMiddleware", () => {
  const mockNext = jest.fn();
  const createMockReq = (body: Record<string, unknown> = {}) => ({
    body,
  });

  beforeEach(() => {
    mockNext.mockClear();
  });

  it("calls next without error when no body is present", () => {
    const req = createMockReq({});
    piiScrubberMiddleware(req as any, {} as any, mockNext);
    expect(mockNext).toHaveBeenCalledWith();
  });

  it("scrubs the prompt field in body", () => {
    const req = createMockReq({
      prompt: "Contact me at secret@example.com",
    });
    piiScrubberMiddleware(req as any, {} as any, mockNext);
    expect((req.body as any).prompt).toContain("[REDACTED_EMAIL]");
    expect((req.body as any).prompt).not.toContain("secret@example.com");
    expect(mockNext).toHaveBeenCalledWith();
  });

  it("scrubs the content field in body", () => {
    const req = createMockReq({
      content: "Call 555-123-4567 for details",
    });
    piiScrubberMiddleware(req as any, {} as any, mockNext);
    expect((req.body as any).content).toContain("[REDACTED_PHONE]");
    expect(mockNext).toHaveBeenCalledWith();
  });

  it("scrubs the title field in body", () => {
    const req = createMockReq({
      title: "Meeting notes for john@company.com",
    });
    piiScrubberMiddleware(req as any, {} as any, mockNext);
    expect((req.body as any).title).toContain("[REDACTED_EMAIL]");
    expect(mockNext).toHaveBeenCalledWith();
  });

  it("scrubs the message field in body (for chat)", () => {
    const req = createMockReq({
      message: "My SSN is 123-45-6789",
    });
    piiScrubberMiddleware(req as any, {} as any, mockNext);
    expect((req.body as any).message).toContain("[REDACTED_SSN]");
    expect(mockNext).toHaveBeenCalledWith();
  });

  it("passes through non-string prompt without crashing", () => {
    // scrubPII coerces non-string values; middleware should not throw
    const req = createMockReq({
      prompt: 12345 as unknown as string,
    });
    piiScrubberMiddleware(req as any, {} as any, mockNext);
    expect(mockNext).toHaveBeenCalledWith();
  });

  it("leaves non-string fields unchanged", () => {
    const req = createMockReq({
      count: 42,
      active: true,
    });
    piiScrubberMiddleware(req as any, {} as any, mockNext);
    expect((req.body as any).count).toBe(42);
    expect((req.body as any).active).toBe(true);
    expect(mockNext).toHaveBeenCalledWith();
  });
});
