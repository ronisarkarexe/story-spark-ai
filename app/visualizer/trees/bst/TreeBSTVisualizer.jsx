"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "@/app/components/navbarinner";
import Footer from "@/app/components/footer";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Info,
  Layers,
  BookOpen,
  Award,
  CheckCircle,
  AlertCircle,
  Sparkles
} from "lucide-react";

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

// functional BST insertion
const insertNodeFunctional = (node, value) => {
  if (!node) return new TreeNode(value);
  if (value < node.value) {
    return { ...node, left: insertNodeFunctional(node.left, value) };
  } else if (value > node.value) {
    return { ...node, right: insertNodeFunctional(node.right, value) };
  }
  return node;
};

// functional BST deletion
const deleteNodeFunctional = (node, value) => {
  if (!node) return null;
  if (value < node.value) {
    return { ...node, left: deleteNodeFunctional(node.left, value) };
  } else if (value > node.value) {
    return { ...node, right: deleteNodeFunctional(node.right, value) };
  } else {
    if (!node.left) return node.right;
    if (!node.right) return node.left;

    let succ = node.right;
    while (succ.left) {
      succ = succ.left;
    }
    const updatedNode = { ...node, value: succ.value };
    updatedNode.right = deleteNodeFunctional(node.right, succ.value);
    return updatedNode;
  }
};

const hasDuplicate = (node, value) => {
  if (!node) return false;
  if (value === node.value) return true;
  if (value < node.value) return hasDuplicate(node.left, value);
  return hasDuplicate(node.right, value);
};

const pseudocode = {
  searching: [
    "Node search(Node root, int key) {",
    "  if (root == null || root.key == key)",
    "    return root;",
    "  if (key < root.key)",
    "    return search(root.left, key);",
    "  return search(root.right, key);",
    "}"
  ],
  insertion: [
    "Node insert(Node root, int key) {",
    "  if (root == null)",
    "    return new Node(key);",
    "  if (key < root.key)",
    "    root.left = insert(root.left, key);",
    "  else if (key > root.key)",
    "    root.right = insert(root.right, key);",
    "  return root;",
    "}"
  ],
  deletion: [
    "Node delete(Node root, int key) {",
    "  if (root == null) return null;",
    "  if (key < root.key) root.left = delete(root.left, key);",
    "  else if (key > root.key) root.right = delete(root.right, key);",
    "  else {",
    "    if (root.left == null) return root.right;",
    "    if (root.right == null) return root.left;",
    "    Node succ = getSuccessor(root.right);",
    "    root.key = succ.key;",
    "    root.right = delete(root.right, succ.key);",
    "  }",
    "  return root;",
    "}"
  ]
};

const complexityInfo = {
  searching: {
    time: "O(h)",
    timeDesc: "Where h is the height of the tree. In a balanced BST, h = O(log N). In a skewed tree, it degrades to O(N).",
    space: "O(h)",
    spaceDesc: "Takes O(h) space due to recursion stack frames. Can be optimized to O(1) space if implemented iteratively."
  },
  insertion: {
    time: "O(h)",
    timeDesc: "Where h is the height of the tree. Traverses the depth of the tree to find the correct leaf node location.",
    space: "O(h)",
    spaceDesc: "Occupies O(h) recursion stack space. Storing/updating node pointers recursively consumes depth-related call stacks."
  },
  deletion: {
    time: "O(h)",
    timeDesc: "Where h is the height of the tree. Finding the successor or predecessor in Case 3 requires traversing the right child's left spine.",
    space: "O(h)",
    spaceDesc: "Recursively rebuilds subtrees from leaf to pivot point, requiring O(h) call stack memory."
  }
};

const quizzes = {
  searching: [
    {
      question: "What is the worst-case search time complexity in a skewed Binary Search Tree of N nodes?",
      options: ["O(log N)", "O(N)", "O(N log N)", "O(1)"],
      answer: 1,
      explanation: "In a skewed BST (where every node has only one child, forming a straight line), searching behaves like a linear search on a linked list, degrading to O(N) time."
    },
    {
      question: "Which child do we traverse to if the search key is less than the current node's key?",
      options: ["Right child", "Left child", "Inorder Successor", "Parent node"],
      answer: 1,
      explanation: "By definition, all keys in a node's left subtree are smaller than the node's key, and all keys in the right subtree are larger. So we traverse to the left child."
    }
  ],
  insertion: [
    {
      question: "Where are new nodes always inserted in a standard Binary Search Tree?",
      options: ["As a new root", "As a leaf node", "As an internal parent", "Replacing the predecessor"],
      answer: 1,
      explanation: "In a standard BST, insertions always result in creating a new leaf node at the bottom of the tree once a null reference is reached."
    },
    {
      question: "What happens if we try to insert a duplicate value that already exists in the BST?",
      options: ["It replaces the root", "It is placed in the left subtree", "It is usually ignored or increments a count", "It triggers a tree split"],
      answer: 2,
      explanation: "For visual and conceptual clarity, duplicate values are typically ignored or not allowed in standard BST animations to keep coordinates clean."
    }
  ],
  deletion: [
    {
      question: "How do we delete a node that has two children in a BST?",
      options: [
        "Delete it and let the children hang",
        "Replace it with either inorder successor or inorder predecessor, then delete that leaf",
        "Promote the left child to root immediately",
        "Delete both children recursively first"
      ],
      answer: 1,
      explanation: "To preserve BST properties, a node with two children is replaced by its inorder successor (min of right subtree) or inorder predecessor (max of left subtree). The successor's duplicate is then recursively deleted."
    },
    {
      question: "What is the inorder successor of a node in a BST?",
      options: [
        "The rightmost node in the left subtree",
        "The leftmost node in the right subtree",
        "The parent node",
        "The closest sibling leaf"
      ],
      answer: 1,
      explanation: "The inorder successor represents the smallest value that is larger than the target node's value. This is located by going to the right child and then following the left pointers to the very bottom."
    }
  ]
};

