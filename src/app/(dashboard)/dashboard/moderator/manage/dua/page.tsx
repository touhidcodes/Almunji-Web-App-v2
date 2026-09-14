"use client";

import { useGetAllDuasQuery, useSoftDeleteDuaMutation } from "@/redux/api/duaApi";
import { BookOpen } from "lucide-react";
import { toast } from "sonner";

export default function ModeratorManageDuaPage() {
  const [deleteDua] = useSoftDeleteDuaMutation();
  const { data: duasData, isLoading } = useGetAllDuasQuery();
  const duas = duasData?.data || [];

  const handleDelete = async (id: string) => {
    if (confirm("Delete this dua?")) {
      try {
        await deleteDua(id).unwrap();
        toast.success("Dua deleted");
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
          <h1 className="text-2xl font-bold text-gray-900">Manage Duas</h1>
          <a href="/dashboard/moderator/create/dua" className="bg-teal-600 text-white px-4 py-2 rounded-lg">+ Add Dua</a>
        </header>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {duas.length === 0 ? <div className="p-8 text-center text-gray-500">No duas found</div> : (
            <div className="divide-y divide-gray-100">
              {duas.map((d: any) => (
                <div key={d.id} className="flex items-center justify-between p-4">
                  <h3 className="font-semibold text-gray-900">{d.name}</h3>
                  <button onClick={() => handleDelete(d.id)} className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg">Delete</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}