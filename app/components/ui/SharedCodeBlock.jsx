"use client";
import { useState, useRef } from "react";
import { FaCopy, FaCheck, FaCode } from "react-icons/fa";
import { motion } from "framer-motion";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import "highlight.js/styles/github-dark.css";

const highlightCode = (code, language) => {
  const validLanguage = hljs.getLanguage(language) ? language : "plaintext";
  return hljs.highlight(code, { language: validLanguage }).value;
};

// color is the tailwind text color class, e.g., "text-purple-500"
const SharedCodeBlock = ({ title, codeExamples, color = "text-purple-500" }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [copied, setCopied] = useState(false);
  const topRef = useRef(null);

  const languages = [
    { id: "javascript", name: "JavaScript" },
    { id: "python", name: "Python" },
    { id: "java", name: "Java" },
    { id: "cpp", name: "C++" }
  ];

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  // Convert "text-purple-500" into a bg class for the active tab (e.g. "bg-purple-600")
  // Default to bg-purple-600 if extraction fails
  const colorMatch = color.match(/text-([a-z]+)-(\d+)/);
  const bgActive = colorMatch ? `bg-${colorMatch[1]}-600` : "bg-purple-600";

  return (
    <div className="max-w-4xl mx-auto mt-8 mb-8" ref={topRef}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-neutral-950 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
      >
        <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-neutral-950 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <FaCode className={`${color} mr-2 text-lg`} />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h3>
          </div>
          <button
            onClick={() => copyToClipboard(codeExamples[selectedLanguage])}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors rounded-lg text-sm text-gray-800 dark:text-gray-100"
          >
            {copied ? <FaCheck className="text-green-500" /> : <FaCopy />}
            {copied ? "Copied" : "Copy Code"}
          </button>
        </div>

        <div className="px-4 pt-3 pb-2 flex gap-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-neutral-950">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setSelectedLanguage(lang.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                selectedLanguage === lang.id ? `${bgActive} text-white shadow-sm` : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>

        <div className="p-4 bg-gray-900 overflow-x-auto">
          <pre className="text-sm font-mono text-gray-100">
            <code
              className={`language-${selectedLanguage}`}
              dangerouslySetInnerHTML={{
                __html: highlightCode(codeExamples[selectedLanguage], selectedLanguage)
              }}
            />
          </pre>
        </div>
      </motion.div>
    </div>
  );
};

export default SharedCodeBlock;
