export const downloadTXT = (story: any) => {
  if (typeof window === 'undefined') return;

  const content = `Title: ${story.title}\nPrompt: ${story.prompt}\nStory: ${story.content}\nGenerated: ${new Date().toLocaleString()}`;

  const blob = new Blob([content], { type: "text/plain" });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;

  link.download = `${story.title.replace(/[\\/:*?"<>|\s]+/g, "_")}.txt`;

  link.click();

  URL.revokeObjectURL(url);
};