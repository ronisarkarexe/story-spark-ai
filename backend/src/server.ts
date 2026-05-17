import { Application, Request, Response } from "express";
import mongoose from "mongoose";
import config from "./config";
import app from "./app";
import dns from "dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(config.database_url as string);
}

async function main() {
  try {
    if (!config.database_url) {
      throw new Error(
        "DATABASE_URL is not set. Copy backend/.env.example to backend/.env and configure MongoDB."
      );
    }
    if (config.env !== "production") {
      console.log("Connecting to MongoDB...");
    }
    await connectDB();
    app.listen(config.port, () => {
      console.log(`Story-Spark-AI app listening on port ${config.port}`);
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

/**
 * Vercel (@vercel/node) invokes the default export; Express alone must not call listen().
 */
export default async function handler(req: Request, res: Response) {
  try {
    await connectDB();
  } catch (error) {
    console.error("Error connecting to the database:", error);
    res.status(500).json({
      success: false,
      message: "Database unavailable",
    });
    return;
  }
  (app as Application)(req, res);
}

if (process.env.VERCEL !== "1") {
  void main();
}
