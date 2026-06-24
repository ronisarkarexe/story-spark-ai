interface PublishConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const PublishConfirmModal = ({ onConfirm, onCancel }: PublishConfirmModalProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="publish-dialog-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-sm bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-6 text-left">
        
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 select-none">
          <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
          </svg>
        </div>

        {/* Heading */}
        <h2
          id="publish-dialog-title"
          className="text-lg font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight"
        >
          Publish this story?
        </h2>

        {/* Body */}
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6 font-medium">
          This will make your story visible to everyone on Story Spark AI. 
          You won't be able to unpublish it once it goes live.
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300 text-sm font-bold uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-white/10 transition-all active:scale-[0.98] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold uppercase tracking-wider shadow-md shadow-blue-500/10 transition-all active:scale-[0.98] cursor-pointer"
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishConfirmModal;