import React, { useEffect, useRef, useState } from "react";
import { Chapter } from "../../types/story.types";
import ReadingTimeBadge from "../ReadingTimeBadge";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import JSZip from "jszip";
import { AudioPlayer } from "../AudioPlayer";

interface Props {
  chapters: Chapter[];
  storyId: string;
  truncated?: boolean;
}

const StoryViewer: React.FC<Props> = ({ chapters, storyId, truncated }) => {
  const [progress, setProgress] = useState(0);
  const [showResumeBanner, setShowResumeBanner] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const storageKey = `story-progress-${storyId}`;

  // Custom formatting states
  const [fontFamily, setFontFamily] = useState<"helvetica" | "times" | "courier">("helvetica");
  const [fontSize, setFontSize] = useState<number>(11);
  const [lineHeight, setLineHeight] = useState<number>(1.5);
  const [themeStyle, setThemeStyle] = useState<"standard" | "classic" | "modern">("standard");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const savedProgress = localStorage.getItem(storageKey);
    if (savedProgress) {
      const progressValue = Number(savedProgress);
      setProgress(progressValue);
      if (progressValue > 0 && progressValue < 100) {
        setShowResumeBanner(true);
      }
    }
  }, [storageKey]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const maxScroll = container.scrollHeight - container.clientHeight;
      if (maxScroll <= 0) return;
      const currentProgress = (container.scrollTop / maxScroll) * 100;
      const rounded = Math.min(100, Math.max(0, Math.round(currentProgress)));
      setProgress(rounded);
      localStorage.setItem(storageKey, rounded.toString());
      if (rounded === 100) {
        localStorage.removeItem(storageKey);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [storageKey]);

  const handleResume = () => {
    const container = containerRef.current;
    if (!container) return;
    const savedProgress = localStorage.getItem(storageKey);
    if (savedProgress) {
      const progressValue = Number(savedProgress);
      const maxScroll = container.scrollHeight - container.clientHeight;
      container.scrollTo({
        top: (progressValue / 100) * maxScroll,
        behavior: "smooth",
      });
    }
    setShowResumeBanner(false);
  };

  const handleExportPDF = () => {
    if (!chapters || chapters.length === 0) {
      toast.error("No story content to export.");
      return;
    }

    try {
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const leftMargin = 20;
      const printableWidth = 170;
      let yCursor = 25;
      const maxY = 280;

      const storyTitle = chapters[0]?.title || "Untitled Story";

      // Apply primary layout theme styles for header
      doc.setFont(fontFamily, "bold");
      doc.setFontSize(fontSize + 7);
      if (themeStyle === "classic") {
        doc.setTextColor(120, 20, 20); // Deep red
      } else if (themeStyle === "modern") {
        doc.setTextColor(79, 70, 229); // Indigo
      } else {
        doc.setTextColor(30, 41, 59); // Standard Slate
      }

      const titleLines = doc.splitTextToSize(storyTitle, printableWidth);
      titleLines.forEach((line: string) => {
        doc.text(line, leftMargin, yCursor);
        yCursor += (fontSize / 2) + 4;
      });
      yCursor += 4;

      doc.setDrawColor(99, 102, 241);
      doc.setLineWidth(0.5);
      doc.line(leftMargin, yCursor, 190, yCursor);
      yCursor += 10;

      chapters.forEach((chapter, idx) => {
        if (yCursor > maxY - 20) {
          doc.addPage();
          yCursor = 25;
        }
        doc.setFont(fontFamily, "bold");
        doc.setFontSize(fontSize + 3);
        const chTitleLines = doc.splitTextToSize(chapter.title || `Chapter ${idx + 1}`, printableWidth);
        chTitleLines.forEach((line: string) => {
          if (yCursor > maxY) { doc.addPage(); yCursor = 25; }
          doc.text(line, leftMargin, yCursor);
          yCursor += (fontSize / 2) + 3;
        });
        yCursor += 3;

        doc.setFont(fontFamily, "normal");
        doc.setFontSize(fontSize);
        doc.setTextColor(51, 65, 85);
        const paragraphs = (chapter.content || "").split(/\n+/);
        paragraphs.forEach((para: string) => {
          const clean = para.trim();
          if (!clean) return;
          const lines = doc.splitTextToSize(clean, printableWidth);
          lines.forEach((line: string) => {
            if (yCursor > maxY) { doc.addPage(); yCursor = 25; }
            doc.text(line, leftMargin, yCursor);
            yCursor += (fontSize * lineHeight) / 2.2;
          });
          yCursor += 4;
        });
        yCursor += 6;
      });

      // Page numbers
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFont(fontFamily, "normal");
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text("StorySparkAI", leftMargin, 285);
        doc.text(`Page ${i} of ${totalPages}`, 190, 285, { align: "right" });
      }

      const safeName = storyTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "story";
      doc.save(`${safeName}.pdf`);
      toast.success("PDF downloaded with custom styles!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to export PDF.");
    }
  };

  const handleExportEPUB = async () => {
    if (!chapters || chapters.length === 0) {
      toast.error("No story content to export.");
      return;
    }

    try {
      const zip = new JSZip();
      const storyTitle = chapters[0]?.title || "Untitled Story";
      const safeName = storyTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "story";

      // 1. mimetype (MUST be first and uncompressed)
      zip.file("mimetype", "application/epub+zip", { compression: "STORE" });

      // 2. container.xml
      zip.folder("META-INF")?.file(
        "container.xml",
        `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`
      );

      // 3. Stylesheet (Formatting settings dynamically converted to CSS)
      const fontStack = fontFamily === "serif" || fontFamily === "times" ? "Times New Roman, Times, serif" : fontFamily === "courier" ? "Courier New, Courier, monospace" : "Helvetica, Arial, sans-serif";
      const cssContent = `
body {
  font-family: ${fontStack};
  font-size: ${fontSize}pt;
  line-height: ${lineHeight};
  margin: 10%;
  color: #334155;
  background-color: #ffffff;
}
h1 {
  font-size: 1.6em;
  color: ${themeStyle === "classic" ? "#781414" : themeStyle === "modern" ? "#4f46e5" : "#1e293b"};
  text-align: center;
  margin-bottom: 1em;
}
p {
  margin-bottom: 1.2em;
  text-indent: 1em;
}
`;

      zip.folder("OEBPS")?.file("stylesheet.css", cssContent);

      // 4. Chapters content
      let contentOpfManifest = "";
      let contentOpfSpine = "";
      let ncxNavPoints = "";

      chapters.forEach((chapter, idx) => {
        const id = `chapter-${idx + 1}`;
        const fileName = `${id}.xhtml`;
        const title = chapter.title || `Chapter ${idx + 1}`;

        const paragraphsHtml = (chapter.content || "")
          .split(/\n+/)
          .map((para) => `<p>${para.trim()}</p>`)
          .join("\n");

        const htmlContent = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>${title}</title>
  <link rel="stylesheet" href="stylesheet.css" type="text/css"/>
</head>
<body>
  <h1>${title}</h1>
  ${paragraphsHtml}
</body>
</html>`;

        zip.folder("OEBPS")?.file(fileName, htmlContent);

        // Manifest & Spine & NCX definitions
        contentOpfManifest += `    <item id="${id}" href="${fileName}" media-type="application/xhtml+xml"/>\n`;
        contentOpfSpine += `    <itemref idref="${id}"/>\n`;
        ncxNavPoints += `    <navPoint id="${id}" playOrder="${idx + 1}">
      <navLabel><text>${title}</text></navLabel>
      <content src="${fileName}"/>
    </navPoint>\n`;
      });

      // 5. content.opf metadata description
      const contentOpf = `<?xml version="1.0" encoding="utf-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="bookid" version="2.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:title>${storyTitle}</dc:title>
    <dc:creator>StorySparkAI</dc:creator>
    <dc:identifier id="bookid">urn:uuid:${storyId}</dc:identifier>
    <dc:language>en</dc:language>
  </metadata>
  <manifest>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
    <item id="css" href="stylesheet.css" media-type="text/css"/>
${contentOpfManifest}  </manifest>
  <spine toc="ncx">
${contentOpfSpine}  </spine>
</package>`;

      zip.folder("OEBPS")?.file("content.opf", contentOpf);

      // 6. toc.ncx Table of Contents
      const tocNcx = `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="urn:uuid:${storyId}"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  <docTitle><text>${storyTitle}</text></docTitle>
  <navMap>
${ncxNavPoints}  </navMap>
</ncx>`;

      zip.folder("OEBPS")?.file("toc.ncx", tocNcx);

      // Trigger ZIP blob download
      const blob = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${safeName}.epub`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("EPUB downloaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate EPUB file.");
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-8 py-10 bg-zinc-950"
    >
      {truncated && (
        <div className="sticky top-0 z-30 bg-yellow-900/90 backdrop-blur-md rounded-lg p-3 mb-4 flex justify-between items-center">
          <span className="text-sm text-yellow-200">
            Your story was truncated because it exceeded the maximum length. Try a shorter prompt.
          </span>
        </div>
      )}
      {showResumeBanner && (
        <div className="sticky top-0 z-20 bg-indigo-900/90 backdrop-blur-md rounded-lg p-3 mb-4 flex justify-between items-center">
          <span className="text-sm text-indigo-200">
            You left off at {progress}% – continue where you stopped?
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleResume}
              className="px-3 py-1 bg-indigo-500 hover:bg-indigo-600 text-white text-sm rounded-md transition-colors"
            >
              Continue Reading
            </button>
            <button
              onClick={() => setShowResumeBanner(false)}
              className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 text-white text-sm rounded-md transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Control Panel for Formatting Settings */}
      <div className="sticky top-0 z-10 bg-zinc-950/90 backdrop-blur-md rounded-lg p-4 mb-8 border border-zinc-800">
        <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-2 mb-4">
          <span className="text-sm text-zinc-400">Reading Progress</span>
          <span className="text-sm font-medium text-indigo-400">{progress}%</span>
        </div>

        {/* Dynamic Typography Controls */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-3 border-t border-b border-zinc-800 mb-4">
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Font Family</label>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value as any)}
              className="w-full text-xs bg-zinc-900 border border-zinc-800 text-white rounded p-1"
            >
              <option value="helvetica">Sans-Serif</option>
              <option value="times">Serif (Times)</option>
              <option value="courier">Monospace</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-zinc-400 mb-1">Text Size</label>
            <select
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full text-xs bg-zinc-900 border border-zinc-800 text-white rounded p-1"
            >
              <option value={9}>Small (9pt)</option>
              <option value={11}>Normal (11pt)</option>
              <option value={14}>Large (14pt)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-zinc-400 mb-1">Line Height</label>
            <select
              value={lineHeight}
              onChange={(e) => setLineHeight(Number(e.target.value))}
              className="w-full text-xs bg-zinc-900 border border-zinc-800 text-white rounded p-1"
            >
              <option value={1.2}>Tight (1.2)</option>
              <option value={1.5}>Medium (1.5)</option>
              <option value={2.0}>Loose (2.0)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-zinc-400 mb-1">Theme Style</label>
            <select
              value={themeStyle}
              onChange={(e) => setThemeStyle(e.target.value as any)}
              className="w-full text-xs bg-zinc-900 border border-zinc-800 text-white rounded p-1"
            >
              <option value="standard">Standard</option>
              <option value="classic">Classic</option>
              <option value="modern">Modern</option>
            </select>
          </div>
        </div>

        {/* Action Export Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleExportPDF}
            className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            📄 Export Custom PDF
          </button>
          <button
            onClick={handleExportEPUB}
            className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            📚 Export EPUB Book
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {chapters.map((chapter) => (
          <div key={chapter.id} className="mb-16">
            <h1 className="text-4xl font-extrabold tracking-tight text-white mb-6">
              {chapter.title}
            </h1>
            <ReadingTimeBadge text={chapter.content} />
            <p className="text-lg text-zinc-300 whitespace-pre-line leading-9">
              {chapter.content}
            </p>
            <hr className="border-zinc-800 mt-10" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoryViewer;