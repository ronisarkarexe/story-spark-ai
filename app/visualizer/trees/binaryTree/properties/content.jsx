'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  HelpCircle, 
  Layers, 
  GitFork, 
  TrendingUp, 
  Binary, 
  Database,
  ChevronRight,
  Info
} from 'lucide-react';

export default function Content() {
  const [selectedNode, setSelectedNode] = useState('A');

  // Pre-calculated node properties for the interactive sample tree
  const treeNodes = {
    A: {
      name: 'Node A',
      type: 'Root Node',
      typeDesc: 'The topmost node of the tree, which has no parent.',
      parent: 'None (It is the root)',
      children: 'B, C',
      siblings: 'None',
      degree: 2,
      depth: 0,
      level: 1,
      height: 2,
      color: 'from-purple-500 to-indigo-600',
    },
    B: {
      name: 'Node B',
      type: 'Internal Node',
      typeDesc: 'A node that is not a leaf; it has a parent and at least one child.',
      parent: 'A',
      children: 'D, E',
      siblings: 'C',
      degree: 2,
      depth: 1,
      level: 2,
      height: 1,
      color: 'from-blue-500 to-cyan-600',
    },
    C: {
      name: 'Node C',
      type: 'Internal Node',
      typeDesc: 'A node that is not a leaf; it has a parent and at least one child.',
      parent: 'A',
      children: 'F, G',
      siblings: 'B',
      degree: 2,
      depth: 1,
      level: 2,
      height: 1,
      color: 'from-blue-500 to-cyan-600',
    },
    D: {
      name: 'Node D',
      type: 'Leaf Node',
      typeDesc: 'A node with no children (degree 0). It terminates a branch.',
      parent: 'B',
      children: 'None',
      siblings: 'E',
      degree: 0,
      depth: 2,
      level: 3,
      height: 0,
      color: 'from-emerald-500 to-teal-600',
    },
    E: {
      name: 'Node E',
      type: 'Leaf Node',
      typeDesc: 'A node with no children (degree 0). It terminates a branch.',
      parent: 'B',
      children: 'None',
      siblings: 'D',
      degree: 0,
      depth: 2,
      level: 3,
      height: 0,
      color: 'from-emerald-500 to-teal-600',
    },
    F: {
      name: 'Node F',
      type: 'Leaf Node',
      typeDesc: 'A node with no children (degree 0). It terminates a branch.',
      parent: 'C',
      children: 'None',
      siblings: 'G',
      degree: 0,
      depth: 2,
      level: 3,
      height: 0,
      color: 'from-emerald-500 to-teal-600',
    },
    G: {
      name: 'Node G',
      type: 'Leaf Node',
      typeDesc: 'A node with no children (degree 0). It terminates a branch.',
      parent: 'C',
      children: 'None',
      siblings: 'F',
      degree: 0,
      depth: 2,
      level: 3,
      height: 0,
      color: 'from-emerald-500 to-teal-600',
    }
  };

  const terminology = [
    {
      title: 'Root Node',
      desc: 'The unique topmost node in a tree. Every search or traversal starts here. It has no incoming edges and is the ancestor of all other nodes.',
      badge: 'Start'
    },
    {
      title: 'Parent Node',
      desc: 'Any node that has a direct link (edge) to one or more subordinate nodes. A node can have at most one parent in a tree.',
      badge: 'Predecessor'
    },
    {
      title: 'Child Node',
      desc: 'A node connected directly to another node when moving away from the root. A node can have 0, 1, or 2 children in a binary tree.',
      badge: 'Successor'
    },
    {
      title: 'Sibling Node',
      desc: 'Nodes that share the exact same parent node. For example, B and C are siblings as they share parent A.',
      badge: 'Peers'
    },
    {
      title: 'Leaf Node',
      desc: 'A terminal node containing no children (degree 0). Leaf nodes represent the endpoints of paths starting at the root.',
      badge: 'End'
    },
    {
      title: 'Internal Node',
      desc: 'A non-leaf node. An internal node has a parent and at least one child (degree > 0). It connects structure branches together.',
      badge: 'Middle'
    },
    {
      title: 'Subtree',
      desc: 'A tree structure formed by taking any node in the tree along with all its descendants. Every node forms the root of its own subtree.',
      badge: 'Sub-structure'
    }
  ];

  const structuralProperties = [
    {
      name: 'Degree of a Node',
      desc: 'The number of children directly connected to that node. In a binary tree, the degree of any node can only be 0, 1, or 2.',
      detail: 'Leaves have a degree of 0, while full internal nodes have a degree of 2.'
    },
    {
      name: 'Height of a Node',
      desc: 'The number of edges on the longest downward path from that node to a leaf node. Leaf nodes always have a height of 0.',
      detail: 'Calculated recursively as: height(u) = 1 + max(height(u.left), height(u.right)).'
    },
    {
      name: 'Height of a Tree',
      desc: 'The height of the Root Node. It represents the maximum length of any path from the root to any leaf in the tree.',
      detail: 'An empty tree typically has height -1 (or 0 under some conventions), and a single-node tree has height 0.'
    },
    {
      name: 'Depth of a Node',
      desc: 'The number of edges on the path from the root node to that specific node. The depth of the root node is 0.',
      detail: 'Depth measures how far down a node is from the root of the tree.'
    },
    {
      name: 'Level of a Node',
      desc: 'The position or tier of a node in the tree hierarchy. It is commonly defined as 1-based, where Level = Depth + 1.',
      detail: 'The root node sits at Level 1, its children at Level 2, grandchildren at Level 3, and so on.'
    }
  ];

  const formulas = [
    {
      title: 'Maximum Nodes at Level i',
      formula: '2^i',
      variableDesc: 'where i is the 0-based level index (depth)',
      example: 'At Level 2 (depth 2), the maximum number of nodes is 2^2 = 4 nodes (which are D, E, F, G in a perfect tree).'
    },
    {
      title: 'Maximum Nodes in Tree of Height h',
      formula: '2^(h + 1) - 1',
      variableDesc: 'where h is the tree height',
      example: 'For a tree of height h = 2, the maximum nodes = 2^(2 + 1) - 1 = 8 - 1 = 7 nodes.'
    },
    {
      title: 'Leaves vs Degree-2 Nodes',
      formula: 'L = N₂ + 1',
      variableDesc: 'where L is leaf count, N₂ is number of nodes with degree 2',
      example: 'In a complete tree with 3 degree-2 nodes (A, B, C), the leaf count is L = 3 + 1 = 4 leaves.'
    },
    {
      title: 'Minimum Height for N Nodes',
      formula: '⌈log₂(N + 1)⌉ - 1',
      variableDesc: 'where N is the total number of nodes',
      example: 'For N = 7 nodes, the minimum height is ⌈log₂(7 + 1)⌉ - 1 = ⌈log₂(8)⌉ - 1 = 3 - 1 = 2.'
    }
  ];

  const applications = [
    {
      title: 'Expression Trees',
      desc: 'Used by compilers and interpreters to evaluate algebraic expressions. Operators act as internal nodes, while operands represent leaves.',
      icon: <Binary className="w-6 h-6 text-purple-500" />
    },
    {
      title: 'File Systems',
      desc: 'While general hierarchies represent folders, directory search structures are frequently balanced using binary trees to enable instantaneous lookups.',
      icon: <Database className="w-6 h-6 text-primary" />
    },
    {
      title: 'Decision Trees',
      desc: 'Used extensively in Artificial Intelligence, machine learning algorithms, and expert systems to categorize objects and predict actions step-by-step.',
      icon: <GitFork className="w-6 h-6 text-emerald-500" />
    },
    {
      title: 'Syntax Trees',
      desc: 'Abstract Syntax Trees (ASTs) represent the logical grammar of program source code, critical for language parsers, compilers, and transpilers.',
      icon: <Layers className="w-6 h-6 text-orange-500" />
    },
    {
      title: 'Searching & Indexing',
      desc: 'Self-balancing binary search trees (e.g. AVL, Red-Black Trees) are the foundation of database indexing systems, guaranteeing fast O(log N) searches.',
      icon: <TrendingUp className="w-6 h-6 text-cyan-500" />
    }
  ];

  return (
    <main className="max-w-4xl mx-auto space-y-12">
      {/* Introduction Section */}
      <section className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-7 h-7 text-[#a435f0]" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Introduction to Binary Trees</h2>
        </div>
        <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed text-base">
          <p>
            A <strong>Binary Tree</strong> is a hierarchical data structure in which each node has at most two children, 
            referred to as the <strong>left child</strong> and the <strong>right child</strong>. Unlike linear structures 
            like arrays, linked lists, stacks, and queues, trees store elements in an organized parent-child hierarchy, 
            which makes them extremely powerful for organizing data that naturally features hierarchical relationships.
          </p>
          <p>
            Binary trees serve as the foundational bedrock for highly efficient advanced structures like 
            Binary Search Trees (BST), AVL trees, Heaps, and Huffman coding trees. Understanding the structure 
            and essential formulas governing binary trees is the single most critical step in mastering data structures 
            and algorithm complexity.
          </p>
        </div>
      </section>

      {/* Interactive Example Tree Section */}
      <section className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-3 mb-6">
          <Layers className="w-7 h-7 text-[#a435f0]" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Interactive Tree Property Inspector</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
          Click or tap on any node in the SVG tree below to inspect its unique properties, structural metrics, 
          and category type dynamically!
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Tree SVG Visualization */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-neutral-950 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-inner">
            <svg 
              viewBox="0 0 300 200" 
              className="w-full max-w-[340px] h-auto drop-shadow-md select-none"
            >
              {/* Edges */}
              <line x1="150" y1="40" x2="75" y2="100" className="stroke-gray-300 dark:stroke-neutral-700" strokeWidth="2.5" />
              <line x1="150" y1="40" x2="225" y2="100" className="stroke-gray-300 dark:stroke-neutral-700" strokeWidth="2.5" />
              <line x1="75" y1="100" x2="35" y2="160" className="stroke-gray-300 dark:stroke-neutral-700" strokeWidth="2.5" />
              <line x1="75" y1="100" x2="115" y2="160" className="stroke-gray-300 dark:stroke-neutral-700" strokeWidth="2.5" />
              <line x1="225" y1="100" x2="185" y2="160" className="stroke-gray-300 dark:stroke-neutral-700" strokeWidth="2.5" />
              <line x1="225" y1="100" x2="265" y2="160" className="stroke-gray-300 dark:stroke-neutral-700" strokeWidth="2.5" />

              {/* Nodes */}
              {[
                { id: 'A', cx: 150, cy: 40, label: 'A' },
                { id: 'B', cx: 75, cy: 100, label: 'B' },
                { id: 'C', cx: 225, cy: 100, label: 'C' },
                { id: 'D', cx: 35, cy: 160, label: 'D' },
                { id: 'E', cx: 115, cy: 160, label: 'E' },
                { id: 'F', cx: 185, cy: 160, label: 'F' },
                { id: 'G', cx: 265, cy: 160, label: 'G' },
              ].map((node) => {
                const isSelected = selectedNode === node.id;
                return (
                  <g 
                    key={node.id} 
                    className="cursor-pointer group"
                    onClick={() => setSelectedNode(node.id)}
                  >
                    <circle
                      cx={node.cx}
                      cy={node.cy}
                      r="16"
                      className={`transition-all duration-300 stroke-[2.5px] ${
                        isSelected 
                          ? 'fill-purple-600 stroke-purple-300 dark:stroke-purple-800 r-18' 
                          : 'fill-blue-500 stroke-blue-700 dark:fill-zinc-800 dark:stroke-neutral-600 group-hover:fill-blue-400 dark:group-hover:fill-neutral-700'
                      }`}
                    />
                    <text
                      x={node.cx}
                      y={node.cy + 5}
                      textAnchor="middle"
                      className="font-bold text-sm fill-white select-none pointer-events-none"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
            <div className="mt-4 text-xs text-gray-500 dark:text-neutral-400 font-medium italic">
              💡 Tip: Click nodes to inspect properties!
            </div>
          </div>

          {/* Node Property Display Panel */}
          <div className="lg:col-span-6 flex flex-col justify-between h-full bg-gray-50 dark:bg-neutral-950 rounded-2xl p-6 border border-gray-100 dark:border-neutral-800 transition-all">
            <div>
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-neutral-800 pb-3 mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full bg-gradient-to-r ${treeNodes[selectedNode].color}`} />
                  Properties of {treeNodes[selectedNode].name}
                </h3>
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 rounded-full text-xs font-bold uppercase tracking-wider">
                  {treeNodes[selectedNode].type}
                </span>
              </div>

              <div className="text-sm text-gray-500 dark:text-neutral-400 mb-4 bg-white dark:bg-neutral-900 border border-gray-200/50 dark:border-neutral-800/80 rounded-xl p-3 flex gap-2">
                <Info className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <p>{treeNodes[selectedNode].typeDesc}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-neutral-900 p-3 rounded-xl border border-gray-100 dark:border-neutral-800/60 shadow-sm">
                  <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Parent</span>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{treeNodes[selectedNode].parent}</span>
                </div>
                <div className="bg-white dark:bg-neutral-900 p-3 rounded-xl border border-gray-100 dark:border-neutral-800/60 shadow-sm">
                  <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Children</span>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{treeNodes[selectedNode].children}</span>
                </div>
                <div className="bg-white dark:bg-neutral-900 p-3 rounded-xl border border-gray-100 dark:border-neutral-800/60 shadow-sm">
                  <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Siblings</span>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{treeNodes[selectedNode].siblings}</span>
                </div>
                <div className="bg-white dark:bg-neutral-900 p-3 rounded-xl border border-gray-100 dark:border-neutral-800/60 shadow-sm">
                  <span className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Node Degree</span>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{treeNodes[selectedNode].degree}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-gray-200 dark:border-neutral-800">
              <div className="text-center bg-purple-500/10 dark:bg-purple-500/5 py-2.5 rounded-xl border border-purple-200/40 dark:border-purple-950/20">
                <span className="block text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase mb-0.5">Depth</span>
                <span className="text-lg font-black text-purple-700 dark:text-purple-300">{treeNodes[selectedNode].depth}</span>
              </div>
              <div className="text-center bg-primary/10 dark:bg-primary/5 py-2.5 rounded-xl border border-blue-200/40 dark:border-blue-950/20">
                <span className="block text-xs font-semibold text-primary dark:text-[#c27cf7] uppercase mb-0.5">Level</span>
                <span className="text-lg font-black text-primary-dark dark:text-[#c27cf7]">{treeNodes[selectedNode].level}</span>
              </div>
              <div className="text-center bg-emerald-500/10 dark:bg-emerald-500/5 py-2.5 rounded-xl border border-emerald-200/40 dark:border-emerald-950/20">
                <span className="block text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase mb-0.5">Height</span>
                <span className="text-lg font-black text-emerald-700 dark:text-emerald-300">{treeNodes[selectedNode].height}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Terminology Cards Section */}
      <section className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-7 h-7 text-[#a435f0]" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Terminology Glossary</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
          Master the standard glossary terms used to describe and navigate relationships inside trees:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {terminology.map((t, idx) => (
            <div 
              key={idx}
              className="group bg-gray-50 hover:bg-white dark:bg-neutral-950 dark:hover:bg-neutral-900 border border-gray-150 dark:border-neutral-800/80 hover:border-purple-300 dark:hover:border-purple-900/60 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {t.title}
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 bg-gray-200/60 dark:bg-neutral-800 text-gray-500 dark:text-gray-400 rounded-md">
                  {t.badge}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {t.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Structural Properties Section */}
      <section className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-3 mb-6">
          <HelpCircle className="w-7 h-7 text-[#a435f0]" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Key Structural Properties</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
          The quantitative metrics that define a tree&apos;s geometry and complexity:
        </p>

        <div className="space-y-4">
          {structuralProperties.map((prop, idx) => (
            <div 
              key={idx}
              className="border-l-4 border-purple-500 bg-gray-50 dark:bg-neutral-950 p-5 rounded-r-xl border-y border-r border-gray-200/60 dark:border-neutral-800/60"
            >
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1.5">{prop.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 leading-relaxed">{prop.desc}</p>
              <div className="text-xs text-gray-400 dark:text-neutral-500 font-medium italic flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 bg-purple-400 rounded-full shrink-0" />
                {prop.detail}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Formulas Section */}
      <section className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-3 mb-6">
          <Binary className="w-7 h-7 text-[#a435f0]" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Binary Tree Formula Sheet</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
          Fundamental equations used to analyze binary tree characteristics, space layouts, and boundary limits:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {formulas.map((f, idx) => (
            <div 
              key={idx}
              className="flex flex-col justify-between bg-gray-50 dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800/80 rounded-2xl p-6 shadow-sm"
            >
              <div>
                <h3 className="text-sm uppercase font-extrabold tracking-wider text-gray-400 dark:text-neutral-500 mb-2">
                  {f.title}
                </h3>
                <div className="bg-white dark:bg-neutral-900 rounded-xl py-4 px-6 border border-gray-150 dark:border-neutral-800/50 shadow-inner flex items-center justify-center mb-3">
                  <code className="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono">
                    {f.formula}
                  </code>
                </div>
                <p className="text-xs text-gray-400 dark:text-neutral-500 text-center italic mb-4 font-medium">
                  {f.variableDesc}
                </p>
              </div>
              <div className="bg-purple-500/5 border border-purple-200/20 dark:border-purple-950/20 rounded-xl p-3.5 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                <span className="font-bold text-purple-600 dark:text-purple-400 block mb-0.5">Example:</span>
                {f.example}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Applications Section */}
      <section className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-3 mb-6">
          <Database className="w-7 h-7 text-[#a435f0]" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Real-world Applications</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
          How binary trees serve critical real-world processing, computation, and classification services:
        </p>

        <div className="space-y-4">
          {applications.map((app, idx) => (
            <div 
              key={idx}
              className="flex gap-4 items-start bg-gray-50 hover:bg-white dark:bg-neutral-950 dark:hover:bg-neutral-900 p-5 rounded-2xl border border-gray-150 dark:border-neutral-800/80 hover:border-purple-200 dark:hover:border-purple-950/40 hover:shadow-md transition-all duration-300"
            >
              <div className="p-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-sm group-hover:scale-105 transition-transform shrink-0">
                {app.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                  {app.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {app.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
