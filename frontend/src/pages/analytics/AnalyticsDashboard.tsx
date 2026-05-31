import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Edit2, Check, X, Target, Award, TrendingUp } from "lucide-react";
import { useGetProfileInfoQuery, useUpdateWritingGoalsMutation } from "../../redux/apis/user.api";

// ─── LOCAL COMPONENT FOR PROGRESS RING ───
interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  colorClass?: string;
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  percentage,
  size = 80,
  strokeWidth = 6,
  colorClass = "text-indigo-600",
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (Math.min(percentage, 100) / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full transform -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        {/* Background Circle */}
        <circle
          className="text-gray-100"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress Circle */}
        <circle
          className={`${colorClass} transition-all duration-500 ease-out`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-700">
        {percentage}%
      </div>
    </div>
  );
};

// ─── MAIN ANALYTICS DASHBOARD VIEW ───
const AnalyticsDashboard: React.FC = () => {
  // Pulling profile data which holds posts logs and writing goals configuration matrix
  const { data: user, isLoading } = useGetProfileInfoQuery();
  const [updateWritingGoals, { isLoading: isUpdating }] = useUpdateWritingGoalsMutation();

  // Local state for editing goals modal/inline fields
  const [isEditing, setIsEditing] = useState(false);
  const [dailyGoalInput, setDailyGoalInput] = useState(500);
  const [weeklyGoalInput, setWeeklyGoalInput] = useState(2500);

  // Fallback metric calculations (mock variables matching your backend schema totals)
  // In a complete implementation, these numbers would come from your analytics.api query
  const wordsToday = user?.postsCount ? user.postsCount * 300 : 350; // Dynamic simulation lookup 
  const wordsThisWeek = user?.postsCount ? user.postsCount * 1200 : 1800;

  const dailyGoal = user?.writingGoals?.dailyWordCount || 500;
  const weeklyGoal = user?.writingGoals?.weeklyWordCount || 2500;

  const dailyPercentage = Math.round((wordsToday / dailyGoal) * 100) || 0;
  const weeklyPercentage = Math.round((wordsThisWeek / weeklyGoal) * 100) || 0;

  // Sync internal state inputs when user data updates safely
  useEffect(() => {
    if (user?.writingGoals) {
      setDailyGoalInput(user.writingGoals.dailyWordCount);
      setWeeklyGoalInput(user.writingGoals.weeklyWordCount);
    }
  }, [user]);

  // Trigger celebration micro-interactions when milestones are achieved
  useEffect(() => {
    if (dailyPercentage >= 100 || weeklyPercentage >= 100) {
      const duration = 2 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [dailyPercentage, weeklyPercentage]);

  const handleSaveGoals = async () => {
    try {
      await updateWritingGoals({
        writingGoals: {
          dailyWordCount: Number(dailyGoalInput),
          weeklyWordCount: Number(weeklyGoalInput),
        },
      }).unwrap();
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to persist updated writing targets:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Dashboard Header Element Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Writing Analytics</h1>
          <p className="text-gray-500 text-sm mt-0.5">Track your production parameters, streaks, and milestones.</p>
        </div>

        {/* Dynamic Edit / Toggle Button Control Layout */}
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 shadow-sm transition-all duration-200"
          >
            <Edit2 size={16} /> Set Target Goals
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveGoals}
              disabled={isUpdating}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-sm transition-all duration-200"
            >
              <Check size={16} /> Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all duration-200"
            >
              <X size={16} /> Cancel
            </button>
          </div>
        )}
      </div>

      {/* Inline Goal Editing Form Layout Frame */}
      {isEditing && (
        <div className="bg-indigo-50/50 border border-indigo-100/80 p-5 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 mb-1.5">Daily Target (Words)</label>
            <input
              type="number"
              value={dailyGoalInput}
              onChange={(e) => setDailyGoalInput(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full bg-white border border-gray-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-gray-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 mb-1.5">Weekly Target (Words)</label>
            <input
              type="number"
              value={weeklyGoalInput}
              onChange={(e) => setWeeklyGoalInput(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full bg-white border border-gray-200 px-3 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-gray-800"
            />
          </div>
        </div>
      )}

      {/* Primary Metrics Visualization Grid Dashboard Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Daily Goal Tracking Widget */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between relative overflow-hidden group">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-400">
              <Target size={18} className="text-indigo-500" />
              <span className="text-xs font-bold uppercase tracking-wider">Daily Objective</span>
            </div>
            <p className="text-3xl font-black text-gray-800 tracking-tight">
              {wordsToday} <span className="text-lg font-medium text-gray-400">/ {dailyGoal} words</span>
            </p>
            {dailyPercentage >= 100 ? (
              <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-full font-bold animate-pulse">
                <Award size={14} /> Daily Goal Met!
              </span>
            ) : (
              <p className="text-xs text-gray-400 font-medium">Keep writing to push this milestone envelope!</p>
            )}
          </div>
          <ProgressRing percentage={dailyPercentage} colorClass="text-indigo-600" />
        </div>

        {/* Weekly Goal Tracking Widget */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between relative overflow-hidden group">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-400">
              <TrendingUp size={18} className="text-emerald-500" />
              <span className="text-xs font-bold uppercase tracking-wider">Weekly Milestone</span>
            </div>
            <p className="text-3xl font-black text-gray-800 tracking-tight">
              {wordsThisWeek} <span className="text-lg font-medium text-gray-400">/ {weeklyGoal} words</span>
            </p>
            {weeklyPercentage >= 100 ? (
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-bold animate-pulse">
                <Award size={14} /> Weekly Streak Secure!
              </span>
            ) : (
              <p className="text-xs text-gray-400 font-medium">Accumulating targets over active publication grids.</p>
            )}
          </div>
          <ProgressRing percentage={weeklyPercentage} colorClass="text-emerald-500" />
        </div>

      </div>
    </div>
  );
};

export default AnalyticsDashboard;
