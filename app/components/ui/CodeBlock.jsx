'use client';
import { useState, useRef } from 'react';
import { FaCopy, FaCheck, FaCode } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import 'highlight.js/styles/github.css';
import 'highlight.js/styles/github-dark.css';

export const highlightCode = (code, language) => {
  const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
  return hljs.highlight(code, { language: validLanguage }).value;
};

const LANGUAGES = [
  { id: 'javascript', name: 'JavaScript' },
  { id: 'python', name: 'Python' },
  { id: 'java', name: 'Java' },
  { id: 'c', name: 'C' },
  { id: 'cpp', name: 'C++' },
];

/* ─── Small helper — traffic-light dot with hover tooltip (macOS variant) ─── */
const TrafficDot = ({ color, hoverTitle }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      title={hoverTitle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '13px',
        height: '13px',
        borderRadius: '50%',
        background: color,
        cursor: 'default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'filter 0.15s',
        filter: hovered ? 'brightness(0.85)' : 'none',
        boxShadow: `0 0 0 0.5px rgba(0,0,0,0.25) inset`,
      }}
    />
  );
};

/**
 * Shared code-block component used across all visualizer pages.
 *
 * @param {Object}  props
 * @param {'macos'|'standard'} [props.variant='standard'] — visual style
 * @param {string}  [props.title]        — heading text (standard variant)
 * @param {Object}  props.codeExamples   — { javascript: `...`, python: `...`, … }
 * @param {Object}  [props.fileNames]    — { javascript: 'file.js', … } (macOS variant)
 */
