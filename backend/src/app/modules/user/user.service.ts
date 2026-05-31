import { ENUM_USER_ROLE } from "../../../enums/user";
import ApiError from "../../../errors/api_error";
import { ITokenPayload } from "../../../interfaces/token";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status";

type SafeUserUpdate = Pick<IUser, "name" | "profile">;

const getAllUsers = async (): Promise<IUser[]> => {
  const result = await User.find({}).select("-password");
  return result;
};

const getUser = async (payload: string): Promise<IUser | null> => {
  const result = await User.findOne({ _id: payload }).select("-password");
  return result;
};

const updateUser = async (token: ITokenPayload, payload: Partial<IUser>) => {
  const updatePayload: Partial<SafeUserUpdate> = {};

  if (payload.name !== undefined) {
    updatePayload.name = payload.name;
  }

  if (payload.profile !== undefined) {
    updatePayload.profile = payload.profile;
  }

  const result = await User.findOneAndUpdate({ email: token.email }, updatePayload, {
    new: true,
    runValidators: true,
  }).select("-password");
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
    if (!isExistUser.isApplyForWriter) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "User has not applied for writer!"
      );
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

export const UserService = {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getProfileInfo,
  applyForWriter,
  approveWriterApplication,
  getAllWriterApplicationUsers,
};
