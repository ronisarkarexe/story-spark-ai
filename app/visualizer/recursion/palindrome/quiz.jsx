"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const PalindromeQuiz = () => {
  const questions = [
    {
      question: "Which expression yields the index of the character to compare with index 'i' in a string of length 'len'?",
      options: [
        "len - i",
        "len - 1 - i",
        "i + len / 2",
        "len / 2"
      ],
      correctAnswer: 1,
      explanation: "Using 0-based indexing, the symmetrically opposite character to index 'i' is located at index len - 1 - i."
    },
    {
      question: "What is the base case condition for a recursive palindrome check?",
      options: [
        "i == 0",
        "i >= str.length / 2",
        "str[i] != str[len-1-i]",
        "i == str.length"
      ],
      correctAnswer: 1,
      explanation: "Once index 'i' reaches or crosses the middle of the string (i >= str.length / 2), all characters have been checked and match, so we return true."
    },
    {
      question: "For the word 'coding', how many comparisons are made before the recursive function determines it is NOT a palindrome?",
      options: [
        "1",
        "2",
        "3",
        "6"
      ],
      correctAnswer: 0,
      explanation: "For 'coding', the first comparison is between 'c' (index 0) and 'g' (index 5). Since 'c' != 'g', the function returns false immediately on the 1st comparison."
    },
    {
      question: "What is the time complexity of the recursive palindrome check in the worst case?",
      options: [
        "O(1)",
        "O(log N)",
        "O(N)",
        "O(N²)"
      ],
      correctAnswer: 2,
      explanation: "In the worst case (the string is a palindrome), the function checks N/2 character pairs, making it O(N) linear time."
    },
    {
      question: "What does isPalindrome(0, 'level') return?",
      options: [
        "true",
        "false",
        "0",
        "null"
      ],
      correctAnswer: 0,
      explanation: "'level' is a palindrome, so the function returns true."
    }
  ];

  return <QuizEngine title="Palindrome Check Quiz" questions={questions} />;
};

export default PalindromeQuiz;
