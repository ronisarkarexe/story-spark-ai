import { useState } from "react";
import useHookGenerator from "../../hooks/useHookGenerator";

interface Props {
  title: string;
  onSelect?: (hook: string) => void;
}

export default function HookGenerator({
  title,
  onSelect,
}: Props) {
  const [refresh, setRefresh] = useState(0);

  const hooks = useHookGenerator(title + refresh);

  return (
    <div className="rounded-lg border p-6 bg-white shadow">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold">
          AI Story Hook Generator
        </h2>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setRefresh(refresh + 1)}
        >
          Regenerate
        </button>
      </div>

      <div className="space-y-4">
        {hooks.map((item, index) => (
          <div
            key={index}
            className="border rounded-lg p-4"
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold text-blue-600">
                {item.style}
              </span>

              <button
                className="text-sm bg-green-600 text-white px-3 py-1 rounded"
                onClick={() => onSelect?.(item.hook)}
              >
                Insert
              </button>
            </div>

            <p className="mt-3">{item.hook}</p>
          </div>
        ))}
      </div>
    </div>
  );
}