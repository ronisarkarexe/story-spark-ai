import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export type ChoiceButtonsProps = {
  choices: string[];
  onSelect: (choice: string) => void;
  disabled: boolean;
};

const ChoiceButtons = ({ choices, onSelect, disabled }: ChoiceButtonsProps) => {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  useEffect(() => {
    setSelectedChoice(null);
  }, [choices]);

  const handleSelect = (choice: string) => {
    if (disabled || selectedChoice) {
      return;
    }

    setSelectedChoice(choice);
    onSelect(choice);
  };

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {choices.map((choice, index) => {
        const isSelected = selectedChoice === choice;

        return (
          <motion.button
            key={`${choice}-${index}`}
            type="button"
            whileHover={disabled || selectedChoice ? undefined : { scale: 1.02, y: -2 }}
            whileTap={disabled || selectedChoice ? undefined : { scale: 0.98 }}
            onClick={() => handleSelect(choice)}
            disabled={disabled || Boolean(selectedChoice)}
            className={`group rounded-2xl border p-4 text-left transition-all duration-300 ${
              isSelected
                ? "border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/10"
                : "border-white/10 bg-white/5 hover:border-cyan-400/50 hover:bg-white/10"
            } ${disabled || selectedChoice ? "cursor-not-allowed opacity-75" : "cursor-pointer"}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="mb-2 inline-flex rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Choice {index + 1}
                </span>
                <p className="text-sm leading-6 text-slate-100 sm:text-base">
                  {choice}
                </p>
              </div>
              <span
                className={`mt-1 h-3 w-3 rounded-full border transition-colors duration-300 ${
                  isSelected ? "border-cyan-300 bg-cyan-400" : "border-white/30 bg-transparent"
                }`}
              />
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};

export default ChoiceButtons;