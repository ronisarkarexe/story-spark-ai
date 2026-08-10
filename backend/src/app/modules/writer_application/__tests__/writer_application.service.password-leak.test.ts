jest.mock("../../user/user.model", () => ({
  __esModule: true,
  User: { findByIdAndUpdate: jest.fn() },
}));

const populateMock = jest.fn();
const sortMock = jest.fn();

jest.mock("../writer_application.model", () => ({
  __esModule: true,
  WriterApplication: { find: jest.fn(), findOne: jest.fn(), findById: jest.fn() },
}));

import { WriterApplication } from "../writer_application.model";
import { WriterApplicationService } from "../writer_application.service";

describe("writer_application.service password-hash leak (#6525)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const findChain: any = {
      populate: populateMock.mockReturnThis(),
      sort: sortMock.mockReturnThis(),
      then: (resolve: (v: unknown) => unknown) =>
        Promise.resolve([{ _id: "app1", user: { email: "u@x.com" } }]).then(resolve),
    };
    (WriterApplication.find as jest.Mock).mockReturnValue(findChain);
  });

  it("getAllApplications populates the user with -password so hashes are not leaked", async () => {
    const result = (await WriterApplicationService.getAllApplications()) as any;

    expect(Array.isArray(result)).toBe(true);
    expect(WriterApplication.find).toHaveBeenCalledTimes(1);
    // populate must be called with ("user", "-password") — not just ("user").
    expect(populateMock).toHaveBeenCalledWith("user", "-password");
  });
});
