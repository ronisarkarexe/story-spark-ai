import { Types } from "mongoose";

export type WriterApplicationStatus = "pending" | "approved" | "rejected";

export interface IWriterApplication {
  user: Types.ObjectId;
  portfolioLink: string;
  reason: string;
  status: WriterApplicationStatus;
  reviewedBy?: Types.ObjectId;
  reviewedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
