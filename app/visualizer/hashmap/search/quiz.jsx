"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const Quiz = () => {
  const questions = [
  {
    "question": "What is the average time complexity of HashMap search?",
    "options": [
      "O(n)",
      "O(log n)",
      "O(1)",
      "O(n²)"
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "question": "What does HashMap search return if key is not found?",
    "options": [
      "Error",
      "0",
      "null/undefined",
      "Empty string"
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "question": "Which method searches a key in Java's HashMap?",
    "options": [
      "search()",
      "find()",
      "get()",
      "fetch()"
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "question": "What is the worst case time complexity of HashMap search?",
    "options": [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n²)"
    ],
    "correctAnswer": 2,
    "explanation": ""
  }
];

  return <QuizEngine title="Quiz — HashMap Search" questions={questions} />;
};

export default Quiz;
