"use client";

import { useGetAllTafsirAdminQuery, useSoftDeleteTafsirMutation } from "@/redux/api/tafsirApi";
import type { TTafsir } from "@/types/tafsir";
import { BookOpen } from "lucide-react";
import { toast } from "sonner";

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof (error as { data: unknown }).data === "object" &&
    (error as { data: unknown }).data !== null &&
    "message" in (error as { data: { message: unknown } }).data &&
    typeof (error as { data: { message: unknown } }).data.message === "string"
  ) {
    return (error as { data: { message: string } }).data.message;
  }
  return fallback;
};


export default function ManageTafsirPage() {
  const [deleteTafsir] = useSoftDeleteTafsirMutation();

  const { data: tafsirData, isLoading } = useGetAllTafsirAdminQuery();
  const tafsirs = tafsirData?.data || [];

  const handleDelete = async (id: string) => {
    if (confirm("Delete this tafsir?")) {
      try {
        await deleteTafsir(id).unwrap();
        toast.success("Tafsir deleted");
      } catch (error: unknown) {
        toast.error(getErrorMessage(error, "Failed to delete"));
      }
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 border-2 border-teal-600 rounded-full"></div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center gap-3 mb-6">
          <div className="bg-teal-600 p-3 rounded-xl">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Tafsir</h1>
        </header>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {tafsirs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No tafsir found</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {tafsirs.map((t: TTafsir) => (
                <div key={t.id} className="flex items-center justify-between p-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{t.heading || "Tafsir"}</h3>
                    <p className="text-sm text-gray-500">Ayah: {t.ayahId?.slice(0, 8)}...</p>
                  </div>
                  <button onClick={() => handleDelete(t.id)} className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg">
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
