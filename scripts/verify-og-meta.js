#!/usr/bin/env node

const DEFAULT_URL = "https://storysparkai.vercel.app";
const CANONICAL_DOMAIN = "storysparkai.vercel.app";

const TAGS_TO_CHECK = [
  { name: "og:url", regex: /<meta\s+property=["']og:url["']\s+content=["']([^"']+)["']/i },
  { name: "og:image", regex: /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i },
  { name: "twitter:image", regex: /<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i },
];

async function main() {
  const targetUrl = process.argv[2] || DEFAULT_URL;
  console.log(`Fetching ${targetUrl} to verify OG/Twitter meta tags...`);

  let html;
  try {
    const response = await fetch(targetUrl, {
      headers: { "User-Agent": "og-meta-check-bot" },
    });
    if (!response.ok) {
      console.error(`✗ Failed to fetch ${targetUrl}: HTTP ${response.status}`);
      process.exit(1);
    }
    html = await response.text();
  } catch (err) {
    console.error(`✗ Error fetching ${targetUrl}: ${err.message}`);
    process.exit(1);
  }

  let hasFailure = false;
  for (const tag of TAGS_TO_CHECK) {
    const match = html.match(tag.regex);
    if (!match) {
      console.error(`✗ ${tag.name}: meta tag not found in HTML`);
      hasFailure = true;
      continue;
    }
    const content = match[1];
    if (!content.includes(CANONICAL_DOMAIN)) {
      console.error(`✗ ${tag.name}: expected domain "${CANONICAL_DOMAIN}" but got "${content}"`);
      hasFailure = true;
    } else {
      console.log(`✓ ${tag.name}: ${content}`);
    }
  }

  if (hasFailure) {
    console.error(
      "\nOne or more meta tags point to an unexpected domain. " +
        "This usually means the production deployment is stale or " +
        "tracking the wrong branch/domain in Vercel. See issue #3553."
    );
    process.exit(1);
  }

  console.log("\nAll OG/Twitter meta tags point to the canonical domain. ✓");
}

main();
