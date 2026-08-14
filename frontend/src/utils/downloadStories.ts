const isBrowser = typeof window !== "undefined" && typeof document !== "undefined";

export const downloadTXT = (story: any) => {
  if (typeof window === "undefined") {
    return;
  }

  const content = `Title: ${story.title}\nPrompt: ${story.prompt}\nStory: ${story.content}\nGenerated: ${new Date().toLocaleString()}`;

  const blob = new Blob([content], { type: "text/plain" });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;

  link.download = `${story.title.replace(/[\\/:*?"<>|\s]+/g, "_")}.txt`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Defer revocation so Firefox/Safari have time to start reading the blob
  // before the object URL is invalidated.
  setTimeout(() => URL.revokeObjectURL(url), 0);
};
