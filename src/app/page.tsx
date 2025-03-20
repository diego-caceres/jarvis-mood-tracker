"use client";

import { useState, useEffect } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import Header from "@/components/layout/Header";
import MobileNavigation from "@/components/layout/MobileNavigation";
import MoodTracker from "@/components/MoodTracker";
import MoodInsights from "@/components/MoodInsights";
import QuickAddPanel from "@/components/QuickAddPanel";
import { Activity } from "@/types/activity";
import { predefinedActivities } from "@/data/activities";

export default function Home() {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [activeTab, setActiveTab] = useState<"tracker" | "insights">("tracker");
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Quick access activities
  const quickAddActivities = [
    { id: "surf", name: "Surf", icon: "🏄‍♂️", score: 5 },
    { id: "reading", name: "Reading", icon: "📚", score: 3 },
    { id: "exercise", name: "Exercise", icon: "🏃‍♂️", score: 5 },
    { id: "meditation", name: "Meditation", icon: "🧘‍♂️", score: 3 },
    { id: "work", name: "Work", icon: "💼", score: 2 },
    { id: "fast-food", name: "Fast Food", icon: "🍔", score: -3 },
  ];

  const handleActivitySelect = (activity: Activity) => {
    // This would be handled by the MoodTracker component now
    setShowQuickAdd(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

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
          onAddClick={() => setShowQuickAdd(true)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      )}

      {showQuickAdd && (
        <QuickAddPanel
          activities={quickAddActivities.map((a) => ({
            ...a,
            points: a.score,
          }))}
          onClose={() => setShowQuickAdd(false)}
          onActivitySelect={handleActivitySelect}
        />
      )}
    </div>
  );
}
