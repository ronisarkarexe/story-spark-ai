import React from "react";
import {
  getWritingStreak,
  getUnlockedAchievements,
  getNextAchievement,
  calculateAchievementProgress,
} from "./achievement.utils";

interface Props {
  totalStories: number;
}

const StoryAchievementDashboard: React.FC<Props> = ({
  totalStories,
}) => {
  const { currentStreak, longestStreak } = getWritingStreak();

  const achievements = getUnlockedAchievements(totalStories);

  const nextAchievement = getNextAchievement(totalStories);

  const progress = calculateAchievementProgress(totalStories);

  return (
    <div className="bg-slate-800 rounded-2xl p-5 shadow-lg text-white mt-6">
      {/* Header */}
      <h2 className="text-xl font-bold mb-4">
        🏆 Writing Achievements
      </h2>

      {/* Streak Section */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div className="bg-slate-700 p-3 rounded-xl text-center">
          <p className="text-2xl font-bold">
            🔥 {currentStreak}
          </p>
          <p className="text-sm text-slate-300">
            Current Streak
          </p>
        </div>

        <div className="bg-slate-700 p-3 rounded-xl text-center">
          <p className="text-2xl font-bold">
            ⭐ {longestStreak}
          </p>
          <p className="text-sm text-slate-300">
            Longest Streak
          </p>
        </div>
      </div>


      {/* Achievement Badges */}
      <div className="mb-5">
        <h3 className="font-semibold mb-2">
          Unlocked Badges
        </h3>

        {achievements.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {achievements.map((item) => (
              <div
                key={item.title}
                className="bg-green-600 px-3 py-2 rounded-lg"
              >
                <span className="text-xl">
                  {item.badge}
                </span>
                <p className="text-sm">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400">
            No achievements unlocked yet.
          </p>
        )}
      </div>


      {/* Next Achievement Progress */}
      {nextAchievement && (
        <div>
          <p className="mb-2">
            Next Achievement: 
            <span className="font-bold">
              {" "}
              {nextAchievement.badge}
              {nextAchievement.title}
            </span>
          </p>

          <div className="w-full bg-slate-700 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <p className="text-sm text-slate-400 mt-1">
            {totalStories} / {nextAchievement.target}
            {" "}stories completed
          </p>
        </div>
      )}

      {/* Completed All Achievements */}
      {!nextAchievement && (
        <div className="text-green-400 font-semibold">
          🎉 All achievements completed!
        </div>
      )}
    </div>
  );
};

export default StoryAchievementDashboard;