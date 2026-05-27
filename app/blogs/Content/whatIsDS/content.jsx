"use client";
import { FiCopy, FiBookmark, FiShare2 } from "react-icons/fi";
import { useState } from "react";

const BlogContent = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const Paragraphs = [
    `If you're new to coding, you've probably come across terms like array, stack, or linked list and thought, "What does that even mean?" Don't worry — you're not alone. These are all types of data structures, and they form the foundation of how programs organize and process information.`,
    `In this guide, we'll break down what data structures are, why they matter, and introduce you to the most common types — all in simple language with relatable examples.`,
    `A data structure is a way to organize and store data in a computer so it can be used efficiently.`,
    `Think of it like organizing your wardrobe: shirts go in one drawer, pants in another, socks in a box. Each drawer (or structure) is designed to hold and access a specific type of item. Similarly, in programming, different data structures are used depending on the type of data and what you want to do with it.`,
    `Here's why every programmer needs to understand data structures:`,
    `Data structures are the toolbox every programmer must carry. Mastering them helps you build efficient, scalable, and real-world applications. Start small — practice with basic structures, and slowly move up to complex ones. If you're consistent, what once felt like intimidating jargon will become second nature.`,
  ];

  const importancePoints = [
    { points: "Efficiency: The right structure makes programs faster and less memory-hungry" },
    { points: "Scalability: Handles larger data more smoothly" },
    { points: "Problem Solving: Many coding problems are based on data structures" },
    { points: "Real-World Use: From social media feeds to navigation systems — they're everywhere" },
  ];

  const dataStructures = [
    {
      title: "Array",
      description: "Like a row of boxes where each box holds a value",
      image: "/blog/DSimage/array.png",
      useCases: "Great for storing ordered items"
    },
    {
      title: "Stack (LIFO)",
      description: "Imagine a stack of plates - you add and remove from the top only",
      image: "/blog/DSimage/stack.png",
      useCases: "Use when you need to reverse things or track history"
    },
    {
      title: "Queue (FIFO)",
      description: "Think of people standing in line - first person gets served first",
      image: "/blog/DSimage/queue.png",
      useCases: "Perfect for scheduling tasks or managing queues"
    },
    {
      title: "Linked List",
      description: "A chain of nodes where each holds a value and a link to the next",
      image: "/blog/DSimage/linkedList.png",
      useCases: "Flexible in size with easier insertions/removals"
    },
    {
      title: "Tree",
      description: "Starts with a root and branches out in non-linear fashion",
      image: "/blog/DSimage/tree.png",
      useCases: "Used in file systems, decision trees, and databases"
    },
    {
      title: "Graph",
      description: "Networks of nodes and edges like social connections",
      image: "/blog/DSimage/graph.png",
      useCases: "Used in social networks, maps, and recommendation systems"
    },
  ];

  const realLifeExample = [
    {points: "Building a contact list app with arrays to store names"},
    {points: "Using hash tables to search names quickly"},
    {points: "Implementing sorting algorithms to organize contacts"},
  ];

  return (
    <article className="max-w-4xl mx-auto px-4 pt-14 py-10">
      {/* Article Header */}
      <header className="mb-12 pt-14">
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-black text-white dark:bg-zinc-700 dark:text-zinc-200">
            Programming Basics
          </span>
          <div className="flex space-x-3 text-gray-500 dark:text-zinc-400">
            <button
              onClick={handleCopy}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Copy link"
            >
              {copied ? <span className="text-xs">Copied!</span> : <FiCopy />}
            </button>
            <button
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Bookmark"
            >
              <FiBookmark />
            </button>
            <button
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Share"
            >
              <FiShare2 />
            </button>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-zinc-100 mb-4 leading-tight">
          Data Structures Explained: A Beginner's Guide
        </h1>

        <div className="flex items-center text-gray-500 dark:text-zinc-400 text-sm">
          <span>Published on June 10, 2024</span>
          <span className="mx-2">•</span>
          <span>6 min read</span>
        </div>
      </header>

      {/* Featured Image */}
      <div className="relative w-full h-64 md:h-96 bg-gray-100 dark:bg-zinc-800 rounded-xl mb-12 overflow-hidden">
        <img
          src="/blog/whatIsDs.png"
          alt="Visual representation of different data structures"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-30 dark:opacity-50"></div>
        <div className="absolute bottom-6 left-6 text-white dark:text-zinc-100">
          <p className="text-sm">
            Understanding data structures is fundamental to programming
          </p>
        </div>
      </div>

      {/* Article Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-lg text-gray-700 dark:text-zinc-300 leading-relaxed mb-8">
          {Paragraphs[0]}
        </p>
        <p className="text-lg text-gray-700 dark:text-zinc-300 leading-relaxed mb-8">
          {Paragraphs[1]}
        </p>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-black dark:text-zinc-100 mb-6 pb-2 border-b border-gray-200 dark:border-zinc-700">
            What Is a Data Structure?
          </h2>
          <p className="mb-4 dark:text-zinc-300">
            {Paragraphs[2]}
          </p>
          <p className="dark:text-zinc-300">{Paragraphs[3]}</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-black dark:text-zinc-100 mb-6 pb-2 border-b border-gray-200 dark:border-zinc-700">
            Why Are Data Structures Important?
          </h2>
          <div className="bg-gray-50 dark:bg-zinc-800 p-6 rounded-lg mb-4">
            <ul className="list-disc pl-6 space-y-2 dark:text-zinc-300">
              {importancePoints.map((item, index) => (
                <li key={index}>{item.points}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mb-12">
  <h2 className="text-2xl font-bold text-black dark:text-zinc-100 mb-6 pb-2 border-b border-gray-200 dark:border-zinc-700">
    Types of Data Structures
  </h2>
  <div className="space-y-8">
    {dataStructures.map((item, index) => (
      <div
        key={index}
        className="border dark:border-zinc-700 p-6 rounded-lg hover:shadow-md dark:hover:shadow-zinc-700/30 transition-shadow"
      >
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3 h-48 bg-gray-100 dark:bg-zinc-700 rounded-lg overflow-hidden flex-shrink-0">
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-xl mb-2 dark:text-zinc-100">
              {item.title}
            </h3>
            <p className="mb-4 text-gray-600 dark:text-zinc-400">
              {item.description}
            </p>
            <p className="text-sm text-gray-500 dark:text-zinc-500">
              <span className="font-semibold">Use cases:</span> {item.useCases}
            </p>
          </div>
        </div>
      </div>
    ))}
  </div>
</section>

        <section className="bg-black dark:bg-zinc-800 text-white dark:text-white p-8 rounded-xl mb-12">
          <h3 className="text-xl font-bold mb-4">
            Real-Life Example: Why It Matters
          </h3>
          <p className="mb-2">Imagine building a contact list app:</p>
          <ul className="list-disc pl-6 space-y-1">
            {realLifeExample.map((item, index) => (
                <li key={index}>{item.points}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-black dark:text-zinc-100 mb-4">
            Final Thoughts
          </h2>
          <p className="text-lg dark:text-zinc-300">{Paragraphs[5]}</p>
        </section>
      </div>

      {/* Article Footer */}
      <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-zinc-700">
        <div className="flex flex-wrap justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="font-bold text-black dark:text-zinc-100 mb-2">
              Share this article
            </h3>
            <div className="flex space-x-3">
              {["Twitter", "LinkedIn", "Facebook"].map((social) => (
                <button
                  key={social}
                  className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors dark:border-zinc-600 dark:text-zinc-300"
                >
                  {social}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </article>
  );
};

export default BlogContent;