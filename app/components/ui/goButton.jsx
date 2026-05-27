'use client';
import React from 'react';

const GoButton = ({ onClick, onGo, isAnimating, disabled }) => {
  const handleClick = onClick || onGo;
  return (
    <button
      type="submit"
      onClick={handleClick}
      className="px-6 py-2.5 min-w-[100px] bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-bold rounded-lg disabled:opacity-50 transition-all duration-200 shadow-sm flex items-center justify-center text-sm"
      disabled={isAnimating || disabled}
    >
      Go
    </button>
  );
};

export default GoButton;