"use client";

import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";
import FormSelect from "@/components/forms/FormSelect";
import FormTextarea from "@/components/forms/FormTextarea";
import { useCreateSurahMutation } from "@/redux/api/surahApi";
import { SurahSchema } from "@/schema/surahSchema";
import { TCreateSurahPayload } from "@/types/surah";
import { zodResolver } from "@hookform/resolvers/zod";
import { Book, HelpCircle, Save, Sparkles } from "lucide-react";
import React from "react";
import { toast } from "sonner";

const CreateSurahPage: React.FC = () => {
  const [createSurah, { isLoading: isSubmitting }] = useCreateSurahMutation();

  const revelationOptions = [
    { label: "Meccan", value: "Meccan" },
    { label: "Medinan", value: "Medinan" },
  ];

  const onSubmit = async (data: TCreateSurahPayload) => {
    try {
      const res = await createSurah(data).unwrap();
      if (res.success) {
        toast.success("Surah documented successfully!", {
          description:
            "Chapter record has been integrated into the central database.",
        });
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Data synchronization failed!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 lg:p-12 font-poppins">
      <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-center">
                <Book className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                Create Surah
              </h1>
            </div>
            <p className="text-gray-500 font-medium max-w-md text-sm leading-relaxed uppercase tracking-[0.1em]">
              Establishing chapter structure & metadata
            </p>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm italic text-gray-400 text-xs font-bold uppercase">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            Chapter integrity enforced
          </div>
        </header>

        {/* Main Interface */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-12 pointer-events-none opacity-5">
            <Book className="h-64 w-64 text-indigo-900" />
          </div>

          <div className="p-10 lg:p-16 relative">
            <FormContainer
              onSubmit={onSubmit}
              resolver={zodResolver(SurahSchema)}
              defaultValues={{
                chapter: 1,
                totalAyah: 1,
                revelation: "Meccan",
              }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Taxonomy & Metadata */}
                <aside className="lg:col-span-4 space-y-10 group">
                  <div className="space-y-8">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-1 w-8 bg-indigo-600 rounded-full"></div>
                      <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
                        Chapter Taxonomy
                      </h3>
                    </div>

                    <div className="space-y-6">
                      <FormInput
                        name="chapter"
                        label="Chapter Index Number *"
                        type="number"
                        placeholder="1-114"
                        required
                      />

                      <FormInput
                        name="totalAyah"
                        label="Verse Magnitude (Total) *"
                        type="number"
                        placeholder="7"
                        required
                      />

                      <FormSelect
                        name="revelation"
                        label="Revelation Period *"
                        options={revelationOptions}
                        placeholder="Select Class"
                        required
                      />
                    </div>
                  </div>

                  {/* Taxonomy Guide */}
                  <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100/50 space-y-4">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-indigo-600" />
                      <span className="text-xs font-black text-gray-800 uppercase tracking-widest leading-none">
                        Taxonomy Rules
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {[
                        "Sequential indexing",
                        "Verified verse count",
                        "Revelation context",
                      ].map((rule, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-[11px] font-bold text-gray-500 uppercase tracking-tight"
                        >
                          <div className="h-1 w-1 rounded-full bg-indigo-200"></div>
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                </aside>

                {/* Nomenclature & History */}
                <main className="lg:col-span-8 space-y-10">
                  <div className="space-y-8">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-1 w-8 bg-purple-500 rounded-full"></div>
                      <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
                        Nomenclature
                      </h3>
                    </div>

                    <div className="grid gap-8">
                      <FormInput
                        name="arabic"
                        label="Original Arabic Title *"
                        placeholder="الفاتحة"
                        className="text-right text-3xl font-arabic h-20 px-8 border-indigo-50 focus:border-indigo-500 focus:bg-indigo-50/20"
                        required
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormInput
                          name="english"
                          label="Global Title (English) *"
                          placeholder="Al-Fatihah"
                          required
                        />
                        <FormInput
                          name="bangla"
                          label="Regional Title (Bangla)"
                          placeholder="আল-ফাতিহা"
                        />
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-1 w-8 bg-fuchsia-500 rounded-full"></div>
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
                          Historical Record
                        </h3>
                      </div>

                      <FormTextarea
                        name="history"
                        label="Historical Context & Significance"
                        rows={6}
                        placeholder="Document the primary context and thematic history of this chapter..."
                        className="bg-gray-50/30 border-gray-100 p-6"
                      />
                    </div>
                  </div>

                  {/* Commit Logic */}
                  <div className="pt-12 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-end gap-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-12 py-5 bg-gray-900 hover:bg-black text-white rounded-[1.5rem] flex items-center justify-center gap-4 transition-all shadow-2xl shadow-gray-400/30 hover:shadow-black/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 font-black tracking-widest uppercase text-xs"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-5 w-5" />
                          <span>Commit Chapter</span>
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
        <footer className="text-center pb-12">
          <p className="text-[10px] font-black uppercase text-gray-300 tracking-[0.4em]">
            Almunji Global Archival System • Chapter Services
          </p>
        </footer>
      </div>
    </div>
  );
};

export default CreateSurahPage;
