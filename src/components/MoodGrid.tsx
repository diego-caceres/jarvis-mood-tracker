import { DailyMood } from "@/types/activity";
import { getMoodColor } from "@/lib/utils";

interface MoodGridProps {
  moods: DailyMood[];
  daysToShow?: number;
}

export default function MoodGrid({ moods, daysToShow = 365 }: MoodGridProps) {
  const today = new Date();
  const startDate = new Date();
  startDate.setDate(today.getDate() - daysToShow);

  const moodMap = new Map(moods.map((mood) => [mood.date, mood.totalPoints]));

  const weeks = [];
  let currentWeek = [];
  const currentDate = new Date(startDate);

  while (currentDate <= today) {
    const dateStr = currentDate.toISOString().split("T")[0];
    const points = moodMap.get(dateStr) || 0;

    currentWeek.push({
      date: dateStr,
      points,
    });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-block min-w-full">
        <div className="grid grid-cols-7 gap-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`w-4 h-4 rounded-sm ${getMoodColor(day.points)}`}
                  title={`${day.date}: ${day.points} points`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
