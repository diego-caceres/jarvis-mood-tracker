import { Calendar, PlusCircle, BarChart2 } from "lucide-react";

interface MobileNavigationProps {
  onAddClick: () => void;
  activeTab: "tracker" | "insights";
  onTabChange: (tab: "tracker" | "insights") => void;
}

export default function MobileNavigation({
  onAddClick,
  activeTab,
  onTabChange,
}: MobileNavigationProps) {
  return (
    <nav className="md:hidden bg-white border-t fixed bottom-0 left-0 right-0 z-10">
      <div className="flex justify-around">
        <button
          className={`p-4 ${
            activeTab === "tracker" ? "text-indigo-600" : "text-gray-500"
          }`}
          onClick={() => onTabChange("tracker")}
        >
          <div className="flex flex-col items-center">
            <Calendar size={20} />
            <span className="text-xs mt-1">Tracker</span>
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
        <button
          className={`p-4 ${
            activeTab === "insights" ? "text-indigo-600" : "text-gray-500"
          }`}
          onClick={() => onTabChange("insights")}
        >
          <div className="flex flex-col items-center">
            <BarChart2 size={20} />
            <span className="text-xs mt-1">Insights</span>
          </div>
        </button>
      </div>
    </nav>
  );
}
