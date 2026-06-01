"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BugReportRouter = void 0;
const express_1 = __importDefault(require("express"));
const validate_request_1 = __importDefault(require("../../middleware/validate.request"));
const bug_report_controller_1 = require("./bug_report.controller");
const bug_report_validation_1 = require("./bug_report.validation");
const router = express_1.default.Router();
router.post("/submit", (0, validate_request_1.default)(bug_report_validation_1.BugReportValidation.createBugReport), bug_report_controller_1.BugReportController.submitBugReport);
exports.BugReportRouter = router;
