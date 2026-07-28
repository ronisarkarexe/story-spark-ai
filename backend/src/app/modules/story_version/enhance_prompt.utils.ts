commit 25ffbf8715a7c8f271bf0f4bab81b42a2e7362ad
Author: tmdeveloper007 <tmdeveloper007@users.noreply.github.com>
Date:   Tue Jul 28 00:17:41 2026 +0000

    fix: resolve backend TypeScript syntax errors blocking all PRs

diff --git a/backend/src/app/modules/story_version/enhance_prompt.utils.ts b/backend/src/app/modules/story_version/enhance_prompt.utils.ts
index cc98d820..f30046b0 100644
--- a/backend/src/app/modules/story_version/enhance_prompt.utils.ts
+++ b/backend/src/app/modules/story_version/enhance_prompt.utils.ts
@@ -1,4 +1,3 @@
-import { GoogleGenerativeAI } from "@google/generative-ai";
 import {
   GEMINI_MODEL,
   CLAUDE_MODEL,
@@ -8,16 +7,6 @@ import {
   getGeminiClient,
 } from "../../../services/ai.service";
 
-export const enhancePrompt = (prompt: string, context?: string): string => {
-  // Use the following story context if available
-  const compressedContext = context ? context : "No previous context";
-
-  const metaPrompt = `You are a creative writing assistant. Rewrite the following story prompt to be more vivid, specific, and engaging. Add a character name, setting details, and a central conflict. Return ONLY the enhanced prompt, nothing else. Do not add any explanation or prefix.
-
-Context: ${compressedContext}
-
-const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
-
 export const enhancePromptWithGemini = async (
   prompt: string,
   signal?: AbortSignal,
