"use client";

import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";
import {
  useDeleteParaMutation,
  useGetAllParasQuery,
  useUpdateParaMutation,
} from "@/redux/api/paraApi";
import { ParaSchema } from "@/schema/paraSchema";
import { TPara, TUpdateParaPayload } from "@/types/para";
import { zodResolver } from "@hookform/resolvers/zod";
import { Book, Edit, Plus, Save, Search, Trash2, X } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

const ManageParaPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingPara, setEditingPara] = useState<TPara | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // RTK Query
  const { data: parasData, isLoading: isLoadingParas } = useGetAllParasQuery({
    searchTerm,
  });

  const [updatePara, { isLoading: isUpdating }] = useUpdateParaMutation();
  const [deletePara] = useDeleteParaMutation();

  const handleEditPara = (para: TPara): void => {
    setEditingPara(para);
    setIsEditModalOpen(true);
  };

  const handleDeletePara = async (id: string): Promise<void> => {
    if (window.confirm("Are you sure you want to delete this Para?")) {
      try {
        await deletePara(id).unwrap();
        toast.success("Para deleted successfully");
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to delete Para");
      }
    }
  };

  const onUpdateSubmit = async (data: TUpdateParaPayload) => {
    if (!editingPara) return;
    try {
      const res = await updatePara({
        paraId: editingPara.id,
        payload: data,
      }).unwrap();
      if (res.success) {
        toast.success("Para updated successfully");
        setIsEditModalOpen(false);
        setEditingPara(null);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update Para");
    }
  };

  const parasList = parasData?.data || [];

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-poppins">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="bg-emerald-600 p-4 rounded-2xl shadow-lg shadow-emerald-200">
              <Book className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Paras</h1>
              <p className="text-gray-500 font-medium mt-1">
                Organize and curate Quranic segments
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/admin/create/para"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-100 active:scale-95 font-bold"
          >
            <Plus className="h-6 w-6" />
            <span>Create New Para</span>
          </Link>
        </div>

        {/* Search & Stats */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 relative w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors h-6 w-6" />
            <input
              type="text"
              placeholder="Search by para number, name, or references..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none font-medium placeholder:text-gray-400"
            />
          </div>
          <div className="px-6 py-4 bg-emerald-50 rounded-2xl border border-emerald-100 whitespace-nowrap">
            <span className="text-emerald-700 font-bold">
              {parasList.length}
            </span>
            <span className="text-emerald-600 font-medium ml-2 uppercase tracking-wider text-xs">
              Total Paras
            </span>
          </div>
        </div>

        {/* List Content */}
        {isLoadingParas ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-2xl border border-gray-100 animate-pulse h-48"
              ></div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {parasList.map((para) => (
              <div
                key={para.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-xl hover:shadow-gray-200/40 transition-all group relative overflow-hidden"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="bg-gray-900 text-white w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg">
                      {para.number}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 flex-wrap mb-2">
                        <span className="text-2xl font-black text-gray-900 font-arabic">
                          {para.arabic}
                        </span>
                        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-200">
                          Verified Segment
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-gray-500 text-sm font-bold uppercase tracking-wider">
                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                          {para.startAyahRef}
                        </span>
                        <span>→</span>
                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                          {para.endAyahRef}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditPara(para)}
                      className="flex-1 md:flex-none bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white p-4 rounded-2xl transition-all"
                      title="Edit Para"
                    >
                      <Edit className="h-6 w-6" />
                    </button>
                    <button
                      onClick={() => handleDeletePara(para.id)}
                      className="flex-1 md:flex-none bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white p-4 rounded-2xl transition-all"
                      title="Delete Para"
                    >
                      <Trash2 className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {para.english && (
                    <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 group-hover:bg-white group-hover:border-emerald-100 transition-colors">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                        Transliteration
                      </p>
                      <p className="text-gray-800 font-bold">{para.english}</p>
                    </div>
                  )}
                  {para.bangla && (
                    <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100 group-hover:bg-white group-hover:border-teal-100 transition-colors">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">
                        Bangla Context
                      </p>
                      <p className="text-gray-800 font-bold">{para.bangla}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {parasList.length === 0 && (
              <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-24 text-center">
                <div className="bg-emerald-50 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <Book className="h-12 w-12 text-emerald-200" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">
                  No paras documented
                </h3>
                <p className="text-gray-500 mb-10 max-w-sm mx-auto font-medium">
                  We couldn't find any segments matching your filter. Start
                  building the Quranic structure today.
                </p>
                <Link
                  href="/dashboard/admin/create/para"
                  className="bg-emerald-600 text-white px-10 py-5 rounded-2xl hover:bg-emerald-700 transition-all font-black shadow-xl shadow-emerald-100"
                >
                  Document First Para
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Edit Modal */}
        {isEditModalOpen && editingPara && (
          <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col scale-in-center">
              <div className="p-8 border-b flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl">
                    {editingPara.number}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900">
                      Update Para Profile
                    </h2>
                    <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">
                      Refining segment data
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
                  resolver={zodResolver(ParaSchema)}
                  defaultValues={{
                    number: editingPara.number,
                    arabic: editingPara.arabic,
                    english: editingPara.english || "",
                    bangla: editingPara.bangla || "",
                    startAyahRef: editingPara.startAyahRef,
                    endAyahRef: editingPara.endAyahRef,
                  }}
                >
                  <div className="space-y-8">
                    <FormInput
                      name="number"
                      label="Para Order/Number *"
                      type="number"
                      placeholder="1-30"
                      required
                    />

                    <FormInput
                      name="arabic"
                      label="Arabic Name *"
                      placeholder="e.g. الم"
                      className="text-right text-3xl font-arabic h-20"
                      required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <FormInput
                        name="english"
                        label="English Title"
                        placeholder="Alif Lam Meem"
                      />
                      <FormInput
                        name="bangla"
                        label="Bangla Name"
                        placeholder="আলিফ লাম মীম"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <FormInput
                        name="startAyahRef"
                        label="Source Ayah (Start) *"
                        placeholder="2:1"
                        required
                      />
                      <FormInput
                        name="endAyahRef"
                        label="Target Ayah (End) *"
                        placeholder="2:141"
                        required
                      />
                    </div>

                    <div className="flex gap-4 pt-10 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => setIsEditModalOpen(false)}
                        className="flex-1 py-4 text-gray-500 font-black hover:bg-gray-50 rounded-2xl transition-colors"
                      >
                        Cancel
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
                        <span>Update Document</span>
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

export default ManageParaPage;
