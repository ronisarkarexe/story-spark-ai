"use client";
import React from "react";
import CodeBlock from "@/app/components/ui/CodeBlock";

const reverseCode = {
  javascript: `// Reverse Array in JavaScript
function reverseArray(l, r, arr) {
  if (l >= r) {
    return; // Base case
  }
  // Swap elements
  const temp = arr[l];
  arr[l] = arr[r];
  arr[r] = temp;
  
  // Recursive case
  reverseArray(l + 1, r - 1, arr);
}

// Example call:
const numbers = [1, 2, 3, 4, 5];
reverseArray(0, numbers.length - 1, numbers);
console.log(numbers); // [5, 4, 3, 2, 1]`,

  python: `# Reverse Array in Python
def reverse_array(l, r, arr):
    if l >= r:
        return  # Base case
    # Swap
    arr[l], arr[r] = arr[r], arr[l]
    # Recursive case
    reverse_array(l + 1, r - 1, arr)

# Example call:
numbers = [1, 2, 3, 4, 5]
reverse_array(0, len(numbers) - 1, numbers)
print(numbers)  # [5, 4, 3, 2, 1]`,

  java: `// Reverse Array in Java
import java.util.Arrays;

public class ReverseArray {
    public static void reverse(int l, int r, int[] arr) {
        if (l >= r) {
            return; // Base case
        }
        // Swap
        int temp = arr[l];
        arr[l] = arr[r];
        arr[r] = temp;
        // Recursive case
        reverse(l + 1, r - 1, arr);
    }

    public static void main(String[] args) {
        int[] numbers = {1, 2, 3, 4, 5};
        reverse(0, numbers.length - 1, numbers);
        System.out.println(Arrays.toString(numbers));
    }
}`,

  c: `// Reverse Array in C
#include <stdio.h>

void reverse(int l, int r, int arr[]) {
    if (l >= r) {
        return; // Base case
    }
    // Swap
    int temp = arr[l];
    arr[l] = arr[r];
    arr[r] = temp;
    // Recursive case
    reverse(l + 1, r - 1, arr);
}

int main() {
    int arr[] = {1, 2, 3, 4, 5};
    reverse(0, 4, arr);
    for (int i = 0; i < 5; i++) {
        printf("%d ", arr[i]);
    }
    return 0;
}`,

  cpp: `// Reverse Array in C++
#include <iostream>
#include <vector>

void reverse(int l, int r, std::vector<int>& arr) {
    if (l >= r) {
        return; // Base case
    }
    // Swap
    std::swap(arr[l], arr[r]);
    // Recursive case
    reverse(l + 1, r - 1, arr);
}

int main() {
    std::vector<int> arr = {1, 2, 3, 4, 5};
    reverse(0, arr.size() - 1, arr);
    for (int num : arr) {
        std::cout << num << " ";
    }
    return 0;
}`,
};

const fileNames = {
  javascript: "reverseArray.js",
  python: "reverse_array.py",
  java: "ReverseArray.java",
  c: "reverse_array.c",
  cpp: "reverse_array.cpp",
};

const ReverseCode = () => (
  <CodeBlock
    variant="macos"
    codeExamples={reverseCode}
    fileNames={fileNames}
  />
);

export default ReverseCode;
