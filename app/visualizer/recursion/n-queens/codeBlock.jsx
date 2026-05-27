"use client";
import React from "react";
import CodeBlock from "@/app/components/ui/CodeBlock";

const nqueensCode = {
  javascript: `// N-Queens Backtracking in JavaScript
function solveNQueens(n = 4) {
  const board = Array(n).fill().map(() => Array(n).fill('.'));
  const solutions = [];

  function isSafe(row, col) {
    // Check row on left side
    for (let i = 0; i < col; i++) {
      if (board[row][i] === 'Q') return false;
    }
    // Check upper diagonal on left side
    for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j] === 'Q') return false;
    }
    // Check lower diagonal on left side
    for (let i = row, j = col; i < n && j >= 0; i++, j--) {
      if (board[i][j] === 'Q') return false;
    }
    return true;
  }

  function solve(col) {
    if (col >= n) {
      solutions.push(board.map(r => r.join('')));
      return;
    }
    for (let row = 0; row < n; row++) {
      if (isSafe(row, col)) {
        board[row][col] = 'Q'; // Place queen
        solve(col + 1); // Recurse
        board[row][col] = '.'; // Backtrack (remove queen)
      }
    }
  }

  solve(0);
  return solutions;
}

// Example call:
const result = solveNQueens(4);
console.log("Total solutions:", result.length);`,

  python: `# N-Queens Backtracking in Python
def solveNQueens(n=4):
    board = [['.' for _ in range(n)] for _ in range(n)]
    solutions = []

    def isSafe(row, col):
        # Check row on left side
        for i in range(col):
            if board[row][i] == 'Q':
                return False
        # Check upper diagonal
        i, j = row, col
        while i >= 0 and j >= 0:
            if board[i][j] == 'Q':
                return False
            i -= 1
            j -= 1
        # Check lower diagonal
        i, j = row, col
        while i < n and j >= 0:
            if board[i][j] == 'Q':
                return False
            i += 1
            j -= 1
        return True

    def solve(col):
        if col >= n:
            solutions.append(["".join(r) for r in board])
            return
        for row in range(n):
            if isSafe(row, col):
                board[row][col] = 'Q'  # Place queen
                solve(col + 1)         # Recurse
                board[row][col] = '.'  # Backtrack (remove queen)

    solve(0)
    return solutions

# Example call:
result = solveNQueens(4)
print(f"Total solutions: {len(result)}")`,

  java: `// N-Queens Backtracking in Java
import java.util.ArrayList;
import java.util.List;

public class NQueens {
    private static List<List<String>> solveNQueens(int n) {
        char[][] board = new char[n][n];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                board[i][j] = '.';
            }
        }
        List<List<String>> solutions = new ArrayList<>();
        solve(0, board, solutions, n);
        return solutions;
    }

    private static boolean isSafe(int row, int col, char[][] board, int n) {
        for (int i = 0; i < col; i++) {
            if (board[row][i] == 'Q') return false;
        }
        for (int i = row, j = col; i >= 0 && j >= 0; i--, j--) {
            if (board[i][j] == 'Q') return false;
        }
        for (int i = row, j = col; i < n && j >= 0; i++, j--) {
            if (board[i][j] == 'Q') return false;
        }
        return true;
    }

    private static void solve(int col, char[][] board, List<List<String>> solutions, int n) {
        if (col >= n) {
            solutions.add(construct(board));
            return;
        }
        for (int row = 0; row < n; row++) {
            if (isSafe(row, col, board, n)) {
                board[row][col] = 'Q'; // Place queen
                solve(col + 1, board, solutions, n); // Recurse
                board[row][col] = '.'; // Backtrack (remove queen)
            }
        }
    }

    private static List<String> construct(char[][] board) {
        List<String> res = new ArrayList<>();
        for (int i = 0; i < board.length; i++) {
            res.add(new String(board[i]));
        }
        return res;
    }

    public static void main(String[] args) {
        List<List<String>> result = solveNQueens(4);
        System.out.println("Total solutions: " + result.size());
    }
}`,

  c: `// N-Queens Backtracking in C
#include <stdio.h>
#include <stdbool.h>

#define N 4

int solutionsCount = 0;
char board[N][N];

void printSolution() {
    printf("Solution %d:\\n", ++solutionsCount);
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) {
            printf("%c ", board[i][j]);
        }
        printf("\\n");
    }
    printf("\\n");
}

bool isSafe(int row, int col) {
    for (int i = 0; i < col; i++) {
        if (board[row][i] == 'Q') return false;
    }
    for (int i = row, j = col; i >= 0 && j >= 0; i--, j--) {
        if (board[i][j] == 'Q') return false;
    }
    for (int i = row, j = col; i < N && j >= 0; i++, j--) {
        if (board[i][j] == 'Q') return false;
    }
    return true;
}

void solve(int col) {
    if (col >= N) {
        printSolution();
        return;
    }
    for (int row = 0; row < N; row++) {
        if (isSafe(row, col)) {
            board[row][col] = 'Q'; // Place queen
            solve(col + 1); // Recurse
            board[row][col] = '.'; // Backtrack (remove queen)
        }
    }
}

int main() {
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) {
            board[i][j] = '.';
        }
    }
    solve(0);
    printf("Total solutions found: %d\\n", solutionsCount);
    return 0;
}`,

  cpp: `// N-Queens Backtracking in C++
#include <iostream>
#include <vector>
#include <string>

using namespace std;

bool isSafe(int row, int col, const vector<string>& board, int n) {
    for (int i = 0; i < col; i++) {
        if (board[row][i] == 'Q') return false;
    }
    for (int i = row, j = col; i >= 0 && j >= 0; i--, j--) {
        if (board[i][j] == 'Q') return false;
    }
    for (int i = row, j = col; i < n && j >= 0; i++, j--) {
        if (board[i][j] == 'Q') return false;
    }
    return true;
}

void solve(int col, vector<string>& board, vector<vector<string>>& solutions, int n) {
    if (col >= n) {
        solutions.push_back(board);
        return;
    }
    for (int row = 0; row < n; row++) {
        if (isSafe(row, col, board, n)) {
            board[row][col] = 'Q'; // Place queen
            solve(col + 1, board, solutions, n); // Recurse
            board[row][col] = '.'; // Backtrack (remove queen)
        }
    }
}

vector<vector<string>> solveNQueens(int n) {
    vector<vector<string>> solutions;
    vector<string> board(n, string(n, '.'));
    solve(0, board, solutions, n);
    return solutions;
}

int main() {
    vector<vector<string>> result = solveNQueens(4);
    cout << "Total solutions: " << result.size() << endl;
    return 0;
}`,
};

const fileNames = {
  javascript: "nqueens.js",
  python: "nqueens.py",
  java: "NQueens.java",
  c: "nqueens.c",
  cpp: "nqueens.cpp",
};

const NQueensCode = () => (
  <CodeBlock
    variant="macos"
    codeExamples={nqueensCode}
    fileNames={fileNames}
  />
);

export default NQueensCode;
