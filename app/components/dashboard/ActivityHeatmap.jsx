import React, { useMemo } from "react";

function ActivityHeatmap({ activityDates }) {
  // Generate last 90 days
  const last90Days = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 89; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      dates.push(d);
    }
    return dates;
  }, []);

  // Map activity dates to a Set for O(1) lookup
  const activitySet = useMemo(() => new Set(activityDates), [activityDates]);

  // Helper to format date YYYY-MM-DD
  const formatDate = (date) => date.toISOString().split("T")[0];

  // Weekday labels to show on the left (Sun, Mon, Wed, Fri)
  const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const visibleWeekdayLabels = ["Sun", "Mon", "Wed", "Fri"];

  // Prepare weeks data (group dates by week starting on Sunday)
  // We want columns = weeks, rows = days (0=Sun to 6=Sat)
  const weeks = [];
  let currentWeek = [];
  let currentWeekStartDay = last90Days[0].getDay();
  // Pad first week with nulls if first day is not Sunday
  for (let i = 0; i < currentWeekStartDay; i++) {
    currentWeek.push(null);
  }
  last90Days.forEach((date) => {
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(date);
  });
  // Fill last week with nulls if needed
  while (currentWeek.length < 7) {
    currentWeek.push(null);
  }
  weeks.push(currentWeek);

  // Get month labels for top row
  // For each week, show the month label only once when the month changes
  const monthLabels = [];
  let lastMonth = null;
  weeks.forEach((week) => {
    // Find first non-null date in week
    const firstDate = week.find((d) => d !== null);
    if (firstDate) {
      const month = firstDate.toLocaleString("default", { month: "short" });
      if (month !== lastMonth) {
        monthLabels.push(month);
        lastMonth = month;
      } else {
        monthLabels.push("");
      }
    } else {
      monthLabels.push("");
    }
  });

  const totalContributions = activityDates.length;

  return (
    <div className="overflow-x-auto">
      <div className="flex scale-90 sm:scale-100">
        {/* Left column with month label row height and weekday labels */}
        <div className="flex flex-col">
          {/* Contributions circle at top-left corner */}
          <div className="w-5 h-5 mb-1 flex items-center justify-center">
            <div className="w-5 h-5 text-sm rounded-full flex items-center justify-center bg-green-500 text-white font-bold">
              {totalContributions}
            </div>
          </div>
          {/* Weekday labels column */}
          <div className="grid grid-rows-7 gap-1 mr-1 text-xs md:text-xs text-surface-500 dark:text-surface-400" style={{height: "168px"}}>
            {weekdayLabels.map((day, idx) =>
              visibleWeekdayLabels.includes(day) ? (
                <div key={day} className="h-6 md:h-6 flex items-center justify-end pr-1 text-[10px] md:text-xs">
                  {day}
                </div>
              ) : (
                <div key={day} className="h-6 md:h-6"></div>
              )
            )}
          </div>
        </div>
        <div>
          {/* Month labels row */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(24px,1fr))] gap-1 mb-1" style={{gridTemplateColumns: `repeat(${weeks.length}, 24px)`}}>
            {monthLabels.map((month, idx) => (
              <div key={idx} className="text-[10px] md:text-xs font-medium text-surface-600 dark:text-surface-300 text-center">
                {month}
              </div>
            ))}
          </div>
          {/* Heatmap grid */}
          <div className="grid grid-rows-7 grid-flow-col gap-1">
            {weeks.map((week, weekIdx) =>
              week.map((date, dayIdx) => {
                if (!date) {
                  return <div key={`${weekIdx}-${dayIdx}`} className="w-6 h-6"></div>;
                }
                const dateStr = formatDate(date);
                const isActive = activitySet.has(dateStr);
                return (
                  <div
                    key={`${weekIdx}-${dayIdx}`}
                    title={`${dateStr} - ${isActive ? "Active" : "No Activity"}`}
                    className={`w-6 h-6 rounded-sm transition-colors duration-300 ${
                      isActive
                        ? "bg-green-500"
                        : "bg-surface-200 dark:bg-surface-700"
                    }`}
                  ></div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivityHeatmap;
