"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const handleNext = () => {
  const questions = [
  {
    "question": "What does 'diameter' measure in a binary tree?",
    "options": [
      "The number of leaf nodes",
      "The longest path between any two nodes",
      "The smallest subtree height",
      "The number of nodes in the shortest path"
    ],
    "correctAnswer": 1,
    "explanation": "The diameter is the number of edges in the longest path between two nodes."
  },
  {
    "question": "How is the diameter typically computed at each node?",
    "options": [
      "height(left) + height(right)",
      "height(left) - height(right)",
      "height(left) * height(right)",
      "min(height(left), height(right))"
    ],
    "correctAnswer": 0,
    "explanation": "The candidate diameter through a node combines the heights of its left and right subtrees."
  }
];

  return <QuizEngine title="Diameter Quiz" questions={questions} />;
};

export default handleNext;
