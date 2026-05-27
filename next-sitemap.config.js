const fs = require("fs");
const path = require("path");

// Scan app/ folder recursively, include only folders with page.jsx
function getAllPages(dir = "app", prefix = "") {
  const routes = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (item === "api" || item.startsWith("_")) continue; // skip API and special folders

      const pageFile = fs
        .readdirSync(fullPath)
        .find((f) => f === "page.jsx" || f === "page.tsx");
      if (pageFile) {
        routes.push(`${prefix}/${item}`);
      }

      // Recurse into subfolders
      routes.push(...getAllPages(fullPath, `${prefix}/${item}`));
    }
  }

  return routes;
}

/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: process.env.SITE_URL || "https://algobuddy.vercel.app",
  generateRobotsTxt: true,
  sitemapSize: 5000,
  transform: async (config, path) => ({
    loc: path,
    lastmod: new Date().toISOString(),
  }),
  additionalPaths: async (config) => {
    const allRoutes = getAllPages(); // recursively get all module pages
    return allRoutes.map((route) => ({
      loc: route,
      lastmod: new Date().toISOString(),
    }));
  },
};

module.exports = config;
