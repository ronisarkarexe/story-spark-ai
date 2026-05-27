"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const QueueQuiz = () => {
  const questions = [
    {
      question: "What is the key characteristic that distinguishes a deque from a single-ended queue?",
      options: [
        "Allows operations at only one end",
        "Allows operations at both ends", 
        "Only allows insertion at one end and removal at the other",
        "Uses LIFO principle exclusively"
      ],
      correctAnswer: 1,
      explanation: "Deques allow insertion and removal at both front and rear ends, unlike single-ended queues which are restricted to rear insertion and front removal."
    },
    {
      question: "Which of the following is NOT a standard deque operation?",
      options: [
        "addFront()",
        "addRear()", 
        "removeMiddle()",
        "removeRear()"
      ],
      correctAnswer: 2,
      explanation: "Deques don't typically support direct middle removal - their core operations work at the two ends only."
    },
    {
      question: "What would be the result of these operations on an empty deque? addFront(10), addRear(20), removeFront()",
      options: [
        "10",
        "20", 
        "[10, 20]",
        "Empty deque"
      ],
      correctAnswer: 1,
      explanation: "addFront(10) → [10], addRear(20) → [10, 20], removeFront() removes 10, leaving 20 as the return value."
    },
    {
      question: "Which data structure is most commonly used to implement a deque efficiently?",
      options: [
        "Singly Linked List",
        "Binary Tree", 
        "Doubly Linked List",
        "Hash Table"
      ],
      correctAnswer: 2,
      explanation: "Doubly linked lists are ideal for deque implementation as they allow O(1) operations at both ends."
    },
    {
      question: "What is the time complexity for removeRear() in a properly implemented deque?",
      options: [
        "O(1)",
        "O(n)", 
        "O(log n)",
        "O(n²)"
      ],
      correctAnswer: 0,
      explanation: "All core deque operations (addFront, addRear, removeFront, removeRear) should be O(1) in a proper implementation."
    }
  ];

  return <QuizEngine title="Deque Quiz" questions={questions} />;
};

export default QueueQuiz;
