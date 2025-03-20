export type ActivityCategory =
  | "Food"
  | "Exercise"
  | "Hobbies"
  | "Obligations"
  | "Work"
  | "Personal Growth"
  | "Other";

export interface Activity {
  id: string;
  name: string;
  icon: string;
  category: ActivityCategory;
  points: number;
  description?: string;
}

export interface DailyActivity {
  id: string;
  activityId: string;
  date: string;
  notes?: string;
}

export interface DailyMood {
  date: string;
  totalPoints: number;
  activities: DailyActivity[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface UserStats {
  currentStreak: number;
  bestStreak: number;
  totalActivities: number;
  level: number;
  experience: number;
  achievements: Achievement[];
}
