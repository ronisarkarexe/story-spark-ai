import React, { useEffect } from "react";

interface ErrorToastProps {
  message: string;
  onClose: () => void;
  autoCloseDuration?: number;
}

export const ErrorToast: React.FC<ErrorToastProps> = ({
  message,
  onClose,
  autoCloseDuration,
}) => {
  useEffect(() => {
    if (!autoCloseDuration) return;
    const timer = setTimeout(onClose, autoCloseDuration);
    return () => clearTimeout(timer);
  }, [autoCloseDuration, onClose]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.875rem 1.25rem",
        marginBottom: "1rem",
        borderRadius: "0.5rem",
        background: "var(--color-error-bg, #fff1f0)",
        border: "1px solid var(--color-error-border, #ffa39e)",
        color: "var(--color-error-text, #a61d24)",
        fontSize: "0.9375rem",
      }}
    >
      <span aria-hidden="true">⚠️</span>
      <span style={{ flex: 1 }}>{message}</span>
      <button
        onClick={onClose}
        aria-label="Dismiss error"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "1.125rem",
          color: "inherit",
        }}
      >
        ✕
      </button>
    </div>
  );
};