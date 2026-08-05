import { Response } from "express";
import sendResponse from "../send_response";

const makeRes = (): Partial<Response> => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
});

describe("send_response", () => {
  it("sends correct JSON structure with all fields", () => {
    const res = makeRes();

    sendResponse(res as Response, {
      success: true,
      statusCode: 200,
      message: "Fetched successfully",
      meta: { page: 1, limit: 10, total: 1 },
      data: { id: "1", name: "Riko" },
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      statusCode: 200,
      message: "Fetched successfully",
      meta: { page: 1, limit: 10, total: 1 },
      data: { id: "1", name: "Riko" },
    });
  });

  it("preserves the correct HTTP status code", () => {
    const res = makeRes();

    sendResponse(res as Response, {
      success: false,
      statusCode: 404,
      message: "Not found",
      data: null,
    });

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect((res.json as jest.Mock).mock.calls[0][0]).toMatchObject({
      statusCode: 404,
    });
  });

  it("handles response with meta fields (page, limit, total)", () => {
    const res = makeRes();

    sendResponse(res as Response, {
      success: true,
      statusCode: 200,
      message: "List fetched",
      meta: { page: 2, limit: 20, total: 57 },
      data: [{ id: "1" }, { id: "2" }],
    });

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        meta: { page: 2, limit: 20, total: 57 },
      })
    );
  });

  it("handles response with null data", () => {
    const res = makeRes();

    sendResponse(res as Response, {
      success: true,
      statusCode: 204,
      message: "No content",
      data: null,
    });

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: null,
      })
    );
  });

  it("uses null for message when not provided", () => {
    const res = makeRes();

    sendResponse(res as Response, {
      success: true,
      statusCode: 200,
      data: { id: "1" },
    });

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: null,
      })
    );
  });
});
