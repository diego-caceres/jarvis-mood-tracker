import { Calendar } from "lucide-react";

interface DayMood {
  date: Date;
  score: number;
}

interface MoodHistoryProps {
  days: DayMood[];
  view: "month" | "year";
  onViewChange: (view: "month" | "year") => void;
}

export default function MoodHistory({
  days,
  view,
  onViewChange,
}: MoodHistoryProps) {
  const getMoodColor = (score: number) => {
    if (score < -7) return "bg-red-700";
    if (score < -4) return "bg-red-500";
    if (score < -1) return "bg-red-300";
    if (score === 0) return "bg-gray-300";
    if (score < 2) return "bg-green-300";
    if (score < 5) return "bg-green-500";
    return "bg-green-700";
  };

  return (
    <div className="mb-6 bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold flex items-center">
          <Calendar size={18} className="mr-2" />
          Mood History
        </h2>
        <div className="flex text-sm">
          <button
            className={`px-2 py-1 rounded ${
              view === "month" ? "bg-indigo-100 text-indigo-800" : ""
            }`}
            onClick={() => onViewChange("month")}
          >
            Month
          </button>
          <button
            className={`px-2 py-1 rounded ml-1 ${
              view === "year" ? "bg-indigo-100 text-indigo-800" : ""
            }`}
            onClick={() => onViewChange("year")}
          >
            Year
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => (
          <div
            key={i}
            className={`w-full aspect-square rounded-sm ${getMoodColor(
              day.score
            )} cursor-pointer hover:ring-2 hover:ring-indigo-400`}
            title={`${day.date.toLocaleDateString()}: Score ${day.score}`}
          />
        ))}
      </div>

      <div className="flex items-center justify-end mt-2 text-xs text-gray-600">
        <span>Less</span>
        <div className="flex mx-1">
          {[700, 500, 300].map((shade) => (
            <div
              key={`red-${shade}`}
              className={`w-3 h-3 rounded-sm bg-red-${shade} mx-0.5`}
            />
          ))}
          <div className="w-3 h-3 rounded-sm bg-gray-300 mx-0.5" />
          {[300, 500, 700].map((shade) => (
            <div
              key={`green-${shade}`}
              className={`w-3 h-3 rounded-sm bg-green-${shade} mx-0.5`}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
