import { useState } from "react";
import { Activity, ActivityCategory, DailyActivity } from "@/types/activity";
import { predefinedActivities } from "@/data/activities";
import { formatDate } from "@/lib/utils";

interface ActivityInputProps {
  onActivitySubmit: (activity: DailyActivity) => void;
}

export default function ActivityInput({
  onActivitySubmit,
}: ActivityInputProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<ActivityCategory | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );
  const [notes, setNotes] = useState("");

  const categories = Array.from(
    new Set(predefinedActivities.map((a) => a.category))
  );

  const filteredActivities = selectedCategory
    ? predefinedActivities.filter((a) => a.category === selectedCategory)
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActivity) return;

    onActivitySubmit({
      id: crypto.randomUUID(),
      activityId: selectedActivity.id,
      date: formatDate(new Date()),
      notes: notes.trim() || undefined,
    });

    // Reset form
    setSelectedCategory(null);
    setSelectedActivity(null);
    setNotes("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-white rounded-lg shadow"
    >
      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700"
        >
          Category
        </label>
        <select
          id="category"
          value={selectedCategory || ""}
          onChange={(e) => {
            setSelectedCategory(e.target.value as ActivityCategory);
            setSelectedActivity(null);
          }}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {selectedCategory && (
        <div>
          <label
            htmlFor="activity"
            className="block text-sm font-medium text-gray-700"
          >
            Activity
          </label>
          <select
            id="activity"
            value={selectedActivity?.id || ""}
            onChange={(e) => {
              const activity = filteredActivities.find(
                (a) => a.id === e.target.value
              );
              setSelectedActivity(activity || null);
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select an activity</option>
            {filteredActivities.map((activity) => (
              <option key={activity.id} value={activity.id}>
                {activity.name} ({activity.points > 0 ? "+" : ""}
                {activity.points})
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700"
        >
          Notes (optional)
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Add any additional notes about this activity..."
        />
      </div>

      <button
        type="submit"
        disabled={!selectedActivity}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Log Activity
      </button>
    </form>
  );
}
