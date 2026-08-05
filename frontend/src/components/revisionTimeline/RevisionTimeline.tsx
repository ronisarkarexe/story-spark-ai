import TimelineCard from "./TimelineCard";
import useRevisionTimeline from "../../hooks/useRevisionTimeline";

interface Props {
  story: string;
  onRestore: (content: string) => void;
}

export default function RevisionTimeline({
  story,
  onRestore,
}: Props) {
  const { revisions, saveRevision } = useRevisionTimeline();

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-3">Revision Timeline</h2>

      <button
        onClick={() => saveRevision(story)}
        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
      >
        Save Revision
      </button>

      {revisions.map((rev) => (
        <TimelineCard
          key={rev.id}
          revision={rev}
          onRestore={onRestore}
        />
      ))}
    </div>
  );
}