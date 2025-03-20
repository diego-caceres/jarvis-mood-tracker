import { X } from "lucide-react";
import { Activity } from "@/types/activity";

interface QuickAddPanelProps {
  activities: Activity[];
  onClose: () => void;
  onActivitySelect: (activity: Activity) => void;
}

export default function QuickAddPanel({
  activities,
  onClose,
  onActivitySelect,
}: QuickAddPanelProps) {
  return (
    <div className="mb-6 bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium">Quick Add Activity</h3>
        <button onClick={onClose}>
          <X size={18} />
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {activities.map((activity) => (
          <button
            key={activity.id}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
              activity.score > 0
                ? "border-green-200 hover:bg-green-50"
                : "border-red-200 hover:bg-red-50"
            }`}
            onClick={() => onActivitySelect(activity)}
          >
            <span className="text-2xl mb-1">{activity.icon}</span>
            <span className="text-sm font-medium">{activity.name}</span>
            <span
              className={`text-xs mt-1 ${
                activity.score > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {activity.score > 0 ? `+${activity.score}` : activity.score}
            </span>
          </button>
        ))}
        <button className="flex flex-col items-center justify-center p-3 rounded-lg border border-dashed border-gray-300 hover:bg-gray-50">
          <span className="text-2xl mb-1">➕</span>
          <span className="text-sm font-medium">Create New</span>
        </button>
      </div>
    </div>
  );
}
