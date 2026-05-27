"use client";
import React from "react";
import CodeBlock from "@/app/components/ui/CodeBlock";

const printCode = {
  javascript: `// Print N to 1 in JavaScript
function printNTo1(i) {
  if (i < 1) {
    return; // Base case
  }
  console.log(i); // Process
  printNTo1(i - 1); // Recursive case
}

// Example call:
printNTo1(5); // Prints 5, 4, 3, 2, 1`,

  python: `# Print N to 1 in Python
def print_n_to_1(i):
    if i < 1:
        return  # Base case
    print(i)  # Process
    print_n_to_1(i - 1)  # Recursive case

# Example call:
print_n_to_1(5) # Prints 5, 4, 3, 2, 1`,

  java: `// Print N to 1 in Java
public class PrintNTo1 {
    public static void printNTo1(int i) {
        if (i < 1) {
            return; // Base case
        }
        System.out.println(i); // Process
        printNTo1(i - 1); // Recursive case
    }

    public static void main(String[] args) {
        printNTo1(5); // Prints 5 down to 1
    }
}`,

  c: `// Print N to 1 in C
#include <stdio.h>

void printNTo1(int i) {
    if (i < 1) {
        return; // Base case
    }
    printf("%d\\n", i); // Process
    printNTo1(i - 1); // Recursive case
}

int main() {
    printNTo1(5); // Prints 5 down to 1
    return 0;
}`,

  cpp: `// Print N to 1 in C++
#include <iostream>

void printNTo1(int i) {
    if (i < 1) {
        return; // Base case
    }
    std::cout << i << std::endl; // Process
    printNTo1(i - 1); // Recursive case
}

int main() {
    printNTo1(5); // Prints 5 down to 1
    return 0;
}`,
};

const fileNames = {
  javascript: "printNTo1.js",
  python: "print_n_to_1.py",
  java: "PrintNTo1.java",
  c: "print_n_to_1.c",
  cpp: "print_n_to_1.cpp",
};

const PrintNTo1Code = () => (
  <CodeBlock
    variant="macos"
    codeExamples={printCode}
    fileNames={fileNames}
  />
);

export default PrintNTo1Code;
