"use client";

import { Activity, BookOpen, Globe, Heart, MessageSquare, Users } from "lucide-react";
import { useState } from "react";

interface ActivityItem {
  id: string;
  type: "registration" | "completion" | "translation" | "feedback";
  icon: any;
  title: string;
  description: string;
  timestamp: string;
}

const ModeratorDashboard = () => {
  const [timeRange, setTimeRange] = useState("week");

  const activities: ActivityItem[] = [
    { id: "1", type: "translation", icon: Globe, title: "New translation", description: "Bengali translation added", timestamp: "5m ago" },
    { id: "2", type: "feedback", icon: MessageSquare, title: "New feedback", description: "User comment received", timestamp: "12m ago" },
    { id: "3", type: "registration", icon: Users, title: "New user", description: "User registered", timestamp: "1h ago" },
    { id: "4", type: "completion", icon: BookOpen, title: "Surah completed", description: "User finished Surah", timestamp: "2h ago" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Moderator Dashboard</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, title: "Total Users", value: "1,234" },
            { icon: BookOpen, title: "Total Books", value: "56" },
            { icon: Globe, title: "Translations", value: "12K" },
            { icon: Heart, title: "Bookmarks", value: "8.5K" },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-4 rounded-xl shadow-sm">
              <stat.icon className="w-6 h-6 text-teal-600 mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.title}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {activities.map((act) => (
              <div key={act.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <act.icon className="w-5 h-5 text-teal-600" />
                  <div>
                    <div className="font-medium text-gray-900">{act.title}</div>
                    <div className="text-sm text-gray-500">{act.description}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">{act.timestamp}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeratorDashboard;