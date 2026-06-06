import { z } from "zod";
import { ReportReason, ReportTargetType } from "../../../enums/report.enum";

const createReport = z.object({
  body: z.object({
    targetId: z.string(),
    targetType: z.nativeEnum(ReportTargetType),
    reason: z.nativeEnum(ReportReason),
    description: z.string().optional(),
  }),
});

export const ReportValidation = { createReport };