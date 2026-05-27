"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const handleNext = () => {
  const questions = [
  {
    "question": "What is the time complexity of Heap Sort in the worst case?",
    "options": [
      "O(N)",
      "O(log N)",
      "O(N log N)",
      "O(N^2)"
    ],
    "correctAnswer": 2,
    "explanation": "Heap Sort always takes O(N log N) time because the heapify process takes O(log N) and it is called N times."
  },
  {
    "question": "Which of the following properties is true about Heap Sort?",
    "options": [
      "It is a stable sorting algorithm",
      "It requires O(N) extra space",
      "It is an in-place sorting algorithm",
      "It is slower than Bubble Sort"
    ],
    "correctAnswer": 2,
    "explanation": "Heap sort is an in-place sorting algorithm and requires O(1) extra space. However, it is not stable."
  },
  {
    "question": "When sorting an array in ascending order using Heap Sort, which type of heap is used?",
    "options": [
      "Min-Heap",
      "Max-Heap",
      "Binary Search Tree",
      "Fibonacci Heap"
    ],
    "correctAnswer": 1,
    "explanation": "A Max-Heap is built so that the largest element is at the root. We swap it with the last element and reduce the heap size to sort the array in ascending order."
  }
];

  return <QuizEngine title="Heap Sort Quiz" questions={questions} />;
};

export default handleNext;
