"use client";

import { useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import Header from "@/components/layout/Header";
import MobileNavigation from "@/components/layout/MobileNavigation";
import MoodTracker from "@/components/MoodTracker";
import MoodInsights from "@/components/MoodInsights";
import ActivityManager from "@/components/ActivityManager";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"tracker" | "insights">("tracker");
  const [isActivityManagerOpen, setIsActivityManagerOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onManageActivities={() => setIsActivityManagerOpen(true)} />

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Tab navigation for desktop */}
        {!isMobile && (
          <div className="flex mb-6">
            <button
              className={`px-4 py-2 font-medium rounded-t-lg ${
                activeTab === "tracker"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "bg-gray-100 text-gray-600"
              }`}
              onClick={() => setActiveTab("tracker")}
            >
              Daily Tracker
            </button>
            <button
              className={`px-4 py-2 font-medium rounded-t-lg ml-2 ${
                activeTab === "insights"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "bg-gray-100 text-gray-600"
              }`}
              onClick={() => setActiveTab("insights")}
            >
              Insights & Stats
            </button>
          </div>
        )}

        {/* Content based on active tab */}
        <div className="space-y-6">
          {activeTab === "tracker" && <MoodTracker />}
          {activeTab === "insights" && <MoodInsights />}
        </div>
      </main>

      {isMobile && (
        <MobileNavigation
          onAddClick={() => setIsActivityManagerOpen(true)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      )}

      {/* Activity Manager Modal */}
      {isActivityManagerOpen && (
        <ActivityManager onClose={() => setIsActivityManagerOpen(false)} />
      )}
    </div>
  );
}
