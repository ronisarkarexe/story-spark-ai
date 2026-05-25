'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

// Helper to syntax-highlight code
export const highlightCode = (code, language) => {
  const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
  return hljs.highlight(code, { language: validLanguage }).value;
};

// The red / yellow / green dots in the title bar
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
        boxShadow: '0 0 0 0.5px rgba(0,0,0,0.25) inset',
      }}
    />
  );
};

/**
 * AppleCodeBlock — reusable macOS-style code editor component.
 *
 * Props:
 *   codeExamples  — object  { javascript: '...', python: '...', java: '...', c: '...', cpp: '...' }
 *   fileNames     — object  { javascript: 'linearSearch.js', python: 'linear_search.py', ... }
 *   languages     — array   [{ id: 'javascript', name: 'JavaScript' }, ...]  (optional, defaults to JS/Py/Java/C/C++)
 */
const AppleCodeBlock = ({ codeExamples, fileNames, languages }) => {
  const defaultLanguages = [
    { id: 'javascript', name: 'JavaScript' },
    { id: 'python', name: 'Python' },
    { id: 'java', name: 'Java' },
    { id: 'c', name: 'C' },
    { id: 'cpp', name: 'C++' },
  ];

  const tabs = languages || defaultLanguages;
  const [selectedLanguage, setSelectedLanguage] = useState(tabs[0].id);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.35), 0 4px 16px rgba(0,0,0,0.2)',
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
            position: 'relative',
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
            {fileNames[selectedLanguage]}
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
          {tabs.map((lang) => (
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
                borderBottom:
                  selectedLanguage === lang.id
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
            style={{
              background: '#282c34',
              overflowX: 'auto',
              padding: '20px 24px 24px',
            }}
          >
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
              {/* Line number gutter */}
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

              {/* Syntax-highlighted code */}
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
};

export default AppleCodeBlock;