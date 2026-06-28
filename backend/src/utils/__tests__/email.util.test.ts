/**
 * email.util.test.ts
 * Unit tests for backend/src/utils/email.util.ts
 */

// Mock nodemailer
const mockSendMail = jest.fn();
jest.mock("nodemailer", () => ({
  createTransport: () => ({
    sendMail: mockSendMail,
  }),
}));

import config from "../../config/index";

let escapeHtml: any;
let sendVerificationEmail: any;
let sendContactEmail: any;

beforeAll(() => {
  (config as any).verify_email = "test@example.com";
  (config as any).verify_password = "test-password";
  (config as any).cors_origins = ["http://localhost:4001"];

  const emailUtil = require("../email.util");
  escapeHtml = emailUtil.escapeHtml;
  sendVerificationEmail = emailUtil.sendVerificationEmail;
  sendContactEmail = emailUtil.sendContactEmail;
});

beforeEach(() => {
  mockSendMail.mockReset();
  mockSendMail.mockResolvedValue(undefined);
});

describe("escapeHtml", () => {
  it("escapes ampersand", () => {
    expect(escapeHtml("a & b")).toBe("a &amp; b");
  });

  it("escapes less-than and greater-than", () => {
    expect(escapeHtml("<script>")).toBe("&lt;script&gt;");
  });

  it("escapes double quotes", () => {
    expect(escapeHtml('say "hello"')).toBe("say &quot;hello&quot;");
  });

  it("escapes single quotes", () => {
    expect(escapeHtml("it's")).toBe("it&#039;s");
  });

  it("handles empty string", () => {
    expect(escapeHtml("")).toBe("");
  });

  it("handles already-escaped content", () => {
    expect(escapeHtml("&lt;script&gt;")).toBe("&amp;lt;script&amp;gt;");
  });

  it("handles mixed safe and unsafe characters", () => {
    expect(escapeHtml("Hello <b>world</b> & friends")).toBe(
      "Hello &lt;b&gt;world&lt;/b&gt; &amp; friends"
    );
  });
});

describe("sendVerificationEmail", () => {
  it("sends a verification email with correct options", async () => {
    await sendVerificationEmail("user@example.com", "abc123token");
    expect(mockSendMail).toHaveBeenCalledTimes(1);
    const mailOptions = mockSendMail.mock.calls[0][0];
    expect(mailOptions.to).toBe("user@example.com");
    expect(mailOptions.subject).toBe("Verify your Newsletter Subscription");
    expect(mailOptions.html).toContain("abc123token");
  });

  it("includes unsubscribe footer when unsubscribeUrl is provided", async () => {
    await sendVerificationEmail("user@example.com", "token", "http://example.com/unsubscribe");
    const mailOptions = mockSendMail.mock.calls[0][0];
    expect(mailOptions.html).toContain("Unsubscribe");
  });

  it("does not throw when sendMail fails", async () => {
    mockSendMail.mockRejectedValue(new Error("SMTP error"));
    await expect(sendVerificationEmail("user@example.com", "token")).resolves.toBeUndefined();
  });
});

describe("sendContactEmail", () => {
  it("sends a bug-report email with correct subject", async () => {
    await sendContactEmail({
      fullname: "Alice",
      email: "alice@example.com",
      feedbackType: "bug-report",
      subject: "Login broken",
      message: "Cannot log in.",
    });
    expect(mockSendMail).toHaveBeenCalledTimes(1);
    const mailOptions = mockSendMail.mock.calls[0][0];
    expect(mailOptions.subject).toContain("Bug report");
    expect(mailOptions.subject).toContain("Login broken");
  });

  it("sends a feature-request email", async () => {
    await sendContactEmail({
      feedbackType: "feature-request",
      subject: "Dark mode",
      message: "Please add dark mode.",
    });
    const mailOptions = mockSendMail.mock.calls[0][0];
    expect(mailOptions.subject).toContain("Feature request");
  });

  it("sends a general-feedback email", async () => {
    await sendContactEmail({
      feedbackType: "general-feedback",
      subject: "Love the app",
      message: "Great work!",
    });
    const mailOptions = mockSendMail.mock.calls[0][0];
    expect(mailOptions.subject).toContain("General feedback");
  });

  it("escapes HTML in user-provided fields", async () => {
    await sendContactEmail({
      fullname: "<script>alert('xss')</script>",
      email: "test@example.com",
      feedbackType: "bug-report",
      subject: "<img src=x onerror=alert(1)>",
      message: "<b>Bold</b>",
    });
    const mailOptions = mockSendMail.mock.calls[0][0];
    expect(mailOptions.html).not.toContain("<script>");
    expect(mailOptions.html).not.toContain("<img");
    expect(mailOptions.html).toContain("&lt;script&gt;");
  });

  it("uses Anonymous user when fullname is omitted", async () => {
    await sendContactEmail({
      feedbackType: "general-feedback",
      subject: "Test",
      message: "Test message",
    });
    const mailOptions = mockSendMail.mock.calls[0][0];
    expect(mailOptions.html).toContain("Anonymous user");
  });
});
