/**
 * send_response.test.ts
 * Unit tests for the send_response utility in backend/src/shared/send_response.ts
 */
import { Response } from "express";
import sendResponse, { IApiResponse } from "../send_response";

describe("send_response utility", () => {
  it("sends correct JSON structure with all fields", () => {
    const mockJson = jest.fn();
    const mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    const res = { status: mockStatus } as unknown as Response;

    const data: IApiResponse<{ id: number }> = {
      success: true,
      statusCode: 200,
      message: "Success",
      meta: { page: 1, limit: 10, total: 100 },
      data: { id: 42 },
    };

    sendResponse(res, data);

    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith({
      success: true,
      statusCode: 200,
      message: "Success",
      meta: { page: 1, limit: 10, total: 100 },
      data: { id: 42 },
    });
  });

  it("preserves the correct HTTP status code", () => {
    const mockJson = jest.fn();
    const mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    const res = { status: mockStatus } as unknown as Response;

    sendResponse(res, { success: false, statusCode: 404, data: null } as any);

    expect(mockStatus).toHaveBeenCalledWith(404);
  });

  it("handles response with meta fields (page, limit, total)", () => {
    const mockJson = jest.fn();
    const mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    const res = { status: mockStatus } as unknown as Response;

    sendResponse(res, {
      success: true,
      statusCode: 200,
      meta: { page: 2, limit: 20, total: 50 },
      data: [],
    } as any);

    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        meta: { page: 2, limit: 20, total: 50 },
      })
    );
  });

  it("handles response with null data", () => {
    const mockJson = jest.fn();
    const mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    const res = { status: mockStatus } as unknown as Response;

    sendResponse(res, { success: false, statusCode: 404, data: null } as any);

    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({ data: null })
    );
  });

  it("uses null for message when not provided", () => {
    const mockJson = jest.fn();
    const mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    const res = { status: mockStatus } as unknown as Response;

    sendResponse(res, { success: true, statusCode: 200, data: {} } as any);

    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({ message: null })
    );
  });
});
