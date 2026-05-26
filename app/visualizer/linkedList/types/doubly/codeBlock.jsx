'use client';

import CodeBlock from '@/app/components/ui/CodeBlock';

// ─── Code Examples ─────────────────────────────
const codeExamples = {
  javascript: `// Doubly Linked List Implementation in JavaScript
class Node {
  constructor(data) {
    this.data=data;
    this.next=null;
    this.prev=null;
  }
}

class DoublyLinkedList {

  constructor() {

    this.head=null;
    this.tail=null;
    this.size=0;
  }

  insertFirst(data){

    const newNode=
    new Node(data);

    if(!this.head){

      this.head=newNode;
      this.tail=newNode;
    }
    else{

      newNode.next=
      this.head;

      this.head.prev=
      newNode;

      this.head=
      newNode;
    }

    this.size++;
  }

  insertLast(data){

    const newNode=
    new Node(data);

    if(!this.head){

      this.head=newNode;
      this.tail=newNode;
    }
    else{

      newNode.prev=
      this.tail;

      this.tail.next=
      newNode;

      this.tail=
      newNode;
    }

    this.size++;
  }
}`,

  python: `# Doubly Linked List

class Node:

    def __init__(
            self,
            data):

        self.data=data
        self.next=None
        self.prev=None


class DoublyLinkedList:

    def __init__(
            self):

        self.head=None
        self.tail=None
        self.size=0


    def insert_first(
            self,
            data):

        new_node=
        Node(data)

        if not self.head:

            self.head=
            new_node

            self.tail=
            new_node

        else:

            new_node.next=
            self.head

            self.head.prev=
            new_node

            self.head=
            new_node

        self.size+=1`,

  java: `// Doubly Linked List

public class DoublyLinkedList{

    class Node{

        int data;
        Node next;
        Node prev;

        Node(
            int data){

            this.data=data;
        }
    }

    private Node head;
    private Node tail;

    public DoublyLinkedList(){

        head=null;
        tail=null;
    }
}`,

  c: `// Doubly Linked List
#include<stdio.h>
#include<stdlib.h>

typedef struct Node{

    int data;

    struct Node*
    next;

    struct Node*
    prev;

}Node;

typedef struct{

    Node*
    head;

    Node*
    tail;

    int size;

}DoublyLinkedList;`,

  cpp: `// Doubly Linked List
#include<iostream>

using namespace std;

class Node{

public:

    int data;
    Node* next;
    Node* prev;

    Node(
        int data){

        this->data=
        data;

        next=
        nullptr;

        prev=
        nullptr;
    }
};

class DoublyLinkedList{

private:

    Node* head;
    Node* tail;

public:

    DoublyLinkedList(){

        head=
        nullptr;

        tail=
        nullptr;
    }
};`
};

// ─── Filenames ─────────────────────────────
const fileNames = {
    javascript:'doublyLinkedList.js',
    python:'doubly_linked_list.py',
    java:'DoublyLinkedList.java',
    c:'doubly_linked_list.c',
    cpp:'doubly_linked_list.cpp'
};

// ─── Component ─────────────────────────────
const DoublyLinkedListCode = () => (
    <CodeBlock
        variant="macos"
        codeExamples={codeExamples}
        fileNames={fileNames}
    />
);

export default DoublyLinkedListCode;