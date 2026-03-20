"use client";

import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";
import FormSelect from "@/components/forms/FormSelect";
import FormTextarea from "@/components/forms/FormTextarea";
import {
  useGetAllAyahsQuery,
  useSoftDeleteAyahMutation,
  useUpdateAyahMutation,
} from "@/redux/api/ayahApi";
import { useGetAllParasQuery } from "@/redux/api/paraApi";
import { useGetAllSurahQuery } from "@/redux/api/surahApi";
import { AyahSchema } from "@/schema/ayahSchema";
import { TAyah, TUpdateAyahPayload } from "@/types/ayah";
import { zodResolver } from "@hookform/resolvers/zod";
import { Book, Edit, Plus, Save, Search, Trash2, X } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

const ManageAyahsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedSurah, setSelectedSurah] = useState<string>("");
  const [editingAyah, setEditingAyah] = useState<TAyah | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  // RTK Query
  const { data: ayahsData, isLoading: isLoadingAyahs } = useGetAllAyahsQuery({
    searchTerm,
    surahId: selectedSurah || undefined,
  });
  const { data: surahsData } = useGetAllSurahQuery({});
  const { data: parasData } = useGetAllParasQuery({});

  const [updateAyah, { isLoading: isUpdating }] = useUpdateAyahMutation();
  const [deleteAyah] = useSoftDeleteAyahMutation();

  const handleEditAyah = (ayah: TAyah): void => {
    setEditingAyah(ayah);
    setIsEditModalOpen(true);
  };

  const handleDeleteAyah = async (id: string): Promise<void> => {
    if (window.confirm("Are you sure you want to delete this Ayah?")) {
      try {
        await deleteAyah(id).unwrap();
        toast.success("Ayah deleted successfully");
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to delete Ayah");
      }
    }
  };

  const onUpdateSubmit = async (data: TUpdateAyahPayload) => {
    if (!editingAyah) return;
    try {
      const res = await updateAyah({
        ayahId: editingAyah.id,
        payload: data,
      }).unwrap();
      if (res.success) {
        toast.success("Ayah updated successfully");
        setIsEditModalOpen(false);
        setEditingAyah(null);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update Ayah");
    }
  };

  const surahOptions =
    surahsData?.data?.map((s) => ({
      label: s.title,
      value: s.id,
    })) || [];

  const paraOptions =
    parasData?.data?.map((p) => ({
      label: `Para ${p.number} - ${p.arabic}`,
      value: p.id,
    })) || [];

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-poppins">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Book className="h-8 w-8 text-emerald-600" />
              <h1 className="text-3xl font-bold text-gray-900">Manage Ayahs</h1>
            </div>
            <Link
              href="/dashboard/admin/create/ayah"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-md active:scale-95"
            >
              <Plus className="h-5 w-5" />
              <span>Add New Ayah</span>
            </Link>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search ayahs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
              />
            </div>
            <select
              value={selectedSurah}
              onChange={(e) => setSelectedSurah(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none min-w-[200px]"
            >
              <option value="">All Surahs</option>
              {surahOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading State */}
        {isLoadingAyahs ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl border border-gray-100 animate-pulse h-40"
              ></div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {ayahsData?.data?.map((ayah) => (
              <div
                key={ayah.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      Ayah {ayah.number}
                    </span>
                    <span className="text-gray-400 text-xs">
                      ID: {ayah.id.slice(0, 8)}...
                    </span>
                  </div>
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditAyah(ayah)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit Ayah"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAyah(ayah.id)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Ayah"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4 text-right">
                  <p className="text-3xl font-arabic text-gray-900 leading-loose">
                    {ayah.arabic}
                  </p>
                  <div className="text-left space-y-2 border-l-4 border-emerald-500 pl-4 bg-emerald-50/30 p-4 rounded-r-xl">
                    {ayah.transliteration && (
                      <p className="text-gray-600 italic text-sm">
                        {ayah.transliteration}
                      </p>
                    )}
                    {ayah.english && (
                      <p className="text-gray-800 font-medium">
                        {ayah.english}
                      </p>
                    )}
                    {ayah.bangla && (
                      <p className="text-gray-700 text-sm">{ayah.bangla}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {ayahsData?.data?.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Book className="h-10 w-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No ayahs found
                </h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                  We couldn't find any ayahs matching your criteria. Try
                  adjusting your filters or add a new one.
                </p>
                <Link
                  href="/dashboard/admin/create/ayah"
                  className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-all"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add Your First Ayah</span>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Edit Modal */}
        {isEditModalOpen && editingAyah && (
          <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center z-10">
                <h2 className="text-2xl font-bold text-gray-900">
                  Edit Ayah Detail
                </h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-6 w-6 text-gray-400" />
                </button>
              </div>

              <div className="p-8">
                <FormContainer
                  onSubmit={onUpdateSubmit}
                  resolver={zodResolver(AyahSchema)}
                  defaultValues={{
                    surahId: editingAyah.surahId,
                    paraId: editingAyah.paraId,
                    number: editingAyah.number,
                    arabic: editingAyah.arabic,
                    transliteration: editingAyah.transliteration || "",
                    english: editingAyah.english || "",
                    bangla: editingAyah.bangla || "",
                  }}
                >
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormSelect
                        name="surahId"
                        label="Surah *"
                        options={surahOptions}
                        required
                      />
                      <FormSelect
                        name="paraId"
                        label="Para *"
                        options={paraOptions}
                        required
                      />
                      <FormInput
                        name="number"
                        label="Ayah Number *"
                        type="number"
                        required
                      />
                    </div>

                    <FormTextarea
                      name="arabic"
                      label="Arabic Text *"
                      rows={3}
                      className="text-right text-2xl font-arabic"
                      required
                    />

                    <FormTextarea
                      name="transliteration"
                      label="Transliteration"
                      rows={2}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormTextarea
                        name="english"
                        label="English Translation"
                        rows={3}
                      />
                      <FormTextarea
                        name="bangla"
                        label="Bangla Translation"
                        rows={3}
                      />
                    </div>

                    <div className="flex justify-end gap-4 pt-6 mt-6 border-t font-medium">
                      <button
                        type="button"
                        onClick={() => setIsEditModalOpen(false)}
                        className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isUpdating}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-3 rounded-lg flex items-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
                      >
                        {isUpdating ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        ) : (
                          <Save className="h-5 w-5" />
                        )}
                        <span>Update Ayah</span>
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

export default ManageAyahsPage;
