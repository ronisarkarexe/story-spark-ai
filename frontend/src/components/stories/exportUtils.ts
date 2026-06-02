/**
 * Download a blob as a file
 */
export const downloadBlob = (blob: Blob, fileName: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Create a safe file name from a string
 */
export const getSafeFileName = (fileName: string, extension: string): string => {
  const sanitized = fileName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${sanitized || "document"}.${extension}`;
};

/**
 * Create a DOCX blob from story content
 * Using a simple XML-based approach (basic DOCX structure)
 */
export const createDocxBlob = (data: {
  title: string;
  content: string;
  tag: string;
  author: string;
}): Blob => {
  const docContent = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p>
      <w:r>
        <w:rPr>
          <w:b/>
          <w:sz w:val="48"/>
        </w:rPr>
        <w:t>${escapeXml(data.title)}</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:r>
        <w:rPr>
          <w:i/>
        </w:rPr>
        <w:t>Tag: ${escapeXml(data.tag)} | Author: ${escapeXml(data.author)}</w:t>
      </w:r>
    </w:p>
    <w:p/>
    <w:p>
      <w:r>
        <w:t>${escapeXml(data.content)}</w:t>
      </w:r>
    </w:p>
  </w:body>
</w:document>`;

  return new Blob([docContent], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
};

/**
 * Escape XML special characters
 */
const escapeXml = (str: string): string => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
};
