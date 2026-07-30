const { execSync } = require('child_process');

const startIssue = 5243;
const endIssue = 5252;
const commentBody = "I'd like to work on this — contributing under GSSoC'26\\n/assign";

for (let i = startIssue; i <= endIssue; i++) {
  console.log(`Commenting on issue #${i}...`);
  try {
    execSync(`gh issue comment ${i} -b "${commentBody}"`, {
      stdio: ['pipe', 'inherit', 'inherit']
    });
  } catch (e) {
    console.error(`Failed to comment on issue #${i}`);
  }
}
