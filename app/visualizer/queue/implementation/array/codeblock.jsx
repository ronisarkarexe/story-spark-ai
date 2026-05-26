'use client';

import CodeBlockUI from '@/app/components/ui/CodeBlock';

// ─── All code examples for Queue (Array Implementation) ──────────────
const codeExamples = {
  javascript: `// Queue Implementation (Array)

class Queue{

    constructor(size){

        this.capacity=
        size;

        this.arr=
        new Array(size);

        this.front=
        this.rear=-1;
    }

    enqueue(item){

        if(
        (this.rear+1)
        %this.capacity===
        this.front
        ){

            console.log(
            "Queue Overflow"
            );

            return;
        }

        if(
        this.front===-1
        ){

            this.front=
            this.rear=0;
        }

        else{

            this.rear=
            (
            this.rear+1
            )%
            this.capacity;
        }

        this.arr[
        this.rear
        ]=item;
    }

    dequeue(){

        if(
        this.front===-1
        ){

            console.log(
            "Queue Underflow"
            );

            return -1;
        }

        const item=
        this.arr[
        this.front
        ];

        if(
        this.front===
        this.rear
        ){

            this.front=
            this.rear=-1;
        }

        else{

            this.front=
            (
            this.front+1
            )%
            this.capacity;
        }

        return item;
    }
}

// Usage
const queue=
new Queue(5);

queue.enqueue(10);
queue.enqueue(20);
queue.enqueue(30);

console.log(
queue.dequeue()
);

console.log(
queue.dequeue()
);`,

  python: `# Queue Implementation

class Queue:

    def __init__(
            self,
            size):

        self.capacity=
        size

        self.arr=
        [None]*size

        self.front=
        self.rear=-1


    def enqueue(
            self,
            item):

        if(
        (self.rear+1)
        %self.capacity==
        self.front
        ):

            print(
            "Queue Overflow"
            )

            return

        if(
        self.front==-1
        ):

            self.front=
            self.rear=0

        else:

            self.rear=(
            self.rear+1
            )%self.capacity

        self.arr[
        self.rear
        ]=item


    def dequeue(
            self):

        if(
        self.front==-1
        ):

            print(
            "Queue Underflow"
            )

            return -1

        item=
        self.arr[
        self.front
        ]

        if(
        self.front==
        self.rear
        ):

            self.front=
            self.rear=-1

        else:

            self.front=(
            self.front+1
            )%self.capacity

        return item`,

  java: `// Queue Implementation

public class ArrayQueue{

    private int[]
    arr;

    private int
    front,
    rear,
    capacity;

    public ArrayQueue(
            int size){

        capacity=
        size;

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

        arr[rear]=
        item;
    }
}`,

  c: `// Queue Implementation
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

  cpp: `// Queue Implementation
#include<iostream>

using namespace std;

class Queue{

private:

    int* arr;

    int front;
    int rear;
    int capacity;

public:

    Queue(
            int size){

        capacity=
        size;

        arr=
        new int[
        capacity
        ];

        front=
        rear=-1;
    }

    void enqueue(
            int item){

        if(
        (rear+1)
        %capacity==
        front
        ){

            cout
            <<"Queue Overflow";

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

        arr[rear]=
        item;
    }
};`
};

// ─── Filenames ─────────────────────────────
const fileNames = {
    javascript:'queue.js',
    python:'queue.py',
    java:'ArrayQueue.java',
    c:'queue.c',
    cpp:'queue.cpp'
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