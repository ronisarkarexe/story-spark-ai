import {
  checkAndTrackRequest,
  releaseRequest,
} from "../utils/idempotency";

describe("checkAndTrackRequest", () => {
  it("returns true for a new request", () => {
    const result = checkAndTrackRequest("user1", { action: "create" });
    expect(result).toBe(true);
  });

  it("returns false for a duplicate request within the deduplication window", async () => {
    const userId = "user2";
    const body = { action: "update" };

    const first = checkAndTrackRequest(userId, body);
    expect(first).toBe(true);

    const second = checkAndTrackRequest(userId, body);
    expect(second).toBe(false);
  });

  it("returns true for a different body from the same user", () => {
    const userId = "user3";
    const result = checkAndTrackRequest(userId, { action: "read" });
    expect(result).toBe(true);
  });

  it("returns true for the same body from a different user", () => {
    const body = { action: "delete" };
    const result = checkAndTrackRequest("user4", body);
    expect(result).toBe(true);
  });

  it("returns true for a null body", () => {
    const result = checkAndTrackRequest("user5", null);
    expect(result).toBe(true);
  });

  it("returns true for an empty body object", () => {
    const result = checkAndTrackRequest("user6", {});
    expect(result).toBe(true);
  });

  it("returns false for identical empty bodies within window", async () => {
    const userId = "user7";
    const first = checkAndTrackRequest(userId, {});
    expect(first).toBe(true);

    const second = checkAndTrackRequest(userId, {});
    expect(second).toBe(false);
  });
});

describe("releaseRequest", () => {
  it("allows a released request to pass again", () => {
    const userId = "user8";
    const body = { action: "release-test" };

    const first = checkAndTrackRequest(userId, body);
    expect(first).toBe(true);

    releaseRequest(userId, body);

    const second = checkAndTrackRequest(userId, body);
    expect(second).toBe(true);
  });

  it("releaseRequest does not affect different users", () => {
    const body = { action: "cross-user" };

    checkAndTrackRequest("userA", body);
    releaseRequest("userA", body);

    const result = checkAndTrackRequest("userA", body);
    expect(result).toBe(true);

    const otherUser = checkAndTrackRequest("userB", body);
    expect(otherUser).toBe(true);
  });

  it("releaseRequest does not affect different bodies for same user", () => {
    const userId = "user9";

    checkAndTrackRequest(userId, { action: "alpha" });
    checkAndTrackRequest(userId, { action: "beta" });

    releaseRequest(userId, { action: "alpha" });

    const alphaSecond = checkAndTrackRequest(userId, { action: "alpha" });
    expect(alphaSecond).toBe(true);

    const betaStillBlocked = checkAndTrackRequest(userId, { action: "beta" });
    expect(betaStillBlocked).toBe(false);
  });
});
