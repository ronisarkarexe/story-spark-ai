"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const SubsequencesQuiz = () => {
  const questions = [
    {
      question: "How many subsequences (subsets) are generated recursively for a set of size N?",
      options: [
        "N",
        "N²",
        "2^N",
        "N!"
      ],
      correctAnswer: 2,
      explanation: "Since each of the N elements can either be taken or skipped, there are 2 * 2 * ... * 2 (N times) = 2^N total subsets."
    },
    {
      question: "What does the term 'backtracking' refer to in subsequences recursion?",
      options: [
        "Moving to a different topic in DSA",
        "Undoing the last decision (e.g. popping the element we just added) to explore another choice",
        "Decreasing the loop index counter to 0",
        "Throwing a compilation error on stack overflow"
      ],
      correctAnswer: 1,
      explanation: "Backtracking means restoring the state (e.g., removing the taken element via current.pop()) before exploring the alternate 'skip' choice."
    },
    {
      question: "For array [1, 2, 3], which of the following is NOT a valid subsequence?",
      options: [
        "[1, 3]",
        "[2, 1]",
        "[2, 3]",
        "[]"
      ],
      correctAnswer: 1,
      explanation: "A subsequence must preserve the original order of elements. In [1, 2, 3], '2' comes after '1', so [2, 1] is invalid."
    },
    {
      question: "What is the time complexity of generating all subsets recursively?",
      options: [
        "O(N)",
        "O(N log N)",
        "O(2^N)",
        "O(N!)"
      ],
      correctAnswer: 2,
      explanation: "Generating all subsets explores a binary decision tree of size 2^N, yielding O(2^N) exponential time complexity."
    },
    {
      question: "What is the maximum number of active stack frames on the call stack when generating subsequences for an array of size N?",
      options: [
        "2",
        "N + 1",
        "2^N",
        "N!"
      ],
      correctAnswer: 1,
      explanation: "The depth of the recursion tree is N. Hence, at most N+1 stack frames are active on the call stack at any one time."
    }
  ];

  return <QuizEngine title="Subsequences Quiz" questions={questions} />;
};

export default SubsequencesQuiz;
