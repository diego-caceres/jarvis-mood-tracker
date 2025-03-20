// src/components/ActivityManager.tsx
import { useState, useEffect } from "react";
import { Activity, ActivityCategory } from "@/types/activity";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { getCustomActivities } from "@/services/activityService";

interface ActivityManagerProps {
  onClose: () => void;
}

export default function ActivityManager({ onClose }: ActivityManagerProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({
    name: "",
    category: "Other",
    points: 0,
    description: "",
  });

  // Predefined categories
  const categories: ActivityCategory[] = [
    "Food",
    "Exercise",
    "Hobbies",
    "Obligations",
    "Work",
    "Personal Growth",
    "Other",
  ];

  // Load custom activities from localStorage
  useEffect(() => {
    const customActivities = getCustomActivities();
    setActivities(customActivities);
  }, []);

  // Save activities to localStorage whenever they change
  useEffect(() => {
    if (activities.length > 0) {
      // Only save if there are activities to save
      localStorage.setItem("customActivities", JSON.stringify(activities));
    }
  }, [activities]);

  const handleCreateActivity = () => {
    if (!newActivity.name) return;

    const activity: Activity = {
      id: `custom-${Date.now()}`,
      name: newActivity.name,
      category: newActivity.category as ActivityCategory,
      points: newActivity.points || 0,
      description: newActivity.description,
      icon: getEmojiForCategory(newActivity.category as ActivityCategory), // Add an appropriate emoji
    };

    setActivities([...activities, activity]);
    setNewActivity({
      name: "",
      category: "Other",
      points: 0,
      description: "",
    });
  };

  // Helper function to generate an emoji based on category
  const getEmojiForCategory = (category: ActivityCategory): string => {
    switch (category) {
      case "Food":
        return "🍽️";
      case "Exercise":
        return "🏃‍♂️";
      case "Hobbies":
        return "🎨";
      case "Obligations":
        return "📝";
      case "Work":
        return "💼";
      case "Personal Growth":
        return "🌱";
      case "Other":
        return "⭐";
    }
  };

  const handleUpdateActivity = () => {
    if (!editingActivity || !editingActivity.name) return;

    setActivities(
      activities.map((activity) =>
        activity.id === editingActivity.id ? editingActivity : activity
      )
    );
    setEditingActivity(null);
  };

  const handleDeleteActivity = (id: string) => {
    setActivities(activities.filter((activity) => activity.id !== id));
  };

  const startEditing = (activity: Activity) => {
    setEditingActivity({ ...activity });
  };

  const cancelEditing = () => {
    setEditingActivity(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Manage Custom Activities</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* New Activity Form */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-3">Add New Activity</h3>
          <div className="space-y-3">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Activity Name
              </label>
              <input
                type="text"
                id="name"
                value={newActivity.name}
                onChange={(e) =>
                  setNewActivity({ ...newActivity, name: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="e.g., Hiking"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category
                </label>
                <select
                  id="category"
                  value={newActivity.category}
                  onChange={(e) =>
                    setNewActivity({
                      ...newActivity,
                      category: e.target.value as ActivityCategory,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="points"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mood Points
                </label>
                <input
                  type="number"
                  id="points"
                  value={newActivity.points}
                  onChange={(e) =>
                    setNewActivity({
                      ...newActivity,
                      points: parseInt(e.target.value) || 0,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="-5 to 5"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description (optional)
              </label>
              <textarea
                id="description"
                value={newActivity.description}
                onChange={(e) =>
                  setNewActivity({
                    ...newActivity,
                    description: e.target.value,
                  })
                }
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Brief description of the activity..."
              />
            </div>

            <button
              onClick={handleCreateActivity}
              disabled={!newActivity.name}
              className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Plus size={16} className="mr-2" />
              Add Activity
            </button>
          </div>
        </div>

        {/* Activity List */}
        <div>
          <h3 className="font-medium mb-3">Your Custom Activities</h3>
          {activities.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              You haven't created any custom activities yet.
            </p>
          ) : (
            <div className="space-y-3">
              {activities.map((activity) =>
                editingActivity && editingActivity.id === activity.id ? (
                  // Edit form
                  <div
                    key={activity.id}
                    className="p-3 bg-blue-50 rounded-lg border border-blue-200"
                  >
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Activity Name
                        </label>
                        <input
                          type="text"
                          value={editingActivity.name}
                          onChange={(e) =>
                            setEditingActivity({
                              ...editingActivity,
                              name: e.target.value,
                            })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Category
                          </label>
                          <select
                            value={editingActivity.category}
                            onChange={(e) =>
                              setEditingActivity({
                                ...editingActivity,
                                category: e.target.value as ActivityCategory,
                                icon: getEmojiForCategory(
                                  e.target.value as ActivityCategory
                                ),
                              })
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          >
                            {categories.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Mood Points
                          </label>
                          <input
                            type="number"
                            value={editingActivity.points}
                            onChange={(e) =>
                              setEditingActivity({
                                ...editingActivity,
                                points: parseInt(e.target.value) || 0,
                              })
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <textarea
                          value={editingActivity.description || ""}
                          onChange={(e) =>
                            setEditingActivity({
                              ...editingActivity,
                              description: e.target.value,
                            })
                          }
                          rows={2}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={handleUpdateActivity}
                          className="flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex-grow"
                        >
                          <Save size={16} className="mr-2" />
                          Save
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Activity display
                  <div
                    key={activity.id}
                    className="p-3 bg-white rounded-lg border border-gray-200 flex justify-between items-center"
                  >
                    <div>
                      <div className="flex items-center">
                        <span className="mr-2 text-xl">
                          {activity.icon || "⭐"}
                        </span>
                        <h4 className="font-medium">{activity.name}</h4>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 space-x-2">
                        <span className="bg-gray-100 px-2 py-0.5 rounded-full">
                          {activity.category}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full ${
                            activity.points > 0
                              ? "bg-green-100 text-green-800"
                              : activity.points < 0
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {activity.points > 0 ? "+" : ""}
                          {activity.points} pts
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEditing(activity)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteActivity(activity.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
