"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const StackQuiz = () => {
  const questions = [
    {
      question: "What does the peek operation in a stack do?",
      options: [
        "Removes and returns the top element",
        "Returns the top element without removing it",
        "Adds a new element to the top",
        "Returns the bottom element of the stack"
      ],
      correctAnswer: 1,
      explanation:
        "Peek only inspects the top element without modifying the stack, unlike pop which removes it.",
    },
    {
      question: "What is the time complexity of the peek operation?",
      options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
      correctAnswer: 2,
      explanation:
        "Peek operates in O(1) time since it directly accesses the top element (constant time).",
    },
    {
      question: "After pushing 10, 20, and 30 onto a stack, what does peek() return?",
      options: ["10", "20", "30", "Error"],
      correctAnswer: 2,
      explanation:
        "The stack becomes [30, 20, 10], so peek returns 30 (the top element).",
    },
    {
      question: "What happens if you peek at an empty stack?",
      options: [
        "Returns null",
        "Returns undefined",
        "Causes stack underflow",
        "Depends on implementation"
      ],
      correctAnswer: 3,
      explanation:
        "Most implementations throw a stack underflow exception (or similar error) when peeking an empty stack.",
    },
    {
      question: "How does peek differ from pop?",
      options: [
        "Peek removes the element, pop doesn't",
        "Peek doesn't modify the stack, pop does",
        "Peek works at the bottom of the stack",
        "Peek has O(n) time complexity"
      ],
      correctAnswer: 1,
      explanation:
        "Peek is non-destructive (only reads data), while pop modifies the stack by removing the top element.",
    },
    {
      question: "In which scenario would peek be particularly useful?",
      options: [
        "When you need to remove all elements",
        "When you need to check the top element before deciding to pop/push",
        "When you need to reverse the stack",
        "When you need to count all elements"
      ],
      correctAnswer: 1,
      explanation:
        "Peek is ideal for inspection before operations (e.g., checking if a parenthesis matches before popping).",
    },
    {
      question: "Given stack = [5, 2, 9], what's the state after peek()?",
      options: [
        "[5, 2, 9]",
        "[2, 9]",
        "[5, 2]",
        "[9, 5, 2]"
      ],
      correctAnswer: 0,
      explanation:
        "Peek only reads the top element (9), leaving the stack unchanged as [5, 2, 9].",
    },
    {
      question: "Which real-world analogy best describes peek?",
      options: [
        "Taking the top plate from a stack of plates",
        "Looking at the top plate without taking it",
        "Adding a new plate to the stack",
        "Counting all plates in the stack"
      ],
      correctAnswer: 1,
      explanation:
        "Peek is like looking at the top plate to see if it's dirty before deciding to remove it.",
    },
    {
      question: "What does peek() return after: push(8), push(4), pop(), peek()?",
      options: ["8", "4", "Error", "Null"],
      correctAnswer: 0,
      explanation:
        "Operations: push(8) → [8], push(4) → [4, 8], pop() → returns 4: [8], peek() → returns 8.",
    },
    {
      question: "Why is peek considered a 'safe' operation?",
      options: [
        "It never throws errors",
        "It doesn't modify stack data",
        "It works on full stacks",
        "It has O(1) space complexity"
      ],
      correctAnswer: 1,
      explanation:
        "Peek is 'safe' in terms of data integrity since it’s read-only (though it may throw errors on empty stacks).",
    },
  ];

  return <QuizEngine title="Stack Quiz Challenge" questions={questions} />;
};

export default StackQuiz;
