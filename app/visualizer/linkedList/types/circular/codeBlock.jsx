'use client';

import CodeBlock from '@/app/components/ui/CodeBlock';

// ─── All code examples for Circular Linked List ─────────────────────
const codeExamples = {
  javascript: `// Circular Linked List Implementation in JavaScript
class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class CircularLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  insertFirst(data) {
    const newNode = new Node(data);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      newNode.next = this.head;
    } else {
      newNode.next = this.head;
      this.head = newNode;
      this.tail.next = this.head;
    }

    this.size++;
  }

  insertLast(data) {
    const newNode = new Node(data);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      newNode.next = this.head;
    } else {
      this.tail.next = newNode;
      newNode.next = this.head;
      this.tail = newNode;
    }

    this.size++;
  }

  removeFirst() {
    if (!this.head) return null;

    const removedNode = this.head;

    if (this.size === 1) {
      this.head = null;
      this.tail = null;
    } else {
      this.head = this.head.next;
      this.tail.next = this.head;
    }

    this.size--;

    return removedNode.data;
  }
}`,

  python: `# Circular Linked List Implementation
class Node:

    def __init__(
            self,
            data):

        self.data=data
        self.next=None


class CircularLinkedList:

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

            new_node.next=
            self.head

        else:

            new_node.next=
            self.head

            self.head=
            new_node

            self.tail.next=
            self.head

        self.size+=1`,

  java: `// Circular Linked List Implementation

public class CircularLinkedList{

    class Node{

        int data;
        Node next;

        Node(
            int data){

            this.data=
            data;

            this.next=
            null;
        }
    }

    private Node head;
    private Node tail;
    private int size;

    public CircularLinkedList(){

        head=null;
        tail=null;
        size=0;
    }
}`,

  c: `// Circular Linked List Implementation
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

    Node*
    tail;

    int size;

}CircularLinkedList;`,

  cpp: `// Circular Linked List Implementation
#include<iostream>

using namespace std;

class Node{

public:

    int data;

    Node* next;

    Node(
            int value){

        data=
        value;

        next=
        nullptr;
    }
};

class CircularLinkedList{

private:

    Node* head;
    Node* tail;

    int size;

public:

    CircularLinkedList(){

        head=
        nullptr;

        tail=
        nullptr;

        size=0;
    }
};`
};

// ─── Filenames ─────────────────────────────
const fileNames = {
    javascript:'circularLinkedList.js',
    python:'circular_linked_list.py',
    java:'CircularLinkedList.java',
    c:'circular_linked_list.c',
    cpp:'circular_linked_list.cpp'
};

// ─── Component ─────────────────────────────
const CircularLinkedListCode = () => (
    <CodeBlock
        variant="macos"
        codeExamples={codeExamples}
        fileNames={fileNames}
    />
);

export default CircularLinkedListCode;