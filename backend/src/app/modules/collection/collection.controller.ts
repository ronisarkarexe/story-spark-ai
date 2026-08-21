import { Request, Response } from "express";
import catchAsync from "../../../shared/catch_async";
import { routeParam } from "../../../shared/route_param";
import { getToken } from "../../middleware/token";
import sendResponse from "../../../shared/send_response";
import httpStatus from "http-status";
import { CollectionService } from "./collection.service";
import { ITokenPayload } from "../../../interfaces/token";

import logger from "../../../utils/logger.util";
// --- Interfaces for Request Bodies (Type Safety) ---
interface CreateCollectionBody {
  name: string;
  description?: string;
  isPublic?: boolean;
  // Add any other specific fields your service expects
}

interface UpdateCollectionBody {
  name?: string;
  description?: string;
  isPublic?: boolean;
}

interface AddStoryBody {
  storyId: string;
}


const getOptionalToken = async (req: Request): Promise<ITokenPayload  | null> => {
  try {
    return getToken(req);
  } catch (error) {
    logger.error('[CollectionController] Failed:', error);
    return null;
  }
};

// --- Controller Methods ---

const createCollection = catchAsync(async (req: Request, res: Response) => {
  const token = await getToken(req);
  const body = req.body as CreateCollectionBody;
  
  const result = await CollectionService.createCollection(body, token);
  
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Collection created successfully!",
    data: result,
  });
});

const updateCollection = catchAsync(async (req: Request, res: Response) => {
  const id = routeParam(req.params.id);
  const token = await getToken(req);
  const body = req.body as UpdateCollectionBody;
  
  const result = await CollectionService.updateCollection(id, body, token);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Collection updated successfully!",
    data: result,
  });
});

const getCollectionById = catchAsync(async (req: Request, res: Response) => {
  const id = routeParam(req.params.id);
  const token = await getOptionalToken(req); // Cleaned up DRY logic
  
  const result = await CollectionService.getCollectionById(id, token);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Collection fetched successfully!",
    data: result,
  });
});

const getUserCollections = catchAsync(async (req: Request, res: Response) => {
  const userId = routeParam(req.params.userId);
  const token = await getOptionalToken(req); // Cleaned up DRY logic
  
  const result = await CollectionService.getUserCollections(userId, token);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Collections fetched successfully!",
    data: result,
  });
});

export const CollectionController = {
  createCollection,
  updateCollection,
  getCollectionById,
  getUserCollections,
};
    
