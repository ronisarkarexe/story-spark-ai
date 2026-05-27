"use client";
import React from "react";
import PlaybackControls from "@/app/components/ui/PlaybackControls";
import useVisualizerKeyboard from "@/app/hooks/useVisualizerKeyboard";

export default function LinearMemoryControls({
  inputValue,
  setInputValue,
  placeholder = "Enter value...",
  isAnimating = false,
  operation = null,
  message = null,
  speed = 1,
  onSpeedChange,
  actions = [],
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isAnimating) {
      const primaryAction = actions.find(a => a.needsInput);
      if (primaryAction && !primaryAction.disabled) {
        primaryAction.onClick();
      }
    }
  };

  useVisualizerKeyboard({
    onReset: actions.find((a) => a.label?.toLowerCase() === "reset")?.onClick,
    onSpeedChange: onSpeedChange,
    speed: speed,
    sorting: isAnimating,
    sorted: false,
    enabled: true,
  });

  return (
    <div className="bg-white max-w-4xl mx-auto dark:bg-neutral-950 p-6 rounded-xl shadow-lg mb-8 border border-gray-200 dark:border-gray-700 w-full flex flex-col items-center">
      {/* 1. Input and Actions Row */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4 w-full justify-center items-center">
        {setInputValue && (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            className="flex-1 p-3 border border-neutral-300 dark:border-gray-600 rounded-lg dark:bg-neutral-900 focus:ring-2 focus:ring-primary focus:border-transparent transition-all min-w-[180px] max-w-xs"
            disabled={isAnimating}
            onKeyDown={handleKeyDown}
          />
        )}
        
        <div className={`grid grid-cols-2 sm:grid-cols-${Math.min(actions.length, 3)} gap-2 w-full sm:w-auto`}>
          {actions.map((action, idx) => {
            const isPrimary = action.variant === "primary";
            const isOutline = action.variant === "outline";
            const isDanger = action.variant === "danger";
            const isWarning = action.variant === "warning";
            const isSuccess = action.variant === "success";

            const isSecondary = action.variant === "secondary";

            let baseClasses = "px-4 py-3 rounded-lg transition-all flex items-center justify-center gap-2 font-bold text-sm sm:text-base ";
            if (isPrimary) {
              baseClasses += "bg-[#a435f0] hover:bg-[#8f2cd6] text-white";
            } else if (isOutline) {
              baseClasses += "border-2 border-[#1a1a1a] dark:border-[#f7f9fa] text-[#1a1a1a] dark:text-[#f7f9fa] hover:bg-[#1a1a1a] hover:text-white dark:hover:bg-white dark:hover:text-[#1a1a1a]";
            } else if (isDanger) {
              baseClasses += "bg-red-500 hover:bg-red-600 text-white";
            } else if (isWarning) {
              baseClasses += "bg-amber-600 hover:bg-amber-700 text-white";
            } else if (isSuccess) {
              baseClasses += "bg-green-600 hover:bg-green-700 text-white";
            } else if (isSecondary) {
              baseClasses += "bg-[#a435f0]/10 hover:bg-[#a435f0]/20 text-[#a435f0] dark:bg-[#a435f0]/20 dark:hover:bg-[#a435f0]/30 dark:text-[#d38cff]";
            } else {
              baseClasses += "bg-[#a435f0] hover:bg-[#8f2cd6] text-white";
            }

            if (isAnimating || action.disabled) {
              baseClasses += " opacity-50 cursor-not-allowed";
            }

            const colSpan = actions.length % 2 !== 0 && idx === actions.length - 1 ? "col-span-2 sm:col-span-1" : "";

            return (
              <button
                key={idx}
                onClick={action.onClick}
                disabled={isAnimating || action.disabled}
                className={`${baseClasses} ${colSpan}`}
              >
                {action.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Playback Speed Slider (Only Speed, no Play/Pause) */}
      <div className="w-full mt-2 mb-4 border-t border-gray-100 dark:border-gray-800 pt-4 flex justify-center">
        <PlaybackControls 
          showPlayPause={false}
          speed={speed}
          onSpeedChange={onSpeedChange}
          onIncreaseSpeed={() => onSpeedChange(Math.min(speed + 0.5, 5))}
          onDecreaseSpeed={() => onSpeedChange(Math.max(speed - 0.5, 0.5))}
          disabled={isAnimating}
        />
      </div>

      {/* 3. Status and Message Banner */}
      <div className="flex flex-col gap-3 w-full items-center">
        {operation && (
          <div className="p-3 w-full sm:w-auto rounded-lg bg-[#a435f0]/10 dark:bg-[#a435f0]/20 text-[#a435f0] border border-[#a435f0]/20 flex items-center gap-2 justify-center font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-spin" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            <span>{operation}</span>
          </div>
        )}
        {message && (
          <div className={`p-3 w-full sm:w-auto rounded-lg font-medium flex items-center gap-2 justify-center ${
            message.toLowerCase().includes("added") || message.toLowerCase().includes("pushed")
              ? "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800"
              : message.toLowerCase().includes("removed") || message.toLowerCase().includes("popped") || message.toLowerCase().includes("dequeu")
              ? "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800"
              : "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800"
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              {message.toLowerCase().includes("added") || message.toLowerCase().includes("pushed") ? (
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              ) : message.toLowerCase().includes("removed") || message.toLowerCase().includes("popped") || message.toLowerCase().includes("dequeu") ? (
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
              )}
            </svg>
            <span>{message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
