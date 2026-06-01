"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportValidation = void 0;
const zod_1 = require("zod");
const report_enum_1 = require("../../../enums/report.enum");
const createReport = zod_1.z.object({
    body: zod_1.z.object({
        targetId: zod_1.z.string(),
        targetType: zod_1.z.nativeEnum(report_enum_1.ReportTargetType),
        reason: zod_1.z.nativeEnum(report_enum_1.ReportReason),
        description: zod_1.z.string().optional(),
    }),
});
exports.ReportValidation = { createReport };
