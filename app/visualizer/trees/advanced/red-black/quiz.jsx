"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const RedBlackQuiz = () => {
  const questions = [
    {
      question: "Which of the following is NOT a property of a Red-Black Tree?",
      options: [
        "The root node is always Black.",
        "A Red node must have Black children.",
        "The black height from any node to its descendant leaves varies.",
        "NIL leaf nodes are colored Black."
      ],
      correctAnswer: 2,
      explanation: "By property, the black height from any node to its descendant leaves must be exactly the same, ensuring balanced paths."
    },
    {
      question: "What is the maximum height of a Red-Black tree containing N keys?",
      options: [
        "O(N)",
        "O(log N)",
        "O(N log N)",
        "O(1)"
      ],
      correctAnswer: 1,
      explanation: "Even in the worst case (alternating red and black nodes), the height of a Red-Black tree is guaranteed to be bounded by O(log N)."
    }
  ];

  return <QuizEngine title="Red-Black Tree Quiz" questions={questions} />;
};

export default RedBlackQuiz;
