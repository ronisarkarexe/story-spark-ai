'use client';
import CodeBlock from '@/app/components/ui/CodeBlock';

const codeExamples = {
  javascript: `// Merge Sort in JavaScript
function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);

  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left, right) {
  let result = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] < right[rightIndex]) {
      result.push(left[leftIndex++]);
    } else {
      result.push(right[rightIndex++]);
    }
  }

  return result
    .concat(left.slice(leftIndex))
    .concat(right.slice(rightIndex));
}

// Usage example
const numbers = [38,27,43,3,9,82,10];

console.log("Before sorting:", numbers);

const result = mergeSort(numbers);

console.log("After sorting:", result);`,

  python: `# Merge Sort in Python
def merge_sort(arr):
    if len(arr) <= 1:
        return arr

    mid = len(arr)//2

    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])

    return merge(left,right)

def merge(left,right):
    result=[]
    leftIndex=0
    rightIndex=0

    while leftIndex < len(left) and rightIndex < len(right):
        if left[leftIndex] < right[rightIndex]:
            result.append(left[leftIndex])
            leftIndex+=1
        else:
            result.append(right[rightIndex])
            rightIndex+=1

    result.extend(left[leftIndex:])
    result.extend(right[rightIndex:])

    return result

numbers=[38,27,43,3,9,82,10]
print("Before sorting:",numbers)
result=merge_sort(numbers)
print("After sorting:",result)`,

  java: `// Merge Sort in Java
public class MergeSort {
    public static void mergeSort(int[] arr){
        if(arr.length<=1)
            return;

        int mid=arr.length/2;
        int[] left=new int[mid];
        int[] right=new int[arr.length-mid];

        System.arraycopy(arr,0,left,0,mid);
        System.arraycopy(arr,mid,right,0,arr.length-mid);

        mergeSort(left);
        mergeSort(right);

        merge(arr,left,right);
    }

    public static void merge(int[] arr, int[] left, int[] right){
        int i=0,j=0,k=0;
        while(i<left.length && j<right.length){
            if(left[i]<right[j]){
                arr[k++]=left[i++];
            }else{
                arr[k++]=right[j++];
            }
        }
        while(i<left.length){
            arr[k++]=left[i++];
        }
        while(j<right.length){
            arr[k++]=right[j++];
        }
    }

    public static void main(String[] args){
        int[] numbers={38,27,43,3,9,82,10};
        System.out.print("Before sorting: ");
        for(int num:numbers){
            System.out.print(num+" ");
        }`,

  c: `// Merge Sort in C
#include <stdio.h>
#include <stdlib.h>

void merge(int arr[], int l, int m, int r) {
    int i, j, k;
    int n1 = m - l + 1;
    int n2 = r - m;

    int L[n1], R[n2];

    for (i = 0; i < n1; i++)
        L[i] = arr[l + i];
    for (j = 0; j < n2; j++)
        R[j] = arr[m + 1 + j];

    i = 0; j = 0; k = l;

    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
    }
}`,

  c: `// Merge Sort in C
#include<stdio.h>

void merge(int arr[],int l,int m,int r){
    int n1=m-l+1;
    int n2=r-m;
    int L[n1],R[n2];

    for(int i=0;i<n1;i++)
        L[i]=arr[l+i];
    for(int j=0;j<n2;j++)
        R[j]=arr[m+1+j];

    int i=0,j=0,k=l;
    while(i<n1 && j<n2){
        if(L[i]<=R[j])
            arr[k++]=L[i++];
        else
            arr[k++]=R[j++];
    }
    while(i<n1)
        arr[k++]=L[i++];
    while(j<n2)
        arr[k++]=R[j++];
}

void mergeSort(int arr[],int l,int r){
    if(l<r){
        int m=l+(r-l)/2;
        mergeSort(arr,l,m);
        mergeSort(arr,m+1,r);
        merge(arr,l,m,r);
    }
}

void printArray(int arr[],int size){
    for(int i=0;i<size;i++){
        printf("%d ",arr[i]);
    }
}

int main(){
    int numbers[]={38,27,43,3,9,82,10};
    int size=sizeof(numbers)/sizeof(numbers[0]);

    printf("Before sorting: ");
    printArray(numbers,size);
        mergeSort(numbers);
        System.out.print("\\nAfter sorting: ");

    printf("\\nAfter sorting: ");
    printArray(numbers,size);

    return 0;
}`,

  cpp: `// Merge Sort in C++
#include <iostream>
#include <vector>
using namespace std;

void merge(vector<int>& arr,int l,int m,int r){
    vector<int> result;
    int i=l;
    int j=m+1;

    while(i<=m && j<=r){
        if(arr[i]<=arr[j]){
            result.push_back(arr[i++]);
        }else{
            result.push_back(arr[j++]);
        }
    }
    while(i<=m)
        result.push_back(arr[i++]);
    while(j<=r)
        result.push_back(arr[j++]);

    for(int k=l;k<=r;k++){
        arr[k]=result[k-l];
    }
}

void mergeSort(vector<int>& arr,int l,int r){
    if(l<r){
        int m=l+(r-l)/2;
        mergeSort(arr,l,m);
        mergeSort(arr,m+1,r);
        merge(arr,l,m,r);
    }
}

void printArray(vector<int>& arr){
    for(int num:arr){
        cout<<num<<" ";
    }
}

int main(){
    vector<int> numbers={38,27,43,3,9,82,10};
    cout<<"Before sorting: ";
    printArray(numbers);

    mergeSort(numbers,0,numbers.size()-1);

    cout<<"\\nAfter sorting: ";
    printArray(numbers);
    return 0;
}`,
};

const fileNames = {
  javascript: 'mergeSort.js',
  python: 'merge_sort.py',
  java: 'MergeSort.java',
  c: 'merge_sort.c',
  cpp: 'merge_sort.cpp',
};

const MergeSortCode = () => (
  <CodeBlock
    variant="macos"
    codeExamples={codeExamples}
    fileNames={fileNames}
  />
);

export default MergeSortCode;