const CodeBlock = ({ variant = 'standard', title, codeExamples, fileNames }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const topRef = useRef(null);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  /* ═══════════════════════════ macOS variant ═══════════════════════════ */
  if (variant === 'macos') {
    return (
      <div className="max-w-4xl mx-auto" ref={topRef}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow:
              '0 20px 60px rgba(0,0,0,0.35), 0 4px 16px rgba(0,0,0,0.2)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {/* ── macOS Title Bar ── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '11px 16px',
              background: 'linear-gradient(180deg, #3a3a3c 0%, #2d2d2f 100%)',
              borderBottom: '1px solid #1a1a1c',
              userSelect: 'none',
            }}
          >
            {/* Traffic-light buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrafficDot color="#ff5f57" hoverTitle="Close" />
              <TrafficDot color="#febc2e" hoverTitle="Minimize" />
              <TrafficDot color="#28c840" hoverTitle="Maximize" />
            </div>

            {/* Centred filename */}
            <span
              style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '13px',
                fontFamily: "'SF Pro Text', 'Helvetica Neue', sans-serif",
                fontWeight: 500,
                color: '#c8c8cc',
                letterSpacing: '0.01em',
                pointerEvents: 'none',
              }}
            >
              {fileNames?.[selectedLanguage] ?? ''}
            </span>

            {/* Copy button */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => copyToClipboard(codeExamples[selectedLanguage])}
              aria-label="Copy code"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.07)',
                color: copied ? '#30d158' : '#c8c8cc',
                fontSize: '12px',
                fontFamily: "'SF Pro Text', 'Helvetica Neue', sans-serif",
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                backdropFilter: 'blur(6px)',
              }}
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.span
                    key="check"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                  >
                    {/* checkmark */}
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="#30d158" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Copied!
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                  >
                    {/* clipboard icon */}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <rect x="9" y="2" width="10" height="14" rx="2" stroke="#c8c8cc" strokeWidth="2" />
                      <path d="M5 6H4a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1" stroke="#c8c8cc" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Copy Code
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* ── Language tab bar ── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              padding: '0 16px',
              background: '#1e1e20',
              borderBottom: '1px solid #111113',
              overflowX: 'auto',
            }}
          >
            {LANGUAGES.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setSelectedLanguage(lang.id)}
                style={{
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontFamily: "'SF Pro Text', 'Helvetica Neue', sans-serif",
                  fontWeight: 500,
                  cursor: 'pointer',
                  border: 'none',
                  borderBottom: selectedLanguage === lang.id
                    ? '2px solid #007aff'
                    : '2px solid transparent',
                  background: 'transparent',
                  color: selectedLanguage === lang.id ? '#ffffff' : '#8e8e93',
                  transition: 'color 0.15s, border-color 0.15s',
                  whiteSpace: 'nowrap',
                }}
              >
                {lang.name}
              </button>
            ))}
          </div>

          {/* ── Code body ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedLanguage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="hljs-force-dark"
              style={{
                background: '#282c34',
                overflowX: 'auto',
                padding: '20px 24px 24px',
              }}
            >
              {/* line-number gutter + code */}
              <pre
                style={{
                  margin: 0,
                  fontFamily: "'JetBrains Mono', 'Fira Mono', 'SF Mono', 'Menlo', monospace",
                  fontSize: '13.5px',
                  lineHeight: '1.8',
                  display: 'flex',
                  gap: '20px',
                }}
              >
                {/* gutter */}
                <span
                  aria-hidden="true"
                  style={{
                    display: 'block',
                    textAlign: 'right',
                    color: '#636d83',
                    userSelect: 'none',
                    minWidth: '32px',
                    flexShrink: 0,
                    lineHeight: '1.8',
                    fontFamily: "'JetBrains Mono', 'Fira Mono', 'SF Mono', 'Menlo', monospace",
                    fontSize: '13.5px',
                  }}
                >
                  {codeExamples[selectedLanguage]
                    .split('\n')
                    .map((_, i) => (
                      <span key={i} style={{ display: 'block' }}>
                        {i + 1}
                      </span>
                    ))}
                </span>

                {/* highlighted code */}
                <code
                  className={`language-${selectedLanguage}`}
                  style={{
                    flex: 1,
                    fontFamily: "'JetBrains Mono', 'Fira Mono', 'SF Mono', 'Menlo', monospace",
                    fontSize: '13.5px',
                    lineHeight: '1.8',
                    background: 'transparent',
                    padding: 0,
                    whiteSpace: 'pre',
                  }}
                  dangerouslySetInnerHTML={{
                    __html: highlightCode(codeExamples[selectedLanguage], selectedLanguage),
                  }}
                />
              </pre>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  /* ═══════════════════════════ standard variant ═══════════════════════════ */
  return (
    <div
      className="max-w-4xl mx-auto"
      ref={topRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-neutral-950 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors duration-300"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50 dark:bg-neutral-950 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-2 sm:mb-0">
            <FaCode className="text-blue-500 mr-2 text-lg" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              {title}
            </h3>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => copyToClipboard(codeExamples[selectedLanguage])}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors text-gray-800 dark:text-gray-100 text-sm font-medium"
            aria-label="Copy code"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span
                  key="check"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center text-green-600 dark:text-green-400"
                >
                  <FaCheck className="mr-1" /> Copied
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center"
                >
                  <FaCopy className="mr-1" /> Copy Code
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Language Selector */}
        <div className="px-4 pt-3 pb-2 flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700">
          {LANGUAGES.map((lang) => (
            <motion.button
              key={lang.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedLanguage(lang.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedLanguage === lang.id
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {lang.name}
            </motion.button>
          ))}
        </div>

        {/* Code Block */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedLanguage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-x-auto p-4 bg-gray-900 text-white"
            >
              <pre className="text-sm leading-relaxed">
                <code
                  className={`language-${selectedLanguage}`}
                  dangerouslySetInnerHTML={{
                    __html: highlightCode(codeExamples[selectedLanguage], selectedLanguage),
                  }}
                />
              </pre>
            </motion.div>
          </AnimatePresence>

          {/* Language indicator (shown on hover) */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-3 right-3 px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-md"
              >
                {selectedLanguage.toUpperCase()}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default CodeBlock;
