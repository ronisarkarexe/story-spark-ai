export const saveRevision = (
  revisions: any[],
  content: string
) => {
  revisions.unshift({
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    summary: "Story updated",
    content,
  });

  return revisions;
};

export const restoreRevision = (
  revision: any
) => revision.content;