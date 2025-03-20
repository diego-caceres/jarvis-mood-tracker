// src/services/activityService.ts
import { Activity, ActivityCategory } from "@/types/activity";
import { predefinedActivities } from "@/data/activities";

/**
 * Gets all available activities by combining predefined and custom activities
 */
export function getAllActivities(): Activity[] {
  const customActivities = getCustomActivities();
  return [...predefinedActivities, ...customActivities];
}

/**
 * Gets custom activities from localStorage
 */
export function getCustomActivities(): Activity[] {
  if (typeof window === "undefined") return [];

  try {
    const saved = localStorage.getItem("customActivities");
    if (!saved) return [];

    // Parse the JSON and ensure it's an array
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];

    return parsed;
  } catch (error) {
    console.error("Error loading custom activities:", error);
    return [];
  }
}

/**
 * Saves a custom activity
 */
export function saveCustomActivity(activity: Activity): void {
  try {
    const activities = getCustomActivities();
    const existingIndex = activities.findIndex((a) => a.id === activity.id);

    if (existingIndex >= 0) {
      // Update existing activity
      activities[existingIndex] = activity;
    } else {
      // Add new activity
      activities.push(activity);
    }

    localStorage.setItem("customActivities", JSON.stringify(activities));
  } catch (error) {
    console.error("Error saving custom activity:", error);
  }
}

/**
 * Deletes a custom activity
 */
export function deleteCustomActivity(id: string): void {
  try {
    const activities = getCustomActivities();
    const filtered = activities.filter((a) => a.id !== id);
    localStorage.setItem("customActivities", JSON.stringify(filtered));
  } catch (error) {
    console.error("Error deleting custom activity:", error);
  }
}

/**
 * Gets all activity categories
 */
export function getAllCategories(): ActivityCategory[] {
  return [
    "Food",
    "Exercise",
    "Hobbies",
    "Obligations",
    "Work",
    "Personal Growth",
    "Other",
  ];
}

/**
 * Finds an activity by ID from all available activities
 */
export function findActivityById(id: string): Activity | undefined {
  return getAllActivities().find((a) => a.id === id);
}

/**
 * Gets suggested activities based on frequency and positive impact
 */
export function getSuggestedActivities(limit: number = 6): Activity[] {
  // Simple implementation - just returns some positive activities
  const allActivities = getAllActivities();

  return allActivities
    .filter((a) => a.points > 0)
    .sort((a, b) => b.points - a.points)
    .slice(0, limit);
}
