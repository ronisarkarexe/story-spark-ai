"use client";
import { useState, useRef } from "react";
import { FaCopy, FaCheck, FaCode } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import "highlight.js/styles/github-dark.css";

export const highlightCode = (code, language) => {
  const validLanguage = hljs.getLanguage(language) ? language : "plaintext";
  return hljs.highlight(code, { language: validLanguage }).value;
};

const TrieCodeBlock = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const topRef = useRef(null);

  const languages = [
    { id: "javascript", name: "JavaScript" },
    { id: "python", name: "Python" },
    { id: "java", name: "Java" },
    { id: "c", name: "C" },
    { id: "cpp", name: "C++" }
  ];

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const codeExamples = {
    javascript: `// Trie Node Definition
class TrieNode {
  constructor() {
    this.children = {}; // Map: character -> TrieNode
    this.isEndOfWord = false;
  }
}

// Trie (Prefix Tree) Implementation
class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  // Inserts a word into the trie
  insert(word) {
    let node = this.root;
    for (let char of word) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    node.isEndOfWord = true;
  }

  // Returns if the word is in the trie
  search(word) {
    let node = this.root;
    for (let char of word) {
      if (!node.children[char]) {
        return false;
      }
      node = node.children[char];
    }
    return node.isEndOfWord;
  }

  // Returns if there is any word in the trie that starts with the given prefix
  startsWith(prefix) {
    let node = this.root;
    for (let char of prefix) {
      if (!node.children[char]) {
        return false;
      }
      node = node.children[char];
    }
    return true;
  }
}

// Usage Example
const trie = new Trie();
trie.insert("apple");
console.log(trie.search("apple"));   // true
console.log(trie.search("app"));     // false (prefix only)
console.log(trie.startsWith("app")); // true
`,

    python: `# Trie Node Definition
class TrieNode:
    def __init__(self):
        self.children = {}  # dict: char -> TrieNode
        self.is_end_of_word = False

# Trie (Prefix Tree) Implementation
class Trie:
    def __init__(self):
        self.root = TrieNode()

    # Inserts a word into the trie
    def insert(self, word: str) -> None:
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end_of_word = True

    # Returns if the word is in the trie
    def search(self, word: str) -> bool:
        node = self.root
        for char in word:
            if char not in node.children:
                return False
            node = node.children[char]
        return node.is_end_of_word

    # Returns if there is any word in the trie that starts with the given prefix
    def starts_with(self, prefix: str) -> bool:
        node = self.root
        for char in prefix:
            if char not in node.children:
                return False
            node = node.children[char]
        return True

# Usage Example
trie = Trie()
trie.insert("apple")
print(trie.search("apple"))      # True
print(trie.search("app"))        # False (prefix only)
print(trie.starts_with("app"))   # True
`,

    java: `// Trie Node Definition
class TrieNode {
    TrieNode[] children;
    boolean isEndOfWord;

    public TrieNode() {
        children = new TrieNode[26]; // for 26 lowercase English letters
        isEndOfWord = false;
    }
}

// Trie (Prefix Tree) Implementation
public class Trie {
    private TrieNode root;

    public Trie() {
        root = new TrieNode();
    }

    // Inserts a word into the trie
    public void insert(String word) {
        TrieNode node = root;
        for (int i = 0; i < word.length(); i++) {
            int index = word.charAt(i) - 'a';
            if (node.children[index] == null) {
                node.children[index] = new TrieNode();
            }
            node = node.children[index];
        }
        node.isEndOfWord = true;
    }

    // Returns if the word is in the trie
    public boolean search(String word) {
        TrieNode node = root;
        for (int i = 0; i < word.length(); i++) {
            int index = word.charAt(i) - 'a';
            if (node.children[index] == null) {
                return false;
            }
            node = node.children[index];
        }
        return node.isEndOfWord;
    }

    // Returns if there is any word in the trie that starts with the given prefix
    public boolean startsWith(String prefix) {
        TrieNode node = root;
        for (int i = 0; i < prefix.length(); i++) {
            int index = prefix.charAt(i) - 'a';
            if (node.children[index] == null) {
                return false;
            }
            node = node.children[index];
        }
        return true;
    }

    public static void main(String[] args) {
        Trie trie = new Trie();
        trie.insert("apple");
        System.out.println(trie.search("apple"));   // true
        System.out.println(trie.search("app"));     // false (prefix only)
        System.out.println(trie.startsWith("app")); // true
    }
}
`,

    c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

// Trie Node Definition
typedef struct TrieNode {
    struct TrieNode* children[26];
    bool isEndOfWord;
} TrieNode;

// Helper to create a new Trie node
TrieNode* createNode() {
    TrieNode* node = (TrieNode*)malloc(sizeof(TrieNode));
    node->isEndOfWord = false;
    for (int i = 0; i < 26; i++) {
        node->children[i] = NULL;
    }
    return node;
}

// Inserts a word into the trie
void insert(TrieNode* root, const char* word) {
    TrieNode* node = root;
    for (int i = 0; word[i] != '\\0'; i++) {
        int index = word[i] - 'a';
        if (node->children[index] == NULL) {
            node->children[index] = createNode();
        }
        node = node->children[index];
    }
    node->isEndOfWord = true;
}

// Returns if the word is in the trie
bool search(TrieNode* root, const char* word) {
    TrieNode* node = root;
    for (int i = 0; word[i] != '\\0'; i++) {
        int index = word[i] - 'a';
        if (node->children[index] == NULL) {
            return false;
        }
        node = node->children[index];
    }
    return node != NULL && node->isEndOfWord;
}

// Returns if there is any word in the trie that starts with the prefix
bool startsWith(TrieNode* root, const char* prefix) {
    TrieNode* node = root;
    for (int i = 0; prefix[i] != '\\0'; i++) {
        int index = prefix[i] - 'a';
        if (node->children[index] == NULL) {
            return false;
        }
        node = node->children[index];
    }
    return node != NULL;
}

int main() {
    TrieNode* root = createNode();
    insert(root, "apple");
    printf("%d\\n", search(root, "apple"));   // 1 (true)
    printf("%d\\n", search(root, "app"));     // 0 (false)
    printf("%d\\n", startsWith(root, "app")); // 1 (true)
    return 0;
}
`,

    cpp: `#include <iostream>
#include <unordered_map>
#include <string>
using namespace std;

// Trie Node Definition
class TrieNode {
public:
    unordered_map<char, TrieNode*> children;
    bool isEndOfWord;

    TrieNode() {
        isEndOfWord = false;
    }
};

// Trie (Prefix Tree) Implementation
class Trie {
private:
    TrieNode* root;

public:
    Trie() {
        root = new TrieNode();
    }

    // Inserts a word into the trie
    void insert(string word) {
        TrieNode* node = root;
        for (char c : word) {
            if (node->children.find(c) == node->children.end()) {
                node->children[c] = new TrieNode();
            }
            node = node->children[c];
        }
        node->isEndOfWord = true;
    }

    // Returns if the word is in the trie
    bool search(string word) {
        TrieNode* node = root;
        for (char c : word) {
            if (node->children.find(c) == node->children.end()) {
                return false;
            }
            node = node->children[c];
        }
        return node->isEndOfWord;
    }

    // Returns if there is any word in the trie that starts with the given prefix
    bool startsWith(string prefix) {
        TrieNode* node = root;
        for (char c : prefix) {
            if (node->children.find(c) == node->children.end()) {
                return false;
            }
            node = node->children[c];
        }
        return true;
    }
};

int main() {
    Trie trie;
    trie.insert("apple");
    cout << boolalpha;
    cout << trie.search("apple") << endl;   // true
    cout << trie.search("app") << endl;     // false (prefix only)
    cout << trie.startsWith("app") << endl; // true
    return 0;
}
`
  };

  return (
    <div
      className="max-w-4xl mx-auto mt-8"
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
            <FaCode className="text-purple-500 mr-2 text-lg" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Trie Implementation
            </h3>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => copyToClipboard(codeExamples[selectedLanguage])}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-605 transition-colors text-gray-800 dark:text-gray-100 text-sm font-medium"
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
                  ? "bg-purple-600 text-white shadow-md shadow-purple-900"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
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

          {/* Language indicator */}
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

export default TrieCodeBlock;
