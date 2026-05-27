"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const PrintQuiz = () => {
  const questions = [
    {
      question: "What is the initial value of 'i' passed to print1ToN(i, n) to print from 1 to N?",
      options: [
        "0",
        "1",
        "N",
        "N - 1"
      ],
      correctAnswer: 1,
      explanation: "Since we want to print starting from 1, the parameter 'i' (acting as the loop counter) should be initialized to 1."
    },
    {
      question: "Which condition represents the base case for printing 1 to N recursively?",
      options: [
        "i == n",
        "i > n",
        "i < 1",
        "n == 0"
      ],
      correctAnswer: 1,
      explanation: "To stop printing once we go past N, we check if i > n. This terminates the recursion and pops the stack frames."
    },
    {
      question: "Where does the print statement (console.log(i)) sit in this basic recursion algorithm?",
      options: [
        "Before the recursive call (pre-order process)",
        "After the recursive call (post-order process)",
        "Inside the base case block",
        "In a separate function entirely"
      ],
      correctAnswer: 0,
      explanation: "We print the current value 'i' first, and then call print1ToN(i + 1, n). This is a pre-order process where the action happens on the way down the stack."
    },
    {
      question: "What is the time complexity of printing 1 to N recursively?",
      options: [
        "O(1)",
        "O(log N)",
        "O(N)",
        "O(N²)"
      ],
      correctAnswer: 2,
      explanation: "The function executes N times to print N values, which gives O(N) linear time complexity."
    },
    {
      question: "What is the maximum stack height during print1ToN(1, 4)?",
      options: [
        "2",
        "4",
        "5",
        "8"
      ],
      correctAnswer: 2,
      explanation: "The calls made are: print1ToN(1, 4) -> (2, 4) -> (3, 4) -> (4, 4) -> (5, 4). Thus, at most 5 frames reside on the stack."
    }
  ];

  return <QuizEngine title="Print 1 to N Quiz" questions={questions} />;
};

export default PrintQuiz;
