# ⚡ Story Spark AI — PDF Filename Export Sanitizer Fix

Resolves file corruption/silent file save failures encountered when running file system exports across various operating systems where user-generated text headers contain high-byte unicode combinations (emojis) or restricted terminal syntax operators.

## ⚙️ How it works
This patch intercepts title outputs from internal application hooks, filtering the text runtime buffer through a sequence-oriented sanitization module prior to executing `jsPDF.save()` instances:
1. Strips out all emojis and non-standard symbols via a comprehensive Unicode range regex wrapper.
2. Discards nested structural quote instances directly (`'`, `"`, `` ` ``) preventing file path truncation.
3. Maps standard dividing gaps and remaining syntax variations cleanly into cohesive snake_case line bridges (`_`).

## 📁 Manifest
* `demo.html` - Interactive parsing environment showing real-time sanitization feedback and active cross-compilation testing blocks using jsPDF.
* `style.css` - Visual context layers styled to emulate the application layout guidelines.