const fs = require('fs');

function removeDuplicates(file) {
  let content = fs.readFileSync(file, 'utf8');
  let lines = content.split('\n');
  
  // Keep track of seen imports
  let seenImports = new Set();
  let seenLazy = new Set();
  let seenDefaultExport = false;
  
  let newLines = [];
  
  for (let line of lines) {
    let tLine = line.trim();
    
    // Deduplicate regular imports
    if (tLine.startsWith('import ') && tLine.includes(' from ')) {
      if (seenImports.has(tLine)) continue;
      seenImports.add(tLine);
    }
    
    // Deduplicate lazy imports
    if (tLine.startsWith('const ') && tLine.includes('lazy(() =>')) {
      if (seenLazy.has(tLine)) continue;
      seenLazy.add(tLine);
    }
    
    // Deduplicate default export
    if (tLine.startsWith('export default ')) {
      if (seenDefaultExport) continue;
      seenDefaultExport = true;
    }
    
    newLines.push(line);
  }
  
  fs.writeFileSync(file, newLines.join('\n'));
}

removeDuplicates('src/App.tsx');
console.log('Cleaned files');
