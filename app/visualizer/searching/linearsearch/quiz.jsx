"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const LinearSearchQuiz = () => {
  const questions = [
    {
      question: "What is the basic principle of linear search?",
      options: [
        "Dividing the list in half repeatedly",
        "Checking each element one by one from the start",
        "Sorting the list first then searching",
        "Starting from the middle of the list"
      ],
      correctAnswer: 1,
      explanation: "Linear search works by checking each element sequentially from the beginning until it finds the target value."
    },
    {
      question: "What is the time complexity of linear search in the worst case?",
      options: [
        "O(1)",
        "O(log n)",
        "O(n)",
        "O(n²)"
      ],
      correctAnswer: 2,
      explanation: "In the worst case (when the target is last or not present), linear search checks all n elements, resulting in O(n) complexity."
    },
    {
      question: "In the array [5, 3, 8, 1, 9], how many comparisons are needed to find the number 1?",
      options: [
        "1",
        "2",
        "3",
        "4"
      ],
      correctAnswer: 3,
      explanation: "The search checks 5 (1st), 3 (2nd), 8 (3rd), and finally finds 1 on the 4th comparison."
    },
    {
      question: "When would linear search perform at its best?",
      options: [
        "When the target is at the end of the list",
        "When the target is at the middle of the list",
        "When the target is at the beginning of the list",
        "When the list is sorted"
      ],
      correctAnswer: 2,
      explanation: "Linear search performs best (O(1)) when the target is the first element, as it only needs one comparison."
    },
    {
      question: "What would a linear search algorithm return if the target value is not in the list?",
      options: [
        "The first element",
        "The last element",
        "An error message",
        "A 'not found' indication"
      ],
      correctAnswer: 3,
      explanation: "When the target isn't found, linear search typically returns a special value (like -1 or 'not found') to indicate this."
    }
  ];

  return <QuizEngine title="Linear Search Quiz Challenge" questions={questions} />;
};

export default LinearSearchQuiz;
