import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

// Call AI helper function (using native fetch, supporting Gemini, Nvidia, OpenAI)
async function callAI(prompt: string, systemInstruction?: string): Promise<string> {
  const geminiKey = process.env.GEMINI_API_KEY;
  const nvidiaKey = process.env.NVIDIA_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (geminiKey) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`;
    const fullPrompt = systemInstruction ? `${systemInstruction}\n\n${prompt}` : prompt;
    const body = { contents: [{ parts: [{ text: fullPrompt }] }] };
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Gemini API error: ${res.status} ${res.statusText}\n${errorText}`);
    }
    const data = (await res.json()) as any;
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Gemini API returned an empty response.");
    return text;
  } else if (nvidiaKey) {
    const url = "https://integrate.api.nvidia.com/v1/chat/completions";
    let authHeader = nvidiaKey.trim();
    if (authHeader.toLowerCase().startsWith("bearer ")) {
      authHeader = authHeader.substring(7).trim();
    }
    const body = {
      model: "meta/llama-3.1-405b-instruct",
      messages: [
        ...(systemInstruction ? [{ role: "system", content: systemInstruction }] : []),
        { role: "user", content: prompt },
      ],
      temperature: 0.1,
      max_tokens: 4096,
    };
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authHeader}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`NVIDIA API error: ${res.status} ${res.statusText}\n${errorText}`);
    }
    const data = (await res.json()) as any;
    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error("NVIDIA API returned an empty response.");
    return text;
  } else if (openaiKey) {
    const url = "https://api.openai.com/v1/chat/completions";
    let authHeader = openaiKey.trim();
    if (authHeader.toLowerCase().startsWith("bearer ")) {
      authHeader = authHeader.substring(7).trim();
    }
    const body = {
      model: "gpt-4o-mini",
      messages: [
        ...(systemInstruction ? [{ role: "system", content: systemInstruction }] : []),
        { role: "user", content: prompt },
      ],
      temperature: 0.1,
    };
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authHeader}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`OpenAI API error: ${res.status} ${res.statusText}\n${errorText}`);
    }
    const data = (await res.json()) as any;
    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error("OpenAI API returned an empty response.");
    return text;
  } else {
    throw new Error("No API key found in the environment. Set GEMINI_API_KEY, NVIDIA_API_KEY, or OPENAI_API_KEY.");
  }
}

function cleanCode(response: string): string {
  let cleaned = response.trim();
  if (cleaned.startsWith("```")) {
    const lines = cleaned.split("\n");
    if (lines[0].startsWith("```")) {
      lines.shift();
    }
    if (lines[lines.length - 1] === "```") {
      lines.pop();
    }
    cleaned = lines.join("\n");
  }
  return cleaned.trim();
}

function runCmd(command: string): string {
  try {
    return execSync(command, { encoding: "utf-8" }).trim();
  } catch (err: any) {
    console.error(`Command failed: ${command}`);
    console.error(err.stdout || err.stderr || err.message);
    throw err;
  }
}

interface PR {
  number: number;
  title: string;
  headRefName: string;
}

