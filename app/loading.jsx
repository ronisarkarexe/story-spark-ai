import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-[var(--udemy-dark-bg)]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-[var(--color-primary)]" />
        <p className="text-sm font-medium text-[var(--udemy-muted)] dark:text-[var(--udemy-dark-muted)]">
          Loading...
        </p>
      </div>
    </div>
  );
}
