import React, { useEffect, useId, useRef, useState } from "react";

type Props = {
  onClose: () => void;
};

const FeedbackForm: React.FC<Props> = ({ onClose }) => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [feedbackType, setFeedbackType] = useState("bug");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const dialogTitleId = useId();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);

  const validate = () => {
    if (!fullname.trim()) return "Full name is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email";
    if (!subject.trim()) return "Subject is required";
    if (!message.trim()) return "Message is required";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      setErrorMsg(v);
      setSuccessMessage("");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    setSuccessMessage("");
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname, email, subject: `${feedbackType.toUpperCase()}: ${subject}`, message }),
      });
      const responseText = await res.text();
      let data: { message?: string } | null = null;

      if (responseText) {
        try {
          data = JSON.parse(responseText) as { message?: string };
        } catch {
          data = null;
        }
      }

      if (res.ok) {
        setStatus("success");
        setSuccessMessage("Thanks — we received your feedback.");
        setFullname("");
        setEmail("");
        setSubject("");
        setMessage("");
        if (closeTimeoutRef.current !== null) {
          window.clearTimeout(closeTimeoutRef.current);
        }
        closeTimeoutRef.current = window.setTimeout(onClose, 1200);
      } else {
        setStatus("error");
        setErrorMsg(data?.message || "Failed to send feedback");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  };

  useEffect(() => {
    firstFieldRef.current?.focus();

    return () => {
      if (closeTimeoutRef.current !== null) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, input, select, textarea, [href], [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements || focusableElements.length === 0) {
        return;
      }

      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      } else if (!event.shiftKey && document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="presentation">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={dialogTitleId}
        className="relative z-10 mx-4 w-full max-w-xl rounded-lg bg-[#07102a] p-6 shadow-lg"
      >
        <div className="flex items-start justify-between">
          <h3 id={dialogTitleId} className="text-lg font-semibold text-white">Send Feedback</h3>
          <button type="button" onClick={onClose} className="text-slate-300 hover:text-white" aria-label="Close feedback form">
            ✕
          </button>
        </div>
        <p className="mt-2 text-sm text-slate-300">Report a bug, request a feature, or share general feedback.</p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <label className="sr-only" htmlFor="feedback-fullname">Full name</label>
            <input
              id="feedback-fullname"
              ref={firstFieldRef}
              type="text"
              autoComplete="name"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              placeholder="Full name"
              className="col-span-2 sm:col-span-1 w-full rounded-md bg-[#0d1630]/60 border border-white/[0.06] px-3 py-2 text-white placeholder-slate-500"
            />
            <label className="sr-only" htmlFor="feedback-email">Email address</label>
            <input
              id="feedback-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="col-span-2 sm:col-span-1 w-full rounded-md bg-[#0d1630]/60 border border-white/[0.06] px-3 py-2 text-white placeholder-slate-500"
            />
          </div>

          <div className="flex gap-2 items-center">
            <label className="text-sm text-slate-300" htmlFor="feedback-type">Type:</label>
            <select
              id="feedback-type"
              value={feedbackType}
              onChange={(e) => setFeedbackType(e.target.value)}
              className="rounded-md bg-[#0d1630]/60 border border-white/[0.06] px-2 py-1 text-white"
            >
              <option value="bug">Bug Report</option>
              <option value="feature">Feature Request</option>
              <option value="general">General Feedback</option>
            </select>
          </div>

          <label className="sr-only" htmlFor="feedback-subject">Subject</label>
          <input
            id="feedback-subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            autoComplete="off"
            className="w-full rounded-md bg-[#0d1630]/60 border border-white/[0.06] px-3 py-2 text-white placeholder-slate-500"
          />

          <label className="sr-only" htmlFor="feedback-message">Message</label>
          <textarea
            id="feedback-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe the issue or feedback"
            rows={5}
            className="w-full resize-y rounded-md bg-[#0d1630]/60 border border-white/[0.06] px-3 py-2 text-white placeholder-slate-500"
          />

          {status === "error" && errorMsg && <p className="text-sm text-red-400">{errorMsg}</p>}
          {status === "success" && <p className="text-sm text-green-400">{successMessage}</p>}

          <div className="flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="px-3 py-2 text-sm text-slate-300 hover:text-white">Cancel</button>
            <button type="submit" disabled={status === "loading"} className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2 text-white text-sm font-semibold hover:opacity-95">
              {status === "loading" ? "Sending..." : "Send"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
