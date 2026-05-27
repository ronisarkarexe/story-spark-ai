"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const StackQuiz = () => {
  const questions = [
    {
      question: "What is the key characteristic of postfix notation?",
      options: [
        "Operators appear before their operands",
        "Operators appear between their operands",
        "Operators appear after their operands",
        "Parentheses dictate evaluation order"
      ],
      correctAnswer: 2,
      explanation: "Postfix notation places operators **after** their operands (e.g., `3 4 +` instead of `3 + 4`)."
    },
    {
      question: "How would the infix expression `(A * B) + C` convert to postfix?",
      options: [
        "A B * C +",
        "A B C * +",
        "A * B + C",
        "+ * A B C"
      ],
      correctAnswer: 0,
      explanation: "Parentheses force `A * B` first → `A B *`, then `+ C` → `A B * C +`."
    },
    {
      question: "Which operator has the **highest precedence** in infix-to-postfix conversion?",
      options: ["+", "*", "^ (exponentiation)", "("],
      correctAnswer: 3,
      explanation: "Parentheses `(` have the highest precedence and are handled separately in the stack."
    },
    {
      question: "What is the postfix form of `2 ^ 3 ^ 2`? (Note: `^` = exponentiation)",
      options: [
        "2 3 2 ^ ^",
        "2 3 ^ 2 ^",
        "2 3 2 ^",
        "2 3 ^ 2"
      ],
      correctAnswer: 1,
      explanation: "Exponentiation is **right-associative**, so `2 ^ (3 ^ 2)` → `2 3 2 ^ ^`."
    },
    {
      question: "Which data structure is used to convert infix to postfix?",
      options: ["Queue", "Stack", "Heap", "Linked List"],
      correctAnswer: 1,
      explanation: "A **stack** temporarily holds operators and parentheses during conversion."
    },
    {
      question: "What is the postfix equivalent of `A + B * C - D / E`?",
      options: [
        "A B C * + D E / -",
        "A B + C * D E - /",
        "A B C + * D E / -",
        "A B * C + D E / -"
      ],
      correctAnswer: 0,
      explanation: "`*` and `/` have higher precedence than `+` and `-`. Steps: `B * C` → `A + (result)` → `D / E` → subtract."
    },
    {
      question: "When converting infix to postfix, what happens when a closing `)` is encountered?",
      options: [
        "Push it to the stack",
        "Pop operators from the stack until `(` is found",
        "Ignore it",
        "Add it to the output"
      ],
      correctAnswer: 1,
      explanation: "Pop all operators until `(` is reached (discarding both `(` and `)`)."
    },
    {
      question: "What is the postfix form of `3 + 4 * 5 / 6`?",
      options: [
        "3 4 5 * 6 / +",
        "3 4 5 6 / * +",
        "3 4 * 5 6 / +",
        "3 4 + 5 6 / *"
      ],
      correctAnswer: 0,
      explanation: "`*` and `/` have equal precedence (left-to-right): `4 * 5` → `result / 6` → `3 + (result)`."
    },
    {
      question: "Why does postfix notation not need parentheses?",
      options: [
        "It uses a stack for evaluation",
        "Operator position implicitly defines precedence",
        "It only supports single operations",
        "It reverses the operands"
      ],
      correctAnswer: 1,
      explanation: "Postfix order ensures operations are evaluated correctly without parentheses (e.g., `A B + C *` vs. `A B C * +`)."
    },
    {
      question: "What is the result of evaluating the postfix expression `5 1 2 + 4 * + 3 -`?",
      options: ["14", "10", "18", "20"],
      correctAnswer: 0,
      explanation: "Steps: `1 2 +` → 3; `3 4 *` → 12; `5 12 +` → 17; `17 3 -` → **14**."
    }
];

  return <QuizEngine title="Stack Quiz Challenge" questions={questions} />;
};

export default StackQuiz;
