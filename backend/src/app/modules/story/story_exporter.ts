import Epub from "epub-gen-memory";

/** A single node in a branching story tree. */
export interface StoryExportNode {
  id: string;
  parentId: string | null;
  /** The choice text that led INTO this node from its parent. Null for the root. */
  choiceText: string | null;
  title: string;
  content: string;
  /** Optional cover/illustration URL for this node/chapter. */
  imageURL?: string;
}

export interface StoryExportData {
  title: string;
  author: string;
  genre?: string;
  nodes: StoryExportNode[];
}

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/** Depth-first reading order: root first, then each branch's nodes together. */
function toReadingOrder(nodes: StoryExportNode[]): StoryExportNode[] {
  const byParent = new Map<string | null, StoryExportNode[]>();
  for (const node of nodes) {
    const siblings = byParent.get(node.parentId) ?? [];
    siblings.push(node);
    byParent.set(node.parentId, siblings);
  }

  const root = nodes.find((n) => n.parentId === null);
  if (!root) return nodes;

  const ordered: StoryExportNode[] = [];
  const visit = (node: StoryExportNode) => {
    ordered.push(node);
    const children = byParent.get(node.id) ?? [];
    for (const child of children) visit(child);
  };
  visit(root);
  return ordered;
}

/**
 * Generates a valid EPUB (OCF container) from a branching story tree.
 * Chapters are laid out in depth-first reading order; each non-root chapter
 * is prefixed with the choice that led to it, so branches read coherently
 * even flattened into a linear ebook.
 */
export async function generateEpub(data: StoryExportData): Promise<Buffer> {
  const orderedNodes = toReadingOrder(data.nodes);

  const chapters = orderedNodes.map((node) => {
    const choiceHeader = node.choiceText
      ? `<p><em>Choice: ${escapeHtml(node.choiceText)}</em></p>`
      : "";
    const paragraphs = node.content
      .split(/\n+/)
      .filter((p) => p.trim().length > 0)
      .map((p) => `<p>${escapeHtml(p.trim())}</p>`)
      .join("");

    return {
      title: node.title,
      content: `${choiceHeader}${paragraphs}`,
    };
  });

 const buffer = await Epub(
  {
    title: data.title,
    author: data.author,
    lang: "en",
    prependChapterTitles: true,
  },
  chapters
);

  return buffer;
}

/**
 * Generates a single self-contained interactive HTML file. Story data is
 * embedded as JSON and a small inline script renders one node at a time,
 * with a button per outgoing choice so the reader can navigate the branches
 * client-side, offline, with no server or external assets required.
 */
export function generateInteractiveHtml(data: StoryExportData): string {
  const nodesJson = JSON.stringify(data.nodes).replace(/</g, "\\u003c");
  const rootId = data.nodes.find((n) => n.parentId === null)?.id ?? "";

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(data.title)}</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: Georgia, "Times New Roman", serif;
    background: #0f172a;
    color: #e2e8f0;
    display: flex;
    justify-content: center;
    padding: 2.5rem 1.25rem;
    min-height: 100vh;
  }
  main { max-width: 640px; width: 100%; }
  h1 { font-size: 1.75rem; margin-bottom: 0.25rem; }
  .byline { color: #94a3b8; margin-bottom: 2rem; font-size: 0.9rem; }
  #chapter-title { font-size: 1.35rem; margin-bottom: 1rem; }
  #chapter-content p { line-height: 1.75; margin: 0 0 1rem; }
  #choices { margin-top: 2rem; display: flex; flex-direction: column; gap: 0.75rem; }
  .choice-btn {
    text-align: left;
    padding: 0.85rem 1.1rem;
    border-radius: 0.75rem;
    border: 1px solid rgba(148, 163, 184, 0.3);
    background: rgba(30, 41, 59, 0.6);
    color: #e2e8f0;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 150ms ease, border-color 150ms ease;
  }
  .choice-btn:hover { background: rgba(51, 65, 85, 0.8); border-color: #6366f1; }
  #restart-btn {
    margin-top: 2.5rem;
    background: none;
    border: none;
    color: #818cf8;
    cursor: pointer;
    font-size: 0.9rem;
    text-decoration: underline;
  }
  .the-end { color: #94a3b8; font-style: italic; margin-top: 1.5rem; }
</style>
</head>
<body>
<main>
  <h1>${escapeHtml(data.title)}</h1>
  <p class="byline">by ${escapeHtml(data.author)}</p>
  <h2 id="chapter-title"></h2>
  <div id="chapter-content"></div>
  <div id="choices"></div>
  <button id="restart-btn" type="button">Restart from the beginning</button>
</main>
<script>
(function () {
  var nodes = ${nodesJson};
  var rootId = ${JSON.stringify(rootId)};
  var byId = {};
  var childrenOf = {};
  nodes.forEach(function (n) {
    byId[n.id] = n;
    if (!childrenOf[n.parentId]) childrenOf[n.parentId] = [];
    childrenOf[n.parentId].push(n);
  });

  var titleEl = document.getElementById("chapter-title");
  var contentEl = document.getElementById("chapter-content");
  var choicesEl = document.getElementById("choices");

  function render(nodeId) {
    var node = byId[nodeId];
    if (!node) return;

    titleEl.textContent = node.title;
    contentEl.innerHTML = node.content
      .split(/\\n+/)
      .filter(function (p) { return p.trim().length > 0; })
      .map(function (p) {
        var el = document.createElement("p");
        el.textContent = p.trim();
        return el.outerHTML;
      })
      .join("");

    choicesEl.innerHTML = "";
    var children = childrenOf[nodeId] || [];

    if (children.length === 0) {
      var end = document.createElement("p");
      end.className = "the-end";
      end.textContent = "— The End —";
      choicesEl.appendChild(end);
      return;
    }

    children.forEach(function (child) {
      var btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.type = "button";
      btn.textContent = child.choiceText || child.title;
      btn.addEventListener("click", function () {
        render(child.id);
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      choicesEl.appendChild(btn);
    });
  }

  document.getElementById("restart-btn").addEventListener("click", function () {
    render(rootId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  render(rootId);
})();
</script>
</body>
</html>`;
}