import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import StreakCounter from "@/app/components/dashboard/StreakCounter";
import ActivityHeatmap from "@/app/components/dashboard/ActivityHeatmap";
import {ChartNoAxesCombined} from "lucide-react";

function ActivityDashboard({ userId }) {
  const [activityDates, setActivityDates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    async function fetchActivity() {
      setLoading(true);
      const { data, error } = await supabase
        .from("user_activity")
        .select("activity_date")
        .eq("user_id", userId);

      if (!error && data) {
        const dates = data.map(
          (item) => new Date(item.activity_date).toISOString().split("T")[0]
        );
        setActivityDates(dates);
      }
      setLoading(false);
    }

    fetchActivity();
  }, [userId]);

  if (loading) {
    return (
      <div className="card-surface p-4 text-surface-500 dark:text-surface-400">
        Loading activity...
      </div>
    );
  }

  return (
    <main className="card-surface p-4">
      <div className="flex items-center gap-2">
        <ChartNoAxesCombined className="text-surface-700 dark:text-surface-300"/>
        <h1 className="font-poppins text-lg text-surface-800 dark:text-surface-200">Your Stats</h1>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center md:gap-6">
        <StreakCounter activityDates={activityDates} />
        <ActivityHeatmap activityDates={activityDates} />
      </div>
    </main>
  );
}

export default ActivityDashboard;
