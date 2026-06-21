import { IReport } from "./report.interface";
import { Report } from "./report.model";
import { Post } from "../post/post.model";
import { Comment } from "../comment/comment.model";
import { User } from "../user/user.model";
import { USER_STATUS } from "../../../enums/user_status";
import ApiError from "../../../errors/api_error";
import { ReportStatus, ReportTargetType } from "../../../enums/report.enum";
import httpStatus from "http-status";

const createReport = async (payload: IReport) => {
  try {
    const result = await Report.create(payload);

    // Count pending reports for this target
    const pendingCount = await Report.countDocuments({
      targetId: payload.targetId,
      targetType: payload.targetType,
      status: ReportStatus.PENDING,
    });

    if (pendingCount >= 5) {
      if (payload.targetType === ReportTargetType.POST) {
        await Post.findByIdAndUpdate(payload.targetId, { isModerated: true });
      } else if (payload.targetType === ReportTargetType.COMMENT) {
        await Comment.findByIdAndUpdate(payload.targetId, { isHidden: true });
      }
    }

    return result;
  } catch (error: any) {
    if (error.code === 11000) {
      throw new ApiError(
        httpStatus.CONFLICT,
        "You have already reported this content"
      );
    }
    throw error;
  }
};

const getAllReports = async () => {
  const reports = await Report.find().populate("reportedBy", "name email");

  // Extract targetIds for batch population
  const postIds = reports
    .filter((r) => r.targetType === ReportTargetType.POST)
    .map((r) => r.targetId);
  const commentIds = reports
    .filter((r) => r.targetType === ReportTargetType.COMMENT)
    .map((r) => r.targetId);

  const posts = await Post.find({ _id: { $in: postIds } }).populate("author", "name email");
  const comments = await Comment.find({ _id: { $in: commentIds } }).populate("userId", "name email");

  const postsMap = new Map(posts.map((p) => [p._id.toString(), p]));
  const commentsMap = new Map(comments.map((c) => [c._id.toString(), c]));

  const reportsWithTarget = reports.map((report) => {
    const reportObj = report.toObject() as any;
    if (report.targetType === ReportTargetType.POST) {
      reportObj.target = postsMap.get(report.targetId.toString()) || null;
    } else if (report.targetType === ReportTargetType.COMMENT) {
      reportObj.target = commentsMap.get(report.targetId.toString()) || null;
    }
    return reportObj;
  });

  return reportsWithTarget;
};

const getPendingCommentReports = async () => {
  const reports = await Report.find({
    targetType: ReportTargetType.COMMENT,
    status: ReportStatus.PENDING,
  }).populate("reportedBy", "name email");

  const commentIds = reports.map((r) => r.targetId);
  const comments = await Comment.find({ _id: { $in: commentIds } }).populate("userId", "name email");
  const commentsMap = new Map(comments.map((c) => [c._id.toString(), c]));

  const reportsWithTarget = reports.map((report) => {
    const reportObj = report.toObject() as any;
    reportObj.target = commentsMap.get(report.targetId.toString()) || null;
    return reportObj;
  });

  return reportsWithTarget;
};

const reviewReport = async (reportId: string) => {
  const report = await Report.findByIdAndUpdate(
    reportId,
    {
      status: ReportStatus.REVIEWED,
    },
    { new: true }
  );

  if (!report) {
    throw new ApiError(httpStatus.NOT_FOUND, "Report not found");
  }

  return report;
};

const dismissReport = async (reportId: string) => {
  const report = await Report.findByIdAndUpdate(
    reportId,
    {
      status: ReportStatus.DISMISSED,
    },
    { new: true }
  );

  if (!report) {
    throw new ApiError(httpStatus.NOT_FOUND, "Report not found");
  }

  return report;
};

const resolveReport = async (
  reportId: string,
  status: ReportStatus,
  action?: "HIDE" | "DELETE" | "BAN" | "DISMISS"
) => {
  const report = await Report.findById(reportId);
  if (!report) {
    throw new ApiError(httpStatus.NOT_FOUND, "Report not found");
  }

  // Update status of this report
  report.status = status;
  await report.save();

  // Find authorId of target content
  let authorId: string | null = null;
  if (report.targetType === ReportTargetType.POST) {
    const post = await Post.findById(report.targetId);
    if (post) {
      authorId = post.author ? post.author.toString() : null;
    }
  } else if (report.targetType === ReportTargetType.COMMENT) {
    const comment = await Comment.findById(report.targetId);
    if (comment) {
      authorId = comment.userId ? comment.userId.toString() : null;
    }
  }

  // Perform action if specified
  const effectiveAction = action || (status === ReportStatus.DISMISSED ? "DISMISS" : undefined);

  if (effectiveAction === "DISMISS") {
    // If dismissed, unhide/restore content (remove moderation flags)
    if (report.targetType === ReportTargetType.POST) {
      await Post.findByIdAndUpdate(report.targetId, { isModerated: false });
    } else if (report.targetType === ReportTargetType.COMMENT) {
      await Comment.findByIdAndUpdate(report.targetId, { isHidden: false });
    }
  } else if (effectiveAction === "HIDE") {
    if (report.targetType === ReportTargetType.POST) {
      await Post.findByIdAndUpdate(report.targetId, { isModerated: true });
    } else if (report.targetType === ReportTargetType.COMMENT) {
      await Comment.findByIdAndUpdate(report.targetId, { isHidden: true });
    }
  } else if (effectiveAction === "DELETE") {
    if (report.targetType === ReportTargetType.POST) {
      await Post.findByIdAndUpdate(report.targetId, {
        isDeleted: true,
        deletedAt: new Date(),
        isModerated: true,
      });
    } else if (report.targetType === ReportTargetType.COMMENT) {
      await Comment.findByIdAndUpdate(report.targetId, {
        isDeleted: true,
        deletedAt: new Date(),
        isHidden: true,
      });
    }
  } else if (effectiveAction === "BAN") {
    if (authorId) {
      await User.findByIdAndUpdate(authorId, { status: USER_STATUS.BLOCKED });
    }
  }

  // Repeat Violator Check: count total moderated content if action hidden or deleted content
  if (authorId && (effectiveAction === "HIDE" || effectiveAction === "DELETE")) {
    const moderatedPostsCount = await Post.countDocuments({
      author: authorId,
      isModerated: true,
    });
    const moderatedCommentsCount = await Comment.countDocuments({
      userId: authorId,
      isHidden: true,
    });
    const totalViolations = moderatedPostsCount + moderatedCommentsCount;

    if (totalViolations >= 3) {
      await User.findByIdAndUpdate(authorId, { status: USER_STATUS.BLOCKED });
    }
  }

  return report;
};

export const ReportService = {
  createReport,
  getAllReports,
  getPendingCommentReports,
  reviewReport,
  dismissReport,
  resolveReport,
};