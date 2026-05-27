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
    `A common question among developers learning Data Structures and Algorithms (DSA) is whether these concepts change across programming languages. While the fundamental principles remain consistent, their implementations and optimizations can vary significantly. Let's explore how DSA manifests in different languages and what this means for developers.`,
    `Programming languages offer different levels of abstraction and built-in utilities. For example, Python's rich standard library makes certain algorithms easier to implement, whereas C++ might offer more control over memory, making it suitable for performance-critical scenarios.`,
    `This language-agnostic nature is why DSA knowledge transfers well between languages. However, the implementation details and performance characteristics can differ.`,
    `These differences become particularly important when working on performance-critical applications or when interfacing between multiple languages in a single project.`,
    `When learning DSA concepts, focus first on understanding the core principles, then explore how your primary language implements these structures. This approach gives you both the theoretical foundation and practical skills needed for real-world development.`,
  ];

  const universalConcepts = [
    { points: "Time complexity (Big O notation)" },
    { points: "Space complexity analysis" },
    { points: "Abstract data type behaviors" },
    { points: "Algorithm design patterns" },
    { points: "Problem-solving approaches" },
  ];

  const languageExamples = [
    {
      language: "JavaScript",
      structures: [
        "Arrays are actually objects with integer keys",
        "Objects as hash maps (but with insertion order preserved)",
        "No built-in heap/priority queue",
        "TypedArrays for numerical work"
      ],
      algorithms: [
        "Event loop affects async algorithm design",
        "Single-threaded nature impacts parallel processing",
        "Prototypal inheritance affects object structures"
      ]
    },
    {
      language: "Python",
      structures: [
        "Lists as dynamic arrays",
        "Dictionaries as highly optimized hash tables",
        "Tuples as immutable sequences",
        "Sets with built-in mathematical operations"
      ],
      algorithms: [
        "List comprehensions enable concise transformations",
        "Generator expressions for memory-efficient iteration",
        "Built-in sort uses Timsort algorithm"
      ]
    },
    {
      language: "Java",
      structures: [
        "Primitive arrays vs. ArrayList",
        "HashMap vs. TreeMap implementations",
        "Strongly typed collections",
        "Concurrent collections for threading"
      ],
      algorithms: [
        "JIT compilation affects runtime characteristics",
        "Garbage collection impacts memory usage",
        "Bytecode execution adds abstraction layer"
      ]
    }
  ];

  const webDevImplications = [
    {
      area: "Frontend (JavaScript)",
      considerations: [
        "Virtual DOM diffing algorithms in frameworks",
        "State management efficiency in large apps",
        "Memoization techniques for performance"
      ]
    },
    {
      area: "Backend (Node.js/Python/Java)",
      considerations: [
        "Database query optimization",
        "API response caching strategies",
        "Load balancing and request processing"
      ]
    },
    {
      area: "Full-Stack",
      considerations: [
        "Data serialization between layers",
        "Algorithm choice for shared business logic",
        "Consistent data modeling across boundaries"
      ]
    }
  ];

  const protips = [
    { points: "Learn DSA in one language first, then compare implementations" },
    { points: "Use language-specific benchmarks to verify performance assumptions" },
    { points: "Study standard library implementations of common structures" },
    { points: "Understand how your language's memory model affects data structures" },
    { points: "Don’t just translate code between languages—adapt it to leverage language strengths" }
  ];

  return (
    <article className="max-w-4xl mx-auto px-4 pt-14 py-10">
      {/* Article Header */}
      <header className="mb-12 pt-14">
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-black text-white dark:bg-zinc-700 dark:text-zinc-200">
            Computer Science
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
          Are Data Structures and Algorithms Different for Different Languages?
        </h1>

        <div className="flex items-center text-gray-500 dark:text-zinc-400 text-sm">
          <span>Published on May 20, 2025</span>
          <span className="mx-2">•</span>
          <span>10 min read</span>
        </div>
      </header>

      {/* Featured Image */}
      <div className="relative w-full h-64 md:h-96 bg-gray-100 dark:bg-zinc-800 rounded-xl mb-12 overflow-hidden">
        <img
          src="/blog/dsaDifferent.png"
          alt="Data structures across programming languages"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-30 dark:opacity-50"></div>
        <div className="absolute bottom-6 left-6 text-white dark:text-zinc-100">
          <p className="text-sm">
            Comparing DSA implementations across JavaScript, Python, and Java
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
            Universal DSA Concepts
          </h2>
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg mb-6">
            <p className="font-medium text-green-800 dark:text-green-200">
              Core Insight: The theoretical foundations of data structures and algorithms
              remain constant regardless of programming language.
            </p>
          </div>
          <ul className="list-disc pl-6 mb-6 space-y-2 dark:text-zinc-300">
            {universalConcepts.map((item, index) => (
              <li key={index}>{item.points}</li>
            ))}
          </ul>
          <p className="dark:text-zinc-300">{Paragraphs[2]}</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-black dark:text-zinc-100 mb-6 pb-2 border-b border-gray-200 dark:border-zinc-700">
            Language-Specific Implementations
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {languageExamples.map((lang, index) => (
              <div key={index} className="border dark:border-zinc-700 rounded-lg overflow-hidden">
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 border-b dark:border-zinc-700">
                  <h3 className="font-bold text-lg dark:text-zinc-100">{lang.language}</h3>
                </div>
                <div className="p-4">
                  <h4 className="font-medium dark:text-zinc-200 mb-2">Structures:</h4>
                  <ul className="list-disc pl-5 mb-4 space-y-1 text-sm dark:text-zinc-300">
                    {lang.structures.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                  <h4 className="font-medium dark:text-zinc-200 mb-2">Algorithms:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm dark:text-zinc-300">
                    {lang.algorithms.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <p className="dark:text-zinc-300">
            These distinctions illustrate that while the same data structure or algorithm may exist across languages, their behavior, performance, or even syntax might differ. Developers should not only know how something works in theory but also how their chosen language expresses and optimizes it.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-black dark:text-zinc-100 mb-6 pb-2 border-b border-gray-200 dark:border-zinc-700">
            Web Development Implications
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {webDevImplications.map((item, index) => (
              <div key={index} className="bg-gray-50 dark:bg-zinc-800 p-5 rounded-lg">
                <h3 className="font-bold dark:text-zinc-100 mb-3">{item.area}</h3>
                <ul className="space-y-2">
                  {item.considerations.map((point, i) => (
                    <li key={i} className="flex items-start">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-2"></span>
                      <span className="dark:text-zinc-300">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="dark:text-zinc-300">{Paragraphs[3]}</p>
          <p className="dark:text-zinc-300">
            Developers building cross-platform or microservice-based architectures especially benefit from understanding how DSA implementations behave differently across tech stacks.
          </p>
        </section>

        <section className="dark:bg-zinc-800 bg-gray-100 dark:text-white p-8 rounded-xl mb-12">
          <h3 className="text-xl font-bold mb-4">
            Pro Tips for Language-Agnostic DSA Learning
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            {protips.map((item, index) => (
              <li key={index}>{item.points}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-black dark:text-zinc-100 mb-4">
            Key Takeaway
          </h2>
          <div className="dark:bg-zinc-800 bg-gray-100 p-6 rounded-lg">
            <p className="dark:text-white">
              While data structures and algorithms may be implemented differently across languages,
              the core concepts remain the same. Master the fundamentals first, then learn how your
              preferred languages realize these concepts in practice. This dual understanding not only enhances your adaptability but also empowers you to choose the most efficient solution depending on the project requirements and language capabilities.
            </p>
          </div>
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
                  url: "https://twitter.com/intent/tweet?url=https%3A%2F%2Fwww.dsavisualizer.in%2Fblogs%2FContent%2FdsaDifferent&text=Exploring%20if%20Data%20Structures%20and%20Algorithms%20are%20different%20across%20languages%20in%20this%20blog%20post%21%20A%20must-read%20for%20programmers.%20%23DSA%20%23ProgrammingLanguages"
                },
                {
                  name: "LinkedIn",
                  url: "https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fwww.dsavisualizer.in%2Fblogs%2FContent%2FdsaDifferent"
                },
                {
                  name: "Facebook",
                  url: "https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.dsavisualizer.in%2Fblogs%2FContent%2FdsaDifferent"
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