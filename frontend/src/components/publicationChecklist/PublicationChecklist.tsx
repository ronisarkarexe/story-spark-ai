import { useState } from "react";
import usePublicationChecklist from "../../hooks/usePublicationChecklist";

export default function PublicationChecklist() {
  const [refresh, setRefresh] = useState(0);
  const checklist = usePublicationChecklist();

  return (
    <div className="max-w-4xl mx-auto p-6 rounded-lg border bg-white shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          Story Publication Checklist
        </h2>

        <button
          onClick={() => setRefresh(refresh + 1)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Run Validation
        </button>
      </div>

      {checklist.map((item) => (
        <div
          key={item.id}
          className="border rounded-lg p-4 mb-4"
        >
          <div className="flex justify-between">
            <h3 className="font-semibold">
              {item.title}
            </h3>

            <span
              className={
                item.passed
                  ? "text-green-600 font-semibold"
                  : "text-red-600 font-semibold"
              }
            >
              {item.passed ? "PASS" : "FAIL"}
            </span>
          </div>

          <p className="text-gray-600 mt-2">
            {item.recommendation}
          </p>
        </div>
      ))}

      <div className="mt-6 p-4 rounded bg-gray-100">
        <h3 className="font-semibold mb-2">
          Publishing Status
        </h3>

        <p>
          {
            checklist.filter((item) => item.passed).length
          }{" "}
          / {checklist.length} checks passed
        </p>
      </div>
    </div>
  );
}