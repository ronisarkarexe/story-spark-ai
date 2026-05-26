'use client';

import CodeBlockUI from '@/app/components/ui/CodeBlock';

// ─── All code examples for Circular Queue ─────────────────────
const codeExamples = {
  javascript: `// Circular Queue Implementation

class CircularQueue{

    constructor(capacity){

        this.queue=
        new Array(
        capacity
        );

        this.capacity=
        capacity;

        this.front=-1;
        this.rear=-1;
        this.size=0;
    }

    isFull(){

        return this.size===
        this.capacity;
    }

    isEmpty(){

        return this.size===0;
    }

    enqueue(item){

        if(
        this.isFull()
        ){

            console.log(
            "Queue is full"
            );

            return false;
        }

        if(
        this.isEmpty()
        ){

            this.front=0;
        }

        this.rear=
        (
        this.rear+1
        )%
        this.capacity;

        this.queue[
        this.rear
        ]=item;

        this.size++;

        return true;
    }

    dequeue(){

        if(
        this.isEmpty()
        ){

            console.log(
            "Queue is empty"
            );

            return null;
        }

        let item=
        this.queue[
        this.front
        ];

        if(
        this.front===
        this.rear
        ){

            this.front=-1;
            this.rear=-1;
        }

        else{

            this.front=
            (
            this.front+1
            )%
            this.capacity;
        }

        this.size--;

        return item;
    }
}`,

  python: `# Circular Queue Implementation

class CircularQueue:

    def __init__(
            self,
            capacity):

        self.queue=
        [None]*capacity

        self.capacity=
        capacity

        self.front=-1
        self.rear=-1
        self.size=0


    def is_full(
            self):

        return (
        self.size==
        self.capacity
        )


    def is_empty(
            self):

        return (
        self.size==0
        )


    def enqueue(
            self,
            item):

        if(
        self.is_full()
        ):

            print(
            "Queue is full"
            )

            return False

        if(
        self.is_empty()
        ):

            self.front=0

        self.rear=(
        self.rear+1
        )%self.capacity

        self.queue[
        self.rear
        ]=item

        self.size+=1

        return True`,

  java: `// Circular Queue Implementation

public class CircularQueue{

    private int[]
    queue;

    private int
    capacity;

    private int
    front,
    rear,
    size;

    public CircularQueue(
            int capacity){

        this.capacity=
        capacity;

        queue=
        new int[
        capacity
        ];

        front=-1;
        rear=-1;
        size=0;
    }

    public boolean
    isFull(){

        return size==
        capacity;
    }

    public boolean
    isEmpty(){

        return size==0;
    }
}`,

  c: `// Circular Queue Implementation
#include<stdio.h>
#include<stdbool.h>
#include<stdlib.h>

typedef struct{

    int* queue;

    int capacity;
    int front;
    int rear;
    int size;

}CircularQueue;

bool isFull(
        CircularQueue* q){

    return
    q->size==
    q->capacity;
}

bool isEmpty(
        CircularQueue* q){

    return
    q->size==0;
}`,

  cpp: `// Circular Queue Implementation
#include<iostream>

using namespace std;

class CircularQueue{

private:

    int* queue;

    int capacity;
    int front;
    int rear;
    int size;

public:

    CircularQueue(
            int cap){

        capacity=cap;

        queue=
        new int[
        capacity
        ];

        front=-1;
        rear=-1;
        size=0;
    }

    bool isFull(){

        return
        size==
        capacity;
    }

    bool isEmpty(){

        return
        size==0;
    }
};`
};

// ─── Filenames ─────────────────────────────
const fileNames = {
    javascript:'circularQueue.js',
    python:'circular_queue.py',
    java:'CircularQueue.java',
    c:'circular_queue.c',
    cpp:'circular_queue.cpp'
};

// ─── Component ─────────────────────────────
const CodeBlock = () => (
    <CodeBlockUI
        variant="macos"
        codeExamples={codeExamples}
        fileNames={fileNames}
    />
);

export default CodeBlock;