import { useState } from "react";
import useComments from "../../hooks/useComments";
import CommentCard from "./CommentCard";

export default function CommentsPanel() {
  const {
    comments,
    addComment,
    addReply,
    resolveComment,
  } = useComments();

  const [selectedText, setSelectedText] = useState("");
  const [comment, setComment] = useState("");

  const handleAddComment = () => {
    if (!comment.trim()) return;

    addComment(
      comment,
      selectedText || "Selected paragraph"
    );

    setComment("");
    setSelectedText("");
  };

  return (
    <div className="bg-white shadow rounded-lg p-5 mt-6">

      <h2 className="text-2xl font-bold mb-4">
        Story Collaboration Comments
      </h2>

      <input
        type="text"
        placeholder="Selected sentence..."
        value={selectedText}
        onChange={(e) =>
          setSelectedText(e.target.value)
        }
        className="border rounded w-full p-2 mb-3"
      />

      <textarea
        rows={4}
        placeholder="Write a comment..."
        value={comment}
        onChange={(e) =>
          setComment(e.target.value)
        }
        className="border rounded w-full p-2"
      />

      <button
        onClick={handleAddComment}
        className="mt-3 bg-blue-600 text-white px-5 py-2 rounded"
      >
        Add Comment
      </button>

      <div className="mt-6 space-y-4">
        {comments.length === 0 && (
          <p className="text-gray-500">
            No comments yet.
          </p>
        )}

        {comments.map((item) => (
          <CommentCard
            key={item.id}
            comment={item}
            onReply={addReply}
            onResolve={resolveComment}
          />
        ))}
      </div>

    </div>
  );
}