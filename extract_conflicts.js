const fs = require('fs');
const execSync = require('child_process').execSync;

const files = execSync('git diff --name-only --diff-filter=U').toString().trim().split('\n');

for (const file of files) {
  if (!file) continue;
  try {
    const content = fs.readFileSync(file, 'utf8');
    const matches = content.match(/<<<<<<< HEAD[\s\S]*?>>>>>>> upstream\/main/g);
    if (matches) {
      console.log(`\n\n--- ${file} ---`);
      matches.forEach(m => console.log(m));
    }
  } catch (e) {
    console.error(`Error reading ${file}:`, e.message);
  }
}
