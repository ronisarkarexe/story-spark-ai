import { NarrativeIssue } from "../../types/narrative";

interface Props {
  issue: NarrativeIssue;
}

export default function FlowIssueCard({
  issue,
}: Props) {

  return (

    <div className="border rounded-lg p-4 mb-4">

      <div className="flex justify-between">

        <h3 className="font-semibold">
          {issue.type}
        </h3>

        <span>
          {issue.severity}
        </span>

      </div>

      <p className="mt-2">
        {issue.explanation}
      </p>

      <div className="mt-3 bg-gray-100 rounded p-3">

        <strong>Suggestion</strong>

        <p>{issue.suggestion}</p>

      </div>

    </div>

  );

}