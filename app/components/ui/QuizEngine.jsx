"use client";
import React, { useState } from 'react';
import { FaCheck, FaTimes, FaArrowRight, FaArrowLeft, FaInfoCircle, FaRedo, FaTrophy, FaStar, FaAward } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuizEngine({ title, questions }) {
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
      }, 2000);
    }
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestion(currentQuestion - 1);
    setSelectedAnswer(answers[currentQuestion - 1]);
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

  const startQuiz = () => {
    setShowIntro(false);
  };

  const getStarRating = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 90) return 5;
    if (percentage >= 70) return 4;
    if (percentage >= 50) return 3;
    if (percentage >= 30) return 2;
    return 1;
  };

  return (
    <section className="max-w-4xl mx-auto shadow-lg rounded-xl bg-white dark:bg-neutral-950 mt-8 mb-8 p-6 border border-gray-200 dark:border-gray-700">
      {showIntro ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-primary/10 dark:bg-neutral-900 p-4 rounded-full">
              <FaAward className="text-4xl text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-black mb-4 text-black dark:text-gray-100" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.03em' }}>
            {title}
          </h2>
          <div className="bg-white dark:bg-neutral-900 p-4 rounded-lg mb-6 text-left shadow-inner border border-gray-100 dark:border-gray-800">
            <h3 className="font-black mb-2 flex items-center text-primary" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.02em' }}>
              <FaInfoCircle className="mr-2" /> How it works:
            </h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start">
                <FaCheck className="text-primary mt-1 mr-2 flex-shrink-0" />
                <span>+1 point for each correct answer</span>
              </li>
              <li className="flex items-start">
                <FaTimes className="text-primary mt-1 mr-2 flex-shrink-0" />
                <span>0 points for wrong answers</span>
              </li>
              <li className="flex items-start">
                <FaTrophy className="text-primary mt-1 mr-2 flex-shrink-0" />
                <span>Earn stars based on your final score (max 5 stars)</span>
              </li>
            </ul>
          </div>
          <button
            onClick={startQuiz}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all shadow-md hover:shadow-lg flex items-center mx-auto"
          >
            Start Quiz <FaArrowRight className="ml-2" />
          </button>
        </motion.div>
      ) : showSuccessAnimation ? (
        <div className="flex flex-col items-center justify-center h-64">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
            className="mb-4"
          >
            <div className="relative">
              <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <FaCheck className="text-4xl text-green-500 animate-bounce" />
              </div>
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 border-4 border-green-300 rounded-full"
              />
            </div>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl font-semibold text-gray-700 dark:text-gray-200"
          >
            Quiz Completed!
          </motion.p>
        </div>
      ) : !showResult ? (
        <div className="quiz-container">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-primary">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium bg-primary/10 px-2 py-1 rounded text-primary">
                Score: {score.toFixed(1)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div 
                className="bg-primary h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
          
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-black mb-6 dark:text-white p-4" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.02em' }}>
              {questions[currentQuestion].question}
            </h3>
            
            <div className="space-y-3 mb-6">
              {questions[currentQuestion].options.map((option, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedAnswer === index
                      ? 'border-primary bg-primary/10 shadow-md'
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => handleAnswerSelect(index)}
                >
                  <div className="flex items-center">
                    <span className={`font-medium mr-3 w-6 h-6 flex items-center justify-center rounded-full ${
                      selectedAnswer === index 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-200 dark:bg-gray-600'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option}</span>
                  </div>
                </motion.div>
              ))}
            </div>
            
          </motion.div>
          
          <div className="flex justify-between">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg disabled:opacity-50 flex items-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <FaArrowLeft className="mr-2" /> Previous
            </button>
            
            <button
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
              className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50 hover:bg-primary-dark transition-all flex items-center shadow-md hover:shadow-lg"
            >
              {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'} <FaArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="result-container"
        >
          <div className="text-center mb-8">
            <div className="relative inline-block mb-4">
              <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center shadow-lg">
                <div className="text-4xl font-bold text-primary">
                  {score.toFixed(1)}/{questions.length}
                </div>
              </div>
              <div className="absolute -bottom-2 left-0 right-0 flex justify-center">
                {[...Array(5)].map((_, i) => (
                  <FaStar 
                    key={i}
                    className={`text-2xl mx-1 ${
                      i < getStarRating() 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300 dark:text-gray-600 fill-current'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <h3 className="text-2xl font-black mb-2 dark:text-white" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.03em' }}>
              {score === questions.length ? "Perfect Score!" :
               score >= questions.length * 0.8 ? "Excellent Work!" :
               score >= questions.length * 0.6 ? "Good Job!" :
               score >= questions.length * 0.4 ? "Keep Practicing!" : "Let's Review Again!"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You scored {((score / questions.length) * 100).toFixed(0)}% correct
            </p>
          </div>
          
          <div className="space-y-4 mb-8">
            <h4 className="font-black text-gray-700 dark:text-gray-300" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.02em' }}>Question Breakdown:</h4>
            {questions.map((q, index) => (
              <div key={index} className="border-b pb-3 border-gray-200 dark:border-gray-700 last:border-0">
                <p className="font-medium text-gray-800 dark:text-gray-200">{q.question}</p>
                <div className={`flex items-start mt-1 ${
                  answers[index] === q.correctAnswer 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {answers[index] === q.correctAnswer ? (
                    <FaCheck className="mt-1 mr-2 flex-shrink-0" />
                  ) : (
                    <FaTimes className="mt-1 mr-2 flex-shrink-0" />
                  )}
                  <div>
                    <p className="text-sm">Your answer: {answers[index] !== null ? q.options[answers[index]] : "Not answered"}</p>
                    {answers[index] !== q.correctAnswer && (
                      <p className="text-sm">Correct answer: {q.options[q.correctAnswer]}</p>
                    )}
                    {answers[index] !== q.correctAnswer && q.explanation && (
                       <p className="text-sm text-gray-500 mt-1 italic">Note: {q.explanation}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button
            onClick={resetQuiz}
            className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all shadow-md hover:shadow-lg flex items-center justify-center"
          >
            <FaRedo className="mr-2" /> Take Quiz Again
          </button>
        </motion.div>
      )}
    </section>
  );
}
