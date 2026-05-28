import React, { useEffect, useId, useRef, useState } from "react";

type FeedbackField = "fullname" | "email" | "subject" | "message";

type ValidationError = {
  field: FeedbackField;
  message: string;
};

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
  const [errorField, setErrorField] = useState<FeedbackField | null>(null);
  const dialogTitleId = useId();
  const errorMessageId = useId();
  const successMessageId = useId();
  const fullnameId = useId();
  const emailId = useId();
  const feedbackTypeId = useId();
  const subjectId = useId();
  const messageId = useId();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);
  const errorMessageRef = useRef<HTMLParagraphElement | null>(null);
  const successMessageRef = useRef<HTMLParagraphElement | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);
  const requestControllerRef = useRef<AbortController | null>(null);
  const onCloseRef = useRef<Props["onClose"]>(onClose);
  const openerRef = useRef<Element | null>(null);

  const getValidationError = (): ValidationError | null => {
    if (!fullname.trim()) return { field: "fullname", message: "Full name is required" };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) return { field: "email", message: "Email is required" };
    if (!emailRegex.test(email)) return { field: "email", message: "Please enter a valid email" };
    if (!subject.trim()) return { field: "subject", message: "Subject is required" };
    if (!message.trim()) return { field: "message", message: "Message is required" };
    return null;
  };

  const baseUrlValue = import.meta.env.VITE_BASE_URL?.trim();
  const baseUrl = baseUrlValue ? baseUrlValue.replace(/\/+$/, "") : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = getValidationError();
    if (validationError) {
      setErrorMsg(validationError.message);
      setErrorField(validationError.field);
      setSuccessMessage("");
      setStatus("error");
      return;
    }

    if (!baseUrl) {
      setErrorMsg("Feedback service is not configured.");
      setErrorField(null);
      setSuccessMessage("");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");
    setSuccessMessage("");
    setErrorField(null);

    if (requestControllerRef.current) {
      requestControllerRef.current.abort();
    }

    const controller = new AbortController();
    requestControllerRef.current = controller;

    try {
      const res = await fetch(`${baseUrl}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname, email, subject: `${feedbackType.toUpperCase()}: ${subject}`, message }),
        signal: controller.signal,
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
        if (!requestControllerRef.current || requestControllerRef.current.signal.aborted) {
          return;
        }
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
        if (!requestControllerRef.current || requestControllerRef.current.signal.aborted) {
          return;
        }
        setStatus("error");
        setErrorMsg(data?.message || "Failed to send feedback");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  };

  useEffect(() => {
    openerRef.current = document.activeElement;
    firstFieldRef.current?.focus();

    return () => {
      if (closeTimeoutRef.current !== null) {
        window.clearTimeout(closeTimeoutRef.current);
      }
      if (openerRef.current instanceof HTMLElement) {
        openerRef.current.focus();
      }
      if (requestControllerRef.current) {
        requestControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (requestControllerRef.current) {
          try {
            requestControllerRef.current.abort();
          } catch {}
        }
        onCloseRef.current?.();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const dialogElement = dialogRef.current;
      const focusableElements = dialogElement
        ? Array.from(
            dialogElement.querySelectorAll<HTMLElement>(
              'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
            )
          ).filter((element) => {
            try {
              const anyEl = element as unknown as { checkVisibility?: () => boolean };
              if (typeof anyEl.checkVisibility === "function") return anyEl.checkVisibility();
              return element.getClientRects().length > 0;
            } catch {
              return true;
            }
          })
        : [];

      if (focusableElements.length === 0) {
        return;
      }

      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (!dialogElement?.contains(activeElement)) {
        event.preventDefault();
        firstFocusable.focus();
        return;
      }

      if (event.shiftKey && activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      } else if (!event.shiftKey && activeElement === lastFocusable) {
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
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
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
            <label className="sr-only" htmlFor={fullnameId}>Full name</label>
            <input
              id={fullnameId}
              ref={firstFieldRef}
              type="text"
              autoComplete="name"
              required
              aria-required="true"
              aria-invalid={status === "error" && errorField === "fullname"}
              aria-describedby={status === "error" && errorField === "fullname" ? errorMessageId : undefined}
              value={fullname}
              onChange={(e) => {
                setFullname(e.target.value);
                if (errorField === "fullname") {
                  setErrorField(null);
                  setErrorMsg("");
                  setStatus("idle");
                }
              }}
              placeholder="Full name"
              className="col-span-2 sm:col-span-1 w-full rounded-md bg-[#0d1630]/60 border border-white/[0.06] px-3 py-2 text-white placeholder-slate-500"
            />
            <label className="sr-only" htmlFor={emailId}>Email address</label>
            <input
              id={emailId}
              type="email"
              autoComplete="email"
              required
              aria-required="true"
              aria-invalid={status === "error" && errorField === "email"}
              aria-describedby={status === "error" && errorField === "email" ? errorMessageId : undefined}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errorField === "email") {
                  setErrorField(null);
                  setErrorMsg("");
                  setStatus("idle");
                }
              }}
              placeholder="you@example.com"
              className="col-span-2 sm:col-span-1 w-full rounded-md bg-[#0d1630]/60 border border-white/[0.06] px-3 py-2 text-white placeholder-slate-500"
            />
          </div>

          <div className="flex gap-2 items-center">
            <label className="text-sm text-slate-300" htmlFor={feedbackTypeId}>Type:</label>
            <select
              id={feedbackTypeId}
              value={feedbackType}
              onChange={(e) => {
                setFeedbackType(e.target.value);
              }}
              aria-required="true"
              className="rounded-md bg-[#0d1630]/60 border border-white/[0.06] px-2 py-1 text-white"
            >
              <option value="bug">Bug Report</option>
              <option value="feature">Feature Request</option>
              <option value="general">General Feedback</option>
            </select>
          </div>

          <label className="sr-only" htmlFor={subjectId}>Subject</label>
          <input
            id={subjectId}
            required
            aria-required="true"
            aria-invalid={status === "error" && errorField === "subject"}
            aria-describedby={status === "error" && errorField === "subject" ? errorMessageId : undefined}
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              if (errorField === "subject") {
                setErrorField(null);
                setErrorMsg("");
                setStatus("idle");
              }
            }}
            placeholder="Subject"
            autoComplete="off"
            className="w-full rounded-md bg-[#0d1630]/60 border border-white/[0.06] px-3 py-2 text-white placeholder-slate-500"
          />

          <label className="sr-only" htmlFor={messageId}>Message</label>
          <textarea
            id={messageId}
            required
            aria-required="true"
            aria-invalid={status === "error" && errorField === "message"}
            aria-describedby={status === "error" && errorField === "message" ? errorMessageId : undefined}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (errorField === "message") {
                setErrorField(null);
                setErrorMsg("");
                setStatus("idle");
              }
            }}
            placeholder="Describe the issue or feedback"
            rows={5}
            className="w-full resize-y rounded-md bg-[#0d1630]/60 border border-white/[0.06] px-3 py-2 text-white placeholder-slate-500"
          />

          {status === "error" && errorMsg && (
            <p ref={errorMessageRef} id={errorMessageId} role="alert" tabIndex={-1} className="text-sm text-red-400 outline-none">
              {errorMsg}
            </p>
          )}
          {status === "success" && (
            <p ref={successMessageRef} id={successMessageId} role="status" aria-live="polite" tabIndex={-1} className="text-sm text-green-400 outline-none">
              {successMessage}
            </p>
          )}

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
