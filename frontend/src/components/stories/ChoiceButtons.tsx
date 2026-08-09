import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export type ChoiceButtonsProps = {
  choices: string[];
  onSelect: (choice: string) => void;
  disabled: boolean;
};

const ChoiceButtons = ({ choices, onSelect, disabled }: ChoiceButtonsProps) => {
  const MAX_CHOICE_LENGTH = 200;
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  useEffect(() => {
    setSelectedChoice(null);
  }, [choices]);

  const handleSelect = (choice: string) => {
    if (disabled || selectedChoice) {
      return;
    }

    if (choice && choice.length > MAX_CHOICE_LENGTH) {
      choice = choice.slice(0, MAX_CHOICE_LENGTH);
    }

    setSelectedChoice(choice);
    onSelect(choice);
  };

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3 w-full box-border items-stretch">
      {choices.map((choice, index) => {
        const isSelected = selectedChoice === choice;

        return (
          <motion.button
            key={`${choice}-${index}`}
            type="button"
            whileHover={disabled || selectedChoice ? undefined : { scale: 1.01, y: -1 }}
            whileTap={disabled || selectedChoice ? undefined : { scale: 0.99 }}
            onClick={() => handleSelect(choice)}
            disabled={disabled || Boolean(selectedChoice)}
            className={`w-full text-left bg-white dark:bg-[#111827]/40 border rounded-2xl sm:rounded-3xl p-5 shadow-sm transition-all duration-200 flex flex-col justify-between box-border relative overflow-hidden group ${
              isSelected
                ? "border-blue-600 dark:border-white bg-blue-500/[0.02] dark:bg-white/[0.02] shadow-md"
                : "border-slate-200 dark:border-white/10 hover:border-blue-500/40 dark:hover:border-white/30"
            } ${disabled || selectedChoice ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
          >
            <div className="flex items-start justify-between gap-4 w-full box-border">
              <div className="min-w-0 flex-1">
                <span className="mb-3 inline-flex rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200/40 dark:border-transparent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 select-none">
                  Choice {index + 1}
                </span>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium m-0 break-words">
                  {choice.length > MAX_CHOICE_LENGTH ? `${choice.slice(0, MAX_CHOICE_LENGTH)}...` : choice}
                </p>
              </div>
              
              <span
                className={`mt-1 h-3.5 w-3.5 rounded-full border transition-all duration-200 shrink-0 select-none ${
                  isSelected 
                    ? "border-blue-600 bg-blue-600 dark:border-white dark:bg-white scale-110" 
                    : "border-slate-300 dark:border-white/20 bg-transparent group-hover:border-slate-400 dark:group-hover:border-white/40"
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