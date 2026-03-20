"use client";

import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";
import FormSelect from "@/components/forms/FormSelect";
import FormTextarea from "@/components/forms/FormTextarea";
import Loading from "@/components/shared/Loading/Loading";
import { useCreateAyahMutation } from "@/redux/api/ayahApi";
import { useGetAllParasQuery } from "@/redux/api/paraApi";
import { useGetAllSurahQuery } from "@/redux/api/surahApi";
import { AyahSchema } from "@/schema/ayahSchema";
import { TCreateAyahPayload } from "@/types/ayah";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, HelpCircle, Save, Sparkles } from "lucide-react";
import React from "react";
import { toast } from "sonner";

const CreateAyahPage: React.FC = () => {
  const [createAyah, { isLoading: isSubmitting }] = useCreateAyahMutation();
  const { data: surahsData, isLoading: surahsLoading } = useGetAllSurahQuery(
    {},
  );
  const { data: parasData, isLoading: parasLoading } = useGetAllParasQuery({});

  const surahOptions =
    surahsData?.data?.map((surah) => ({
      label: `${surah.chapter}. ${surah.english} (${surah.arabic})`,
      value: surah.id,
    })) || [];

  const paraOptions =
    parasData?.data?.map((para) => ({
      label: `Para ${para.number} - ${para.english || para.arabic}`,
      value: para.id,
    })) || [];

  const onSubmit = async (data: TCreateAyahPayload) => {
    try {
      const res = await createAyah(data).unwrap();
      if (res.success) {
        toast.success("Ayah archived successfully!", {
          description:
            "New verse record has been permanently added to the ledger.",
        });
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Transmission interrupted!");
    }
  };

  if (surahsLoading || parasLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 lg:p-12 font-poppins">
      <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
        {/* Header - Minimalist Style */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-600 p-2.5 rounded-2xl shadow-xl shadow-emerald-100 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                Create Ayah
              </h1>
            </div>
            <p className="text-gray-500 font-medium max-w-md text-sm leading-relaxed uppercase tracking-[0.1em]">
              Precision archival of Quranic revelation
            </p>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm italic text-gray-400 text-xs font-bold uppercase">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            Metadata integrity required
          </div>
        </header>

        {/* Main Interface */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-12 pointer-events-none opacity-5">
            <BookOpen className="h-64 w-64 text-emerald-900" />
          </div>

          <div className="p-10 lg:p-16 relative">
            <FormContainer
              onSubmit={onSubmit}
              resolver={zodResolver(AyahSchema)}
              defaultValues={{
                number: 1,
              }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Reference Controls */}
                <aside className="lg:col-span-4 space-y-10 group">
                  <div className="space-y-8">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-1 w-8 bg-emerald-600 rounded-full"></div>
                      <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
                        Contextual Indexing
                      </h3>
                    </div>

                    <div className="space-y-6">
                      <FormSelect
                        name="surahId"
                        label="Source Chapter (Surah) *"
                        options={surahOptions}
                        placeholder="Select Surah"
                        required
                      />

                      <FormSelect
                        name="paraId"
                        label="Segment Unit (Para) *"
                        options={paraOptions}
                        placeholder="Select Para"
                        required
                      />

                      <FormInput
                        name="number"
                        label="Verse Coordinates (Ayah) *"
                        type="number"
                        placeholder="1"
                        required
                      />
                    </div>
                  </div>

                  {/* Operational Guide */}
                  <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100/50 space-y-4">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-emerald-600" />
                      <span className="text-xs font-black text-gray-800 uppercase tracking-widest leading-none">
                        Archivist Protocol
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {[
                        "Arabic script accuracy",
                        "Refined translit",
                        "Verse coordinate parity",
                      ].map((rule, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-[11px] font-bold text-gray-500 uppercase tracking-tight"
                        >
                          <div className="h-1 w-1 rounded-full bg-emerald-200"></div>
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                </aside>

                {/* Content Input Hub */}
                <main className="lg:col-span-8 space-y-10">
                  <div className="space-y-8">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-1 w-8 bg-teal-500 rounded-full"></div>
                      <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
                        Revelation Data
                      </h3>
                    </div>

                    <div className="grid gap-8">
                      <FormTextarea
                        name="arabic"
                        label="Sacred Arabic Text *"
                        rows={4}
                        placeholder="Enter Arabic revelation..."
                        className="text-right text-3xl font-arabic h-40 leading-[1.8] p-8 border-emerald-50 focus:border-emerald-500 focus:bg-emerald-50/20"
                        required
                      />

                      <FormTextarea
                        name="transliteration"
                        label="Phonetic Transliteration"
                        rows={2}
                        placeholder="Bismillaahir Rahmaanir Raheem..."
                        className="italic font-medium text-gray-600 p-6"
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormTextarea
                          name="english"
                          label="English Interpretation"
                          rows={4}
                          placeholder="Global language meaning..."
                          className="bg-gray-50/30 border-gray-100 p-6"
                        />
                        <FormTextarea
                          name="bangla"
                          label="Bangla Contextualization"
                          rows={4}
                          placeholder="Native context meaning..."
                          className="bg-gray-50/30 border-gray-100 p-6"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submission Logic */}
                  <div className="pt-12 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-end gap-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-12 py-5 bg-gray-900 hover:bg-black text-white rounded-[1.5rem] flex items-center justify-center gap-4 transition-all shadow-2xl shadow-gray-400/30 hover:shadow-black/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 font-black tracking-widest uppercase text-xs"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                          <span>Committing...</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-5 w-5" />
                          <span>Archive Verse</span>
                        </>
                      )}
                    </button>
                  </div>
                </main>
              </div>
            </FormContainer>
          </div>
        </div>

        {/* System Message */}
        <footer className="text-center pb-12">
          <p className="text-[10px] font-black uppercase text-gray-300 tracking-[0.4em]">
            Almunji Global Archival System • Established 2024
          </p>
        </footer>
      </div>
    </div>
  );
};

export default CreateAyahPage;
