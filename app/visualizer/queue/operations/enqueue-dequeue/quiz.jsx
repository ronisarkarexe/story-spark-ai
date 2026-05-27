"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const QueueQuiz = () => {
  const questions = [
    {
      question: "What principle does a Queue data structure follow?",
      options: [
        "Last-In-First-Out (LIFO)",
        "First-In-First-Out (FIFO)",
        "Random Access",
        "Priority-Based"
      ],
      correctAnswer: 1,
      explanation: "Queues follow FIFO: The first element added is the first one removed."
    },
    {
      question: "Where is a new element added in a Queue?",
      options: [
        "At the front",
        "At the rear",
        "In the middle",
        "At any random position"
      ],
      correctAnswer: 1,
      explanation: "Enqueue adds elements to the **rear** (end) of the queue."
    },
    {
      question: "What is the time complexity of the enqueue operation?",
      options: ["O(n)", "O(1)", "O(log n)", "O(n²)"],
      correctAnswer: 1,
      explanation: "Enqueue is O(1) as it only requires adding an element to the end."
    },
    {
      question: "Given a queue [5, 10, 15], what will it look like after enqueue(20) and dequeue()?",
      options: [
        "[10, 15, 20]",
        "[5, 10, 15]",
        "[20, 10, 15]",
        "[5, 10, 20]"
      ],
      correctAnswer: 0,
      explanation: "Enqueue(20) → [5,10,15,20]; Dequeue() removes 5 → [10,15,20]."
    },
    {
      question: "What happens if you try to dequeue from an empty queue?",
      options: [
        "Returns null",
        "Returns 0",
        "Causes an underflow error",
        "Automatically resizes the queue"
      ],
      correctAnswer: 2,
      explanation: "Dequeueing from an empty queue results in an **underflow** error."
    }
  ];

  return <QuizEngine title="Queue Quiz Challenge" questions={questions} />;
};

export default QueueQuiz;
