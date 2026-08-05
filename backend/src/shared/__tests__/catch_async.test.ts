/**
 * catch_async.test.ts
 * Unit tests for the catch_async utility in backend/src/shared/catch_async.ts
 */
import { Request, Response, NextFunction } from "express";
import catchAsync from "../catch_async";

describe("catch_async utility", () => {
  it("passes successful response through without calling next with an error", async () => {
    const mockHandler = jest.fn().mockImplementation((_req: Request, res: Response) => {
      res.json({ ok: true });
    });
    const wrapped = catchAsync(mockHandler as any);
    const req = {} as Request;
    const res = { json: jest.fn() } as unknown as Response;
    const next = jest.fn();

    await wrapped(req, res, next);

    expect(mockHandler).toHaveBeenCalledWith(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });

  it("passes thrown Error to next(err)", async () => {
    const testError = new Error("Something went wrong");
    const mockHandler = jest.fn().mockImplementation(() => {
      throw testError;
    });
    const wrapped = catchAsync(mockHandler as any);
    const req = {} as Request;
    const res = {} as Response;
    const next = jest.fn();

    await wrapped(req, res, next);

    expect(next).toHaveBeenCalledWith(testError);
  });

  it("passes rejected Promise error to next(err)", async () => {
    const testError = new Error("Async error");
    const mockHandler = jest.fn().mockImplementation(() => {
      return Promise.reject(testError);
    });
    const wrapped = catchAsync(mockHandler as any);
    const req = {} as Request;
    const res = {} as Response;
    const next = jest.fn();

    await wrapped(req, res, next);

    expect(next).toHaveBeenCalledWith(testError);
  });

  it("does not call next when handler resolves successfully", async () => {
    const mockHandler = jest.fn().mockResolvedValue(undefined);
    const wrapped = catchAsync(mockHandler as any);
    const req = {} as Request;
    const res = {} as Response;
    const next = jest.fn();

    await wrapped(req, res, next);

    expect(next).not.toHaveBeenCalled();
  });
});
