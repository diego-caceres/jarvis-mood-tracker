import { BarChart2 } from "lucide-react";

interface CategoryStat {
  name: string;
  points: number;
  percentage: number;
}

interface TopActivity {
  icon: string;
  name: string;
  count: number;
}

interface StatsSummaryProps {
  categories: CategoryStat[];
  topActivities: TopActivity[];
}

export default function StatsSummary({
  categories,
  topActivities,
}: StatsSummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold flex items-center mb-4">
        <BarChart2 size={18} className="mr-2" />
        Stats Summary
      </h2>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">
            CATEGORY BREAKDOWN
          </h3>
          <div className="space-y-2">
            {categories.map((category, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{category.name}</span>
                  <span
                    className={`font-medium ${
                      category.points >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {category.points >= 0
                      ? `+${category.points}`
                      : category.points}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      category.points >= 0 ? "bg-green-500" : "bg-red-500"
                    }`}
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">
            TOP ACTIVITIES
          </h3>
          <ul className="space-y-1">
            {topActivities.map((activity, i) => (
              <li key={i} className="flex justify-between items-center">
                <span className="flex items-center">
                  <span className="mr-2">{activity.icon}</span> {activity.name}
                </span>
                <span className="text-green-600">{activity.count} times</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
