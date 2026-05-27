"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const PrintNQuiz = () => {
  const questions = [
    {
      question: "What is the correct base case for printing N down to 1?",
      options: [
        "i == 0",
        "i < 1",
        "i > n",
        "i == 1"
      ],
      correctAnswer: 1,
      explanation: "To print down to 1, we stop when 'i' is less than 1 (i.e. 0). Hence, i < 1 is the base case."
    },
    {
      question: "What argument is passed to the recursive call in printNTo1(i)?",
      options: [
        "i + 1",
        "i - 1",
        "i",
        "n"
      ],
      correctAnswer: 1,
      explanation: "Since we are printing down to 1, each recursive step decreases the value of 'i' by 1: printNTo1(i - 1)."
    },
    {
      question: "Which of the following values is printed first when calling printNTo1(4)?",
      options: [
        "1",
        "4",
        "0",
        "None"
      ],
      correctAnswer: 1,
      explanation: "Because console.log(i) is executed BEFORE the recursive call, the initial value passed (4) is printed first."
    },
    {
      question: "What is the space complexity of the printNTo1(n) function?",
      options: [
        "O(1)",
        "O(log N)",
        "O(N)",
        "O(N²)"
      ],
      correctAnswer: 2,
      explanation: "The space complexity is O(N) due to the call stack height during execution (N+1 active frames)."
    },
    {
      question: "If we want to print from N down to 1, but we write printNTo1(i+1) by mistake, what occurs?",
      options: [
        "The numbers are printed in ascending order",
        "Nothing, the code runs fine",
        "The call stack grows infinitely, resulting in a Stack Overflow",
        "The compiler catches this as a syntax error"
      ],
      correctAnswer: 2,
      explanation: "Since 'i' starts at N (>=1) and we add 1, 'i' will keep growing and never become less than 1, causing infinite recursion and a Stack Overflow."
    }
  ];

  return <QuizEngine title="Print N to 1 Quiz" questions={questions} />;
};

export default PrintNQuiz;
