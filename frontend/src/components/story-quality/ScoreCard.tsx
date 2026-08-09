import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function ScoreCard({ item }) {
  return (
    <div className="border rounded-xl p-5 shadow-sm">
      <div className="w-20 mx-auto">
        <CircularProgressbar
          value={item.score}
          text={`${item.score}`}
        />
      </div>

      <h3 className="font-bold mt-4 text-center">
        {item.category}
      </h3>

      <p className="text-sm mt-2">
        {item.feedback}
      </p>

      <div className="mt-3 text-blue-600 text-sm">
        💡 {item.suggestion}
      </div>
    </div>
  );
}