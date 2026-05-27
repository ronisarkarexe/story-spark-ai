"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const Quiz = () => {
  const questions = [
  {
    "question": "What is the average time complexity of HashMap delete?",
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
    "question": "What happens when you try to delete a key that doesn't exist?",
    "options": [
      "Error is thrown",
      "Program crashes",
      "Returns null/false, table unchanged",
      "Deletes random key"
    ],
    "correctAnswer": 2,
    "explanation": ""
  },
  {
    "question": "Which method deletes a key in Java's HashMap?",
    "options": [
      "delete()",
      "remove()",
      "pop()",
      "erase()"
    ],
    "correctAnswer": 1,
    "explanation": ""
  },
  {
    "question": "When deleting from a chained bucket, what happens to other entries?",
    "options": [
      "All entries are deleted",
      "Table is rebuilt",
      "Only matching key is removed, others remain",
      "Bucket is cleared"
    ],
    "correctAnswer": 2,
    "explanation": ""
  }
];

  return <QuizEngine title="Quiz — HashMap Delete" questions={questions} />;
};

export default Quiz;
