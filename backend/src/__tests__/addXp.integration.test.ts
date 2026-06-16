/// <reference types="jest" />
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { User } from "../app/modules/user/user.model";
import { GamificationService } from "../app/modules/gamification/gamification.service";
import { ENUM_USER_ROLE } from "../enums/user";
import { USER_STATUS } from "../enums/user_status";

describe("addXp integration test (data loss verification)", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("should verify if addXp causes data loss of adjacent gamification fields", async () => {
    // 1. Create a user with complete gamification data
    const lastActiveDate = new Date("2026-06-09T00:00:00.000Z");
    const user = await User.create({
      email: "test1@example.com",
      role: ENUM_USER_ROLE.USER,
      status: USER_STATUS.ACTIVE,
      gamification: {
        xp: 100,
        level: 2,
        streak: 5,
        badges: ["starter"],
        lastActiveDate: lastActiveDate,
      },
    });

    // 2. Call the service to add XP
    await GamificationService.addXp(String(user._id), 50, "test");

    // 3. Retrieve the updated user from DB
    const updatedUser = await User.findById(user._id);

    console.log("TEST 1 - SIBLINGS INTACT:", JSON.stringify(updatedUser?.gamification, null, 2));

    // 4. Run assertions
    expect(updatedUser).toBeDefined();
    expect(updatedUser?.gamification?.xp).toBe(150);
    expect(updatedUser?.gamification?.level).toBe(2);
    expect(updatedUser?.gamification?.streak).toBe(5);
    expect(updatedUser?.gamification?.badges).toEqual(["starter"]);
    expect(updatedUser?.gamification?.lastActiveDate?.toISOString()).toBe(lastActiveDate.toISOString());
  });

  it("Test Case 1: should initialize gamification when it is missing", async () => {
    const user = await User.create({
      email: "test2@example.com",
      role: ENUM_USER_ROLE.USER,
      status: USER_STATUS.ACTIVE,
      // gamification object is completely missing (defaults should apply or be created)
    });

    await GamificationService.addXp(String(user._id), 50, "test");

    const updatedUser = await User.findById(user._id);
    console.log("TEST 2 - MISSING GAMIFICATION INITIALIZED:", JSON.stringify(updatedUser?.gamification, null, 2));

    expect(updatedUser?.gamification?.xp).toBe(50);
    expect(updatedUser?.gamification?.level).toBe(1); // floor(sqrt(50/100)) + 1 = 1
  });

  it("Test Case 2: should handle missing xp but existing siblings", async () => {
    const user = await User.create({
      email: "test3@example.com",
      role: ENUM_USER_ROLE.USER,
      status: USER_STATUS.ACTIVE,
      gamification: {
        streak: 5,
        badges: ["starter"],
      } as any,
    });

    await GamificationService.addXp(String(user._id), 50, "test");

    const updatedUser = await User.findById(user._id);
    console.log("TEST 3 - MISSING XP, SIBLINGS INTACT:", JSON.stringify(updatedUser?.gamification, null, 2));

    expect(updatedUser?.gamification?.xp).toBe(50);
    expect(updatedUser?.gamification?.streak).toBe(5);
    expect(updatedUser?.gamification?.badges).toEqual(["starter"]);
  });

  it("Test Case 3: should handle level-up scenarios correctly", async () => {
    const user = await User.create({
      email: "test4@example.com",
      role: ENUM_USER_ROLE.USER,
      status: USER_STATUS.ACTIVE,
      gamification: {
        xp: 390,
        level: 2,
      } as any,
    });

    await GamificationService.addXp(String(user._id), 20, "test");

    const updatedUser = await User.findById(user._id);
    console.log("TEST 4 - LEVEL UP SCENARIO:", JSON.stringify(updatedUser?.gamification, null, 2));

    expect(updatedUser?.gamification?.xp).toBe(410);
    expect(updatedUser?.gamification?.level).toBe(3); // floor(sqrt(410/100)) + 1 = floor(2.02) + 1 = 3
  });
});
