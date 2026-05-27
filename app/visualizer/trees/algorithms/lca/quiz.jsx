"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const handleNext = () => {
  const questions = [
  {
    "question": "Which node is the Lowest Common Ancestor of nodes p and q?",
    "options": [
      "The deepest node that is ancestor of both",
      "The shallowest node in the tree",
      "The first leaf node encountered",
      "The node with smallest value"
    ],
    "correctAnswer": 0,
    "explanation": "The LCA is defined as the deepest node that is an ancestor of both target nodes."
  },
  {
    "question": "What is the time complexity of the standard recursive LCA algorithm?",
    "options": [
      "O(1)",
      "O(log N)",
      "O(N)",
      "O(N log N)"
    ],
    "correctAnswer": 2,
    "explanation": "Each node is visited at most once, giving O(N) time complexity."
  }
];

  return <QuizEngine title="LCA Quick Quiz" questions={questions} />;
};

export default handleNext;
