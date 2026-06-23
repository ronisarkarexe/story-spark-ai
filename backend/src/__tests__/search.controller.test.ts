import { Request, Response } from "express";
import { SearchController } from "../app/modules/search/search.controller";
import { SearchService } from "../app/modules/search/search.service";

jest.mock("../app/modules/search/search.service");

const mockSendResponse = jest.fn();
jest.mock("../shared/send_response", () => ({
  __esModule: true,
  default: (...args: unknown[]) => mockSendResponse(...args),
}));

const makeReq = (query: Record<string, string> = {}): Partial<Request> => ({
  query,
});

const makeRes = (): Partial<Response> => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
});

describe("SearchController.search", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns 400 when q is missing", async () => {
    const req = makeReq({}) as Request;
    const res = makeRes() as Response;
    const next = jest.fn();

    await SearchController.search(req, res, next);

    expect(mockSendResponse).toHaveBeenCalledWith(
      res,
      expect.objectContaining({ statusCode: 400, success: false })
    );
    expect(SearchService.search).not.toHaveBeenCalled();
  });

  it("returns 400 when q is blank whitespace", async () => {
    const req = makeReq({ q: "   " }) as Request;
    const res = makeRes() as Response;
    const next = jest.fn();

    await SearchController.search(req, res, next);

    expect(mockSendResponse).toHaveBeenCalledWith(
      res,
      expect.objectContaining({ statusCode: 400, success: false })
    );
  });

  it("calls SearchService and returns 200 on valid query", async () => {
    const fakeResults = { stories: null, users: null, tags: null };
    (SearchService.search as jest.Mock).mockResolvedValue(fakeResults);

    const req = makeReq({ q: "dragon", type: "story", page: "2", limit: "5" }) as Request;
    const res = makeRes() as Response;
    const next = jest.fn();

    await SearchController.search(req, res, next);

    expect(SearchService.search).toHaveBeenCalledWith(
      expect.objectContaining({ q: "dragon", type: "story", page: 2, limit: 5 })
    );
    expect(mockSendResponse).toHaveBeenCalledWith(
      res,
      expect.objectContaining({ statusCode: 200, success: true, data: fakeResults })
    );
  });

  it("caps limit at 50", async () => {
    (SearchService.search as jest.Mock).mockResolvedValue({});

    const req = makeReq({ q: "test", limit: "999" }) as Request;
    const res = makeRes() as Response;
    const next = jest.fn();

    await SearchController.search(req, res, next);

    expect(SearchService.search).toHaveBeenCalledWith(
      expect.objectContaining({ limit: 50 })
    );
  });
});