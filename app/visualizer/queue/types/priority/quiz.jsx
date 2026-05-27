"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const QueueQuiz = () => {
  const questions = [
    {
      question: "What is the fundamental difference between a priority queue and a standard queue?",
      options: [
        "Priority queues use LIFO ordering",
        "Elements are processed based on priority rather than insertion order",
        "Priority queues can only store numeric values",
        "Standard queues are always faster"
      ],
      correctAnswer: 1,
      explanation: "Priority queues process elements by their priority value rather than following strict FIFO order like standard queues."
    },
    {
      question: "Which operation in a max-priority queue returns the highest priority element without removing it?",
      options: [
        "extractMax()",
        "insert()",
        "peek()",
        "remove()"
      ],
      correctAnswer: 2,
      explanation: "peek() allows viewing the highest priority element while leaving it in the queue."
    },
    {
      question: "What is the time complexity of insert() and extractMax() operations in a binary heap implementation?",
      options: [
        "O(1) for both",
        "O(log n) for both",
        "O(n) for insert, O(1) for extractMax",
        "O(1) for insert, O(n) for extractMax"
      ],
      correctAnswer: 1,
      explanation: "Binary heap implementations provide O(log n) time for both insertion and extraction operations."
    },
    {
      question: "Which data structure is MOST commonly used to implement a priority queue?",
      options: [
        "Linked List",
        "Hash Table",
        "Binary Heap",
        "Graph"
      ],
      correctAnswer: 2,
      explanation: "Binary heaps are the most common implementation due to their balance of efficiency and simplicity."
    },
    {
      question: "In Dijkstra's algorithm, why is a priority queue used?",
      options: [
        "To store visited nodes in FIFO order",
        "To always process the node with the current shortest path estimate",
        "To sort all nodes alphabetically",
        "To implement depth-first search"
      ],
      correctAnswer: 1,
      explanation: "The priority queue ensures the node with the smallest current distance estimate is processed next, which is crucial for Dijkstra's algorithm."
    }
  ];

  return <QuizEngine title="Priority Queue Quiz" questions={questions} />;
};

export default QueueQuiz;
