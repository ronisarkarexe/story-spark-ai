import { SUBSCRIPTION_TYPE } from "../../../enums/subscription_type";
import { ENUM_USER_ROLE } from "../../../enums/user";
import { USER_STATUS } from "../../../enums/user_status";
import { Post } from "../post/post.model";
import { User } from "../user/user.model";
import ApiError from "../../../errors/api_error";
import httpStatus from "http-status";
import { WriterApplication } from "../writer_application/writer_application.model";

main

    return {
      role,
      writerStats: {
        totalReaders,
        totalPosts,
        subscriptionStatus: user.subscriptionType.toUpperCase(),
        applicationStatus,
        gamification: user.gamification || { xp: 0, level: 1, streak: 0, badges: [] },
      },
      posts: {
        perMonth: postsPerMonth,
        topics: topicCount,
      }
    };
  }

  // Else standard user
  return {
main
  };
};

export const AnalysisService = {
  getDashboardAnalysis,
};

