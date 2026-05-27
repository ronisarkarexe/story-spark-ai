"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const BubbleSortQuiz = () => {
  const questions = [
    {
      question: "What is the basic principle of Bubble Sort?",
      options: [
        "Dividing the list into smaller sublists",
        "Repeatedly swapping adjacent elements if they are in the wrong order",
        "Selecting the smallest element and moving it to the front",
        "Merging two sorted lists into one",
      ],
      correctAnswer: 1,
      explanation:
        "Bubble Sort works by repeatedly stepping through the list, comparing adjacent elements and swapping them if they are in the wrong order.",
    },
    {
      question: "What is the time complexity of Bubble Sort in the worst case?",
      options: ["O(n)", "O(n log n)", "O(n²)", "O(1)"],
      correctAnswer: 2,
      explanation:
        "In the worst case (when the list is sorted in reverse order), Bubble Sort requires O(n²) comparisons and swaps.",
    },
    {
      question:
        "In the array [5, 1, 4, 2, 8], how many swaps occur during the first pass of Bubble Sort?",
      options: ["1", "2", "3", "4"],
      correctAnswer: 2,
      explanation:
        "First pass swaps (5,1), (5,4), and (5,2) - totaling 3 swaps. The pair (5,8) doesn't need swapping.",
    },
    {
      question: "When would Bubble Sort perform at its best?",
      options: [
        "When the array is in random order",
        "When the array is sorted in reverse order",
        "When the array is already sorted",
        "When the array contains duplicate values",
      ],
      correctAnswer: 2,
      explanation:
        "Bubble Sort performs best (O(n)) when the array is already sorted, as it only needs one pass through the array without any swaps.",
    },
    {
      question: "What is the space complexity of Bubble Sort?",
      options: ["O(n)", "O(n log n)", "O(n²)", "O(1)"],
      correctAnswer: 3,
      explanation:
        "Bubble Sort is an in-place algorithm that only requires O(1) additional space for temporary storage during swaps.",
    },
    {
      question:
        "How can you optimize Bubble Sort to stop early if the array becomes sorted?",
      options: [
        "By counting the number of swaps",
        "By using a flag to check if any swaps occurred in a pass",
        "By reducing the array size after each pass",
        "By sorting the array in both directions",
      ],
      correctAnswer: 1,
      explanation:
        "Using a flag to track if any swaps occurred during a pass allows the algorithm to terminate early if the array is already sorted.",
    },
    {
      question:
        "Why is Bubble Sort rarely used in practice for large datasets?",
      options: [
        "Because it's too complex to implement",
        "Because it's not a stable sorting algorithm",
        "Because of its O(n²) time complexity for average cases",
        "Because it requires O(n) additional space",
      ],
      correctAnswer: 2,
      explanation:
        "While simple to implement, Bubble Sort's O(n²) time complexity makes it inefficient for large datasets compared to algorithms like QuickSort or MergeSort.",
    },
  ];

  return <QuizEngine title="Bubble Sort Quiz Challenge" questions={questions} />;
};

export default BubbleSortQuiz;
