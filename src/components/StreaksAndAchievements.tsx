import { Trophy } from "lucide-react";

interface Streak {
  name: string;
  current: number;
  best: number;
}

interface Achievement {
  icon: string;
  name: string;
  color: string;
}

interface StreaksAndAchievementsProps {
  streaks: Streak[];
  achievements: Achievement[];
}

export default function StreaksAndAchievements({
  streaks,
  achievements,
}: StreaksAndAchievementsProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold flex items-center mb-4">
        <Trophy size={18} className="mr-2" />
        Streaks & Achievements
      </h2>

      <div className="space-y-3">
        {streaks.map((streak, i) => (
          <div key={i} className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{streak.name}</h3>
              <p className="text-sm text-gray-600">
                Current streak: {streak.current} days
              </p>
            </div>
            <div className="flex items-center">
              <div className="w-12 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500"
                  style={{ width: `${(streak.current / streak.best) * 100}%` }}
                />
              </div>
              <span className="text-xs ml-1 text-gray-600">{streak.best}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t">
        <h3 className="font-medium mb-2">Recent Achievements</h3>
        <div className="flex flex-wrap gap-2">
          {achievements.map((achievement, i) => (
            <div key={i} className="flex flex-col items-center">
              <div
                className={`w-12 h-12 flex items-center justify-center ${achievement.color} rounded-full text-xl`}
              >
                {achievement.icon}
              </div>
              <span className="text-xs mt-1">{achievement.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
