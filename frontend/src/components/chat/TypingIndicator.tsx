const TypingIndicator = () => {
  return (
    <div className="flex justify-start" aria-live="polite" aria-label="AI is typing">
      <div className="rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-900">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 animate-pulse rounded-full bg-slate-400 dark:bg-slate-500" />
          <span className="h-2 w-2 animate-pulse rounded-full bg-slate-400 [animation-delay:120ms] dark:bg-slate-500" />
          <span className="h-2 w-2 animate-pulse rounded-full bg-slate-400 [animation-delay:240ms] dark:bg-slate-500" />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
