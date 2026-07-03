import { Request, Response } from "express";
import { routeParam } from "../../../shared/route_param";
import catchAsync from "../../../shared/catch_async";
import { getToken } from "../../middleware/token";
import sendResponse from "../../../shared/send_response";
import httpStatus from "http-status";
import { PostService } from "./post.service";
import pick from "../../../shared/pick";
import { postFilterFields } from "./post.constant";
import { paginationFields } from "../../../constants/pagination";
import { IPost } from "./post.interface";

const createPost = catchAsync(async (req: Request, res: Response) => {
  const postData = req.body;
  const token = await getToken(req);
  const result = await PostService.createPost(postData, token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Post created successfully!",
    data: result,
  });
});

const getPosts = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, postFilterFields);
  const pagination = pick(req.query, paginationFields);
  const result = await PostService.getPosts(filters, pagination);
  sendResponse<IPost[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Posts fetched successfully!",
    data: result.data,
    meta: result.meta,
  });
});

const getPublishedPostsByAuthor = catchAsync(
  async (req: Request, res: Response) => {
    const token = await getToken(req);
    const filters = pick(req.query, ["searchTerm"]);
    const pagination = pick(req.query, paginationFields);
    const result = await PostService.getPublishedPostsByAuthor(
      token,
      filters,
      pagination
    );

    sendResponse<IPost[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Published stories fetched successfully!",
      data: result.data,
      meta: result.meta,
    });
  }
);

const getLatestPosts = catchAsync(async (req: Request, res: Response) => {
  const result = await PostService.getLatestPosts();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Posts fetched successfully!",
    data: result,
  });
});

const getFeaturedPosts = catchAsync(async (req: Request, res: Response) => {
  const result = await PostService.getFeaturedPosts();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Posts fetched successfully!",
    data: result,
  });
});

const doFeaturedPosts = catchAsync(async (req: Request, res: Response) => {
  const postId = routeParam(req.params.postId);
  const result = await PostService.doFeaturedPosts(postId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Added to featured posts!",
    data: result,
  });
});

const getSinglePost = catchAsync(async (req: Request, res: Response) => {
  const id = routeParam(req.params.id);
  
  let token = null;
  try {
    token = await getToken(req);
  } catch (error) {
    // Guest or unauthenticated request
  }

  const result = await PostService.getSinglePost(id, token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Post fetched successfully!",
    data: result,
  });
});

const getPostsByTag = catchAsync(async (req: Request, res: Response) => {
  const tag = routeParam(req.params.tag);
  const excludeId = req.query.excludeId as string | undefined;
  const limit = req.query.limit ? Math.min(Number(req.query.limit), 50) : 10;
  const result = await PostService.getPostsByTag(tag, excludeId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Post fetched successfully!",
    data: result,
  });
});

const toggleBookmark = catchAsync(async (req: Request, res: Response) => {
  const id = routeParam(req.params.id);
  const token = await getToken(req);
  const result = await PostService.toggleBookmark(id, token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: result,
  });
});

const updatePost = catchAsync(async (req: Request, res: Response) => {
  const id = routeParam(req.params.id);
  const postData = req.body;
  const token = await getToken(req);
  const result = await PostService.updatePost(id, postData, token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Post updated successfully!",
    data: result,
  });
});

const deletePost = catchAsync(async (req: Request, res: Response) => {
  const id = routeParam(req.params.id);
  const token = await getToken(req);
  const result = await PostService.deletePost(id, token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Story removed successfully!",
    data: result,
  });
});

/* ============================================================
   PATCHED CONTROLLERS — GSSoC '26 QUOTA INTERCEPTION
   ============================================================ */

const remixStory = catchAsync(async (req: Request, res: Response) => {
  const { postId, prompt } = req.body;
  const token = await getToken(req);
  const result = await PostService.remixStory(postId, prompt, token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Story remixed successfully!",
    data: result,
  });
});

const translateStory = catchAsync(async (req: Request, res: Response) => {
  const { postId, language } = req.body;
  const token = await getToken(req);
  const result = await PostService.translateStory(postId, language, token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Story translated successfully!",
    data: result,
  });
});

const forkStory = catchAsync(async (req: Request, res: Response) => {
  const id = routeParam(req.params.id);
  const token = await getToken(req);
  const result = await PostService.forkStory(id, token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Story forked successfully!",
    data: result,
  });
});

const getGenres = catchAsync(async (_req: Request, res: Response) => {
  const result = await PostService.getGenres();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Genres fetched successfully!",
    data: result,
  });
});

const bulkDelete = catchAsync(async (req: Request, res: Response) => {
  const { ids } = req.body;
  const token = await getToken(req);
  const result = await PostService.bulkDeletePosts(ids, token);
  res.status(httpStatus.OK).json({
    deleted: result.deleted,
    failed: result.failed,
  });
});

export const PostController = {
  createPost,
  getPosts,
  getPublishedPostsByAuthor,
  getLatestPosts,
  getFeaturedPosts,
  doFeaturedPosts,
  getSinglePost,
  getPostsByTag,
  toggleBookmark,
  updatePost,
  deletePost,
  remixStory,
  translateStory,
  forkStory,
  getGenres,
  bulkDelete,
};
