import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { analyzeEmotionJourney } from "../../utils/emotionAnalyzer";

interface Props {
  story: string;
}

export default function EmotionJourneyChart({ story }: Props) {
  const data = analyzeEmotionJourney(story);

  return (
    <div className="rounded-xl border p-5 mt-8">
      <h2 className="text-xl font-bold mb-5">
        Emotional Journey
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="4 4" />
          <XAxis dataKey="scene" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Line dataKey="joy" stroke="#22c55e" />
          <Line dataKey="fear" stroke="#ef4444" />
          <Line dataKey="sadness" stroke="#3b82f6" />
          <Line dataKey="anger" stroke="#f97316" />
          <Line dataKey="hope" stroke="#eab308" />
          <Line dataKey="suspense" stroke="#8b5cf6" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}