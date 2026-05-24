'use client';

import { useState, useRef } from 'react';
import { FaCopy, FaCheck, FaCode } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

export const highlightCode = (code, language) => {
  const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
  return hljs.highlight(code, { language: validLanguage }).value;
};

const CodeBlock = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const topRef = useRef(null);

  const languages = [
    { id: 'javascript', name: 'JavaScript' },
    { id: 'python', name: 'Python' },
    { id: 'java', name: 'Java' },
    { id: 'c', name: 'C' },
    { id: 'cpp', name: 'C++' }
  ];

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const codeExamples = {
    javascript: `// Binary Tree Node Structure
class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

// Calculate Height of a Node/Tree
function getHeight(node) {
  if (node === null) return -1; // -1 for edge count (standard)
  return 1 + Math.max(getHeight(node.left), getHeight(node.right));
}

// Calculate Depth of a target Node in a Tree
function getDepth(root, target, currentDepth = 0) {
  if (root === null) return -1;
  if (root === target) return currentDepth;
  
  let leftDepth = getDepth(root.left, target, currentDepth + 1);
  if (leftDepth !== -1) return leftDepth;
  
  return getDepth(root.right, target, currentDepth + 1);
}

// Count Leaf Nodes in a Tree
function countLeaves(node) {
  if (node === null) return 0;
  if (node.left === null && node.right === null) return 1;
  return countLeaves(node.left) + countLeaves(node.right);
}`,

    python: `# Binary Tree Node Structure
class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

# Calculate Height of a Node/Tree
def get_height(node):
    if node is None:
        return -1
    return 1 + max(get_height(node.left), get_height(node.right))

# Calculate Depth of a target Node in a Tree
def get_depth(root, target, current_depth=0):
    if root is None:
        return -1
    if root == target:
        return current_depth
    
    left_depth = get_depth(root.left, target, current_depth + 1)
    if left_depth != -1:
        return left_depth
        
    return get_depth(root.right, target, current_depth + 1)

# Count Leaf Nodes in a Tree
def count_leaves(node):
    if node is None:
        return 0
    if node.left is None and node.right is None:
        return 1
    return count_leaves(node.left) + count_leaves(node.right)`,

    java: `// Binary Tree Node Structure
class Node {
    int value;
    Node left;
    Node right;

    public Node(int value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

public class BinaryTreeProperties {
    // Calculate Height of a Node/Tree
    public static int getHeight(Node node) {
        if (node == null) return -1;
        return 1 + Math.max(getHeight(node.left), getHeight(node.right));
    }

    // Calculate Depth of a target Node in a Tree
    public static int getDepth(Node root, Node target, int currentDepth) {
        if (root == null) return -1;
        if (root == target) return currentDepth;

        int leftDepth = getDepth(root.left, target, currentDepth + 1);
        if (leftDepth != -1) return leftDepth;

        return getDepth(root.right, target, currentDepth + 1);
    }

    // Count Leaf Nodes in a Tree
    public static int countLeaves(Node node) {
        if (node == null) return 0;
        if (node.left == null && node.right == null) return 1;
        return countLeaves(node.left) + countLeaves(node.right);
    }
}`,

    c: `#include <stdio.h>
#include <stdlib.h>

// Binary Tree Node Structure
struct Node {
    int value;
    struct Node* left;
    struct Node* right;
};

// Create a new Node
struct Node* createNode(int value) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->value = value;
    newNode->left = NULL;
    newNode->right = NULL;
    return newNode;
}

// Calculate Height of a Node/Tree
int getHeight(struct Node* node) {
    if (node == NULL) return -1;
    int leftHeight = getHeight(node->left);
    int rightHeight = getHeight(node->right);
    return 1 + (leftHeight > rightHeight ? leftHeight : rightHeight);
}

// Calculate Depth of a target Node in a Tree
int getDepth(struct Node* root, struct Node* target, int currentDepth) {
    if (root == NULL) return -1;
    if (root == target) return currentDepth;

    int leftDepth = getDepth(root->left, target, currentDepth + 1);
    if (leftDepth != -1) return leftDepth;

    return getDepth(root->right, target, currentDepth + 1);
}

// Count Leaf Nodes in a Tree
int countLeaves(struct Node* node) {
    if (node == NULL) return 0;
    if (node->left == NULL && node->right == NULL) return 1;
    return countLeaves(node->left) + countLeaves(node->right);
}`,

    cpp: `#include <iostream>
#include <algorithm>

// Binary Tree Node Structure
struct Node {
    int value;
    Node* left;
    Node* right;

    Node(int val) : value(val), left(nullptr), right(nullptr) {}
};

// Calculate Height of a Node/Tree
int getHeight(Node* node) {
    if (node == nullptr) return -1;
    return 1 + std::max(getHeight(node->left), getHeight(node->right));
}

// Calculate Depth of a target Node in a Tree
int getDepth(Node* root, Node* target, int currentDepth = 0) {
    if (root == nullptr) return -1;
    if (root == target) return currentDepth;

    int leftDepth = getDepth(root->left, target, currentDepth + 1);
    if (leftDepth != -1) return leftDepth;

    return getDepth(root->right, target, currentDepth + 1);
}

// Count Leaf Nodes in a Tree
int countLeaves(Node* node) {
    if (node == nullptr) return 0;
    if (node->left == nullptr && node->right == nullptr) return 1;
    return countLeaves(node->left) + countLeaves(node->right);
}`
  };

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
              Binary Tree Operations Implementation
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
          {languages.map((lang) => (
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
                    __html: highlightCode(codeExamples[selectedLanguage], selectedLanguage) 
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
