import { DailyMood, DailyActivity, Activity } from "@/types/activity";

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function getDateFromString(dateString: string): Date {
  return new Date(dateString);
}

export function getDaysInRange(startDate: Date, endDate: Date): string[] {
  const days: string[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    days.push(formatDate(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return days;
}

export function calculateDailyMood(
  activities: DailyActivity[],
  predefinedActivities: Activity[]
): DailyMood {
  const totalPoints = activities.reduce((sum, dailyActivity) => {
    const activity = predefinedActivities.find(
      (a) => a.id === dailyActivity.activityId
    );
    return sum + (activity?.points || 0);
  }, 0);

  return {
    date: activities[0]?.date || formatDate(new Date()),
    totalPoints,
    activities,
  };
}

export function getMoodColor(points: number): string {
  if (points >= 5) return "bg-green-500";
  if (points >= 2) return "bg-green-300";
  if (points >= 0) return "bg-yellow-300";
  if (points >= -2) return "bg-orange-300";
  return "bg-red-300";
}

export function calculateStreak(dailyMoods: DailyMood[]): number {
  let streak = 0;

  for (let i = dailyMoods.length - 1; i >= 0; i--) {
    const mood = dailyMoods[i];
    if (mood.totalPoints > 0) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export function calculateLevel(experience: number): number {
  return Math.floor(Math.sqrt(experience / 100)) + 1;
}

export function calculateExperienceForNextLevel(level: number): number {
  return Math.pow(level - 1, 2) * 100;
}
