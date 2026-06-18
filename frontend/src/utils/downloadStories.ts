export const downloadTXT = (story: any) => {
  const content = `Title: ${story.title}\nPrompt: ${story.prompt}\nStory: ${story.content}\nGenerated: ${new Date().toLocaleString()}`;
  const blob = new Blob([content], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${story.title.replace(/\s/g, '_')}.txt`;
  link.click();
};