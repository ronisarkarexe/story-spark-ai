import { Request, Response } from "express";
import catchAsync from "../../../shared/catch_async";
import { routeParam } from "../../../shared/route_param";
import { getToken } from "../../middleware/token";
import { ITokenPayload } from "../../../interfaces/token";
import sendResponse from "../../../shared/send_response";
import httpStatus from "http-status";
import { CollectionService } from "./collection.service";

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

// --- Helper Utility (Can be moved to your token middleware file) ---
const getOptionalToken = (req: Request): ITokenPayload | null => {
  try {
    return getToken(req);
  } catch {
    return null; // Unauthenticated visitor
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

const addStoryToCollection = catchAsync(async (req: Request, res: Response) => {
  const id = routeParam(req.params.id);
  const { storyId } = req.body as AddStoryBody;
  const token = await getToken(req);
  
  const result = await CollectionService.addStoryToCollection(id, storyId, token);
  
  sendResponse(res, {
    statusCode: httpStatus.CREATED, // Updated to 201 Created
    success: true,
    message: "Story added to collection!",
    data: result,
  });
});

const removeStoryFromCollection = catchAsync(async (req: Request, res: Response) => {
  const id = routeParam(req.params.id);
  const storyId = routeParam(req.params.storyId);
  const token = await getToken(req);
  
  const result = await CollectionService.removeStoryFromCollection(id, storyId, token);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Story removed from collection!",
    data: result,
  });
});

const deleteCollection = catchAsync(async (req: Request, res: Response) => {
  const id = routeParam(req.params.id);
  const token = await getToken(req);
  
  const result = await CollectionService.deleteCollection(id, token);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

export const CollectionController = {
  createCollection,
  updateCollection,
  getCollectionById,
  getUserCollections,
  addStoryToCollection,
  removeStoryFromCollection,
  deleteCollection,
};
    
