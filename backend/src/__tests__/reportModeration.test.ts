/// <reference types="jest" />
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { User } from "../app/modules/user/user.model";
import { Post } from "../app/modules/post/post.model";
import { Comment } from "../app/modules/comment/comment.model";
import { Report } from "../app/modules/report/report.model";
import { ReportService } from "../app/modules/report/report.service";
import { ENUM_USER_ROLE } from "../enums/user";
import { USER_STATUS } from "../enums/user_status";
import { ReportReason, ReportStatus, ReportTargetType } from "../enums/report.enum";

describe("Content Moderation & Report Workflows Integration Tests", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    await Report.deleteMany({});
  });

  it("should auto-moderate a post when it receives 5 pending reports", async () => {
    // 1. Create a user (author) and a post
    const author = await User.create({
      name: "Author",
      email: "author@example.com",
      role: ENUM_USER_ROLE.USER,
      status: USER_STATUS.ACTIVE,
    });

    const post = await Post.create({
      title: "Test Post",
      content: "Clean content",
      tag: "Fantasy",
      imageURL: "http://example.com/image.png",
      topic: [{ title: "Topic", color: "blue", selected: true }],
      author: author._id,
    });

    // 2. Submit 4 reports (less than 5 threshold)
    for (let i = 1; i <= 4; i++) {
      const reporter = await User.create({
        name: `Reporter ${i}`,
        email: `reporter${i}@example.com`,
        role: ENUM_USER_ROLE.USER,
        status: USER_STATUS.ACTIVE,
      });

      await ReportService.createReport({
        reportedBy: reporter._id,
        targetId: post._id,
        targetType: ReportTargetType.POST,
        reason: ReportReason.SPAM,
        status: ReportStatus.PENDING,
      } as any);
    }

    // Verify post is NOT moderated yet
    let freshPost = await Post.findById(post._id);
    expect(freshPost?.isModerated).toBe(false);

    // 3. Submit the 5th report (exceeds threshold of 5)
    const reporter5 = await User.create({
      name: "Reporter 5",
      email: "reporter5@example.com",
      role: ENUM_USER_ROLE.USER,
      status: USER_STATUS.ACTIVE,
    });

    await ReportService.createReport({
      reportedBy: reporter5._id,
      targetId: post._id,
      targetType: ReportTargetType.POST,
      reason: ReportReason.SPAM,
      status: ReportStatus.PENDING,
    } as any);

    // Verify post IS now automatically moderated/hidden
    freshPost = await Post.findById(post._id);
    expect(freshPost?.isModerated).toBe(true);
  });

  it("should dynamically populate target content when listing reports", async () => {
    const author = await User.create({
      name: "Author",
      email: "author@example.com",
      role: ENUM_USER_ROLE.USER,
      status: USER_STATUS.ACTIVE,
    });

    const post = await Post.create({
      title: "Post to Report",
      content: "Clean content",
      tag: "Fantasy",
      imageURL: "http://example.com/image.png",
      topic: [{ title: "Topic", color: "blue", selected: true }],
      author: author._id,
    });

    const comment = await Comment.create({
      postId: post._id,
      userId: author._id,
      comment: "Comment to Report",
    });

    const reporter = await User.create({
      name: "Reporter",
      email: "reporter@example.com",
      role: ENUM_USER_ROLE.USER,
      status: USER_STATUS.ACTIVE,
    });

    // Create a post report
    await ReportService.createReport({
      reportedBy: reporter._id,
      targetId: post._id,
      targetType: ReportTargetType.POST,
      reason: ReportReason.SPAM,
      status: ReportStatus.PENDING,
    } as any);

    // Create a comment report
    await ReportService.createReport({
      reportedBy: reporter._id,
      targetId: comment._id,
      targetType: ReportTargetType.COMMENT,
      reason: ReportReason.HATE_SPEECH,
      status: ReportStatus.PENDING,
    } as any);

    const allReports = await ReportService.getAllReports();
    expect(allReports.length).toBe(2);

    const postReport = allReports.find((r) => r.targetType === ReportTargetType.POST);
    const commentReport = allReports.find((r) => r.targetType === ReportTargetType.COMMENT);

    expect(postReport?.target).toBeDefined();
    expect(postReport?.target?.title).toBe("Post to Report");

    expect(commentReport?.target).toBeDefined();
    expect(commentReport?.target?.comment).toBe("Comment to Report");
  });

  it("should resolve report status and perform HIDE, DELETE, and BAN actions correctly", async () => {
    const author = await User.create({
      name: "Author",
      email: "author@example.com",
      role: ENUM_USER_ROLE.USER,
      status: USER_STATUS.ACTIVE,
    });

    const post = await Post.create({
      title: "Post to Moderate",
      content: "Clean content",
      tag: "Fantasy",
      imageURL: "http://example.com/image.png",
      topic: [{ title: "Topic", color: "blue", selected: true }],
      author: author._id,
    });

    const reporter = await User.create({
      name: "Reporter",
      email: "reporter@example.com",
      role: ENUM_USER_ROLE.USER,
      status: USER_STATUS.ACTIVE,
    });

    const report = await ReportService.createReport({
      reportedBy: reporter._id,
      targetId: post._id,
      targetType: ReportTargetType.POST,
      reason: ReportReason.SPAM,
      status: ReportStatus.PENDING,
    } as any);

    // Resolve report with HIDE action
    await ReportService.resolveReport(String(report._id), ReportStatus.REVIEWED, "HIDE");

    let updatedPost = await Post.findById(post._id);
    let updatedReport = await Report.findById(report._id);

    expect(updatedPost?.isModerated).toBe(true);
    expect(updatedReport?.status).toBe(ReportStatus.REVIEWED);

    // Dismiss report, should set isModerated back to false
    await ReportService.resolveReport(String(report._id), ReportStatus.DISMISSED, "DISMISS");
    updatedPost = await Post.findById(post._id);
    expect(updatedPost?.isModerated).toBe(false);

    // Resolve report with DELETE action
    await ReportService.resolveReport(String(report._id), ReportStatus.REVIEWED, "DELETE");
    updatedPost = await Post.findById(post._id);
    expect(updatedPost?.isDeleted).toBe(true);
    expect(updatedPost?.deletedAt).toBeInstanceOf(Date);

    // Resolve with BAN action
    await ReportService.resolveReport(String(report._id), ReportStatus.REVIEWED, "BAN");
    const updatedAuthor = await User.findById(author._id);
    expect(updatedAuthor?.status).toBe(USER_STATUS.BLOCKED);
  });

  it("should ban repeat violators with 3 or more moderated violations", async () => {
    // Create repeat violator author
    const author = await User.create({
      name: "Violator",
      email: "violator@example.com",
      role: ENUM_USER_ROLE.USER,
      status: USER_STATUS.ACTIVE,
    });

    // Create 3 posts by the author
    const post1 = await Post.create({
      title: "Post 1",
      content: "content",
      tag: "tag",
      imageURL: "http://example.com/image.png",
      topic: [{ title: "Topic", color: "blue", selected: true }],
      author: author._id,
    });

    const post2 = await Post.create({
      title: "Post 2",
      content: "content",
      tag: "tag",
      imageURL: "http://example.com/image.png",
      topic: [{ title: "Topic", color: "blue", selected: true }],
      author: author._id,
    });

    const post3 = await Post.create({
      title: "Post 3",
      content: "content",
      tag: "tag",
      imageURL: "http://example.com/image.png",
      topic: [{ title: "Topic", color: "blue", selected: true }],
      author: author._id,
    });

    const reporter = await User.create({
      name: "Reporter",
      email: "reporter@example.com",
      role: ENUM_USER_ROLE.USER,
      status: USER_STATUS.ACTIVE,
    });

    const r1 = await ReportService.createReport({
      reportedBy: reporter._id,
      targetId: post1._id,
      targetType: ReportTargetType.POST,
      reason: ReportReason.SPAM,
    } as any);

    const r2 = await ReportService.createReport({
      reportedBy: reporter._id,
      targetId: post2._id,
      targetType: ReportTargetType.POST,
      reason: ReportReason.SPAM,
    } as any);

    const r3 = await ReportService.createReport({
      reportedBy: reporter._id,
      targetId: post3._id,
      targetType: ReportTargetType.POST,
      reason: ReportReason.SPAM,
    } as any);

    // Resolve 1st report -> HIDE (violator should still be active)
    await ReportService.resolveReport(String(r1._id), ReportStatus.REVIEWED, "HIDE");
    let freshAuthor = await User.findById(author._id);
    expect(freshAuthor?.status).toBe(USER_STATUS.ACTIVE);

    // Resolve 2nd report -> HIDE (violator should still be active)
    await ReportService.resolveReport(String(r2._id), ReportStatus.REVIEWED, "HIDE");
    freshAuthor = await User.findById(author._id);
    expect(freshAuthor?.status).toBe(USER_STATUS.ACTIVE);

    // Resolve 3rd report -> HIDE (exceeds/reaches 3 violations, should ban repeat violator)
    await ReportService.resolveReport(String(r3._id), ReportStatus.REVIEWED, "HIDE");
    freshAuthor = await User.findById(author._id);
    expect(freshAuthor?.status).toBe(USER_STATUS.BLOCKED);
  });
});
