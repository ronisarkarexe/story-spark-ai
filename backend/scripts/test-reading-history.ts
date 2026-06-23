import mongoose from "mongoose";
import { Post } from "../src/app/modules/post/post.model";
import { User } from "../src/app/modules/user/user.model";
import { PostService } from "../src/app/modules/post/post.service";
import { ITokenPayload } from "../src/interfaces/token";
import dotenv from "dotenv";
import path from "path";

// Load backend environment variables
dotenv.config({ path: path.join(__dirname, "../.env") });

const MONGO_URI = process.env.DATABASE_URL;

async function runVerification() {
  console.log("=== StorySparkAI Verification: User Reading History & Post Views ===");

  if (!MONGO_URI) {
    console.error("Error: DATABASE_URL not set.");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB successfully.");

    // 1. Create a temporary user
    const testUser = await User.create({
      email: `test_reader_${Date.now()}@example.com`,
      name: "Test Reader User",
      role: "user",
      subscriptionType: "free",
      password: "TestPassword123!",
    });
    console.log(`Created temporary user: ${testUser.email} (ID: ${testUser._id})`);

    // 2. Create a temporary post
    const testPost = await Post.create({
      title: "The Silent Forest",
      content: "Once upon a time in a silent forest...",
      tag: "Fantasy",
      imageURL: "https://example.com/forest.jpg",
      author: testUser._id,
      isPublished: true,
      viewsCount: 0,
    });
    console.log(`Created temporary post: "${testPost.title}" (ID: ${testPost._id})`);

    // 3. Mock the JWT token payload
    const token: ITokenPayload = {
      _id: String(testUser._id),
      email: testUser.email,
      role: testUser.role,
      subscriptionType: testUser.subscriptionType as any,
      name: testUser.name || "Test User",
      postsCount: 0,
    };

    // 4. Trigger viewing the post as a logged-in user
    console.log("\nTriggering getSinglePost with user authorization...");
    const retrievedPost = await PostService.getSinglePost(String(testPost._id), token);

    // 5. Fetch updated records to verify database changes
    const updatedPost = await Post.findById(testPost._id);
    const updatedUser = await User.findById(testUser._id);

    console.log("\n=== VERIFICATION RESULTS ===");
    console.log(`Initial Views: 0 | Post Views in DB: ${updatedPost?.viewsCount}`);
    console.log(`User Reading History Count in DB: ${updatedUser?.readingHistory?.length}`);
    console.log(`User Reading History Contains Post: ${updatedUser?.readingHistory?.includes(testPost._id as any)}`);

    let success = true;
    if (updatedPost?.viewsCount !== 1) {
      console.error("❌ FAILURE: viewsCount did not increment correctly.");
      success = false;
    }
    if (!updatedUser?.readingHistory?.includes(testPost._id as any)) {
      console.error("❌ FAILURE: Post ID was not pushed into user's readingHistory.");
      success = false;
    }

    if (success) {
      console.log("\n🎉 SUCCESS! Both post viewsCount and user readingHistory were successfully updated in Mongoose.");
    }

    // 6. Cleanup
    await Post.deleteOne({ _id: testPost._id });
    await User.deleteOne({ _id: testUser._id });
    console.log("\nCleanup complete.");

  } catch (error) {
    console.error("Verification execution failed with error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

runVerification();
