'use client';

import CodeBlockUI from '@/app/components/ui/CodeBlock';

// ─── All code examples for Stack with isFull ─────────────────────────
const codeExamples = {
  javascript: `// Stack with isFull (JavaScript)
class Stack{

    constructor(maxSize=5){

        this.items=[];
        this.top=-1;
        this.MAX_SIZE=maxSize;
    }

    push(element){

        if(this.isFull()){

            console.log(
                "Stack Overflow"
            );

            return;
        }

        this.items[++this.top]
        =element;

        console.log(
            "Pushed:",
            element
        );
    }

    pop(){

        if(this.isEmpty()){

            console.log(
                "Stack Underflow"
            );

            return -1;
        }

        return this.items[
            this.top--
        ];
    }

    isFull(){

        return this.top===
        this.MAX_SIZE-1;
    }

    isEmpty(){

        return this.top===-1;
    }

    display(){

        console.log(
            this.items.slice(
                0,
                this.top+1
            )
        );
    }
}

// Usage
const stack=new Stack(3);

stack.push(10);
stack.push(20);
stack.push(30);

stack.display();

stack.push(40);`,

  python: `# Stack with isFull

class Stack:

    def __init__(
            self,
            max_size=5):

        self.items=[]
        self.top=-1
        self.MAX_SIZE=max_size


    def push(
            self,
            element):

        if self.is_full():

            print(
            "Stack Overflow"
            )

            return

        self.top+=1

        self.items.append(
            element
        )

    def pop(self):

        if self.is_empty():

            print(
            "Stack Underflow"
            )

            return -1

        self.top-=1

        return self.items.pop()


    def is_full(self):

        return self.top==(
        self.MAX_SIZE-1
        )

    def is_empty(self):

        return self.top==-1

    def display(self):

        print(
            self.items
        )


stack=Stack(3)

stack.push(10)
stack.push(20)
stack.push(30)

stack.display()

stack.push(40)`,

  java: `// Stack with isFull
import java.util.ArrayList;

class Stack{

    ArrayList<Integer>
    items;

    int top;

    int MAX_SIZE;

    Stack(
        int maxSize){

        items=
        new ArrayList<>();

        top=-1;

        MAX_SIZE=
        maxSize;
    }

    void push(
        int element){

        if(isFull()){

            System.out.println(
            "Stack Overflow"
            );

            return;
        }

        items.add(
            element
        );

        top++;
    }

    int pop(){

        if(isEmpty()){

            return -1;
        }

        top--;

        return items.remove(
            top+1
        );
    }

    boolean isFull(){

        return top==
        MAX_SIZE-1;
    }

    boolean isEmpty(){

        return top==-1;
    }

    public static void main(
            String args[]){

        Stack stack=
        new Stack(3);

        stack.push(10);
        stack.push(20);
        stack.push(30);

        stack.push(40);
    }
}`,

  c: `// Stack with isFull
#include<stdio.h>

#define MAX 5

typedef struct{

    int items[MAX];
    int top;

}Stack;

void initialize(
        Stack* s){

    s->top=-1;
}

void push(
        Stack* s,
        int element){

    if(
        s->top==
        MAX-1
    ){

        printf(
        "Stack Overflow\\n"
        );

        return;
    }

    s->items[
    ++s->top
    ]=element;
}

int pop(
    Stack* s){

    if(
    s->top==-1
    ){

        return -1;
    }

    return s->items[
        s->top--
    ];
}

int main(){

    Stack stack;

    initialize(
    &stack
    );

    push(
    &stack,
    10
    );

    push(
    &stack,
    20
    );

    push(
    &stack,
    30
    );

    push(
    &stack,
    40
    );

    return 0;
}`,

  cpp: `// Stack with isFull
#include<iostream>
#include<vector>

using namespace std;

class Stack{

private:

    vector<int>
    items;

    int top;

    int MAX_SIZE;

public:

    Stack(
        int maxSize=5){

        top=-1;

        MAX_SIZE=
        maxSize;
    }

    void push(
        int element){

        if(
            isFull()
        ){

            cout
            <<"Stack Overflow";

            return;
        }

        items.push_back(
            element
        );

        top++;
    }

    bool isFull(){

        return top==
        MAX_SIZE-1;
    }

    int pop(){

        if(
        top==-1
        ){

            return -1;
        }

        int value=
        items.back();

        items.pop_back();

        top--;

        return value;
    }
};

int main(){

    Stack stack(3);

    stack.push(10);
    stack.push(20);
    stack.push(30);

    stack.push(40);

    return 0;
}`
};

// ─── Filenames ───────────────────────────────────
const fileNames = {
    javascript:'stackIsFull.js',
    python:'stack_is_full.py',
    java:'Stack.java',
    c:'stack_is_full.c',
    cpp:'stack_is_full.cpp'
};

// ─── Component ───────────────────────────────────
const CodeBlock = () => (
    <CodeBlockUI
        variant="macos"
        codeExamples={codeExamples}
        fileNames={fileNames}
    />
);

export default CodeBlock;