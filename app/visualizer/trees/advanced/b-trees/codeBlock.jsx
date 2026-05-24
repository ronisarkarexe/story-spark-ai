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

const BTreeCodeBlock = () => {
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
    javascript: `// B-Tree Node Implementation in JavaScript
class BTreeNode {
  constructor(t, leaf = true) {
    this.t = t; // Minimum degree
    this.keys = []; // Array of keys
    this.C = []; // Child pointers
    this.leaf = leaf; // Is leaf boolean
  }

  // Traverses all nodes in a subtree
  traverse() {
    let i;
    for (i = 0; i < this.keys.length; i++) {
      if (!this.leaf) {
        this.C[i].traverse();
      }
      console.log(this.keys[i]);
    }
    if (!this.leaf) {
      this.C[i].traverse();
    }
  }

  // Search key in subtree
  search(k) {
    let i = 0;
    while (i < this.keys.length && k > this.keys[i]) {
      i++;
    }
    if (this.keys[i] === k) {
      return this;
    }
    if (this.leaf) {
      return null;
    }
    return this.C[i].search(k);
  }
}
`,
    python: `# B-Tree Node Implementation in Python
class BTreeNode:
    def __init__(self, t, leaf=True):
        self.t = t  # Minimum degree
        self.keys = []  # List of keys
        self.C = []  # List of child pointers
        self.leaf = leaf  # Is leaf?

    def traverse(self):
        for i in range(len(self.keys)):
            if not self.leaf:
                self.C[i].traverse()
            print(self.keys[i], end=" ")
        if not self.leaf:
            self.C[-1].traverse()

    def search(self, k):
        i = 0
        while i < len(self.keys) and k > self.keys[i]:
            i += 1
        if i < len(self.keys) and self.keys[i] == k:
            return self
        if self.leaf:
            return None
        return self.C[i].search(k)
`,
    cpp: `// B-Tree Node Implementation in C++
#include <iostream>
#include <vector>
using namespace std;

class BTreeNode {
    int *keys; // An array of keys
    int t;     // Minimum degree
    BTreeNode **C; // An array of child pointers
    int n;     // Current number of keys
    bool leaf; // True when node is leaf

public:
    BTreeNode(int _t, bool _leaf) {
        t = _t;
        leaf = _leaf;
        keys = new int[2 * t - 1];
        C = new BTreeNode *[2 * t];
        n = 0;
    }

    void traverse() {
        int i;
        for (i = 0; i < n; i++) {
            if (leaf == false)
                C[i]->traverse();
            cout << " " << keys[i];
        }
        if (leaf == false)
            C[i]->traverse();
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
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">B-Tree Code Examples</h3>
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

export default BTreeCodeBlock;
