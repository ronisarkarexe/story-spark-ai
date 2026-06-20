/**
 * guest.cookie.test.ts
 * ---------------------
 * Verifies that ALL guest AI endpoints use the shared setGuestUserIdCookie
 * helper (issue #2436 — standardize guest cookie security configuration).
 *
 * Covers: aiFreeModelGenerate, aiFreeModelAlternateEndings, aiFreeModelRemix,
 *         aiFreeModelTranslate, aiFreeModelChat, aiFreeStoryContinuation
 */

import type { Request, Response } from "express";

// ── Mocks ────────────────────────────────────────────────────────────────────

jest.mock("../../../../utils/cookie.util", () => ({
  setGuestUserIdCookie: jest.fn(),
}));

jest.mock("../ai_model.service", () => ({
  AiModelService: {
    aiModelGenerate: jest.fn().mockResolvedValue("result"),
    aiModelAlternateEndings: jest.fn().mockResolvedValue("result"),
    aiModelRemix: jest.fn().mockResolvedValue("result"),
    aiModelTranslate: jest.fn().mockResolvedValue("result"),
    aiModelChat: jest.fn().mockResolvedValue("result"),
    aiModelStoryContinuation: jest.fn().mockResolvedValue("result"),
  },
}));

jest.mock("../quota.service", () => ({
  reserveGuestQuota: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("../quota.lifecycle", () => ({
  createGuestQuotaGuard: jest.fn().mockReturnValue({ refundOnce: jest.fn() }),
  runWithQuotaCleanup: jest.fn().mockImplementation((_guard, fn) => fn()),
}));

// ── Imports after mocks ───────────────────────────────────────────────────────

import { setGuestUserIdCookie } from "../../../../utils/cookie.util";
import { AiModelController } from "../ai_model.controller";

// ── Helpers ───────────────────────────────────────────────────────────────────

const mockSetCookie = setGuestUserIdCookie as jest.MockedFunction<typeof setGuestUserIdCookie>;

function buildReqRes(existingUserId?: string) {
  const req = {
    body: { prompt: "test", message: "hi", history: [] },
    cookies: existingUserId ? { userId: existingUserId } : {},
  } as unknown as Request;

  const res = {
    cookie: jest.fn(),
    locals: {},
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  return { req, res };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

const guestEndpoints: Array<[string, keyof typeof AiModelController]> = [
  ["aiFreeModelGenerate", "aiFreeModelGenerate"],
  ["aiFreeModelAlternateEndings", "aiFreeModelAlternateEndings"],
  ["aiFreeModelRemix", "aiFreeModelRemix"],
  ["aiFreeModelTranslate", "aiFreeModelTranslate"],
  ["aiFreeModelChat", "aiFreeModelChat"],
  ["aiFreeStoryContinuation", "aiFreeStoryContinuation"],
];

describe("Guest AI endpoints — cookie standardization (#2436)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe.each(guestEndpoints)("%s", (_name, handlerKey) => {
    it("calls setGuestUserIdCookie when no userId cookie exists", async () => {
      const { req, res } = buildReqRes();
      await (AiModelController[handlerKey] as Function)(req, res, jest.fn());

      expect(mockSetCookie).toHaveBeenCalledTimes(1);
      expect(mockSetCookie).toHaveBeenCalledWith(res, expect.any(String));
    });

    it("does NOT call setGuestUserIdCookie when userId cookie already exists", async () => {
      const { req, res } = buildReqRes("existing-user-id");
      await (AiModelController[handlerKey] as Function)(req, res, jest.fn());

      expect(mockSetCookie).not.toHaveBeenCalled();
    });

    it("does NOT call res.cookie() directly — uses helper only", async () => {
      const { req, res } = buildReqRes();
      await (AiModelController[handlerKey] as Function)(req, res, jest.fn());

      expect(res.cookie).not.toHaveBeenCalled();
    });
  });
});
