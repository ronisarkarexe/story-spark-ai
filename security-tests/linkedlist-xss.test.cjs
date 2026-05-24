const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { pathToFileURL } = require("node:url");

test("createLinkedListTempNode renders untrusted input as text, not HTML", async () => {
  const { JSDOM } = require("jsdom");
  const dom = new JSDOM("<!doctype html><html><body></body></html>");

  const helperUrl = pathToFileURL(
    path.join(
      __dirname,
      "..",
      "app/visualizer/linkedList/utils/createTempNode.js",
    ),
  ).href;

  const { createLinkedListTempNode } = await import(helperUrl);

  const payload = `<img src=x onerror="globalThis.__xss = true">XSS`;
  const node = createLinkedListTempNode({
    value: payload,
    nextText: "NULL",
    doc: dom.window.document,
  });

  const dataPart = node.querySelector(".data-part");
  assert.ok(dataPart, "expected .data-part to exist");

  assert.equal(
    dataPart.textContent,
    payload,
    "untrusted input must be assigned via textContent",
  );
  // In a safe implementation, HTML characters remain escaped in innerHTML.
  // (We do not rely on inline handler execution semantics in JSDOM.)
  assert.ok(
    dataPart.innerHTML.includes("&lt;img"),
    "untrusted input must remain escaped (no HTML parsing)",
  );
  assert.equal(
    dataPart.querySelector("img"),
    null,
    "untrusted input must not be parsed into DOM elements",
  );
});
