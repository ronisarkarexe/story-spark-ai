'use client';

import CodeBlockUI from '@/app/components/ui/CodeBlock';

// ─── All code examples for Stack using Array ───────────────────────────
const codeExamples = {
  javascript: `// Stack Implementation using Array (JavaScript)
class Stack{

    constructor(size=10){
        this.items=new Array(size);
        this.top=-1;
        this.capacity=size;
    }

    push(element){

        if(this.isFull()){
            console.log("Stack Overflow");
            return;
        }

        this.items[++this.top]=element;
    }

    pop(){

        if(this.isEmpty()){
            console.log("Stack Underflow");
            return;
        }

        return this.items[this.top--];
    }

    peek(){

        if(this.isEmpty()){
            console.log("Stack is empty");
            return;
        }

        return this.items[this.top];
    }

    isEmpty(){
        return this.top===-1;
    }

    isFull(){
        return this.top===this.capacity-1;
    }

    size(){
        return this.top+1;
    }
}

// Usage
const stack=new Stack(5);

stack.push(10);
stack.push(20);
stack.push(30);

console.log("Top:",stack.peek());
console.log("Size:",stack.size());

stack.pop();

console.log("After pop:",stack.peek());`,

  python: `# Stack Implementation using Array
class Stack:

    def __init__(self,size=10):
        self.items=[None]*size
        self.top=-1
        self.capacity=size

    def push(self,element):

        if self.is_full():
            print("Stack Overflow")
            return

        self.top+=1
        self.items[self.top]=element

    def pop(self):

        if self.is_empty():
            print("Stack Underflow")
            return

        item=self.items[self.top]
        self.top-=1

        return item

    def peek(self):

        if self.is_empty():
            print("Stack is empty")
            return

        return self.items[self.top]

    def is_empty(self):
        return self.top==-1

    def is_full(self):
        return self.top==self.capacity-1

    def size(self):
        return self.top+1


stack=Stack(5)

stack.push(10)
stack.push(20)
stack.push(30)

print("Top:",stack.peek())
print("Size:",stack.size())

stack.pop()

print("After pop:",stack.peek())`,

  java: `// Stack Implementation using Array
public class ArrayStack{

    int[] items;
    int top;
    int capacity;

    public ArrayStack(int size){

        items=new int[size];
        top=-1;
        capacity=size;
    }

    public void push(int element){

        if(isFull()){
            System.out.println("Stack Overflow");
            return;
        }

        items[++top]=element;
    }

    public int pop(){

        if(isEmpty()){
            System.out.println("Stack Underflow");
            return -1;
        }

        return items[top--];
    }

    public int peek(){

        if(isEmpty()){
            return -1;
        }

        return items[top];
    }

    public boolean isEmpty(){
        return top==-1;
    }

    public boolean isFull(){
        return top==capacity-1;
    }

    public int size(){
        return top+1;
    }

    public static void main(String[] args){

        ArrayStack stack=new ArrayStack(5);

        stack.push(10);
        stack.push(20);
        stack.push(30);

        System.out.println("Top: "+stack.peek());
        System.out.println("Size: "+stack.size());

        stack.pop();

        System.out.println(
            "After pop: "+stack.peek()
        );
    }
}`,

  c: `// Stack Implementation using Array
#include<stdio.h>
#include<stdlib.h>

typedef struct{

    int* items;
    int top;
    int capacity;

}Stack;

void initialize(Stack* s,int size){

    s->items=(int*)malloc(size*sizeof(int));
    s->top=-1;
    s->capacity=size;
}

void push(Stack* s,int element){

    if(s->top==s->capacity-1){
        printf("Stack Overflow\\n");
        return;
    }

    s->items[++s->top]=element;
}

int pop(Stack* s){

    if(s->top==-1){
        printf("Stack Underflow\\n");
        return -1;
    }

    return s->items[s->top--];
}

int peek(Stack* s){

    return s->items[s->top];
}

int main(){

    Stack stack;

    initialize(&stack,5);

    push(&stack,10);
    push(&stack,20);
    push(&stack,30);

    printf("Top:%d\\n",peek(&stack));

    pop(&stack);

    printf(
      "After pop:%d",
      peek(&stack)
    );

    return 0;
}`,

  cpp: `// Stack Implementation using Array
#include<iostream>

using namespace std;

class Stack{

private:

    int* items;
    int top;
    int capacity;

public:

    Stack(int size=10){

        items=new int[size];
        top=-1;
        capacity=size;
    }

    void push(int element){

        if(top==capacity-1){

            cout<<"Stack Overflow"<<endl;
            return;
        }

        items[++top]=element;
    }

    int pop(){

        if(top==-1){

            cout<<"Stack Underflow"<<endl;
            return -1;
        }

        return items[top--];
    }

    int peek(){

        return items[top];
    }

    int size(){

        return top+1;
    }
};

int main(){

    Stack stack(5);

    stack.push(10);
    stack.push(20);
    stack.push(30);

    cout<<"Top: "<<stack.peek()<<endl;

    stack.pop();

    cout<<"After pop: "
        <<stack.peek();
}`
};

// ─── Filenames ──────────────────────────────────
const fileNames = {
    javascript:'stack.js',
    python:'stack.py',
    java:'ArrayStack.java',
    c:'stack.c',
    cpp:'stack.cpp'
};

// ─── Component ──────────────────────────────────
const CodeBlock = () => (
    <CodeBlockUI
        variant="macos"
        codeExamples={codeExamples}
        fileNames={fileNames}
    />
);

export default CodeBlock;