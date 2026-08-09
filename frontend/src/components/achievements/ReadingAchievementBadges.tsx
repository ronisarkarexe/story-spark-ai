import useReadingAchievements from "../../hooks/useReadingAchievements";

interface Props {
  storiesRead: number;
  genresRead: number;
  streak: number;
}

export default function ReadingAchievementBadges({
  storiesRead,
  genresRead,
  streak,
}: Props) {
  const badges = useReadingAchievements(
    storiesRead,
    genresRead,
    streak
  );

  return (
    <div className="rounded-lg border p-5 shadow bg-white">

      <h2 className="text-xl font-bold mb-4">
        Reading Achievement Badges
      </h2>

      <div className="grid grid-cols-2 gap-4">

        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`rounded-lg border p-4 ${
              badge.unlocked
                ? "bg-green-100 border-green-500"
                : "bg-gray-100 border-gray-300"
            }`}
          >
            <h3 className="font-semibold">
              {badge.title}
            </h3>

            <p className="text-sm mt-1">
              {badge.description}
            </p>

            <p className="mt-3 font-medium">
              {badge.unlocked
                ? "🏆 Unlocked"
                : "🔒 Locked"}
            </p>
          </div>
        ))}

      </div>

    </div>
  );
}