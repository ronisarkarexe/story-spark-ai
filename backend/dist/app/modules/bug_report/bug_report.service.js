"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BugReportService = void 0;
const bug_report_model_1 = require("./bug_report.model");
const github_util_1 = require("../../../utils/github.util");
const submitBugReport = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Save to database
    const result = yield bug_report_model_1.BugReport.create(payload);
    // Trigger GitHub issue creation
    // We trigger it asynchronously and handle errors so it doesn't delay the API response
    (0, github_util_1.createGithubIssue)(payload).catch((err) => {
        console.error("[GitHub Integration] Background error creating issue:", err);
    });
    return result;
});
exports.BugReportService = {
    submitBugReport,
};
