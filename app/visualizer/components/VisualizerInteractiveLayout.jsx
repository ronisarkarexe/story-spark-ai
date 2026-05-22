"use client";

export function VisualizerInteractiveLayout({
  children,
  className = "mx-auto flex max-w-4xl flex-col gap-6",
}) {
  return <div className={className}>{children}</div>;
}

export function VisualizerCard({
  children,
  className = "",
  padded = true,
}) {
  return (
    <div
      className={`rounded-2xl border border-[#e5e7eb] bg-white shadow-sm dark:border-[#222] dark:bg-[#111] ${
        padded ? "p-4 sm:p-6" : ""
      } ${className}`.trim()}
    >
      {children}
    </div>
  );
}
