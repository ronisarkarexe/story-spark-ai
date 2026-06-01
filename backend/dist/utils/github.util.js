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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGithubIssue = void 0;
const https_1 = __importDefault(require("https"));
const config_1 = __importDefault(require("../config"));
const createGithubIssue = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const token = config_1.default.github.token;
    const repo = config_1.default.github.repo;
    if (!token) {
        console.warn("[GitHub Integration] GITHUB_TOKEN is not set. Skipping GitHub issue creation.");
        return;
    }
    const issueTitle = `[Bug Report] ${payload.title}`;
    const issueBody = `### Description
${payload.description}

### Category
${payload.category}

### Severity
${payload.severity}

### Steps to Reproduce
${payload.steps}

### Expected Behavior
${payload.expected}

### Actual Behavior
${payload.actual}

### Contact Email
${payload.email || "Not provided"}

---
*This issue was automatically generated from the StorySparkAI Bug Report Form.*`;
    const requestBody = JSON.stringify({
        title: issueTitle,
        body: issueBody,
        labels: ["bug", payload.severity.toLowerCase(), payload.category.toLowerCase()],
    });
    const options = {
        hostname: "api.github.com",
        path: `/repos/${repo}/issues`,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "User-Agent": "story-spark-ai-backend",
            "Authorization": `token ${token}`,
            "Content-Length": Buffer.byteLength(requestBody),
        },
    };
    return new Promise((resolve, reject) => {
        const req = https_1.default.request(options, (res) => {
            let data = "";
            res.on("data", (chunk) => {
                data += chunk;
            });
            res.on("end", () => {
                if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        const parsed = JSON.parse(data);
                        console.log(`[GitHub Integration] Successfully created issue: ${parsed.html_url}`);
                    }
                    catch (_a) {
                        console.log("[GitHub Integration] Successfully created issue, failed to parse response.");
                    }
                    resolve();
                }
                else {
                    console.error(`[GitHub Integration] Failed to create issue. Status: ${res.statusCode}. Response: ${data}`);
                    resolve(); // Resolve anyway to not block the main database submission
                }
            });
        });
        req.on("error", (error) => {
            console.error("[GitHub Integration] Error calling GitHub API:", error);
            resolve(); // Resolve anyway to not block database submission
        });
        req.write(requestBody);
        req.end();
    });
});
exports.createGithubIssue = createGithubIssue;
