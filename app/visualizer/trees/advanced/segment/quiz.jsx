"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const SegmentQuiz = () => {
  const questions = [
    {
      question: "For a base array of size N, what is the maximum number of nodes required in the Segment Tree array representation?",
      options: [
        "N nodes",
        "2N nodes",
        "4N nodes",
        "N^2 nodes"
      ],
      correctAnswer: 2,
      explanation: "To fully accommodate leaf elements and empty branch padding, a Segment Tree array representation typically requires up to 4N nodes."
    },
    {
      question: "What is the worst-case time complexity for a Range Sum Query and a Point Update in a Segment Tree?",
      options: [
        "O(N) for both",
        "O(log N) for both",
        "O(1) for query, O(N) for update",
        "O(log N) for query, O(N) for update"
      ],
      correctAnswer: 1,
      explanation: "Both range queries and point updates require traversing the depth of the binary tree, taking O(log N) time."
    }
  ];

  return <QuizEngine title="Segment Tree Quiz" questions={questions} />;
};

export default SegmentQuiz;
