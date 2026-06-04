import { FC } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  topics: Record<string, number>;
}

const TopicsChart: FC<Props> = ({ topics }) => {
  const labels = Object.keys(topics);
  const values = Object.values(topics);

  const chartData: ChartData<"bar", number[], string> = {
    labels,
    datasets: [
      {
        label: "Posts per Topic",
        data: values,
        backgroundColor: "rgba(103, 58, 183, 0.7)",
        borderColor: "rgba(103, 58, 183, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Posts by Topic",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div
      style={{ position: "relative", height: "300px", width: "100%" }}
      className="min-w-0 overflow-hidden rounded-lg bg-blue-500/10 p-4 shadow-md"
    >
      <Bar data={chartData} options={options} key={JSON.stringify(topics)} />
    </div>
  );
};

export default TopicsChart;
