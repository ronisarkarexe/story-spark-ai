"use client";
import React from "react";
import CodeBlock from "@/app/components/ui/CodeBlock";

const factorialCode = {
  javascript: `// Factorial in JavaScript
function factorial(n) {
  if (n <= 1) {
    return 1; // Base case
  }
  return n * factorial(n - 1); // Recursive step
}

// Example call:
const result = factorial(5); // Returns 120
console.log(result);`,

  python: `# Factorial in Python
def factorial(n):
    if n <= 1:
        return 1  # Base case
    return n * factorial(n - 1)  # Recursive step

# Example call:
result = factorial(5) # Returns 120
print(result)`,

  java: `// Factorial in Java
public class Factorial {
    public static int factorial(int n) {
        if (n <= 1) {
            return 1; // Base case
        }
        return n * factorial(n - 1); // Recursive step
    }

    public static void main(String[] args) {
        int result = factorial(5); // Returns 120
        System.out.println(result);
    }
}`,

  c: `// Factorial in C
#include <stdio.h>

int factorial(int n) {
    if (n <= 1) {
        return 1; // Base case
    }
    return n * factorial(n - 1); // Recursive step
}

int main() {
    int result = factorial(5); // Returns 120
    printf("%d\\n", result);
    return 0;
}`,

  cpp: `// Factorial in C++
#include <iostream>

int factorial(int n) {
    if (n <= 1) {
        return 1; // Base case
    }
    return n * factorial(n - 1); // Recursive step
}

int main() {
    int result = factorial(5); // Returns 120
    std::cout << result << std::endl;
    return 0;
}`,
};

const fileNames = {
  javascript: "factorial.js",
  python: "factorial.py",
  java: "Factorial.java",
  c: "factorial.c",
  cpp: "factorial.cpp",
};

const FactorialCode = () => (
  <CodeBlock
    variant="macos"
    codeExamples={factorialCode}
    fileNames={fileNames}
  />
);

export default FactorialCode;
