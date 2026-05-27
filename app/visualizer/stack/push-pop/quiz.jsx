"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const StackQuiz = () => {
  const questions = [
    {
      question: "What principle does the stack data structure follow?",
      options: [
        "FIFO (First In First Out)",
        "LIFO (Last In First Out)",
        "Random Access",
        "Priority Ordering"
      ],
      correctAnswer: 1,
      explanation:
        "Stack follows LIFO (Last In First Out) principle - the last element added is the first one to be removed.",
    },
    {
      question: "What is the time complexity of push and pop operations in a stack?",
      options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
      correctAnswer: 2,
      explanation:
        "Both push and pop operations in a stack have O(1) time complexity as they only involve operations at the top of the stack.",
    },
    {
      question: "What happens when you try to pop from an empty stack?",
      options: [
        "Stack Overflow",
        "Stack Underflow",
        "Null Pointer Exception",
        "The stack resizes itself"
      ],
      correctAnswer: 1,
      explanation:
        "Attempting to pop from an empty stack results in stack underflow, which is an error condition.",
    },
    {
      question: "After pushing 10, 20, and 30 onto an empty stack, what will be the result of two consecutive pop operations?",
      options: [
        "10 then 20",
        "20 then 10",
        "30 then 20",
        "30 then 10"
      ],
      correctAnswer: 2,
      explanation:
        "The stack will be [30, 20, 10] after pushes. First pop returns 30, second pop returns 20.",
    },
    {
      question: "What is the space complexity of stack operations?",
      options: ["O(n)", "O(1)", "O(log n)", "Depends on implementation"],
      correctAnswer: 1,
      explanation:
        "Each push/pop operation itself uses constant space (O(1)), though the overall stack may use O(n) space.",
    },
    {
      question: "Which of the following is NOT a typical application of stacks?",
      options: [
        "Function call management",
        "Undo operations in text editors",
        "CPU scheduling",
        "Expression evaluation"
      ],
      correctAnswer: 2,
      explanation:
        "CPU scheduling typically uses queues rather than stacks. Stacks are used in function calls, undo operations, and expression evaluation.",
    },
    {
      question: "What happens when you push to a full stack (in fixed-size implementation)?",
      options: [
        "The stack automatically resizes",
        "Stack Overflow",
        "The oldest element is removed",
        "The operation is queued"
      ],
      correctAnswer: 1,
      explanation:
        "Attempting to push to a full stack in fixed-size implementations results in stack overflow.",
    },
    {
      question: "In a stack implementation, which end is used for both push and pop operations?",
      options: [
        "The front end",
        "The rear end",
        "The top end",
        "Any random end"
      ],
      correctAnswer: 2,
      explanation:
        "All stack operations (push and pop) happen at the top end of the stack.",
    },
    {
      question: "Which data structure would be most appropriate to implement an undo feature?",
      options: [
        "Queue",
        "Stack",
        "Linked List",
        "Tree"
      ],
      correctAnswer: 1,
      explanation:
        "A stack is ideal for undo operations as it naturally follows the LIFO principle - the last action should be the first one undone.",
    },
    {
      question: "What would be the result of pushing 'A', then 'B', then popping, then pushing 'C' to an empty stack?",
      options: [
        "[A, B, C]",
        "[C, A]",
        "[A, C]",
        "[B, C]"
      ],
      correctAnswer: 1,
      explanation:
        "Operations: push A → [A], push B → [B, A], pop → returns B: [A], push C → [C, A].",
    },
  ];

  return <QuizEngine title="Stack Quiz Challenge" questions={questions} />;
};

export default StackQuiz;
