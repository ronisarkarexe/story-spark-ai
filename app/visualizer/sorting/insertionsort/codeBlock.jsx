'use client';

import CodeBlock from '@/app/components/ui/CodeBlock';

// ─── All code examples for Insertion Sort ───────────────────────────────────
const codeExamples = {
  javascript: `// Insertion Sort in JavaScript
function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let current = arr[i];
    let j = i - 1;

    while (j >= 0 && arr[j] > current) {
      arr[j + 1] = arr[j];
      j--;
    }

    arr[j + 1] = current;
  }

  return arr;
}

// Usage example
const numbers = [12, 11, 13, 5, 6];
console.log("Before sorting:", numbers);

const result = insertionSort(numbers);

console.log("After sorting:", result);`,

  python: `# Insertion Sort in Python
def insertion_sort(arr):
    for i in range(1, len(arr)):
        current = arr[i]
        j = i - 1

        while j >= 0 and arr[j] > current:
            arr[j + 1] = arr[j]
            j -= 1

        arr[j + 1] = current

    return arr

# Usage example
numbers = [12,11,13,5,6]

print("Before sorting:", numbers)

result = insertion_sort(numbers)

print("After sorting:", result)`,

  java: `// Insertion Sort in Java
public class InsertionSort {

    public static void insertionSort(int[] arr) {
        for (int i = 1; i < arr.length; i++) {
            int current = arr[i];
            int j = i - 1;

            while (j >= 0 && arr[j] > current) {
                arr[j + 1] = arr[j];
                j--;
            }

            arr[j + 1] = current;
        }
    }

    public static void main(String[] args) {
        int[] numbers = {12,11,13,5,6};

        System.out.print("Before sorting: ");
        for(int num : numbers){
            System.out.print(num + " ");
        }

        insertionSort(numbers);

        System.out.print("\\nAfter sorting: ");
        for(int num : numbers){
            System.out.print(num + " ");
        }
    }
}`,

  c: `// Insertion Sort in C
#include<stdio.h>

void insertionSort(int arr[], int n){
    for(int i=1;i<n;i++){
        int current = arr[i];
        int j = i-1;

        while(j>=0 && arr[j]>current){
            arr[j+1]=arr[j];
            j--;
        }

        arr[j+1]=current;
    }
}

void printArray(int arr[], int n){
    for(int i=0;i<n;i++){
        printf("%d ",arr[i]);
    }
}

int main(){

    int numbers[]={12,11,13,5,6};
    int size=sizeof(numbers)/sizeof(numbers[0]);

    printf("Before sorting: ");
    printArray(numbers,size);

    insertionSort(numbers,size);

    printf("\\nAfter sorting: ");
    printArray(numbers,size);

    return 0;
}`,

  cpp: `// Insertion Sort in C++
#include<iostream>
#include<vector>
using namespace std;

void insertionSort(vector<int>& arr){

    for(int i=1;i<arr.size();i++){
        int current=arr[i];
        int j=i-1;

        while(j>=0 && arr[j]>current){
            arr[j+1]=arr[j];
            j--;
        }

        arr[j+1]=current;
    }
}

void printArray(vector<int> arr){
    for(int num : arr){
        cout<<num<<" ";
    }
}

int main(){

    vector<int> numbers={12,11,13,5,6};

    cout<<"Before sorting: ";
    printArray(numbers);

    insertionSort(numbers);

    cout<<"\\nAfter sorting: ";
    printArray(numbers);

    return 0;
}`
};

// ─── Filenames shown in title bar ──────────────────────────────────────────
const fileNames = {
  javascript: 'insertionSort.js',
  python: 'insertion_sort.py',
  java: 'InsertionSort.java',
  c: 'insertion_sort.c',
  cpp: 'insertion_sort.cpp',
};

// ─── Component ─────────────────────────────────────────────────────────────
const InsertionSortCode = () => (
  <CodeBlock
    variant="macos"
    codeExamples={codeExamples}
    fileNames={fileNames}
  />
);

export default InsertionSortCode;