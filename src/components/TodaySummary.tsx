import { PlusCircle } from "lucide-react";
import { Activity } from "@/types/activity";

interface TodaySummaryProps {
  score: number;
  recentActivities: Activity[];
  onAddClick: () => void;
}

export default function TodaySummary({
  score,
  recentActivities,
  onAddClick,
}: TodaySummaryProps) {
  return (
    <div className="mb-6 bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Today</h2>
        <span
          className={`text-2xl font-bold ${
            score >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {score >= 0 ? `+${score}` : score}
        </span>
      </div>
      <p className="text-gray-600 mb-2">
        {score > 0
          ? `You're having a good day! ${recentActivities.length} activities logged.`
          : score < 0
          ? "Keep your head up! Tomorrow is a new day."
          : "Start logging activities to track your mood!"}
      </p>

      <div className="flex flex-wrap gap-2 mt-3 mb-1">
        {recentActivities.slice(0, 4).map((activity) => (
          <button
            key={activity.id}
            className={`flex items-center px-3 py-1.5 rounded-full text-sm ${
              activity.score > 0
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <span className="mr-1">{activity.icon}</span>
            {activity.name}
          </button>
        ))}
        <button
          className="flex items-center px-3 py-1.5 rounded-full text-sm bg-gray-100 text-gray-800"
          onClick={onAddClick}
        >
          <PlusCircle size={16} className="mr-1" />
          Add
        </button>
      </div>
    </div>
  );
}
