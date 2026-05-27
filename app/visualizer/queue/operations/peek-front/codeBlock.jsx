'use client';

import CodeBlockUI from '@/app/components/ui/CodeBlock';

// ─── All code examples for Queue Peek ─────────────────────────
const codeExamples = {
  javascript: `// Queue Peek (Front)

class Queue{

    constructor(){

        this.items=[];
    }

    peek(){

        if(
        this.isEmpty()
        ){

            return
            "Queue is empty";
        }

        return this.items[
        0
        ];
    }

    isEmpty(){

        return (
        this.items
        .length===0
        );
    }
}`,

  python: `# Queue Peek (Front)

class Queue:

    def __init__(
            self):

        self.items=[]


    def peek(
            self):

        if(
        self.is_empty()
        ):

            return
            "Queue is empty"

        return self.items[
        0
        ]


    def is_empty(
            self):

        return (
        len(
        self.items
        )==0
        )`,

  java: `// Queue Peek (Front)
import java.util.LinkedList;
import java.util.Queue;

public class Main{

    public static void main(
            String[] args){

        Queue<Integer>
        queue=
        new LinkedList<>();

        Integer front=
        queue.peek();

        System.out.println(
        "Front element:"
        +front
        );
    }
}`,

  c: `// Queue Peek (Front)
#include<stdio.h>

#define MAX_SIZE 100

typedef struct{

    int items[
    MAX_SIZE
    ];

    int front;
    int rear;

}Queue;

int peek(
        Queue* q){

    if(
    q->front==-1
    ){

        printf(
        "Queue is empty\\n"
        );

        return -1;
    }

    return q->items[
    q->front
    ];
}`,

  cpp: `// Queue Peek (Front)
#include<iostream>
#include<queue>

using namespace std;

int main(){

    queue<int> q;

    if(
    !q.empty()
    ){

        cout
        <<"Front:"
        <<q.front()
        <<endl;
    }

    else{

        cout
        <<"Queue is empty"
        <<endl;
    }

    return 0;
}`
};

// ─── Filenames ─────────────────────────────
const fileNames = {
    javascript:'queuePeek.js',
    python:'queue_peek.py',
    java:'QueuePeek.java',
    c:'queue_peek.c',
    cpp:'queue_peek.cpp'
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