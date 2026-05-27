'use client';

import CodeBlock from '@/app/components/ui/CodeBlock';

// ─── All code examples for Queue (Enqueue & Dequeue) ───────────────
const codeExamples = {
  javascript: `// Queue Implementation in JavaScript (Linked List)
class Node{

    constructor(data){

        this.data=data;
        this.next=null;
    }
}

class Queue{

    constructor(){

        this.front=null;
        this.rear=null;
    }

    enqueue(item){

        const newNode=
        new Node(item);

        if(
        this.rear===null
        ){

            this.front=
            this.rear=
            newNode;
        }

        else{

            this.rear.next=
            newNode;

            this.rear=
            newNode;
        }
    }

    dequeue(){

        if(
        this.front===null
        ){

            return "Queue Underflow";
        }

        const temp=
        this.front;

        this.front=
        temp.next;

        if(
        this.front===null
        ){

            this.rear=null;
        }

        return temp.data;
    }
}

// Usage
const queue=
new Queue();

queue.enqueue(10);
queue.enqueue(20);
queue.enqueue(30);

console.log(
queue.dequeue()
);

console.log(
queue.dequeue()
);`,

  python: `# Queue Implementation in Python

class Node:

    def __init__(
            self,
            data):

        self.data=data
        self.next=None


class Queue:

    def __init__(
            self):

        self.front=None
        self.rear=None


    def enqueue(
            self,
            item):

        newNode=
        Node(item)

        if(
        self.rear is None
        ):

            self.front=
            self.rear=
            newNode

        else:

            self.rear.next=
            newNode

            self.rear=
            newNode


    def dequeue(
            self):

        if(
        self.front is None
        ):

            return "Queue Underflow"

        temp=
        self.front

        self.front=
        temp.next

        if(
        self.front is None
        ):

            self.rear=None

        return temp.data`,

  java: `// Queue Implementation in Java

public class ArrayQueue{

    private int[] arr;

    private int front;
    private int rear;
    private int capacity;

    public ArrayQueue(
            int size){

        capacity=size;

        arr=
        new int[
        capacity
        ];

        front=
        rear=-1;
    }

    public void enqueue(
            int item){

        if(
        (rear+1)
        %capacity==
        front
        ){

            System.out.println(
            "Queue Overflow"
            );

            return;
        }

        if(
        front==-1
        ){

            front=
            rear=0;
        }

        else{

            rear=
            (
            rear+1
            )%
            capacity;
        }

        arr[rear]=item;
    }

    public int dequeue(){

        if(
        front==-1
        ){

            return -1;
        }

        int item=
        arr[front];

        if(
        front==rear
        ){

            front=
            rear=-1;
        }

        else{

            front=
            (
            front+1
            )%
            capacity;
        }

        return item;
    }
}`,

  c: `// Queue Implementation in C
#include<stdio.h>
#include<stdbool.h>

#define MAX_SIZE 100

typedef struct{

    int arr[
    MAX_SIZE
    ];

    int front;
    int rear;

}Queue;

void initialize(
        Queue* q){

    q->front=
    q->rear=-1;
}

void enqueue(
        Queue* q,
        int item){

    if(
    (q->rear+1)
    %MAX_SIZE==
    q->front
    ){

        printf(
        "Queue Overflow\\n"
        );

        return;
    }

    if(
    q->front==-1
    ){

        q->front=
        q->rear=0;
    }

    else{

        q->rear=
        (
        q->rear+1
        )%
        MAX_SIZE;
    }

    q->arr[
    q->rear
    ]=item;
}`,

  cpp: `// Queue Implementation in C++
#include<iostream>

using namespace std;

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

    void enqueue(
            int item){

        Node* newNode=
        new Node(item);

        if(
        rear==
        nullptr
        ){

            front=
            rear=
            newNode;
        }

        else{

            rear->next=
            newNode;

            rear=
            newNode;
        }
    }
}`
};

const fileNames = {
    javascript:'enqueueDequeue.js',
    python:'enqueue_dequeue.py',
    java:'EnqueueDequeue.java',
    c:'enqueue_dequeue.c',
    cpp:'enqueue_dequeue.cpp'
};

const EnqueueDequeueCode = () => (
    <CodeBlock
        variant="macos"
        codeExamples={codeExamples}
        fileNames={fileNames}
    />
);

export default EnqueueDequeueCode;