'use client';
import React, { useState, useRef, useEffect } from 'react';
import Navbar from '@/app/components/navbarinner';
import Footer from '@/app/components/footer';
import { Play, Pause, ChevronRight, ChevronLeft, RotateCcw, AlertCircle, CheckCircle, Info, BookOpen, Layers, Award } from 'lucide-react';

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

// Complexity mapping
const complexityInfo = {
  'pre-order': {
    time: 'O(N)',
    timeDesc: 'Every node in the tree is visited exactly once.',
    space: 'O(H)',
    spaceDesc: 'H is the height of the tree. In the worst case (skewed tree), the call stack requires O(N) space, while in a balanced tree it takes O(log N).'
  },
  'in-order': {
    time: 'O(N)',
    timeDesc: 'Every node in the tree is visited exactly once.',
    space: 'O(H)',
    spaceDesc: 'H is the height of the tree. The call stack holds function calls up to the deepest leaf node.'
  },
  'post-order': {
    time: 'O(N)',
    timeDesc: 'Every node in the tree is visited exactly once.',
    space: 'O(H)',
    spaceDesc: 'H is the height of the tree. Space is required for recursion stack frames representing parents waiting to be visited.'
  },
  'level-order': {
    time: 'O(N)',
    timeDesc: 'Every node is dequeued and visited once.',
    space: 'O(W)',
    spaceDesc: 'W is the maximum width of the tree. In a complete binary tree, the last level contains N/2 nodes, requiring O(N) space in the queue.'
  },
  'morris': {
    time: 'O(N)',
    timeDesc: 'Each edge is traversed at most 3 times (finding predecessor, creating thread, removing thread). Thus, overall time remains O(N).',
    space: 'O(1)',
    spaceDesc: 'Extraordinary feature: Morris Traversal uses threaded binary trees to navigate without recursion stack or queues, achieving true constant auxiliary space!'
  }
};

// Pseudocode mapping
const pseudocode = {
  'pre-order': [
    'preOrder(node) {',
    '  if (node === null) return;',
    '  visit(node); // Process current node',
    '  preOrder(node.left); // Traverse left subtree',
    '  preOrder(node.right); // Traverse right subtree',
    '}'
  ],
  'in-order': [
    'inOrder(node) {',
    '  if (node === null) return;',
    '  inOrder(node.left); // Traverse left subtree',
    '  visit(node); // Process current node',
    '  inOrder(node.right); // Traverse right subtree',
    '}'
  ],
  'post-order': [
    'postOrder(node) {',
    '  if (node === null) return;',
    '  postOrder(node.left); // Traverse left subtree',
    '  postOrder(node.right); // Traverse right subtree',
    '  visit(node); // Process current node',
    '}'
  ],
  'level-order': [
    'levelOrder(root) {',
    '  if (root === null) return;',
    '  queue.enqueue(root);',
    '  while (!queue.isEmpty()) {',
    '    node = queue.dequeue(); visit(node);',
    '    if (node.left) queue.enqueue(node.left);',
    '    if (node.right) queue.enqueue(node.right);',
    '  }',
    '}'
  ],
  'morris': [
    'morrisInOrder(root) {',
    '  curr = root;',
    '  while (curr !== null) {',
    '    if (curr.left === null) {',
    '      visit(curr); curr = curr.right;',
    '    } else {',
    '      pred = findPredecessor(curr);',
    '      if (pred.right === null) {',
    '        pred.right = curr; // Create thread',
    '        curr = curr.left;',
    '      } else {',
    '        pred.right = null; // Clear thread',
    '        visit(curr); curr = curr.right;',
    '      }',
    '    }',
    '  }',
    '}'
  ]
};

