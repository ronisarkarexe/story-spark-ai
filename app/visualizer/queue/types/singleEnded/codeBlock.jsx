'use client';

import CodeBlockUI from '@/app/components/ui/CodeBlock';

// ─── All code examples for Single Ended Queue ─────────────────────
const codeExamples = {
  javascript: `// Single Ended Queue

class Queue{

    constructor(
            size=10){

        this.items=
        new Array(size);

        this.front=0;
        this.rear=-1;

        this.size=0;
        this.capacity=size;
    }

    enqueue(item){

        if(
        this.isFull()
        ){

            return;
        }

        this.rear=
        (
        this.rear+1
        )%
        this.capacity;

        this.items[
        this.rear
        ]=item;

        this.size++;
    }

    dequeue(){

        if(
        this.isEmpty()
        ){

            return undefined;
        }

        const item=
        this.items[
        this.front
        ];

        this.front=
        (
        this.front+1
        )%
        this.capacity;

        this.size--;

        return item;
    }

    peek(){

        return this.isEmpty()
        ?undefined
        :this.items[
        this.front
        ];
    }

    isEmpty(){

        return this.size===0;
    }

    isFull(){

        return this.size===
        this.capacity;
    }
}`,

python: `# Single Ended Queue

class Queue:

    def __init__(
            self,
            size=10):

        self.items=
        [None]*size

        self.front=0
        self.rear=-1

        self.size=0
        self.capacity=size


    def enqueue(
            self,
            item):

        if self.is_full():

            return

        self.rear=(
        self.rear+1
        )%self.capacity

        self.items[
        self.rear
        ]=item

        self.size+=1


    def dequeue(
            self):

        if self.is_empty():

            return None

        item=
        self.items[
        self.front
        ]

        self.front=(
        self.front+1
        )%self.capacity

        self.size-=1

        return item`,


java: `// Single Ended Queue

public class Queue{

    private int[]
    items;

    private int front;
    private int rear;

    private int size;
    private int capacity;

    public Queue(
            int size){

        items=
        new int[size];

        front=0;
        rear=-1;

        this.size=0;
        capacity=size;
    }

    public void enqueue(
            int item){

        if(
        isFull()
        ){

            return;
        }

        rear=
        (
        rear+1
        )%
        capacity;

        items[rear]=
        item;

        size++;
    }
}`,

c: `// Single Ended Queue
#include<stdio.h>

typedef struct{

    int* items;

    int front;
    int rear;

    int size;
    int capacity;

}Queue;

void enqueue(
        Queue* q,
        int item){

    if(
    q->size==
    q->capacity
    ){

        return;
    }

    q->rear=
    (
    q->rear+1
    )%
    q->capacity;

    q->items[
    q->rear
    ]=item;

    q->size++;
}`,

cpp: `// Single Ended Queue
#include<iostream>

using namespace std;

class Queue{

private:

    int* items;

    int front;
    int rear;

    int size;
    int capacity;

public:

    Queue(
            int s){

        items=
        new int[s];

        front=0;
        rear=-1;

        size=0;
        capacity=s;
    }

    void enqueue(
            int item){

        if(
        size==
        capacity
        ){

            return;
        }

        rear=
        (
        rear+1
        )%
        capacity;

        items[
        rear
        ]=item;

        size++;
    }
};`
};

// ─── Filenames ─────────────────────────────
const fileNames = {
    javascript:'singleQueue.js',
    python:'single_queue.py',
    java:'Queue.java',
    c:'single_queue.c',
    cpp:'single_queue.cpp'
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