"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const QueueQuiz = () => {
  const questions = [
    {
      question: "What is the primary advantage of a circular queue over a linear queue?",
      options: [
        "Unlimited capacity",
        "Better memory utilization by reusing empty spaces",
        "Faster sorting capability",
        "Built-in search functionality"
      ],
      correctAnswer: 1,
      explanation: "Circular queues efficiently reuse empty spaces created by dequeue operations, preventing memory wastage."
    },
    {
      question: "How is the rear pointer calculated after an enqueue operation in a circular queue?",
      options: [
        "rear = rear + 1",
        "rear = (rear + 1) % capacity",
        "rear = front + 1",
        "rear = capacity - 1"
      ],
      correctAnswer: 1,
      explanation: "The rear pointer wraps around using modulo arithmetic: rear = (rear + 1) % capacity."
    },
    {
      question: "What condition indicates that a circular queue is full?",
      options: [
        "front == rear",
        "(rear + 1) % capacity == front",
        "front == 0 && rear == capacity - 1",
        "rear == capacity - 1"
      ],
      correctAnswer: 1,
      explanation: "The queue is full when the next position after rear (wrapped around) equals front."
    },
    {
      question: "Why do circular queues typically maintain one empty slot?",
      options: [
        "To reduce memory usage",
        "To distinguish between full and empty states",
        "For temporary storage during operations",
        "It's required by the implementation language"
      ],
      correctAnswer: 1,
      explanation: "Without one empty slot, the conditions for full and empty states would be identical (front == rear)."
    },
    {
      question: "What is the time complexity of peekFront() in a circular queue?",
      options: [
        "O(1)",
        "O(n)",
        "O(log n)",
        "O(n²)"
      ],
      correctAnswer: 0,
      explanation: "All basic operations (enqueue, dequeue, peek) are O(1) in a circular queue."
    }
  ];

  return <QuizEngine title="Circular Queue Quiz" questions={questions} />;
};

export default QueueQuiz;
