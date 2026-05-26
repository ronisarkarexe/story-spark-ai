'use client';
import CodeBlock from '@/app/components/ui/CodeBlock';

const codeExamples = {
  javascript: `// Quick Sort in JavaScript
function quickSort(arr, left = 0, right = arr.length - 1) {
  if (left < right) {
    const pivotIndex = partition(arr, left, right);
    quickSort(arr, left, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, right);
  }
  return arr;
}

function partition(arr, left, right) {
  const pivot = arr[right];
  let i = left;
  for (let j = left; j < right; j++) {
    if (arr[j] < pivot) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
    }
  }
  [arr[i], arr[right]] = [arr[right], arr[i]];
  return i;
}

// Usage example
const numbers = [10, 7, 8, 9, 1, 5];
console.log("Before sorting:", numbers);
const result = quickSort([...numbers]);
console.log("After sorting:", result);`,

  python: `# Quick Sort in Python
def quick_sort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
    if low < high:
        pivot_index = partition(arr, low, high)
        quick_sort(arr, low, pivot_index - 1)
        quick_sort(arr, pivot_index + 1, high)
    return arr

def partition(arr, low, high):
    pivot = arr[high]
    i = low
    for j in range(low, high):
        if arr[j] < pivot:
            arr[i], arr[j] = arr[j], arr[i]
            i += 1
    arr[i], arr[high] = arr[high], arr[i]
    return i

# Usage example
numbers = [10, 7, 8, 9, 1, 5]
print("Before sorting:", numbers)
result = quick_sort(numbers)
print("After sorting:", result)`,

  java: `// Quick Sort in Java
public class QuickSort {
    public static void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            int pivotIndex = partition(arr, low, high);
            quickSort(arr, low, pivotIndex - 1);
            quickSort(arr, pivotIndex + 1, high);
        }
    }

    private static int partition(int[] arr, int low, int high) {
        int pivot = arr[high];
        int i = low;
        for (int j = low; j < high; j++) {
            if (arr[j] < pivot) {
                swap(arr, i, j);
                i++;
            }
        }
        swap(arr, i, high);
        return i;
    }

    private static void swap(int[] arr, int i, int j) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    public static void main(String[] args) {
        int[] numbers = {10, 7, 8, 9, 1, 5};
        quickSort(numbers, 0, numbers.length - 1);
        for (int num : numbers) {
            System.out.print(num + " ");
        }
    }
}`,

  c: `// Quick Sort in C
#include <stdio.h>

void swap(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = low;
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            swap(&arr[i], &arr[j]);
            i++;
        }
    }
    swap(&arr[i], &arr[high]);
    return i;
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pivotIndex = partition(arr, low, high);
        quickSort(arr, low, pivotIndex - 1);
        quickSort(arr, pivotIndex + 1, high);
    }
}

int main() {
    int numbers[] = {10, 7, 8, 9, 1, 5};
    int n = sizeof(numbers) / sizeof(numbers[0]);
    quickSort(numbers, 0, n - 1);
    for (int i = 0; i < n; i++) printf("%d ", numbers[i]);
    return 0;
}`,

  cpp: `// Quick Sort in C++
#include <iostream>
#include <vector>
using namespace std;

int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low;
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            swap(arr[i], arr[j]);
            i++;
        }
    }
    swap(arr[i], arr[high]);
    return i;
}

void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pivotIndex = partition(arr, low, high);
        quickSort(arr, low, pivotIndex - 1);
        quickSort(arr, pivotIndex + 1, high);
    }
}

int main() {
    vector<int> numbers = {10, 7, 8, 9, 1, 5};
    quickSort(numbers, 0, numbers.size() - 1);
    for (int num : numbers) cout << num << " ";
    return 0;
}`,
};

const fileNames = {
  javascript: 'quickSort.js',
  python: 'quick_sort.py',
  java: 'QuickSort.java',
  c: 'quick_sort.c',
  cpp: 'quick_sort.cpp',
};

const QuickSortCode = () => (
  <CodeBlock
    variant="macos"
    codeExamples={codeExamples}
    fileNames={fileNames}
  />
);

export default QuickSortCode;