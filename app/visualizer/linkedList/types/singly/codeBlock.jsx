'use client';

import CodeBlock from '@/app/components/ui/CodeBlock';

// ─── Code Examples ─────────────────────────────
const codeExamples = {
  javascript: `// Singly Linked List Implementation in JavaScript
class Node{

    constructor(data){

        this.data=data;
        this.next=null;
    }
}

class SinglyLinkedList{

    constructor(){

        this.head=null;
        this.size=0;
    }

    insertFirst(data){

        const newNode=
        new Node(data);

        newNode.next=
        this.head;

        this.head=
        newNode;

        this.size++;
    }

    insertLast(data){

        const newNode=
        new Node(data);

        if(!this.head){

            this.head=
            newNode;
        }
        else{

            let current=
            this.head;

            while(
            current.next
            ){

                current=
                current.next;
            }

            current.next=
            newNode;
        }

        this.size++;
    }

    insertAt(
            data,
            index){

        if(
        index<0 ||
        index>this.size
        ) return;

        if(index===0)
            return this.insertFirst(data);

        const newNode=
        new Node(data);

        let current=
        this.head;

        let count=0;

        while(
        count<
        index-1
        ){

            current=
            current.next;

            count++;
        }

        newNode.next=
        current.next;

        current.next=
        newNode;

        this.size++;
    }

    getAt(index){

        if(
        index<0 ||
        index>=this.size
        ){

            return null;
        }

        let current=
        this.head;

        let count=0;

        while(
        count<index
        ){

            current=
            current.next;

            count++;
        }

        return current.data;
    }

    removeAt(index){

        if(
        index<0 ||
        index>=this.size
        ){

            return null;
        }

        let current=
        this.head;

        if(index===0){

            this.head=
            current.next;
        }
        else{

            let count=0;

            while(
            count<
            index-1
            ){

                current=
                current.next;

                count++;
            }

            current.next=
            current.next.next;
        }

        this.size--;

        return true;
    }
}`,

  python: `# Singly Linked List Implementation
class Node:

    def __init__(
            self,
            data):

        self.data=data
        self.next=None


class SinglyLinkedList:

    def __init__(
            self):

        self.head=None
        self.size=0


    def insert_first(
            self,
            data):

        new_node=
        Node(data)

        new_node.next=
        self.head

        self.head=
        new_node

        self.size+=1`,

  java: `// Singly Linked List Implementation

public class SinglyLinkedList{

    class Node{

        int data;
        Node next;

        Node(
            int data){

            this.data=data;
        }
    }

    private Node head;
    private int size;

    public SinglyLinkedList(){

        head=null;
        size=0;
    }
}`,

  c: `// Singly Linked List Implementation
#include<stdio.h>
#include<stdlib.h>

typedef struct Node{

    int data;

    struct Node*
    next;

}Node;

typedef struct{

    Node*
    head;

    int size;

}SinglyLinkedList;`,

  cpp: `// Singly Linked List Implementation
#include<iostream>

using namespace std;

class Node{

public:

    int data;

    Node* next;

    Node(
            int data){

        this->data=
        data;

        next=
        nullptr;
    }
};

class SinglyLinkedList{

private:

    Node* head;
    int size;

public:

    SinglyLinkedList(){

        head=
        nullptr;

        size=0;
    }
};`
};

// ─── Filenames ─────────────────────────────
const fileNames = {
    javascript:'singlyLinkedList.js',
    python:'singly_linked_list.py',
    java:'SinglyLinkedList.java',
    c:'singly_linked_list.c',
    cpp:'singly_linked_list.cpp'
};

// ─── Component ─────────────────────────────
const SinglyLinkedListCode = () => (
    <CodeBlock
        variant="macos"
        codeExamples={codeExamples}
        fileNames={fileNames}
    />
);

export default SinglyLinkedListCode;