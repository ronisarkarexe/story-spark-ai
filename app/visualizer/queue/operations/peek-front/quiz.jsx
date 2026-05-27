"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const QueueQuiz = () => {
  const questions = [
    {
      question: "What does the peek front operation do in a queue?",
      options: [
        "Removes the front element",
        "Adds an element to the front",
        "Retrieves the front element without removing it",
        "Priority-Based"
      ],
      correctAnswer: 2,
      explanation: "Peek retrieves the front element but doesn't remove it."
    },
    {
      question: "What is the main difference between peekFront() and dequeue()?",
      options: [
        "peekFront() removes the element, dequeue() does not",
        "dequeue() accesses the rear",
        "peekFront() leaves the queue unchanged",
        "They are the same"
      ],
      correctAnswer: 2,
      explanation: "peekFront() retrieves without removal; dequeue() removes the front element."
    },
    {
      question: "What will the queue look like after calling peekFront() on [A, B, C, D]",
      options: ["[B, C, D]", "[A, B, C]", "[A, B, C, D]", "[D, C, B, A]"],
      correctAnswer: 2,
      explanation: "peekFront() does not modify the queue."
    },
    {
      question: "What is the time complexity of the peek operation?",
      options: [
        "O(1)",
        "O(log n)",
        "O(n)",
        "O(n²)"
      ],
      correctAnswer: 0,
      explanation: "Direct access makes it constant time."
    },
    {
      question: "In an array-based queue, how is peekFront() typically implemented?",
      options: [
        "Return array[0]",
        "Return array[front]",
        "Return array[rear]",
        "Remove array[front]"
      ],
      correctAnswer: 1,
      explanation: "The front index gives the first element."
    }
  ];

  return <QuizEngine title="Queue Peek Operation Quiz" questions={questions} />;
};

export default QueueQuiz;
