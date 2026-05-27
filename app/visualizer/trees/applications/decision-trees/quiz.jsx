"use client";
import React from "react";
import QuizEngine from "@/app/components/ui/QuizEngine";

const handleNext = () => {
  const questions = [
  {
    "question": "What is a major advantage of Decision Trees?",
    "options": [
      "They always achieve 100% accuracy on test data",
      "They are highly interpretable and easy to understand",
      "They never overfit the training data",
      "They only work with numerical data"
    ],
    "correctAnswer": 1,
    "explanation": "Decision Trees are considered \"white-box\" models because their rules can be easily visualized and understood by humans."
  },
  {
    "question": "What technique is commonly used to prevent a Decision Tree from overfitting?",
    "options": [
      "Gradient Descent",
      "Backpropagation",
      "Pruning",
      "K-Means Clustering"
    ],
    "correctAnswer": 2,
    "explanation": "Pruning reduces the size of decision trees by removing sections of the tree that provide little power to classify instances, thus preventing overfitting."
  },
  {
    "question": "In a Decision Tree, what does a leaf node represent?",
    "options": [
      "A test on an attribute",
      "The root of the tree",
      "The final decision or class label",
      "A missing value"
    ],
    "correctAnswer": 2,
    "explanation": "Leaf nodes (or terminal nodes) hold the final output label or continuous value prediction."
  }
];

  return <QuizEngine title="Decision Trees Quiz" questions={questions} />;
};

export default handleNext;
