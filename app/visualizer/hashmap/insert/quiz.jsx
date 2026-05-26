"use client";
import { useState } from "react";

const questions = [
  {
    question: "What is the average time complexity of HashMap insert?",
    options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
    answer: "O(1)",
  },
  {
    question: "What happens when two keys hash to the same index?",
    options: ["Error is thrown", "First key is deleted", "Collision occurs", "HashMap resizes"],
    answer: "Collision occurs",
  },
  {
    question: "Which method is used to insert in Java's HashMap?",
    options: ["insert()", "add()", "push()", "put()"],
    answer: "put()",
  },
  {
    question: "What is chaining in HashMap?",
    options: [
      "Linking multiple HashMaps",
      "Storing colliding entries in a linked list at same index",
      "Hashing a key twice",
      "Resizing the table",
    ],
    answer: "Storing colliding entries in a linked list at same index",
  },
];

const Quiz = () => {
  const [selected, setSelected] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (qIndex, option) => {
    if (submitted) return;
    setSelected((prev) => ({ ...prev, [qIndex]: option }));
  };

  const handleSubmit = () => {
    if (Object.keys(selected).length < questions.length) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setSelected({});
    setSubmitted(false);
  };

  const score = questions.filter((q, i) => selected[i] === q.answer).length;

  return (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="bg-white dark:bg-[#111] rounded-2xl border border-[#e5e7eb] dark:border-[#222] overflow-hidden">
        <div className="p-6 border-b border-[#f3f4f6] dark:border-[#1e1e1e]">
          <h2 className="text-2xl font-bold text-[#1a1a1a] dark:text-white flex items-center">
            <span className="w-1 h-6 bg-[#a435f0] mr-3 rounded-full"></span>
            Quiz — HashMap Insert
          </h2>
        </div>

        <div className="p-6 space-y-6">
          {questions.map((q, qIndex) => (
            <div key={qIndex}>
              <p className="text-[#1a1a1a] dark:text-white font-medium mb-3">
                {qIndex + 1}. {q.question}
              </p>
              <div className="space-y-2">
                {q.options.map((option) => {
                  const isSelected = selected[qIndex] === option;
                  const isCorrect = option === q.answer;
                  let style = "border-gray-200 dark:border-gray-700 text-[#374151] dark:text-[#d1d5db]";
                  if (submitted) {
                    if (isCorrect) style = "border-green-400 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400";
                    else if (isSelected) style = "border-red-400 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400";
                  } else if (isSelected) {
                    style = "border-[#a435f0] bg-[#faf5ff] dark:bg-[#1a0a2e] text-[#a435f0]";
                  }
                  return (
                    <button
                      key={option}
                      onClick={() => handleSelect(qIndex, option)}
                      className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${style}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {submitted && (
            <div className="p-4 rounded-lg bg-[#faf5ff] dark:bg-[#1a0a2e] border border-[#e9d5ff] dark:border-[#3b1a6e] text-center">
              <p className="text-[#a435f0] font-bold text-lg">
                Score: {score} / {questions.length}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={submitted || Object.keys(selected).length < questions.length}
              className="bg-[#a435f0] text-white px-6 py-2 rounded-lg hover:bg-[#8710d8] disabled:opacity-50"
            >
              Submit
            </button>
            <button
              onClick={handleReset}
              className="border border-gray-300 dark:border-gray-600 px-6 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;