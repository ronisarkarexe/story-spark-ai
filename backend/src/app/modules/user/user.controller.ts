import { Request, Response } from "express";
import httpStatus from "http-status";
import { UserService } from "./user.service";
import { routeParam } from "../../../shared/route_param";
import sendResponse from "../../../shared/send_response";
import { getToken } from "../../middleware/token";
import catchAsync from "../../../shared/catch_async";
import ApiError from "../../../errors/api_error";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await UserService.getAllUsers();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "OK!",
      data: result,
    });
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).json({
      message: "Fail to get users!",
    });
  }
};

const getUser = async (req: Request, res: Response) => {
  try {
    const id = routeParam(req.params.id);

    const result = await UserService.getUser(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "OK!",
      data: result,
    });
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).json({
      message: "Fail to get users!",
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const token = await getToken(req);

    const result = await UserService.updateUser(token, req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User update successfully!",
      data: result,
    });
  } catch (error) {
    res.status(httpStatus.BAD_REQUEST).json({
      message: "Fail to get users!",
    });
  }
};

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const id = routeParam(req.params.id);

  await UserService.deleteUser(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User deleted successfully!",
  });
});

const applyForWriter = catchAsync(async (req: Request, res: Response) => {
  const token = await getToken(req);

  const result = await UserService.applyForWriter(token);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Applied for writer successfully!",
    data: result,
  });
});

const approveWriterApplication = catchAsync(
  async (req: Request, res: Response) => {
    // Defense-in-depth: verify caller is admin/super_admin at the controller level
    const token = await getToken(req);
    if (token.role !== "admin" && token.role !== "super_admin") {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        "Only administrators can approve writer applications!"
      );
    }

    const { email } = req.body;

    const result = await UserService.approveWriterApplication(email);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Approve writer application successfully!",
      data: result,
    });
  }
);

const getAllWriterApplicationUsers = catchAsync(
  async (req: Request, res: Response) => {
    const result = await UserService.getAllWriterApplicationUsers();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Approve writer application successfully!",
      data: result,
    });
  }
);

const getProfileInfo = catchAsync(async (req: Request, res: Response) => {
  const token = await getToken(req);

  const result = await UserService.getProfileInfo(token);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Get profile info successfully!",
    data: result,
  });
});

const toggleFollow = catchAsync(async (req: Request, res: Response) => {
  const token = await getToken(req);
  const authorId = routeParam(req.params.authorId);
  const result = await UserService.toggleFollow(token, authorId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.isFollowing
      ? "Followed successfully!"
      : "Unfollowed successfully!",
    data: result,
  });
});

const getFollowStatus = catchAsync(async (req: Request, res: Response) => {
  const token = await getToken(req);
  const authorId = routeParam(req.params.authorId);
  const result = await UserService.getFollowStatus(token, authorId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Follow status fetched successfully!",
    data: result,
  });
});

export const UserController = {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getProfileInfo,
  applyForWriter,
  approveWriterApplication,
  getAllWriterApplicationUsers,
  toggleFollow,
  getFollowStatus,
};
