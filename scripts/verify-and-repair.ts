import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

function getTestFilePath(sourceFile: string): string {
  const dir = path.dirname(sourceFile);
  const ext = path.extname(sourceFile);
  const base = path.basename(sourceFile, ext);
  return path.join(dir, "__tests__", `${base}.test${ext}`);
}

interface RunResult {
  success: boolean;
  step: string;
  errorLog: string;
}

function runCommand(command: string, cwd: string): RunResult {
  try {
    execSync(command, { cwd, stdio: "pipe", encoding: "utf-8" });
    return { success: true, step: "", errorLog: "" };
  } catch (err: any) {
    const errorLog = (err.stdout || "") + "\n" + (err.stderr || "") + "\n" + (err.message || "");
    return { success: false, step: command, errorLog };
  }
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("Usage: npx tsx scripts/verify-and-repair.ts <target-file-path>");
    process.exit(1);
  }

  const targetFile = args[0];
  if (!fs.existsSync(targetFile)) {
    console.error(`Error: target file not found: ${targetFile}`);
    process.exit(1);
  }

  const isFrontend = targetFile.startsWith("frontend/");
  const testFilePath = getTestFilePath(targetFile);

  const cwd = isFrontend ? path.resolve(process.cwd(), "frontend") : path.resolve(process.cwd(), "backend");
  const relativeTestPath = path.relative(cwd, testFilePath);

  // Define verification steps
  const steps: { name: string; command: string }[] = [];
  if (isFrontend) {
    steps.push({ name: "Typecheck", command: "npm run typecheck" });
    steps.push({ name: "Build", command: "npm run build" });
    steps.push({ name: "Test", command: `npx vitest run ${relativeTestPath}` });
  } else {
    steps.push({ name: "Build/Typecheck", command: "npm run build" });
    steps.push({ name: "Test", command: `npx jest --runInBand ${relativeTestPath}` });
  }

  const maxAttempts = 3;
  const tempErrorLogFile = path.resolve(process.cwd(), "scripts/temp-error.log");

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    console.log(`\n=== Verification Attempt ${attempt}/${maxAttempts} for ${targetFile} ===`);
    let attemptFailed = false;

    for (const step of steps) {
      console.log(`Running step "${step.name}": ${step.command} (in ${cwd})...`);
      const result = runCommand(step.command, cwd);

      if (!result.success) {
        console.error(`Step "${step.name}" FAILED.`);
        attemptFailed = true;

        if (attempt === maxAttempts) {
          console.error(`Max repair attempts reached. Verification failed.`);
          console.error(`Error details:\n${result.errorLog}`);
          process.exit(1);
        }

        // Repair loop trigger
        console.log(`Triggering AI test repair for ${targetFile}...`);
        fs.writeFileSync(tempErrorLogFile, result.errorLog, "utf-8");
        try {
          execSync(`npx tsx scripts/generate-tests.ts ${targetFile} --fix ${tempErrorLogFile}`, { stdio: "inherit" });
        } catch (repairErr: any) {
          console.error(`Failed to run generate-tests.ts --fix: ${repairErr.message}`);
          process.exit(1);
        }
        break; // Break the steps loop to restart verification from next attempt
      } else {
        console.log(`Step "${step.name}" passed.`);
      }
    }

    if (!attemptFailed) {
      console.log(`\nVerification SUCCEEDED for ${targetFile} after ${attempt} attempts!`);
      // Cleanup temp log if exists
      if (fs.existsSync(tempErrorLogFile)) {
        fs.unlinkSync(tempErrorLogFile);
      }
      process.exit(0);
    }
  }
}

main();
