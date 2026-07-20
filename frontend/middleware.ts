const CRAWLER_RE = /Twitterbot|LinkedInBot|WhatsApp|Slackbot|Discordbot|facebookexternalhit|Slack-ImgProxy|facebot|Pinterest/i;

const STORY_ROUTE = /^\/post\/([^/?#]+)/;

const API_BASE = process.env.API_BASE_URL || process.env.VITE_BASE_URL || "";

const FALLBACK_OG_IMAGE = "https://storysparkai.vercel.app/og-image.jpg";

const HTML_CACHE_TTL_MS = 300_000;

let cachedIndexHtml: string | null = null;
let cachedIndexExpiry = 0;

export const config = {
  matcher: ["/post/:id"],
};

export default async function middleware(request: Request): Promise<Response | undefined> {
  const url = new URL(request.url);
  const match = url.pathname.match(STORY_ROUTE);

  if (!match) return;

  const ua = request.headers.get("user-agent") || "";
  if (!CRAWLER_RE.test(ua)) return;

  const storyId = match[1];
  const apiUrl = API_BASE
    ? `${API_BASE.replace(/\/+$/, "")}/post/${storyId}`
    : null;

  let story: { title?: string; content?: string; imageURL?: string } | null = null;

  if (apiUrl) {
    try {
      const res = await fetch(apiUrl, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(4_000),
      });
      if (res.ok) story = await res.json();
    } catch {
      // backend unreachable — serve generic fallback
    }
  }

  const title = story?.title || "Story Spark AI";
  const description = (story?.content || "")
    .replace(/<[^>]+>/g, "")
    .slice(0, 160);
  const image = story?.imageURL || FALLBACK_OG_IMAGE;
  const pageUrl = `https://storysparkai.vercel.app${url.pathname}`;

  let html: string;

  const now = Date.now();
  if (cachedIndexHtml && now < cachedIndexExpiry) {
    html = cachedIndexHtml;
  } else {
    html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Story Spark AI</title>
  <meta property="og:type" content="article" />
  <meta name="twitter:card" content="summary_large_image" />
</head>
<body>
  <script>window.location.href = ${JSON.stringify(pageUrl)};</script>
  <noscript><meta http-equiv="refresh" content="0;url=${pageUrl}" /></noscript>
</body>
</html>`;
    cachedIndexHtml = html;
    cachedIndexExpiry = now + HTML_CACHE_TTL_MS;
  }

  const ogTags = [
    `<meta property="og:title"       content="${escapeAttr(title)}" />`,
    `<meta property="og:description" content="${escapeAttr(description)}" />`,
    `<meta property="og:image"       content="${escapeAttr(image)}" />`,
    `<meta property="og:url"         content="${escapeAttr(pageUrl)}" />`,
    `<meta name="twitter:title"       content="${escapeAttr(title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(description)}" />`,
    `<meta name="twitter:image"       content="${escapeAttr(image)}" />`,
    `<meta name="description"         content="${escapeAttr(description)}" />`,
  ].join("\n    ");

  const patched = html.replace("</head>", `    ${ogTags}\n  </head>`);

  return new Response(patched, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
    },
  });
}

function escapeAttr(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