// Quizzes data
const quizzes = {
  'pre-order': [
    {
      question: 'Which of the following describes the visiting order of Pre-Order traversal?',
      options: [
        'Root, Left Subtree, Right Subtree',
        'Left Subtree, Root, Right Subtree',
        'Left Subtree, Right Subtree, Root',
        'Root, Right Subtree, Left Subtree'
      ],
      answer: 0,
      explanation: 'Pre-Order traversal is so named because the Root node is visited PRE (before) its subtrees. So the order is Root -> Left -> Right.'
    },
    {
      question: 'Which of the following is a common application of Pre-Order traversal?',
      options: [
        'Getting sorted nodes of a BST',
        'Creating a copy or clone of a binary tree',
        'Deleting/destroying a tree to avoid memory leaks',
        'Finding the height of a tree'
      ],
      answer: 1,
      explanation: 'Pre-Order traversal is commonly used to create a copy or serialize a binary tree, because the root is created first, followed by its children recursively.'
    }
  ],
  'in-order': [
    {
      question: 'What is the special characteristic of In-Order traversal on a Binary Search Tree (BST)?',
      options: [
        'It visits the nodes in random order',
        'It visits the nodes in sorted ascending order',
        'It visits the nodes in sorted descending order',
        'It visits leaves first, then intermediate parent nodes'
      ],
      answer: 1,
      explanation: 'Because of the BST property (Left < Root < Right), an In-Order traversal (Left -> Root -> Right) always produces the values in sorted ascending order.'
    },
    {
      question: 'What is the auxiliary space complexity of standard In-Order traversal on a balanced binary tree?',
      options: [
        'O(1)',
        'O(log N) due to recursion stack height',
        'O(N) always',
        'O(N^2)'
      ],
      answer: 1,
      explanation: 'In a balanced binary tree, the height of the tree is log(N). Since the recursion call stack goes as deep as the height, the auxiliary space is O(log N).'
    }
  ],
  'post-order': [
    {
      question: 'What is the visiting order of Post-Order traversal?',
      options: [
        'Root, Left Subtree, Right Subtree',
        'Left Subtree, Root, Right Subtree',
        'Left Subtree, Right Subtree, Root',
        'Root, Right Subtree, Left Subtree'
      ],
      answer: 2,
      explanation: 'Post-Order traversal visits the Root node POST (after) its subtrees. So the order is Left -> Right -> Root.'
    },
    {
      question: 'Why is Post-Order traversal ideal for deleting or freeing memory of a binary tree?',
      options: [
        'It is faster than other traversals',
        'It processes the root before any of its descendants',
        'It processes children first, ensuring parents are deleted only after children are safe to delete',
        'It uses zero auxiliary memory space'
      ],
      answer: 2,
      explanation: 'Post-Order processes children before parent (Left -> Right -> Root). This ensures you delete child nodes first so you do not lose references to children before deleting their parent!'
    }
  ],
  'level-order': [
    {
      question: 'What data structure is standard for implementing Level-Order traversal iteratively?',
      options: [
        'Stack (LIFO)',
        'Queue (FIFO)',
        'Priority Queue',
        'Hash Map'
      ],
      answer: 1,
      explanation: 'A Queue (First-In-First-Out) is used to explore nodes level-by-level, ensuring nodes at level L are processed before any nodes at level L+1.'
    },
    {
      question: 'In the worst case (e.g. a complete binary tree), what is the maximum number of nodes inside the queue at any time?',
      options: [
        'O(1)',
        'O(log N)',
        'O(N) (specifically, about N/2 at the leaf level)',
        'O(N log N)'
      ],
      answer: 2,
      explanation: 'In a complete binary tree, the leaf level contains roughly N/2 nodes. In Level-Order traversal, the queue will hold all nodes of the leaf level at the same time, making space complexity O(N).'
    }
  ],
  'morris': [
    {
      question: 'What is the main advantage of Morris Traversal over standard traversals?',
      options: [
        'It runs in O(log N) time complexity',
        'It performs the traversal with O(1) auxiliary space, requiring no recursion stack or queue',
        'It works on graphs without modification',
        'It avoids visiting left subtrees altogether'
      ],
      answer: 1,
      explanation: 'Morris Traversal uses the concept of threaded binary trees (temporary links from inorder predecessors back to current nodes) to traverse the tree without any recursion stack or auxiliary queues, achieving true O(1) space!'
    },
    {
      question: 'What does Morris Traversal do to a node\'s inorder predecessor when visiting for the first time?',
      options: [
        'Deletes the predecessor node',
        'Swaps it with the root node',
        'Sets its right child to point to the current node (creating a temporary thread)',
        'Sets its left child to point to the current node'
      ],
      answer: 2,
      explanation: 'Morris Traversal finds the inorder predecessor (rightmost node in left subtree) and sets its right child to point back to the current node. This thread is later removed when traversing that path a second time.'
    }
  ]
};

