import { z } from "zod";
import { ReportReason, ReportTargetType } from "../../../enums/report.enum";

const createReport = z.object({
  body: z.object({
    targetId: z
      .string()
      .regex(/^[a-f\d]{24}$/i, "targetId must be a valid MongoDB ObjectId"),
    targetType: z.nativeEnum(ReportTargetType),
    reason: z.nativeEnum(ReportReason),
    description: z
      .string()
      .max(1000, "Description must not exceed 1000 characters")
      .optional(),
  }),
});

export const ReportValidation = { createReport };