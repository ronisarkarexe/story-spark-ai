import fs from 'fs';
import path from 'path';

function checkBraces(filePath: string) {
    const content = fs.readFileSync(filePath, 'utf-8');
    let open = 0;
    let close = 0;
    for (let char of content) {
        if (char === '{') open++;
        if (char === '}') close++;
    }
    if (open !== close) {
        console.log(`${filePath}: {${open}} }${close} Difference: ${open - close}`);
    }
}

function walk(dir: string) {
    const files = fs.readdirSync(dir);
    for (let file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== 'dist') {
                walk(fullPath);
            }
        } else if (file.endsWith('.ts')) {
            checkBraces(fullPath);
        }
    }
}

walk('./src');