export default function TreeBSTVisualizer({ initialMode }) {
  const [mode, setMode] = useState(initialMode);
  const [root, setRoot] = useState(null);
  const [targetTreeRoot, setTargetTreeRoot] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [activeOperationValue, setActiveOperationValue] = useState(null);
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [message, setMessage] = useState("Add nodes or select a mode to begin.");
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const timerRef = useRef(null);

  const resetPlayback = useCallback(() => {
    setIsAnimating(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentStepIdx(-1);
    setSteps([]);
    setMessage("Playback reset. Click Start to begin operations.");
  }, []);

  // Sync mode changes
  useEffect(() => {
    setMode(initialMode);
    resetPlayback();
  }, [initialMode, resetPlayback]);

  const handleInsert = (customValue) => {
    const val = customValue !== undefined ? customValue : parseInt(inputValue);
    if (isNaN(val) || val < 1 || val > 99) {
      setMessage("⚠️ Please enter a number between 1 and 99");
      return;
    }

    if (hasDuplicate(root, val)) {
      setMessage(`⚠️ Node ${val} already exists in the tree!`);
      return;
    }

    if (mode === "insertion") {
      resetPlayback();
      setActiveOperationValue(val);
      const newRoot = insertNodeFunctional(root, val);
      setTargetTreeRoot(newRoot);
      const preCalculated = generateInsertSteps(root, val);
      setSteps(preCalculated);
      setCurrentStepIdx(0);
      setIsAnimating(true);
      setInputValue("");
    } else {
      setRoot(prev => insertNodeFunctional(prev, val));
      setMessage(`Inserted Node ${val} into BST.`);
      setInputValue("");
    }
  };

  const handleSearch = () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) {
      setMessage("⚠️ Please enter a valid number");
      return;
    }
    if (!root) {
      setMessage("⚠️ Tree is empty! Insert nodes first.");
      return;
    }

    resetPlayback();
    setActiveOperationValue(val);
    const preCalculated = generateSearchSteps(root, val);
    setSteps(preCalculated);
    setCurrentStepIdx(0);
    setIsAnimating(true);
    setInputValue("");
  };

  const handleDelete = () => {
    const val = parseInt(inputValue);
    if (isNaN(val)) {
      setMessage("⚠️ Please enter a valid number");
      return;
    }
    if (!root) {
      setMessage("⚠️ Tree is empty!");
      return;
    }

    if (!hasDuplicate(root, val)) {
      setMessage(`⚠️ Node ${val} does not exist in the tree!`);
      return;
    }

    resetPlayback();
    setActiveOperationValue(val);
    const newRoot = deleteNodeFunctional(root, val);
    setTargetTreeRoot(newRoot);
    const preCalculated = generateDeleteSteps(root, val);
    setSteps(preCalculated);
    setCurrentStepIdx(0);
    setIsAnimating(true);
    setInputValue("");
  };

  const generateRandomTree = useCallback(() => {
    resetPlayback();
    const trees = [
      [40, 20, 60, 10, 30, 50, 70],
      [50, 30, 70, 15, 35, 62, 85],
      [45, 25, 75, 12, 37, 60, 88]
    ];
    const sequence = trees[Math.floor(Math.random() * trees.length)];
    let newRoot = null;
    sequence.forEach(val => {
      newRoot = insertNodeFunctional(newRoot, val);
    });
    setRoot(newRoot);
    setTargetTreeRoot(newRoot);
    setMessage(`Generated beautiful BST with ${sequence.length} nodes.`);
  }, [resetPlayback]);

  const generateSearchSteps = (treeRoot, val) => {
    const records = [];
    const path = [];

    const recurse = (node) => {
      // Line 1: search header
      // Line 2: if (root == null || root.key == key)
      if (!node) {
        records.push({
          currentNode: null,
          visited: [...path],
          explanation: `Node ${val} is not found in the BST (reached null pointer).`,
          codeLine: 1,
          highlightedNodes: { ...Object.fromEntries(path.map(v => [v, 'active'])) }
        });
        return;
      }

      path.push(node.value);

      records.push({
        currentNode: node.value,
        visited: [...path],
        explanation: `Comparing key ${val} with current node ${node.value}.`,
        codeLine: 1,
        highlightedNodes: { ...Object.fromEntries(path.slice(0, -1).map(v => [v, 'active'])), [node.value]: 'visiting' }
      });

      if (node.value === val) {
        records.push({
          currentNode: node.value,
          visited: [...path],
          explanation: `Success! Node ${val} is found in the BST.`,
          codeLine: 2,
          highlightedNodes: { ...Object.fromEntries(path.slice(0, -1).map(v => [v, 'active'])), [node.value]: 'found' }
        });
        return;
      }

      if (val < node.value) {
        // Line 4: if (key < root.key) -> true
        records.push({
          currentNode: node.value,
          visited: [...path],
          explanation: `Since search key ${val} < current node ${node.value}, traverse to the left subtree.`,
          codeLine: 3,
          highlightedNodes: { ...Object.fromEntries(path.slice(0, -1).map(v => [v, 'active'])), [node.value]: 'visiting' }
        });
        // Line 5: return search(root.left, key)
        records.push({
          currentNode: node.value,
          visited: [...path],
          explanation: `Move to left child.`,
          codeLine: 4,
          highlightedNodes: { ...Object.fromEntries(path.map(v => [v, 'active'])) }
        });
        recurse(node.left);
      } else {
        // Line 4: if (key < root.key) -> false
        records.push({
          currentNode: node.value,
          visited: [...path],
          explanation: `Since search key ${val} > current node ${node.value}, traverse to the right subtree.`,
          codeLine: 3,
          highlightedNodes: { ...Object.fromEntries(path.slice(0, -1).map(v => [v, 'active'])), [node.value]: 'visiting' }
        });
        // Line 6: return search(root.right, key)
        records.push({
          currentNode: node.value,
          visited: [...path],
          explanation: `Move to right child.`,
          codeLine: 5,
          highlightedNodes: { ...Object.fromEntries(path.map(v => [v, 'active'])) }
        });
        recurse(node.right);
      }
    };

    recurse(treeRoot);
    return records;
  };

  const generateInsertSteps = (treeRoot, val) => {
    const records = [];
    const path = [];

    const recurse = (node) => {
      // Line 2: if (root == null)
      if (!node) {
        records.push({
          currentNode: null,
          visited: [...path],
          explanation: `Reached empty pointer spot. Creating new Node ${val}.`,
          codeLine: 1,
          highlightedNodes: Object.fromEntries(path.map(v => [v, 'active'])),
          isNodeCreated: true
        });
        // Line 3: return new Node(key)
        records.push({
          currentNode: val,
          visited: [...path, val],
          explanation: `Successfully inserted Node ${val} at its leaf position!`,
          codeLine: 2,
          highlightedNodes: { ...Object.fromEntries(path.map(v => [v, 'active'])), [val]: 'inserted' },
          isNodeCreated: true
        });
        return;
      }

      path.push(node.value);

      records.push({
        currentNode: node.value,
        visited: [...path],
        explanation: `Comparing insert key ${val} with current node ${node.value}.`,
        codeLine: 1,
        highlightedNodes: { ...Object.fromEntries(path.slice(0, -1).map(v => [v, 'active'])), [node.value]: 'visiting' }
      });

      if (val < node.value) {
        // Line 4: if (key < root.key) -> true
        records.push({
          currentNode: node.value,
          visited: [...path],
          explanation: `Since insert key ${val} < current node ${node.value}, traverse left.`,
          codeLine: 3,
          highlightedNodes: { ...Object.fromEntries(path.slice(0, -1).map(v => [v, 'active'])), [node.value]: 'visiting' }
        });
        // Line 5: root.left = insert(root.left, key)
        records.push({
          currentNode: node.value,
          visited: [...path],
          explanation: `Recursively insert into left child.`,
          codeLine: 4,
          highlightedNodes: { ...Object.fromEntries(path.map(v => [v, 'active'])) }
        });
        recurse(node.left);
      } else {
        // Line 6: else if (key > root.key) -> true
        records.push({
          currentNode: node.value,
          visited: [...path],
          explanation: `Since insert key ${val} > current node ${node.value}, traverse right.`,
          codeLine: 5,
          highlightedNodes: { ...Object.fromEntries(path.slice(0, -1).map(v => [v, 'active'])), [node.value]: 'visiting' }
        });
        // Line 7: root.right = insert(root.right, key)
        records.push({
          currentNode: node.value,
          visited: [...path],
          explanation: `Recursively insert into right child.`,
          codeLine: 6,
          highlightedNodes: { ...Object.fromEntries(path.map(v => [v, 'active'])) }
        });
        recurse(node.right);
      }
    };

    recurse(treeRoot);
    return records;
  };

  const generateDeleteSteps = (treeRoot, val) => {
    const records = [];
    const path = [];

    const recurse = (node) => {
      if (!node) return;

      path.push(node.value);

      // Line 2: if (root == null) -> false
      records.push({
        currentNode: node.value,
        visited: [...path],
        explanation: `Searching for node to delete: comparing key ${val} with Node ${node.value}.`,
        codeLine: 1,
        highlightedNodes: { ...Object.fromEntries(path.slice(0, -1).map(v => [v, 'active'])), [node.value]: 'visiting' }
      });

      if (val < node.value) {
        // Line 3: if (key < root.key)
        records.push({
          currentNode: node.value,
          visited: [...path],
          explanation: `Since delete key ${val} < current node ${node.value}, delete in left subtree.`,
          codeLine: 2,
          highlightedNodes: { ...Object.fromEntries(path.slice(0, -1).map(v => [v, 'active'])), [node.value]: 'visiting' }
        });
        recurse(node.left);
      } else if (val > node.value) {
        // Line 4: else if (key > root.key)
        records.push({
          currentNode: node.value,
          visited: [...path],
          explanation: `Since delete key ${val} > current node ${node.value}, delete in right subtree.`,
          codeLine: 3,
          highlightedNodes: { ...Object.fromEntries(path.slice(0, -1).map(v => [v, 'active'])), [node.value]: 'visiting' }
        });
        recurse(node.right);
      } else {
        // Line 5: else { Node found!
        records.push({
          currentNode: node.value,
          visited: [...path],
          explanation: `Found Node ${val} to delete! Evaluating children cases.`,
          codeLine: 4,
          highlightedNodes: { ...Object.fromEntries(path.slice(0, -1).map(v => [v, 'active'])), [node.value]: 'found' }
        });

        // Case 1: No left child (includes Leaf node case)
        if (!node.left) {
          records.push({
            currentNode: node.value,
            visited: [...path],
            explanation: `Left child is null. Replace target Node ${node.value} with its right child: Node ${node.right?.value || 'null'}.`,
            codeLine: 5,
            highlightedNodes: { ...Object.fromEntries(path.slice(0, -1).map(v => [v, 'active'])), [node.value]: 'deleted' }
          });
          return;
        }

        // Case 2: No right child
        if (!node.right) {
          records.push({
            currentNode: node.value,
            visited: [...path],
            explanation: `Right child is null. Replace target Node ${node.value} with its left child: Node ${node.left.value}.`,
            codeLine: 6,
            highlightedNodes: { ...Object.fromEntries(path.slice(0, -1).map(v => [v, 'active'])), [node.value]: 'deleted' }
          });
          return;
        }

        // Case 3: Two children. Find inorder successor (min value in right subtree)
        records.push({
          currentNode: node.value,
          visited: [...path],
          explanation: `Node ${node.value} has two children. Finding its inorder successor: leftmost node in right subtree.`,
          codeLine: 7,
          highlightedNodes: { ...Object.fromEntries(path.slice(0, -1).map(v => [v, 'active'])), [node.value]: 'found' }
        });

        const succPath = [];
        let succ = node.right;
        while (succ) {
          succPath.push(succ.value);
          records.push({
            currentNode: node.value,
            visited: [...path],
            explanation: `Traversing successor search path: Node ${succ.value}.`,
            codeLine: 7,
            highlightedNodes: {
              ...Object.fromEntries(path.slice(0, -1).map(v => [v, 'active'])),
              [node.value]: 'found',
              ...Object.fromEntries(succPath.slice(0, -1).map(v => [v, 'active-succ'])),
              [succ.value]: 'visiting-succ'
            }
          });
          succ = succ.left;
        }

        // Leftmost found
        let minSucc = node.right;
        const finalSuccPath = [];
        while (minSucc.left) {
          finalSuccPath.push(minSucc.value);
          minSucc = minSucc.left;
        }
        finalSuccPath.push(minSucc.value);

        records.push({
          currentNode: node.value,
          visited: [...path],
          explanation: `Inorder successor located: Node ${minSucc.value} (smallest value in right subtree).`,
          codeLine: 7,
          highlightedNodes: {
            ...Object.fromEntries(path.slice(0, -1).map(v => [v, 'active'])),
            [node.value]: 'found',
            ...Object.fromEntries(finalSuccPath.slice(0, -1).map(v => [v, 'active-succ'])),
            [minSucc.value]: 'predecessor'
          }
        });

        // Copy successor value to current node
        records.push({
          currentNode: node.value,
          visited: [...path],
          explanation: `Copy successor's value ${minSucc.value} to target node, overwriting it.`,
          codeLine: 8,
          highlightedNodes: {
            ...Object.fromEntries(path.slice(0, -1).map(v => [v, 'active'])),
            [node.value]: 'inserted',
            [minSucc.value]: 'predecessor'
          }
        });

        // Recursively delete successor
        records.push({
          currentNode: minSucc.value,
          visited: [...path],
          explanation: `Recursively delete the duplicate successor Node ${minSucc.value} from the right subtree.`,
          codeLine: 9,
          highlightedNodes: {
            ...Object.fromEntries(path.slice(0, -1).map(v => [v, 'active'])),
            [node.value]: 'active',
            [minSucc.value]: 'deleted'
          }
        });
      }
    };

    recurse(treeRoot);
    return records;
  };

  const startVisualizer = () => {
    if (!root && mode !== "insertion") {
      setMessage("⚠️ Please generate a random tree or enter an insert element first!");
      return;
    }

    if (mode === "searching" || mode === "deletion") {
      if (inputValue) {
        mode === "searching" ? handleSearch() : handleDelete();
        return;
      }
      if (steps.length === 0) {
        setMessage("⚠️ Please enter a target value in the input box to visualize!");
        return;
      }
    }

    if (mode === "insertion" && inputValue) {
      handleInsert();
      return;
    }

    setIsAnimating(true);
    setQuizSubmitted(false);
    setSelectedOption(null);

    let nextIdx = currentStepIdx === -1 || currentStepIdx >= steps.length - 1 ? 0 : currentStepIdx + 1;
    setCurrentStepIdx(nextIdx);
  };

  useEffect(() => {
    if (!isAnimating || steps.length === 0) return;

    if (currentStepIdx >= steps.length) {
      setIsAnimating(false);
      return;
    }

    const currentStep = steps[currentStepIdx];
    setMessage(currentStep.explanation);

    timerRef.current = setTimeout(() => {
      if (currentStepIdx < steps.length - 1) {
        setCurrentStepIdx(prev => prev + 1);
      } else {
        setIsAnimating(false);
        // Permanently write to tree state if write operation completed successfully
        if (mode === "insertion" || mode === "deletion") {
          setRoot(targetTreeRoot);
        }
        setMessage("Operation completed successfully!");
      }
    }, 1800 / speed);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isAnimating, currentStepIdx, steps, speed, targetTreeRoot, mode]);

  const pauseVisualizer = () => {
    setIsAnimating(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const stepForward = () => {
    setIsAnimating(false);
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
      if (currentStepIdx === steps.length - 2 && (mode === "insertion" || mode === "deletion")) {
        setRoot(targetTreeRoot);
      }
    }
  };

  const stepBackward = () => {
    setIsAnimating(false);
    if (currentStepIdx > 0) {
      setCurrentStepIdx(prev => prev - 1);
    }
  };

  const handleResetTree = () => {
    setRoot(null);
    setTargetTreeRoot(null);
    resetPlayback();
    setMessage("Tree has been cleared. Add nodes or click Generate.");
  };

  const handleQuizAnswer = (idx) => {
    if (quizSubmitted) return;
    setSelectedOption(idx);
  };

  const submitQuiz = () => {
    if (selectedOption === null) return;
    setQuizSubmitted(true);
  };

  const nextQuizQuestion = () => {
    setSelectedOption(null);
    setQuizSubmitted(false);
    const questionsList = quizzes[mode];
    setQuizIdx(prev => (prev + 1) % questionsList.length);
  };

  const calculateCoordinates = (node, x = 400, y = 60, level = 0, nodesList = [], edgesList = []) => {
    if (!node) return { nodesList, edgesList };

    const nodeRadius = 24;
    const xOffset = 260 / Math.pow(2, level);
    const yOffset = 80;

    const currentStep = steps[currentStepIdx];
    const highlightedState = currentStep?.highlightedNodes?.[node.value] || null;

    nodesList.push({
      value: node.value,
      x,
      y,
      state: highlightedState,
      isVisited: currentStep?.visited?.includes(node.value) || false
    });

    if (node.left) {
      const leftX = x - xOffset;
      const leftY = y + yOffset;
      edgesList.push({
        x1: x,
        y1: y + nodeRadius,
        x2: leftX,
        y2: leftY - nodeRadius,
      });
      calculateCoordinates(node.left, leftX, leftY, level + 1, nodesList, edgesList);
    }

    if (node.right) {
      const rightX = x + xOffset;
      const rightY = y + yOffset;
      edgesList.push({
        x1: x,
        y1: y + nodeRadius,
        x2: rightX,
        y2: rightY - nodeRadius,
      });
      calculateCoordinates(node.right, rightX, rightY, level + 1, nodesList, edgesList);
    }

    return { nodesList, edgesList };
  };

  const buildTreeRenderData = () => {
    const currentStep = steps[currentStepIdx];
    const showInsertedNode = currentStep?.isNodeCreated || false;

    // Use old tree before insertion node is officially visualised
    const activeTree = (mode === "insertion" && !showInsertedNode) ? root : targetTreeRoot || root;

    if (!activeTree) return { renderNodes: [], renderEdges: [] };
    const { nodesList, edgesList } = calculateCoordinates(activeTree);
    return { renderNodes: nodesList, renderEdges: edgesList };
  };

  const { renderNodes, renderEdges } = buildTreeRenderData();

  const getSvgDimensions = () => {
    if (renderNodes.length === 0) return { width: 800, height: 400, viewBoxOffset: 0 };
    const xCoords = renderNodes.map(n => n.x);
    const yCoords = renderNodes.map(n => n.y);

    const minX = Math.min(...xCoords);
    const maxX = Math.max(...xCoords);
    const maxY = Math.max(...yCoords);

    const padding = 60;
    const computedWidth = maxX - minX + padding * 2;
    const computedHeight = maxY + padding * 1.5;

    return {
      width: Math.max(800, computedWidth),
      height: Math.max(380, computedHeight),
      viewBoxOffset: minX - padding
    };
  };

  const svgDimensions = getSvgDimensions();

  useEffect(() => {
    // Populate default beautiful tree on mount
    generateRandomTree();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [generateRandomTree]);

  const currentStep = steps[currentStepIdx] || null;
  const currentHighlightLine = currentStep ? currentStep.codeLine : -1;
  const activeComplexity = complexityInfo[mode];
  const activeQuizList = quizzes[mode];
  const activeQuestion = activeQuizList[quizIdx];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-24 flex flex-col gap-8">
        
        {/* Title Block */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-950/40 px-3 py-1 rounded-full w-fit border border-indigo-900/50">
              <Layers className="w-3.5 h-3.5" /> BST Interactive Operations
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-400 capitalize">
              {mode.replace("-", " ")}
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Visualize binary search trees, node path traversals, element insertions, and structural node deletions.
            </p>
          </div>

          {/* Mode Selector Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
            {["searching", "insertion", "deletion"].map(tab => (
              <button
                key={tab}
                onClick={() => {
                  setMode(tab);
                  resetPlayback();
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                  mode === tab
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-950"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                {tab.replace("-", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Tree Workspace & Control cards */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row gap-5 justify-between items-center shadow-lg shadow-black/20">
              {/* Insert / Search / Delete input controls */}
              <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto">
                <button
                  onClick={generateRandomTree}
                  disabled={isAnimating}
                  className="px-4 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-all border border-slate-700/60 disabled:opacity-40"
                >
                  🎲 Random BST
                </button>
                <div className="flex gap-1.5 flex-1 sm:flex-initial">
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={mode === "searching" ? "Find key (1-99)" : mode === "deletion" ? "Delete key" : "Insert key (1-99)"}
                    className="w-full sm:w-28 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                    disabled={isAnimating}
                    onKeyDown={(e) => e.key === "Enter" && (mode === "searching" ? handleSearch() : mode === "deletion" ? handleDelete() : handleInsert())}
                  />
                  <button
                    onClick={() => (mode === "searching" ? handleSearch() : mode === "deletion" ? handleDelete() : handleInsert())}
                    disabled={isAnimating}
                    className="px-3.5 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900 disabled:opacity-40 text-white rounded-xl transition-all font-semibold"
                  >
                    {mode === "searching" ? "Search" : mode === "deletion" ? "Delete" : "Insert"}
                  </button>
                </div>
              </div>

              {/* Playback Controls */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                  <button
                    onClick={stepBackward}
                    disabled={currentStepIdx <= 0 || steps.length === 0}
                    className="p-1.5 text-slate-400 hover:text-slate-200 disabled:opacity-30 rounded-lg"
                    title="Previous Step"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={isAnimating ? pauseVisualizer : startVisualizer}
                    className={`p-2 rounded-xl transition-all ${
                      isAnimating
                        ? "bg-amber-500/20 text-amber-400 hover:bg-amber-500/35 border border-amber-800/40"
                        : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-950"
                    }`}
                  >
                    {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                  </button>
                  <button
                    onClick={stepForward}
                    disabled={steps.length > 0 && currentStepIdx >= steps.length - 1}
                    className="p-1.5 text-slate-400 hover:text-slate-200 disabled:opacity-30 rounded-lg"
                    title="Next Step"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={resetPlayback}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg"
                    title="Reset Playback"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleResetTree}
                  className="px-3.5 py-2 text-xs font-bold text-rose-500 bg-rose-950/20 hover:bg-rose-950/40 rounded-xl transition-all border border-rose-900/30"
                >
                  Clear Tree
                </button>
              </div>

              {/* Speed Slider */}
              <div className="flex items-center gap-3 w-full md:w-36 bg-slate-950/40 px-3 py-1.5 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Speed</span>
                <input
                  type="range"
                  min="0.5"
                  max="4"
                  step="0.5"
                  value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
                />
                <span className="text-xs font-bold text-indigo-400 w-8">{speed}x</span>
              </div>
            </div>

            {/* Explanation Area */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-indigo-400" /> Action Explanation
                </span>
                <span className="text-slate-500 font-bold bg-slate-950 px-2.5 py-0.5 rounded-full border border-slate-900">
                  Step {currentStepIdx !== -1 ? currentStepIdx + 1 : 0} / {steps.length || 0}
                </span>
              </div>
              <div className="text-sm font-medium text-indigo-200/90 leading-relaxed min-h-[40px]">
                {message}
              </div>
            </div>

            {/* Trees SVG Render Canvas */}
            <div className="bg-slate-900/30 border border-slate-850 rounded-3xl p-6 shadow-inner relative overflow-hidden flex flex-col justify-center min-h-[440px] items-center">
              
              {/* Dynamic Legend Labels */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-800 px-2.5 py-1 rounded-lg">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-md shadow-emerald-950"></span>
                  <span className="text-slate-400">Comparing (visiting)</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-800 px-2.5 py-1 rounded-lg">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-md shadow-purple-950"></span>
                  <span className="text-slate-400">Path Traversed</span>
                </div>
                {mode === "searching" && (
                  <div className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-800 px-2.5 py-1 rounded-lg">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-md shadow-amber-950"></span>
                    <span className="text-slate-400">Node Found!</span>
                  </div>
                )}
                {mode === "insertion" && (
                  <div className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-800 px-2.5 py-1 rounded-lg">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-md shadow-emerald-950 animate-pulse"></span>
                    <span className="text-slate-400">Newly Placed Leaf</span>
                  </div>
                )}
                {mode === "deletion" && (
                  <>
                    <div className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-800 px-2.5 py-1 rounded-lg">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-md shadow-rose-950"></span>
                      <span className="text-slate-400">Deleted (removal)</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-800 px-2.5 py-1 rounded-lg">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-md shadow-purple-950"></span>
                      <span className="text-slate-400">Inorder Successor</span>
                    </div>
                  </>
                )}
              </div>

              {renderNodes.length > 0 ? (
                <div className="overflow-auto w-full flex justify-center py-6">
                  <svg
                    width={svgDimensions.width}
                    height={svgDimensions.height}
                    viewBox={`${svgDimensions.viewBoxOffset} 0 ${svgDimensions.width} ${svgDimensions.height}`}
                    className="max-w-full h-auto transition-transform duration-300"
                  >
                    {/* Render Edges */}
                    {renderEdges.map((edge, idx) => (
                      <line
                        key={`edge-${idx}`}
                        x1={edge.x1}
                        y1={edge.y1}
                        x2={edge.x2}
                        y2={edge.y2}
                        stroke="#334155"
                        strokeWidth="2.5"
                      />
                    ))}

                    {/* Render Nodes */}
                    {renderNodes.map((node, idx) => {
                      const isCurr = node.state === "visiting" || node.state === "visiting-succ";
                      const isFound = node.state === "found";
                      const isInserted = node.state === "inserted";
                      const isDeleted = node.state === "deleted";
                      const isPred = node.state === "predecessor";
                      const isVisited = node.isVisited;

                      let fillHex = "#0f172a";
                      let strokeHex = "#334155";

                      if (isCurr) {
                        fillHex = "#10b981"; // emerald-500
                        strokeHex = "#34d399";
                      } else if (isFound) {
                        fillHex = "#f59e0b"; // amber-500
                        strokeHex = "#fbbf24";
                      } else if (isInserted) {
                        fillHex = "#10b981"; // emerald-500
                        strokeHex = "#34d399";
                      } else if (isDeleted) {
                        fillHex = "#ef4444"; // red-500
                        strokeHex = "#f87171";
                      } else if (isPred) {
                        fillHex = "#a855f7"; // purple-500
                        strokeHex = "#c084fc";
                      } else if (isVisited) {
                        fillHex = "#3b82f6"; // blue-500
                        strokeHex = "#60a5fa";
                      }

                      return (
                        <g key={`node-${idx}`} className="transition-all duration-300">
                          {/* Glow ring */}
                          {(isCurr || isFound || isPred || isInserted || isDeleted) && (
                            <circle
                              cx={node.x}
                              cy={node.y}
                              r="28"
                              fill="none"
                              stroke={strokeHex}
                              strokeWidth="1.5"
                              strokeDasharray="4,2"
                              className="animate-spin-slow opacity-60"
                            />
                          )}

                          {/* Node Circle */}
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r="21"
                            fill={fillHex}
                            stroke={strokeHex}
                            strokeWidth="2.5"
                            className="transition-all duration-300 shadow-xl shadow-black"
                          />

                          {/* Node Value Label */}
                          <text
                            x={node.x}
                            y={node.y + 4.5}
                            textAnchor="middle"
                            fill="#ffffff"
                            fontSize="12"
                            fontWeight="bold"
                          >
                            {node.value}
                          </text>

                          {/* Label labels */}
                          {isCurr && node.state === "visiting" && (
                            <g transform={`translate(${node.x - 22}, ${node.y - 35})`}>
                              <rect width="44" height="15" rx="4" fill="#047857" className="stroke stroke-emerald-400" strokeWidth="0.5" />
                              <text x="22" y="11" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle">curr</text>
                            </g>
                          )}
                          {isPred && (
                            <g transform={`translate(${node.x - 22}, ${node.y - 35})`}>
                              <rect width="44" height="15" rx="4" fill="#6b21a8" className="stroke stroke-purple-400" strokeWidth="0.5" />
                              <text x="22" y="11" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle">succ</text>
                            </g>
                          )}
                        </g>
                      );
                    })}
                  </svg>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2.5 text-slate-500 py-12">
                  <AlertCircle className="w-10 h-10 text-slate-700" />
                  <span className="text-sm font-semibold">Workspace Empty</span>
                  <span className="text-xs max-w-xs text-center text-slate-600">Please generate a random tree or insert custom node elements.</span>
                </div>
              )}
            </div>

            {/* Time / Space Complexity Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-semibold text-slate-200">Time Complexity</h3>
                  </div>
                  <span className="px-2 py-0.5 text-xs font-bold rounded bg-emerald-950/40 text-emerald-400 border border-emerald-900/50">
                    {activeComplexity.time}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">
                  {activeComplexity.timeDesc}
                </p>
              </div>

              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <h3 className="text-sm font-semibold text-slate-200">Space Complexity</h3>
                  </div>
                  <span className="px-2 py-0.5 text-xs font-bold rounded bg-purple-950/40 text-purple-400 border border-purple-900/50">
                    {activeComplexity.space}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mt-1">
                  {activeComplexity.spaceDesc}
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT: Pseudocode & Quizzes */}
          <div className="lg:col-span-4 flex flex-col gap-6 w-full">
            
            {/* Pseudocode Highlighter Card */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 flex flex-col shadow-lg shadow-black/20">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">Pseudocode</h2>
              </div>
              <div className="flex flex-col gap-1 font-mono text-xs text-slate-400 bg-slate-950/80 p-4 rounded-xl border border-slate-900 overflow-x-auto leading-relaxed">
                {pseudocode[mode].map((line, idx) => {
                  const isHighlighted = idx === currentHighlightLine;
                  return (
                    <div
                      key={`code-${idx}`}
                      className={`flex gap-3 px-2 py-0.5 rounded transition-all ${
                        isHighlighted
                          ? "bg-indigo-600/25 text-indigo-200 font-semibold border-l-2 border-indigo-500 pl-1.5"
                          : ""
                      }`}
                    >
                      <span className="text-[10px] text-slate-700 select-none w-4 text-right">{idx + 1}</span>
                      <pre className="flex-1 whitespace-pre">{line}</pre>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quiz Challenge Card */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 shadow-lg shadow-black/20">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Award className="w-4.5 h-4.5 text-amber-400 animate-pulse" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">Quiz Challenge</h2>
              </div>
              
              <div className="flex flex-col gap-3.5">
                <div className="text-xs font-semibold text-slate-300 leading-normal bg-slate-950/40 p-3 rounded-xl border border-slate-900">
                  {activeQuestion.question}
                </div>

                {/* Option buttons */}
                <div className="flex flex-col gap-2">
                  {activeQuestion.options.map((opt, oIdx) => {
                    const isSelected = selectedOption === oIdx;
                    const isCorrect = oIdx === activeQuestion.answer;
                    
                    let btnColor = "bg-slate-950 hover:bg-slate-800/80 border-slate-800 text-slate-400";
                    if (isSelected) {
                      btnColor = "bg-indigo-950/40 border-indigo-500 text-indigo-300";
                    }
                    if (quizSubmitted) {
                      if (isCorrect) {
                        btnColor = "bg-emerald-950/40 border-emerald-500 text-emerald-300";
                      } else if (isSelected) {
                        btnColor = "bg-rose-950/40 border-rose-500 text-rose-300";
                      }
                    }

                    return (
                      <button
                        key={`opt-${oIdx}`}
                        onClick={() => handleQuizAnswer(oIdx)}
                        className={`w-full text-left px-4 py-2.5 text-xs font-medium rounded-xl border transition-all flex items-center justify-between gap-2.5 ${btnColor}`}
                        disabled={quizSubmitted}
                      >
                        <span>{opt}</span>
                        {quizSubmitted && isCorrect && <CheckCircle className="w-4.5 h-4.5 text-emerald-400 shrink-0" />}
                        {quizSubmitted && isSelected && !isCorrect && <AlertCircle className="w-4.5 h-4.5 text-rose-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Submission Controls */}
                <div className="flex gap-2 justify-end mt-1.5">
                  {!quizSubmitted ? (
                    <button
                      onClick={submitQuiz}
                      disabled={selectedOption === null}
                      className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl transition-all shadow shadow-indigo-950"
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <button
                      onClick={nextQuizQuestion}
                      className="px-4 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-all border border-slate-700"
                    >
                      Next Question
                    </button>
                  )}
                </div>

                {/* Quiz feedback explanation */}
                {quizSubmitted && (
                  <div className="bg-slate-950 border border-slate-850 p-3.5 rounded-xl flex gap-2.5 items-start mt-1">
                    <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div className="text-[11px] text-slate-400 leading-normal">
                      <span className="font-semibold text-indigo-300 block mb-0.5">
                        {selectedOption === activeQuestion.answer ? "🎉 Correct Answer!" : "❌ Incorrect Answer"}
                      </span>
                      {activeQuestion.explanation}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
