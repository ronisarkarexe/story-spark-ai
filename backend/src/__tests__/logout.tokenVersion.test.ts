/**
 * Regression test for: JWT access token remains valid after logout
 *
 * Root cause: logout() only revoked the refresh-token session but never
 * incremented tokenVersion, so auth.middleware.ts kept accepting the old
 * access token until its natural expiry.
 *
 * Fix: logout() now calls User.updateOne({ $inc: { tokenVersion: 1 } })
 * so auth.middleware.ts rejects the stale access token immediately.
 */

import { AuthService } from "../app/modules/auth/auth.service";
import { User } from "../app/modules/user/user.model";
import { RefreshSession } from "../app/modules/auth/refresh_session.model";
import { JwtHalers } from "../utils/jwt.helper";
import config from "../config";
import { Secret } from "jsonwebtoken";

// ─── Mocks ────────────────────────────────────────────────────────────────────

jest.mock("../app/modules/user/user.model", () => ({
  User: {
    updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
    findById: jest.fn(),
    findOne: jest.fn(),
  },
}));

jest.mock("../app/modules/auth/refresh_session.model", () => ({
  RefreshSession: {
    updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
  },
}));

jest.mock("../utils/jwt.helper", () => ({
  JwtHalers: {
    verifyToken: jest.fn(),
    createToken: jest.fn(),
  },
}));

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("AuthService.logout – token revocation", () => {
  const fakeUserId = "user_abc123";
  const fakeJti = "jti_xyz789";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("increments tokenVersion on logout so the access token is immediately rejected", async () => {
    // Arrange: verifyToken returns a payload with _id and jti
    (JwtHalers.verifyToken as jest.Mock).mockReturnValue({
      _id: fakeUserId,
      email: "test@example.com",
      jti: fakeJti,
      tokenVersion: 0,
    });

    // Act
    await AuthService.logout("some.valid.refresh.token");

    // Assert: refresh session is revoked
    expect(RefreshSession.updateOne).toHaveBeenCalledWith(
      { jti: fakeJti },
      { revoked: true }
    );

    // Assert: tokenVersion is bumped — this is the regression guard
    expect(User.updateOne).toHaveBeenCalledWith(
      { _id: fakeUserId },
      { $inc: { tokenVersion: 1 } }
    );
  });

  it("still clears the refresh session even if tokenVersion bump is the only new step", async () => {
    (JwtHalers.verifyToken as jest.Mock).mockReturnValue({
      _id: fakeUserId,
      jti: fakeJti,
      tokenVersion: 2,
    });

    await AuthService.logout("token");

    expect(RefreshSession.updateOne).toHaveBeenCalledTimes(1);
    expect(User.updateOne).toHaveBeenCalledTimes(1);
  });

  it("does nothing when no token is supplied", async () => {
    await AuthService.logout(undefined);

    expect(JwtHalers.verifyToken).not.toHaveBeenCalled();
    expect(RefreshSession.updateOne).not.toHaveBeenCalled();
    expect(User.updateOne).not.toHaveBeenCalled();
  });

  it("swallows errors silently when the token is invalid", async () => {
    (JwtHalers.verifyToken as jest.Mock).mockImplementation(() => {
      throw new Error("invalid signature");
    });

    // Should not throw
    await expect(AuthService.logout("bad.token")).resolves.toBeUndefined();
    expect(User.updateOne).not.toHaveBeenCalled();
  });
});