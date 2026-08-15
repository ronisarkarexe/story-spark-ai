import { useState } from "react";

interface StoryComment {
  id: string;
  author: string;
  text: string;
  selectedText: string;
  resolved: boolean;
  replies: string[];
}

export default function useComments() {

  const [comments, setComments] = useState<StoryComment[]>([
    {
      id: "1",
      author: "Reviewer",
      text: "The introduction could be more engaging.",
      selectedText: "Once upon a time...",
      resolved: false,
      replies: [],
    },
  ]);

  const addComment = (
    text: string,
    selectedText: string
  ) => {

    const newComment = {
      id: Date.now().toString(),
      author: "You",
      text,
      selectedText,
      resolved: false,
      replies: [],
    };

    setComments((prev) => [
      ...prev,
      newComment,
    ]);
  };

  const addReply = (
    id: string,
    reply: string
  ) => {

    setComments((prev) =>
      prev.map((comment) =>
        comment.id === id
          ? {
              ...comment,
              replies: [
                ...comment.replies,
                reply,
              ],
            }
          : comment
      )
    );

  };

  const resolveComment = (
    id: string
  ) => {

    setComments((prev) =>
      prev.map((comment) =>
        comment.id === id
          ? {
              ...comment,
              resolved: true,
            }
          : comment
      )
    );

  };

  return {

    comments,

    addComment,

    addReply,

    resolveComment,

  };
}
