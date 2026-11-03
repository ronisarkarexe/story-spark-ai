import useReadingResume from "../../hooks/useReadingResume";

interface Props {
  storyId: string;
}

export default function ReadingResume({
  storyId,
}: Props) {

  const {
    position,
    updatePosition,
    resetProgress,
  } = useReadingResume(storyId);

  return (
    <div className="p-5 rounded-lg border">

      <h2 className="text-xl font-bold mb-4">
        Reading Session Resume
      </h2>

      <p className="mb-3">
        Last Reading Position: {position}px
      </p>

      <input
        type="range"
        min={0}
        max={1000}
        value={position}
        onChange={(e) =>
          updatePosition(Number(e.target.value))
        }
        className="w-full"
      />

      <div className="mt-4 flex gap-3">

        <button
          onClick={() =>
            window.scrollTo({
              top: position,
              behavior: "smooth",
            })
          }
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Resume Reading
        </button>

        <button
          onClick={resetProgress}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Reset Progress
        </button>

      </div>
    </div>
  );
}