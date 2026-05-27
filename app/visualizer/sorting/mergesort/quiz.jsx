"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const MergeSortQuiz = () => {
  const questions = [
    {
      question: "What is the fundamental principle behind Merge Sort?",
      options: [
        "Repeatedly swapping adjacent elements if they are in the wrong order",
        "Dividing the array into smaller subarrays and merging them back in sorted order",
        "Selecting the smallest element and moving it to the front",
        "Building the sorted array one element at a time by insertion"
      ],
      correctAnswer: 1,
      explanation: "Merge Sort follows the divide-and-conquer approach by recursively dividing the array into halves until single elements remain, then merging them back in sorted order."
    },
    {
      question: "What is the time complexity of Merge Sort in all cases (best, average, worst)?",
      options: [
        "O(n)",
        "O(n log n)",
        "O(n²)",
        "O(log n)"
      ],
      correctAnswer: 1,
      explanation: "Merge Sort has consistent O(n log n) performance in all cases because it always divides the array in half and performs linear-time merges regardless of input order."
    },
    {
      question: "In the array [38, 27, 43, 3, 9, 82, 10], how many times is the array divided before reaching single elements?",
      options: [
        "2 times",
        "3 times",
        "4 times",
        "5 times"
      ],
      correctAnswer: 1,
      explanation: "The array is divided 3 times: 1) [38,27,43] and [3,9,82,10], 2) [38], [27,43], [3,9], [82,10], 3) All subarrays are single elements."
    },
    {
      question: "What is the space complexity of Merge Sort?",
      options: [
        "O(1)",
        "O(log n)",
        "O(n)",
        "O(n²)"
      ],
      correctAnswer: 2,
      explanation: "Merge Sort requires O(n) additional space for temporary arrays during the merging phase, making it not an in-place sorting algorithm."
    },
    {
      question: "Which of these is NOT an advantage of Merge Sort?",
      options: [
        "Stable sorting (maintains relative order of equal elements)",
        "Excellent for large datasets",
        "Requires minimal additional memory (O(1) space)",
        "Well-suited for external sorting"
      ],
      correctAnswer: 2,
      explanation: "Merge Sort requires O(n) additional space, not O(1). Its advantages include stability, consistent O(n log n) performance, and suitability for external sorting."
    },
    {
      question: "Why is Merge Sort particularly good for sorting linked lists?",
      options: [
        "Because it doesn't require random access to elements",
        "Because it's the fastest sorting algorithm for all cases",
        "Because it can sort in O(1) space with linked lists",
        "Because it doesn't require comparisons"
      ],
      correctAnswer: 0,
      explanation: "Merge Sort works well with linked lists because it primarily requires sequential access (not random access) during the merge phase, and it can be implemented with O(1) space for linked lists."
    },
    {
      question: "What makes Merge Sort suitable for external sorting (sorting data too large for RAM)?",
      options: [
        "Its ability to sort with minimal comparisons",
        "Its divide-and-conquer approach that works well with sequential access",
        "Its in-place sorting capability",
        "Its O(n) best-case time complexity"
      ],
      correctAnswer: 1,
      explanation: "Merge Sort's divide-and-conquer approach works well with sequential access patterns needed for external storage, and it can efficiently merge sorted runs from disk."
    }
  ];

  return <QuizEngine title="Merge Sort Quiz Challenge" questions={questions} />;
};

export default MergeSortQuiz;
