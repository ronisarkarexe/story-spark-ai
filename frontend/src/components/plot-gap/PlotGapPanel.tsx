import { useMemo } from "react";
import { analyzePlotGaps } from "../../utils/plotGapAnalyzer";

interface Props {
  story: string;
}

export default function PlotGapPanel({ story }: Props) {

  const gaps = useMemo(() => {
    return analyzePlotGaps(story);
  }, [story]);

  return (

    <div className="rounded-xl border bg-zinc-900 p-6">

      <h2 className="text-xl font-bold mb-5">
        Plot Gap Detector
      </h2>

      {gaps.map(gap => (

        <div
          key={gap.id}
          className="border rounded-lg p-4 mb-4 bg-zinc-800"
        >

          <div className="flex justify-between">

            <h3 className="font-semibold">
              {gap.type}
            </h3>

            <span className="text-sm">
              {gap.severity}
            </span>

          </div>

          <p className="mt-2 text-sm">
            {gap.description}
          </p>

          <div className="mt-3 text-green-400 text-sm">

            Suggestion:
            <br />

            {gap.suggestion}

          </div>

        </div>

      ))}

    </div>

  );

}