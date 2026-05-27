"use client";

const ArrayGenerator = ({ onGenerate, disabled = false, isPrimary = false, defaultSize = 10, minValue = 5, maxValue = 100 }) => {
  const generateRandomArray = (size = 10, min = 5, max = 100) => {
    return Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min);
  };

  const handleGenerate = () => {
    const newArray = generateRandomArray();
    onGenerate(newArray);
  };

  return (
    <button
      onClick={handleGenerate}
      disabled={disabled}
      className={`w-full px-4 py-2 rounded disabled:opacity-50 mb-2 text-sm sm:text-base transition-colors font-medium ${
        isPrimary 
          ? "bg-[#a435f0] hover:bg-[#8f2cd6] text-white" 
          : "bg-[#f3e8ff] dark:bg-[#a435f0]/20 text-[#a435f0] dark:text-[#e9d5ff] hover:bg-[#e9d5ff] dark:hover:bg-[#a435f0]/30"
      }`}
    >
      Generate Random Array
    </button>
  );
};

export default ArrayGenerator;