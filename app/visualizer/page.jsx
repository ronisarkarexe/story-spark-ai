import React from "react";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import VisualizerClient from "./VisualizerClient";
import ArrayModal from "@/app/components/models/ArrayModal";
import StackModal from "@/app/components/models/StackModel";
import QueueModal from "@/app/components/models/QueueModal";
import LinkedListModal from "@/app/components/models/LinkedListModal";
import TreeModal from "@/app/components/models/TreeModal";
import GraphModal from "@/app/components/models/GraphModal";
import TutorialOverlay from "@/app/components/ui/TutorialOverlay";
import BackToTop from "../components/ui/backtotop";

export const metadata = {
  title: "Algorithm Visualizer | AlgoBuddy",
  description:
    "Explore visual representations and source code for various DSA algorithms including searching, sorting, stacks, queues, trees, graphs, and stack-based expression evaluation like Polish Notation using arrays and linked lists. Interactive and beginner-friendly!",
  keywords: [
    "DSA Visualizer",
    "Algorithm Visualizer",
    "Data Structures",
    "Searching Algorithms",
    "Sorting Algorithms",
    "Stack",
    "Queue",
    "Tree",
    "Graph",
    "Graph Algorithms",
    "BFS",
    "DFS",
    "Linear Search",
    "Bubble Sort",
    "Tree Traversal",
    "Heap Sort",
    "Linked List",
    "Singly Linked List",
    "Doubly Linked List",
    "Circular Linked List",
    "Prefix Notation",
    "Postfix Notation",
    "Polish Notation",
    "Stack using Array",
    "Stack using Linked List",
    "Prefix using Stack",
    "Postfix using Stack",
    "Polish Notation Implementation",
    "Queue using Array",
    "Queue using Linked List",
    "Circular Queue",
    "Priority Queue",
    "Deque",
    "Queue Operations",
    "Graph Traversal",
    "Code for DSA Algorithms",
    "Code for Data Structures",
    "Interactive Code Samples",
    "DSA with Code",
  ],
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og/visualizer.png",
        width: 1200,
        height: 630,
        alt: "Algorithm Visualization",
      },
    ],
  },
};

