'use client';

import CodeBlock from '@/app/components/ui/CodeBlock';

// ─── All code examples for Selection Sort ───────────────────────────────
const codeExamples = {
  javascript: `// Selection Sort in JavaScript
function selectionSort(arr){

    const n=arr.length;

    for(let i=0;i<n-1;i++){

        let minIndex=i;

        for(let j=i+1;j<n;j++){

            if(arr[j]<arr[minIndex]){
                minIndex=j;
            }
        }

        [arr[i],arr[minIndex]]=[arr[minIndex],arr[i]];
    }

    return arr;
}

// Usage example
const numbers=[64,25,12,22,11];

console.log("Before sorting:",numbers);

const result=selectionSort([...numbers]);

console.log("After sorting:",result);`,

  python: `# Selection Sort in Python
def selection_sort(arr):

    n=len(arr)

    for i in range(n-1):

        min_index=i

        for j in range(i+1,n):

            if arr[j]<arr[min_index]:
                min_index=j

        arr[i],arr[min_index]=arr[min_index],arr[i]

    return arr


numbers=[64,25,12,22,11]

print("Before sorting:",numbers)

result=selection_sort(numbers.copy())

print("After sorting:",result)`,

  java: `// Selection Sort in Java
public class SelectionSort {

    public static void selectionSort(int[] arr){

        int n=arr.length;

        for(int i=0;i<n-1;i++){

            int minIndex=i;

            for(int j=i+1;j<n;j++){

                if(arr[j]<arr[minIndex]){
                    minIndex=j;
                }
            }

            int temp=arr[minIndex];
            arr[minIndex]=arr[i];
            arr[i]=temp;
        }
    }

    public static void main(String[] args){

        int[] numbers={64,25,12,22,11};

        System.out.print("Before sorting: ");

        for(int num:numbers){
            System.out.print(num+" ");
        }

        selectionSort(numbers);

        System.out.print("\\nAfter sorting: ");

        for(int num:numbers){
            System.out.print(num+" ");
        }
    }
}`,

  c: `// Selection Sort in C
#include<stdio.h>

void selectionSort(int arr[],int n){

    for(int i=0;i<n-1;i++){

        int minIndex=i;

        for(int j=i+1;j<n;j++){

            if(arr[j]<arr[minIndex]){
                minIndex=j;
            }
        }

        int temp=arr[minIndex];
        arr[minIndex]=arr[i];
        arr[i]=temp;
    }
}

void printArray(int arr[],int size){

    for(int i=0;i<size;i++){
        printf("%d ",arr[i]);
    }
}

int main(){

    int numbers[]={64,25,12,22,11};

    int size=sizeof(numbers)/sizeof(numbers[0]);

    printf("Before sorting: ");

    printArray(numbers,size);

    selectionSort(numbers,size);

    printf("\\nAfter sorting: ");

    printArray(numbers,size);

    return 0;
}`,

  cpp: `// Selection Sort in C++
#include<iostream>
#include<vector>

using namespace std;

void selectionSort(vector<int>& arr){

    int n=arr.size();

    for(int i=0;i<n-1;i++){

        int minIndex=i;

        for(int j=i+1;j<n;j++){

            if(arr[j]<arr[minIndex]){
                minIndex=j;
            }
        }

        swap(arr[i],arr[minIndex]);
    }
}

void printArray(vector<int>& arr){

    for(int num:arr){
        cout<<num<<" ";
    }
}

int main(){

    vector<int> numbers={64,25,12,22,11};

    cout<<"Before sorting: ";

    printArray(numbers);

    selectionSort(numbers);

    cout<<"\\nAfter sorting: ";

    printArray(numbers);

    return 0;
}`
};

// ─── Filenames ──────────────────────────────────────
const fileNames = {
    javascript:'selectionSort.js',
    python:'selection_sort.py',
    java:'SelectionSort.java',
    c:'selection_sort.c',
    cpp:'selection_sort.cpp'
};

// ─── Component ──────────────────────────────────────
const SelectionSortCode = () => (
    <CodeBlock
        variant="macos"
        codeExamples={codeExamples}
        fileNames={fileNames}
    />
);

export default SelectionSortCode;