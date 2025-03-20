import { useState } from "react";
import { Activity, ActivityCategory, DailyActivity } from "@/types/activity";
import { predefinedActivities } from "@/data/activities";
import { formatDate } from "@/lib/utils";

interface MobileActivityInputProps {
  onActivitySubmit: (activity: DailyActivity) => void;
}

export default function MobileActivityInput({
  onActivitySubmit,
}: MobileActivityInputProps) {
  const [isOpen, setIsOpen] = useState(false);
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

    // Reset form and close panel
    setSelectedCategory(null);
    setSelectedActivity(null);
    setNotes("");
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 z-50"
      >
        +
      </button>

      {/* Slide-up Panel */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 z-40 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      >
        <div
          className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 transition-transform duration-300 ${
            isOpen ? "translate-y-0" : "translate-y-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Log Activity</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Log Activity
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
