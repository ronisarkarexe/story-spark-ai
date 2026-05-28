import httpStatus from "http-status";
import ApiError from "../../../errors/api_error";
import { User } from "../user/user.model";
import { WriterApplication } from "./writer_application.model";
import { IWriterApplication } from "./writer_application.interface";
import { ENUM_USER_ROLE } from "../../../enums/user";

const submitApplication = async (
  userId: string,
  payload: Partial<IWriterApplication>
) => {
  const existingApp = await WriterApplication.findOne({ user: userId, status: "pending" });
  if (existingApp) {
    throw new ApiError(httpStatus.BAD_REQUEST, "You already have a pending application.");
  }
  
  const result = await WriterApplication.create({
    ...payload,
    user: userId,
  });
  
  await User.findByIdAndUpdate(userId, { isApplyForWriter: true });
  
  return result;
};

const getAllApplications = async () => {
  return await WriterApplication.find().populate("user").sort({ createdAt: -1 });
};

const updateApplicationStatus = async (
  id: string,
  status: "approved" | "rejected",
  adminId: string
) => {
  const application = await WriterApplication.findById(id);
  if (!application) {
    throw new ApiError(httpStatus.NOT_FOUND, "Application not found");
  }
  
  if (application.status !== "pending") {
    throw new ApiError(httpStatus.BAD_REQUEST, "Application is already processed");
  }
  
  application.status = status;
  application.reviewedBy = adminId as any;
  application.reviewedAt = new Date();
  await application.save();
  
  if (status === "approved") {
    await User.findByIdAndUpdate(application.user, {
      role: ENUM_USER_ROLE.WRITER,
    });
  } else {
    // If rejected, we might want to let them apply again by setting isApplyForWriter to false
    await User.findByIdAndUpdate(application.user, { isApplyForWriter: false });
  }
  
  return application;
};

export const WriterApplicationService = {
  submitApplication,
  getAllApplications,
  updateApplicationStatus,
};
