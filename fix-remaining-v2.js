
const fs = require("fs");

// 1. StoryWorkspace.tsx
let ws = fs.readFileSync("frontend/src/components/story/StoryWorkspace.tsx", "utf8");
ws = ws.replace(/import StoryReadingAnalytics from "\.\.\/analytics\/StoryReadingAnalytics";\n/g, "");
ws = ws.replace(/<StoryViewer\s+chapters=\{currentStory\.chapters\}\s+storyId=\{currentStory\.id\}\s+truncated=\{currentStory\.truncated\}\s*\/>/g, "<StoryViewer chapters={currentStory.chapters} storyId={currentStory.id} truncated={currentStory.truncated} maxChapterWords={2000} />");
fs.writeFileSync("frontend/src/components/story/StoryWorkspace.tsx", ws);

// 2. CollabEditor.tsx
let collab = fs.readFileSync("frontend/src/components/collab/CollabEditor.tsx", "utf8");
collab = collab.replace(/provider\.awareness\.encodeUpdate/g, "yAwareness.encodeAwarenessUpdate");
collab = collab.replace(/provider\.awareness\.applyUpdate/g, "yAwareness.applyAwarenessUpdate");
collab = collab.replace(/socket\.on\("awareness-update", \(update: Uint8Array\)/g, "socket?.on(\"awareness-update\", (update: Uint8Array)");
collab = collab.replace(/socket\.emit\("awareness-update", Array\.from\(/g, "socket?.emit(\"awareness-update\", Array.from(");
collab = collab.replace(/yDoc\.on\("update", \(update: Uint8Array\) => {/g, "yDoc.on(\"update\", (update: Uint8Array, origin: any, doc: any) => {");
collab = collab.replace(/const updateHandler = \(update: Uint8Array\) => {/g, "const updateHandler = (update: Uint8Array, origin: any, doc: any, tr: any) => {");
fs.writeFileSync("frontend/src/components/collab/CollabEditor.tsx", collab);

// 3. useSpeechSynthesis.ts
let speech = fs.readFileSync("frontend/src/hooks/useSpeechSynthesis.ts", "utf8");
// Look for 3 arguments in onWordHighlight?.(...)
speech = speech.replace(/onWordHighlight\?\.\([^,]+,\s*([^,]+),\s*([^)]+)\)/g, "onWordHighlight?.($1, $2)");
fs.writeFileSync("frontend/src/hooks/useSpeechSynthesis.ts", speech);

