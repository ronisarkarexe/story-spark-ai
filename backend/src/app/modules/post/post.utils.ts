import httpStatus from "http-status";
import ApiError from "../../../errors/api_error";
import { ENUM_USER_ROLE } from "../../../enums/user";

export const verifyPostAccess = (post: any, user?: any) => {
  if (post.isPublished) return;

  if (!user) {
    throw new ApiError(httpStatus.FORBIDDEN, "Access to this draft is forbidden.");
  }

  const isAuthor = post.author && user._id && post.author.toString() === user._id.toString();
  const isAdmin = user.role === ENUM_USER_ROLE.ADMIN || user.role === ENUM_USER_ROLE.SUPER_ADMIN;

  if (!isAuthor && !isAdmin) {
    throw new ApiError(httpStatus.FORBIDDEN, "Access to this draft is forbidden.");
  }
};
