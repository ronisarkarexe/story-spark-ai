jest.mock("../Character.model", () => ({
  Character: {
    findOne: jest.fn(),
  },
}));

jest.mock("../utils/character_portrait_generation", () => ({
  generateCharacterPortrait: jest.fn(),
}));

import { Request, Response } from "express";
import { Character } from "../Character.model";
import { generateCharacterPortrait } from "../utils/character_portrait_generation";
import { generatePortrait } from "../controllers/character_portrait.controller";

const mockFindOne = Character.findOne as jest.MockedFunction<
  typeof Character.findOne
>;

const mockGenerateCharacterPortrait =
  generateCharacterPortrait as jest.MockedFunction<
    typeof generateCharacterPortrait
  >;

describe("Character portrait controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn().mockReturnThis();

    req = {
      params: {
        id: "507f1f77bcf86cd799439011",
      },
      user: {
        id: "507f191e810c19729de860ea",
      } as Request["user"],
    };

    res = {
      status: statusMock,
      json: jsonMock,
    };
  });

  it("generates, persists, and returns a character portrait", async () => {
    const saveMock = jest.fn().mockResolvedValue(undefined);

    const character = {
      name: "Aria Vale",
      role: "Protagonist",
      age: 27,
      personality: "Brave",
      appearance: "Silver hair",
      background: "Mountain village",
      traits: ["loyal"],
      portraitUrl: undefined as string | undefined,
      save: saveMock,
    };

    mockFindOne.mockResolvedValue(character as any);
    mockGenerateCharacterPortrait.mockResolvedValue(
      "data:image/png;base64,new-portrait"
    );

    await generatePortrait(
      req as Request,
      res as Response
    );

    expect(mockFindOne).toHaveBeenCalledWith({
      _id: "507f1f77bcf86cd799439011",
      userId: "507f191e810c19729de860ea",
    });

    expect(mockGenerateCharacterPortrait).toHaveBeenCalledWith({
      name: "Aria Vale",
      role: "Protagonist",
      age: 27,
      personality: "Brave",
      appearance: "Silver hair",
      background: "Mountain village",
      traits: ["loyal"],
    });

    expect(character.portraitUrl).toBe(
      "data:image/png;base64,new-portrait"
    );
    expect(saveMock).toHaveBeenCalledTimes(1);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: "Character portrait generated successfully",
        data: character,
      })
    );
  });

  it("returns 401 when authentication is missing", async () => {
    req.user = undefined;

    await generatePortrait(
      req as Request,
      res as Response
    );

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(mockFindOne).not.toHaveBeenCalled();
    expect(mockGenerateCharacterPortrait).not.toHaveBeenCalled();
  });

  it("returns 400 for an invalid character ID", async () => {
    req.params = {
      id: "invalid-character-id",
    };

    await generatePortrait(
      req as Request,
      res as Response
    );

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(mockFindOne).not.toHaveBeenCalled();
  });

  it("returns 404 when the owned character does not exist", async () => {
    mockFindOne.mockResolvedValue(null);

    await generatePortrait(
      req as Request,
      res as Response
    );

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(mockGenerateCharacterPortrait).not.toHaveBeenCalled();
  });

  it("returns 503 when portrait generation fails", async () => {
    const character = {
      name: "Aria Vale",
      traits: [],
      save: jest.fn(),
    };

    mockFindOne.mockResolvedValue(character as any);
    mockGenerateCharacterPortrait.mockResolvedValue(null);

    await generatePortrait(
      req as Request,
      res as Response
    );

    expect(statusMock).toHaveBeenCalledWith(503);
    expect(character.save).not.toHaveBeenCalled();
  });

  it("returns 500 when an unexpected error occurs", async () => {
    mockFindOne.mockRejectedValue(
      new Error("Database unavailable")
    );

    await generatePortrait(
      req as Request,
      res as Response
    );

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      message: "Failed to generate character portrait",
    });
  });
});
