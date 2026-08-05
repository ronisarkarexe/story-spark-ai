import { Revision } from "../../types/revision";

interface Props {
  revision: Revision;
  onRestore: (content: string) => void;
}

export default function TimelineCard({ revision, onRestore }: Props) {
  return (
    <div className="border rounded p-3 mb-3">
      <h3 className="font-semibold">{revision.summary}</h3>
      <p className="text-sm text-gray-500">{revision.timestamp}</p>

      <button
        onClick={() => onRestore(revision.content)}
        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
      >
        Restore
      </button>
    </div>
  );
}