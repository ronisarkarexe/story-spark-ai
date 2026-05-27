'use client';

import CodeBlock from '@/app/components/ui/CodeBlock';

// ─── All code examples for Queue isEmpty ─────────────────────────
const codeExamples = {
  javascript: `// Queue Implementation (isEmpty)

class Queue{

    constructor(){

        this.front=null;
        this.rear=null;
    }

    isEmpty(){

        return this.front===null;
    }
}`,

  python: `# Queue Implementation (isEmpty)

class Queue:

    def __init__(
            self):

        self.front=None
        self.rear=None

    def is_empty(
            self):

        return (
        self.front
        is None
        )`,

  java: `// Queue Implementation (isEmpty)

public class ArrayQueue{

    private int front;
    private int rear;

    private int[] arr;

    public ArrayQueue(
            int size){

        arr=
        new int[size];

        front=
        rear=-1;
    }

    public boolean isEmpty(){

        return front==-1;
    }
}`,

  c: `// Queue Implementation (isEmpty)
#include<stdbool.h>

#define MAX_SIZE 100

typedef struct{

    int arr[
    MAX_SIZE
    ];

    int front;
    int rear;

}Queue;

bool isEmpty(
        Queue* q){

    return
    q->front==-1;
}`,

  cpp: `// Queue Implementation (isEmpty)
#include<iostream>

class Node{

public:

    int data;

    Node* next;

    Node(
        int val){

        data=val;

        next=
        nullptr;
    }
};

class Queue{

private:

    Node* front;
    Node* rear;

public:

    Queue(){

        front=
        nullptr;

        rear=
        nullptr;
    }

    bool isEmpty()
    const{

        return
        front==
        nullptr;
    }
};`
};

// ─── Filenames ─────────────────────────────
const fileNames = {
    javascript:'queueIsEmpty.js',
    python:'queue_is_empty.py',
    java:'QueueIsEmpty.java',
    c:'queue_is_empty.c',
    cpp:'queue_is_empty.cpp'
};

// ─── Component ─────────────────────────────
const QueueIsEmptyCode = () => (
    <CodeBlock
        variant="macos"
        codeExamples={codeExamples}
        fileNames={fileNames}
    />
);

export default QueueIsEmptyCode;