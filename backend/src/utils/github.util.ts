import https from "https";
import config from "../config";

interface IGithubIssuePayload {
  title: string;
  category: string;
  severity: string;
  description: string;
  steps: string;
  expected: string;
  actual: string;
  email?: string;
}

export const createGithubIssue = async (payload: IGithubIssuePayload): Promise<void> => {
  const token = config.github.token;
  const repo = config.github.repo;

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

  return new Promise<void>((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const parsed = JSON.parse(data);
            console.log(`[GitHub Integration] Successfully created issue: ${parsed.html_url}`);
          } catch {
            console.log("[GitHub Integration] Successfully created issue, failed to parse response.");
          }
          resolve();
        } else {
          console.error(
            `[GitHub Integration] Failed to create issue. Status: ${res.statusCode}. Response: ${data}`
          );
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
};