export default function TreeTraversalVisualizer({ initialMode = 'in-order' }) {
  const [mode, setMode] = useState(initialMode);
  const [root, setRoot] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('Tree is empty');
  
  // Traversal playback states
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [speed, setSpeed] = useState(1);
  
  // Quiz states
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  
  const timerRef = useRef(null);

  // Sync mode changes
  useEffect(() => {
    setMode(initialMode);
    resetPlayback();
  }, [initialMode]);

  // Pure functional BST insertion
  const insertNode = (node, value) => {
    if (!node) return new TreeNode(value);
    if (value < node.value) {
      return { ...node, left: insertNode(node.left, value) };
    } else if (value > node.value) {
      return { ...node, right: insertNode(node.right, value) };
    }
    return node; // No duplicates allowed for visual clarity
  };

  const handleInsert = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      setMessage('⚠️ Please enter a valid number');
      return;
    }
    if (value < 1 || value > 999) {
      setMessage('⚠️ Please enter a number between 1 and 999');
      return;
    }

    setRoot(prev => {
      const newRoot = insertNode(prev, value);
      setMessage(`Inserted node ${value}`);
      return newRoot;
    });
    setInputValue('');
    resetPlayback();
  };

  // Generate random BST
  const generateRandomTree = () => {
    resetPlayback();
    // Predefined sequences that create highly balanced, beautiful trees
    const trees = [
      [50, 30, 70, 20, 40, 60, 80],
      [45, 25, 65, 15, 35, 55, 75],
      [55, 35, 75, 25, 45, 65, 85, 15, 95],
      [50, 25, 75, 12, 37, 62, 87],
      [40, 20, 60, 10, 30, 50, 70, 5, 15, 25]
    ];
    const sequence = trees[Math.floor(Math.random() * trees.length)];
    
    let newRoot = null;
    sequence.forEach(val => {
      newRoot = insertNode(newRoot, val);
    });
    
    setRoot(newRoot);
    setMessage(`Generated beautiful BST with ${sequence.length} nodes.`);
  };

  // Load a default tree on mount if empty
  useEffect(() => {
    if (!root) {
      generateRandomTree();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Pre-calculate steps based on current tree and traversal mode
  const preCalculateSteps = () => {
    if (!root) return [];
    
    switch (mode) {
      case 'pre-order':
        return generatePreOrderSteps(root);
      case 'in-order':
        return generateInOrderSteps(root);
      case 'post-order':
        return generatePostOrderSteps(root);
      case 'level-order':
        return generateLevelOrderSteps(root);
      case 'morris':
        return generateMorrisSteps(root);
      default:
        return [];
    }
  };

  // Traversal path step generators
  const generatePreOrderSteps = (treeRoot) => {
    const records = [];
    const visited = [];
    const stack = [];

    const traverse = (node) => {
      if (!node) return;

      // Line 2: visit
      visited.push(node.value);
      records.push({
        currentNode: node.value,
        visited: [...visited],
        explanation: `Visit node ${node.value} and add it to our traversal result list.`,
        codeLine: 2,
        stack: [...stack].map(n => n.value),
        highlightedNodes: { [node.value]: 'visiting' },
        threads: []
      });

      // Line 3: left child
      if (node.left) {
        stack.push(node);
        records.push({
          currentNode: node.left.value,
          visited: [...visited],
          explanation: `Move to the left child of ${node.value} -> ${node.left.value}.`,
          codeLine: 3,
          stack: [...stack].map(n => n.value),
          highlightedNodes: { [node.value]: 'active', [node.left.value]: 'visiting' },
          threads: []
        });
        traverse(node.left);
        stack.pop();
      } else {
        records.push({
          currentNode: node.value,
          visited: [...visited],
          explanation: `Node ${node.value} has no left child. So we skip left subtree recursion.`,
          codeLine: 3,
          stack: [...stack].map(n => n.value),
          highlightedNodes: { [node.value]: 'active' },
          threads: []
        });
      }

      // Line 4: right child
      if (node.right) {
        stack.push(node);
        records.push({
          currentNode: node.right.value,
          visited: [...visited],
          explanation: `Move to the right child of ${node.value} -> ${node.right.value}.`,
          codeLine: 4,
          stack: [...stack].map(n => n.value),
          highlightedNodes: { [node.value]: 'active', [node.right.value]: 'visiting' },
          threads: []
        });
        traverse(node.right);
        stack.pop();
      } else {
        records.push({
          currentNode: node.value,
          visited: [...visited],
          explanation: `Node ${node.value} has no right child. So we skip right subtree recursion.`,
          codeLine: 4,
          stack: [...stack].map(n => n.value),
          highlightedNodes: { [node.value]: 'active' },
          threads: []
        });
      }
    };

    records.push({
      currentNode: treeRoot.value,
      visited: [],
      explanation: `Start Pre-Order traversal from the root node ${treeRoot.value}.`,
      codeLine: 0,
      stack: [],
      highlightedNodes: {},
      threads: []
    });

    traverse(treeRoot);

    records.push({
      currentNode: null,
      visited: [...visited],
      explanation: `Pre-Order traversal is complete! Visited nodes: [${visited.join(', ')}].`,
      codeLine: 5,
      stack: [],
      highlightedNodes: {},
      threads: []
    });

    return records;
  };

  const generateInOrderSteps = (treeRoot) => {
    const records = [];
    const visited = [];
    const stack = [];

    const traverse = (node) => {
      if (!node) return;

      // Line 2: left subtree
      if (node.left) {
        stack.push(node);
        records.push({
          currentNode: node.left.value,
          visited: [...visited],
          explanation: `Recurse into left child of ${node.value} -> ${node.left.value}.`,
          codeLine: 2,
          stack: [...stack].map(n => n.value),
          highlightedNodes: { [node.value]: 'active', [node.left.value]: 'visiting' },
          threads: []
        });
        traverse(node.left);
        stack.pop();
      } else {
        records.push({
          currentNode: node.value,
          visited: [...visited],
          explanation: `Node ${node.value} has no left child. Backtracking...`,
          codeLine: 2,
          stack: [...stack].map(n => n.value),
          highlightedNodes: { [node.value]: 'active' },
          threads: []
        });
      }

      // Line 3: visit
      visited.push(node.value);
      records.push({
        currentNode: node.value,
        visited: [...visited],
        explanation: `Visit node ${node.value} and add it to our traversal path.`,
        codeLine: 3,
        stack: [...stack].map(n => n.value),
        highlightedNodes: { [node.value]: 'visiting' },
        threads: []
      });

      // Line 4: right subtree
      if (node.right) {
        stack.push(node);
        records.push({
          currentNode: node.right.value,
          visited: [...visited],
          explanation: `Recurse into right child of ${node.value} -> ${node.right.value}.`,
          codeLine: 4,
          stack: [...stack].map(n => n.value),
          highlightedNodes: { [node.value]: 'active', [node.right.value]: 'visiting' },
          threads: []
        });
        traverse(node.right);
        stack.pop();
      } else {
        records.push({
          currentNode: node.value,
          visited: [...visited],
          explanation: `Node ${node.value} has no right child. Backtracking...`,
          codeLine: 4,
          stack: [...stack].map(n => n.value),
          highlightedNodes: { [node.value]: 'active' },
          threads: []
        });
      }
    };

    records.push({
      currentNode: treeRoot.value,
      visited: [],
      explanation: `Start In-Order traversal from the root node ${treeRoot.value}.`,
      codeLine: 0,
      stack: [],
      highlightedNodes: {},
      threads: []
    });

    traverse(treeRoot);

    records.push({
      currentNode: null,
      visited: [...visited],
      explanation: `In-Order traversal is complete! Notice that the BST values are printed in sorted order: [${visited.join(', ')}].`,
      codeLine: 5,
      stack: [],
      highlightedNodes: {},
      threads: []
    });

    return records;
  };

  const generatePostOrderSteps = (treeRoot) => {
    const records = [];
    const visited = [];
    const stack = [];

    const traverse = (node) => {
      if (!node) return;

      // Line 2: left subtree
      if (node.left) {
        stack.push(node);
        records.push({
          currentNode: node.left.value,
          visited: [...visited],
          explanation: `Recurse into left child of ${node.value} -> ${node.left.value}.`,
          codeLine: 2,
          stack: [...stack].map(n => n.value),
          highlightedNodes: { [node.value]: 'active', [node.left.value]: 'visiting' },
          threads: []
        });
        traverse(node.left);
        stack.pop();
      } else {
        records.push({
          currentNode: node.value,
          visited: [...visited],
          explanation: `Node ${node.value} has no left child.`,
          codeLine: 2,
          stack: [...stack].map(n => n.value),
          highlightedNodes: { [node.value]: 'active' },
          threads: []
        });
      }

      // Line 3: right subtree
      if (node.right) {
        stack.push(node);
        records.push({
          currentNode: node.right.value,
          visited: [...visited],
          explanation: `Recurse into right child of ${node.value} -> ${node.right.value}.`,
          codeLine: 3,
          stack: [...stack].map(n => n.value),
          highlightedNodes: { [node.value]: 'active', [node.right.value]: 'visiting' },
          threads: []
        });
        traverse(node.right);
        stack.pop();
      } else {
        records.push({
          currentNode: node.value,
          visited: [...visited],
          explanation: `Node ${node.value} has no right child.`,
          codeLine: 3,
          stack: [...stack].map(n => n.value),
          highlightedNodes: { [node.value]: 'active' },
          threads: []
        });
      }

      // Line 4: visit
      visited.push(node.value);
      records.push({
        currentNode: node.value,
        visited: [...visited],
        explanation: `Both subtrees of node ${node.value} are fully processed. Now we visit the parent node itself.`,
        codeLine: 4,
        stack: [...stack].map(n => n.value),
        highlightedNodes: { [node.value]: 'visiting' },
        threads: []
      });
    };

    records.push({
      currentNode: treeRoot.value,
      visited: [],
      explanation: `Start Post-Order traversal from the root node ${treeRoot.value}.`,
      codeLine: 0,
      stack: [],
      highlightedNodes: {},
      threads: []
    });

    traverse(treeRoot);

    records.push({
      currentNode: null,
      visited: [...visited],
      explanation: `Post-Order traversal is complete! Visited nodes: [${visited.join(', ')}].`,
      codeLine: 5,
      stack: [],
      highlightedNodes: {},
      threads: []
    });

    return records;
  };

  const generateLevelOrderSteps = (treeRoot) => {
    const records = [];
    const visited = [];
    const queue = [];

    records.push({
      currentNode: treeRoot.value,
      visited: [],
      queue: [treeRoot.value],
      explanation: `Start Level-Order traversal. Enqueue root node ${treeRoot.value}.`,
      codeLine: 2,
      stack: [],
      highlightedNodes: { [treeRoot.value]: 'visiting' },
      threads: []
    });

    const runQueue = [{ node: treeRoot, path: [treeRoot.value] }];

    while (runQueue.length > 0) {
      const currentItem = runQueue.shift();
      const node = currentItem.node;
      
      visited.push(node.value);
      
      const currentQueueValues = runQueue.map(q => q.node.value);
      
      // Line 4: Dequeue and visit
      records.push({
        currentNode: node.value,
        visited: [...visited],
        queue: [node.value, ...currentQueueValues],
        explanation: `Dequeue node ${node.value} from the queue and visit it. Current path: [${visited.join(', ')}].`,
        codeLine: 4,
        stack: [],
        highlightedNodes: { [node.value]: 'visiting' },
        threads: []
      });

      // Line 5: Enqueue left child
      if (node.left) {
        currentQueueValues.push(node.left.value);
        runQueue.push({ node: node.left, path: [...currentItem.path, node.left.value] });
        records.push({
          currentNode: node.value,
          visited: [...visited],
          queue: [...currentQueueValues],
          explanation: `Node ${node.value} has a left child ${node.left.value}. Add it to the back of the queue.`,
          codeLine: 5,
          stack: [],
          highlightedNodes: { [node.value]: 'active', [node.left.value]: 'visiting' },
          threads: []
        });
      } else {
        records.push({
          currentNode: node.value,
          visited: [...visited],
          queue: [...currentQueueValues],
          explanation: `Node ${node.value} has no left child. Nothing to enqueue.`,
          codeLine: 5,
          stack: [],
          highlightedNodes: { [node.value]: 'active' },
          threads: []
        });
      }

      // Line 6: Enqueue right child
      if (node.right) {
        currentQueueValues.push(node.right.value);
        runQueue.push({ node: node.right, path: [...currentItem.path, node.right.value] });
        records.push({
          currentNode: node.value,
          visited: [...visited],
          queue: [...currentQueueValues],
          explanation: `Node ${node.value} has a right child ${node.right.value}. Add it to the back of the queue.`,
          codeLine: 6,
          stack: [],
          highlightedNodes: { [node.value]: 'active', [node.right.value]: 'visiting' },
          threads: []
        });
      } else {
        records.push({
          currentNode: node.value,
          visited: [...visited],
          queue: [...currentQueueValues],
          explanation: `Node ${node.value} has no right child. Nothing to enqueue.`,
          codeLine: 6,
          stack: [],
          highlightedNodes: { [node.value]: 'active' },
          threads: []
        });
      }
    }

    records.push({
      currentNode: null,
      visited: [...visited],
      queue: [],
      explanation: `The queue is empty! Level-Order traversal successfully finished.`,
      codeLine: 7,
      stack: [],
      highlightedNodes: {},
      threads: []
    });

    return records;
  };

  const generateMorrisSteps = (treeRoot) => {
    const records = [];
    const visited = [];
    let activeThreads = [];

    // Predecessor finder helper
    const findPredecessor = (currNode, leftSubtree) => {
      let pNode = leftSubtree;
      while (pNode.right && pNode.right.value !== currNode.value) {
        pNode = pNode.right;
      }
      return pNode;
    };

    let curr = treeRoot;

    records.push({
      currentNode: curr.value,
      visited: [],
      threads: [],
      explanation: `Initialize Morris Traversal. Set curr = root node (${curr.value}).`,
      codeLine: 1,
      stack: [],
      highlightedNodes: { [curr.value]: 'visiting' }
    });

    while (curr !== null) {
      if (curr.left === null) {
        visited.push(curr.value);
        
        records.push({
          currentNode: curr.value,
          visited: [...visited],
          threads: [...activeThreads],
          explanation: `Node ${curr.value} has no left child. Visit node ${curr.value} and move to the right child.`,
          codeLine: 4,
          stack: [],
          highlightedNodes: { [curr.value]: 'visiting' }
        });

        const nextNode = curr.right;
        curr = nextNode;

        if (curr) {
          records.push({
            currentNode: curr.value,
            visited: [...visited],
            threads: [...activeThreads],
            explanation: `Move curr to its right child pointer -> Node ${curr.value}.`,
            codeLine: 2,
            stack: [],
            highlightedNodes: { [curr.value]: 'visiting' }
          });
        }
      } else {
        const pred = findPredecessor(curr, curr.left);

        records.push({
          currentNode: curr.value,
          predecessor: pred.value,
          visited: [...visited],
          threads: [...activeThreads],
          explanation: `Node ${curr.value} has a left child. Search for its inorder predecessor: rightmost node in left subtree -> Node ${pred.value}.`,
          codeLine: 6,
          stack: [],
          highlightedNodes: { [curr.value]: 'active', [pred.value]: 'predecessor' }
        });

        const threadIdx = activeThreads.findIndex(t => t.from === pred.value && t.to === curr.value);

        if (threadIdx === -1) {
          // Predecessor's right is null, establish thread
          activeThreads.push({ from: pred.value, to: curr.value });

          records.push({
            currentNode: curr.value,
            predecessor: pred.value,
            visited: [...visited],
            threads: [...activeThreads],
            explanation: `Predecessor ${pred.value}'s right is null. Establish a temporary Thread (link) from ${pred.value} back to current node ${curr.value} to remember the return path.`,
            codeLine: 8,
            stack: [],
            highlightedNodes: { [curr.value]: 'active', [pred.value]: 'predecessor' }
          });

          const nextNode = curr.left;
          
          records.push({
            currentNode: nextNode.value,
            predecessor: pred.value,
            visited: [...visited],
            threads: [...activeThreads],
            explanation: `Thread established. Now safe to move current pointer to left child: Node ${nextNode.value}.`,
            codeLine: 9,
            stack: [],
            highlightedNodes: { [nextNode.value]: 'visiting', [pred.value]: 'predecessor' }
          });

          curr = nextNode;
        } else {
          // Thread already exists, clear it and visit current
          activeThreads = activeThreads.filter(t => !(t.from === pred.value && t.to === curr.value));

          records.push({
            currentNode: curr.value,
            predecessor: pred.value,
            visited: [...visited],
            threads: [...activeThreads],
            explanation: `Predecessor ${pred.value}'s right points to ${curr.value}. This indicates the left subtree was already traversed! Remove the temporary Thread to restore the tree.`,
            codeLine: 11,
            stack: [],
            highlightedNodes: { [curr.value]: 'active', [pred.value]: 'predecessor' }
          });

          visited.push(curr.value);

          records.push({
            currentNode: curr.value,
            predecessor: pred.value,
            visited: [...visited],
            threads: [...activeThreads],
            explanation: `Visit node ${curr.value}. Add it to the path: [${visited.join(', ')}].`,
            codeLine: 12,
            stack: [],
            highlightedNodes: { [curr.value]: 'visiting' }
          });

          const nextNode = curr.right;
          curr = nextNode;

          if (curr) {
            records.push({
              currentNode: curr.value,
              visited: [...visited],
              threads: [...activeThreads],
              explanation: `Now move current pointer to its right child: Node ${curr.value}.`,
              codeLine: 12,
              stack: [],
              highlightedNodes: { [curr.value]: 'visiting' }
            });
          }
        }
      }
    }

    records.push({
      currentNode: null,
      visited: [...visited],
      threads: [],
      explanation: `curr is null! Morris Traversal finished with O(1) extra space!`,
      codeLine: 15,
      stack: [],
      highlightedNodes: {}
    });

    return records;
  };

  // Start playback
  const startVisualizer = () => {
    if (!root) {
      setMessage('⚠️ Please insert a node or generate a random tree first!');
      return;
    }
    
    setIsAnimating(true);
    setQuizSubmitted(false);
    setSelectedOption(null);
    
    const preCalculated = preCalculateSteps();
    setSteps(preCalculated);
    
    let nextIdx = currentStepIdx === -1 || currentStepIdx >= preCalculated.length - 1 ? 0 : currentStepIdx + 1;
    setCurrentStepIdx(nextIdx);
  };

  // Animation effect loop
  useEffect(() => {
    if (!isAnimating || steps.length === 0) return;
    
    if (currentStepIdx >= steps.length) {
      setIsAnimating(false);
      return;
    }

    const currentStep = steps[currentStepIdx];
    setMessage(currentStep.explanation);

    // Schedule next step
    timerRef.current = setTimeout(() => {
      if (currentStepIdx < steps.length - 1) {
        setCurrentStepIdx(prev => prev + 1);
      } else {
        setIsAnimating(false);
        setMessage(`Traversal Finished! Visited Order: [${currentStep.visited.join(', ')}]`);
      }
    }, 1800 / speed);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isAnimating, currentStepIdx, steps, speed]);

  // Pause
  const pauseVisualizer = () => {
    setIsAnimating(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  // Next Step
  const stepForward = () => {
    setIsAnimating(false);
    let preCalculated = steps;
    if (steps.length === 0) {
      preCalculated = preCalculateSteps();
      setSteps(preCalculated);
    }
    
    if (currentStepIdx < preCalculated.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
    }
  };

  // Prev Step
  const stepBackward = () => {
    setIsAnimating(false);
    if (currentStepIdx > 0) {
      setCurrentStepIdx(prev => prev - 1);
    }
  };

  // Reset Playback
  function resetPlayback() {
    setIsAnimating(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentStepIdx(-1);
    setSteps([]);
    setMessage('Playback reset. Click Start Traversal to begin.');
  }

  const handleResetTree = () => {
    setRoot(null);
    resetPlayback();
    setMessage('Tree has been cleared. Add nodes or click Generate.');
  };

  // Quiz behaviors
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

  // Compute Tree Layout Coordinates to prevent visual overlaps
  const calculateCoordinates = (node, x = 400, y = 60, level = 0, nodesList = [], edgesList = []) => {
    if (!node) return { nodesList, edgesList };

    const nodeRadius = 24;
    // Exponential horizontal spacing per depth level to guarantee zero child overlaps
    const xOffset = 260 / Math.pow(2, level);
    const yOffset = 80;

    const currentStep = steps[currentStepIdx];
    const highlightedState = currentStep?.highlightedNodes?.[node.value] || null;

    nodesList.push({
      value: node.value,
      x,
      y,
      state: highlightedState, // 'visiting', 'active', 'predecessor', or null
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
        isMorrisThread: false
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
        isMorrisThread: false
      });
      calculateCoordinates(node.right, rightX, rightY, level + 1, nodesList, edgesList);
    }

    return { nodesList, edgesList };
  };

  const buildTreeRenderData = () => {
    if (!root) return { renderNodes: [], renderEdges: [] };
    const { nodesList, edgesList } = calculateCoordinates(root);

    // If Morris Traversal is active, render the thread connections dynamically!
    const currentStep = steps[currentStepIdx];
    if (currentStep?.threads && currentStep.threads.length > 0) {
      currentStep.threads.forEach(thread => {
        const fromNode = nodesList.find(n => n.value === thread.from);
        const toNode = nodesList.find(n => n.value === thread.to);
        
        if (fromNode && toNode) {
          edgesList.push({
            x1: fromNode.x,
            y1: fromNode.y,
            x2: toNode.x,
            y2: toNode.y,
            isMorrisThread: true
          });
        }
      });
    }

    return { renderNodes: nodesList, renderEdges: edgesList };
  };

  const { renderNodes, renderEdges } = buildTreeRenderData();

  // Find SVG boundary to ensure responsiveness
  const getSvgDimensions = () => {
    if (renderNodes.length === 0) return { width: 800, height: 400 };
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

  // Draw custom curves for Morris Traversal threads
  const drawMorrisCurve = (x1, y1, x2, y2) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    // Curved line curving to the right / up to differentiate from standard parent-child edges
    const cx = (x1 + x2) / 2 + 35;
    const cy = (y1 + y2) / 2 - 30;
    return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
  };

  // Clean up
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

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
              <Layers className="w-3.5 h-3.5" /> Binary Tree Algorithms
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-400 capitalize">
              {mode.replace('-', ' ')} Traversal
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Visualize recursive call stacks, queue progressions, and constant space threaded Morris algorithms.
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
            {['pre-order', 'in-order', 'post-order', 'level-order', 'morris'].map(tab => (
              <button
                key={tab}
                onClick={() => {
                  setMode(tab);
                  resetPlayback();
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                  mode === tab 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-950'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Tree Workspace & Controls */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Control Bar Card */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row gap-5 justify-between items-center shadow-lg shadow-black/20">
              {/* Insert / Generate Controls */}
              <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto">
                <button
                  onClick={generateRandomTree}
                  disabled={isAnimating}
                  className="px-4 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-all border border-slate-700/60 disabled:opacity-40"
                >
                  🎲 Random Balanced Tree
                </button>
                <div className="flex gap-1.5 flex-1 sm:flex-initial">
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Value (1-99)"
                    className="w-full sm:w-28 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                    disabled={isAnimating}
                    onKeyDown={(e) => e.key === 'Enter' && handleInsert()}
                  />
                  <button
                    onClick={handleInsert}
                    disabled={isAnimating}
                    className="px-3.5 py-2 text-xs font-bold bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:bg-primary-dark disabled:opacity-40 text-white hover:text-white rounded-xl transition-all font-semibold"
                  >
                    Insert
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
                        ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/35 border border-amber-800/40' 
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-950'
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

            {/* Explanation / Progress Bar */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-indigo-400" /> Current Step Activity
                </span>
                <span className="text-slate-500 font-bold bg-slate-950 px-2.5 py-0.5 rounded-full border border-slate-900">
                  Step {currentStepIdx !== -1 ? currentStepIdx + 1 : 0} / {steps.length || 0}
                </span>
              </div>
              <div className="text-sm font-medium text-indigo-200/90 leading-relaxed min-h-[40px]">
                {message}
              </div>
            </div>

            {/* Tree SVG Visualization Area */}
            <div className="bg-slate-900/30 border border-slate-850 rounded-3xl p-6 shadow-inner relative overflow-hidden flex flex-col justify-center min-h-[440px] items-center">
              
              {/* Dynamic Overlay labels */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-800 px-2.5 py-1 rounded-lg">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-md shadow-emerald-950"></span>
                  <span className="text-slate-400">Current Node (curr)</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-800 px-2.5 py-1 rounded-lg">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-md shadow-amber-950"></span>
                  <span className="text-slate-400">Visited Node</span>
                </div>
                {mode === 'morris' && (
                  <>
                    <div className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-800 px-2.5 py-1 rounded-lg">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-md shadow-purple-950"></span>
                      <span className="text-slate-400">Predecessor (pred)</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-950/70 border border-slate-800 px-2.5 py-1 rounded-lg">
                      <span className="w-6 border-t-2 border-dashed border-purple-500"></span>
                      <span className="text-slate-400">Temporary Thread Link</span>
                    </div>
                  </>
                )}
              </div>

              {/* Main SVG Render */}
              {renderNodes.length > 0 ? (
                <div className="overflow-auto w-full flex justify-center py-6">
                  <svg
                    width={svgDimensions.width}
                    height={svgDimensions.height}
                    viewBox={`${svgDimensions.viewBoxOffset} 0 ${svgDimensions.width} ${svgDimensions.height}`}
                    className="max-w-full h-auto transition-transform duration-300"
                  >
                    <defs>
                      <marker id="arrow-morris" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#c084fc" />
                      </marker>
                    </defs>

                    {/* Render Edges / Thread lines */}
                    {renderEdges.map((edge, idx) => {
                      if (edge.isMorrisThread) {
                        return (
                          <path
                            key={`thread-${idx}`}
                            d={drawMorrisCurve(edge.x1, edge.y1, edge.x2, edge.y2)}
                            fill="none"
                            stroke="#c084fc"
                            strokeWidth="2.5"
                            strokeDasharray="6,4"
                            markerEnd="url(#arrow-morris)"
                            className="animate-pulse"
                          />
                        );
                      }
                      return (
                        <line
                          key={`edge-${idx}`}
                          x1={edge.x1}
                          y1={edge.y1}
                          x2={edge.x2}
                          y2={edge.y2}
                          stroke="#334155"
                          strokeWidth="2.5"
                        />
                      );
                    })}

                    {/* Render Nodes */}
                    {renderNodes.map((node, idx) => {
                      const isCurr = node.state === 'visiting';
                      const isPred = node.state === 'predecessor';
                      const isActive = node.state === 'active';
                      const isVisited = node.isVisited;

                      let nodeColor = 'bg-slate-900 border-slate-700 text-slate-300';
                      let fillHex = '#0f172a';
                      let strokeHex = '#334155';

                      if (isCurr) {
                        fillHex = '#10b981'; // emerald-500
                        strokeHex = '#34d399';
                      } else if (isPred) {
                        fillHex = '#a855f7'; // purple-500
                        strokeHex = '#c084fc';
                      } else if (isVisited) {
                        fillHex = '#f59e0b'; // amber-500
                        strokeHex = '#fbbf24';
                      } else if (isActive) {
                        fillHex = '#3b82f6'; // blue-500
                        strokeHex = '#60a5fa';
                      }

                      return (
                        <g key={`node-${idx}`} className="transition-all duration-300">
                          {/* Outer glow ring for curr or predecessor */}
                          {(isCurr || isPred) && (
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
                          
                          {/* Main node circle */}
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r="21"
                            fill={fillHex}
                            stroke={strokeHex}
                            strokeWidth="2.5"
                            className="transition-all duration-300 shadow-xl shadow-black"
                          />

                          {/* Inner text node label */}
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

                          {/* Extra pointers labels inside SVGs */}
                          {isCurr && (
                            <g transform={`translate(${node.x - 22}, ${node.y - 35})`}>
                              <rect width="44" height="15" rx="4" fill="#047857" className="stroke stroke-emerald-400" strokeWidth="0.5" />
                              <text x="22" y="11" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle">curr</text>
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

              {/* BFS Queue or Stack Visualization strip */}
              {currentStep && (
                <div className="w-full mt-4 border-t border-slate-800 pt-4 flex flex-col gap-2 bg-slate-950/60 p-4 rounded-xl border border-slate-850">
                  {mode === 'level-order' && (
                    <div className="flex items-center gap-3">
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider w-16">FIFO Queue:</div>
                      <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                        {currentStep.queue && currentStep.queue.length > 0 ? (
                          currentStep.queue.map((val, qidx) => (
                            <div
                              key={`q-${qidx}`}
                              className={`px-3 py-1 text-xs font-bold rounded-lg border flex items-center justify-center min-w-8 ${
                                qidx === 0
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                  : 'bg-slate-900 border-slate-800 text-slate-400'
                              }`}
                            >
                              {val}
                            </div>
                          ))
                        ) : (
                          <div className="text-slate-600 text-xs italic">Queue is empty</div>
                        )}
                      </div>
                    </div>
                  )}

                  {(mode === 'pre-order' || mode === 'in-order' || mode === 'post-order') && (
                    <div className="flex items-center gap-3">
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider w-16">Call Stack:</div>
                      <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                        {currentStep.stack && currentStep.stack.length > 0 ? (
                          currentStep.stack.map((val, sidx) => (
                            <div
                              key={`s-${sidx}`}
                              className="px-3 py-1 text-xs font-bold rounded-lg border bg-indigo-950/20 text-indigo-300 border-indigo-500/20"
                            >
                              {val}
                            </div>
                          ))
                        ) : (
                          <div className="text-slate-600 text-xs italic">Recursion stack empty (at root level)</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Active Traversal Result Path Output */}
                  <div className="flex items-center gap-3 mt-1.5 border-t border-slate-900 pt-2">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider w-16">Result Path:</div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {currentStep.visited && currentStep.visited.length > 0 ? (
                        currentStep.visited.map((val, pidx) => (
                          <React.Fragment key={`p-${pidx}`}>
                            <div className="px-2.5 py-0.5 text-xs font-bold rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow shadow-amber-950/30">
                              {val}
                            </div>
                            {pidx < currentStep.visited.length - 1 && (
                              <span className="text-slate-700 text-xs font-bold">→</span>
                            )}
                          </React.Fragment>
                        ))
                      ) : (
                        <div className="text-slate-600 text-xs italic">No nodes visited yet. Click Play.</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Complexity Information Panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Time Complexity Card */}
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

              {/* Space Complexity Card */}
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

          {/* RIGHT: Code Block & Quiz Modules */}
          <div className="lg:col-span-4 flex flex-col gap-6 w-full">
            
            {/* Interactive Code Highlighter Card */}
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
                          ? 'bg-indigo-600/25 text-indigo-200 font-semibold border-l-2 border-indigo-500 pl-1.5'
                          : ''
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

                {/* Option list */}
                <div className="flex flex-col gap-2">
                  {activeQuestion.options.map((opt, oIdx) => {
                    const isSelected = selectedOption === oIdx;
                    const isCorrect = oIdx === activeQuestion.answer;
                    
                    let btnColor = 'bg-slate-950 hover:bg-slate-800/80 border-slate-800 text-slate-400';
                    if (isSelected) {
                      btnColor = 'bg-indigo-950/40 border-indigo-500 text-indigo-300';
                    }
                    if (quizSubmitted) {
                      if (isCorrect) {
                        btnColor = 'bg-emerald-950/40 border-emerald-500 text-emerald-300';
                      } else if (isSelected) {
                        btnColor = 'bg-rose-950/40 border-rose-500 text-rose-300';
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
                        {quizSubmitted && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
                        {quizSubmitted && isSelected && !isCorrect && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
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
                        {selectedOption === activeQuestion.answer ? '🎉 Correct Answer!' : '❌ Incorrect Answer'}
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
