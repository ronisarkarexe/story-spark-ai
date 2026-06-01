"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportTargetType = exports.ReportStatus = exports.ReportReason = void 0;
var ReportReason;
(function (ReportReason) {
    ReportReason["SPAM"] = "SPAM";
    ReportReason["HATE_SPEECH"] = "HATE_SPEECH";
    ReportReason["INAPPROPRIATE"] = "INAPPROPRIATE";
    ReportReason["MISINFORMATION"] = "MISINFORMATION";
    ReportReason["OTHER"] = "OTHER";
})(ReportReason || (exports.ReportReason = ReportReason = {}));
var ReportStatus;
(function (ReportStatus) {
    ReportStatus["PENDING"] = "PENDING";
    ReportStatus["REVIEWED"] = "REVIEWED";
    ReportStatus["DISMISSED"] = "DISMISSED";
})(ReportStatus || (exports.ReportStatus = ReportStatus = {}));
var ReportTargetType;
(function (ReportTargetType) {
    ReportTargetType["POST"] = "POST";
    ReportTargetType["COMMENT"] = "COMMENT";
})(ReportTargetType || (exports.ReportTargetType = ReportTargetType = {}));
