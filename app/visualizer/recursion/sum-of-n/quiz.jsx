"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const SumQuiz = () => {
  const questions = [
    {
      question: "For sum(N), if we pass n = 0, what is the returned value?",
      options: [
        "0",
        "1",
        "-1",
        "Stack Overflow"
      ],
      correctAnswer: 0,
      explanation: "For sum(n), the base case condition is n <= 0, which returns 0 immediately."
    },
    {
      question: "Which line corresponds to the recursive step in the sum(N) function?",
      options: [
        "if (n <= 0)",
        "return 0;",
        "return n + sum(n - 1);",
        "function sum(n)"
      ],
      correctAnswer: 2,
      explanation: "The statement `return n + sum(n - 1)` is the recursive step because the function calls itself with a smaller argument (n - 1)."
    },
    {
      question: "What is the peak stack frame depth when executing sum(3)?",
      options: [
        "1",
        "2",
        "3",
        "4"
      ],
      correctAnswer: 3,
      explanation: "Executing sum(3) calls sum(3), sum(2), sum(1), and sum(0). The stack grows to 4 frames before popping off."
    },
    {
      question: "What is the time complexity of the recursive sum(N) algorithm?",
      options: [
        "O(1)",
        "O(log N)",
        "O(N)",
        "O(N²)"
      ],
      correctAnswer: 2,
      explanation: "The function makes a linear chain of calls from N down to 0, resulting in O(N) time complexity."
    },
    {
      question: "What does sum(4) return?",
      options: [
        "4",
        "6",
        "10",
        "15"
      ],
      correctAnswer: 2,
      explanation: "sum(4) evaluates to 4 + 3 + 2 + 1 + 0 = 10."
    }
  ];

  return <QuizEngine title="Sum of N Recursion Quiz" questions={questions} />;
};

export default SumQuiz;
