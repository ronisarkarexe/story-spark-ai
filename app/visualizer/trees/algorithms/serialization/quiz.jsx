"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const handleNext = () => {
  const questions = [
  {
    "question": "Why are null markers important during tree serialization?",
    "options": [
      "They reduce the string length",
      "They preserve the exact tree structure",
      "They make the tree balanced",
      "They speed up traversal"
    ],
    "correctAnswer": 1,
    "explanation": "Null markers ensure the serialized output can be decoded back into the original tree shape."
  },
  {
    "question": "Which traversal order is standard for deterministic tree serialization?",
    "options": [
      "Pre-order",
      "In-order",
      "Post-order",
      "Level-order"
    ],
    "correctAnswer": 0,
    "explanation": "Pre-order is commonly used because it serializes the root before its children, making reconstruction straightforward."
  }
];

  return <QuizEngine title="Serialization Quiz" questions={questions} />;
};

export default handleNext;
