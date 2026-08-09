import React from 'react';

interface Props {
  text: string;
}

export const NarrationControls: React.FC<Props> = ({ text }) => {
  const handlePlay = () => {
    // Agar pehle se kuch bol raha hai toh use stop karo
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    // Voice settings (Optional: tum yahan pitch/rate adjust kar sakti ho)
    utterance.rate = 1; 
    
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      onClick={handlePlay}
      className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-md transition-all cursor-pointer"
    >
      🔊 Read Aloud
    </button>
  );
};