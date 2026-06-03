import { Model, Types } from "mongoose";

export type QuotaAction = "story_generate" | "story_continue";

export interface IUsageRecord {
  userId: Types.ObjectId;
  action: QuotaAction;
  billingPeriodStart: Date;
  count: number;
}

export type UsageRecordModel = Model<IUsageRecord>;
