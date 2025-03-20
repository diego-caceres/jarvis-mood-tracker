import { Settings } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-indigo-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">MoodTracker</h1>
        <div className="flex gap-2">
          <button className="p-2 rounded-full hover:bg-indigo-500">
            <Settings size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
