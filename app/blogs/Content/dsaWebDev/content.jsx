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
    `If you're a web developer or someone aspiring to be one, you've likely wondered if learning data structures and algorithms (DSA) is truly necessary. After all, modern web development is often about building user interfaces and connecting APIs, right? Let's explore this question in depth.`,
    `At first glance, these tasks don't seem to require deep algorithm knowledge. However, the underlying principles become crucial as applications scale.`,
    `Understanding concepts like time complexity helps you choose the right approach when dealing with large datasets or performance-critical operations.`,
    `Instead of just solving abstract problems, apply DSA concepts directly to web development:`,
    `While you can be a productive web developer without deep DSA knowledge, understanding these concepts will make you more versatile and valuable. You'll write better code, solve problems more efficiently, and have an edge in technical interviews. The key is learning DSA in the context of web development rather than as abstract computer science concepts.`,
  ];

  const tasks = [
    { points: "Creating responsive UIs with HTML/CSS/JavaScript" },
    { points: "Working with frameworks like React, Next.js, or Vue" },
    { points: "Integrating RESTful APIs and GraphQL endpoints" },
    { points: "Implementing state management solutions" },
    { points: "Optimizing performance and accessibility" },
  ];

  const scenarios = [
    { points: "Performance optimization" },
    { points: "Complex state management" },
    { points: "Efficient data processing" },
    { points: "Interview preparation" },
    { points: "Library/framework development" },
    { points: "System design decisions" },
  ];

  const examples = [
    {
      title: "Autocomplete Search",
      description: "Trie data structure improves search efficiency",
    },
    {
      title: "Infinite Scroll",
      description: "Efficient pagination requires proper array handling",
    },
    {
      title: "Form Validation",
      description: "Graphs can model complex validation rules",
    },
    {
      title: "State Management",
      description: "Understanding trees helps with state updates",
    },
  ];

  const protip = [
    { points: "Implement your own simplified version of React's reconciliation algorithm" },
    { points: "Build a custom hook that efficiently manages large datasets" },
    { points: "Create a visualization of how different sorting algorithms work" },
  ];

  return (
    <article className="max-w-4xl mx-auto px-4 pt-14 py-10">
      {/* Article Header */}
      <header className="mb-12 pt-14">
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-black text-white dark:bg-zinc-700 dark:text-zinc-200">
            Web Development
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
          Is Data Structures and Algorithms Important for Web Developers?
        </h1>

        <div className="flex items-center text-gray-500 dark:text-zinc-400 text-sm">
          <span>Published on May 17, 2025</span>
          <span className="mx-2">•</span>
          <span>8 min read</span>
        </div>
      </header>

      {/* Featured Image */}
      <div className="relative w-full h-64 md:h-96 bg-gray-100 dark:bg-zinc-800 rounded-xl mb-12 overflow-hidden">
        <img
          src="/blog/dsaWebDev.png"
          alt="Web developer working with algorithms"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-30 dark:opacity-50"></div>
        <div className="absolute bottom-6 left-6 text-white dark:text-zinc-100">
          <p className="text-sm">
            Understanding DSA helps build better web applications
          </p>
        </div>
      </div>

      {/* Article Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-lg text-gray-700 dark:text-zinc-300 leading-relaxed mb-8">
          {Paragraphs[0]}
        </p>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-black dark:text-zinc-100 mb-6 pb-2 border-b border-gray-200 dark:border-zinc-700">
            What Web Developers Actually Do
          </h2>
          <p className="mb-4 dark:text-zinc-300">
            Typical web development tasks include:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2 dark:text-zinc-300">
            {tasks.map((item, index) => (
              <li key={index}>{item.points}</li>
            ))}
          </ul>
          <p className="dark:text-zinc-300">{Paragraphs[1]}</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-black dark:text-zinc-100 mb-6 pb-2 border-b border-gray-200 dark:border-zinc-700">
            Where DSA Knowledge Shines in Web Development
          </h2>
          <div className="bg-gray-50 dark:bg-zinc-800 p-6 rounded-lg mb-4">
            <p className="mb-2 font-medium dark:text-zinc-200">
              Key scenarios where DSA matters:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {scenarios.map((item, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white dark:bg-zinc-700 rounded-full text-sm shadow-sm dark:text-zinc-200"
                >
                  {item.points}
                </span>
              ))}
            </div>
          </div>
          <p className="dark:text-zinc-300">{Paragraphs[2]}</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-black dark:text-zinc-100 mb-6 pb-2 border-b border-gray-200 dark:border-zinc-700">
            Real-World Examples
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-4">
            {examples.map((item, index) => (
              <div
                key={index}
                className="border dark:border-zinc-700 p-4 rounded-lg hover:shadow-md dark:hover:shadow-zinc-700/30 transition-shadow"
              >
                <h3 className="font-bold mb-1 dark:text-zinc-100">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-zinc-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-black dark:bg-zinc-800 text-white dark:text-white p-8 rounded-xl mb-12">
          <h3 className="text-xl font-bold mb-4">
            Pro Tip: Practical Learning
          </h3>
          <p className="mb-2">{Paragraphs[3]}</p>
          <ul className="list-disc pl-6 space-y-1">
            {protip.map((item, index) => (
              <li key={index}>{item.points}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-black dark:text-zinc-100 mb-4">
            The Verdict
          </h2>
          <p className="text-lg dark:text-zinc-300">{Paragraphs[4]}</p>
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
              {[
                {
                  name: "Twitter",
                  url: "https://twitter.com/intent/tweet?url=https%3A%2F%2Fwww.dsavisualizer.in%2Fblogs%2FContent%2FdsaWebDev&text=Just%20read%20this%20insighful%20blog%3A%20Is%20Data%20Structures%20and%20Algorithms%20Important%20for%20Web%20Developers%3F%20%23WebDev%20%23DSA%20%23Programming"
                },
                {
                  name: "LinkedIn",
                  url: "https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fwww.dsavisualizer.in%2Fblogs%2FContent%2FdsaWebDev"
                },
                {
                  name: "Facebook",
                  url: "https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.dsavisualizer.in%2Fblogs%2FContent%2FdsaWebDev"
                }
              ].map((social) => (
                <button
                  key={social.name}
                  onClick={() => window.open(social.url, '_blank')}
                  className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors dark:border-zinc-600 dark:text-zinc-300"
                >
                  {social.name}
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
