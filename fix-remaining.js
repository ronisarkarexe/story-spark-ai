const fs = require("fs");

function replaceFile(path, from, to) {
  let content = fs.readFileSync(path, "utf8");
  content = content.replace(from, to);
  fs.writeFileSync(path, content);
}

// 1. auth.service.ts
replaceFile("frontend/src/services/auth.service.ts", /decodedToken/g, "decodeToken");

// 2. branching.service.ts
replaceFile("frontend/src/services/branching.service.ts", /import \{ API_BASE_URL \} from "\.\/api";/, "import API_BASE_URL from \"./api\";");

// 3. post.comment.component.tsx (Duplicate identifier useCreateCommentMutation)
let commentCode = fs.readFileSync("frontend/src/components/post/post.comment.component.tsx", "utf8");
commentCode = commentCode.replace(/import {\n  useGetCommentsListQuery,\n  useCreateCommentMutation,\n  useToggleCommentLikeMutation,\n  useDeleteCommentMutation,\n  useCreateCommentMutation,\n} from "\.\.\/\.\.\/redux\/apis\/comment";/g, "import {\n  useGetCommentsListQuery,\n  useCreateCommentMutation,\n  useToggleCommentLikeMutation,\n  useDeleteCommentMutation\n} from \"../../redux/apis/comment\";");
fs.writeFileSync("frontend/src/components/post/post.comment.component.tsx", commentCode);

// 4. App.tsx - ThemeToggle import is wrong
let appCode = fs.readFileSync("frontend/src/App.tsx", "utf8");
appCode = appCode.replace(/import { ThemeToggle } from "\.\/components\/ThemeToggle";/g, "import ThemeToggle from \"./components/ThemeToggle\";");
fs.writeFileSync("frontend/src/App.tsx", appCode);

// 5. useSpeechSynthesis.ts
let speechCode = fs.readFileSync("frontend/src/hooks/useSpeechSynthesis.ts", "utf8");
// Look for 3 arguments in onWordHighlight?.(...)
speechCode = speechCode.replace(/onWordHighlight\?\.\([^,]+,([^,]+),([^)]+)\)/g, "onWordHighlight?.($1, $2)");
fs.writeFileSync("frontend/src/hooks/useSpeechSynthesis.ts", speechCode);

// 6. useAutoSave.ts
let autoSaveCode = fs.readFileSync("frontend/src/hooks/useAutoSave.ts", "utf8");
autoSaveCode = autoSaveCode.replace(/updateQueueState\(/g, "setQueueState(");
autoSaveCode = autoSaveCode.replace(/registerAutoSaveListener\(([^,]+),([^)]+)\)/g, "window.addEventListener('autosave', $2)");
fs.writeFileSync("frontend/src/hooks/useAutoSave.ts", autoSaveCode);

// 7. CollabEditor.tsx
let collabCode = fs.readFileSync("frontend/src/components/collab/CollabEditor.tsx", "utf8");
collabCode = collabCode.replace(/provider\.awareness\.encodeUpdate\(/g, "yAwareness.encodeAwarenessUpdate(");
collabCode = collabCode.replace(/provider\.awareness\.applyUpdate\(/g, "yAwareness.applyAwarenessUpdate(");
collabCode = collabCode.replace(/socket\.on\("awareness-update", \(update: Uint8Array\) => {/g, "socket?.on(\"awareness-update\", (update: Uint8Array) => {");
collabCode = collabCode.replace(/socket\.on\("awareness-update", \(update: any\) => {/g, "socket?.on(\"awareness-update\", (update: any) => {");
fs.writeFileSync("frontend/src/components/collab/CollabEditor.tsx", collabCode);
