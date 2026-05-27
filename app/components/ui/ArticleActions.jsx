"use client";
import { useState } from "react";
import { Copy, Share2, Check } from "lucide-react";

export default function ArticleActions() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Share failed: ", err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="flex gap-4 mt-6">
      <button
        onClick={handleCopy}
        className="flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-600" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
        <span>{copied ? "Copied!" : "Copy Link"}</span>
      </button>
      <button
        onClick={handleShare}
        className="flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      >
        <Share2 className="w-4 h-4" />
        <span>Share</span>
      </button>
    </div>
  );
}