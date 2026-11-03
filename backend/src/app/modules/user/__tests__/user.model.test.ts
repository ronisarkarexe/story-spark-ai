jest.mock(
  "bcryptjs",
  () => ({
    hash: jest.fn(),
  }),
  { virtual: true }
);

jest.mock("../../../../config", () => ({
  __esModule: true,
  default: {
    bcrypt_salt_rounds: 10,
  },
}));

import { User } from "../user.model";

describe("User model name validation", () => {
  it("allows short OAuth display names", () => {
    const user = new User({
      email: "ada@example.com",
      name: "Ada",
    });

    const validationError = user.validateSync();

    expect(validationError).toBeUndefined();
  });
});
