"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const FenwickQuiz = () => {
  const questions = [
    {
      question: "Which bitwise operation extracts the Least Significant Bit (LSB) of an index i?",
      options: [
        "i & (i - 1)",
        "i | (-i)",
        "i & (-i)",
        "i ^ (~i)"
      ],
      correctAnswer: 2,
      explanation: "Using two's complement arithmetic, the LSB is extracted via the expression i & (-i)."
    },
    {
      question: "What is the memory size advantage of a Fenwick Tree compared to a Segment Tree?",
      options: [
        "Fenwick Tree takes O(1) extra space.",
        "Fenwick Tree requires only N elements, while a Segment Tree typically requires up to 4N nodes.",
        "Fenwick Tree uses half the bit allocations per pointer.",
        "There is no difference in memory size."
      ],
      correctAnswer: 1,
      explanation: "A Fenwick Tree stores aggregate values implicitly inside an array of size N, bypassing the extensive structural tree node allocations of Segment Trees."
    }
  ];

  return <QuizEngine title="Fenwick Tree Quiz" questions={questions} />;
};

export default FenwickQuiz;
