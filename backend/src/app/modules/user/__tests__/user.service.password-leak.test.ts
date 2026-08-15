jest.mock("bcryptjs", () => ({ hash: jest.fn() }), { virtual: true });

jest.mock("../../../../config", () => ({
  __esModule: true,
  default: { bcrypt_salt_rounds: 10 },
}));

// Heavy modules the service imports but these tests don't exercise.
jest.mock("nodemailer", () => ({ createTransport: jest.fn(() => ({ sendMail: jest.fn() })) }));

const postFindMock = jest.fn();
const followMock = { populate: jest.fn().mockReturnThis(), lean: jest.fn().mockResolvedValue([]) };

jest.mock("../../post/post.model", () => ({
  __esModule: true,
  Post: { find: postFindMock },
}));

jest.mock("../../follow/follow.model", () => ({
  __esModule: true,
  Follow: {},
}));

jest.mock("../../comment/comment.model", () => ({ __esModule: true, Comment: {} }));
jest.mock("../../reaction/reaction.model", () => ({ __esModule: true, Reaction: {} }));
jest.mock("../../bookmark/bookmark.model", () => ({ __esModule: true, Bookmark: {} }));
jest.mock("../../notification/notification.model", () => ({ __esModule: true, Notification: {} }));
jest.mock("../../story_version/story_version.model", () => ({ __esModule: true, StoryVersion: {} }));
jest.mock("../../report/report.model", () => ({ __esModule: true, Report: {} }));

// Chainable query mock that records whether select("-password") was invoked.
function chainable(finalValue: unknown) {
  const state = { selectCalled: false, populateCalls: 0 };
  const self: any = {
    select(arg: string) {
      if (arg === "-password") state.selectCalled = true;
      return self;
    },
    populate(..._args: unknown[]) {
      state.populateCalls += 1;
      return self;
    },
    sort() {
      return self;
    },
    then(resolve: (v: unknown) => unknown) {
      return Promise.resolve(finalValue).then(resolve);
    },
    catch() {
      return self;
    },
    __state: state,
  };
  return self;
}

const userDoc = {
  _id: "u1",
  email: "me@example.com",
  name: "Me",
  password: "$2a$10$LEAKEDHASH",
  followers: [],
  following: [],
};

const findOneMock = jest.fn(() => chainable(userDoc));
const findMock = jest.fn(() => chainable([userDoc]));

jest.mock("../user.model", () => ({
  __esModule: true,
  User: { findOne: findOneMock, find: findMock },
}));

import { UserService } from "../user.service";

describe("user.service password-hash leak (#6525)", () => {
  beforeEach(() => {
    findOneMock.mockImplementation(() => chainable(userDoc));
    findMock.mockImplementation(() => chainable([userDoc]));
  });

  it("getProfileInfo excludes the password field from the query", async () => {
    const token = { email: "me@example.com" } as any;
    const result = (await UserService.getProfileInfo(token)) as any;

    expect(result).toBeTruthy();
    expect(findOneMock).toHaveBeenCalledWith({ email: "me@example.com" });
    const chain = findOneMock.mock.results[0].value;
    expect(chain.__state.selectCalled).toBe(true);
  });

  it("getAllWriterApplicationUsers excludes the password field from the query", async () => {
    const result = (await UserService.getAllWriterApplicationUsers()) as any;

    expect(Array.isArray(result)).toBe(true);
    expect(findMock).toHaveBeenCalledWith({ isApplyForWriter: true });
    const chain = findMock.mock.results[0].value;
    expect(chain.__state.selectCalled).toBe(true);
  });
});