const sections = [
  {
    title: "Custom Code",
    desc: "Paste code and inspect a safe step-by-step dry run",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 9l-4 3 4 3m8-6l4 3-4 3M14 5l-4 14"
        />
      </svg>
    ),
    info: {
      About:
        "The custom code dry-run visualizer helps learners paste short algorithm snippets and inspect line-by-line execution state without running unsafe code.",
      Representation: null,
    },
    subsections: [
      {
        title: "Dry Run",
        items: [
          {
            name: "User Code Dry Run Visualizer",
            path: "/visualizer/dry-run",
          },
        ],
      },
    ],
  },
  {
    title: "Array",
    desc: "Searching & sorting algorithms on contiguous memory",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    ),
    info: {
      About:
        "An array is a data structure that stores multiple values of the same type in a single variable. Each value is stored at a specific index, starting from 0.",
      Representation: <ArrayModal />,
    },
    subsections: [
      {
        title: "Searching",
        items: [
          { name: "Linear Search", path: "/visualizer/searching/linearsearch" },
          { name: "Binary Search", path: "/visualizer/searching/binarysearch" },
        ],
      },
      {
        title: "Sorting",
        items: [
          { name: "Bubble Sort", path: "/visualizer/sorting/bubblesort" },
          { name: "Selection Sort", path: "/visualizer/sorting/selectionsort" },
          { name: "Insertion Sort", path: "/visualizer/sorting/insertionsort" },
          { name: "Merge Sort", path: "/visualizer/sorting/mergesort" },
          { name: "Quick Sort", path: "/visualizer/sorting/quicksort" },
        ],
      },
    ],
  },
  {
    title: "Stack",
    desc: "LIFO operations, polish notations & implementations",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
        />
      </svg>
    ),
    info: {
      About:
        "LIFO data structure; push adds to top; pop removes from top; peek views top; works like a stack of plates. Used in function calls, undo, expression evaluation.",
      Representation: <StackModal />,
    },
    subsections: [
      {
        title: "Operations",
        items: [
          { name: "Push & Pop", path: "/visualizer/stack/push-pop" },
          { name: "Peek", path: "/visualizer/stack/peek" },
          { name: "Is Empty", path: "/visualizer/stack/isempty" },
          { name: "Is Full", path: "/visualizer/stack/isfull" },
        ],
      },
      {
        title: "Polish Notations Evaluation",
        items: [
          { name: "Postfix", path: "/visualizer/stack/polish/postfix" },
          { name: "Prefix", path: "/visualizer/stack/polish/prefix" },
        ],
      },
      {
        title: "Implementation",
        items: [
          {
            name: "Using Array",
            path: "/visualizer/stack/implementation/usingArray",
          },
          {
            name: "Using Linked List",
            path: "/visualizer/stack/implementation/usingLinkedList",
          },
        ],
      },
    ],
  },
  {
    title: "Queue",
    desc: "FIFO operations, variants & implementations",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16m-7 6h7"
        />
      </svg>
    ),
    info: {
      About:
        "FIFO data structure; enqueue adds to rear; dequeue removes from front; peek views front; works like a line in a queue. Used in scheduling, buffering, BFS.",
      Representation: <QueueModal />,
    },
    subsections: [
      {
        title: "Operations",
        items: [
          {
            name: "Enqueue & Dequeue",
            path: "/visualizer/queue/operations/enqueue-dequeue",
          },
          {
            name: "Peek Front",
            path: "/visualizer/queue/operations/peek-front",
          },
          { name: "Is Empty", path: "/visualizer/queue/operations/isempty" },
          { name: "Is Full", path: "/visualizer/queue/operations/isfull" },
        ],
      },
      {
        title: "Types",
        items: [
          {
            name: "Single Ended Queue",
            path: "/visualizer/queue/types/singleEnded",
          },
          {
            name: "Double Ended Queue",
            path: "/visualizer/queue/types/deque",
          },
          { name: "Circular Queue", path: "/visualizer/queue/types/circular" },
          { name: "Priority Queue", path: "/visualizer/queue/types/priority" },
        ],
      },
      {
        title: "Implementation",
        items: [
          {
            name: "Using Array",
            path: "/visualizer/queue/implementation/array",
          },
          {
            name: "Using Linked List",
            path: "/visualizer/queue/implementation/linkedList",
          },
        ],
      },
    ],
  },
  {
    title: "Linked List",
    desc: "Singly, doubly, circular — traversal to merge",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 5l7 7-7 7"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 5l7 7-7 7"
        />
      </svg>
    ),
    info: {
      About:
        "Linear data structure; elements (nodes) connected using pointers; each node has data + next; no fixed size; types: singly, doubly, circular. Used in dynamic memory, insert/delete operations.",
      Representation: <LinkedListModal />,
    },
    subsections: [
      {
        title: "Types",
        items: [
          {
            name: "Singly Linked List",
            path: "/visualizer/linkedList/types/singly",
          },
          {
            name: "Doubly Linked List",
            path: "/visualizer/linkedList/types/doubly",
          },
          {
            name: "Circular Linked List",
            path: "/visualizer/linkedList/types/circular",
          },
        ],
      },
      {
        title: "Operations",
        items: [
          {
            name: "Traversal",
            path: "/visualizer/linkedList/operations/traversal",
          },
          {
            name: "Insertion",
            path: "/visualizer/linkedList/operations/insertion",
          },
          {
            name: "Deletion",
            path: "/visualizer/linkedList/operations/deletion",
          },
          {
            name: "Searching",
            path: "/visualizer/linkedList/operations/search",
          },
          {
            name: "Reverse",
            path: "/visualizer/linkedList/operations/reverse",
          },
          {
            name: "Merge",
            path: "/visualizer/linkedList/operations/merge",
          },
          {
            name: "Comparison",
            path: "/visualizer/linkedList/operations/comparison",
          },
        ],
      },
    ],
  },
  {
    title: "Tree",
    desc: "BST, AVL, traversals, tries & advanced trees",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12h6m-6 4h6m0-8h6m6 0h-6m6 4h-6m-6-8v12m6-12v12"
        />
      </svg>
    ),
    info: {
      About:
        "Hierarchical data structure; has root, nodes, edges; each node has parent/child; no cycles; Used in hierarchies, file systems, searching.",
      Types: "binary tree, BST, AVL, etc.",
      Representation: <TreeModal maxLevel={3} />,
    },
    subsections: [
      {
        title: "Binary Tree",
        items: [
          {
            name: "Structure & Properties",
            path: "/visualizer/trees/binaryTree/properties",
          },
          {
            name: "Types of Binary Trees",
            path: "/visualizer/trees/binaryTree/types",
          },
        ],
      },
      {
        title: "Binary Search Tree",
        items: [
          { name: "Insertion", path: "/visualizer/trees/bst/insertion" },
          { name: "Deletion", path: "/visualizer/trees/bst/deletion" },
          { name: "Searching", path: "/visualizer/trees/bst/searching" },
          { name: "Balancing (AVL)", path: "/visualizer/trees/bst/avl" },
        ],
      },
      {
        title: "Traversal",
        items: [
          { name: "Pre-order", path: "/visualizer/trees/traversing/pre-order" },
          { name: "In-order", path: "/visualizer/trees/traversing/in-order" },
          {
            name: "Post-order",
            path: "/visualizer/trees/traversing/post-order",
          },
          {
            name: "Level-order (BFS)",
            path: "/visualizer/trees/traversing/level-order",
          },
          {
            name: "Morris Traversal",
            path: "/visualizer/trees/traversing/morris",
          },
        ],
      },
      {
        title: "Advanced Trees",
        items: [
          {
            name: "Red-Black Trees",
            path: "/visualizer/trees/advanced/red-black",
          },
          { name: "B-Trees", path: "/visualizer/trees/advanced/b-trees" },
          {
            name: "Trie (Prefix Tree)",
            path: "/visualizer/trees/advanced/trie",
          },
          { name: "Segment Trees", path: "/visualizer/trees/advanced/segment" },
          { name: "Fenwick Trees", path: "/visualizer/trees/advanced/fenwick" },
        ],
      },
      {
        title: "Algorithms",
        items: [
          {
            name: "Lowest Common Ancestor",
            path: "/visualizer/trees/algorithms/lca",
          },
          {
            name: "Tree Diameter",
            path: "/visualizer/trees/algorithms/diameter",
          },
          {
            name: "Tree Isomorphism",
            path: "/visualizer/trees/algorithms/isomorphism",
          },
          {
            name: "Serialize/Deserialize",
            path: "/visualizer/trees/algorithms/serialization",
          },
        ],
      },
      {
        title: "Applications",
        items: [
          {
            name: "Heap Sort",
            path: "/visualizer/trees/applications/heapsort",
          },
          {
            name: "Huffman Coding",
            path: "/visualizer/trees/applications/huffman",
          },
          {
            name: "Decision Trees",
            path: "/visualizer/trees/applications/decision-trees",
          },
          {
            name: "Syntax Trees",
            path: "/visualizer/trees/applications/syntax-trees",
          },
        ],
      },
    ],
  },
  {
    title: "HashMap",
    desc: "Key-value pairs with hash function and collision handling",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
        />
      </svg>
    ),
    info: {
      About:
        "HashMap stores key-value pairs using a hash function to compute bucket index. Provides O(1) average time for insert, search, and delete. Collision handled via chaining.",
      Representation: null,
    },
    subsections: [
      {
        title: "Operations",
        items: [
          { name: "Insert (put)", path: "/visualizer/hashmap/insert" },
          { name: "Search (get)", path: "/visualizer/hashmap/search" },
          { name: "Delete (remove)", path: "/visualizer/hashmap/delete" },
        ],
      },
    ],
  },
  {
    title: "Graph",
    desc: "BFS, DFS, Dijkstra, MST & topological sort",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    info: {
      About:
        "A graph is a data structure made up of: Nodes (also called vertices) Represent entities. Edges Represent connections between nodes.",
      Representation: <GraphModal />,
    },
    subsections: [
      {
        title: "Representation",
        items: [
          {
            name: "Adjacency Matrix",
            path: "/visualizer/graph/adjacency-matrix",
          },
          {
            name: "Adjacency List",
            path: "/visualizer/graph/adjacency-list",
          },
        ],
      },
      {
        title: "Traversal",
        items: [
          {
            name: "Breadth-First Search (BFS)",
            path: "/visualizer/graph/bfs",
          },
          {
            name: "Depth-First Search (DFS)",
            path: "/visualizer/graph/dfs",
          },
        ],
      },
      {
        title: "Algorithms",
        items: [
          {
            name: "Dijkstra's Algorithm",
            path: "/visualizer/graph/dijkstra",
          },
          {
            name: "Prim's Algorithm",
            path: "/visualizer/graph/prim",
          },
          {
            name: "Kruskal's Algorithm",
            path: "/visualizer/graph/kruskal",
          },
          {
            name: "Topological Sort",
            path: "/visualizer/graph/topological-sort",
          },
        ],
      },
    ],
  },
];

const Visualizer = () => {
  /* Strip non-serialisable `info` (contains JSX modals) before
     passing to the client component. Icons are fine — they're
     plain <svg> elements. */
  const clientSections = sections.map(({ info, ...rest }) => rest);

  return (
    <div
      className="min-h-screen bg-white dark:bg-[#1c1d1f] text-gray-800 dark:text-gray-200 flex flex-col"
      style={{ fontFamily: "'Inter', 'Source Sans 3', sans-serif" }}
    >
      <Navbar />
      <TutorialOverlay />
      <VisualizerClient initialSections={clientSections} />
      <div className="w-full relative z-10">
        
        <BackToTop />
        <Footer />
      </div>
    </div>
  );
};

export default Visualizer;
