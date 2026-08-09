import { WorldRule } from "../../types/world";

interface Props {
  rule: WorldRule;
}

export default function WorldRuleCard({ rule }: Props) {

  return (

    <div className="border rounded-lg p-4 mb-4">

      <div className="flex justify-between">

        <h3 className="font-semibold">

          {rule.category}

        </h3>

        <span>{rule.status}</span>

      </div>

      <p className="mt-2">

        {rule.description}

      </p>

      <div className="mt-3 bg-gray-100 rounded p-3">

        <strong>Suggestion</strong>

        <p>{rule.suggestion}</p>

      </div>

      <div className="mt-4 flex gap-3">

        <button className="px-3 py-1 bg-blue-600 text-white rounded">

          Update Rule

        </button>

        <button className="px-3 py-1 bg-gray-200 rounded">

          Ignore

        </button>

      </div>

    </div>

  );

}