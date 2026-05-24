"use client";
import React, { useState } from "react";
import { FaAward } from "react-icons/fa";

const BTreeQuiz = () => {
  const questions = [
    {
      question: "Why are B-Trees preferred over Binary Search Trees for disk-based databases?",
      options: [
        "B-Trees use less memory.",
        "B-Trees have broader, shallower nodes, significantly reducing disk read operations.",
        "B-Trees are simpler to write and debug.",
        "B-Trees support more floating-point operations."
      ],
      correctAnswer: 1,
      explanation: "By grouping multiple keys in a single broad node, B-Trees reduce the tree height and the number of disk seek calls."
    },
    {
      question: "In a B-Tree of order M, what is the maximum number of children any internal node can have?",
      options: [
        "M - 1 children",
        "M children",
        "2M children",
        "Unlimited children"
      ],
      correctAnswer: 1,
      explanation: "A B-Tree of order M allows any node to have up to M children."
    }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [showIntro, setShowIntro] = useState(true);

  const handleAnswerSelect = (optionIndex) => {
    setSelectedAnswer(optionIndex);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
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
          <h2 className="text-2xl font-bold mb-4 text-black dark:text-gray-100">B-Tree Concepts Quiz</h2>
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

export default BTreeQuiz;
