import { UserStats } from "@/types/activity";
import { calculateExperienceForNextLevel } from "@/lib/utils";

interface StatsProps {
  stats: UserStats;
}

export default function Stats({ stats }: StatsProps) {
  const {
    currentStreak,
    bestStreak,
    totalActivities,
    level,
    experience,
    achievements,
  } = stats;
  const nextLevelExp = calculateExperienceForNextLevel(level);
  const progressToNextLevel = (experience / nextLevelExp) * 100;

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow">
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {currentStreak}
          </div>
          <div className="text-sm text-gray-600">Current Streak</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{bestStreak}</div>
          <div className="text-sm text-gray-600">Best Streak</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Level {level}</span>
          <span>
            {experience} / {nextLevelExp} XP
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${progressToNextLevel}%` }}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Recent Achievements</h3>
        <div className="grid grid-cols-2 gap-2">
          {achievements.slice(0, 4).map((achievement) => (
            <div
              key={achievement.id}
              className={`p-2 rounded-lg ${
                achievement.unlockedAt
                  ? "bg-yellow-50 border border-yellow-200"
                  : "bg-gray-50 border border-gray-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{achievement.icon}</span>
                <div>
                  <div className="text-sm font-medium">{achievement.name}</div>
                  <div className="text-xs text-gray-500">
                    {achievement.description}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center p-3 bg-purple-50 rounded-lg">
        <div className="text-2xl font-bold text-purple-600">
          {totalActivities}
        </div>
        <div className="text-sm text-gray-600">Total Activities Logged</div>
      </div>
    </div>
  );
}
