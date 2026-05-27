"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const NQueensQuiz = () => {
  const questions = [
    {
      question: "What is the primary constraint in the N-Queens problem?",
      options: [
        "Place N queens on an N×N board such that no two queens attack each other (same row, column, or diagonal).",
        "Place N queens such that every row and column has exactly two queens.",
        "Move a single queen across all chessboard squares without visiting any square twice.",
        "Ensure all queens are placed only on white squares of the chessboard."
      ],
      correctAnswer: 0,
      explanation: "The classic N-Queens puzzle requires placing N queens on an NxN grid such that no two queens share the same row, column, or diagonal."
    },
    {
      question: "In the backtracking algorithm for N-Queens, if column 'col' reaches N (the board size), what does it signify?",
      options: [
        "A conflict has occurred, and the algorithm must backtrack.",
        "A valid configuration/solution has been found and recorded.",
        "The chessboard has run out of space and the program will crash.",
        "The board is half-filled and we must start filling from the right side."
      ],
      correctAnswer: 1,
      explanation: "Since columns are 0-indexed (from 0 to N-1), reaching column N means we have successfully placed a queen in every column (0 to N-1) without conflicts, which is a complete solution."
    },
    {
      question: "For a standard 4x4 chessboard (N = 4), how many distinct solutions exist?",
      options: [
        "1",
        "2",
        "4",
        "8"
      ],
      correctAnswer: 1,
      explanation: "There are exactly 2 solutions for N = 4: [1, 3, 0, 2] and [2, 0, 3, 1] (represented as row indices for each column)."
    },
    {
      question: "What is the purpose of the backtracking step (e.g., setting board[col] = -1 or board[row][col] = '.') after the recursive call?",
      options: [
        "It resets the whole board to try a completely new size.",
        "It cleans up memory, but does not affect the search path.",
        "It undoes the current queen placement so that the loop can try placing a queen in the next row of this column.",
        "It tells the compiler that the function has finished execution."
      ],
      correctAnswer: 2,
      explanation: "Backtracking relies on reverting choices. Reverting the current cell to empty allows the algorithm to explore other row candidates in the parent frame loop."
    },
    {
      question: "What is the worst-case time complexity of the N-Queens backtracking algorithm?",
      options: [
        "O(N)",
        "O(N²)",
        "O(N!)",
        "O(2^N)"
      ],
      correctAnswer: 2,
      explanation: "In the worst case, we check placements in every row for each column, resulting in N options for the first column, N-1 for the second, N-2 for the third, etc., leading to O(N!) time complexity."
    }
  ];

  return <QuizEngine title="N-Queens Backtracking Quiz" questions={questions} />;
};

export default NQueensQuiz;
