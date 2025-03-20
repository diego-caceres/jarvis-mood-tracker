"use client";

import { useState } from "react";
import MoodGrid from "@/components/MoodGrid";
import ActivityInput from "@/components/ActivityInput";
import MobileActivityInput from "@/components/MobileActivityInput";
import Stats from "@/components/Stats";
import {
  DailyActivity,
  DailyMood,
  UserStats,
  Achievement,
} from "@/types/activity";
import {
  calculateDailyMood,
  calculateStreak,
  calculateLevel,
} from "@/lib/utils";
import Header from "@/components/layout/Header";
import MobileNavigation from "@/components/layout/MobileNavigation";
import TodaySummary from "@/components/TodaySummary";
import QuickAddPanel from "@/components/QuickAddPanel";
import MoodHistory from "@/components/MoodHistory";
import StreaksAndAchievements from "@/components/StreaksAndAchievements";
import StatsSummary from "@/components/StatsSummary";
import { useMediaQuery } from "@/hooks/useMediaQuery";

// Mock data - replace with real data from your backend/state management
const mockData = {
  todayMood: 3,
  recentActivities: [
    { icon: "🏃‍♂️", name: "Running", timestamp: new Date() },
    { icon: "📚", name: "Reading", timestamp: new Date() },
  ],
  quickAddActivities: [
    { icon: "🏃‍♂️", name: "Exercise" },
    { icon: "📚", name: "Read" },
    { icon: "🎮", name: "Gaming" },
    { icon: "🎨", name: "Art" },
    { icon: "🧘‍♂️", name: "Meditate" },
    { icon: "💻", name: "Code" },
  ],
  moodHistory: Array(30)
    .fill(null)
    .map(() => ({
      date: new Date(),
      score: Math.floor(Math.random() * 15) - 7,
    })),
  streaks: [
    { name: "Exercise", current: 5, best: 10 },
    { name: "Reading", current: 3, best: 7 },
  ],
  achievements: [
    { icon: "🏃‍♂️", name: "Runner", color: "bg-blue-100" },
    { icon: "📚", name: "Bookworm", color: "bg-green-100" },
    { icon: "🎯", name: "Focused", color: "bg-purple-100" },
  ],
  categories: [
    { name: "Health", points: 15, percentage: 75 },
    { name: "Learning", points: 8, percentage: 40 },
    { name: "Social", points: -3, percentage: 15 },
  ],
  topActivities: [
    { icon: "🏃‍♂️", name: "Exercise", count: 12 },
    { icon: "📚", name: "Reading", count: 8 },
    { icon: "🎮", name: "Gaming", count: 5 },
  ],
};

export default function Home() {
  const [dailyActivities, setDailyActivities] = useState<DailyActivity[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    currentStreak: 0,
    bestStreak: 0,
    totalActivities: 0,
    level: 1,
    experience: 0,
    achievements: [
      {
        id: "first-activity",
        name: "First Activity",
        description: "Log your first activity",
        icon: "🎯",
      },
      {
        id: "week-streak",
        name: "Week Warrior",
        description: "Maintain a positive streak for 7 days",
        icon: "🔥",
      },
      {
        id: "month-streak",
        name: "Monthly Master",
        description: "Maintain a positive streak for 30 days",
        icon: "🌟",
      },
      {
        id: "hundred-activities",
        name: "Century Club",
        description: "Log 100 activities",
        icon: "🏆",
      },
    ],
  });
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [moodView, setMoodView] = useState<"month" | "year">("month");
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleActivitySubmit = (activity: DailyActivity) => {
    setDailyActivities((prev) => [...prev, activity]);

    // Update stats
    const updatedActivities = [...dailyActivities, activity];
    const dailyMoods = groupActivitiesByDate(updatedActivities);
    const currentStreak = calculateStreak(dailyMoods);

    setUserStats((prev) => ({
      ...prev,
      currentStreak,
      bestStreak: Math.max(prev.bestStreak, currentStreak),
      totalActivities: prev.totalActivities + 1,
      experience: prev.experience + 10, // 10 XP per activity
      level: calculateLevel(prev.experience + 10),
      achievements: updateAchievements(prev.achievements, {
        totalActivities: prev.totalActivities + 1,
        currentStreak,
      }),
    }));
  };

  const groupActivitiesByDate = (activities: DailyActivity[]): DailyMood[] => {
    const grouped = activities.reduce((acc, activity) => {
      if (!acc[activity.date]) {
        acc[activity.date] = [];
      }
      acc[activity.date].push(activity);
      return acc;
    }, {} as Record<string, DailyActivity[]>);

    return Object.entries(grouped).map(([date, activities]) => ({
      ...calculateDailyMood(activities, []),
      date,
    }));
  };

  const updateAchievements = (
    achievements: Achievement[],
    stats: { totalActivities: number; currentStreak: number }
  ): Achievement[] => {
    return achievements.map((achievement) => {
      if (achievement.unlockedAt) return achievement;

      let shouldUnlock = false;
      switch (achievement.id) {
        case "first-activity":
          shouldUnlock = stats.totalActivities >= 1;
          break;
        case "week-streak":
          shouldUnlock = stats.currentStreak >= 7;
          break;
        case "month-streak":
          shouldUnlock = stats.currentStreak >= 30;
          break;
        case "hundred-activities":
          shouldUnlock = stats.totalActivities >= 100;
          break;
      }

      if (shouldUnlock) {
        return {
          ...achievement,
          unlockedAt: new Date().toISOString(),
        };
      }
      return achievement;
    });
  };

  const dailyMoods = groupActivitiesByDate(dailyActivities);

  const handleActivitySelect = (activity: string) => {
    console.log("Selected activity:", activity);
    setShowQuickAdd(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-6">
          <TodaySummary
            moodScore={mockData.todayMood}
            recentActivities={mockData.recentActivities}
            onAddClick={() => setShowQuickAdd(true)}
          />

          <div className="grid md:grid-cols-2 gap-6">
            <MoodHistory
              days={mockData.moodHistory}
              view={moodView}
              onViewChange={setMoodView}
            />

            <div className="space-y-6">
              <StreaksAndAchievements
                streaks={mockData.streaks}
                achievements={mockData.achievements}
              />

              <StatsSummary
                categories={mockData.categories}
                topActivities={mockData.topActivities}
              />
            </div>
          </div>
        </div>
      </main>

      {isMobile && (
        <MobileNavigation onAddClick={() => setShowQuickAdd(true)} />
      )}

      {showQuickAdd && (
        <QuickAddPanel
          activities={mockData.quickAddActivities}
          onClose={() => setShowQuickAdd(false)}
          onActivitySelect={handleActivitySelect}
        />
      )}
    </div>
  );
}
