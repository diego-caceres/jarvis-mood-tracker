"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { formatDate } from "@/lib/utils";
import { Activity } from "@/types/activity";
import { getAllActivities } from "@/services/activityService";

// Interface for stored activity in localStorage
export interface StoredActivity {
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

// Using a centralized storage key for mood activities
const MOOD_ACTIVITIES_STORAGE_KEY = "moodActivities";

// Context type definition
interface MoodContextType {
  activities: StoredActivity[];
  addActivity: (activity: Activity, date: Date, notes?: string) => void;
  removeActivity: (id: string) => void;
  getActivitiesForDate: (date: Date) => StoredActivity[];
  getMoodScore: (date: Date) => number;
  availableActivities: Activity[];
  refreshAvailableActivities: () => void;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

interface MoodProviderProps {
  children: ReactNode;
}

// Helper function to load activities from localStorage
const loadActivitiesFromStorage = (): StoredActivity[] => {
  if (typeof window === "undefined") return [];

  try {
    const saved = localStorage.getItem(MOOD_ACTIVITIES_STORAGE_KEY);
    if (!saved) return [];

    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error loading mood activities:", error);
    return [];
  }
};

// Helper function to save activities to localStorage
const saveActivitiesToStorage = (activities: StoredActivity[]): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(
      MOOD_ACTIVITIES_STORAGE_KEY,
      JSON.stringify(activities)
    );
  } catch (error) {
    console.error("Error saving mood activities:", error);
  }
};

export const MoodProvider: React.FC<MoodProviderProps> = ({ children }) => {
  // To avoid hydration mismatch, always initialize with empty array
  const [activities, setActivities] = useState<StoredActivity[]>([]);
  const [availableActivities, setAvailableActivities] = useState<Activity[]>(
    []
  );

  // Add a client-side initialization indicator
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true when component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load data from localStorage once we're on the client
  useEffect(() => {
    if (isClient) {
      setActivities(loadActivitiesFromStorage());
      refreshAvailableActivities();
    }
  }, [isClient]);

  // Load all available activities (predefined and custom)
  // Using useCallback to prevent function recreation on each render
  const refreshAvailableActivities = React.useCallback(() => {
    if (typeof window === "undefined") return;

    const allActivities = getAllActivities();
    setAvailableActivities(allActivities);
  }, []);

  // Add a new activity (memoized with useCallback)
  const addActivity = React.useCallback(
    (activity: Activity, date: Date, notes?: string) => {
      const newActivity: StoredActivity = {
        id: `${activity.id}-${Date.now()}`,
        activityId: activity.id,
        name: activity.name,
        icon: activity.icon || "⭐",
        points: activity.points,
        category: activity.category,
        date: formatDate(date),
        timestamp: new Date().toISOString(),
        notes: notes?.trim(),
      };

      setActivities((prev) => {
        const updated = [...prev, newActivity];
        // Save directly to localStorage
        saveActivitiesToStorage(updated);
        return updated;
      });
    },
    []
  );

  // Remove an activity (memoized with useCallback)
  const removeActivity = React.useCallback((id: string) => {
    setActivities((prev) => {
      const updated = prev.filter((activity) => activity.id !== id);
      // Save directly to localStorage
      saveActivitiesToStorage(updated);
      return updated;
    });
  }, []);

  // Listen for localStorage changes from other tabs
  useEffect(() => {
    if (!isClient) return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === MOOD_ACTIVITIES_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setActivities(Array.isArray(parsed) ? parsed : []);
        } catch (error) {
          console.error("Error parsing localStorage changes:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [isClient]);

  // Get activities for a specific date (memoized)
  const getActivitiesForDate = React.useCallback(
    (date: Date) => {
      const dateString = formatDate(date);
      return activities.filter((activity) => activity.date === dateString);
    },
    [activities]
  );

  // Calculate total mood score for a date (memoized)
  const getMoodScore = React.useCallback(
    (date: Date) => {
      const dateString = formatDate(date);
      // Directly filter and reduce in one operation to avoid calling getActivitiesForDate
      return activities
        .filter((activity) => activity.date === dateString)
        .reduce((sum, activity) => sum + activity.points, 0);
    },
    [activities]
  );

  // Memoize the context value to prevent unnecessary re-renders
  const value = React.useMemo(
    () => ({
      activities,
      addActivity,
      removeActivity,
      getActivitiesForDate,
      getMoodScore,
      availableActivities,
      refreshAvailableActivities,
    }),
    [
      activities,
      addActivity,
      removeActivity,
      getActivitiesForDate,
      getMoodScore,
      availableActivities,
      refreshAvailableActivities,
    ]
  );

  return <MoodContext.Provider value={value}>{children}</MoodContext.Provider>;
};

// Custom hook to use the context
export const useMood = () => {
  const context = useContext(MoodContext);
  if (context === undefined) {
    throw new Error("useMood must be used within a MoodProvider");
  }
  return context;
};
