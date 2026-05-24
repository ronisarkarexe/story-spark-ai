"use client";
import React, { useState } from "react";
import { FaCheck, FaTimes, FaArrowRight, FaArrowLeft, FaInfoCircle, FaRedo, FaTrophy, FaStar, FaAward } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const RedBlackQuiz = () => {
  const questions = [
    {
      question: "Which of the following is NOT a property of a Red-Black Tree?",
      options: [
        "The root node is always Black.",
        "A Red node must have Black children.",
        "The black height from any node to its descendant leaves varies.",
        "NIL leaf nodes are colored Black."
      ],
      correctAnswer: 2,
      explanation: "By property, the black height from any node to its descendant leaves must be exactly the same, ensuring balanced paths."
    },
    {
      question: "What is the maximum height of a Red-Black tree containing N keys?",
      options: [
        "O(N)",
        "O(log N)",
        "O(N log N)",
        "O(1)"
      ],
      correctAnswer: 1,
      explanation: "Even in the worst case (alternating red and black nodes), the height of a Red-Black tree is guaranteed to be bounded by O(log N)."
    }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [showIntro, setShowIntro] = useState(true);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

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
      setShowSuccessAnimation(true);
      setTimeout(() => {
        setShowSuccessAnimation(false);
        setQuizCompleted(true);
        setShowResult(true);
      }, 1500);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setQuizCompleted(false);
    setAnswers(Array(questions.length).fill(null));
    setShowIntro(true);
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
          <h2 className="text-2xl font-bold mb-4 text-black dark:text-gray-100">Red-Black Tree Quiz</h2>
          <button
            onClick={() => setShowIntro(false)}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg"
          >
            Start Quiz
          </button>
        </div>
      ) : showSuccessAnimation ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-700 dark:text-gray-200">
          <p className="text-xl font-semibold">Quiz Completed!</p>
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
              className="px-4 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50"
            >
              {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2 dark:text-white">Your Score: {score}/{questions.length}</h3>
          <button onClick={resetQuiz} className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg">Try Again</button>
        </div>
      )}
    </section>
  );
};

export default RedBlackQuiz;
