import { FC } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  perMonth: Record<string, number>;
}

const PostsPerMonthChart: FC<Props> = ({ perMonth }) => {
  const labels = Object.keys(perMonth);
  const values = Object.values(perMonth);

  const chartData: ChartData<"line", number[], string> = {
    labels,
    datasets: [
      {
        label: "Posts Per Month",
        data: values,
        borderColor: "#42a5f5",
        backgroundColor: "rgba(66, 165, 245, 0.5)",
        tension: 0.3,
        fill: true,
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
        text: "Monthly Posts Statistics",
      },
    },
  };

  return (
    <div style={{ position: "relative", height: "300px", width: "100%" }} className="min-w-0 overflow-hidden rounded-lg bg-blue-500/10 p-4 shadow-md">
      <Line data={chartData} options={options} key={JSON.stringify(perMonth)} />
    </div>
  );
};

export default PostsPerMonthChart;
