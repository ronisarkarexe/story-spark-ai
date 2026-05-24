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

const FenwickCodeBlock = () => {
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
    javascript: `// Fenwick Tree (Binary Indexed Tree) in JavaScript
class FenwickTree {
  constructor(n) {
    this.n = n;
    this.tree = new Array(n + 1).fill(0);
  }

  // Returns prefix sum from 1 to index
  query(index) {
    let sum = 0;
    while (index > 0) {
      sum += this.tree[index];
      index -= index & -index; // subtract LSB
    }
    return sum;
  }

  // Adds val to element at index
  update(index, val) {
    while (index <= this.n) {
      this.tree[index] += val;
      index += index & -index; // add LSB
    }
  }
}
`,
    python: `# Fenwick Tree (Binary Indexed Tree) in Python
class FenwickTree:
    def __init__(self, n):
        self.n = n
        self.tree = [0] * (n + 1)

    # Returns prefix sum from 1 to index
    def query(self, index):
        s = 0
        while index > 0:
            s += self.tree[index]
            index -= index & -index  # subtract LSB
        return s

    # Adds val to element at index
    def update(self, index, val):
        while index <= self.n:
            self.tree[index] += val
            index += index & -index  # add LSB
`,
    cpp: `// Fenwick Tree (Binary Indexed Tree) in C++
#include <iostream>
#include <vector>
using namespace std;

class FenwickTree {
    vector<int> tree;
    int n;

public:
    FenwickTree(int size) {
        n = size;
        tree.resize(n + 1, 0);
    }

    // Returns sum from 1 to index
    int query(int index) {
        int sum = 0;
        while (index > 0) {
            sum += tree[index];
            index -= index & -index; // subtract LSB
        }
        return sum;
    }

    // Update index with val
    void update(int index, int val) {
        while (index <= n) {
            tree[index] += val;
            index += index & -index; // add LSB
        }
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
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Fenwick Tree Code Examples</h3>
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

export default FenwickCodeBlock;
