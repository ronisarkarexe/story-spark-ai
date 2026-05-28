import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { User } from "../src/app/modules/user/user.model";
import config from "../src/config";

const seedAdmin = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables.");
  }

  // Connect to database
  await mongoose.connect(config.database_url as string);

  const existing = await User.findOne({ email });
  if (existing) {
    console.log("Admin user already exists. Skipping.");
    await mongoose.disconnect();
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  await User.create({
    email,
    name: "Administrator",
    password: hashedPassword,
    role: "admin",
    subscriptionType: "premium",
    status: "active",
  });

  console.log(`Admin user created: ${email}`);
  await mongoose.disconnect();
};

seedAdmin().catch((err) => {
  console.error(err);
  mongoose.disconnect();
});
