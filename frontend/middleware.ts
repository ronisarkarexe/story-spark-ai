import { NextRequest, NextResponse } from "next/server";

const STORY_ROUTE = /^\/stor(?:y|ies)\/([^/?#]+)/;

const API_BASE =
  process.env.VITE_API_BASE_URL || "https://storysparkai.vercel.app/api/v1";

// Module-scoped cache — persists across invocations on the same edge instance  
let cachedHtml: string | null = null;
let cachedHtmlExpiry = 0;
const HTML_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export const config = {
  matcher: ["/story/:id*", "/stories/:id*"],
};

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const match = pathname.match(STORY_ROUTE);

  if (!match) return NextResponse.next();

  const storyId = match[1];

  try {
    const now = Date.now();
    const needsFreshHtml = !cachedHtml || now > cachedHtmlExpiry;

    // Run story fetch and (conditionally) html fetch in parallel
    const [res, html] = await Promise.all([
      fetch(`${API_BASE}/stories/${storyId}`, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(3000),
      }),
      needsFreshHtml
        ? fetch(new URL("/index.html", req.url).toString()).then((r) =>
            r.text()
          )
        : Promise.resolve(cachedHtml as string),
    ]);

    if (!res.ok) return NextResponse.next();

    const story = await res.json();

    if (needsFreshHtml) {
      cachedHtml = html;
      cachedHtmlExpiry = now + HTML_CACHE_TTL_MS;
    }

    const title = story.title ?? "Story Spark AI";
    const description = (story.content ?? story.description ?? "")
      .replace(/<[^>]+>/g, "")
      .slice(0, 160);
    const image =
      story.coverImage ??
      story.imageUrl ??
      "https://storysparkai.vercel.app/og-default.png";
    const url = `https://storysparkai.vercel.app${pathname}`;

    const ogTags = `
    <meta property="og:type"        content="article" />
    <meta property="og:title"       content="${escapeAttr(title)}" />
    <meta property="og:description" content="${escapeAttr(description)}" />
    <meta property="og:image"       content="${escapeAttr(image)}" />
    <meta property="og:url"         content="${escapeAttr(url)}" />
    <meta property="og:site_name"   content="Story Spark AI" />
    <meta name="twitter:card"        content="summary_large_image" />
    <meta name="twitter:title"       content="${escapeAttr(title)}" />
    <meta name="twitter:description" content="${escapeAttr(description)}" />
    <meta name="twitter:image"       content="${escapeAttr(image)}" />
    <meta name="description"         content="${escapeAttr(description)}" />`;

    const patched = html
      .replace(/<meta\s+(?:property|name)="(?:og:|twitter:)[^"]*"[^>]*>/gi, "")
      .replace("</head>", `${ogTags}\n  </head>`);

    return new NextResponse(patched, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
      },
    });
  } catch {
    return NextResponse.next();
  }
}

function escapeAttr(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}