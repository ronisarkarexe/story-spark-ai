'use client';

import CodeBlockUI from '@/app/components/ui/CodeBlock';

// ─── All code examples for Stack using Linked List ─────────────────────
const codeExamples = {
  javascript: `// Stack using Linked List in JavaScript
class Node{

    constructor(value){
        this.value=value;
        this.next=null;
    }
}

class LinkedListStack{

    constructor(){
        this.top=null;
        this.size=0;
    }

    push(value){

        const newNode=new Node(value);

        newNode.next=this.top;

        this.top=newNode;

        this.size++;
    }

    pop(){

        if(this.isEmpty()){
            console.log("Stack Underflow");
            return;
        }

        const value=this.top.value;

        this.top=this.top.next;

        this.size--;

        return value;
    }

    peek(){

        if(this.isEmpty()){
            return null;
        }

        return this.top.value;
    }

    isEmpty(){
        return this.size===0;
    }

    getSize(){
        return this.size;
    }
}

// Usage
const stack=new LinkedListStack();

stack.push(10);
stack.push(20);
stack.push(30);

console.log("Top:",stack.peek());

stack.pop();

console.log(
    "After pop:",
    stack.peek()
);`,

  python: `# Stack using Linked List in Python

class Node:

    def __init__(self,value):
        self.value=value
        self.next=None


class LinkedListStack:

    def __init__(self):

        self.top=None
        self.size=0

    def push(self,value):

        new_node=Node(value)

        new_node.next=self.top

        self.top=new_node

        self.size+=1

    def pop(self):

        if self.is_empty():
            print("Stack Underflow")
            return

        value=self.top.value

        self.top=self.top.next

        self.size-=1

        return value

    def peek(self):

        if self.is_empty():
            return None

        return self.top.value

    def is_empty(self):
        return self.size==0

    def get_size(self):
        return self.size


stack=LinkedListStack()

stack.push(10)
stack.push(20)
stack.push(30)

print("Top:",stack.peek())

stack.pop()

print(
    "After pop:",
    stack.peek()
)`,

  java: `// Stack using Linked List in Java

class Node{

    int value;
    Node next;

    Node(int value){

        this.value=value;
        next=null;
    }
}

public class LinkedListStack{

    Node top;
    int size;

    public LinkedListStack(){

        top=null;
        size=0;
    }

    public void push(int value){

        Node newNode=
            new Node(value);

        newNode.next=top;

        top=newNode;

        size++;
    }

    public int pop(){

        if(isEmpty()){

            System.out.println(
                "Stack Underflow"
            );

            return -1;
        }

        int value=top.value;

        top=top.next;

        size--;

        return value;
    }

    public int peek(){

        return top.value;
    }

    public boolean isEmpty(){

        return size==0;
    }

    public static void main(
            String[] args){

        LinkedListStack stack=
            new LinkedListStack();

        stack.push(10);
        stack.push(20);
        stack.push(30);

        System.out.println(
            "Top:"+stack.peek()
        );

        stack.pop();

        System.out.println(
            "After pop:"
            +stack.peek()
        );
    }
}`,

  c: `// Stack using Linked List in C
#include<stdio.h>
#include<stdlib.h>

typedef struct Node{

    int value;
    struct Node* next;

}Node;

typedef struct{

    Node* top;
    int size;

}Stack;

void push(Stack* s,int value){

    Node* newNode=
    (Node*)malloc(
    sizeof(Node));

    newNode->value=value;

    newNode->next=s->top;

    s->top=newNode;

    s->size++;
}

int pop(Stack* s){

    if(s->size==0){

        printf(
        "Stack Underflow\\n");

        return -1;
    }

    Node* temp=s->top;

    int value=temp->value;

    s->top=s->top->next;

    free(temp);

    s->size--;

    return value;
}

int peek(Stack* s){

    return s->top->value;
}

int main(){

    Stack stack=
    {NULL,0};

    push(&stack,10);
    push(&stack,20);
    push(&stack,30);

    printf(
    "Top:%d\\n",
    peek(&stack));

    pop(&stack);

    printf(
    "After pop:%d",
    peek(&stack));

    return 0;
}`,

  cpp: `// Stack using Linked List in C++
#include<iostream>

using namespace std;

class Node{

public:

    int value;
    Node* next;

    Node(int value){

        this->value=value;
        next=nullptr;
    }
};

class LinkedListStack{

private:

    Node* top;
    int size;

public:

    LinkedListStack(){

        top=nullptr;
        size=0;
    }

    void push(int value){

        Node* newNode=
        new Node(value);

        newNode->next=
        top;

        top=newNode;

        size++;
    }

    int pop(){

        if(size==0){

            cout
            <<"Stack Underflow";

            return -1;
        }

        Node* temp=top;

        int value=
        temp->value;

        top=top->next;

        delete temp;

        size--;

        return value;
    }

    int peek(){

        return top->value;
    }
};

int main(){

    LinkedListStack stack;

    stack.push(10);
    stack.push(20);
    stack.push(30);

    cout<<"Top:"
        <<stack.peek()
        <<endl;

    stack.pop();

    cout<<"After pop:"
        <<stack.peek();
}`
};

// ─── Filenames ───────────────────────────────
const fileNames = {
    javascript:'linkedListStack.js',
    python:'linked_list_stack.py',
    java:'LinkedListStack.java',
    c:'linked_list_stack.c',
    cpp:'linked_list_stack.cpp'
};

// ─── Component ───────────────────────────────
const CodeBlock = () => (
    <CodeBlockUI
        variant="macos"
        codeExamples={codeExamples}
        fileNames={fileNames}
    />
);

export default CodeBlock;