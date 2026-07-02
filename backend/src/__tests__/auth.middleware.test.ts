import httpStatus from "http-status";
import auth from "../app/middleware/auth.middleware";
import { JwtHelpers } from "../utils/jwt.helper";
import { TokenBlacklist } from "../app/modules/auth/tokenBlacklist.model";
import { User } from "../app/modules/user/user.model";
import { USER_STATUS } from "../enums/user_status";

jest.mock("../app/modules/auth/tokenBlacklist.model", () => ({
  TokenBlacklist: {
    findOne: jest.fn(),
  },
}));

jest.mock("../app/modules/user/user.model", () => ({
  User: {
    findById: jest.fn(),
  },
}));

jest.mock("../utils/jwt.helper", () => ({
  JwtHelpers: {
    verifyToken: jest.fn(),
  },
}));

describe("auth middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("rejects cookie-based auth when the request is not over HTTPS or a trusted origin", async () => {
    (JwtHelpers.verifyToken as jest.Mock).mockReturnValue({
      _id: "user-123",
      role: "user",
    });
    (TokenBlacklist.findOne as jest.Mock).mockResolvedValue(null);
    (User.findById as jest.Mock).mockResolvedValue({
      _id: "user-123",
      tokenVersion: 0,
      status: USER_STATUS.ACTIVE,
    });

    const req = {
      headers: {},
      cookies: { accessToken: "cookie-token" },
      secure: false,
      protocol: "http",
      get: jest.fn().mockImplementation((name: string) => {
        if (name === "host") return "api.example.com";
        return undefined;
      }),
    } as any;
    const res = {} as any;
    const next = jest.fn();

    await auth()(req, res, next);

    expect(JwtHelpers.verifyToken).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: httpStatus.UNAUTHORIZED,
        message: expect.stringContaining("Cookie-based authentication"),
      })
    );
  });
});
