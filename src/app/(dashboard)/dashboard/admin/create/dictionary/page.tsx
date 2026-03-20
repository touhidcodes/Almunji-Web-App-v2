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
    try {
      const res = await createWord(data).unwrap();
      if (res.success) {
        toast.success("Lexical entry defined!", {
          description:
            "New word has been successfully cataloged in the dictionary.",
        });
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Lexical synchronization failed!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 lg:p-12 font-poppins">
      <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
        {/* Header Navigation */}
        <nav className="flex items-center justify-between pb-4 border-b border-gray-100">
          <Link
            href="/dashboard/admin/manage/dictionary"
            className="group flex items-center gap-2 text-gray-400 hover:text-indigo-600 font-black uppercase text-[10px] tracking-[0.2em] transition-all"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Repository</span>
          </Link>
          <div className="flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none">
            <Sparkles className="h-3 w-3 text-indigo-400" />
            Lexical Integrity Enforced
          </div>
        </nav>

        {/* Hero Section */}
        <header className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-3 rounded-2xl shadow-2xl shadow-indigo-100">
              <Languages className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
              Catalog Word
            </h1>
          </div>
          <p className="text-gray-500 font-medium max-w-lg text-sm leading-relaxed uppercase tracking-[0.1em]">
            Expanding the linguistic bounds of the Almunji lexicon
          </p>
        </header>

        {/* Main Interface */}
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative">
          <div className="absolute -top-24 -right-24 p-12 pointer-events-none opacity-[0.03] rotate-12">
            <Languages className="h-[30rem] w-[30rem] text-indigo-900" />
          </div>

          <div className="p-10 lg:p-20 relative">
            <FormContainer
              onSubmit={onSubmit}
              resolver={zodResolver(DictionarySchema)}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                {/* Structural Definitions */}
                <aside className="lg:col-span-4 space-y-12">
                  <div className="space-y-10">
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-10 bg-indigo-600 rounded-full"></div>
                      <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">
                        Lexical Base
                      </h3>
                    </div>

                    <div className="space-y-8">
                      <FormInput
                        name="word"
                        label="Lexical Unit (Word) *"
                        placeholder="e.g., Ephemeral"
                        className="h-14 bg-gray-50/50 border-gray-100 focus:bg-white rounded-2xl font-bold text-lg"
                        required
                      />

                      <FormInput
                        name="pronunciation"
                        label="Phonetic Guide *"
                        placeholder="e.g., /ɪˈfɛm(ə)r(ə)l/"
                        className="h-14 bg-gray-50/50 border-gray-100 focus:bg-white rounded-2xl font-medium"
                        required
                      />
                    </div>
                  </div>

                  {/* Lexical Protocol */}
                  <div className="p-10 bg-gray-50/50 rounded-[2rem] border border-gray-100/50 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-white p-2 rounded-xl shadow-sm">
                        <HelpCircle className="h-5 w-5 text-indigo-600" />
                      </div>
                      <span className="text-xs font-black text-gray-800 uppercase tracking-widest leading-none">
                        Cataloging Protocol
                      </span>
                    </div>
                    <ul className="space-y-4">
                      {[
                        "Use IPA notation",
                        "Clear concision",
                        "Accurate semantics",
                      ].map((rule, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-3 text-[11px] font-bold text-gray-500 uppercase tracking-tight"
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-indigo-200 shadow-sm shadow-indigo-100"></div>
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                </aside>

                {/* Semantics Hub */}
                <main className="lg:col-span-8 flex flex-col justify-between">
                  <div className="space-y-12">
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-10 bg-purple-500 rounded-full"></div>
                      <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">
                        Semantics
                      </h3>
                    </div>

                    <FormTextarea
                      name="definition"
                      label="Conceptual Definition *"
                      rows={10}
                      placeholder="Articulate the semantic meaning and contextual boundaries of this word..."
                      className="bg-gray-50/30 border-gray-100 rounded-3xl p-8 focus:bg-white leading-relaxed text-gray-700"
                      required
                    />
                  </div>

                  {/* Submission Logic */}
                  <div className="pt-16 mt-16 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-end gap-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-16 py-6 bg-gray-900 hover:bg-black text-white rounded-[2rem] flex items-center justify-center gap-4 transition-all shadow-2xl shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 font-black tracking-[0.2em] uppercase text-xs"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                          <span>Synchronizing...</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-5 w-5" />
                          <span>Catalog Entry</span>
                        </>
                      )}
                    </button>
                  </div>
                </main>
              </div>
            </FormContainer>
          </div>
        </div>

        {/* Infrastructure Audit */}
        <footer className="flex flex-col items-center gap-4 py-12">
          <div className="h-1 w-12 bg-gray-100 rounded-full"></div>
          <p className="text-[10px] font-black uppercase text-gray-300 tracking-[0.5em]">
            Almunji Linguistic Repository Index
          </p>
        </footer>
      </div>
    </div>
  );
};

export default CreateDictionaryPage;
