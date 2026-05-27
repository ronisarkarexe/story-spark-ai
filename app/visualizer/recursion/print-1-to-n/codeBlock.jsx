"use client";
import React from "react";
import CodeBlock from "@/app/components/ui/CodeBlock";

const printCode = {
  javascript: `// Print 1 to N in JavaScript
function print1ToN(i, n) {
  if (i > n) {
    return; // Base case
  }
  console.log(i); // Process
  print1ToN(i + 1, n); // Recursive case
}

// Example call:
print1ToN(1, 5); // Prints 1, 2, 3, 4, 5`,

  python: `# Print 1 to N in Python
def print_1_to_n(i, n):
    if i > n:
        return  # Base case
    print(i)  # Process
    print_1_to_n(i + 1, n)  # Recursive case

# Example call:
print_1_to_n(1, 5) # Prints 1, 2, 3, 4, 5`,

  java: `// Print 1 to N in Java
public class Print1ToN {
    public static void print1ToN(int i, int n) {
        if (i > n) {
            return; // Base case
        }
        System.out.println(i); // Process
        print1ToN(i + 1, n); // Recursive case
    }

    public static void main(String[] args) {
        print1ToN(1, 5); // Prints 1 to 5
    }
}`,

  c: `// Print 1 to N in C
#include <stdio.h>

void print1ToN(int i, int n) {
    if (i > n) {
        return; // Base case
    }
    printf("%d\\n", i); // Process
    print1ToN(i + 1, n); // Recursive case
}

int main() {
    print1ToN(1, 5); // Prints 1 to 5
    return 0;
}`,

  cpp: `// Print 1 to N in C++
#include <iostream>

void print1ToN(int i, int n) {
    if (i > n) {
        return; // Base case
    }
    std::cout << i << std::endl; // Process
    print1ToN(i + 1, n); // Recursive case
}

int main() {
    print1ToN(1, 5); // Prints 1 to 5
    return 0;
}`,
};

const fileNames = {
  javascript: "print1ToN.js",
  python: "print_1_to_n.py",
  java: "Print1ToN.java",
  c: "print_1_to_n.c",
  cpp: "print_1_to_n.cpp",
};

const Print1ToNCode = () => (
  <CodeBlock
    variant="macos"
    codeExamples={printCode}
    fileNames={fileNames}
  />
);

export default Print1ToNCode;
