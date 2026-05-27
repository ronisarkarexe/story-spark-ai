"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const QuickSortQuiz = () => {
  const questions = [
    {
      question: "What is the fundamental principle behind Quick Sort?",
      options: [
        "Merging two sorted lists into one",
        "Building a heap structure from the array",
        "Dividing the array around a pivot element",
        "Finding the minimum element repeatedly"
      ],
      correctAnswer: 2,
      explanation: "Quick Sort uses a divide-and-conquer approach by selecting a pivot element and partitioning the array into elements less than and greater than the pivot."
    },
    {
      question: "What is the average-case time complexity of Quick Sort?",
      options: [
        "O(n)",
        "O(n log n)",
        "O(n²)",
        "O(log n)"
      ],
      correctAnswer: 1,
      explanation: "With good pivot selection that creates balanced partitions, Quick Sort averages O(n log n) time complexity."
    },
    {
      question: "Which pivot selection strategy helps avoid the worst-case O(n²) scenario?",
      options: [
        "Always choosing the first element",
        "Always choosing the last element",
        "Median-of-three method",
        "Always choosing the middle element"
      ],
      correctAnswer: 2,
      explanation: "The median-of-three strategy (choosing the median of first, middle, and last elements) helps prevent consistently bad pivot choices that lead to unbalanced partitions."
    },
    {
      question: "What is the space complexity of Quick Sort in the average case?",
      options: [
        "O(1)",
        "O(n)",
        "O(log n)",
        "O(n log n)"
      ],
      correctAnswer: 2,
      explanation: "Quick Sort requires O(log n) space for the call stack in the average case due to recursive calls, but can degrade to O(n) in worst-case scenarios."
    },
    {
      question: "In the array [10, 80, 30, 90, 40, 50, 70], if we choose the last element as pivot, what is the array after the first partition?",
      options: [
        "[10, 30, 40, 50, 70, 80, 90]",
        "[10, 30, 40] [50] [70, 80, 90]",
        "[10, 30, 40, 50] [70] [80, 90]",
        "[10, 80, 30, 90, 40, 50, 70]"
      ],
      correctAnswer: 2,
      explanation: "With pivot=70, elements less than 70 (10,30,40,50) go left, elements greater (80,90) go right, and 70 is in its final position."
    },
    {
      question: "Which of these is NOT an advantage of Quick Sort?",
      options: [
        "Excellent average-case performance",
        "Stable sorting (maintains relative order of equal elements)",
        "In-place sorting (requires minimal additional memory)",
        "Cache-efficient due to sequential memory access"
      ],
      correctAnswer: 1,
      explanation: "Quick Sort is not stable - the relative order of equal elements may change during partitioning."
    },
    {
      question: "What causes Quick Sort's worst-case O(n²) time complexity?",
      options: [
        "When the array contains duplicate elements",
        "When the pivot consistently creates highly unbalanced partitions",
        "When the array size is very small",
        "When using extra space for merging"
      ],
      correctAnswer: 1,
      explanation: "The worst case occurs when the pivot selection consistently creates partitions of size n-1 and 0 (extremely unbalanced), leading to n nested calls."
    },
    {
      question: "Why is Quick Sort often preferred over Merge Sort for in-memory sorting?",
      options: [
        "It has better worst-case time complexity",
        "It is a stable sorting algorithm",
        "It has better cache performance due to sequential access",
        "It requires less code to implement"
      ],
      correctAnswer: 2,
      explanation: "Quick Sort's sequential memory access pattern makes it more cache-friendly than Merge Sort, contributing to its better real-world performance despite having the same average time complexity."
    },
    {
      question: "Which of these standard library implementations typically uses Quick Sort?",
      options: [
        "Python's sorted() function",
        "Java's Arrays.sort() for primitive types",
        "C++ STL's stable_sort()",
        "JavaScript's Array.prototype.sort()"
      ],
      correctAnswer: 1,
      explanation: "Java's Arrays.sort() uses a dual-pivot Quick Sort for primitive types (which don't need stability), while object sorting uses a stable Merge Sort variant."
    },
    {
      question: "What is the primary purpose of the partition step in Quick Sort?",
      options: [
        "To divide the array into exactly equal halves",
        "To place the pivot element in its correct final position",
        "To sort the array in one pass",
        "To identify duplicate elements in the array"
      ],
      correctAnswer: 1,
      explanation: "The partition step's main goal is to place the pivot in its correct sorted position while arranging other elements to be less than or greater than the pivot."
    }
  ];

  return <QuizEngine title="Quick Sort Quiz Challenge" questions={questions} />;
};

export default QuickSortQuiz;
