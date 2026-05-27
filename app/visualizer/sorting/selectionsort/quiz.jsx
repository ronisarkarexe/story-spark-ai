"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const SelectionSortQuiz = () => {
  const questions = [
    {
      question: "What is the basic principle of Selection Sort?",
      options: [
        "Dividing the list into smaller sublists",
        "Repeatedly finding the minimum element and swapping it with the current position",
        "Comparing adjacent elements and swapping if they're in the wrong order",
        "Merging two sorted lists into one"
      ],
      correctAnswer: 1,
      explanation: "Selection Sort works by repeatedly finding the minimum element from the unsorted part and putting it at the beginning."
    },
    {
      question: "What is the time complexity of Selection Sort in all cases?",
      options: [
        "O(n)",
        "O(n log n)",
        "O(n²)",
        "O(1)"
      ],
      correctAnswer: 2,
      explanation: "Selection Sort always requires O(n²) comparisons regardless of input order because it must scan all remaining elements for each position."
    },
    {
      question: "In the array [64, 25, 12, 22, 11], how many swaps occur during the entire sorting process?",
      options: [
        "1",
        "2",
        "4",
        "5"
      ],
      correctAnswer: 2,
      explanation: "Selection Sort makes only 4 swaps total (one for each element except the last): 64↔11, 25↔12, 22↔22 (no swap), and 64↔25."
    },
    {
      question: "What makes Selection Sort different from Bubble Sort?",
      options: [
        "Selection Sort is stable while Bubble Sort is not",
        "Selection Sort makes fewer swaps (O(n) vs O(n²))",
        "Bubble Sort has better worst-case time complexity",
        "Selection Sort requires additional O(n) space"
      ],
      correctAnswer: 1,
      explanation: "The key advantage of Selection Sort is that it makes only O(n) swaps compared to Bubble Sort's O(n²) swaps in worst case."
    },
    {
      question: "What is the space complexity of Selection Sort?",
      options: [
        "O(n)",
        "O(n log n)",
        "O(n²)",
        "O(1)"
      ],
      correctAnswer: 3,
      explanation: "Like Bubble Sort, Selection Sort is an in-place algorithm that only requires O(1) additional space for temporary storage during swaps."
    },
    {
      question: "Why is Selection Sort not considered stable?",
      options: [
        "Because it changes the relative order of equal elements",
        "Because its time complexity varies with input",
        "Because it requires recursive implementation",
        "Because it uses additional memory"
      ],
      correctAnswer: 0,
      explanation: "Selection Sort isn't stable because the swapping of elements can change the relative order of equal keys (e.g., [5a, 2, 5b] → [2, 5b, 5a])."
    },
    {
      question: "When might Selection Sort be preferred over other simple sorts?",
      options: [
        "When the input is already sorted",
        "When memory writes are expensive",
        "When stability is required",
        "When dealing with very large datasets"
      ],
      correctAnswer: 1,
      explanation: "Selection Sort's O(n) swaps make it useful when memory writes are expensive, even though it still requires O(n²) comparisons."
    }
  ];

  return <QuizEngine title="Selection Sort Quiz Challenge" questions={questions} />;
};

export default SelectionSortQuiz;
