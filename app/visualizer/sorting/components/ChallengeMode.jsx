"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

const getAccuracy = ({ correct, answered }) => {
  if (!answered) return 0;
  return Math.round((correct / answered) * 100);
};

export function useSortingChallenge(enabled) {
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [stats, setStats] = useState({ correct: 0, answered: 0 });
  const enabledRef = useRef(enabled);
  const resolveRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  const finishQuestion = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setActiveQuestion(null);

    if (resolveRef.current) {
      resolveRef.current();
      resolveRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!enabled) finishQuestion();
  }, [enabled, finishQuestion]);

  useEffect(() => {
    return () => finishQuestion();
  }, [finishQuestion]);

  const askChallenge = useCallback(
    async (question) => {
      if (!enabledRef.current) return;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      setActiveQuestion({
        ...question,
        selectedOptionId: null,
        answered: false,
      });

      await new Promise((resolve) => {
        resolveRef.current = resolve;
      });
    },
    []
  );

  const submitAnswer = useCallback((optionId) => {
    setActiveQuestion((question) => {
      if (!question || question.answered) return question;

      const isCorrect = optionId === question.correctOptionId;
      setStats((current) => ({
        correct: current.correct + (isCorrect ? 1 : 0),
        answered: current.answered + 1,
      }));

      timeoutRef.current = setTimeout(finishQuestion, 900);

      return {
        ...question,
        selectedOptionId: optionId,
        answered: true,
      };
    });
  }, [finishQuestion]);

  const resetChallengeStats = useCallback(() => {
    setStats({ correct: 0, answered: 0 });
    finishQuestion();
  }, [finishQuestion]);

  return {
    activeQuestion,
    askChallenge,
    resetChallengeStats,
    stats,
    submitAnswer,
  };
}

export function createOptions(correctLabel, distractorLabels) {
  const labels = [correctLabel, ...distractorLabels].filter(Boolean);
  const uniqueLabels = [...new Set(labels)].slice(0, 4);

  return uniqueLabels.map((label, index) => ({
    id: index === 0 ? "correct" : `option-${index}`,
    label,
  }));
}

export default function ChallengeModePanel({
  activeQuestion,
  disabled = false,
  enabled,
  onEnabledChange,
  onResetStats,
  onSubmitAnswer,
  stats,
}) {
  const accuracy = getAccuracy(stats);

  return (
    <div className="mt-4 rounded-lg border border-purple-200 bg-purple-50 p-3 dark:border-purple-900/60 dark:bg-purple-950/20">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex items-center gap-3 text-sm font-medium text-gray-800 dark:text-gray-100">
          <input
            type="checkbox"
            checked={enabled}
            disabled={disabled}
            onChange={(event) => onEnabledChange(event.target.checked)}
            className="h-4 w-4 accent-[#a435f0]"
          />
          Interactive Challenge Mode
        </label>

        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
          <span className="rounded bg-white px-2 py-1 dark:bg-neutral-900">
            Correct: {stats.correct}/{stats.answered}
          </span>
          <span className="rounded bg-white px-2 py-1 dark:bg-neutral-900">
            Accuracy: {accuracy}%
          </span>
          <button
            type="button"
            onClick={onResetStats}
            className="rounded border border-[#a435f0] px-2 py-1 text-[#a435f0] transition-colors hover:bg-purple-100 dark:hover:bg-purple-900/40"
          >
            Reset Score
          </button>
        </div>
      </div>

      {activeQuestion && (
        <div className="mt-3 rounded-lg border border-purple-200 bg-white p-3 dark:border-purple-900/60 dark:bg-neutral-950">
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {activeQuestion.prompt}
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {activeQuestion.options.map((option) => {
              const isSelected = option.id === activeQuestion.selectedOptionId;
              const isCorrect = option.id === activeQuestion.correctOptionId;
              const showResult = activeQuestion.answered && (isSelected || isCorrect);

              return (
                <button
                  key={option.id}
                  type="button"
                  disabled={activeQuestion.answered}
                  onClick={() => onSubmitAnswer(option.id)}
                  className={`rounded border px-3 py-2 text-left text-sm transition-colors disabled:cursor-default ${
                    showResult && isCorrect
                      ? "border-green-600 bg-green-100 text-green-900 dark:bg-green-900/40 dark:text-green-100"
                      : showResult && isSelected
                      ? "border-red-600 bg-red-100 text-red-900 dark:bg-red-900/40 dark:text-red-100"
                      : "border-gray-200 bg-gray-50 hover:border-[#a435f0] hover:bg-purple-50 dark:border-gray-700 dark:bg-neutral-900 dark:hover:bg-purple-950/30"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          {activeQuestion.answered && (
            <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              {activeQuestion.explanation}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
