"use client";

import { useGetAllDuasQuery } from "@/redux/api/duaApi";
import { BookOpen } from "lucide-react";

export default function UserDailyDuasPage() {
  const { data: duasData, isLoading } = useGetAllDuasQuery();
  const duas = duasData?.data || [];

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 border-2 border-teal-600 rounded-full"></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Daily Duas</h1>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {duas.length === 0 ? <div className="p-8 text-center text-gray-500">No duas found</div> : (
            <div className="divide-y divide-gray-100">
              {duas.map((d: any) => (
                <div key={d.id} className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{d.name}</h3>
                  <p className="text-teal-800 font-medium mb-2">{d.arabic}</p>
                  {d.bangla && <p className="text-gray-600 text-sm">{d.bangla}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
