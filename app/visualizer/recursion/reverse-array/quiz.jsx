"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const ReverseQuiz = () => {
  const questions = [
    {
      question: "Which condition represents the base case for reversing an array recursively with left (l) and right (r) pointers?",
      options: [
        "l == 0",
        "l >= r",
        "r == 0",
        "l > arr.length"
      ],
      correctAnswer: 1,
      explanation: "When left pointer 'l' meets or crosses right pointer 'r' (l >= r), the middle has been reached. All elements are swapped, and recursion terminates."
    },
    {
      question: "For an array of size 6, how many recursive swaps are performed?",
      options: [
        "2",
        "3",
        "6",
        "0"
      ],
      correctAnswer: 1,
      explanation: "For size 6, we swap elements at index (0,5), (1,4), and (2,3). Thus, exactly 3 swaps are performed."
    },
    {
      question: "What argument is passed to update the pointers in the recursive step?",
      options: [
        "reverse(l, r, arr)",
        "reverse(l - 1, r + 1, arr)",
        "reverse(l + 1, r - 1, arr)",
        "reverse(l + 2, r - 2, arr)"
      ],
      correctAnswer: 2,
      explanation: "To move pointers inwards from outer bounds, left pointer increases by 1 (l + 1) and right pointer decreases by 1 (r - 1)."
    },
    {
      question: "What is the auxiliary space complexity of the recursive array reverse function?",
      options: [
        "O(1)",
        "O(log N)",
        "O(N)",
        "O(N²)"
      ],
      correctAnswer: 2,
      explanation: "Because the call stack holds N/2 active frames before reaching the base case, the space complexity is linear, O(N)."
    },
    {
      question: "If we pass arr = [5, 4, 3, 2] to reverse, what are the first elements swapped?",
      options: [
        "4 and 3",
        "5 and 2",
        "5 and 4",
        "3 and 2"
      ],
      correctAnswer: 1,
      explanation: "Left is 0 (value 5) and right is 3 (value 2). Therefore, 5 and 2 are the first elements swapped."
    }
  ];

  return <QuizEngine title="Reverse Array Quiz" questions={questions} />;
};

export default ReverseQuiz;
