import fs from 'fs';

function findHiddenChars(filePath: string) {
    const content = fs.readFileSync(filePath, 'utf-8');
    for (let i = 0; i < content.length; i++) {
        const charCode = content.charCodeAt(i);
        if (charCode > 127 && charCode !== 10 && charCode !== 13 && charCode !== 8230) {
            console.log(`${filePath}: Hidden character at index ${i}: ${charCode} ("${content[i]}")`);
        }
    }
}

findHiddenChars('./src/app/modules/post/post.service.ts');
findHiddenChars('./src/app/modules/reaction/reaction.service.ts');
