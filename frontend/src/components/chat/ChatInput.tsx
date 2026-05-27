import { FormEvent, KeyboardEvent } from "react";

interface ChatInputProps {
  value: string;
  loading: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
}

const ChatInput = ({ value, loading, onChange, onSend }: ChatInputProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading || !value.trim()) {
      return;
    }
    onSend();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (!loading && value.trim()) {
        onSend();
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-slate-200 bg-white/95 p-3 dark:border-white/10 dark:bg-slate-950/90"
      aria-label="Send message form"
    >
      <div className="mx-auto flex w-full max-w-4xl items-end gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm dark:border-white/10 dark:bg-slate-900">
        <label htmlFor="chat-message" className="sr-only">
          Message
        </label>
        <textarea
          id="chat-message"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask StorySpark AI anything..."
          rows={1}
          className="max-h-32 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="motion-cta rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-60"
        >
          Send
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
