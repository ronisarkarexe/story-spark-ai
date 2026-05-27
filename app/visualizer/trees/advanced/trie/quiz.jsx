"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const TrieQuiz = () => {
  const questions = [
    {
      question: "What is the primary advantage of a Trie (Prefix Tree) over a Hash Table for string operations?",
      options: [
        "Tries use significantly less memory for storing strings",
        "Tries guarantee O(L) lookup time without hash collision performance degradation",
        "Tries can search for elements in O(log N) time",
        "Tries have simpler node pointers than standard Hash Tables"
      ],
      correctAnswer: 1,
      explanation: "Tries guarantee lookup time based only on the length of the string (O(L)), completely avoiding hash computation overhead or collision issues."
    },
    {
      question: "In a Trie storing lowercase English words, what is the maximum number of children any node can reference?",
      options: [
        "2 children",
        "10 children",
        "26 children",
        "Unlimited children"
      ],
      correctAnswer: 2,
      explanation: "For lowercase English letters, there are 26 possible child characters, meaning a node can have up to 26 pointers in its children array/map."
    },
    {
      question: "If you insert the words 'cat', 'car', and 'cab' into an empty Trie, how many total nodes will be created (including the root node)?",
      options: [
        "4 nodes",
        "6 nodes",
        "10 nodes",
        "12 nodes"
      ],
      correctAnswer: 1,
      explanation: "The root node is created first. Inserting 'cat' adds 'c' -> 'a' -> 't' (4 nodes total). Inserting 'car' shares 'c' and 'a' and adds 'r' (5 nodes). Inserting 'cab' shares 'c' and 'a' and adds 'b' (6 nodes). Therefore, exactly 6 nodes are created."
    },
    {
      question: "If we search for the word 'app' in a Trie that only contains the word 'apple', what does the search return and why?",
      options: [
        "True, because 'app' exists as a prefix path",
        "False, because the letter 'p' has no child pointers",
        "False, because the node for the second 'p' has 'isEndOfWord' set to false",
        "Null pointer exception because of the missing letters"
      ],
      correctAnswer: 2,
      explanation: "Even though the characters 'a' -> 'p' -> 'p' exist in the Trie, 'isEndOfWord' for the second 'p' is false since 'app' was never inserted as a full word. Therefore, search returns false."
    },
    {
      question: "What is the time complexity of searching for a prefix of length L in a Trie containing N words?",
      options: [
        "O(log N)",
        "O(L)",
        "O(N * L)",
        "O(1)"
      ],
      correctAnswer: 1,
      explanation: "Searching a prefix only requires traversing down the tree character-by-character. For a prefix of length L, this takes exactly L steps, giving O(L) complexity, completely independent of N."
    }
  ];

  return <QuizEngine title="Trie (Prefix Tree) Quiz" questions={questions} />;
};

export default TrieQuiz;
