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

  // Firefox and Safari require the anchor to be attached to the DOM before click()
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Defer revocation so the browser finishes reading the blob; a 0ms timeout
  // pushes it off the current task, after the download has started.
  setTimeout(() => URL.revokeObjectURL(url), 0);
};
