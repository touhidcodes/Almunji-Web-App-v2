"use client";

import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";
import FormTextarea from "@/components/forms/FormTextarea";
import { useCreateWordMutation } from "@/redux/api/dictionaryApi";
import { DictionarySchema } from "@/schema/dictionarySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, HelpCircle, Languages, Save, Sparkles } from "lucide-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

const CreateDictionaryPage: React.FC = () => {
  const [createWord, { isLoading: isSubmitting }] = useCreateWordMutation();

  const onSubmit = async (data: any) => {
    // Map form data to API field names
    const apiData = {
      persianWord: data.word,
      transliteration: data.pronunciation,
      englishMeaning: data.definition,
      banglaMeaning: data.meaning || '', // Make banglaMeaning required if needed
    };
    
    try {
      const res = await createWord(apiData).unwrap();
      if (res.success) {
        toast.success("Word created successfully!", {
          description:
            "The word has been successfully added to the dictionary.",
        });
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create word!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-12 font-poppins">
      <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
        {/* Header Navigation */}
        <nav className="flex items-center justify-between pb-6 border-b border-gray-200">
          <Link
            href="/dashboard/admin/manage/dictionary"
            className="group flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-semibold uppercase text-xs tracking-widest transition-all"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Dictionary</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-widest leading-none">
            <Sparkles className="h-3 w-3 text-indigo-400" />
            New Entry
          </div>
        </nav>

        {/* Hero Section */}
        <header className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-xl shadow-indigo-100">
              <Languages className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
                Add New Word
              </h1>
              <p className="text-gray-500 font-medium mt-2 text-lg">
                Expand the Almunji dictionary with new terms
              </p>
            </div>
          </div>
        </header>

        {/* Main Interface */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative">
          <div className="absolute -top-32 -right-32 p-16 pointer-events-none opacity-[0.02] rotate-12">
            <Languages className="h-[40rem] w-[40rem] text-indigo-900" />
          </div>

          <div className="p-10 lg:p-20 relative">
            <FormContainer
              onSubmit={onSubmit}
              resolver={zodResolver(DictionarySchema)}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Word Details */}
                <aside className="lg:col-span-5 space-y-10">
                  <div className="space-y-8">
                    <div className="flex items-center gap-3">
                      <div className="h-1 w-12 bg-indigo-600 rounded-full"></div>
                      <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">
                        Word Details
                      </h3>
                    </div>

                    <div className="space-y-8">
                      <FormInput
                        name="word"
                        label="Word (English) *"
                        placeholder="e.g., Ephemeral"
                        className="h-14 bg-gray-50/50 border-gray-100 focus:bg-white rounded-xl font-bold text-lg"
                        required
                      />

                      <FormInput
                        name="pronunciation"
                        label="Pronunciation (IPA) *"
                        placeholder="e.g., /ɪˈfɛm(ə)r(ə)l/"
                        className="h-14 bg-gray-50/50 border-gray-100 focus:bg-white rounded-xl font-medium"
                        required
                      />
                    </div>
                  </div>

                  {/* Information Box */}
                  <div className="p-8 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-indigo-600 text-white p-2 rounded-lg shadow-sm">
                        <HelpCircle className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-black text-gray-800 uppercase tracking-widest leading-none">
                        Guidelines
                      </span>
                    </div>
                    <ul className="space-y-3">
                      {[
                        "Provide clear English word",
                        "Use IPA for pronunciation",
                        "Write comprehensive definition",
                      ].map((rule, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-3 text-xs font-bold text-gray-600 uppercase tracking-tight"
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-indigo-300 shadow-sm"></div>
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                </aside>

                {/* Definition */}
                <main className="lg:col-span-7 flex flex-col justify-between">
                  <div className="space-y-10">
                    <div className="flex items-center gap-3">
                      <div className="h-1 w-12 bg-purple-500 rounded-full"></div>
                      <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">
                        Definition
                      </h3>
                    </div>

                    <FormTextarea
                      name="definition"
                      label="Word Definition *"
                      rows={10}
                      placeholder="Provide a clear and comprehensive definition of the word..."
                      className="bg-gray-50/30 border-gray-100 rounded-2xl p-6 focus:bg-white leading-relaxed text-gray-700"
                      required
                    />
                  </div>

                  {/* Action Button */}
                  <div className="pt-12 mt-12 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-end gap-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-12 py-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center gap-4 transition-all shadow-xl shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 font-bold tracking-wide uppercase text-sm"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                          <span>Adding...</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-5 w-5" />
                          <span>Add Word</span>
                        </>
                      )}
                    </button>
                  </div>
                </main>
              </div>
            </FormContainer>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex flex-col items-center gap-4 py-8">
          <div className="h-1 w-16 bg-gray-200 rounded-full"></div>
          <p className="text-xs font-semibold uppercase text-gray-400 tracking-widest">
            Almunji Dictionary Management
          </p>
        </footer>
      </div>
    </div>
  );
};

export default CreateDictionaryPage;
