import { ENUM_USER_ROLE } from "../../../enums/user";
import ApiError from "../../../errors/api_error";
import { ITokenPayload } from "../../../interfaces/token";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status";

const allowedSocialFields = ["facebook", "twitter", "linkedin", "instagram"] as const;

const getAllUsers = async (): Promise<IUser[]> => {
  const result = await User.find({});
  return result;
};

const getUser = async (payload: string): Promise<IUser | null> => {
  const result = await User.findOne({ _id: payload }).select("-password");
  return result;
};

const updateUser = async (token: ITokenPayload, payload: Partial<IUser>) => {
  const updateData: Record<string, unknown> = {};

  if (typeof payload.name === "string") {
    updateData.name = payload.name;
  }

  if (payload.profile) {
    if (typeof payload.profile.avatar === "string") {
      updateData["profile.avatar"] = payload.profile.avatar;
    }

    if (typeof payload.profile.bio === "string") {
      updateData["profile.bio"] = payload.profile.bio;
    }

    if (payload.profile.social) {
      for (const field of allowedSocialFields) {
        const value = payload.profile.social[field];
        if (typeof value === "string") {
          updateData[`profile.social.${field}`] = value;
        }
      }
    }
  }

  if (Object.keys(updateData).length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No valid user fields provided!");
  }

  const result = await User.findOneAndUpdate(
    { email: token.email },
    { $set: updateData },
    {
    new: true,
    runValidators: true,
    }
  );

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
  }

  return result;
};

const deleteUser = async (id: string): Promise<void> => {
  await User.deleteOne({ _id: id });
};

const applyForWriter = async (token: ITokenPayload) => {
  const { email } = token;
  const user = await User.findOne({
    email: email,
  });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");
  }
  if (user.isApplyForWriter) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You have already applied for writer!"
    );
  }
  const result = await User.findOneAndUpdate(
    { email: email },
    { isApplyForWriter: true },
    {
      new: true,
      runValidators: true,
    }
  );
  return result;
};

const approveWriterApplication = async (email: string) => {
  try {
    const isExistUser = await User.findOne({ email: email });
    if (!isExistUser) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
    }
    if (isExistUser.role === ENUM_USER_ROLE.WRITER) {
      throw new ApiError(httpStatus.BAD_REQUEST, "User is already a writer!");
    }
    const result = await User.findOneAndUpdate(
      { email: email },
      { role: ENUM_USER_ROLE.WRITER },
      {
        new: true,
        runValidators: true,
      }
    );
    if (result) {
      // const io = getIO();
      // const notificationMessage = {
      //   type: "success" as "success",
      //   data: {
      //     title: "Approval Notice",
      //     message: "Your writer application has been approved.",
      //   },
      //   email,
      // };
      // io.on("adminMessage", async () => {
      //   await NotificationService.createNotification(notificationMessage);
      //   sendNotification("pushNotification", notificationMessage);
      // });
    }
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new ApiError(httpStatus.BAD_REQUEST, error.message);
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, "An unknown error occurred");
    }
  }
};

const getAllWriterApplicationUsers = async (): Promise<IUser[]> => {
  const result = await User.find({ isApplyForWriter: true });
  return result;
};

const getProfileInfo = async (token: ITokenPayload) => {
  const { email } = token;
  const user = await User.findOne({
    email: email,
  });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");
  }
  return user;
};

const toggleFollow = async (token: ITokenPayload, authorId: string) => {
  const currentUser = await User.findOne({ email: token.email });
  if (!currentUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");
  }

  const author = await User.findById(authorId);
  if (!author) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Author not found!");
  }

  const isFollowing = currentUser.following.includes(author._id);

  if (isFollowing) {
    // Unfollow
    await User.findByIdAndUpdate(currentUser._id, {
      $pull: { following: author._id },
    });
    await User.findByIdAndUpdate(author._id, {
      $pull: { followers: currentUser._id },
    });
    return { isFollowing: false };
  } else {
    // Follow
    await User.findByIdAndUpdate(currentUser._id, {
      $addToSet: { following: author._id },
    });
    await User.findByIdAndUpdate(author._id, {
      $addToSet: { followers: currentUser._id },
    });
    return { isFollowing: true };
  }
};

const getFollowStatus = async (token: ITokenPayload, authorId: string) => {
  const currentUser = await User.findOne({ email: token.email });
  if (!currentUser) {
    return { isFollowing: false };
  }
  const isFollowing = currentUser.following.some(
    (id) => id.toString() === authorId
  );
  return { isFollowing };
};

export const UserService = {
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
