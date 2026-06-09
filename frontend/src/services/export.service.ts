import jsPDF from "jspdf";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export interface IExportStory {
  uuid: string;
  title: string;
  content: string;
  tag: string;
  imageURL: string;
  language?: string;
}

/**
 * Asynchronous asset pipeline to fetch images from cloud storage
 * with a canvas CORS fallback.
 */
export const fetchImageAsBlob = async (url: string): Promise<Blob> => {
  try {
    // Try standard fetch first
    const response = await fetch(url, { mode: "cors" });
    if (!response.ok) {
      throw new Error(`Direct fetch failed with status ${response.status}`);
    }
    return await response.blob();
  } catch (error) {
    console.warn("Direct image fetch failed (CORS or network). Trying HTML Canvas fallback...", error);
    
    // Canvas fallback using Image element with crossOrigin
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Failed to get 2d context for canvas"));
            return;
          }
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Canvas toBlob yielded null blob"));
            }
          }, "image/png");
        } catch (canvasError) {
          reject(canvasError);
        }
      };
      img.onerror = (err) => reject(new Error("Image element load failed: " + String(err)));
      img.src = url;
    });
  }
};

/**
 * Converts a Blob to a Base64 data URL.
 */
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Compiles and exports the story to a beautifully structured PDF.
 */
export const exportStoryToPDF = async (
  story: IExportStory,
  base64Image: string | null
): Promise<void> => {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  
  // --- Page 1: Full-Bleed Cover ---
  // Background solid color
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 297, "F");

  // Bottom backdrop shape
  doc.setFillColor(30, 41, 59); // slate-800
  doc.rect(0, 220, 210, 77, "F");

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(255, 255, 255);
  const splitTitle = doc.splitTextToSize(story.title || "Untitled Story", 170);
  let coverY = 40;
  splitTitle.forEach((line: string) => {
    doc.text(line, 105, coverY, { align: "center" });
    coverY += 12;
  });

  // Genre Tag Badge
  if (story.tag) {
    coverY += 4;
    const badgeText = story.tag.toUpperCase();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    const textWidth = doc.getTextWidth(badgeText);
    const badgeWidth = textWidth + 12;
    const badgeHeight = 7;
    const badgeX = 105 - badgeWidth / 2;
    
    // Draw rounded background (simulation)
    doc.setFillColor(99, 102, 241); // indigo-500
    doc.rect(badgeX, coverY, badgeWidth, badgeHeight, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.text(badgeText, 105, coverY + 4.8, { align: "center" });
    coverY += badgeHeight + 10;
  }

  // Cover Page Illustration (Centered Frame)
  if (base64Image) {
    try {
      doc.addImage(base64Image, "PNG", 35, coverY, 140, 105);
      coverY += 115;
    } catch (e) {
      console.error("Failed to add image to PDF cover:", e);
      doc.setDrawColor(51, 65, 85);
      doc.setLineWidth(0.5);
      doc.line(40, coverY + 20, 170, coverY + 20);
      coverY += 40;
    }
  } else {
    doc.setDrawColor(51, 65, 85);
    doc.setLineWidth(0.5);
    doc.line(40, coverY + 20, 170, coverY + 20);
    coverY += 40;
  }

  // Branding text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text("StorySparkAI", 105, 250, { align: "center" });
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text("Your AI-Generated Story Book", 105, 258, { align: "center" });

  // --- Page 2: Story Content Layout ---
  doc.addPage();
  
  const leftMargin = 20;
  const rightMargin = 20;
  const topMargin = 25;
  const bottomMargin = 25;
  const printableWidth = 210 - leftMargin - rightMargin;
  const maxY = 297 - bottomMargin;
  let yCursor = topMargin;

  // Add the illustration at the top of content page
  if (base64Image) {
    try {
      doc.addImage(base64Image, "PNG", 45, yCursor, 120, 90);
      yCursor += 100;
    } catch (e) {
      console.error("Failed to add image to PDF content:", e);
    }
  }

  // Content Page Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(15, 23, 42); // slate-900
  const contentTitleLines = doc.splitTextToSize(story.title || "Untitled Story", printableWidth);
  contentTitleLines.forEach((line: string) => {
    if (yCursor + 10 > maxY) {
      doc.addPage();
      yCursor = topMargin + 10;
    }
    doc.text(line, leftMargin, yCursor);
    yCursor += 9;
  });
  
  // Divider line
  if (yCursor + 5 > maxY) {
    doc.addPage();
    yCursor = topMargin + 10;
  }
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.5);
  doc.line(leftMargin, yCursor, 190, yCursor);
  yCursor += 10;

  // Story Text rendering
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(51, 65, 85); // slate-700
  
  const paragraphs = story.content.split(/\n+/);
  paragraphs.forEach((para) => {
    const cleanPara = para.trim();
    if (!cleanPara) return;
    
    const lines = doc.splitTextToSize(cleanPara, printableWidth);
    lines.forEach((line: string) => {
      // 7mm spacing per line
      if (yCursor + 7 > maxY) {
        doc.addPage();
        yCursor = topMargin + 10; // Extra room for running headers
      }
      doc.text(line, leftMargin, yCursor);
      yCursor += 6.5;
    });
    
    // Gap between paragraphs
    yCursor += 4.5;
  });

  // Running headers and footers (drawn over all pages except page 1)
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    
    if (i === 1) continue; // Skip cover page

    // Running Header
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(story.title.length > 40 ? story.title.substring(0, 40) + "..." : story.title, leftMargin, 15);
    doc.text("StorySparkAI", 190, 15, { align: "right" });
    
    doc.setDrawColor(241, 245, 249);
    doc.setLineWidth(0.25);
    doc.line(leftMargin, 18, 190, 18);

    // Running Footer
    doc.line(leftMargin, 280, 190, 280);
    doc.text("Generated with StorySparkAI", leftMargin, 285);
    doc.text(`Page ${i} of ${totalPages}`, 190, 285, { align: "right" });
  }

  // Trigger file download
  const cleanFileName = (story.title || "story").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  doc.save(`${cleanFileName || "story"}.pdf`);
};

