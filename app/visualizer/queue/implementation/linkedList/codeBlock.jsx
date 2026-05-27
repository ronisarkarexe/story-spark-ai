'use client';

import CodeBlock from '@/app/components/ui/CodeBlock';

// ─── All code examples for Queue using Linked List ─────────────────
const codeExamples = {
  javascript: `// Queue using Linked List

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

            return
            "Queue Underflow";
        }

        const temp=
        this.front;

        this.front=
        temp.next;

        if(
        this.front===null
        ){

            this.rear=
            null;
        }

        return temp.data;
    }

    isEmpty(){

        return this.front===null;
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
queue.isEmpty()
);`,

  python: `# Queue using Linked List

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
        self.rear
        is None
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
        self.front
        is None
        ):

            return
            "Queue Underflow"

        temp=
        self.front

        self.front=
        temp.next

        if(
        self.front
        is None
        ):

            self.rear=
            None

        return temp.data


    def is_empty(
            self):

        return (
        self.front
        is None
        )`,

  java: `// Queue using Linked List

public class LinkedListQueue{

    class Node{

        int data;

        Node next;

        Node(
            int data){

            this.data=
            data;

            next=
            null;
        }
    }

    private Node
    front,
    rear;

    public void enqueue(
            int item){

        Node newNode=
        new Node(item);

        if(
        rear==null
        ){

            front=
            rear=
            newNode;
        }

        else{

            rear.next=
            newNode;

            rear=
            newNode;
        }
    }

    public int dequeue(){

        if(
        front==null
        ){

            return -1;
        }

        Node temp=
        front;

        front=
        front.next;

        if(
        front==null
        ){

            rear=
            null;
        }

        return temp.data;
    }
}`,

  c: `// Queue using Linked List
#include<stdio.h>
#include<stdlib.h>
#include<stdbool.h>

typedef struct Node{

    int data;

    struct Node*
    next;

}Node;

typedef struct{

    Node*
    front;

    Node*
    rear;

}Queue;

void enqueue(
        Queue* q,
        int item){

    Node*
    newNode=

    (Node*)
    malloc(
    sizeof(Node)
    );

    newNode->data=
    item;

    newNode->next=
    NULL;

    if(
    q->rear==
    NULL
    ){

        q->front=
        q->rear=
        newNode;
    }

    else{

        q->rear->next=
        newNode;

        q->rear=
        newNode;
    }
}`,

  cpp: `// Queue using Linked List
#include<iostream>

using namespace std;

class Node{

public:

    int data;

    Node* next;

    Node(
        int val){

        data=
        val;

        next=
        nullptr;
    }
};

class Queue{

private:

    Node*
    front;

    Node*
    rear;

public:

    Queue(){

        front=
        nullptr;

        rear=
        nullptr;
    }

    void enqueue(
            int item){

        Node*
        newNode=
        new Node(
        item
        );

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
};`
};

// ─── Filenames ─────────────────────────────
const fileNames = {
    javascript:'linkedListQueue.js',
    python:'linked_list_queue.py',
    java:'LinkedListQueue.java',
    c:'linked_list_queue.c',
    cpp:'linked_list_queue.cpp'
};

// ─── Component ─────────────────────────────
const LinkedListQueueCode = () => (
    <CodeBlock
        variant="macos"
        codeExamples={codeExamples}
        fileNames={fileNames}
    />
);

export default LinkedListQueueCode;