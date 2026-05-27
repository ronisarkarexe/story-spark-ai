'use client';

import CodeBlockUI from '@/app/components/ui/CodeBlock';

// ─── All code examples for Double Ended Queue ─────────────────────
const codeExamples = {
  javascript: `// Double Ended Queue Implementation

class Deque{

    constructor(size=10){

        this.items=
        new Array(size);

        this.front=-1;
        this.rear=0;

        this.size=0;
        this.capacity=size;
    }

    addFront(item){

        if(this.isFull()){

            console.log(
            "Deque Overflow"
            );

            return;
        }

        if(this.front===-1){

            this.front=0;
            this.rear=0;
        }

        else if(
        this.front===0
        ){

            this.front=
            this.capacity-1;
        }

        else{

            this.front--;
        }

        this.items[
        this.front
        ]=item;

        this.size++;
    }

    addRear(item){

        if(this.isFull()){

            console.log(
            "Deque Overflow"
            );

            return;
        }

        if(this.front===-1){

            this.front=0;
            this.rear=0;
        }

        else if(
        this.rear===
        this.capacity-1
        ){

            this.rear=0;
        }

        else{

            this.rear++;
        }

        this.items[
        this.rear
        ]=item;

        this.size++;
    }

    removeFront(){

        if(this.isEmpty()){

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

    isEmpty(){

        return this.size===0;
    }

    isFull(){

        return this.size===
        this.capacity;
    }
}`,

  python: `# Double Ended Queue

class Deque:

    def __init__(
            self,
            size=10):

        self.items=
        [None]*size

        self.front=-1
        self.rear=0

        self.size=0
        self.capacity=size


    def add_front(
            self,
            item):

        if self.is_full():

            print(
            "Deque Overflow"
            )

            return

        if self.front==-1:

            self.front=0
            self.rear=0

        elif self.front==0:

            self.front=
            self.capacity-1

        else:

            self.front-=1

        self.items[
        self.front
        ]=item

        self.size+=1


    def is_empty(
            self):

        return (
        self.size==0
        )


    def is_full(
            self):

        return (
        self.size==
        self.capacity
        )`,

  java: `// Double Ended Queue

public class ArrayDeque{

    private int[]
    items;

    private int front;
    private int rear;

    private int size;
    private int capacity;

    public ArrayDeque(
            int size){

        items=
        new int[size];

        front=-1;
        rear=0;

        this.size=0;
        capacity=size;
    }

    public boolean
    isEmpty(){

        return size==0;
    }

    public boolean
    isFull(){

        return size==
        capacity;
    }
}`,

  c: `// Double Ended Queue
#include<stdio.h>
#include<stdbool.h>

typedef struct{

    int* items;

    int front;
    int rear;

    int size;
    int capacity;

}Deque;

bool isEmpty(
        Deque* dq){

    return
    dq->size==0;
}

bool isFull(
        Deque* dq){

    return
    dq->size==
    dq->capacity;
}`,

  cpp: `// Double Ended Queue
#include<iostream>

using namespace std;

class Deque{

private:

    int* items;

    int front;
    int rear;

    int size;
    int capacity;

public:

    Deque(
            int s){

        items=
        new int[s];

        front=-1;
        rear=0;

        size=0;
        capacity=s;
    }

    bool isEmpty(){

        return size==0;
    }

    bool isFull(){

        return size==
        capacity;
    }
};`
};

// ─── Filenames ─────────────────────────────
const fileNames = {
    javascript:'deque.js',
    python:'deque.py',
    java:'ArrayDeque.java',
    c:'deque.c',
    cpp:'deque.cpp'
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