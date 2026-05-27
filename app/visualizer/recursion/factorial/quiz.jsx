"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const FactorialQuiz = () => {
  const questions = [
    {
      question: "In the recursive call of fact(5), what is the maximum call stack depth?",
      options: [
        "1",
        "3",
        "5",
        "10"
      ],
      correctAnswer: 2,
      explanation: "For fact(5), the stack will push fact(5), fact(4), fact(3), fact(2), and fact(1) in a linear sequence, reaching a maximum height of 5 frames before popping."
    },
    {
      question: "Which of the following describes the base case for the factorial recursion algorithm?",
      options: [
        "n == 0 or n == 1",
        "n < 0",
        "n == 10",
        "Any negative integer"
      ],
      correctAnswer: 0,
      explanation: "By mathematical definition, 0! = 1 and 1! = 1, which form the base cases that terminate the recursion."
    },
    {
      question: "What is the time complexity of the recursive factorial algorithm?",
      options: [
        "O(1)",
        "O(log N)",
        "O(N)",
        "O(N²)"
      ],
      correctAnswer: 2,
      explanation: "Since the function runs exactly N times to calculate fact(N), the time complexity is linear, O(N)."
    },
    {
      question: "What would happen if we call fact(5) but forget to check n <= 1 (no base case)?",
      options: [
        "The function returns 0",
        "The compiler will fail to compile the code",
        "The call stack grows infinitely until a Stack Overflow error occurs",
        "It will calculate the factorial using iteration automatically"
      ],
      correctAnswer: 2,
      explanation: "Without a base case, recursion will continue indefinitely (fact(-1), fact(-2), etc.) until call stack memory is exhausted, throwing a Stack Overflow error."
    },
    {
      question: "What is the auxiliary space complexity of recursive factorial?",
      options: [
        "O(1)",
        "O(log N)",
        "O(N)",
        "O(N²)"
      ],
      correctAnswer: 2,
      explanation: "Because there are N concurrent stack frames allocated in the call stack during execution, the space complexity is O(N)."
    }
  ];

  return <QuizEngine title="Factorial Recursion Quiz" questions={questions} />;
};

export default FactorialQuiz;
