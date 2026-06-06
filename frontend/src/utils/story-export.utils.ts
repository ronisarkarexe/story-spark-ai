export type StoryExportExtension = "md" | "docx";

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
