"use client";
import React from "react";
import CodeBlock from "@/app/components/ui/CodeBlock";

const subsequenceCode = {
  javascript: `// Print all Subsequences in JavaScript
function solve(index, current, arr) {
  // Base case: index reaches end
  if (index === arr.length) {
    console.log(current);
    return;
  }
  
  // Choice 1: TAKE element
  current.push(arr[index]);
  solve(index + 1, current, arr);
  
  // Choice 2: BACKTRACK (Remove element) and SKIP it
  current.pop();
  solve(index + 1, current, arr);
}

// Example call:
solve(0, [], [1, 2, 3]);`,

  python: `# Print all Subsequences in Python
def solve(index, current, arr):
    # Base case
    if index == len(arr):
        print(current)
        return
        
    # Choice 1: TAKE element
    current.append(arr[index])
    solve(index + 1, current, arr)
    
    # Choice 2: SKIP element (Backtrack)
    current.pop()
    solve(index + 1, current, arr)

# Example call:
solve(0, [], [1, 2, 3])`,

  java: `// Print all Subsequences in Java
import java.util.ArrayList;
import java.util.List;

public class Subsequences {
    public static void solve(int index, List<Integer> current, int[] arr) {
        // Base case
        if (index == arr.length) {
            System.out.println(current);
            return;
        }
        
        // Choice 1: TAKE element
        current.add(arr[index]);
        solve(index + 1, current, arr);
        
        // Choice 2: SKIP element (Backtrack)
        current.remove(current.size() - 1);
        solve(index + 1, current, arr);
    }

    public static void main(String[] args) {
        int[] arr = {1, 2, 3};
        solve(0, new ArrayList<>(), arr);
    }
}`,

  c: `// Print all Subsequences in C
#include <stdio.h>

void solve(int index, int current[], int currentSize, int arr[], int arrSize) {
    // Base case
    if (index == arrSize) {
        printf("[");
        for (int i = 0; i < currentSize; i++) {
            printf("%d ", current[i]);
        }
        printf("]\\n");
        return;
    }
    
    // Choice 1: TAKE element
    current[currentSize] = arr[index];
    solve(index + 1, current, currentSize + 1, arr, arrSize);
    
    // Choice 2: SKIP element (Implicit backtracking by ignoring index in next call)
    solve(index + 1, current, currentSize, arr, arrSize);
}

int main() {
    int arr[] = {1, 2, 3};
    int current[10];
    solve(0, current, 0, arr, 3);
    return 0;
}`,

  cpp: `// Print all Subsequences in C++
#include <iostream>
#include <vector>

void solve(int index, std::vector<int>& current, const std::vector<int>& arr) {
    // Base case
    if (index == arr.size()) {
        std::cout << "[";
        for (int i = 0; i < current.size(); ++i) {
            std::cout << current[i] << (i == current.size() - 1 ? "" : " ");
        }
        std::cout << "]\\n";
        return;
    }
    
    // Choice 1: TAKE element
    current.push_back(arr[index]);
    solve(index + 1, current, arr);
    
    // Choice 2: SKIP element (Backtrack)
    current.pop_back();
    solve(index + 1, current, arr);
}

int main() {
    std::vector<int> arr = {1, 2, 3};
    std::vector<int> current;
    solve(0, current, arr);
    return 0;
}`,
};

const fileNames = {
  javascript: "subsequences.js",
  python: "subsequences.py",
  java: "Subsequences.java",
  c: "subsequences.c",
  cpp: "subsequences.cpp",
};

const SubsequenceCode = () => (
  <CodeBlock
    variant="macos"
    codeExamples={subsequenceCode}
    fileNames={fileNames}
  />
);

export default SubsequenceCode;
