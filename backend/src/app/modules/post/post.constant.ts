export const postSearchFields = ["title", "tag", "topic.title", "tags"];
export const postFilterFields = [
  "searchTerm",
  "title",
  "tag",
  "topic.title",
  "genres",
  "tags",
  "author",
  "isPublished",
];

export const MAX_SEARCH_TERM_LENGTH = 100;

export const escapeRegex = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
