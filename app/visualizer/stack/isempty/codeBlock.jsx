'use client';

import CodeBlockUI from '@/app/components/ui/CodeBlock';

// ─── All code examples for Stack Push / Pop with isEmpty ────────────────
const codeExamples = {
  javascript: `// Stack with Push, Pop and isEmpty (JavaScript)
class Stack{

    constructor(){
        this.items=[];
        this.top=-1;
    }

    push(element){

        this.items[++this.top]=element;

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

        return this.items[this.top--];
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

stack.isEmpty();

stack.push(10);
stack.push(20);

stack.display();

stack.pop();

stack.display();`,

  python: `# Stack with Push, Pop and isEmpty

class Stack:

    def __init__(self):

        self.items=[]
        self.top=-1

    def push(self,element):

        self.top+=1
        self.items.append(element)

        print(
            "Pushed:",
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

    def is_empty(self):

        return self.top==-1

    def display(self):

        print(
            self.items
        )


stack=Stack()

stack.is_empty()

stack.push(10)
stack.push(20)

stack.display()

stack.pop()

stack.display()`,

  java: `// Stack with Push, Pop and isEmpty
import java.util.ArrayList;

class Stack{

    ArrayList<Integer> items;
    int top;

    Stack(){

        items=
        new ArrayList<>();

        top=-1;
    }

    void push(int element){

        items.add(element);

        top++;

        System.out.println(
            "Pushed:"
            +element
        );
    }

    int pop(){

        if(isEmpty()){

            System.out.println(
            "Stack Underflow"
            );

            return -1;
        }

        top--;

        return items.remove(
            top+1
        );
    }

    boolean isEmpty(){

        return top==-1;
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

        stack.isEmpty();

        stack.push(10);
        stack.push(20);

        stack.display();

        stack.pop();

        stack.display();
    }
}`,

  c: `// Stack with Push, Pop and isEmpty
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

    s->items[++s->top]
    =element;

    printf(
        "Pushed:%d\\n",
        element
    );
}

int pop(Stack* s){

    if(s->top==-1){

        printf(
        "Stack Underflow\\n"
        );

        return -1;
    }

    return s->items[
        s->top--
    ];
}

int isEmpty(
        Stack* s){

    return s->top==-1;
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

  cpp: `// Stack with Push, Pop and isEmpty
#include<iostream>
#include<vector>

using namespace std;

class Stack{

private:

    vector<int> items;
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

        cout
        <<"Pushed:"
        <<element
        <<endl;
    }

    int pop(){

        if(isEmpty()){

            cout
            <<"Stack Underflow";

            return -1;
        }

        int element=
        items.back();

        items.pop_back();

        top--;

        return element;
    }

    bool isEmpty(){

        return top==-1;
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

    stack.display();

    stack.pop();

    stack.display();

    return 0;
}`
};

// ─── Filenames ───────────────────────────────────────
const fileNames = {
  javascript:'stackPushPop.js',
  python:'stack_push_pop.py',
  java:'Stack.java',
  c:'stack_push_pop.c',
  cpp:'stack_push_pop.cpp'
};

// ─── Component ───────────────────────────────────────
const CodeBlock = () => (
    <CodeBlockUI
        variant="macos"
        codeExamples={codeExamples}
        fileNames={fileNames}
    />
);

export default CodeBlock;