"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const Quiz = () => {
  const questions = [
  {
    "question": "What is the average time complexity of HashMap insert?",
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
    "question": "What happens when two keys hash to the same index?",
    "options": [
      "Error is thrown",
      "First key is deleted",
      "Collision occurs",
      "HashMap resizes"
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "question": "Which method is used to insert in Java's HashMap?",
    "options": [
      "insert()",
      "add()",
      "push()",
      "put()"
    ],
    "correctAnswer": 3,
    "explanation": ""
  },
  {
    "question": "What is chaining in HashMap?",
    "options": [
      "Linking multiple HashMaps",
      "Storing colliding entries in a linked list at same index",
      "Hashing a key twice",
      "Resizing the table"
    ],
    "correctAnswer": 1,
    "explanation": ""
  }
];

  return <QuizEngine title="Quiz — HashMap Insert" questions={questions} />;
};

export default Quiz;
