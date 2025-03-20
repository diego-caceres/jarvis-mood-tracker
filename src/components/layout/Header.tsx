import { Settings } from "lucide-react";

interface HeaderProps {
  onManageActivities?: () => void;
}

export default function Header({ onManageActivities }: HeaderProps) {
  return (
    <header className="bg-indigo-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">MoodTracker</h1>
        <div className="flex gap-2">
          {onManageActivities && (
            <button
              onClick={onManageActivities}
              className="p-2 rounded-full hover:bg-indigo-500 flex items-center"
              title="Manage Custom Activities"
            >
              <Settings size={20} />
              <span className="ml-2 hidden md:inline">Manage Activities</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
