import useWritingStyleComparison from "../../hooks/useWritingStyleComparison";

interface Story {
  title: string;
  content: string;
}

interface Props {
  stories: Story[];
}

export default function WritingStyleComparison({
  stories,
}: Props) {
  const metrics =
    useWritingStyleComparison(stories);

  return (
    <div className="p-5 rounded-lg border shadow">

      <h2 className="text-xl font-bold mb-4">
        Writing Style Comparison
      </h2>

      <table className="w-full border-collapse">

        <thead>

          <tr className="border-b">

            <th className="text-left p-2">Story</th>
            <th className="p-2">Words</th>
            <th className="p-2">Avg Sentence</th>
            <th className="p-2">Dialogue</th>
            <th className="p-2">Readability</th>

          </tr>

        </thead>

        <tbody>

          {metrics.map((item) => (
            <tr
              key={item.title}
              className="border-b"
            >
              <td className="p-2">
                {item.title}
              </td>

              <td className="text-center">
                {item.wordCount}
              </td>

              <td className="text-center">
                {item.avgSentenceLength}
              </td>

              <td className="text-center">
                {item.dialogueCount}
              </td>

              <td className="text-center">
                {item.readability}%
              </td>
            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}