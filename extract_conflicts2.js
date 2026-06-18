const fs = require('fs');
const { execSync } = require('child_process');

try {
  const files = execSync('git diff --name-only --diff-filter=U', { encoding: 'utf8' }).trim().split('\n');
  let output = '';

  for (let file of files) {
    file = file.trim();
    if (!file) continue;
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      const regex = /<<<<<<< HEAD\r?\n([\s\S]*?)=======\r?\n([\s\S]*?)>>>>>>> upstream\/main/g;
      let match;
      let count = 0;
      while ((match = regex.exec(content)) !== null) {
        count++;
        output += `\n\n## File: ${file} (Conflict ${count})\n`;
        output += `### HEAD (Ours):\n\`\`\`typescript\n`;
        output += match[1];
        output += `\`\`\`\n### upstream/main (Theirs):\n\`\`\`typescript\n`;
        output += match[2];
        output += `\`\`\`\n`;
      }
    } catch (e) {
      output += `\nError reading ${file}: ${e.message}`;
    }
  }

  fs.writeFileSync('d:/github/story-spark-ai/conflicts.md', output, 'utf8');
  console.log("Conflicts extracted to conflicts.md");
} catch (e) {
  console.error(e.message);
}
