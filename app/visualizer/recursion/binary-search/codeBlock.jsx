'use client';
import CodeBlock from '@/app/components/ui/CodeBlock';

const codeExamples = {
  javascript: `// Recursive Binary Search in JavaScript
function binarySearch(arr, target, low, high) {
  // Base case: Search space is exhausted
  if (low > high) {
    return -1; // Target not found
  }

  // Find the middle element
  const mid = Math.floor((low + high) / 2);

  // Target is found
  if (arr[mid] === target) {
    return mid;
  }

  // Target is in the left half
  if (target < arr[mid]) {
    return binarySearch(arr, target, low, mid - 1);
  }
  
  // Target is in the right half
  return binarySearch(arr, target, mid + 1, high);
}

// Usage Example
const arr = [10, 20, 30, 40, 50, 60, 70, 80];
const target = 60;
const index = binarySearch(arr, target, 0, arr.length - 1);
console.log("Found at index:", index); // Output: 5`,

  python: `# Recursive Binary Search in Python
def binary_search(arr, target, low, high):
    # Base case: Search space is exhausted
    if low > high:
        return -1  # Target not found

    # Find the middle element
    mid = (low + high) // 2

    # Target is found
    if arr[mid] == target:
        return mid

    # Target is in the left half
    if target < arr[mid]:
        return binary_search(arr, target, low, mid - 1)

    # Target is in the right half
    return binary_search(arr, target, mid + 1, high)

# Usage Example
arr = [10, 20, 30, 40, 50, 60, 70, 80]
target = 60
index = binary_search(arr, target, 0, len(arr) - 1)
print("Found at index:", index)  # Output: 5`,

  java: `// Recursive Binary Search in Java
public class BinarySearch {
    public static int binarySearch(int[] arr, int target, int low, int high) {
        // Base case: Search space is exhausted
        if (low > high) {
            return -1; // Target not found
        }

        // Find the middle element
        int mid = low + (high - low) / 2;

        // Target is found
        if (arr[mid] == target) {
            return mid;
        }

        // Target is in the left half
        if (target < arr[mid]) {
            return binarySearch(arr, target, low, mid - 1);
        }

        // Target is in the right half
        return binarySearch(arr, target, mid + 1, high);
    }

    public static void main(String[] args) {
        int[] arr = {10, 20, 30, 40, 50, 60, 70, 80};
        int target = 60;
        int index = binarySearch(arr, target, 0, arr.length - 1);
        System.out.println("Found at index: " + index); // Output: 5
    }
}`,

  c: `// Recursive Binary Search in C
#include <stdio.h>

int binarySearch(int arr[], int target, int low, int high) {
    // Base case: Search space is exhausted
    if (low > high) {
        return -1; // Target not found
    }

    // Find the middle element
    int mid = low + (high - low) / 2;

    // Target is found
    if (arr[mid] == target) {
        return mid;
    }

    // Target is in the left half
    if (target < arr[mid]) {
        return binarySearch(arr, target, low, mid - 1);
    }

    // Target is in the right half
    return binarySearch(arr, target, mid + 1, high);
}

int main() {
    int arr[] = {10, 20, 30, 40, 50, 60, 70, 80};
    int size = sizeof(arr) / sizeof(arr[0]);
    int target = 60;
    int index = binarySearch(arr, target, 0, size - 1);
    printf("Found at index: %d\\n", index); // Output: 5
    return 0;
}`,

  cpp: `// Recursive Binary Search in C++
#include <iostream>
#include <vector>

int binarySearch(const std::vector<int>& arr, int target, int low, int high) {
    // Base case: Search space is exhausted
    if (low > high) {
        return -1; // Target not found
    }

    // Find the middle element
    int mid = low + (high - low) / 2;

    // Target is found
    if (arr[mid] == target) {
        return mid;
    }

    // Target is in the left half
    if (target < arr[mid]) {
        return binarySearch(arr, target, low, mid - 1);
    }

    // Target is in the right half
    return binarySearch(arr, target, mid + 1, high);
}

int main() {
    std::vector<int> arr = {10, 20, 30, 40, 50, 60, 70, 80};
    int target = 60;
    int index = binarySearch(arr, target, 0, arr.size() - 1);
    std::cout << "Found at index: " << index << std::endl; // Output: 5
    return 0;
}`,
};

const fileNames = {
  javascript: 'binarySearchRecursive.js',
  python: 'binary_search_recursive.py',
  java: 'BinarySearchRecursive.java',
  c: 'binary_search_recursive.c',
  cpp: 'binary_search_recursive.cpp',
};

export default function BinarySearchCode() {
  return (
    <CodeBlock
      variant="macos"
      codeExamples={codeExamples}
      fileNames={fileNames}
    />
  );
}
