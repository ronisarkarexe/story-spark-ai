import * as fs from "fs";
import * as path from "path";

async function callAI(prompt: string, systemInstruction?: string): Promise<string> {
  const geminiKey = process.env.GEMINI_API_KEY;
  const nvidiaKey = process.env.NVIDIA_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (geminiKey) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`;
    const fullPrompt = systemInstruction ? `${systemInstruction}\n\n${prompt}` : prompt;
    const body = {
      contents: [
        {
          parts: [{ text: fullPrompt }],
        },
      ],
    };
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Gemini API error: ${res.status} ${res.statusText}\n${errorText}`);
    }
    const data = (await res.json()) as any;
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Gemini API returned an empty response.");
    return text;
  } else if (nvidiaKey) {
    const url = "https://integrate.api.nvidia.com/v1/chat/completions";
    let authHeader = nvidiaKey.trim();
    if (authHeader.toLowerCase().startsWith("bearer ")) {
      authHeader = authHeader.substring(7).trim();
    }
    const body = {
      model: "meta/llama-3.1-405b-instruct",
      messages: [
        ...(systemInstruction ? [{ role: "system", content: systemInstruction }] : []),
        { role: "user", content: prompt },
      ],
      temperature: 0.1,
      max_tokens: 4096,
    };
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authHeader}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`NVIDIA API error: ${res.status} ${res.statusText}\n${errorText}`);
    }
    const data = (await res.json()) as any;
    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error("NVIDIA API returned an empty response.");
    return text;
  } else if (openaiKey) {
    const url = "https://api.openai.com/v1/chat/completions";
    let authHeader = openaiKey.trim();
    if (authHeader.toLowerCase().startsWith("bearer ")) {
      authHeader = authHeader.substring(7).trim();
    }
    const body = {
      model: "gpt-4o-mini",
      messages: [
        ...(systemInstruction ? [{ role: "system", content: systemInstruction }] : []),
        { role: "user", content: prompt },
      ],
      temperature: 0.1,
    };
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authHeader}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`OpenAI API error: ${res.status} ${res.statusText}\n${errorText}`);
    }
    const data = (await res.json()) as any;
    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error("OpenAI API returned an empty response.");
    return text;
  } else {
    throw new Error("No API key found in the environment. Set GEMINI_API_KEY, NVIDIA_API_KEY, or OPENAI_API_KEY.");
  }
}

function cleanCode(response: string): string {
  let cleaned = response.trim();
  if (cleaned.startsWith("```")) {
    const lines = cleaned.split("\n");
    if (lines[0].startsWith("```")) {
      lines.shift();
    }
    if (lines[lines.length - 1] === "```") {
      lines.pop();
    }
    cleaned = lines.join("\n");
  }
  return cleaned.trim();
}

function getTestFilePath(sourceFile: string): string {
  const dir = path.dirname(sourceFile);
  const ext = path.extname(sourceFile);
  const base = path.basename(sourceFile, ext);

  const testDir = path.join(dir, "__tests__");
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }

  return path.join(testDir, `${base}.test${ext}`);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("Usage: npx tsx scripts/generate-tests.ts <target-file-path> [--fix <error-trace-or-file-path>]");
    process.exit(1);
  }

  const targetFile = args[0];
  if (!fs.existsSync(targetFile)) {
    console.error(`Error: target file not found: ${targetFile}`);
    process.exit(1);
  }

  const isFrontend = targetFile.startsWith("frontend/");
  const framework = isFrontend ? "Vitest" : "Jest";
  const frameworkRules = isFrontend
    ? "Use Vitest. Import 'describe', 'it', 'expect', 'vi', 'beforeEach', etc. from 'vitest'. Mock modules using vi.mock()."
    : "Use Jest. Do NOT import 'describe', 'it', 'expect', etc.; they are global. Mock modules using jest.mock().";

  const systemInstruction = `You are a Principal Software Engineer. Write a robust unit test suite for the given source file.
Follow these rules:
1. Write strict, type-safe TypeScript code.
2. Use the correct test framework based on the file environment:
   - Framework to use: ${framework}.
   - Rules: ${frameworkRules}
3. Import the source module using correct relative imports.
4. Mock external dependencies appropriately (e.g. database connections, external APIs, heavy services).
5. Cover edge cases, success paths, and failure paths.
6. Output ONLY the raw TypeScript code of the test. Do not include markdown code block backticks (e.g. \`\`\`typescript) or explanations.`;

  const testFilePath = getTestFilePath(targetFile);

  const fixIndex = args.indexOf("--fix");
  if (fixIndex !== -1) {
    // Fix Mode
    let errorTrace = args.slice(fixIndex + 1).join(" ");
    if (fs.existsSync(errorTrace)) {
      errorTrace = fs.readFileSync(errorTrace, "utf-8");
    }

    if (!fs.existsSync(testFilePath)) {
      console.error(`Error: test file not found for fixing: ${testFilePath}`);
      process.exit(1);
    }

    const sourceCode = fs.readFileSync(targetFile, "utf-8");
    const testCode = fs.readFileSync(testFilePath, "utf-8");

    const prompt = `The unit test suite for the source file is failing.
    
--- ORIGINAL SOURCE CODE (${targetFile}):
${sourceCode}

--- CURRENT FAILING TEST CODE (${testFilePath}):
${testCode}

--- ERROR TRACE:
${errorTrace}

Please fix the unit test file so that compilation/typechecking succeeds and all tests pass.
Do NOT modify the original source code. Only modify the test code.
Output ONLY the raw TypeScript code of the corrected test. Do not include markdown code block backticks (e.g. \`\`\`typescript) or explanations.`;

    console.log(`Fixing tests for ${targetFile} using ${framework}...`);
    try {
      const rawAiResponse = await callAI(prompt, systemInstruction);
      const fixedTestCode = cleanCode(rawAiResponse);
      fs.writeFileSync(testFilePath, fixedTestCode, "utf-8");
      console.log(`Successfully wrote fixed tests to ${testFilePath}`);
    } catch (err: any) {
      console.error(`Error calling AI provider: ${err.message}`);
      process.exit(1);
    }
  } else {
    // Generate Mode
    const sourceCode = fs.readFileSync(targetFile, "utf-8");
    const prompt = `Write a comprehensive test suite for the following module.

--- SOURCE CODE (${targetFile}):
${sourceCode}

Output ONLY the raw TypeScript code of the test. Do not include markdown code block backticks (e.g. \`\`\`typescript) or explanations.`;

    console.log(`Generating initial tests for ${targetFile} using ${framework}...`);
    try {
      const rawAiResponse = await callAI(prompt, systemInstruction);
      const generatedTestCode = cleanCode(rawAiResponse);
      fs.writeFileSync(testFilePath, generatedTestCode, "utf-8");
      console.log(`Successfully wrote generated tests to ${testFilePath}`);
    } catch (err: any) {
      console.error(`Error calling AI provider: ${err.message}`);
      process.exit(1);
    }
  }
}

main();