/**
 * Compiles and exports the story to a structured, reflowable EPUB book.
 */
export const exportStoryToEPUB = async (
  story: IExportStory,
  imageBlob: Blob | null
): Promise<void> => {
  const zip = new JSZip();
  const uuid = story.uuid || Math.random().toString(36).substring(2, 15);
  const dateStr = new Date().toISOString().split(".")[0] + "Z"; // Standard UTC format
  const language = story.language || "en";
  const cleanFileName = (story.title || "story").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  
  // 1. mimetype (MUST be uncompressed)
  zip.file("mimetype", "application/epub+zip", { compression: "STORE" });

  // 2. META-INF/container.xml
  zip.file(
    "META-INF/container.xml",
    `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`
  );

  // 3. OEBPS/style.css
  zip.file(
    "OEBPS/style.css",
    `body {
  font-family: Georgia, serif;
  line-height: 1.6;
  margin: 20px;
  color: #111111;
  background-color: #ffffff;
}
h1, h2 {
  text-align: center;
  color: #1e1b4b;
  margin-bottom: 20px;
}
p {
  text-indent: 1.5em;
  margin: 0 0 12px 0;
  text-align: justify;
}
p:first-of-type {
  text-indent: 0;
}
.cover-body {
  margin: 0;
  padding: 0;
  text-align: center;
}
.cover-container {
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 90vh;
}
.cover-title {
  font-size: 2.5em;
  margin-bottom: 10px;
  color: #311042;
}
.cover-author {
  font-size: 1.2em;
  color: #666666;
  margin-bottom: 30px;
}
.cover-genre {
  font-size: 0.9em;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  background-color: #f3e8ff;
  color: #6b21a8;
  padding: 5px 15px;
  border-radius: 20px;
  display: inline-block;
  margin-bottom: 40px;
}
.cover-image-container, .story-img-container {
  text-align: center;
  margin: 20px 0;
  width: 100%;
}
.cover-img, .story-img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}`
  );

  const hasImage = !!imageBlob;

  // 4. OEBPS/cover.xhtml
  zip.file(
    "OEBPS/cover.xhtml",
    `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Cover</title>
  <link rel="stylesheet" href="style.css" type="text/css"/>
</head>
<body class="cover-body">
  <div class="cover-container">
    <h1 class="cover-title">${escapeXml(story.title)}</h1>
    <p class="cover-author">Created by StorySparkAI</p>
    ${story.tag ? `<p class="cover-genre">${escapeXml(story.tag)}</p>` : ""}
    ${hasImage ? `<div class="cover-image-container"><img class="cover-img" src="images/illustration.png" alt="Story Cover"/></div>` : ""}
  </div>
</body>
</html>`
  );

  // 5. OEBPS/nav.xhtml
  zip.file(
    "OEBPS/nav.xhtml",
    `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
<head>
  <title>${escapeXml(story.title)}</title>
  <link rel="stylesheet" href="style.css" type="text/css"/>
</head>
<body>
  <nav epub:type="toc" id="toc">
    <h1>Table of Contents</h1>
    <ol>
      <li><a href="cover.xhtml">Cover</a></li>
      <li><a href="content.xhtml">Story</a></li>
    </ol>
  </nav>
</body>
</html>`
  );

  // 6. OEBPS/content.xhtml
  const paragraphs = story.content.split(/\n+/);
  const paragraphsHtml = paragraphs
    .map((p) => {
      const trimmed = p.trim();
      return trimmed ? `<p>${escapeXml(trimmed)}</p>` : "";
    })
    .filter(Boolean)
    .join("\n      ");

  zip.file(
    "OEBPS/content.xhtml",
    `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>${escapeXml(story.title)}</title>
  <link rel="stylesheet" href="style.css" type="text/css"/>
</head>
<body>
  <section class="story-content">
    <h1>${escapeXml(story.title)}</h1>
    ${hasImage ? `<div class="story-img-container"><img class="story-img" src="images/illustration.png" alt="Story Illustration"/></div>` : ""}
    <div class="paragraphs">
      ${paragraphsHtml}
    </div>
  </section>
</body>
</html>`
  );

  // 7. OEBPS/toc.ncx (for EPUB2 e-readers)
  zip.file(
    "OEBPS/toc.ncx",
    `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="urn:uuid:${uuid}"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  <docTitle>
    <text>${escapeXml(story.title)}</text>
  </docTitle>
  <navMap>
    <navPoint id="navPoint-1" playOrder="1">
      <navLabel><text>Cover</text></navLabel>
      <content src="cover.xhtml"/>
    </navPoint>
    <navPoint id="navPoint-2" playOrder="2">
      <navLabel><text>Story</text></navLabel>
      <content src="content.xhtml"/>
    </navPoint>
  </navMap>
</ncx>`
  );

  // 8. OEBPS/content.opf (Manifest & Spine configuration)
  zip.file(
    "OEBPS/content.opf",
    `<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="bookid" version="3.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="bookid">urn:uuid:${uuid}</dc:identifier>
    <dc:title>${escapeXml(story.title)}</dc:title>
    <dc:language>${language}</dc:language>
    <dc:creator>StorySparkAI</dc:creator>
    <dc:publisher>StorySparkAI</dc:publisher>
    <meta property="dcterms:modified">${dateStr}</meta>
  </metadata>
  <manifest>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
    <item id="cover" href="cover.xhtml" media-type="application/xhtml+xml"/>
    <item id="content" href="content.xhtml" media-type="application/xhtml+xml"/>
    <item id="stylesheet" href="style.css" media-type="text/css"/>
    ${hasImage ? `<item id="cover-image" href="images/illustration.png" media-type="image/png" properties="cover-image"/>` : ""}
  </manifest>
  <spine toc="ncx">
    <itemref idref="cover"/>
    <itemref idref="nav"/>
    <itemref idref="content"/>
  </spine>
</package>`
  );

  // 9. Embed image if present
  if (imageBlob) {
    zip.file("OEBPS/images/illustration.png", imageBlob);
  }

  // 10. Generate and trigger download
  const epubBlob = await zip.generateAsync({ type: "blob", mimeType: "application/epub+zip" });
  saveAs(epubBlob, `${cleanFileName || "story"}.epub`);
};

/**
 * Escapes special XML characters.
 */
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case "\"": return "&quot;";
      default: return c;
    }
  });
}
