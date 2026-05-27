'use client';

import CodeBlockUI from '@/app/components/ui/CodeBlock';

// ─── All code examples for Priority Queue ─────────────────────
const codeExamples = {
  javascript: `// Priority Queue (Min Heap)

class PriorityQueue{

    constructor(
        comparator=
        (a,b)=>
        a.priority-
        b.priority
    ){

        this.heap=[];
        this.comparator=
        comparator;
    }

    enqueue(
            value,
            priority){

        const element={
            value,
            priority
        };

        this.heap.push(
        element
        );

        this.bubbleUp(
        this.heap.length-1
        );
    }

    dequeue(){

        if(
        this.isEmpty()
        ){

            return null;
        }

        const root=
        this.heap[0];

        const last=
        this.heap.pop();

        if(
        this.heap.length>0
        ){

            this.heap[0]=
            last;

            this.bubbleDown(
            0
            );
        }

        return root.value;
    }

    peek(){

        return this.isEmpty()
        ?null
        :this.heap[0].value;
    }

    size(){

        return this.heap.length;
    }

    isEmpty(){

        return (
        this.heap.length===0
        );
    }
}`,

  python: `# Priority Queue

import heapq

class PriorityQueue:

    def __init__(
            self):

        self.heap=[]
        self.index=0


    def enqueue(
            self,
            value,
            priority):

        heapq.heappush(
        self.heap,
        (
        priority,
        self.index,
        value
        ))

        self.index+=1


    def dequeue(
            self):

        if self.is_empty():

            return None

        return heapq.heappop(
        self.heap
        )[2]


    def peek(
            self):

        if self.is_empty():

            return None

        return self.heap[
        0
        ][2]


    def size(
            self):

        return len(
        self.heap
        )


    def is_empty(
            self):

        return len(
        self.heap
        )==0`,

  java: `// Priority Queue
import java.util.PriorityQueue;
import java.util.Comparator;

public class Main{

    static class Item<T>{

        T value;
        int priority;

        Item(
            T value,
            int priority){

            this.value=
            value;

            this.priority=
            priority;
        }
    }

    static class CustomPriorityQueue<T>{

        private PriorityQueue<
        Item<T>
        > queue;

        public CustomPriorityQueue(){

            queue=
            new PriorityQueue<>(
            Comparator
            .comparingInt(
            item->
            item.priority
            ));
        }

        public void enqueue(
                T value,
                int priority){

            queue.add(
            new Item<>(
            value,
            priority
            ));
        }
    }`,

  c: `// Priority Queue
#include<stdio.h>
#include<stdlib.h>

typedef struct{

    void* value;

    int priority;

}PriorityItem;

typedef struct{

    PriorityItem*
    heap;

    int size;
    int capacity;

}PriorityQueue;

PriorityQueue*
createPriorityQueue(
        int capacity){

    PriorityQueue*
    pq=

    (PriorityQueue*)
    malloc(
    sizeof(
    PriorityQueue
    ));

    pq->heap=
    malloc(
    capacity*
    sizeof(
    PriorityItem
    ));

    pq->capacity=
    capacity;

    pq->size=0;

    return pq;
}`,

  cpp: `// Priority Queue
#include<iostream>
#include<vector>

using namespace std;

template<
typename T
>

class PriorityQueue{

private:

    struct Item{

        T value;
        int priority;

        bool operator<(
            const Item&
            other
        )const{

            return priority>
            other.priority;
        }
    };

    vector<Item>
    heap;

public:

    void enqueue(
            const T&
            value,
            int priority){

        heap.push_back(
        {
        value,
        priority
        });

        push_heap(
        heap.begin(),
        heap.end()
        );
    }
};`
};

// ─── Filenames ─────────────────────────────
const fileNames = {
    javascript:'priorityQueue.js',
    python:'priority_queue.py',
    java:'PriorityQueue.java',
    c:'priority_queue.c',
    cpp:'priority_queue.cpp'
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