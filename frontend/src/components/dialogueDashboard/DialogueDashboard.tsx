import useDialogueDistribution from "../../hooks/useDialogueDistribution";

export default function DialogueDashboard() {
  const data = useDialogueDistribution();

  return (
    <div className="max-w-3xl mx-auto rounded-lg border bg-white shadow p-6">
      <h2 className="text-2xl font-bold mb-6">
        Dialogue Distribution Dashboard
      </h2>

      {data.map((character) => (
        <div key={character.name} className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="font-semibold">
              {character.name}
            </span>

            <span>{character.percentage}%</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-600 h-4 rounded-full"
              style={{
                width: `${character.percentage}%`,
              }}
            />
          </div>

          <p className="mt-2 text-sm text-gray-600">
            Dialogue Lines: {character.lines}
          </p>

          {character.percentage < 10 && (
            <p className="text-red-600 text-sm font-medium mt-1">
              Underutilized Character
            </p>
          )}
        </div>
      ))}
    </div>
  );
}