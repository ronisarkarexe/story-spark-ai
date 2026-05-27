"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const BTreeQuiz = () => {
  const questions = [
    {
      question: "Why are B-Trees preferred over Binary Search Trees for disk-based databases?",
      options: [
        "B-Trees use less memory.",
        "B-Trees have broader, shallower nodes, significantly reducing disk read operations.",
        "B-Trees are simpler to write and debug.",
        "B-Trees support more floating-point operations."
      ],
      correctAnswer: 1,
      explanation: "By grouping multiple keys in a single broad node, B-Trees reduce the tree height and the number of disk seek calls."
    },
    {
      question: "In a B-Tree of order M, what is the maximum number of children any internal node can have?",
      options: [
        "M - 1 children",
        "M children",
        "2M children",
        "Unlimited children"
      ],
      correctAnswer: 1,
      explanation: "A B-Tree of order M allows any node to have up to M children."
    }
  ];

  return <QuizEngine title="B-Tree Concepts Quiz" questions={questions} />;
};

export default BTreeQuiz;
