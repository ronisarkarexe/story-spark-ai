"use client";
import React, { useState } from "react";
import { FaAward } from "react-icons/fa";

const SegmentQuiz = () => {
  const questions = [
    {
      question: "For a base array of size N, what is the maximum number of nodes required in the Segment Tree array representation?",
      options: [
        "N nodes",
        "2N nodes",
        "4N nodes",
        "N^2 nodes"
      ],
      correctAnswer: 2,
      explanation: "To fully accommodate leaf elements and empty branch padding, a Segment Tree array representation typically requires up to 4N nodes."
    },
    {
      question: "What is the worst-case time complexity for a Range Sum Query and a Point Update in a Segment Tree?",
      options: [
        "O(N) for both",
        "O(log N) for both",
        "O(1) for query, O(N) for update",
        "O(log N) for query, O(N) for update"
      ],
      correctAnswer: 1,
      explanation: "Both range queries and point updates require traversing the depth of the binary tree, taking O(log N) time."
    }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  const handleAnswerSelect = (optionIndex) => {
    setSelectedAnswer(optionIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  return (
    <section className="max-w-4xl mx-auto shadow-lg rounded-xl bg-white dark:bg-neutral-950 mt-8 mb-8 p-6 border border-gray-200 dark:border-gray-700">
      {showIntro ? (
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-purple-100 dark:bg-neutral-900 p-4 rounded-full">
              <FaAward className="text-4xl text-purple-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-black dark:text-gray-100">Segment Tree Quiz</h2>
          <button
            onClick={() => setShowIntro(false)}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg"
          >
            Start Quiz
          </button>
        </div>
      ) : !showResult ? (
        <div>
          <div className="mb-6">
            <span className="text-sm font-medium text-purple-600">Question {currentQuestion + 1} of {questions.length}</span>
          </div>
          <h3 className="text-xl font-semibold mb-6 dark:text-white">{questions[currentQuestion].question}</h3>
          <div className="space-y-3 mb-6">
            {questions[currentQuestion].options.map((option, index) => (
              <div
                key={index}
                className={`p-4 border rounded-lg cursor-pointer ${
                  selectedAnswer === index ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20" : "border-gray-300 dark:border-gray-650"
                }`}
                onClick={() => handleAnswerSelect(index)}
              >
                {option}
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg"
            >
              {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2 dark:text-white">Your Score: {score}/{questions.length}</h3>
          <button onClick={() => { setShowIntro(true); setScore(0); setCurrentQuestion(0); setSelectedAnswer(null); }} className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg">Try Again</button>
        </div>
      )}
    </section>
  );
};

export default SegmentQuiz;
