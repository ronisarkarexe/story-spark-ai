"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const FibonacciQuiz = () => {
  const questions = [
    {
      question: "Why is the recursive implementation of Fibonacci called 'Tree Recursion'?",
      options: [
        "It stores values in a Binary Search Tree",
        "The function calls itself twice per step, creating a branching tree-like execution structure",
        "It only works on Tree data structures",
        "It returns a tree-like nested list of numbers"
      ],
      correctAnswer: 1,
      explanation: "Because the function makes multiple (specifically two) recursive calls inside the recursive step, the execution flow branches like a binary tree."
    },
    {
      question: "For fib(4), how many times is the sub-problem fib(2) executed/called?",
      options: [
        "1",
        "2",
        "3",
        "4"
      ],
      correctAnswer: 1,
      explanation: "Tracing the tree: fib(4) calls fib(3) and fib(2). fib(3) calls fib(2) and fib(1). Thus, fib(2) is called twice: once as a direct child of fib(4), and once as a child of fib(3)."
    },
    {
      question: "What is the primary drawback of the naive recursive Fibonacci algorithm?",
      options: [
        "It consumes too much disk storage",
        "It performs a massive amount of redundant/duplicate calculations for the same states",
        "It requires a graph layout library to run",
        "It has a space complexity of O(2^N)"
      ],
      correctAnswer: 1,
      explanation: "The lack of memoization or tracking calculated values causes the function to calculate the same sub-problems repeatedly, leading to poor performance."
    },
    {
      question: "Although the time complexity of naive fib(N) is exponential, what is its space complexity (stack depth)?",
      options: [
        "O(1)",
        "O(log N)",
        "O(N)",
        "O(2^N)"
      ],
      correctAnswer: 2,
      explanation: "The call stack only holds active frames on the current path from the root to a leaf node. Since the height of the recursion tree is N, the space complexity is linear, O(N)."
    },
    {
      question: "Which optimization technique stores previously computed values of fib(x) to prevent redundant calls?",
      options: [
        "Memoization (caching)",
        "De-escalation",
        "Array flattening",
        "LIFO frame clearing"
      ],
      correctAnswer: 0,
      explanation: "Memoization caches the results of function calls so that when the same inputs occur again, the cached value can be returned instantly, optimizing time complexity to O(N)."
    }
  ];

  return <QuizEngine title="Fibonacci Recursion Quiz" questions={questions} />;
};

export default FibonacciQuiz;
