"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const StackQuiz = () => {
  const questions = [
    {
      question: "What does the isEmpty operation in a stack determine?",
      options: [
        "The total capacity of the stack",
        "Whether the stack contains any elements",
        "The position of the top element",
        "The time complexity of other operations"
      ],
      correctAnswer: 1,
      explanation:
        "isEmpty checks if the stack has zero elements (true if empty, false otherwise).",
    },
    {
      question: "What does isEmpty() return for a stack with elements [10, 20]?",
      options: ["true", "false", "null", "10"],
      correctAnswer: 1,
      explanation:
        "The stack contains elements, so isEmpty returns false.",
    },
    {
      question: "Why is isEmpty crucial before calling pop() or peek()?",
      options: [
        "To improve time complexity",
        "To prevent stack underflow errors",
        "To resize the stack",
        "To count the elements"
      ],
      correctAnswer: 1,
      explanation:
        "Checking isEmpty first avoids errors when attempting to pop/peek an empty stack.",
    },
    {
      question: "What is the time complexity of isEmpty?",
      options: ["O(n)", "O(1)", "O(log n)", "O(n²)"],
      correctAnswer: 1,
      explanation:
        "isEmpty runs in O(1) time as it only checks if size/length equals zero.",
    },
    {
      question: "How would you implement isEmpty for a stack stored in an array?",
      options: [
        "Check if array[0] === null",
        "Return array.length === 0",
        "Compare top and bottom indices",
        "Count all non-zero elements"
      ],
      correctAnswer: 1,
      explanation:
        "For array-based stacks, isEmpty simply verifies if the length is zero.",
    }
  ];

  return <QuizEngine title="Stack Quiz Challenge" questions={questions} />;
};

export default StackQuiz;
