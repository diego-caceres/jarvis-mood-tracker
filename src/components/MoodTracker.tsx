import { useState, useEffect } from "react";
import { Calendar, PlusCircle, X } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Activity } from "@/types/activity";
import { predefinedActivities } from "@/data/activities";

// Interface for stored activity in localStorage
interface StoredActivity {
  id: string;
  activityId: string;
  name: string;
  icon: string;
  points: number;
  category: string;
  date: string;
  timestamp: string;
  notes?: string;
}

export default function MoodTracker() {
  // State for the current date and displayed date
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // State for activities and mood data
  const [activities, setActivities] = useState<StoredActivity[]>([]);

  // State for quick add mode
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  // Common activities for quick add
  const quickAddActivities = [
    {
      id: "exercise",
      name: "Exercise",
      icon: "🏃‍♂️",
      points: 5,
      category: "Exercise",
    },
    {
      id: "reading",
      name: "Reading",
      icon: "📚",
      points: 3,
      category: "Hobbies",
    },
    {
      id: "meditation",
      name: "Meditation",
      icon: "🧘‍♂️",
      points: 3,
      category: "Personal Growth",
    },
    { id: "work", name: "Work", icon: "💼", points: 2, category: "Work" },
    {
      id: "surfing",
      name: "Surfing",
      icon: "🏄‍♂️",
      points: 5,
      category: "Hobbies",
    },
    {
      id: "fast-food",
      name: "Fast Food",
      icon: "🍔",
      points: -3,
      category: "Food",
    },
  ];

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("moodActivities");
      const savedActivities = saved ? JSON.parse(saved) : [];
      setActivities(savedActivities);
    }
  }, []);

  // Save to localStorage whenever activities change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("moodActivities", JSON.stringify(activities));
    }
  }, [activities]);

  // Handle adding a new activity
  const handleAddActivity = (activity: any) => {
    const newActivity = {
      id: `${activity.id}-${Date.now()}`,
      activityId: activity.id,
      name: activity.name,
      icon: activity.icon,
      points: activity.points,
      category: activity.category,
      date: formatDate(selectedDate),
      timestamp: new Date().toISOString(),
    };

    setActivities([...activities, newActivity]);
    setIsQuickAddOpen(false);
  };

  // Get activities for the selected date
  const getActivitiesForDate = (date: Date) => {
    const dateString = formatDate(date);
    return activities.filter((activity) => activity.date === dateString);
  };

  // Calculate total mood score for a date
  const getMoodScore = (date: Date) => {
    const dateActivities = getActivitiesForDate(date);
    return dateActivities.reduce((sum, activity) => sum + activity.points, 0);
  };

  // Get mood color based on score
  const getMoodColor = (score: number) => {
    if (score >= 5) return "bg-green-500";
    if (score >= 2) return "bg-green-300";
    if (score >= 0) return "bg-yellow-300";
    if (score >= -2) return "bg-orange-300";
    return "bg-red-300";
  };

  // Generate grid of days for the current month
  const getDaysGrid = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = firstDay.getDay();

    // Create array for all days in the month
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    // Add cells for each day of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(today.getFullYear(), today.getMonth(), i);
      days.push(date);
    }

    return days;
  };

  const selectedDateActivities = getActivitiesForDate(selectedDate);
  const selectedDateScore = getMoodScore(selectedDate);
  const daysGrid = getDaysGrid();

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <Calendar className="mr-2" size={20} />
          Mood Tracker
        </h2>
      </div>

      {/* Month grid */}
      <div className="mb-6">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
            <div key={i} className="text-center text-sm text-gray-500">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {daysGrid.map((date, i) => (
            <div
              key={i}
              className={`aspect-square rounded-md flex items-center justify-center text-sm cursor-pointer ${
                date ? getMoodColor(getMoodScore(date)) : "bg-gray-100"
              } ${
                date && formatDate(date) === formatDate(new Date())
                  ? "ring-2 ring-indigo-500"
                  : ""
              } ${
                date && formatDate(date) === formatDate(selectedDate)
                  ? "ring-2 ring-offset-2 ring-indigo-500"
                  : ""
              }`}
              onClick={() => date && setSelectedDate(date)}
            >
              {date ? date.getDate() : ""}
            </div>
          ))}
        </div>
      </div>

      {/* Selected date details */}
      <div className="border-t pt-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </h3>
          <span
            className={`font-bold ${
              selectedDateScore >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {selectedDateScore > 0
              ? `+${selectedDateScore}`
              : selectedDateScore}
          </span>
        </div>

        {/* Activities for selected date */}
        <div className="space-y-2 mb-4">
          {selectedDateActivities.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No activities recorded for this day.
            </p>
          ) : (
            selectedDateActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between bg-gray-50 p-2 rounded"
              >
                <div className="flex items-center">
                  <span className="mr-2 text-xl">{activity.icon}</span>
                  <span>{activity.name}</span>
                </div>
                <span
                  className={`font-medium ${
                    activity.points >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {activity.points > 0
                    ? `+${activity.points}`
                    : activity.points}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Add activity button */}
        <button
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center justify-center"
          onClick={() => setIsQuickAddOpen(true)}
        >
          <PlusCircle size={18} className="mr-2" />
          Add Activity
        </button>
      </div>

      {/* Quick add panel */}
      {isQuickAddOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Add Activity</h3>
              <button onClick={() => setIsQuickAddOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {quickAddActivities.map((activity) => (
                <button
                  key={activity.id}
                  className={`p-3 rounded-lg border flex flex-col items-center ${
                    activity.points >= 0
                      ? "border-green-200 hover:bg-green-50"
                      : "border-red-200 hover:bg-red-50"
                  }`}
                  onClick={() => handleAddActivity(activity)}
                >
                  <span className="text-2xl mb-1">{activity.icon}</span>
                  <span className="font-medium">{activity.name}</span>
                  <span
                    className={`text-sm ${
                      activity.points >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {activity.points > 0
                      ? `+${activity.points}`
                      : activity.points}
                  </span>
                </button>
              ))}
            </div>

            <button
              className="w-full py-2 mt-2 text-gray-600 hover:text-gray-800"
              onClick={() => setIsQuickAddOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Stats summary */}
      <div className="border-t pt-4">
        <h3 className="font-medium mb-2">Today's Quick Stats</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-50 p-2 rounded">
            <div className="text-sm text-gray-500">Today's Score</div>
            <div
              className={`text-xl font-bold ${
                getMoodScore(new Date()) >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {getMoodScore(new Date()) > 0
                ? `+${getMoodScore(new Date())}`
                : getMoodScore(new Date())}
            </div>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <div className="text-sm text-gray-500">Activities Today</div>
            <div className="text-xl font-bold text-indigo-600">
              {getActivitiesForDate(new Date()).length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
