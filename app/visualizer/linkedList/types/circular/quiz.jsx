"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const Quiz = () => {
  const questions = [
        {
        question: "What is the defining characteristic of a circular linked list?",
        options: [
            "The first node points to null",
            "The last node points back to the first node",
            "It uses doubly linked nodes",
            "It cannot be traversed"
        ],
        correctAnswer: 1,
        explanation: "In a circular linked list, the last node's next pointer points back to the first node, creating a loop."
    },
    {
        question: "What is the time complexity of inserting a node at the head of a circular linked list?",
        options: [
            "O(1)",
            "O(n)",
            "O(log n)",
            "O(n²)"
        ],
        correctAnswer: 0,
        explanation: "Insertion at head is O(1) as it only requires updating a couple of pointers regardless of list size."
    },
    {
        question: "In a circular singly linked list with 3 nodes (A→B→C→A), what does node C's next pointer point to?",
        options: [
            "null",
            "Node A",
            "Node B",
            "Node C"
        ],
        correctAnswer: 1,
        explanation: "In a circular list, the last node (C) points back to the first node (A)."
    },
    {
        question: "Which of these is NOT a common application of circular linked lists?",
        options: [
            "Round-robin scheduling",
            "Circular buffers",
            "Random access databases",
            "Turn-based game systems"
        ],
        correctAnswer: 2,
        explanation: "Circular linked lists don't support efficient random access, making them unsuitable for most database implementations."
    },
    {
        question: "How do you detect the end of a traversal in a circular linked list?",
        options: [
            "Check for a null pointer",
            "Check if you've returned to the starting node",
            "Count the number of nodes in advance",
            "You can't detect the end"
        ],
        correctAnswer: 1,
        explanation: "You know you've completed traversal when you return to your starting node, since there are no null pointers."
    },
    {
        question: "What is one advantage of circular linked lists over linear linked lists?",
        options: [
            "Lower memory usage",
            "Ability to traverse the entire list from any node",
            "Faster random access",
            "Simpler implementation"
        ],
        correctAnswer: 1,
        explanation: "Any node can serve as a starting point for full traversal, which is useful in many applications."
    },
    {
        question: "What special case must be handled when deleting the last node in a circular linked list?",
        options: [
            "Updating the head pointer to null",
            "No special case needed",
            "Setting the deleted node's pointers to null",
            "Rebalancing the list"
        ],
        correctAnswer: 0,
        explanation: "When deleting the last node, you must set the head pointer to null as the list becomes empty."
    },
    {
        question: "In a circular doubly linked list, what additional property exists compared to a circular singly linked list?",
        options: [
            "Each node has a previous pointer",
            "The list cannot be traversed backwards",
            "It uses less memory",
            "It must have even number of nodes"
        ],
        correctAnswer: 0,
        explanation: "Circular doubly linked lists have both next and previous pointers, enabling bidirectional traversal."
    },
    {
        question: "What is the main risk when working with circular linked lists?",
        options: [
            "Memory leaks",
            "Infinite loops during traversal",
            "Fixed size limitation",
            "Slow insertion operations"
        ],
        correctAnswer: 1,
        explanation: "Without proper termination conditions, traversals can become infinite loops since there's no null terminator."
    },
    {
        question: "Which operation has the same time complexity in both linear and circular linked lists?",
        options: [
            "Searching for a value",
            "Insertion at tail without tail pointer",
            "Deletion at head",
            "All of the above"
        ],
        correctAnswer: 3,
        explanation: "All these operations have identical time complexities in both linear and circular implementations."
    },
    {
        question: "In a circular linked list implementation of a music playlist, what feature does this structure naturally support?",
        options: [
            "Random song selection",
            "Continuous looping playback",
            "Sorting songs by length",
            "Parallel playback"
        ],
        correctAnswer: 1,
        explanation: "The circular nature perfectly supports continuous, looping playback of the playlist."
    },
    {
        question: "What is the space complexity of a circular linked list?",
        options: [
            "O(1)",
            "O(n)",
            "O(log n)",
            "O(n²)"
        ],
        correctAnswer: 1,
        explanation: "Like other linked lists, space complexity is O(n) as it grows linearly with the number of elements."
    }
];

  return <QuizEngine title="Linked List Quiz Challenge" questions={questions} />;
};

export default Quiz;
