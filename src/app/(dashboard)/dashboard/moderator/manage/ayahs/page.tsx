"use client";

import { useGetAllAyahsQuery, useSoftDeleteAyahMutation } from "@/redux/api/ayahApi";
import { Book } from "lucide-react";
import { toast } from "sonner";

export default function ModeratorManageAyahsPage() {
  const [deleteAyah] = useSoftDeleteAyahMutation();
  const { data: ayahsData, isLoading } = useGetAllAyahsQuery();
  const ayahs = ayahsData?.data || [];

  const handleDelete = async (id: string) => {
    if (confirm("Delete this ayah?")) {
      try {
        await deleteAyah(id).unwrap();
        toast.success("Ayah deleted");
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
          <h1 className="text-2xl font-bold text-gray-900">Manage Ayahs</h1>
          <a href="/dashboard/moderator/create/ayah" className="bg-teal-600 text-white px-4 py-2 rounded-lg">+ Add Ayah</a>
        </header>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {ayahs.length === 0 ? <div className="p-8 text-center text-gray-500">No ayahs found</div> : (
            <div className="divide-y divide-gray-100">
              {ayahs.map((a: any) => (
                <div key={a.id} className="flex items-center justify-between p-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{a.surahId?.slice(0, 8)}:{a.number}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1">{a.arabic}</p>
                  </div>
                  <button onClick={() => handleDelete(a.id)} className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg">Delete</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}