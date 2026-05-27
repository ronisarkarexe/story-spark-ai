"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const StackQuiz = () => {
  const questions = [
    {
      question: "What is the defining characteristic of prefix notation?",
      options: [
        "Operators appear between operands",
        "Operators appear after operands",
        "Operators appear before operands",
        "Operators are omitted entirely"
      ],
      correctAnswer: 2,
      explanation: "Prefix notation places operators **before** their operands (e.g., `+ 3 4` instead of `3 + 4`)."
    },
    {
      question: "How is the infix expression `A * (B + C)` converted to prefix?",
      options: [
        "* A + B C",
        "A * B + C",
        "+ * A B C",
        "* + A B C"
      ],
      correctAnswer: 0,
      explanation: "Parentheses force `B + C` first → `+ B C`, then `* A` → `* A + B C`."
    },
    {
      question: "Which step is unique to infix-to-prefix conversion (compared to postfix)?",
      options: [
        "Using a stack for operators",
        "Reversing the infix expression",
        "Handling operator precedence",
        "Processing left to right"
      ],
      correctAnswer: 1,
      explanation: "Prefix conversion requires **reversing the infix expression** first (while handling parentheses swaps)."
    },
    {
      question: "What is the prefix form of `2 ^ 3 ^ 2`? (^ = exponentiation)",
      options: [
        "^ 2 ^ 3 2",
        "^ ^ 2 3 2",
        "2 ^ 3 ^ 2",
        "^ 2 3 ^ 2"
      ],
      correctAnswer: 0,
      explanation: "Exponentiation is right-associative: `2 ^ (3 ^ 2)` → `^ 2 ^ 3 2`."
    },
    {
      question: "Why does prefix notation eliminate the need for parentheses?",
      options: [
        "Operators are evaluated in reverse order",
        "Operator position implicitly defines precedence",
        "It only supports two operands",
        "It uses postfix internally"
      ],
      correctAnswer: 1,
      explanation: "Operator order in prefix ensures correct evaluation (e.g., `* + A B - C D` = `(A+B) * (C-D)`)."
    },
    {
      question: "What is the prefix equivalent of `A - B / C + D`?",
      options: [
        "+ - A / B C D",
        "- A / B + C D",
        "+ / - A B C D",
        "- + A / B C D"
      ],
      correctAnswer: 0,
      explanation: "`/` has higher precedence: `B / C` → `- A (result)` → `+ (result) D` → `+ - A / B C D`."
    },
    {
      question: "Which data structure is used during infix-to-prefix conversion?",
      options: [
        "Queue",
        "Stack",
        "Binary Tree",
        "Hash Table"
      ],
      correctAnswer: 1,
      explanation: "A **stack** manages operators and parentheses during conversion."
    },
    {
      question: "What is the prefix form of `(A + B) * C - D`?",
      options: [
        "- * + A B C D",
        "* + A B - C D",
        "- + * A B C D",
        "* - + A B C D"
      ],
      correctAnswer: 0,
      explanation: "Parentheses first: `+ A B` → `* (result) C` → `- (result) D` → `- * + A B C D`."
    },
    {
      question: "How are parentheses handled during infix reversal for prefix conversion?",
      options: [
        "They are deleted",
        "They are kept in the same order",
        "`(` becomes `)` and vice versa",
        "They are converted to brackets"
      ],
      correctAnswer: 2,
      explanation: "During reversal, `(` and `)` are swapped to maintain correctness (e.g., `(A+B)` → `)B+A(`)."
    },
    {
      question: "What is the result of evaluating the prefix expression `- * + 2 3 4 5`?",
      options: [
        "15",
        "9",
        "17",
        "20"
      ],
      correctAnswer: 0,
      explanation: "Steps: `+ 2 3` → 5; `* 5 4` → 20; `- 20 5` → **15**."
    }
];

  return <QuizEngine title="Stack Quiz Challenge" questions={questions} />;
};

export default StackQuiz;
