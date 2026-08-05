import StatsCard from "../components/statistics/StatsCard";

const stats = [
  { title: "Stories Read", value: 42 },
  { title: "Completed", value: 35 },
  { title: "Avg. Reading Time", value: "12 min" },
  { title: "Favorite Genre", value: "Fantasy" },
];

export default function ReadingStatistics() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        📊 Reading Statistics
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((item) => (
          <StatsCard
            key={item.title}
            title={item.title}
            value={item.value}
          />
        ))}
      </div>

      <div className="mt-10 rounded-xl border p-6">
        <h2 className="text-xl font-semibold mb-2">
          Weekly Activity
        </h2>

        <p className="text-gray-500">
          Chart will be added here in a future update.
        </p>
      </div>
    </div>
  );
}