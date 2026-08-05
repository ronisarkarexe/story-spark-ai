import { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';

// Helper function to patch Reflected XSS vulnerabilities without adding heavy dependencies
function escapeHtml(unsafe: string): string {
  return unsafe.replace(/[&<>"']/g, (match) => {
    switch (match) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#39;';
      default: return match;
    }
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;
  const idStr = Array.isArray(id) ? id[0] : id;

  // 1. Fix SSRF: Validate input format strictly before using it in a fetch call
  if (!idStr || !/^[a-zA-Z0-9_-]+$/.test(idStr)) {
    console.error(`Rejected invalid or malicious ID pattern: ${idStr}`);
    // Safe fallback: serve unmodified index.html
    const filePath = path.resolve(process.cwd(), 'dist', 'index.html');
    return res.status(200).send(fs.readFileSync(filePath, 'utf8'));
  }

  const API_BASE = process.env.VITE_API_URL || process.env.API_URL || 'http://localhost:5000';

  try {
    const apiResponse = await fetch(`${API_BASE}/api/stories/${idStr}`);
    if (!apiResponse.ok) throw new Error(`Backend returned status ${apiResponse.status}`);
    const story = await apiResponse.json();

    const filePath = path.resolve(process.cwd(), 'dist', 'index.html');
    let html = fs.readFileSync(filePath, 'utf8');

    // 2. Fix XSS: Escape raw backend data before string substitution
    const title = escapeHtml(story?.title || 'Story Spark AI');
    const description = escapeHtml(
      story?.content ? `${story.content.substring(0, 160)}...` : 'Ignite your imagination with powerful AI-driven storytelling tools.'
    );
    const image = escapeHtml(story?.coverImage || 'https://storysparkai.vercel.app/og-image.jpg');
    const url = escapeHtml(`https://storysparkai.vercel.app/story/${idStr}`);

    // Replace default Open Graph and Twitter tags safely
    html = html
      .replace(/<title>.*?<\/title>/, `<title>${title} | Story Spark AI</title>`)
      .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${title}" />`)
      .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${description}" />`)
      .replace(/<meta property="og:image" content=".*?" \/>/, `<meta property="og:image" content="${image}" />`)
      .replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${url}" />`)
      .replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${title}" />`)
      .replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${description}" />`)
      .replace(/<meta name="twitter:image" content=".*?">/, `<meta name="twitter:image" content="${image}">`);

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate'); // Lowered to 60s for fresher story updates
    return res.status(200).send(html);

  } catch (error) {
    console.error('OG Injection failed:', error);
    const filePath = path.resolve(process.cwd(), 'dist', 'index.html');
    return res.status(200).send(fs.readFileSync(filePath, 'utf8'));
  }
}