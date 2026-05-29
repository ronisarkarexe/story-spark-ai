import { IBugReport } from "./bug_report.interface";
import { BugReport } from "./bug_report.model";
import { createGithubIssue } from "../../../utils/github.util";

const submitBugReport = async (payload: IBugReport): Promise<IBugReport> => {
  // Save to database
  const result = await BugReport.create(payload);

  // Trigger GitHub issue creation
  // We trigger it asynchronously and handle errors so it doesn't delay the API response
  createGithubIssue(payload).catch((err) => {
    console.error("[GitHub Integration] Background error creating issue:", err);
  });

  return result;
};

export const BugReportService = {
  submitBugReport,
};
