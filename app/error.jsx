"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({ error, reset }) {
  const fallbackMessage = "An unexpected error occurred. Please try again.";
  const errorMessage =
    process.env.NODE_ENV === "production"
      ? fallbackMessage
      : error?.message || fallbackMessage;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white px-4 dark:bg-[var(--udemy-dark-bg)]">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="rounded-full bg-[var(--color-danger)]/10 p-4">
          <AlertTriangle className="h-10 w-10 text-[var(--color-danger)]" />
        </div>
        <h2 className="text-xl font-bold text-[var(--udemy-text)] dark:text-[var(--udemy-dark-text)]">
          Something went wrong!
        </h2>
        <p className="max-w-md text-sm text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)]">
          {errorMessage}
        </p>
        <button
          onClick={reset}
          className="btn-base bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
      </div>
    </div>
  );
}
