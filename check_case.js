const fs = require('fs');
const path = require('path');

const getAllFiles = (dir, extn, files, result, regex) => {
  files = files || fs.readdirSync(dir);
  result = result || [];
  regex = regex || new RegExp(`\\${extn}$`);

  for (let i = 0; i < files.length; i++) {
    let file = path.join(dir, files[i]);
    if (fs.statSync(file).isDirectory()) {
      try {
        result = getAllFiles(file, extn, fs.readdirSync(file), result, regex);
      } catch (error) {
        continue;
      }
    } else {
      if (regex.test(file)) {
        result.push(file);
      }
    }
  }
  return result;
};

const jsxFiles = getAllFiles(path.join(__dirname, 'app'), '.jsx');
const jsFiles = getAllFiles(path.join(__dirname, 'app'), '.js');
const allFiles = [...jsxFiles, ...jsFiles].map(f => f.replace(__dirname + path.sep, '').replace(/\\/g, '/'));

const addedFiles = [
  'app/visualizer/trees/algorithms/diameter/page.jsx',
  'app/visualizer/trees/algorithms/diameter/animation.jsx',
  'app/visualizer/trees/algorithms/diameter/content.jsx',
  'app/visualizer/trees/algorithms/diameter/codeBlock.jsx',
  'app/visualizer/trees/algorithms/diameter/quiz.jsx',
  'app/visualizer/trees/algorithms/isomorphism/page.jsx',
  'app/visualizer/trees/algorithms/isomorphism/animation.jsx',
  'app/visualizer/trees/algorithms/isomorphism/content.jsx',
  'app/visualizer/trees/algorithms/isomorphism/codeBlock.jsx',
  'app/visualizer/trees/algorithms/isomorphism/quiz.jsx',
  'app/visualizer/trees/algorithms/lca/page.jsx',
  'app/visualizer/trees/algorithms/lca/animation.jsx',
  'app/visualizer/trees/algorithms/lca/content.jsx',
  'app/visualizer/trees/algorithms/lca/codeBlock.jsx',
  'app/visualizer/trees/algorithms/lca/quiz.jsx',
  'app/visualizer/trees/algorithms/serialization/page.jsx',
  'app/visualizer/trees/algorithms/serialization/animation.jsx',
  'app/visualizer/trees/algorithms/serialization/content.jsx',
  'app/visualizer/trees/algorithms/serialization/codeBlock.jsx',
  'app/visualizer/trees/algorithms/serialization/quiz.jsx',
  'app/components/ui/SharedCodeBlock.jsx'
];

let hasError = false;

addedFiles.forEach(file => {
  const content = fs.readFileSync(path.join(__dirname, file), 'utf-8');
  const importRegex = /import\s+[\s\S]*?from\s+['"]([^'"]+)['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    if (importPath.startsWith('.') || importPath.startsWith('@/')) {
      let absoluteImportPath;
      if (importPath.startsWith('@/')) {
        absoluteImportPath = importPath.replace('@/', '');
      } else {
        absoluteImportPath = path.posix.join(path.posix.dirname(file), importPath);
      }
      
      const possibleExtensions = ['.js', '.jsx', '.ts', '.tsx', '/index.js', '/index.jsx'];
      let foundExact = false;

      for (let ext of possibleExtensions) {
        const testPath = absoluteImportPath + ext;
        if (allFiles.includes(testPath)) {
          foundExact = true;
          break;
        }
      }
      
      if (!foundExact) {
        for (let f of allFiles) {
          if (f.toLowerCase() === absoluteImportPath.toLowerCase() + '.js' ||
              f.toLowerCase() === absoluteImportPath.toLowerCase() + '.jsx') {
            console.error(`CASE MISMATCH in ${file}: imported '${importPath}', actual file is '${f}'`);
            hasError = true;
            break;
          }
        }
      }
    }
  }
});
if(!hasError) console.log("No mismatches found.");
