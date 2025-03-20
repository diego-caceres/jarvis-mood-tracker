"use client";

import { useState, useEffect } from "react";
import { BarChart2, TrendingUp, Award } from "lucide-react";
import { useMood, StoredActivity } from "@/context/MoodContext";

interface DailyScore {
  date: string;
  score: number;
  displayDate: string;
}

interface CategoryStat {
  name: string;
  count: number;
  points: number;
}

interface ActivityStat {
  name: string;
  icon: string;
  count: number;
  points: number;
}

interface Stats {
  streak: number;
  bestStreak: number;
  totalActivities: number;
  averageScore: number;
  topActivities: ActivityStat[];
  topCategories: CategoryStat[];
}

export default function MoodInsights() {
  // Use our mood context
  const { activities } = useMood();

  // State for timeframe and stats
  const [timeframe, setTimeframe] = useState<"week" | "month" | "year">("week");
  const [stats, setStats] = useState<Stats>({
    streak: 0,
    bestStreak: 0,
    totalActivities: 0,
    averageScore: 0,
    topActivities: [],
    topCategories: [],
  });

  const [chartData, setChartData] = useState<DailyScore[]>([]);

  // Calculate stats whenever activities change
  useEffect(() => {
    if (activities.length > 0) {
      calculateStats(activities);
      const data = getChartData(activities, timeframe);
      setChartData(data);
    }
  }, [activities, timeframe]);

  // Calculate various statistics from activity data
  const calculateStats = (activitiesData: StoredActivity[]) => {
    if (!activitiesData.length) return;

    // Total activities
    const totalActivities = activitiesData.length;

    // Group activities by date
    const groupedByDate = activitiesData.reduce((acc, activity) => {
      if (!acc[activity.date]) {
        acc[activity.date] = [];
      }
      acc[activity.date].push(activity);
      return acc;
    }, {} as Record<string, StoredActivity[]>);

    // Calculate daily scores
    const dailyScores = Object.entries(groupedByDate)
      .map(([date, acts]) => {
        const score = acts.reduce((sum, a) => sum + a.points, 0);
        return { date, score };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Calculate streaks
    let tempStreak = 0;
    let bestStreak = 0;

    dailyScores.forEach((day) => {
      if (day.score > 0) {
        tempStreak++;
        bestStreak = Math.max(bestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    });

    // Check if current streak is active
    let currentStreak = 0;
    const recentDays = dailyScores.slice(-7);
    for (let i = recentDays.length - 1; i >= 0; i--) {
      if (recentDays[i].score > 0) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate average score
    const totalScore = dailyScores.reduce((sum, day) => sum + day.score, 0);
    const averageScore =
      dailyScores.length > 0 ? totalScore / dailyScores.length : 0;

    // Find top activities
    const activityCounts = activitiesData.reduce((acc, activity) => {
      const key = activity.name;
      if (!acc[key]) {
        acc[key] = {
          name: activity.name,
          icon: activity.icon,
          count: 0,
          points: 0,
        };
      }
      acc[key].count++;
      acc[key].points += activity.points;
      return acc;
    }, {} as Record<string, ActivityStat>);

    const topActivities = Object.values(activityCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Find top categories
    const categoryCounts = activitiesData.reduce((acc, activity) => {
      const key = activity.category;
      if (!acc[key]) {
        acc[key] = {
          name: key,
          count: 0,
          points: 0,
        };
      }
      acc[key].count++;
      acc[key].points += activity.points;
      return acc;
    }, {} as Record<string, CategoryStat>);

    const topCategories = Object.values(categoryCounts)
      .sort((a, b) => b.points - a.points)
      .slice(0, 3);

    setStats({
      streak: currentStreak,
      bestStreak,
      totalActivities,
      averageScore: parseFloat(averageScore.toFixed(1)),
      topActivities,
      topCategories,
    });
  };

  // Prepare chart data based on timeframe
  const getChartData = (
    activitiesData: StoredActivity[],
    currentTimeframe: "week" | "month" | "year"
  ): DailyScore[] => {
    if (!activitiesData.length) return [];

    // Group activities by date
    const groupedByDate = activitiesData.reduce((acc, activity) => {
      if (!acc[activity.date]) {
        acc[activity.date] = [];
      }
      acc[activity.date].push(activity);
      return acc;
    }, {} as Record<string, StoredActivity[]>);

    // Calculate daily scores
    let dailyScores = Object.entries(groupedByDate)
      .map(([date, acts]) => {
        const score = acts.reduce((sum, a) => sum + a.points, 0);
        return { date, score };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Filter based on timeframe
    const now = new Date();
    if (currentTimeframe === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      dailyScores = dailyScores.filter((day) => new Date(day.date) >= weekAgo);
    } else if (currentTimeframe === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      dailyScores = dailyScores.filter((day) => new Date(day.date) >= monthAgo);
    } else {
      // year - limit to last 365 days
      const yearAgo = new Date();
      yearAgo.setFullYear(yearAgo.getFullYear() - 1);
      dailyScores = dailyScores.filter((day) => new Date(day.date) >= yearAgo);
    }

    // Format dates for display
    return dailyScores.map((day) => ({
      ...day,
      displayDate: new Date(day.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    }));
  };

  // Create a line chart using divs (since we can't use chart libraries directly)
  const renderChart = () => {
    if (chartData.length === 0) {
      return (
        <div className="h-40 flex items-center justify-center text-gray-500">
          No data available for this time period
        </div>
      );
    }

    const maxScore = Math.max(...chartData.map((d) => d.score), 5);
    const minScore = Math.min(...chartData.map((d) => d.score), -5);
    const range = Math.max(maxScore - minScore, 10);

    return (
      <div className="relative h-40 mt-4">
        {/* Horizontal zero line */}
        <div
          className="absolute left-0 right-0 border-t border-gray-300"
          style={{ top: "50%" }}
        ></div>

        {/* Points and lines */}
        <div className="flex h-full items-end justify-between">
          {chartData.map((day, index) => {
            const heightPercentage = ((day.score - minScore) / range) * 100;
            const isPositive = day.score >= 0;

            return (
              <div key={index} className="flex flex-col items-center w-full">
                {/* Data point */}
                <div
                  className={`w-2 h-2 rounded-full ${
                    isPositive ? "bg-green-500" : "bg-red-500"
                  } z-10`}
                  style={{
                    marginBottom: `calc(${heightPercentage}% - 4px)`,
                  }}
                ></div>

                {/* Bar */}
                <div
                  className={`w-1 ${
                    isPositive ? "bg-green-400" : "bg-red-400"
                  }`}
                  style={{
                    height: `${(Math.abs(day.score) / range) * 100}%`,
                    marginTop: isPositive ? "auto" : 0,
                    marginBottom: isPositive ? 0 : "auto",
                  }}
                ></div>

                {/* X-axis label */}
                <div
                  className="text-xs text-gray-500 mt-1 truncate"
                  style={{ fontSize: "0.65rem" }}
                >
                  {day.displayDate}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <TrendingUp className="mr-2" size={20} />
          Mood Insights
        </h2>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-indigo-50 p-3 rounded-lg">
          <div className="text-sm text-indigo-700 mb-1">Current Streak</div>
          <div className="text-2xl font-bold flex items-end">
            {stats.streak}{" "}
            <span className="text-sm ml-1 text-gray-500">days</span>
          </div>
        </div>

        <div className="bg-green-50 p-3 rounded-lg">
          <div className="text-sm text-green-700 mb-1">Best Streak</div>
          <div className="text-2xl font-bold flex items-end">
            {stats.bestStreak}{" "}
            <span className="text-sm ml-1 text-gray-500">days</span>
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-sm text-blue-700 mb-1">Total Activities</div>
          <div className="text-2xl font-bold">{stats.totalActivities}</div>
        </div>

        <div className="bg-purple-50 p-3 rounded-lg">
          <div className="text-sm text-purple-700 mb-1">Avg. Daily Score</div>
          <div className="text-2xl font-bold">{stats.averageScore}</div>
        </div>
      </div>

      {/* Mood trend chart */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium flex items-center">
            <BarChart2 size={18} className="mr-2" />
            Mood Trend
          </h3>
          <div className="flex bg-gray-100 rounded-md overflow-hidden">
            <button
              className={`px-3 py-1 text-sm ${
                timeframe === "week"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600"
              }`}
              onClick={() => setTimeframe("week")}
            >
              Week
            </button>
            <button
              className={`px-3 py-1 text-sm ${
                timeframe === "month"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600"
              }`}
              onClick={() => setTimeframe("month")}
            >
              Month
            </button>
            <button
              className={`px-3 py-1 text-sm ${
                timeframe === "year"
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600"
              }`}
              onClick={() => setTimeframe("year")}
            >
              Year
            </button>
          </div>
        </div>

        {/* Simple chart visualization */}
        {renderChart()}
      </div>

      {/* Top activities and categories */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-3">Top Activities</h3>
          <div className="space-y-2">
            {stats.topActivities.length > 0 ? (
              stats.topActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 p-2 rounded"
                >
                  <div className="flex items-center">
                    <span className="text-xl mr-2">{activity.icon}</span>
                    <span>{activity.name}</span>
                  </div>
                  <span className="text-gray-600">{activity.count}×</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">
                No activities recorded yet.
              </p>
            )}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-3">Top Categories</h3>
          <div className="space-y-3">
            {stats.topCategories.length > 0 ? (
              stats.topCategories.map((category, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{category.name}</span>
                    <span
                      className={
                        category.points >= 0 ? "text-green-600" : "text-red-600"
                      }
                    >
                      {category.points > 0
                        ? `+${category.points}`
                        : category.points}{" "}
                      points
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        category.points >= 0 ? "bg-green-500" : "bg-red-500"
                      }`}
                      style={{
                        width: `${Math.min(
                          100,
                          Math.abs(category.points) * 2
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">
                No categories recorded yet.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Achievements section */}
      <div className="mt-6 pt-4 border-t">
        <h3 className="font-medium flex items-center mb-3">
          <Award size={18} className="mr-2" />
          Achievements
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div
            className={`p-3 rounded-lg text-center ${
              stats.streak >= 3
                ? "bg-yellow-100 border border-yellow-200"
                : "bg-gray-100 border border-gray-200"
            }`}
          >
            <div className="text-2xl mb-1">🔥</div>
            <div className="font-medium">3-Day Streak</div>
            <div className="text-xs text-gray-500">
              {stats.streak >= 3 ? "Unlocked" : `${stats.streak}/3 days`}
            </div>
          </div>

          <div
            className={`p-3 rounded-lg text-center ${
              stats.streak >= 7
                ? "bg-yellow-100 border border-yellow-200"
                : "bg-gray-100 border border-gray-200"
            }`}
          >
            <div className="text-2xl mb-1">🌟</div>
            <div className="font-medium">Week Warrior</div>
            <div className="text-xs text-gray-500">
              {stats.streak >= 7 ? "Unlocked" : `${stats.streak}/7 days`}
            </div>
          </div>

          <div
            className={`p-3 rounded-lg text-center ${
              stats.totalActivities >= 10
                ? "bg-yellow-100 border border-yellow-200"
                : "bg-gray-100 border border-gray-200"
            }`}
          >
            <div className="text-2xl mb-1">🏆</div>
            <div className="font-medium">Getting Started</div>
            <div className="text-xs text-gray-500">
              {stats.totalActivities >= 10
                ? "Unlocked"
                : `${stats.totalActivities}/10 activities`}
            </div>
          </div>

          <div
            className={`p-3 rounded-lg text-center ${
              stats.totalActivities >= 30
                ? "bg-yellow-100 border border-yellow-200"
                : "bg-gray-100 border border-gray-200"
            }`}
          >
            <div className="text-2xl mb-1">🎯</div>
            <div className="font-medium">Consistent</div>
            <div className="text-xs text-gray-500">
              {stats.totalActivities >= 30
                ? "Unlocked"
                : `${stats.totalActivities}/30 activities`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
