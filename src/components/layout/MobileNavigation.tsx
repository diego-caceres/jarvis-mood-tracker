import { Calendar, PlusCircle, Trophy } from "lucide-react";

interface MobileNavigationProps {
  onAddClick: () => void;
}

export default function MobileNavigation({
  onAddClick,
}: MobileNavigationProps) {
  return (
    <nav className="md:hidden bg-white border-t fixed bottom-0 left-0 right-0 z-10">
      <div className="flex justify-around">
        <button className="p-4 text-indigo-600">
          <div className="flex flex-col items-center">
            <Calendar size={20} />
            <span className="text-xs mt-1">History</span>
          </div>
        </button>
        <button
          className="p-4 flex items-center justify-center"
          onClick={onAddClick}
        >
          <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white">
            <PlusCircle size={24} />
          </div>
        </button>
        <button className="p-4 text-gray-500">
          <div className="flex flex-col items-center">
            <Trophy size={20} />
            <span className="text-xs mt-1">Achievements</span>
          </div>
        </button>
      </div>
    </nav>
  );
}
