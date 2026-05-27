"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const InsertionSortQuiz = () => {
  const questions = [
    {
      question: "What is the basic principle of Insertion Sort?",
      options: [
        "Dividing the list into smaller sublists and merging them",
        "Building the final sorted array one item at a time by inserting each element in its correct position",
        "Repeatedly swapping adjacent elements if they are in the wrong order",
        "Selecting the smallest element and moving it to the front"
      ],
      correctAnswer: 1,
      explanation: "Insertion Sort works by building the final sorted array one item at a time, similar to how you might sort playing cards in your hands."
    },
    {
      question: "What is the time complexity of Insertion Sort in the worst case?",
      options: [
        "O(n)",
        "O(n log n)",
        "O(n²)",
        "O(1)"
      ],
      correctAnswer: 2,
      explanation: "In the worst case (when the list is sorted in reverse order), Insertion Sort requires O(n²) comparisons and shifts."
    },
    {
      question: "In the array [7, 3, 5, 2, 1], how many shifts occur when inserting the element '2'?",
      options: [
        "1",
        "2",
        "3",
        "4"
      ],
      correctAnswer: 2,
      explanation: "When inserting '2', we need to shift '7', '5', and '3' to the right (3 shifts) before inserting '2' at the beginning."
    },
    {
      question: "When would Insertion Sort perform at its best?",
      options: [
        "When the array is in random order",
        "When the array is sorted in reverse order",
        "When the array is already sorted",
        "When the array contains duplicate values"
      ],
      correctAnswer: 2,
      explanation: "Insertion Sort performs best (O(n)) when the array is already sorted, as it only needs to make comparisons without any shifts."
    },
    {
      question: "What is the space complexity of Insertion Sort?",
      options: [
        "O(n)",
        "O(n log n)",
        "O(n²)",
        "O(1)"
      ],
      correctAnswer: 3,
      explanation: "Insertion Sort is an in-place algorithm that only requires O(1) additional space for temporary storage during shifts."
    },
    {
      question: "Which of these is NOT an advantage of Insertion Sort?",
      options: [
        "Efficient for small datasets",
        "Stable (maintains relative order of equal elements)",
        "Online (can sort as it receives input)",
        "Efficient for large, randomly ordered datasets"
      ],
      correctAnswer: 3,
      explanation: "Insertion Sort is not efficient for large, randomly ordered datasets due to its O(n²) average time complexity."
    },
    {
      question: "Why might hybrid algorithms like TimSort use Insertion Sort?",
      options: [
        "Because it's the fastest sorting algorithm for all cases",
        "Because it has excellent cache performance",
        "Because of its low overhead for small subarrays",
        "Because it's the easiest to implement"
      ],
      correctAnswer: 2,
      explanation: "Hybrid algorithms often use Insertion Sort for small subarrays (typically ≤ 10 elements) due to its low overhead and good performance on small datasets."
    }
  ];

  return <QuizEngine title="Insertion Sort Quiz Challenge" questions={questions} />;
};

export default InsertionSortQuiz;
