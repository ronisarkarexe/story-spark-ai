"use client";
import React from "react";
import CodeBlock from "@/app/components/ui/CodeBlock";

const fibonacciCode = {
  javascript: `// Fibonacci in JavaScript
function fibonacci(n) {
  if (n <= 1) {
    return n; // Base case: fib(0) = 0, fib(1) = 1
  }
  // Recursive case: sum of previous two terms
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Example call:
const result = fibonacci(6); // Returns 8 (0, 1, 1, 2, 3, 5, 8)
console.log(result);`,

  python: `# Fibonacci in Python
def fibonacci(n):
    if n <= 1:
        return n  # Base case
    # Recursive case
    return fibonacci(n - 1) + fibonacci(n - 2)

# Example call:
result = fibonacci(6) # Returns 8
print(result)`,

  java: `// Fibonacci in Java
public class Fibonacci {
    public static int fibonacci(int n) {
        if (n <= 1) {
            return n; // Base case
        }
        // Recursive case
        return fibonacci(n - 1) + fibonacci(n - 2);
    }

    public static void main(String[] args) {
        int result = fibonacci(6); // Returns 8
        System.out.println(result);
    }
}`,

  c: `// Fibonacci in C
#include <stdio.h>

int fibonacci(int n) {
    if (n <= 1) {
        return n; // Base case
    }
    // Recursive case
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    int result = fibonacci(6); // Returns 8
    printf("%d\\n", result);
    return 0;
}`,

  cpp: `// Fibonacci in C++
#include <iostream>

int fibonacci(int n) {
    if (n <= 1) {
        return n; // Base case
    }
    // Recursive case
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    int result = fibonacci(6); // Returns 8
    std::cout << result << std::endl;
    return 0;
}`,
};

const fileNames = {
  javascript: "fibonacci.js",
  python: "fibonacci.py",
  java: "Fibonacci.java",
  c: "fibonacci.c",
  cpp: "fibonacci.cpp",
};

const FibonacciCode = () => (
  <CodeBlock
    variant="macos"
    codeExamples={fibonacciCode}
    fileNames={fileNames}
  />
);

export default FibonacciCode;
