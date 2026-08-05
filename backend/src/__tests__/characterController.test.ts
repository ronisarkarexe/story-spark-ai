jest.mock("../Character.model", () => ({
  Character: {
    findOneAndUpdate: jest.fn(),
  },
}));

import { Request, Response } from "express";
import { Character } from "../Character.model";
import { updateCharacter } from "../controllers/character.controller";

const mockFindOneAndUpdate = Character.findOneAndUpdate as jest.MockedFunction<
  typeof Character.findOneAndUpdate
>;

describe("updateCharacter controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn().mockReturnThis();
    next = jest.fn();

    req = {
      params: {
        id: "507f1f77bcf86cd799439011",
      },
      user: {
        id: "507f191e810c19729de860ea",
      } as any,
      body: {
        name: "New Name",
        userId: "12345",
        _id: "507f1f77bcf86cd799439011",
        createdAt: "2026-01-01",
        updatedAt: "2026-01-02",
      },
    };

    res = {
      status: statusMock,
      json: jsonMock,
    };
  });

  it("does not mutate the original req.body when stripping protected fields", async () => {
    const updatedCharacterDoc = {
      _id: "507f1f77bcf86cd799439011",
      userId: "507f191e810c19729de860ea",
      name: "New Name",
    };

    mockFindOneAndUpdate.mockResolvedValue(updatedCharacterDoc as any);

    await updateCharacter(req as Request, res as Response, next);

    // Verify req.body is untouched
    expect(req.body).toEqual({
      name: "New Name",
      userId: "12345",
      _id: "507f1f77bcf86cd799439011",
      createdAt: "2026-01-01",
      updatedAt: "2026-01-02",
    });

    // Verify findOneAndUpdate received sanitized payload
    expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
      { _id: "507f1f77bcf86cd799439011", userId: "507f191e810c19729de860ea" },
      { $set: { name: "New Name" } },
      { new: true, runValidators: true }
    );

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({
      success: true,
      data: updatedCharacterDoc,
    });
  });
});
