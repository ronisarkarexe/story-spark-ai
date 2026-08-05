import { useMemo } from "react";
import { generateGlossary } from "../../utils/glossaryGenerator";

interface Props {
  story: string;
}

export default function StoryGlossary({
  story,
}: Props) {

  const glossary = useMemo(
    () => generateGlossary(story),
    [story]
  );

  const copyGlossary = () => {
    navigator.clipboard.writeText(
      glossary
        .map(
          (g) =>
            `${g.term} (${g.category}) - ${g.definition}`
        )
        .join("\n")
    );
  };

  return (

    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">

      <div className="flex justify-between items-center mb-5">

        <h2 className="text-xl font-bold">
          Story Glossary
        </h2>

        <button
          onClick={copyGlossary}
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Copy
        </button>

      </div>

      <div className="space-y-3">

        {glossary.map((item, index) => (

          <div
            key={index}
            className="rounded-lg border border-zinc-700 p-4"
          >

            <h3 className="font-semibold">
              {item.term}
            </h3>

            <span className="text-sm text-blue-400">
              {item.category}
            </span>

            <p className="mt-2 text-gray-300">
              {item.definition}
            </p>

          </div>

        ))}

      </div>

    </div>

  );
}