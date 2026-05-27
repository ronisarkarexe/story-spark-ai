"use client";
import React from "react";
import CodeBlock from "@/app/components/ui/CodeBlock";

const sumCode = {
  javascript: `// Sum of first N numbers in JavaScript
function sum(n) {
  if (n <= 0) {
    return 0; // Base case
  }
  return n + sum(n - 1); // Recursive step
}

// Example call:
const result = sum(5); // Returns 15 (5+4+3+2+1+0)
console.log(result);`,

  python: `# Sum of first N numbers in Python
def sum(n):
    if n <= 0:
        return 0  # Base case
    return n + sum(n - 1)  # Recursive step

# Example call:
result = sum(5) # Returns 15
print(result)`,

  java: `// Sum of first N numbers in Java
public class SumN {
    public static int sum(int n) {
        if (n <= 0) {
            return 0; // Base case
        }
        return n + sum(n - 1); // Recursive step
    }

    public static void main(String[] args) {
        int result = sum(5); // Returns 15
        System.out.println(result);
    }
}`,

  c: `// Sum of first N numbers in C
#include <stdio.h>

int sum(int n) {
    if (n <= 0) {
        return 0; // Base case
    }
    return n + sum(n - 1); // Recursive step
}

int main() {
    int result = sum(5); // Returns 15
    printf("%d\\n", result);
    return 0;
}`,

  cpp: `// Sum of first N numbers in C++
#include <iostream>

int sum(int n) {
    if (n <= 0) {
        return 0; // Base case
    }
    return n + sum(n - 1); // Recursive step
}

int main() {
    int result = sum(5); // Returns 15
    std::cout << result << std::endl;
    return 0;
}`,
};

const fileNames = {
  javascript: "sumOfN.js",
  python: "sum_of_n.py",
  java: "SumN.java",
  c: "sum_of_n.c",
  cpp: "sum_of_n.cpp",
};

const SumCode = () => (
  <CodeBlock
    variant="macos"
    codeExamples={sumCode}
    fileNames={fileNames}
  />
);

export default SumCode;
