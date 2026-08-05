import usePreviewMode from "../../hooks/usePreviewMode";
import { formatPreview } from "../../utils/previewFormatter";

interface Props {
  title: string;
  author: string;
  content: string;
}

export default function PublishingPreview({
  title,
  author,
  content,
}: Props) {
  const { preview, togglePreview } = usePreviewMode();

  const story = formatPreview({
    title,
    author,
    content,
  });

  return (
    <div className="max-w-4xl mx-auto rounded-lg border p-6 shadow bg-white">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold">
          Story Publishing Preview
        </h2>

        <button
          onClick={togglePreview}
          className="px-4 py-2 rounded bg-blue-600 text-white"
        >
          {preview ? "Edit Mode" : "Preview Mode"}
        </button>
      </div>

      {!preview ? (
        <div>
          <h3 className="font-semibold text-lg mb-3">
            Editing View
          </h3>

          <textarea
            value={content}
            readOnly
            className="w-full h-64 border rounded p-3"
          />
        </div>
      ) : (
        <article className="prose max-w-none">
          <h1>{story.title}</h1>

          <p className="text-gray-500">
            By {story.author}
          </p>

          <hr className="my-5" />

          {story.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}

          <div className="mt-8 border-t pt-4 text-sm text-gray-500">
            Word Count: {story.wordCount}
          </div>
        </article>
      )}
    </div>
  );
}