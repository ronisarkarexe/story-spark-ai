"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const BinarySearchQuiz = () => {
  const questions = [
    {
      question: "What is the primary requirement for binary search to work?",
      options: [
        "The list must be unsorted",
        "The list must be sorted",
        "The list must contain only numbers",
        "The list must be small in size"
      ],
      correctAnswer: 1,
      explanation: "Binary search requires the list to be sorted beforehand because it relies on comparing the target value to the middle element to determine which half of the list to search next."
    },
    {
      question: "What is the time complexity of binary search in the worst case?",
      options: [
        "O(1)",
        "O(log n)",
        "O(n)",
        "O(n²)"
      ],
      correctAnswer: 1,
      explanation: "In the worst case (when the target is not present), binary search has a time complexity of O(log n) because it halves the search space with each comparison."
    },
    {
      question: "In the array [1, 3, 5, 7, 9, 11, 13], how many comparisons are needed to find the number 5?",
      options: [
        "1",
        "2",
        "3",
        "4"
      ],
      correctAnswer: 2,
      explanation: "First comparison: middle is 7 (too high). Second comparison: new middle is 3 (too low). Third comparison: finds 5."
    },
    {
      question: "What is the best-case scenario for binary search?",
      options: [
        "Target is at the beginning of the list",
        "Target is at the end of the list",
        "Target is the middle element",
        "Target is not in the list"
      ],
      correctAnswer: 2,
      explanation: "The best case occurs when the target is the middle element of the array, requiring only one comparison (O(1))."
    },
    {
      question: "What would binary search return if the target value is not in the list?",
      options: [
        "The first element",
        "The last element",
        "An error message",
        "A 'not found' indication"
      ],
      correctAnswer: 3,
      explanation: "When the target isn't found, binary search typically returns a special value (like -1 or 'not found') to indicate this."
    }
  ];

  return <QuizEngine title="Binary Search Quiz Challenge" questions={questions} />;
};

export default BinarySearchQuiz;
