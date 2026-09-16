"use client";

import { useGetAllSurahsQuery, useSoftDeleteSurahMutation } from "@/redux/api/surahApi";
import { Book } from "lucide-react";
import { toast } from "sonner";

export default function ModeratorManageSurahsPage() {
  const [deleteSurah] = useSoftDeleteSurahMutation();
  const { data: surahsData, isLoading } = useGetAllSurahsQuery();
  const surahs = surahsData?.data || [];

  const handleDelete = async (id: string) => {
    if (confirm("Delete this surah?")) {
      try {
        await deleteSurah(id).unwrap();
        toast.success("Surah deleted");
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to delete");
      }
    }
  };

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 border-2 border-teal-600 rounded-full"></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Manage Surahs</h1>
          <a href="/dashboard/moderator/create/surah" className="bg-teal-600 text-white px-4 py-2 rounded-lg">+ Add Surah</a>
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
                  <button onClick={() => handleDelete(s.id)} className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg">Delete</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}