import { useMemo } from "react";
import { analyzeGenres } from "../../utils/genreAnalyzer";

interface Props {
  story: string;
  genres: string[];
}

export default function GenreBalancePanel({
  story,
  genres,
}: Props) {

  const results = useMemo(() => {
    return analyzeGenres(story, genres);
  }, [story, genres]);

  return (

    <div className="rounded-xl border bg-zinc-900 p-6">

      <h2 className="text-xl font-bold mb-5">
        Genre Balance Analysis
      </h2>

      {results.map(result => (

        <div
          key={result.genre}
          className="mb-5"
        >

          <div className="flex justify-between">

            <span className="font-semibold">
              {result.genre}
            </span>

            <span>
              {result.score}%
            </span>

          </div>

          <div className="w-full h-3 rounded bg-zinc-700 mt-2">

            <div
              className="h-3 rounded bg-green-500"
              style={{
                width: `${result.score}%`,
              }}
            />

          </div>

          <p className="text-sm mt-2 text-zinc-300">
            {result.suggestion}
          </p>

        </div>

      ))}

    </div>

  );

}