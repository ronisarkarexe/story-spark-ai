import type { ChecklistItem as ChecklistItemData } from "../../types/publishing";

interface ChecklistItemProps {
  item: ChecklistItemData;
}

export default function ChecklistItem({ item }: ChecklistItemProps) {
  return (
    <article className="mb-3 rounded-lg border p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold">{item.category}</h3>
        <span>{item.status}</span>
      </div>
      <p className="mt-2">{item.message}</p>
      {item.suggestion && <p className="mt-2 text-sm">{item.suggestion}</p>}
    </article>
  );
}
