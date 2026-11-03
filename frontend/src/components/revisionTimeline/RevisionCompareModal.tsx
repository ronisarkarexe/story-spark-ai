import { Revision } from "../../types/revision";

interface Props {
  oldRevision: Revision;
  newRevision: Revision;
}

export default function RevisionCompareModal({
  oldRevision,
  newRevision,
}: Props) {
  return (
    <div className="border rounded p-4 mt-4">
      <h2 className="font-bold mb-2">Compare Revisions</h2>

      <div className="grid grid-cols-2 gap-4">
        <pre>{oldRevision.content}</pre>
        <pre>{newRevision.content}</pre>
      </div>
    </div>
  );
}