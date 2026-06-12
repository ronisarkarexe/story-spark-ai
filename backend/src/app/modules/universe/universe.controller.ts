import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catch_async";
import sendResponse from "../../../shared/send_response";
import { UniverseService } from "./universe.service";
import ApiError from "../../../errors/api_error";
import { routeParam } from "../../../shared/route_param";
import pick from "../../../shared/pick";

const createUniverse = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User is not authorized");
  }

  const result = await UniverseService.createUniverse(user._id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Universe created successfully!",
    data: result,
  });
});

const getAllUniverses = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User is not authorized");
  }

  const result = await UniverseService.getAllUniverses(user._id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Universes retrieved successfully!",
    data: result,
  });
});

const getUniverseById = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User is not authorized");
  }

  const universeId = routeParam(req.params.id);
  const result = await UniverseService.getUniverseById(universeId, user._id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Universe details retrieved successfully!",
    data: result,
  });
});

const updateUniverse = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User is not authorized");
  }

  const universeId = routeParam(req.params.id);
  const result = await UniverseService.updateUniverse(universeId, user._id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Universe updated successfully!",
    data: result,
  });
});

const deleteUniverse = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User is not authorized");
  }

  const universeId = routeParam(req.params.id);
  await UniverseService.deleteUniverse(universeId, user._id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Universe deleted successfully!",
  });
});

// Memory methods
const createMemory = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User is not authorized");
  }

  const universeId = routeParam(req.params.id);
  const result = await UniverseService.createMemory(universeId, user._id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Memory entry created successfully!",
    data: result,
  });
});

const getMemories = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User is not authorized");
  }

  const universeId = routeParam(req.params.id);
  const query = pick(req.query, ["type", "searchTerm"]) as { type?: string; searchTerm?: string };
  const result = await UniverseService.getMemories(universeId, user._id, query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Memories retrieved successfully!",
    data: result,
  });
});

const updateMemory = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User is not authorized");
  }

  const universeId = routeParam(req.params.id);
  const memoryId = routeParam(req.params.memoryId);
  const result = await UniverseService.updateMemory(universeId, memoryId, user._id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Memory entry updated successfully!",
    data: result,
  });
});

const deleteMemory = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User is not authorized");
  }

  const universeId = routeParam(req.params.id);
  const memoryId = routeParam(req.params.memoryId);
  await UniverseService.deleteMemory(universeId, memoryId, user._id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Memory entry deleted successfully!",
  });
});

const retrieveLore = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User is not authorized");
  }

  const universeId = routeParam(req.params.id);
  const { queryText } = req.body as { queryText?: string };
  if (!queryText) {
    throw new ApiError(httpStatus.BAD_REQUEST, "queryText is required in body.");
  }

  const result = await UniverseService.retrieveLore(universeId, queryText);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Lore retrieved successfully!",
    data: result,
  });
});

export const UniverseController = {
  createUniverse,
  getAllUniverses,
  getUniverseById,
  updateUniverse,
  deleteUniverse,
  createMemory,
  getMemories,
  updateMemory,
  deleteMemory,
  retrieveLore,
};
