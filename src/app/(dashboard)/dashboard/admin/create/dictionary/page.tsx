"use client";

import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";
import FormTextarea from "@/components/forms/FormTextarea";
import { useCreateWordMutation } from "@/redux/api/dictionaryApi";
import { DictionarySchema } from "@/schema/dictionarySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  BookOpenText,
  Languages,
  Save,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";
import { z } from "zod";

type TCreateDictionaryWord = z.infer<typeof DictionarySchema>;

type TApiError = {
  data?: {
    message?: string;
  };
};

const CreateDictionaryPage: React.FC = () => {
  const [createWord, { isLoading: isSubmitting }] = useCreateWordMutation();

  const onSubmit = async (data: TCreateDictionaryWord) => {
    try {
      const res = await createWord(data).unwrap();

      if (res.success) {
        toast.success("Dictionary word created successfully!", {
          description:
            "The Persian word has been successfully added to the dictionary.",
        });
      }
    } catch (error: unknown) {
      const apiError = error as TApiError;

      toast.error(
        apiError.data?.message || "Failed to create dictionary word!",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-12 font-poppins">
      <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
        {/* Header Navigation */}
        <nav className="flex items-center justify-between pb-6 border-b border-gray-200">
          <Link
            href="/dashboard/admin/manage/dictionary"
            className="group flex items-center gap-2 text-gray-500 hover:text-teal-600 font-semibold uppercase text-xs tracking-widest transition-all"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Dictionary</span>
          </Link>

          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-widest leading-none">
            <Sparkles className="h-3 w-3 text-teal-400" />
            New Dictionary Entry
          </div>
        </nav>

        {/* Hero Section */}
        <header className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="bg-teal-600 p-4 rounded-2xl shadow-xl shadow-teal-100">
              <Languages className="h-8 w-8 text-white" />
            </div>

            <div>
              <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
                Add Dictionary Word
              </h1>

              <p className="text-gray-500 font-medium mt-2 text-lg">
                Add Persian vocabulary with translations and examples
              </p>
            </div>
          </div>
        </header>

        {/* Main Interface */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative">
          {/* Decorative Icon */}
          <div className="absolute -top-32 -right-32 p-16 pointer-events-none opacity-[0.02] rotate-12">
            <BookOpenText className="h-[40rem] w-[40rem] text-teal-900" />
          </div>

          <div className="p-10 lg:p-16 relative">
            <FormContainer
              onSubmit={onSubmit}
              resolver={zodResolver(DictionarySchema)}
            >
              <div className="space-y-12">
                {/* ========================================= */}
                {/* WORD INFORMATION */}
                {/* ========================================= */}

                <section className="space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="h-1 w-12 bg-teal-600 rounded-full" />

                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">
                      Word Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Persian Word */}
                    <FormInput
                      name="persianWord"
                      label="Persian Word *"
                      placeholder="مثلاً: کتاب"
                      className="h-14 bg-gray-50/50 border-gray-100 focus:bg-white rounded-xl font-bold text-lg"
                      required
                    />

                    {/* Transliteration */}
                    <FormInput
                      name="transliteration"
                      label="Transliteration"
                      placeholder="e.g., Ketab"
                      className="h-14 bg-gray-50/50 border-gray-100 focus:bg-white rounded-xl font-medium"
                    />
                  </div>
                </section>

                {/* ========================================= */}
                {/* MEANINGS */}
                {/* ========================================= */}

                <section className="space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="h-1 w-12 bg-purple-500 rounded-full" />

                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">
                      Meanings & Translations
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Bangla Meaning */}
                    <FormTextarea
                      name="banglaMeaning"
                      label="Bangla Meaning *"
                      rows={5}
                      placeholder="বাংলা অর্থ লিখুন..."
                      className="bg-gray-50/30 border-gray-100 rounded-2xl p-6 focus:bg-white leading-relaxed text-gray-700"
                      required
                    />

                    {/* English Meaning */}
                    <FormTextarea
                      name="englishMeaning"
                      label="English Meaning"
                      rows={5}
                      placeholder="Enter English meaning..."
                      className="bg-gray-50/30 border-gray-100 rounded-2xl p-6 focus:bg-white leading-relaxed text-gray-700"
                    />
                  </div>
                </section>

                {/* ========================================= */}
                {/* EXAMPLES */}
                {/* ========================================= */}

                <section className="space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="h-1 w-12 bg-teal-500 rounded-full" />

                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">
                      Usage Examples
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Persian Example */}
                    <FormTextarea
                      name="exampleFA"
                      label="Persian Example"
                      rows={6}
                      placeholder="جمله فارسی را وارد کنید..."
                      className="bg-gray-50/30 border-gray-100 rounded-2xl p-6 focus:bg-white leading-relaxed text-gray-700"
                    />

                    {/* English Example */}
                    <FormTextarea
                      name="exampleEN"
                      label="English Example"
                      rows={6}
                      placeholder="Enter the English example..."
                      className="bg-gray-50/30 border-gray-100 rounded-2xl p-6 focus:bg-white leading-relaxed text-gray-700"
                    />

                    {/* Bangla Example */}
                    <FormTextarea
                      name="exampleBN"
                      label="Bangla Example"
                      rows={6}
                      placeholder="বাংলা উদাহরণ বাক্য লিখুন..."
                      className="bg-gray-50/30 border-gray-100 rounded-2xl p-6 focus:bg-white leading-relaxed text-gray-700"
                    />
                  </div>
                </section>

                {/* GUIDELINES */}

                <section className="p-8 bg-teal-50/50 rounded-2xl border border-teal-100/50 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-teal-600 text-white p-2 rounded-lg shadow-sm">
                      <Sparkles className="h-5 w-5" />
                    </div>

                    <span className="text-sm font-black text-gray-800 uppercase tracking-widest leading-none">
                      Entry Guidelines
                    </span>
                  </div>

                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      "Provide the correct Persian word",
                      "Use accurate transliteration",
                      "Bangla meaning is required",
                      "English meaning is optional",
                      "Use natural Persian example sentences",
                      "Keep translations semantically accurate",
                    ].map((rule) => (
                      <li
                        key={rule}
                        className="flex items-center gap-3 text-xs font-bold text-gray-600 uppercase tracking-tight"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-teal-300 shadow-sm" />
                        {rule}
                      </li>
                    ))}
                  </ul>
                </section>

                {/* ACTION */}

                <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-end gap-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-12 py-6 bg-teal-600 hover:bg-teal-700 text-white rounded-xl flex items-center justify-center gap-4 transition-all shadow-xl shadow-teal-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed font-bold tracking-wide uppercase text-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
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
              </div>
            </FormContainer>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex flex-col items-center gap-4 py-8">
          <div className="h-1 w-16 bg-gray-200 rounded-full" />

          <p className="text-xs font-semibold uppercase text-gray-400 tracking-widest">
            Almunji Global Archival System • Dictionary Services
          </p>
        </footer>
      </div>
    </div>
  );
};

export default CreateDictionaryPage;
