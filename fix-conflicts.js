const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend', 'src');

function fixConflicts(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            fixConflicts(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('<<<<<<< HEAD')) {
                console.log('Fixing conflict in: ' + fullPath);
                // Keep HEAD
                content = content.replace(/<<<<<<< HEAD\n([\s\S]*?)=======\n[\s\S]*?>>>>>>>[^\n]*\n/g, '$1');
                fs.writeFileSync(fullPath, content);
            }
        }
    }
}

fixConflicts(srcDir);
console.log('Conflicts fixed.');
