'use client';
import CodeBlock from '@/app/components/ui/CodeBlock';

const codeExamples = {
  javascript: `// Binary Search in JavaScript (Iterative)
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid; // Target found
    } else if (arr[mid] < target) {
      left = mid + 1; // Search right half
    } else {
      right = mid - 1; // Search left half
    }
  }
  
  return -1; // Target not found
}

// Usage example
const sortedNumbers = [10, 20, 30, 40, 50, 60, 70];
const target = 40;
const result = binarySearch(sortedNumbers, target);

if (result !== -1) {
  console.log(\`Element found at index: \${result}\`);
} else {
  console.log("Element not found");
}`,

  python: `# Binary Search in Python (Iterative)
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid  # Target found
        elif arr[mid] < target:
            left = mid + 1  # Search right half
        else:
            right = mid - 1  # Search left half
    
    return -1  # Target not found

# Usage example
sorted_numbers = [10, 20, 30, 40, 50, 60, 70]
target = 40
result = binary_search(sorted_numbers, target)

if result != -1:
    print(f"Element found at index: {result}")
else:
    print("Element not found")`,

  java: `// Binary Search in Java (Iterative)
public class BinarySearch {
    public static int binarySearch(int[] arr, int target) {
        int left = 0;
        int right = arr.length - 1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            
            if (arr[mid] == target) {
                return mid; // Target found
            } else if (arr[mid] < target) {
                left = mid + 1; // Search right half
            } else {
                right = mid - 1; // Search left half
            }
        }
        
        return -1; // Target not found
    }

    public static void main(String[] args) {
        int[] sortedNumbers = {10, 20, 30, 40, 50, 60, 70};
        int target = 40;
        int result = binarySearch(sortedNumbers, target);
        
        if (result != -1) {
            System.out.println("Element found at index: " + result);
        } else {
            System.out.println("Element not found");
        }
    }
}`,

  c: `// Binary Search in C (Iterative)
#include <stdio.h>

int binarySearch(int arr[], int size, int target) {
    int left = 0;
    int right = size - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) {
            return mid; // Target found
        } else if (arr[mid] < target) {
            left = mid + 1; // Search right half
        } else {
            right = mid - 1; // Search left half
        }
    }
    
    return -1; // Target not found
}

int main() {
    int sortedNumbers[] = {10, 20, 30, 40, 50, 60, 70};
    int size = sizeof(sortedNumbers) / sizeof(sortedNumbers[0]);
    int target = 40;
    
    int result = binarySearch(sortedNumbers, size, target);
    
    if (result != -1) {
        printf("Element found at index: %d\\n", result);
    } else {
        printf("Element not found\\n");
    }
    
    return 0;
}`,

  cpp: `// Binary Search in C++ (Iterative)
#include <iostream>
#include <vector>
using namespace std;

int binarySearch(const vector<int>& arr, int target) {
    int left = 0;
    int right = arr.size() - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) {
            return mid; // Target found
        } else if (arr[mid] < target) {
            left = mid + 1; // Search right half
        } else {
            right = mid - 1; // Search left half
        }
    }
    
    return -1; // Target not found
}

int main() {
    vector<int> sortedNumbers = {10, 20, 30, 40, 50, 60, 70};
    int target = 40;
    
    int result = binarySearch(sortedNumbers, target);
    
    if (result != -1) {
        cout << "Element found at index: " << result << endl;
    } else {
        cout << "Element not found" << endl;
    }
    
    return 0;
}`,
};

const fileNames = {
  javascript: 'binarySearch.js',
  python: 'binary_search.py',
  java: 'BinarySearch.java',
  c: 'binary_search.c',
  cpp: 'binary_search.cpp',
};

const BinarySearchCode = () => (
  <CodeBlock
    variant="macos"
    codeExamples={codeExamples}
    fileNames={fileNames}
  />
);

export default BinarySearchCode;