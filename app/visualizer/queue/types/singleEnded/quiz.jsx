"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const QueueQuiz = () => {
  const questions = [
    {
      question: "What principle does a single-ended queue follow?",
      options: [
        "LIFO (Last-In-First-Out)",
        "FIFO (First-In-First-Out)", 
        "Priority-Based",
        "Random Access"
      ],
      correctAnswer: 1,
      explanation: "Single-ended queues strictly follow the First-In-First-Out (FIFO) principle."
    },
    {
      question: "Where are elements added in a single-ended queue?",
      options: [
        "At the front",
        "At the rear", 
        "At any position",
        "In the middle"
      ],
      correctAnswer: 1,
      explanation: "Elements are always added (enqueued) at the rear of the queue."
    },
    {
      question: "What operation removes an element from a single-ended queue?",
      options: [
        "enqueue()",
        "dequeue()", 
        "peek()",
        "isEmpty()"
      ],
      correctAnswer: 1,
      explanation: "dequeue() removes and returns the element from the front of the queue."
    },
    {
      question: "What would the queue [10, 20, 30] look like after dequeue()?",
      options: [
        "[10, 20]",
        "[20, 30]", 
        "[10, 20, 30]",
        "[30, 20]"
      ],
      correctAnswer: 1,
      explanation: "dequeue() removes the front element (10), leaving [20, 30]."
    },
    {
      question: "What is the time complexity of enqueue() and dequeue() operations?",
      options: [
        "O(1) for both",
        "O(n) for both", 
        "O(1) for enqueue, O(n) for dequeue",
        "O(n) for enqueue, O(1) for dequeue"
      ],
      correctAnswer: 0,
      explanation: "Both operations are O(1) in a properly implemented queue."
    }
  ];

  return <QuizEngine title="Single-Ended Queue Quiz" questions={questions} />;
};

export default QueueQuiz;
