"use client";

import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";
import FormTextarea from "@/components/forms/FormTextarea";
import {
  useGetAllWordsAdminQuery,
  useSoftDeleteWordMutation,
  useUpdateWordMutation,
} from "@/redux/api/dictionaryApi";
import { DictionarySchema } from "@/schema/dictionarySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Book, Edit, Plus, Save, Search, Trash2, X } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

const ManageDictionaryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // RTK Query
  const { data: wordsData, isLoading: isLoadingWords } =
    useGetAllWordsAdminQuery({
      searchTerm,
    });

  const [updateWord, { isLoading: isUpdating }] = useUpdateWordMutation();
  const [deleteWord] = useSoftDeleteWordMutation();

  const handleEditEntry = (entry: any): void => {
    setEditingEntry(entry);
    setIsEditModalOpen(true);
  };

  const handleDeleteEntry = async (id: string): Promise<void> => {
    if (window.confirm("Are you sure you want to delete this word?")) {
      try {
        await deleteWord(id).unwrap();
        toast.success("Word deleted successfully");
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to delete word");
      }
    }
  };

  const onUpdateSubmit = async (data: any) => {
    if (!editingEntry) return;
    try {
      const res = await updateWord({
        id: editingEntry.id,
        data: data,
      }).unwrap();
      if (res.success) {
        toast.success("Word updated successfully");
        setIsEditModalOpen(false);
        setEditingEntry(null);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update word");
    }
  };

  const wordsList = wordsData?.data || [];

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-poppins">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg shadow-indigo-200">
              <Book className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Manage Dictionary
              </h1>
              <p className="text-gray-500 font-medium mt-1">
                Refine and expand the Almunji lexicon
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/admin/create/dictionary"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-100 active:scale-95 font-bold"
          >
            <Plus className="h-6 w-6" />
            <span>Add New Word</span>
          </Link>
        </div>

        {/* Search & Stats Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 relative w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors h-6 w-6" />
            <input
              type="text"
              placeholder="Search words, definitions, or pronunciation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none font-medium"
            />
          </div>
          <div className="px-6 py-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-center gap-3">
            <span className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm leading-none">
              {wordsList.length}
            </span>
            <span className="text-indigo-700 font-bold uppercase tracking-widest text-[10px]">
              Total Terms
            </span>
          </div>
        </div>

        {/* List Content */}
        {isLoadingWords ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-2xl border border-gray-100 animate-pulse h-48"
              ></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {wordsList.map((entry: any) => (
              <div
                key={entry.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-xl hover:shadow-indigo-100/30 transition-all group flex flex-col"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors mb-2">
                      {entry.word}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-indigo-400 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded-md">
                        Pronunciation
                      </span>
                      <span className="text-gray-500 font-medium italic">
                        {entry.pronunciation}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                    <button
                      onClick={() => handleEditEntry(entry)}
                      className="p-3 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors shadow-sm bg-white"
                      title="Edit Entry"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="p-3 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors shadow-sm bg-white"
                      title="Delete Entry"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 bg-gray-50/50 rounded-xl p-4 border border-gray-100 group-hover:border-indigo-100 transition-colors">
                  <p className="text-gray-600 leading-relaxed font-medium line-clamp-3">
                    {entry.definition}
                  </p>
                </div>
              </div>
            ))}

            {wordsList.length === 0 && (
              <div className="col-span-full bg-white rounded-3xl border border-dashed border-gray-200 p-24 text-center">
                <div className="bg-indigo-50 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <Book className="h-12 w-12 text-indigo-200" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">
                  Lexicon Empty
                </h3>
                <p className="text-gray-500 mb-10 max-w-sm mx-auto font-medium">
                  We couldn't find any terms matching your search. Why not
                  define something new?
                </p>
                <Link
                  href="/dashboard/admin/create/dictionary"
                  className="bg-indigo-600 text-white px-10 py-5 rounded-2xl hover:bg-indigo-700 transition-all font-black shadow-xl shadow-indigo-100"
                >
                  Define First Word
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Edit Modal */}
        {isEditModalOpen && editingEntry && (
          <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
              <div className="p-8 border-b flex justify-between items-center bg-gray-50/50">
                <div className="flex items-center gap-5">
                  <div className="bg-indigo-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg">
                    {editingEntry.word.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900">
                      Edit Dictionary Term
                    </h2>
                    <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">
                      Modifying "{editingEntry.word}"
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
                  resolver={zodResolver(DictionarySchema)}
                  defaultValues={{
                    word: editingEntry.word,
                    pronunciation: editingEntry.pronunciation,
                    definition: editingEntry.definition,
                  }}
                >
                  <div className="space-y-8">
                    <FormInput
                      name="word"
                      label="Word Term *"
                      placeholder="e.g. Ephemeral"
                      required
                    />

                    <FormInput
                      name="pronunciation"
                      label="Phonetic Spelling *"
                      placeholder="e.g. /ɪˈfɛm(ə)r(ə)l/"
                      required
                    />

                    <FormTextarea
                      name="definition"
                      label="Comprehensive Definition *"
                      placeholder="Explain the meaning and usage clearly..."
                      rows={6}
                      required
                    />

                    <div className="flex gap-4 pt-10 border-t border-gray-100 mt-4">
                      <button
                        type="button"
                        onClick={() => setIsEditModalOpen(false)}
                        className="flex-1 py-5 text-gray-500 font-black hover:bg-gray-50 rounded-2xl transition-colors uppercase tracking-widest text-xs"
                      >
                        Discard
                      </button>
                      <button
                        type="submit"
                        disabled={isUpdating}
                        className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-100 font-black active:scale-[0.98] disabled:opacity-50"
                      >
                        {isUpdating ? (
                          <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                        ) : (
                          <Save className="h-6 w-6" />
                        )}
                        <span>Update Lexicon</span>
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

export default ManageDictionaryPage;
