"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const Quiz = () => {
  const questions = [
    {
        question: "What is the fundamental building block of a singly linked list?",
        options: [
            "Array",
            "Node containing data and a next pointer",
            "Hash table",
            "Binary tree"
        ],
        correctAnswer: 1,
        explanation: "A singly linked list is composed of nodes where each node contains data and a pointer to the next node."
    },
    {
        question: "What does the 'next' pointer of the last node in a singly linked list point to?",
        options: [
            "The head node",
            "A random node",
            "null",
            "Itself"
        ],
        correctAnswer: 2,
        explanation: "The last node's next pointer is null, indicating the end of the list."
    },
    {
        question: "What is the time complexity of inserting a new node at the head of a singly linked list?",
        options: [
            "O(1)",
            "O(n)",
            "O(log n)",
            "O(n²)"
        ],
        correctAnswer: 0,
        explanation: "Insertion at head is O(1) as it only requires updating the head pointer."
    },
    {
        question: "Which operation in a singly linked list has O(n) time complexity?",
        options: [
            "Insertion at head",
            "Deletion at head",
            "Searching for an element",
            "Checking if list is empty"
        ],
        correctAnswer: 2,
        explanation: "Searching requires traversing the list from head to tail, which is O(n) in the worst case."
    },
    {
        question: "What is the advantage of a singly linked list over an array?",
        options: [
            "Constant-time random access",
            "Better cache locality",
            "Dynamic size and efficient insertions/deletions",
            "Built-in sorting capability"
        ],
        correctAnswer: 2,
        explanation: "Linked lists can grow dynamically and allow efficient insertions/deletions without shifting elements."
    },
    {
        question: "How do you check if a singly linked list is empty?",
        options: [
            "Check if size == 0",
            "Check if head == null",
            "Check if tail == null",
            "All of the above"
        ],
        correctAnswer: 1,
        explanation: "An empty list has its head pointer set to null."
    },
    {
        question: "What is the time complexity of deleting a specific value from a singly linked list?",
        options: [
            "O(1)",
            "O(n)",
            "O(log n)",
            "O(n²)"
        ],
        correctAnswer: 1,
        explanation: "Deleting by value requires traversing the list to find the node, which is O(n)."
    },
    {
        question: "Which of these applications would LEAST likely use a singly linked list?",
        options: [
            "Implementing a stack",
            "Memory management system",
            "Image processing filter",
            "Browser history navigation"
        ],
        correctAnswer: 2,
        explanation: "Image processing typically requires random access to pixels, which arrays handle better."
    },
    {
        question: "What is the main disadvantage of singly linked lists compared to arrays?",
        options: [
            "Fixed size",
            "No random access to elements",
            "Inefficient insertion at head",
            "Cannot store different data types"
        ],
        correctAnswer: 1,
        explanation: "Accessing an arbitrary element requires traversal from the head, making it O(n) rather than O(1)."
    },
    {
        question: "What happens during insertion at the head of a singly linked list?",
        options: [
            "New node's next points to current head, then head updates to new node",
            "Traverse to end and add new node",
            "Find middle position and insert",
            "Replace all existing nodes"
        ],
        correctAnswer: 0,
        explanation: "Insertion at head involves creating a new node that points to the current head, then making it the new head."
    },
    {
        question: "How much extra memory per node does a singly linked list need compared to an array?",
        options: [
            "No extra memory",
            "4 bytes for size counter",
            "Pointer size (typically 4-8 bytes)",
            "Double the data storage"
        ],
        correctAnswer: 2,
        explanation: "Each node requires additional memory for the next pointer, typically 4-8 bytes depending on system."
    },
    {
        question: "What is the purpose of maintaining a 'size' variable in a linked list implementation?",
        options: [
            "To limit the maximum number of nodes",
            "To provide O(1) access to the list length",
            "To improve cache performance",
            "To enable random access"
        ],
        correctAnswer: 1,
        explanation: "A size counter allows checking the list length in constant time without traversal."
    }
];

  return <QuizEngine title="Linked List Quiz Challenge" questions={questions} />;
};

export default Quiz;
