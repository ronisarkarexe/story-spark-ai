"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const QueueQuiz = () => {
  const questions = [
    {
      question: "What does the isEmpty operation in a queue determine?",
      options: [
        "The total capacity of the queue",
        "Whether the queue contains any elements",
        "The position of the front element",
        "The time complexity of other operations"
      ],
      correctAnswer: 1,
      explanation: "isEmpty checks if the queue has zero elements (returns true if empty, false otherwise)."
    },
    {
      question: "What does isEmpty() return for a queue with elements [10, 20]?",
      options: ["true", "false", "null", "10"],
      correctAnswer: 1,
      explanation: "The queue contains elements, so isEmpty returns false."
    },
    {
      question: "Why is isEmpty crucial before calling dequeue()?",
      options: [
        "To improve time complexity",
        "To prevent queue underflow errors",
        "To resize the queue",
        "To count the elements"
      ],
      correctAnswer: 1,
      explanation: "Checking isEmpty first avoids errors when attempting to dequeue from an empty queue."
    },
    {
      question: "What is the time complexity of isEmpty?",
      options: ["O(n)", "O(1)", "O(log n)", "O(n²)"],
      correctAnswer: 1,
      explanation: "isEmpty runs in O(1) time as it only checks if front == rear or head == null."
    },
    {
      question: "How would you implement isEmpty for a linked list-based queue?",
      options: [
        "Check if head.next == null",
        "Check if head == null",
        "Count all nodes",
        "Compare head and tail values"
      ],
      correctAnswer: 1,
      explanation: "For linked list queues, isEmpty simply verifies if the head pointer is null."
    }
  ];

  return <QuizEngine title="Queue isEmpty Operation Quiz" questions={questions} />;
};

export default QueueQuiz;
