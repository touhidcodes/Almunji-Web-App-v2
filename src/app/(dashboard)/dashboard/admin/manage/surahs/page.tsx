"use client";

import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";
import FormSelect from "@/components/forms/FormSelect";
import FormTextarea from "@/components/forms/FormTextarea";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useHardDeleteSurahMutation,
  useGetAllSurahQuery,
  useUpdateSurahMutation,
} from "@/redux/api/surahApi";
import { SurahSchema } from "@/schema/surahSchema";
import { TSurah, TUpdateSurahPayload } from "@/types/surah";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Book,
  Edit,
  MapPin,
  Plus,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

const ManageSurahsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedRevelation, setSelectedRevelation] = useState<string>("");
  const [editingSurah, setEditingSurah] = useState<TSurah | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // RTK Query
  const { data: surahsData, isLoading: isLoadingSurahs } = useGetAllSurahQuery({
    searchTerm: debouncedSearchTerm,
    revelation: selectedRevelation || undefined,
  });

  const [updateSurah, { isLoading: isUpdating }] = useUpdateSurahMutation();
  const [deleteSurah] = useHardDeleteSurahMutation();

  const handleEditSurah = (surah: TSurah): void => {
    setEditingSurah(surah);
    setIsEditModalOpen(true);
  };

  const handleDeleteSurah = async (id: string): Promise<void> => {
    if (window.confirm("Are you sure you want to delete this Surah?")) {
      try {
        await deleteSurah(id).unwrap();
        toast.success("Surah deleted successfully");
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to delete Surah");
      }
    }
  };

  const onUpdateSubmit = async (data: TUpdateSurahPayload) => {
    if (!editingSurah) return;
    try {
      const res = await updateSurah({
        surahId: editingSurah.id,
        payload: data,
      }).unwrap();
      if (res.success) {
        toast.success("Surah updated successfully");
        setIsEditModalOpen(false);
        setEditingSurah(null);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update Surah");
    }
  };

  // Stats calculation
  const surahsList = surahsData?.data || [];
  const totalAyahs = surahsList.reduce((sum, s) => sum + s.totalAyah, 0);
  const meccanCount = surahsList.filter(
    (s) => s.revelation === "Meccan",
  ).length;
  const medinanCount = surahsList.filter(
    (s) => s.revelation === "Medinan",
  ).length;

  const revelationOptions = [
    { label: "Meccan", value: "Meccan" },
    { label: "Medinan", value: "Medinan" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-poppins">
      <div className="max-w-7xl mx-auto">
        {/* Header & Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-100 p-3 rounded-2xl">
                <Book className="h-8 w-8 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Manage Surahs
                </h1>
                <p className="text-gray-500">
                  View and manage all Quranic chapters
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/admin/create/surah"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-200 active:scale-95 font-semibold"
            >
              <Plus className="h-5 w-5" />
              <span>Add New Surah</span>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors h-5 w-5" />
              <input
                type="text"
                placeholder="Search surahs by name, chapter, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none"
              />
            </div>
            <select
              value={selectedRevelation}
              onChange={(e) => setSelectedRevelation(e.target.value)}
              className="px-6 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none min-w-[200px] font-medium text-gray-700"
            >
              <option value="">All Revelations</option>
              <option value="Meccan">Meccan</option>
              <option value="Medinan">Medinan</option>
            </select>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              {
                label: "Total Surahs",
                value: surahsList.length,
                color: "emerald",
                icon: Book,
              },
              {
                label: "Total Ayahs",
                value: totalAyahs,
                color: "blue",
                icon: Search,
              },
              {
                label: "Meccan",
                value: meccanCount,
                color: "purple",
                icon: MapPin,
              },
              {
                label: "Medinan",
                value: medinanCount,
                color: "orange",
                icon: MapPin,
              },
            ].map((stat, i) => (
              <div
                key={i}
                className={`bg-${stat.color}-50 p-4 rounded-2xl border border-${stat.color}-100 transition-transform hover:scale-[1.02]`}
              >
                <div className="flex items-center gap-3 mb-1">
                  <stat.icon className={`h-4 w-4 text-${stat.color}-600`} />
                  <span
                    className={`text-sm font-medium text-${stat.color}-700`}
                  >
                    {stat.label}
                  </span>
                </div>
                <div className={`text-2xl font-black text-${stat.color}-900`}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        {isLoadingSurahs ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl border border-gray-100 animate-pulse h-64"
              ></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {surahsList.map((surah) => (
              <div
                key={surah.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 transition-all group flex flex-col"
              >
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-emerald-100">
                        {surah.chapter}
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                          surah.revelation === "Meccan"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        <MapPin className="h-3 w-3" />
                        {surah.revelation}
                      </span>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditSurah(surah)}
                        className="p-2.5 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                        title="Edit Surah"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSurah(surah.id)}
                        className="p-2.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        title="Delete Surah"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="text-right">
                      <p className="text-3xl font-black font-arabic text-gray-900 leading-normal">
                        {surah.arabic}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {surah.english}
                      </h3>
                      {surah.bangla && (
                        <p className="text-gray-500 font-medium text-sm mt-0.5">
                          {surah.bangla}
                        </p>
                      )}
                    </div>
                    {surah.history && (
                      <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed italic border-l-2 border-emerald-100 pl-3">
                        {surah.history}
                      </p>
                    )}
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">
                    Total Verses
                  </span>
                  <span className="text-emerald-700 font-black">
                    {surah.totalAyah} Ayahs
                  </span>
                </div>
              </div>
            ))}

            {surahsList.length === 0 && (
              <div className="col-span-full bg-white rounded-3xl border border-dashed border-gray-200 p-20 text-center">
                <div className="bg-emerald-50 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <Book className="h-12 w-12 text-emerald-200" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">
                  No surahs discovered
                </h3>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto font-medium">
                  We couldn't track any surahs with that search query. Try
                  something else or start fresh.
                </p>
                <Link
                  href="/dashboard/admin/create/surah"
                  className="inline-flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-2xl hover:bg-emerald-700 transition-all font-bold shadow-xl shadow-emerald-100"
                >
                  <Plus className="h-5 w-5" />
                  <span>Register First Surah</span>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Edit Modal */}
        {isEditModalOpen && editingSurah && (
          <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col scale-in-center">
              <div className="p-8 border-b flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center font-black">
                    {editingSurah.chapter}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900">
                      Update Chapter Info
                    </h2>
                    <p className="text-sm text-gray-500 font-medium">
                      Refining details for Surah {editingSurah.english}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-3 hover:bg-white hover:shadow-sm rounded-2xl transition-all group"
                >
                  <X className="h-6 w-6 text-gray-400 group-hover:text-rose-500" />
                </button>
              </div>

              <div className="p-10 overflow-y-auto flex-1 custom-scrollbar">
                <FormContainer
                  onSubmit={onUpdateSubmit}
                  resolver={zodResolver(SurahSchema)}
                  defaultValues={{
                    chapter: editingSurah.chapter,
                    totalAyah: editingSurah.totalAyah,
                    arabic: editingSurah.arabic,
                    english: editingSurah.english,
                    bangla: editingSurah.bangla || "",
                    revelation: editingSurah.revelation as any,
                    history: editingSurah.history || "",
                  }}
                >
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <FormInput
                        name="chapter"
                        label="Chapter Number *"
                        type="number"
                        placeholder="1-114"
                        required
                      />
                      <FormInput
                        name="totalAyah"
                        label="Total Ayahs *"
                        type="number"
                        placeholder="7"
                        required
                      />
                    </div>

                    <FormInput
                      name="arabic"
                      label="Arabic Title *"
                      placeholder="الفاتحة"
                      className="text-right text-3xl font-arabic h-16"
                      required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <FormInput
                        name="english"
                        label="English Name *"
                        placeholder="Al-Fatihah"
                        required
                      />
                      <FormInput
                        name="bangla"
                        label="Bangla Name"
                        placeholder="আল-ফাতিহা"
                      />
                    </div>

                    <FormSelect
                      name="revelation"
                      label="Revelation Period *"
                      options={revelationOptions}
                      required
                    />

                    <FormTextarea
                      name="history"
                      label="Historical Context & Background"
                      placeholder="Share the significance and history of this surah..."
                      rows={6}
                    />

                    <div className="flex gap-4 pt-10 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => setIsEditModalOpen(false)}
                        className="flex-1 py-4 text-gray-500 font-bold hover:bg-gray-50 rounded-2xl transition-colors"
                      >
                        Discard Changes
                      </button>
                      <button
                        type="submit"
                        disabled={isUpdating}
                        className="flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-100 font-black active:scale-[0.98] disabled:opacity-50"
                      >
                        {isUpdating ? (
                          <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                        ) : (
                          <Save className="h-6 w-6" />
                        )}
                        <span>Confirm Updates</span>
                      </button>
                    </div>
                  </div>
                </FormContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageSurahsPage;
