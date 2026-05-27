'use client';

import CodeBlockUI from '@/app/components/ui/CodeBlock';

// ─── All code examples for Stack with Peek ───────────────────────────
const codeExamples = {
  javascript: `// Stack with Peek Operation
class Stack{

    constructor(){

        this.items=[];
        this.top=-1;
    }

    push(element){

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

    peek(){

        if(this.isEmpty()){

            console.log(
                "Stack Empty"
            );

            return -1;
        }

        return this.items[
            this.top
        ];
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
const stack=new Stack();

stack.push(10);
stack.push(20);
stack.push(30);

stack.display();

console.log(
    "Peek:",
    stack.peek()
);

stack.pop();

console.log(
    "Peek:",
    stack.peek()
);`,

  python: `# Stack with Peek

class Stack:

    def __init__(self):

        self.items=[]
        self.top=-1


    def push(
            self,
            element):

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


    def peek(self):

        if self.is_empty():

            return -1

        return self.items[
            self.top
        ]

    def is_empty(self):

        return self.top==-1


    def display(self):

        print(
            self.items
        )


stack=Stack()

stack.push(10)
stack.push(20)
stack.push(30)

stack.display()

print(
    "Peek:",
    stack.peek()
)

stack.pop()

print(
    "Peek:",
    stack.peek()
)`,

  java: `// Stack with Peek
import java.util.ArrayList;

class Stack{

    ArrayList<Integer>
    items;

    int top;

    Stack(){

        items=
        new ArrayList<>();

        top=-1;
    }

    void push(
        int element){

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

    int peek(){

        if(isEmpty()){

            return -1;
        }

        return items.get(
            top
        );
    }

    boolean isEmpty(){

        return top==-1;
    }

    public static void main(
            String args[]){

        Stack stack=
        new Stack();

        stack.push(10);
        stack.push(20);
        stack.push(30);

        System.out.println(
            stack.peek()
        );

        stack.pop();

        System.out.println(
            stack.peek()
        );
    }
}`,

  c: `// Stack with Peek
#include<stdio.h>

#define MAX 100

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

int peek(
    Stack* s){

    return s->items[
        s->top
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

    printf(
        "%d\\n",
        peek(
            &stack
        )
    );

    pop(
        &stack
    );

    printf(
        "%d",
        peek(
            &stack
        )
    );

    return 0;
}`,

  cpp: `// Stack with Peek
#include<iostream>
#include<vector>

using namespace std;

class Stack{

private:

    vector<int>
    items;

    int top;

public:

    Stack(){

        top=-1;
    }

    void push(
        int element){

        items.push_back(
            element
        );

        top++;
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

    int peek(){

        return items.back();
    }
};

int main(){

    Stack stack;

    stack.push(10);
    stack.push(20);
    stack.push(30);

    cout
    <<stack.peek()
    <<endl;

    stack.pop();

    cout
    <<stack.peek();

    return 0;
}`
};

// ─── Filenames ──────────────────────────────
const fileNames = {
    javascript:'stackPeek.js',
    python:'stack_peek.py',
    java:'StackPeek.java',
    c:'stack_peek.c',
    cpp:'stack_peek.cpp'
};

// ─── Component ──────────────────────────────
const CodeBlock = () => (
    <CodeBlockUI
        variant="macos"
        codeExamples={codeExamples}
        fileNames={fileNames}
    />
);

export default CodeBlock;