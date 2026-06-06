import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.VERIFY_EMAIL,
    pass: process.env.VERIFY_PASSWORD,
  },
});

async function main() {
  try {
    console.log("Attempting to connect with:", process.env.VERIFY_EMAIL, "password set:", Boolean(process.env.VERIFY_PASSWORD));
    await transporter.verify();
    console.log("Success!");
  } catch (error) {
    console.error("Nodemailer verify error:", error);
  }
}
main();
