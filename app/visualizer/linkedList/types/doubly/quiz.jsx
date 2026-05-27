"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const Quiz = () => {
  const questions = [
        {
        question: "What is the key difference between a node in a singly linked list and a doubly linked list?",
        options: [
            "Doubly linked list nodes have no pointers",
            "Doubly linked list nodes have both next and previous pointers",
            "Doubly linked list nodes have three pointers",
            "There is no difference"
        ],
        correctAnswer: 1,
        explanation: "Doubly linked list nodes contain both next and previous pointers, allowing bidirectional traversal."
    },
    {
        question: "What do the 'previous' and 'next' pointers of the head node in a doubly linked list point to?",
        options: [
            "previous: null, next: second node",
            "previous: tail, next: second node",
            "previous: head, next: tail",
            "previous: second node, next: null"
        ],
        correctAnswer: 0,
        explanation: "The head's previous is null (no node before it) and next points to the second node."
    },
    {
        question: "What is the time complexity of inserting a node at the tail of a doubly linked list with a tail pointer?",
        options: [
            "O(1)",
            "O(n)",
            "O(log n)",
            "O(n²)"
        ],
        correctAnswer: 0,
        explanation: "With a tail pointer, insertion at tail is O(1) as we can directly access the end."
    },
    {
        question: "Which operation is more efficient in a doubly linked list compared to a singly linked list?",
        options: [
            "Forward traversal",
            "Deleting a node given only its reference",
            "Insertion at head",
            "Checking if list is empty"
        ],
        correctAnswer: 1,
        explanation: "With previous pointers, we can delete a node in O(1) time if we have its reference."
    },
    {
        question: "What is the main disadvantage of doubly linked lists compared to singly linked lists?",
        options: [
            "Slower traversal speed",
            "Higher memory usage per node",
            "Cannot implement stacks or queues",
            "Fixed size limitation"
        ],
        correctAnswer: 1,
        explanation: "Each node requires an extra pointer (previous), increasing memory overhead."
    },
    {
        question: "In a circular doubly linked list, what does the tail's next pointer point to?",
        options: [
            "null",
            "head",
            "tail itself",
            "A random node"
        ],
        correctAnswer: 1,
        explanation: "In a circular doubly linked list, tail's next points to head and head's previous points to tail."
    },
    {
        question: "What is the time complexity of finding a node's predecessor in a doubly linked list?",
        options: [
            "O(1)",
            "O(n)",
            "O(log n)",
            "O(n²)"
        ],
        correctAnswer: 0,
        explanation: "We can directly access the predecessor via the previous pointer in O(1) time."
    },
    {
        question: "Which of these applications would MOST benefit from a doubly linked list?",
        options: [
            "Implementing a stack",
            "Browser forward/backward navigation",
            "Storing pixel data for an image",
            "Priority queue implementation"
        ],
        correctAnswer: 1,
        explanation: "Browser navigation benefits from bidirectional traversal capabilities."
    },
    {
        question: "How do you delete a middle node in a doubly linked list?",
        options: [
            "Set its data to null",
            "Update its neighbors' pointers to bypass it",
            "Only update the next node's pointer",
            "You cannot delete middle nodes"
        ],
        correctAnswer: 1,
        explanation: "To delete, set the previous node's next to the next node, and the next node's previous to the previous node."
    },
    {
        question: "What is the space complexity of a doubly linked list with n nodes?",
        options: [
            "O(1)",
            "O(n)",
            "O(log n)",
            "O(n²)"
        ],
        correctAnswer: 1,
        explanation: "Space complexity is O(n) as it grows linearly with the number of nodes."
    },
    {
        question: "In a non-empty doubly linked list, what does the head's previous pointer and tail's next pointer point to?",
        options: [
            "head.previous: null, tail.next: null",
            "head.previous: tail, tail.next: head",
            "Both point to themselves",
            "head.previous: head, tail.next: tail"
        ],
        correctAnswer: 0,
        explanation: "In a standard (non-circular) doubly linked list, head's previous and tail's next are null."
    },
    {
        question: "What is one advantage of a sentinel node in a doubly linked list implementation?",
        options: [
            "Reduces memory usage",
            "Simplifies edge cases by eliminating null pointers",
            "Enables random access",
            "Automatically sorts the list"
        ],
        correctAnswer: 1,
        explanation: "Sentinel nodes act as dummy nodes that eliminate special cases for head/tail operations."
    }
];

  return <QuizEngine title="Linked List Quiz Challenge" questions={questions} />;
};

export default Quiz;
