import { Post } from "../post/post.model";
import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catch_async";
import sendResponse from "../../../shared/send_response";
import { StoryVersionService } from "./story_version.service";
import ApiError from "../../../errors/api_error";
import { routeParam } from "../../../shared/route_param";
import { paginationFields } from "../../../constants/pagination";
import pick from "../../../shared/pick";

const getVersionsByStoryId = catchAsync(async (req: Request, res: Response) => {
  const id = routeParam(req.params.id);
  const user = req.user;
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User is not authorized");
  }

  const pagination = pick(req.query, paginationFields);

const result = await StoryVersionService.getVersionsByStoryId(
  id,
  user._id,
  pagination
);

sendResponse(res, {
  statusCode: httpStatus.OK,
  success: true,
  message: "Story version timeline retrieved successfully!",
  data: result.data,
  meta: result.meta,
});
});

const getVersionById = catchAsync(async (req: Request, res: Response) => {
  const versionId = routeParam(req.params.versionId);
  const user = req.user;
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User is not authorized");
  }

  const result = await StoryVersionService.getVersionById(versionId, user._id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Story version snapshot retrieved successfully!",
    data: result,
  });
});

const restoreVersion = catchAsync(async (req: Request, res: Response) => {
  const versionId = routeParam(req.params.versionId);
  const user = req.user;
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User is not authorized");
  }

  const result = await StoryVersionService.restoreVersion(versionId, user._id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Story restored to selected version successfully!",
    data: result,
  });
});

const createBranchVersion = catchAsync(async (req: Request, res: Response) => {
    const versionId = routeParam(req.params.versionId);
    const { branchName } = req.body as {
      branchName?: string;
    };

    if (!branchName || typeof branchName !== "string" || branchName.trim().length < 2) {
      throw new ApiError( httpStatus.BAD_REQUEST, "branchName is required and must be at least 2 characters.");
    }

    const user = req.user;
    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "User is not authorized");
    }

    const result =
      await StoryVersionService.createBranchVersion(versionId, user._id, branchName.trim());

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Branch created successfully!",
      data: result,
    });
  }
);

const getStoryTree = catchAsync(async (req: Request, res: Response) => {
    const storyId = routeParam(req.params.id);
    const user = req.user;

    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "User is not authorized");
    }

    const result = await StoryVersionService.getStoryTree(storyId,user._id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Story tree retrieved successfully!",
      data: result,
    });
  }
);

const getBranchPath = catchAsync(async (req: Request, res: Response) => {
    const versionId = routeParam(req.params.versionId);
    const user = req.user;

    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "User is not authorized");
    }

    const result = await StoryVersionService.getBranchPath(versionId, user._id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Branch path retrieved successfully!",
      data: result,
    });
  }
);

const enhancePrompt = catchAsync(async (req: Request, res: Response) => {
  const { prompt, storyId } = req.body as {
    prompt?: string;
    storyId?: string;
  };

  if (!prompt || typeof prompt !== "string" || prompt.trim().length < 3) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "prompt is required and must be at least 3 characters."
    );
  }

  const post = storyId ? await Post.findById(storyId) : null;
  const rawProvider = req.headers?.["x-model-provider"];
  const provider = Array.isArray(rawProvider) ? rawProvider[0] : rawProvider;
  
  const enhancedPrompt = await StoryVersionService.enhancePrompt(
    prompt.trim(),
    post?.content || undefined,
    provider as string | undefined
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Prompt enhanced successfully!",
    data: { enhancedPrompt },
  });
});

const getCharacterNetwork = catchAsync(async (req: Request, res: Response) => {
  const id = routeParam(req.params.id);
  const user = req.user;
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User is not authorized");
  }

  const result = await StoryVersionService.getCharacterNetwork(id, user._id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Character relationship network retrieved successfully!",
    data: result,
  });
});

export const StoryVersionController = {
  createBranchVersion,
  getStoryTree,
  getBranchPath,
  getVersionsByStoryId,
  getVersionById,
  restoreVersion,
  enhancePrompt,
  getCharacterNetwork,
};