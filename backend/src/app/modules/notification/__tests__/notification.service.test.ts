const mockFindOne = jest.fn();
const mockFind = jest.fn();
const mockCountDocuments = jest.fn();
const mockFindOneAndUpdate = jest.fn();
const mockUpdateMany = jest.fn();
const mockDeleteMany = jest.fn();
const mockEmitNotificationToUser = jest.fn();
const mockEmitNotificationStateToUser = jest.fn();

jest.mock("../notification.model", () => ({
  Notification: {
    create: jest.fn(),
    find: mockFind,
    countDocuments: mockCountDocuments,
    findOneAndUpdate: mockFindOneAndUpdate,
    updateMany: mockUpdateMany,
    deleteMany: mockDeleteMany,
  },
}), { virtual: true });

jest.mock("../../user/user.model", () => ({
  User: {
    findOne: mockFindOne,
  },
}), { virtual: true });

jest.mock("../../../../socket/notification.socket", () => ({
  emitNotificationToUser: mockEmitNotificationToUser,
  emitNotificationStateToUser: mockEmitNotificationStateToUser,
}), { virtual: true });

import { NotificationService } from "../notification.service";

describe("NotificationService.resolveUserId", () => {
  beforeEach(() => {
    mockFindOne.mockReset();
    mockFind.mockReset();
    mockCountDocuments.mockReset();
    mockFindOneAndUpdate.mockReset();
    mockUpdateMany.mockReset();
    mockDeleteMany.mockReset();
    mockEmitNotificationToUser.mockReset();
    mockEmitNotificationStateToUser.mockReset();
  });

  it("uses _id from the token without hitting the database", async () => {
    const token = {
      _id: "user-123",
      email: "ada@example.com",
      role: "user",
      name: "Ada",
      subscriptionType: "FREE",
      postsCount: 0,
    } as any;

    await expect(NotificationService.resolveUserId(token)).resolves.toBe("user-123");
    expect(mockFindOne).not.toHaveBeenCalled();
  });

  it("falls back to email lookup when _id is missing", async () => {
    mockFindOne.mockReturnValueOnce({
      select: jest.fn().mockResolvedValueOnce({
        _id: { toString: () => "user-456" },
      }),
    });

    const token = {
      email: "ada@example.com",
      role: "user",
      name: "Ada",
      subscriptionType: "FREE",
      postsCount: 0,
    } as any;

    await expect(NotificationService.resolveUserId(token)).resolves.toBe("user-456");
    expect(mockFindOne).toHaveBeenCalledWith({ email: "ada@example.com" });
  });
});

describe("NotificationService.markNotificationAsRead", () => {
  beforeEach(() => {
    mockFindOneAndUpdate.mockReset();
    mockFindOne.mockReset();
    mockEmitNotificationStateToUser.mockReset();
  });

  it("throws a 400 Bad Request error if the notification ID is invalid", async () => {
    const token = { _id: "user-123" } as any;
    await expect(
      NotificationService.markNotificationAsRead("invalid-id", token)
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "Invalid notification ID",
    });
  });

  it("successfully marks a notification as read with a valid ObjectId", async () => {
    const validObjectId = "60c72b2f9b1d8e256c8b4567";
    const token = { _id: "user-123" } as any;

    mockFindOneAndUpdate.mockResolvedValueOnce({
      _id: validObjectId,
      userId: "user-123",
      isRead: true,
    });

    const result = await NotificationService.markNotificationAsRead(validObjectId, token);
    expect(result).toBeDefined();
    expect(result.isRead).toBe(true);
    expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
      { _id: validObjectId, userId: "user-123" },
      { isRead: true },
      { new: true }
    );
    expect(mockEmitNotificationStateToUser).toHaveBeenCalledWith(
      "user-123",
      "notification:updated",
      expect.any(Object)
    );
  });
});

