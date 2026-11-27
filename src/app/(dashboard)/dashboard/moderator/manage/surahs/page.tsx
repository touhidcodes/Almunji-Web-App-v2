"use client";

import { useGetAllSurahAdminQuery } from "@/redux/api/surahApi";
import { Book } from "lucide-react";

export default function ModeratorManageSurahsPage() {
  const { data: surahsData, isLoading } = useGetAllSurahAdminQuery();
  const surahs = surahsData?.data || [];


  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 border-2 border-teal-600 rounded-full"></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Manage Surahs</h1>
        </header>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {surahs.length === 0 ? <div className="p-8 text-center text-gray-500">No surahs found</div> : (
            <div className="divide-y divide-gray-100">
              {surahs.map((s: any) => (
                <div key={s.id} className="flex items-center justify-between p-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{s.english}</h3>
                    <p className="text-sm text-gray-500">Ch: {s.chapter} | {s.arabic}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
