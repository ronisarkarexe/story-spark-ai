import { useState } from "react";
import useStoryMetadata from "../../hooks/useStoryMetadata";
import { validateMetadata } from "../../utils/storyMetadata";

export default function StoryMetadataEditor() {
  const { metadata, updateField } = useStoryMetadata();
  const [isSuggestingTitle, setIsSuggestingTitle] = useState(false);
  const [suggestedTitles, setSuggestedTitles] = useState<string[]>([]);

  const mockSuggestTitles = async (): Promise<string[]> =>
    new Promise((resolve) => {
      window.setTimeout(
        () => resolve(["The Silent Echo", "Whispers of the Wind", "Neon Horizons"]),
        2000,
      );
    });

  const handleSuggestTitle = async () => {
    setIsSuggestingTitle(true);
    try {
      setSuggestedTitles(await mockSuggestTitles());
    } finally {
      setIsSuggestingTitle(false);
    }
  };

  const status = validateMetadata(metadata);

  const fields = [
    ["title", "Story Title"],
    ["subtitle", "Subtitle"],
    ["description", "Description"],
    ["genre", "Genre"],
    ["themes", "Themes"],
    ["audience", "Target Audience"],
    ["keywords", "Keywords"],
    ["readingTime", "Estimated Reading Time"],
    ["tags", "Custom Tags"],
  ];

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow border p-6">
      <h2 className="text-2xl font-bold mb-6">
        Story Metadata Editor
      </h2>

      {fields.map(([key, label]) => (
        <div className="mb-4" key={key}>
          <label className="block font-medium mb-2">
            {label}
          </label>

          {key === "title" ? (
            <>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={metadata[key as keyof typeof metadata]}
                  onChange={(e) =>
                    updateField(
                      key as keyof typeof metadata,
                      e.target.value
                    )
                  }
                  className="min-w-0 flex-1 border rounded-lg p-2"
                />
                <button
                  type="button"
                  onClick={handleSuggestTitle}
                  disabled={isSuggestingTitle}
                  className="shrink-0 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSuggestingTitle ? "Suggesting..." : "Suggest Title"}
                </button>
              </div>
              {suggestedTitles.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {suggestedTitles.map((title) => (
                    <button
                      key={title}
                      type="button"
                      onClick={() => {
                        updateField("title", title);
                        setSuggestedTitles([]);
                      }}
                      className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-700 hover:bg-blue-100"
                    >
                      {title}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <input
              type="text"
              value={metadata[key as keyof typeof metadata]}
              onChange={(e) =>
                updateField(
                  key as keyof typeof metadata,
                  e.target.value
                )
              }
              className="w-full border rounded-lg p-2"
            />
          )}
        </div>
      ))}

      <div className="mt-6 p-4 rounded bg-gray-100">
        <h3 className="font-semibold mb-3">
          Metadata Preview
        </h3>

        <p>
          <strong>Title:</strong> {metadata.title || "-"}
        </p>

        <p>
          <strong>Genre:</strong> {metadata.genre || "-"}
        </p>

        <p>
          <strong>Audience:</strong> {metadata.audience || "-"}
        </p>

        <p>
          <strong>Reading Time:</strong>{" "}
          {metadata.readingTime || "-"}
        </p>

        <p>
          <strong>Tags:</strong> {metadata.tags || "-"}
        </p>

        <div className="mt-4">
          {status.valid ? (
            <span className="text-green-600 font-medium">
              ✓ Metadata Complete
            </span>
          ) : (
            <span className="text-red-600 font-medium">
              Required fields are missing
            </span>
          )}
        </div>
      </div>
    </div>
  );
}