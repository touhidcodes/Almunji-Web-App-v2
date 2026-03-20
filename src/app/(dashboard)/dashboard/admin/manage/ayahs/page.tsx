"use client";

import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";
import FormSelect from "@/components/forms/FormSelect";
import FormTextarea from "@/components/forms/FormTextarea";
import { useDebounce } from "@/hooks/useDebounce";
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
import {
  BookOpen,
  Edit,
  Eraser,
  Filter,
  Layers,
  Plus,
  Save,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

const ManageAyahsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedSurah, setSelectedSurah] = useState<string>("");
  const [editingAyah, setEditingAyah] = useState<TAyah | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // RTK Query
  const { data: ayahsData, isLoading: isLoadingAyahs } = useGetAllAyahsQuery({
    searchTerm: debouncedSearchTerm,
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
    toast.error("Security Override Required", {
      description: "Are you absolutely sure about this deletion?",
      action: {
        label: "Confirm Purge",
        onClick: async () => {
          try {
            await deleteAyah(id).unwrap();
            toast.success("Ayah purged from repository", {
              description:
                "The record has been moved to archival cold storage.",
            });
          } catch (error: any) {
            toast.error(error?.data?.message || "Purge execution failed!");
          }
        },
      },
    });
  };

  const onUpdateSubmit = async (data: TUpdateAyahPayload) => {
    if (!editingAyah) return;
    try {
      const res = await updateAyah({
        ayahId: editingAyah.id,
        payload: data,
      }).unwrap();
      if (res.success) {
        toast.success("Metadata synchronization successful", {
          description: "Transmission of revised verse data completed.",
        });
        setIsEditModalOpen(false);
        setEditingAyah(null);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Metadata transmission failed!");
    }
  };

  const surahOptions =
    surahsData?.data?.map((s) => ({
      label: `${s.chapter}. ${s.english || s.arabic}`,
      value: s.id,
    })) || [];

  const paraOptions =
    parasData?.data?.map((p) => ({
      label: `Para ${p.number} - ${p.english || p.arabic}`,
      value: p.id,
    })) || [];

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 lg:p-12 font-poppins">
      <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
        {/* Header Hub */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-600 p-3 rounded-[1.25rem] shadow-2xl shadow-emerald-100 flex items-center justify-center">
                <Layers className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
                Manage Repository
              </h1>
            </div>
            <p className="text-gray-500 font-medium text-sm lg:text-base uppercase tracking-[0.2em] flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              Global Verse Archive System
            </p>
          </div>
          <Link
            href="/dashboard/admin/create/ayah"
            className="group px-8 py-5 bg-gray-900 hover:bg-black text-white rounded-[1.5rem] flex items-center justify-center gap-3 transition-all shadow-2xl shadow-gray-200 hover:scale-[1.02] active:scale-[0.98] font-black tracking-widest uppercase text-xs"
          >
            <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
            <span>Establish New Verse</span>
          </Link>
        </header>

        {/* Control Center */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 lg:p-10">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-emerald-500 h-5 w-5 transition-colors" />
              <input
                type="text"
                placeholder="Query by verse content or metadata coordinates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-[1.5rem] focus:ring-4 focus:ring-emerald-50 focus:bg-white transition-all outline-none font-medium placeholder:text-gray-300"
              />
            </div>
            <div className="flex gap-4">
              <div className="relative flex-1 lg:flex-none">
                <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                <select
                  value={selectedSurah}
                  onChange={(e) => setSelectedSurah(e.target.value)}
                  className="pl-12 pr-10 py-5 bg-gray-50 border border-gray-100 rounded-[1.5rem] focus:ring-4 focus:ring-emerald-50 outline-none appearance-none min-w-[240px] font-bold text-gray-600 text-sm cursor-pointer hover:bg-white transition-all uppercase tracking-widest"
                >
                  <option value="">All Revelations</option>
                  {surahOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedSurah("");
                }}
                className="p-5 bg-gray-50 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-[1.5rem] transition-all"
                title="Clear Protocol"
              >
                <Eraser className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Data Stream */}
        {isLoadingAyahs ? (
          <div className="grid grid-cols-1 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-[2.5rem] border border-gray-100 p-10 animate-pulse h-64 shadow-sm"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="h-8 w-40 bg-gray-100 rounded-xl"></div>
                  <div className="h-8 w-20 bg-gray-100 rounded-xl"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 w-full bg-gray-50 rounded-lg"></div>
                  <div className="h-4 w-3/4 bg-gray-50 rounded-lg ml-auto"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10">
            {ayahsData?.data?.map((ayah) => (
              <div
                key={ayah.id}
                className="bg-white rounded-[3rem] shadow-xl shadow-gray-200/20 border border-gray-100 p-8 lg:p-12 hover:shadow-2xl hover:shadow-emerald-200/10 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-10">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="bg-emerald-600 text-white px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-100">
                      Verse Coordinates {ayah.number}
                    </span>
                    <span className="bg-gray-100 text-gray-500 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      <BookOpen className="h-3 w-3" />
                      {ayah.surahId?.slice(0, 8)}...
                    </span>
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest font-mono">
                      UID: {ayah.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all -translate-y-2 group-hover:translate-y-0">
                    <button
                      onClick={() => handleEditAyah(ayah)}
                      className="p-4 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-2xl transition-all shadow-sm"
                      title="Edit Verse"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteAyah(ayah.id)}
                      className="p-4 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-2xl transition-all shadow-sm"
                      title="Purge Verse"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-8 order-2 lg:order-1 space-y-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1 w-6 bg-emerald-200 rounded-full"></div>
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                          Interpretation
                        </h4>
                      </div>
                      <p className="text-xl lg:text-2xl font-bold text-gray-900 leading-relaxed italic">
                        &quot;{ayah.english}&quot;
                      </p>
                      {ayah.bangla && (
                        <p className="text-gray-500 font-medium text-lg border-l-4 border-gray-100 pl-6 py-2">
                          {ayah.bangla}
                        </p>
                      )}
                    </div>
                    {ayah.transliteration && (
                      <div className="bg-gray-50/50 p-6 rounded-[1.5rem] border border-gray-100/50">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2">
                          Phonetics
                        </h4>
                        <p className="text-gray-400 font-medium italic text-sm">
                          {ayah.transliteration}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="lg:col-span-4 order-1 lg:order-2">
                    <div className="text-right space-y-4">
                      <p className="text-4xl lg:text-5xl font-arabic text-gray-900 leading-[1.8] drop-shadow-sm">
                        {ayah.arabic}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {ayahsData?.data?.length === 0 && (
              <div className="bg-white rounded-[3rem] border-2 border-dashed border-gray-100 p-24 text-center">
                <div className="bg-emerald-50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <Eraser className="h-10 w-10 text-emerald-200" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">
                  Zero Records Located
                </h3>
                <p className="text-gray-400 mb-10 max-w-sm mx-auto font-medium uppercase text-xs tracking-widest leading-loose">
                  Your current protocol search yielded no data results in the
                  repository master ledger.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedSurah("");
                    }}
                    className="px-10 py-5 bg-gray-50 text-gray-500 rounded-[1.5rem] font-black uppercase text-xs tracking-widest hover:bg-gray-100 transition-all"
                  >
                    Reset Protocol
                  </button>
                  <Link
                    href="/dashboard/admin/create/ayah"
                    className="group px-10 py-5 bg-emerald-600 text-white rounded-[1.5rem] flex items-center gap-3 transition-all shadow-xl shadow-emerald-100 hover:bg-emerald-700 font-black uppercase text-xs tracking-widest"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Establish New Entry</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Redesigned Edit Modal */}
        {isEditModalOpen && editingAyah && (
          <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col scale-in-center">
              <div className="p-10 border-b flex justify-between items-center bg-gray-50/30">
                <div className="flex items-center gap-5">
                  <div className="bg-emerald-600 text-white w-14 h-14 rounded-3xl flex items-center justify-center font-black text-xl shadow-xl shadow-emerald-100">
                    {editingAyah.number}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                      Sync Metadata
                    </h2>
                    <p className="text-xs text-gray-400 font-black uppercase tracking-[0.2em] mt-1">
                      Refining coordinates and revelation data
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-4 hover:bg-white hover:shadow-xl rounded-[1.25rem] transition-all group"
                >
                  <X className="h-6 w-6 text-gray-400 group-hover:text-rose-500" />
                </button>
              </div>

              <div className="p-12 lg:p-16 overflow-y-auto flex-1 custom-scrollbar">
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
                  <div className="space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                      <FormSelect
                        name="surahId"
                        label="Reveal Source (Surah) *"
                        options={surahOptions}
                        required
                      />
                      <FormSelect
                        name="paraId"
                        label="Structural Unit (Para) *"
                        options={paraOptions}
                        required
                      />
                      <FormInput
                        name="number"
                        label="Coordinate (Ayah) *"
                        type="number"
                        required
                      />
                    </div>

                    <div className="space-y-10">
                      <div className="flex items-center gap-2">
                        <div className="h-1 w-8 bg-emerald-500 rounded-full"></div>
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
                          Sacred Text Archival
                        </h3>
                      </div>

                      <FormTextarea
                        name="arabic"
                        label="Original Revelation Text *"
                        rows={4}
                        className="text-right text-4xl font-arabic h-48 leading-[1.8] p-10 bg-gray-50/30 border-gray-100 focus:bg-white focus:border-emerald-500 rounded-[2rem]"
                        required
                      />

                      <FormTextarea
                        name="transliteration"
                        label="Phonetics Data"
                        rows={2}
                        className="bg-gray-50/30 border-gray-100 rounded-2xl italic font-medium p-6"
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <FormTextarea
                          name="english"
                          label="English Linguistic Map"
                          rows={4}
                          className="bg-gray-50/30 border-gray-100 rounded-[2rem] p-8"
                        />
                        <FormTextarea
                          name="bangla"
                          label="Bangla Semantic Map"
                          rows={4}
                          className="bg-gray-50/30 border-gray-100 rounded-[2rem] p-8"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-6 pt-12 border-t border-gray-50">
                      <button
                        type="button"
                        onClick={() => setIsEditModalOpen(false)}
                        className="px-10 py-5 text-gray-400 font-bold uppercase tracking-widest text-[10px] hover:text-rose-500 transition-colors"
                      >
                        Discard Revisions
                      </button>
                      <button
                        type="submit"
                        disabled={isUpdating}
                        className="px-16 py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[1.5rem] flex items-center justify-center gap-3 transition-all shadow-2xl shadow-emerald-100 font-black tracking-widest uppercase text-xs disabled:opacity-50"
                      >
                        {isUpdating ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                            <span>Syncing...</span>
                          </>
                        ) : (
                          <>
                            <Save className="h-5 w-5" />
                            <span>Confirm Metadata Sync</span>
                          </>
                        )}
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
