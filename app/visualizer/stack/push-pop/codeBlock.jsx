'use client';

import CodeBlockUI from '@/app/components/ui/CodeBlock';

// ─── All code examples for Stack Push & Pop ──────────────────────────
const codeExamples = {
  javascript: `// Stack Push & Pop
class Stack{

    constructor(){

        this.items=[];
        this.top=-1;
        this.MAX_SIZE=10;
    }

    push(element){

        if(
        this.top>=
        this.MAX_SIZE-1
        ){

            console.log(
            "Stack Overflow"
            );

            return;
        }

        this.items[
        ++this.top
        ]=element;

        console.log(
        "Pushed:",
        element
        );
    }

    pop(){

        if(
        this.top<0
        ){

            console.log(
            "Stack Underflow"
            );

            return -1;
        }

        const element=
        this.items[
        this.top--
        ];

        console.log(
        "Popped:",
        element
        );

        return element;
    }

    display(){

        console.log(
        this.items.slice(
        0,
        this.top+1
        ));
    }
}

// Usage
const stack=
new Stack();

stack.push(10);
stack.push(20);
stack.push(30);

stack.display();

stack.pop();

stack.display();`,

  python: `# Stack Push & Pop

class Stack:

    def __init__(self):

        self.items=[]
        self.top=-1
        self.MAX_SIZE=10


    def push(
            self,
            element):

        if(
        self.top>=
        self.MAX_SIZE-1
        ):

            print(
            "Stack Overflow"
            )

            return

        self.top+=1

        self.items.append(
        element
        )

        print(
        "Pushed:",
        element
        )


    def pop(self):

        if(
        self.top<0
        ):

            print(
            "Stack Underflow"
            )

            return -1

        element=
        self.items.pop()

        self.top-=1

        print(
        "Popped:",
        element
        )

        return element


    def display(
            self):

        print(
        self.items
        )


stack=Stack()

stack.push(10)
stack.push(20)
stack.push(30)

stack.display()

stack.pop()

stack.display()`,

  java: `// Stack Push & Pop
import java.util.ArrayList;

class Stack{

    ArrayList<Integer>
    items;

    int top;

    int MAX_SIZE=10;

    Stack(){

        items=
        new ArrayList<>();

        top=-1;
    }

    void push(
        int element){

        if(
        top>=
        MAX_SIZE-1
        ){

            System.out.println(
            "Stack Overflow"
            );

            return;
        }

        items.add(
        ++top,
        element
        );

        System.out.println(
        "Pushed:"
        +element
        );
    }

    int pop(){

        if(
        top<0
        ){

            return -1;
        }

        int element=
        items.remove(
        top--
        );

        return element;
    }

    void display(){

        System.out.println(
        items
        );
    }

    public static void main(
            String args[]){

        Stack stack=
        new Stack();

        stack.push(10);
        stack.push(20);
        stack.push(30);

        stack.display();

        stack.pop();

        stack.display();
    }
}`,

  c: `// Stack Push & Pop
#include<stdio.h>

#define MAX 10

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
    s->top>=
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
    s->top<0
    ){

        printf(
        "Stack Underflow\\n"
        );

        return -1;
    }

    return s->items[
    s->top--
    ];
}

void display(
        Stack* s){

    for(
    int i=0;
    i<=s->top;
    i++
    ){

        printf(
        "%d ",
        s->items[i]
        );
    }
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

    display(
    &stack
    );

    pop(
    &stack
    );

    display(
    &stack
    );

    return 0;
}`,

  cpp: `// Stack Push & Pop
#include<iostream>
#include<vector>

using namespace std;

class Stack{

private:

    vector<int>
    items;

    int top;

    int MAX_SIZE=10;

public:

    Stack(){

        top=-1;
    }

    void push(
            int element){

        if(
        top>=
        MAX_SIZE-1
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

    int pop(){

        if(
        top<0
        ){

            return -1;
        }

        int value=
        items.back();

        items.pop_back();

        top--;

        return value;
    }

    void display(){

        for(
        int item:
        items
        ){

            cout
            <<item
            <<" ";
        }
    }
};

int main(){

    Stack stack;

    stack.push(10);
    stack.push(20);
    stack.push(30);

    stack.display();

    stack.pop();

    stack.display();

    return 0;
}`
};

// ─── Filenames ─────────────────────────────
const fileNames = {
    javascript:'stackPushPop.js',
    python:'stack_push_pop.py',
    java:'Stack.java',
    c:'stack_push_pop.c',
    cpp:'stack_push_pop.cpp'
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