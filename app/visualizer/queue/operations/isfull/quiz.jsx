"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const QueueQuiz = () => {
  const questions = [
    {
      question: "What does the isFull operation determine in a queue?",
      options: [
        "Whether the queue contains any elements",
        "Whether the queue has reached its maximum capacity",
        "The position of the front element",
        "The time complexity of other operations"
      ],
      correctAnswer: 1,
      explanation: "isFull checks if the queue has reached its maximum capacity in fixed-size implementations."
    },
    {
      question: "In which type of queue implementation is isFull most commonly needed?",
      options: [
        "Linked list-based queues",
        "Dynamic arrays",
        "Array-based queues with fixed capacity",
        "All queue implementations"
      ],
      correctAnswer: 2,
      explanation: "isFull is crucial for array-based queues with fixed capacity to prevent overflow."
    },
    {
      question: "What is the time complexity of the isFull operation?",
      options: ["O(n)", "O(1)", "O(log n)", "O(n²)"],
      correctAnswer: 1,
      explanation: "isFull runs in O(1) constant time as it only requires simple pointer comparisons."
    },
    {
      question: "In a circular array implementation, when is the queue considered full?",
      options: [
        "When front == 0",
        "When rear == capacity - 1",
        "When (rear + 1) % capacity == front",
        "When front == rear"
      ],
      correctAnswer: 2,
      explanation: "In circular arrays, the queue is full when the next position after rear equals front."
    },
    {
      question: "What would isFull() return for a queue with capacity 3 containing [10, 20, 30]?",
      options: ["true", "false", "null", "Error"],
      correctAnswer: 0,
      explanation: "The queue has reached its maximum capacity of 3 elements, so isFull returns true."
    }
  ];

  return <QuizEngine title="Queue isFull Operation Quiz" questions={questions} />;
};

export default QueueQuiz;
