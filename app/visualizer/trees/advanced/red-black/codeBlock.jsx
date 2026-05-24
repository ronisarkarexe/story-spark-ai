"use client";
import { useState, useRef } from "react";
import { FaCopy, FaCheck, FaCode } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import "highlight.js/styles/github-dark.css";

const highlightCode = (code, language) => {
  const validLanguage = hljs.getLanguage(language) ? language : "plaintext";
  return hljs.highlight(code, { language: validLanguage }).value;
};

const RedBlackCodeBlock = () => {
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

  const codeExamples = {
    javascript: `// Red-Black Tree Node Color Enumeration
const COLOR = {
  RED: 'RED',
  BLACK: 'BLACK'
};

class Node {
  constructor(data, color = COLOR.RED) {
    this.data = data;
    this.color = color;
    this.left = null;
    this.right = null;
    this.parent = null;
  }
}

class RedBlackTree {
  constructor() {
    this.TNULL = new Node(0, COLOR.BLACK); // leaf NIL sentinel node
    this.root = this.TNULL;
  }

  // Left rotation helper
  leftRotate(x) {
    let y = x.right;
    x.right = y.left;
    if (y.left !== this.TNULL) {
      y.left.parent = x;
    }
    y.parent = x.parent;
    if (x.parent === null) {
      this.root = y;
    } else if (x === x.parent.left) {
      x.parent.left = y;
    } else {
      x.parent.right = y;
    }
    y.left = x;
    x.parent = y;
  }

  // Right rotation helper
  rightRotate(x) {
    let y = x.left;
    x.left = y.right;
    if (y.right !== this.TNULL) {
      y.right.parent = x;
    }
    y.parent = x.parent;
    if (x.parent === null) {
      this.root = y;
    } else if (x === x.parent.right) {
      x.parent.right = y;
    } else {
      x.parent.left = y;
    }
    y.right = x;
    x.parent = y;
  }
}
`,
    python: `# Red-Black Tree Implementation in Python
class Node:
    def __init__(self, data, color="RED"):
        self.data = data
        self.color = color  # "RED" or "BLACK"
        self.left = None
        self.right = None
        self.parent = None

class RedBlackTree:
    def __init__(self):
        self.TNULL = Node(0, "BLACK")
        self.root = self.TNULL

    def left_rotate(self, x):
        y = x.right
        x.right = y.left
        if y.left != self.TNULL:
            y.left.parent = x
        y.parent = x.parent
        if x.parent is None:
            self.root = y
        elif x == x.parent.left:
            x.parent.left = y
        else:
            x.parent.right = y
        y.left = x
        x.parent = y
`,
    java: `// Red-Black Tree Implementation in Java
class Node {
    int data;
    Node left, right, parent;
    int color; // 0 for Red, 1 for Black

    public Node(int data) {
        this.data = data;
        color = 0; // RED
    }
}

public class RedBlackTree {
    private Node root;
    private Node TNULL;

    public RedBlackTree() {
        TNULL = new Node(0);
        TNULL.color = 1; // BLACK
        root = TNULL;
    }

    public void leftRotate(Node x) {
        Node y = x.right;
        x.right = y.left;
        if (y.left != TNULL) {
            y.left.parent = x;
        }
        y.parent = x.parent;
        if (x.parent == null) {
            root = y;
        } else if (x == x.parent.left) {
            x.parent.left = y;
        } else {
            x.parent.right = y;
        }
        y.left = x;
        x.parent = y;
    }
}
`,
    cpp: `// Red-Black Tree Implementation in C++
#include <iostream>
using namespace std;

enum Color { RED, BLACK };

struct Node {
    int data;
    Node *parent;
    Node *left;
    Node *right;
    Color color;
};

class RedBlackTree {
private:
    Node *root;
    Node *TNULL;

public:
    RedBlackTree() {
        TNULL = new Node;
        TNULL->color = BLACK;
        TNULL->left = nullptr;
        TNULL->right = nullptr;
        root = TNULL;
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
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Red-Black Tree Code</h3>
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

export default RedBlackCodeBlock;
