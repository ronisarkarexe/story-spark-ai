import * as fs from "fs";
import * as path from "path";

const SRC_DIRS = ["frontend/src", "backend/src"];

function walkDir(dir: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      // Skip standard non-source directories
      if (
        file !== "node_modules" &&
        file !== "__tests__" &&
        file !== "__mocks__" &&
        file !== "dist" &&
        file !== "build" &&
        file !== ".git" &&
        file !== ".github"
      ) {
        results = results.concat(walkDir(filePath));
      }
    } else {
      const ext = path.extname(file);
      if ((ext === ".ts" || ext === ".tsx") && !file.endsWith(".d.ts")) {
        // Skip files that are test files themselves
        if (
          !file.endsWith(".test.ts") &&
          !file.endsWith(".test.tsx") &&
          !file.endsWith(".spec.ts") &&
          !file.endsWith(".spec.tsx")
        ) {
          results.push(filePath);
        }
      }
    }
  }
  return results;
}

function hasTestCompanion(sourceFile: string): boolean {
  const dir = path.dirname(sourceFile);
  const ext = path.extname(sourceFile);
  const base = path.basename(sourceFile, ext);

  // List of possible test file locations/names
  const possibleTests = [
    path.join(dir, `${base}.test${ext}`),
    path.join(dir, `${base}.spec${ext}`),
    path.join(dir, "__tests__", `${base}.test${ext}`),
    path.join(dir, "__tests__", `${base}.spec${ext}`),
    // Also check cross extensions (e.g. source is .tsx, test is .ts)
    path.join(dir, `${base}.test.ts`),
    path.join(dir, `${base}.spec.ts`),
    path.join(dir, "__tests__", `${base}.test.ts`),
    path.join(dir, "__tests__", `${base}.spec.ts`),
  ];

  for (const testPath of possibleTests) {
    if (fs.existsSync(testPath)) {
      return true;
    }
  }
  return false;
}

function scan() {
  let allSourceFiles: string[] = [];
  for (const srcDir of SRC_DIRS) {
    const absoluteSrcDir = path.resolve(process.cwd(), srcDir);
    allSourceFiles = allSourceFiles.concat(walkDir(absoluteSrcDir));
  }

  const untestedFiles = allSourceFiles.filter((file) => !hasTestCompanion(file));

  // Sort untested files by size (descending)
  const sortedUntested = untestedFiles
    .map((file) => {
      const relativePath = path.relative(process.cwd(), file);
      const stat = fs.statSync(file);
      return {
        path: relativePath,
        size: stat.size,
      };
    })
    .sort((a, b) => b.size - a.size);

  // Take top 2
  const topUntested = sortedUntested.slice(0, 2).map((f) => f.path);

  console.log(JSON.stringify(topUntested, null, 2));
}

scan();
