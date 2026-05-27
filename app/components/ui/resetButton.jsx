import React from 'react';

const ResetButton = ({ onReset, onClick, isAnimating, disabled }) => {
  const handleClick = onReset || onClick;
  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isAnimating || disabled}
      className="px-6 py-2.5 min-w-[100px] bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white font-bold rounded-lg disabled:opacity-50 transition-all duration-200 shadow-sm flex items-center justify-center text-sm"
    >
      Reset
    </button>
  );
};

export default ResetButton;