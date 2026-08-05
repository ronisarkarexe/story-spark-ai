import { useState } from "react";

export default function CommentCard({
  comment,
  onReply,
  onResolve,
}: any) {

  const [reply, setReply] = useState("");

  return (

    <div className="border rounded-lg p-4">

      <div className="flex justify-between">

        <h3 className="font-semibold">
          {comment.author}
        </h3>

        {comment.resolved ? (
          <span className="text-green-600">
            Resolved
          </span>
        ) : (
          <button
            className="text-blue-600"
            onClick={() =>
              onResolve(comment.id)
            }
          >
            Resolve
          </button>
        )}

      </div>

      <p className="text-sm text-gray-500 mt-2">
        Selected:
        <strong>
          {" "}
          {comment.selectedText}
        </strong>
      </p>

      <p className="mt-2">
        {comment.text}
      </p>

      <div className="mt-3">

        {comment.replies.map(
          (reply: string, index: number) => (
            <div
              key={index}
              className="bg-gray-100 rounded p-2 mt-2"
            >
              {reply}
            </div>
          )
        )}

      </div>

      {!comment.resolved && (

        <div className="mt-3">

          <input
            value={reply}
            onChange={(e) =>
              setReply(e.target.value)
            }
            placeholder="Reply..."
            className="border rounded p-2 w-full"
          />

          <button
            className="mt-2 bg-green-600 text-white px-4 py-1 rounded"
            onClick={() => {
              if (!reply.trim()) return;

              onReply(comment.id, reply);

              setReply("");
            }}
          >
            Reply
          </button>

        </div>

      )}

    </div>

  );
}