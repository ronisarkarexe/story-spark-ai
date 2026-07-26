
const fs = require("fs");
let code = fs.readFileSync("frontend/src/components/collab/CollabEditor.tsx", "utf8");

code = code.replace(/provider\.awareness\.encodeUpdate/g, "yAwareness.encodeAwarenessUpdate");
code = code.replace(/provider\.awareness\.applyUpdate/g, "yAwareness.applyAwarenessUpdate");
code = code.replace(/socket\.on\("awareness-update", \(update: Uint8Array/g, "socket?.on(\"awareness-update\", (update: Uint8Array");
code = code.replace(/socket\.emit\("awareness-update", Array\.from\(/g, "socket?.emit(\"awareness-update\", Array.from(");
code = code.replace(/yDoc\.on\("update", \(update: Uint8Array\) => {/g, "yDoc.on(\"update\", (update: Uint8Array, origin: any, doc: any) => {");

fs.writeFileSync("frontend/src/components/collab/CollabEditor.tsx", code);

