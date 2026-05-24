"use client";
import { useState, useRef } from "react";
import { FaCode } from "react-icons/fa";
import { motion } from "framer-motion";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import "highlight.js/styles/github-dark.css";

const highlightCode = (code, language) => {
  const validLanguage = hljs.getLanguage(language) ? language : "plaintext";
  return hljs.highlight(code, { language: validLanguage }).value;
};

const SegmentCodeBlock = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [copied, setCopied] = useState(false);
  const topRef = useRef(null);

  const languages = [
    { id: "javascript", name: "JavaScript" },
    { id: "python", name: "Python" },
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

  const codeExamples = {
    javascript: `// Segment Tree Implementation in JavaScript (Range Sum Query)
class SegmentTree {
  constructor(arr) {
    this.n = arr.length;
    this.tree = new Array(4 * this.n).fill(0);
    if (this.n > 0) {
      this.build(arr, 0, 0, this.n - 1);
    }
  }

  // Build the segment tree
  build(arr, node, start, end) {
    if (start === end) {
      this.tree[node] = arr[start];
      return;
    }
    let mid = Math.floor((start + end) / 2);
    this.build(arr, 2 * node + 1, start, mid);
    this.build(arr, 2 * node + 2, mid + 1, end);
    this.tree[node] = this.tree[2 * node + 1] + this.tree[2 * node + 2];
  }

  // Query a range sum [L, R]
  query(node, start, end, l, r) {
    if (r < start || end < l) {
      return 0; // completely outside
    }
    if (l <= start && end <= r) {
      return this.tree[node]; // completely inside
    }
    let mid = Math.floor((start + end) / 2);
    let leftSum = this.query(2 * node + 1, start, mid, l, r);
    let rightSum = this.query(2 * node + 2, mid + 1, end, l, r);
    return leftSum + rightSum;
  }
}
`,
    python: `# Segment Tree Implementation in Python
class SegmentTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.tree = [0] * (4 * self.n)
        if self.n > 0:
            self.build(arr, 0, 0, self.n - 1)

    def build(self, arr, node, start, end):
        if start == end:
            self.tree[node] = arr[start]
            return
        mid = (start + end) // 2
        self.build(arr, 2 * node + 1, start, mid)
        self.build(arr, 2 * node + 2, mid + 1, end)
        self.tree[node] = self.tree[2 * node + 1] + self.tree[2 * node + 2]

    def query(self, node, start, end, l, r):
        if r < start or end < l:
            return 0
        if l <= start and end <= r:
            return self.tree[node]
        mid = (start + end) // 2
        p1 = self.query(2 * node + 1, start, mid, l, r)
        p2 = self.query(2 * node + 2, mid + 1, end, l, r)
        return p1 + p2
`,
    cpp: `// Segment Tree Implementation in C++
#include <iostream>
#include <vector>
using namespace std;

class SegmentTree {
    vector<int> tree;
    int n;

public:
    SegmentTree(const vector<int>& arr) {
        n = arr.size();
        tree.resize(4 * n, 0);
        if (n > 0) {
            build(arr, 0, 0, n - 1);
        }
    }

    void build(const vector<int>& arr, int node, int start, int end) {
        if (start == end) {
            tree[node] = arr[start];
            return;
        }
        int mid = (start + end) / 2;
        build(arr, 2 * node + 1, start, mid);
        build(arr, 2 * node + 2, mid + 1, end);
        tree[node] = tree[2 * node + 1] + tree[2 * node + 2];
    }
};
`
  };

  return (
    <div className="max-w-4xl mx-auto mt-8" ref={topRef}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-neutral-950 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
      >
        <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-neutral-950 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <FaCode className="text-purple-500 mr-2 text-lg" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Segment Tree Code Examples</h3>
          </div>
          <button
            onClick={() => copyToClipboard(codeExamples[selectedLanguage])}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-800 dark:text-gray-100"
          >
            {copied ? "Copied" : "Copy Code"}
          </button>
        </div>

        <div className="px-4 pt-3 pb-2 flex gap-2 border-b border-gray-200 dark:border-gray-700">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setSelectedLanguage(lang.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                selectedLanguage === lang.id ? "bg-purple-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>

        <div className="p-4 bg-gray-900 overflow-x-auto">
          <pre className="text-sm">
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

export default SegmentCodeBlock;
