import jsPDF from "jspdf";

export type StoryExportExtension = "md" | "docx" | "pdf";

export const getSafeFileName = (
  title: string,
  extension: StoryExportExtension
): string => {
  const safeTitle = (title || "story")
    .trim()
    .replace(/[^a-z0-9]+/gi, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();

  return `${safeTitle || "story"}.${extension}`;
};

export const downloadBlob = (blob: Blob, fileName: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
};

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export type CreateDocxBlobParams = {
  title: string;
  content: string;
  tag: string;
  author: string;
};

export const createDocxBlob = ({
  title,
  content,
  tag,
  author,
}: CreateDocxBlobParams): Blob => {
  const paragraphs = content
    .split(/\n+/)
    .map((paragraph) => `<p>${escapeHtml(paragraph.trim())}</p>`)
    .join("");

  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #111827; }
    h1 { color: #312e81; }
    .meta { color: #64748b; font-size: 12px; margin-bottom: 24px; }
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  <div class="meta">Tag: ${escapeHtml(tag)} | Author: ${escapeHtml(author)}</div>
  ${paragraphs}
</body>
</html>`;

  return new Blob([html], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8",
  });
};

export interface WorkspaceDocxParams {
  title: string;
  authorName: string;
  dateStr: string;
  chapters: Array<{ title: string; content: string }>;
}

export const createWorkspaceDocxBlob = ({
  title,
  authorName,
  dateStr,
  chapters,
}: WorkspaceDocxParams): Blob => {
  const chaptersHtml = chapters.length === 0
    ? "<p><em>No chapters in this story.</em></p>"
    : chapters.map((ch) => {
        const paragraphs = ch.content
          .split(/\n+/)
          .map((p) => `<p>${escapeHtml(p.trim())}</p>`)
          .join("");
        return `<h2>${escapeHtml(ch.title)}</h2>${paragraphs}`;
      }).join("<hr/>");

  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #111827; }
    h1 { color: #312e81; }
    h2 { color: #4338ca; margin-top: 24px; }
    .meta { color: #64748b; font-size: 12px; margin-bottom: 24px; }
    hr { border: none; border-top: 1px solid #e2e8f0; margin: 24px 0; }
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  <div class="meta">Author: ${escapeHtml(authorName)} | Date: ${escapeHtml(dateStr)}</div>
  ${chaptersHtml}
</body>
</html>`;

  return new Blob([html], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8",
  });
};

export interface WorkspacePdfParams {
  title: string;
  authorName: string;
  dateStr: string;
  chapters: Array<{ title: string; content: string }>;
}

export const exportWorkspacePDF = ({
  title,
  authorName,
  dateStr,
  chapters,
}: WorkspacePdfParams): void => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const leftMargin = 20;
  const rightMargin = 20;
  const topMargin = 20;
  const bottomMargin = 20;
  const printableWidth = 210 - leftMargin - rightMargin; // 170 mm
  const maxY = 297 - bottomMargin - 10;
  let yCursor = topMargin;

  // Draw Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(99, 102, 241);
  doc.text("StorySparkAI", leftMargin, yCursor + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("WORKSPACE STORY DRAFT", 190, yCursor + 5, { align: "right" });
  yCursor += 12;

  doc.setDrawColor(99, 102, 241);
  doc.setLineWidth(0.5);
  doc.line(leftMargin, yCursor, 190, yCursor);
  yCursor += 10;

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(30, 41, 59);
  const splitTitle = doc.splitTextToSize(title, printableWidth);
  splitTitle.forEach((line: string) => {
    doc.text(line, leftMargin, yCursor);
    yCursor += 9;
  });
  yCursor += 2;

  // Metadata row
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Author: ${authorName}`, leftMargin, yCursor);
  doc.text(`Date: ${dateStr}`, 190, yCursor, { align: "right" });
  yCursor += 6;

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.2);
  doc.line(leftMargin, yCursor, 190, yCursor);
  yCursor += 10;

  // Chapters
  if (chapters.length === 0) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text("No chapters in this story.", leftMargin, yCursor);
  } else {
    chapters.forEach((chapter, index) => {
      if (yCursor > maxY) {
        doc.addPage();
        yCursor = 30;
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(99, 102, 241);
      const splitChTitle = doc.splitTextToSize(chapter.title || `Chapter ${index + 1}`, printableWidth);
      splitChTitle.forEach((line: string) => {
        if (yCursor > maxY) {
          doc.addPage();
          yCursor = 30;
        }
        doc.text(line, leftMargin, yCursor);
        yCursor += 7;
      });
      yCursor += 3;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(30, 41, 59);
      const paragraphs = (chapter.content || "").split(/\n+/);
      paragraphs.forEach((para: string, pIdx: number) => {
        const cleanPara = para.trim();
        if (!cleanPara) return;
        const lines = doc.splitTextToSize(cleanPara, printableWidth);
        lines.forEach((line: string) => {
          if (yCursor > maxY) {
            doc.addPage();
            yCursor = 30;
          }
          doc.setFont("helvetica", "normal");
          doc.setFontSize(11);
          doc.setTextColor(30, 41, 59);
          doc.text(line, leftMargin, yCursor);
          yCursor += 6.5;
        });
        if (pIdx < paragraphs.length - 1) {
          yCursor += 4.5;
        }
      });
      yCursor += 10;
    });
  }

  // Running footer/header
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Running Footer
    doc.setDrawColor(241, 245, 249);
    doc.setLineWidth(0.25);
    doc.line(leftMargin, 280, 190, 280);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("Generated with StorySparkAI Workspace", leftMargin, 285);
    doc.text(`Page ${i} of ${totalPages}`, 190, 285, { align: "right" });

    // Running Header (only on page 2 and later)
    if (i > 1) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(99, 102, 241);
      doc.text("StorySparkAI", leftMargin, 14);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      const headerTitle = title.length > 50 ? title.substring(0, 50) + "..." : title;
      doc.text(headerTitle, 190, 14, { align: "right" });

      doc.setDrawColor(241, 245, 249);
      doc.setLineWidth(0.2);
      doc.line(leftMargin, 17, 190, 17);
    }
  }

  doc.save(getSafeFileName(title, "pdf"));
};
