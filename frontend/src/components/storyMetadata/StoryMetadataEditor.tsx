import useStoryMetadata from "../../hooks/useStoryMetadata";
import { validateMetadata } from "../../utils/storyMetadata";

export default function StoryMetadataEditor() {
  const { metadata, updateField } = useStoryMetadata();

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