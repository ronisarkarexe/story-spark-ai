"use client";
import { useState } from "react";

const CustomArrayInput = ({ 
  onUseCustomArray = (numbers) => console.log("Received:", numbers),
  disabled = false, 
  className = "" 
}) => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");
    
    if (!inputValue.trim()) {
      setError("Please enter numbers separated by commas");
      return;
    }

    try {
      const numbers = inputValue
        .split(",")
        .map(item => {
          const num = Number(item.trim());
          if (isNaN(num)) throw new Error(`"${item}" is not a valid number`);
          return num;
        });

      if (numbers.length === 0) {
        setError("No valid numbers found");
        return;
      }

      onUseCustomArray(numbers);
      setInputValue("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={`${className}`}>
      <div className="flex flex-col sm:flex-row gap-2 items-end">
        <div className="flex-1 w-full">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Example: 5, 3, 8, 1, 2"
            className="w-full p-2 border rounded dark:bg-gray-700"
            disabled={disabled}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
        <button
          onClick={handleSubmit}
          disabled={disabled || !inputValue.trim()}
          className="bg-[#a435f0] hover:bg-[#8f2cd6] text-white px-4 py-2 rounded disabled:opacity-50 transition-colors font-medium"
        >
          Use Array
        </button>
      </div>
    </div>
  );
};

export default CustomArrayInput;