async function main() {
  console.log("Starting PR poller...");

  // 1. Get repository metadata and current user
  let owner = "";
  let repo = "";
  let currentUser = "";

  try {
    const repoInfo = JSON.parse(runCmd("gh repo view --json owner,name"));
    owner = repoInfo.owner.login;
    repo = repoInfo.name;

    const userInfo = JSON.parse(runCmd("gh api user --json login"));
    currentUser = userInfo.login;
  } catch (err) {
    console.error("Failed to query GitHub metadata. Make sure gh CLI is authenticated and installed.");
    process.exit(1);
  }

  console.log(`Repository: ${owner}/${repo}`);
  console.log(`Current User: ${currentUser}`);

  // 2. List all open PRs created by the user
  let openPRs: PR[] = [];
  try {
    openPRs = JSON.parse(
      runCmd(`gh pr list --author "@me" --state open --json number,title,headRefName`)
    );
  } catch (err) {
    console.error("Failed to fetch open PRs.");
    process.exit(1);
  }

  if (openPRs.length === 0) {
    console.log("No open PRs found for the current user.");
    process.exit(0);
  }

  const initialBranch = runCmd("git branch --show-current");

  for (const pr of openPRs) {
    console.log(`\nChecking PR #${pr.number}: "${pr.title}" (branch: ${pr.headRefName})...`);

    // A. Fetch review comments (line-level)
    let reviewComments: any[] = [];
    try {
      reviewComments = JSON.parse(
        runCmd(`gh api repos/${owner}/${repo}/pulls/${pr.number}/comments`)
      );
    } catch (err) {
      console.error(`Failed to fetch review comments for PR #${pr.number}`);
      continue;
    }

    // B. Group review comments into threads (by in_reply_to_id)
    const threads: { [rootId: number]: any[] } = {};
    for (const comment of reviewComments) {
      const rootId = comment.in_reply_to_id || comment.id;
      if (!threads[rootId]) {
        threads[rootId] = [];
      }
      threads[rootId].push(comment);
    }

    let prHasUpdates = false;

    // Check review threads
    for (const rootId in threads) {
      const threadComments = threads[rootId].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      const lastComment = threadComments[threadComments.length - 1];

      // If the last comment is not by the current user, it needs a response/fix
      if (lastComment.user.login !== currentUser) {
        console.log(`Unresolved review comment thread on file "${lastComment.path}" line ${lastComment.line || "unknown"}:`);
        console.log(`> Reviewer (${lastComment.user.login}): "${lastComment.body}"`);

        // Check out the PR branch if not already on it
        const currentBranch = runCmd("git branch --show-current");
        if (currentBranch !== pr.headRefName) {
          console.log(`Checking out branch ${pr.headRefName}...`);
          runCmd(`git checkout ${pr.headRefName}`);
        }

        const filePath = lastComment.path;
        if (!fs.existsSync(filePath)) {
          console.error(`File does not exist locally: ${filePath}`);
          continue;
        }

        const fileContent = fs.readFileSync(filePath, "utf-8");

        const aiSystemInstruction = `You are a Principal Software Engineer. A reviewer left a comment on a pull request.
We want to address their feedback and update the file accordingly.
We will provide:
1. The file path.
2. The file's current content.
3. The reviewer's comment.
4. The line number the comment was left on.

If the comment does NOT require any code changes (e.g. it is just saying "looks good" or asking a general question without requesting changes), reply with exactly: NO_CHANGE
Otherwise, if code changes are required, output the complete updated file content with the reviewer's feedback addressed.
Output ONLY the raw updated code. Do not include markdown code block backticks (e.g. \`\`\`typescript) or explanations.`;

        const aiPrompt = `--- FILE PATH:
${filePath}

--- CURRENT CONTENT:
${fileContent}

--- REVIEWER COMMENT (Line ${lastComment.line || "unknown"}):
"${lastComment.body}"

Address the comment and output the complete updated file contents. If no change is needed, respond with "NO_CHANGE".`;

        console.log("Asking AI to address comment...");
        try {
          const aiResponse = await callAI(aiPrompt, aiSystemInstruction);
          const cleanedResponse = cleanCode(aiResponse);

          if (cleanedResponse === "NO_CHANGE") {
            console.log("AI determined no code changes are required.");
          } else {
            console.log(`Applying AI generated fixes to ${filePath}...`);
            fs.writeFileSync(filePath, cleanedResponse, "utf-8");

            // Verify with verify-and-repair script
            console.log(`Verifying fix for ${filePath}...`);
            try {
              execSync(`npx tsx scripts/verify-and-repair.ts ${filePath}`, { stdio: "inherit" });
              console.log("Verification succeeded!");

              // Commit and push
              runCmd(`git add ${filePath}`);
              runCmd(`git commit -m "chore: address reviewer feedback on ${path.basename(filePath)}"`);
              runCmd(`git push origin HEAD`);
              prHasUpdates = true;

              // Reply "Fixed" to thread
              console.log("Posting 'Fixed' reply comment to GitHub...");
              runCmd(
                `gh api repos/${owner}/${repo}/pulls/${pr.number}/comments -F body="Fixed" -F in_reply_to_id=${lastComment.id}`
              );
            } catch (verifErr: any) {
              console.error("Verification or commit failed. Reverting local changes...");
              runCmd(`git checkout -- ${filePath}`);
            }
          }
        } catch (aiErr: any) {
          console.error(`AI address flow failed: ${aiErr.message}`);
        }
      }
    }

    // C. Fetch issue-level comments
    let issueComments: any[] = [];
    try {
      issueComments = JSON.parse(
        runCmd(`gh api repos/${owner}/${repo}/issues/${pr.number}/comments`)
      );
    } catch (err) {
      console.error(`Failed to fetch issue comments for PR #${pr.number}`);
      continue;
    }

    if (issueComments.length > 0) {
      const sortedIssueComments = issueComments.sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      const lastIssueComment = sortedIssueComments[sortedIssueComments.length - 1];

      // If the last comment is not by the current user, let's see if we need to address it
      if (lastIssueComment.user.login !== currentUser) {
        console.log(`Unresolved issue-level comment:`);
        console.log(`> Reviewer (${lastIssueComment.user.login}): "${lastIssueComment.body}"`);

        // Check what files are in this PR
        const prFiles: string[] = runCmd(
          `gh api repos/${owner}/${repo}/pulls/${pr.number}/files --jq ".[].filename"`
        )
          .split("\n")
          .map((f) => f.trim())
          .filter((f) => f.length > 0);

        if (prFiles.length > 0) {
          const currentBranch = runCmd("git branch --show-current");
          if (currentBranch !== pr.headRefName) {
            console.log(`Checking out branch ${pr.headRefName}...`);
            runCmd(`git checkout ${pr.headRefName}`);
          }

          const filesPrompt = prFiles.map((file) => `- ${file}`).join("\n");

          const aiSystemInstruction = `You are a Principal Software Engineer. A reviewer left a general comment on a pull request.
We want to see if we should make changes to one of the modified files in the PR.
The files modified in this PR are:
${filesPrompt}

If the comment does NOT request a code change to any of these files (e.g. it is just asking a question or giving general feedback), respond with "NO_CHANGE".
Otherwise, if a change is requested, identify the file to modify and output the result in JSON format:
{
  "file": "path/to/file",
  "reason": "explanation of what changes are requested"
}
Output ONLY the raw JSON block (or NO_CHANGE). Do not include markdown code block backticks or explanation.`;

          const aiPrompt = `--- REVIEWER GENERAL COMMENT:
"${lastIssueComment.body}"

Which file should be modified, if any? Provide the response as JSON or "NO_CHANGE".`;

          console.log("Asking AI if general comment requires file updates...");
          try {
            const aiResponse = await callAI(aiPrompt, aiSystemInstruction);
            const cleanedResponse = cleanCode(aiResponse);

            if (cleanedResponse === "NO_CHANGE") {
              console.log("AI determined no general comment code changes are required.");
            } else {
              const fixSpec = JSON.parse(cleanedResponse);
              const targetPath = fixSpec.file;

              if (targetPath && fs.existsSync(targetPath)) {
                console.log(`AI identified file to fix: ${targetPath}`);
                const fileContent = fs.readFileSync(targetPath, "utf-8");

                const codeAiSystemInstruction = `You are a Principal Software Engineer. A reviewer left a comment requesting changes.
We want to address their feedback in the given file.
Output ONLY the raw complete updated code. Do not include markdown code block backticks or explanations.`;

                const codeAiPrompt = `--- FILE PATH:
${targetPath}

--- CURRENT CONTENT:
${fileContent}

--- REQUESTED CHANGES:
${fixSpec.reason}

Address the requested changes and output the complete updated file content.`;

                const updatedCodeRaw = await callAI(codeAiPrompt, codeAiSystemInstruction);
                const updatedCode = cleanCode(updatedCodeRaw);

                fs.writeFileSync(targetPath, updatedCode, "utf-8");

                // Verify
                console.log(`Verifying fix for ${targetPath}...`);
                try {
                  execSync(`npx tsx scripts/verify-and-repair.ts ${targetPath}`, { stdio: "inherit" });
                  console.log("Verification succeeded!");

                  // Commit and push
                  runCmd(`git add ${targetPath}`);
                  runCmd(`git commit -m "chore: address general feedback on ${path.basename(targetPath)}"`);
                  runCmd(`git push origin HEAD`);
                  prHasUpdates = true;

                  // Post general PR comment "Fixed"
                  console.log("Posting PR-level 'Fixed' comment...");
                  runCmd(`gh pr comment ${pr.number} --body "Fixed"`);
                } catch (verifErr) {
                  console.error("Verification or commit failed. Reverting local changes...");
                  runCmd(`git checkout -- ${targetPath}`);
                }
              } else {
                console.error(`AI suggested invalid file path: ${targetPath}`);
              }
            }
          } catch (aiErr: any) {
            console.error(`AI general comment flow failed: ${aiErr.message}`);
          }
        }
      }
    }
  }

  // Restore initial branch
  const finalBranch = runCmd("git branch --show-current");
  if (finalBranch !== initialBranch) {
    console.log(`Restoring initial branch ${initialBranch}...`);
    runCmd(`git checkout ${initialBranch}`);
  }

  console.log("PR poller run finished.");
}

main();
