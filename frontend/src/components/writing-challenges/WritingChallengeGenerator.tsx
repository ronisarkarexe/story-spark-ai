import { useState } from "react";
import {
  generateChallenges,
  completeChallenge,
  earnedBadges,
} from "../../utils/writingChallengeGenerator";

export default function WritingChallengeGenerator() {
  const [challenges, setChallenges] =
    useState(generateChallenges());

  const badges = earnedBadges(challenges);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">

      <h2 className="text-2xl font-bold text-white mb-6">
        ✍️ AI Writing Challenges
      </h2>

      <div className="space-y-4">

        {challenges.map((challenge) => (
          <div
            key={challenge.id}
            className="rounded-lg border border-zinc-700 p-4"
          >
            <h3 className="text-lg font-semibold text-white">
              {challenge.title}
            </h3>

            <p className="text-gray-300 mt-2">
              {challenge.prompt}
            </p>

            <div className="mt-3 text-sm text-gray-400">
              <p>📚 Genre: {challenge.genre}</p>
              <p>📝 Word Limit: {challenge.wordLimit}</p>
              <p>📅 {challenge.type} Challenge</p>
            </div>

            {!challenge.completed ? (
              <button
                onClick={() =>
                  setChallenges((prev) =>
                    completeChallenge(prev, challenge.id)
                  )
                }
                className="mt-4 rounded bg-green-600 px-4 py-2 text-white"
              >
                Mark Complete
              </button>
            ) : (
              <span className="mt-4 inline-block text-green-400 font-semibold">
                ✅ Completed
              </span>
            )}
          </div>
        ))}

      </div>

      <div className="mt-8">

        <h3 className="text-lg font-semibold text-white mb-3">
          🏅 Badges
        </h3>

        {badges.length ? (
          <div className="flex flex-wrap gap-3">
            {badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full bg-indigo-600 px-4 py-2 text-white"
              >
                {badge}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">
            Complete challenges to earn badges.
          </p>
        )}

      </div>

    </div>
  );
}