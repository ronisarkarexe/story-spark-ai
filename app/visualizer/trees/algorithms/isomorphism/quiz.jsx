"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const handleNext = () => {
  const questions = [
  {
    "question": "Can two trees with different node values still be isomorphic?",
    "options": [
      "Yes, if the structure matches",
      "No, values must match exactly",
      "Only if they are both binary search trees",
      "Only if the trees are balanced"
    ],
    "correctAnswer": 0,
    "explanation": "Tree isomorphism depends on structure, so values can differ."
  },
  {
    "question": "What operation may be needed to compare two trees for isomorphism?",
    "options": [
      "Swapping left and right children",
      "Rotating the tree",
      "Rebalancing the tree",
      "Reversing the node values"
    ],
    "correctAnswer": 0,
    "explanation": "Structural equivalence may require swapping children at some nodes."
  }
];

  return <QuizEngine title="Isomorphism Quiz" questions={questions} />;
};

export default handleNext;
