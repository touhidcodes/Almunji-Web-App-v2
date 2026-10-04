"use client";

import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";
import FormSelect from "@/components/forms/FormSelect";
import FormTextarea from "@/components/forms/FormTextarea";
import { useCreateAyahMutation } from "@/redux/api/ayahApi";
import { useGetAllParaQuery } from "@/redux/api/paraApi";
import { useGetAllSurahQuery } from "@/redux/api/surahApi";
import { AyahSchema } from "@/schema/ayahSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Book, Save, Sparkles } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { z } from "zod";

type TCreateAyah = z.infer<typeof AyahSchema>;

type TApiError = {
  data?: {
    message?: string;
  };
};

const CreateAyahPage: React.FC = () => {
  const [createAyah, { isLoading: isSubmitting }] = useCreateAyahMutation();

  // Fetch all Surahs
  const { data: surahsData, isLoading: isLoadingSurahs } =
    useGetAllSurahQuery();

  // Fetch all Paras
  const { data: parasData, isLoading: isLoadingParas } = useGetAllParaQuery();

  const surahs = surahsData?.data ?? [];
  const paras = parasData?.data ?? [];

  const surahOptions = [...surahs]
    .sort((a, b) => a.chapter - b.chapter)
    .map((surah) => ({
      label: `Surah ${surah.chapter} — ${surah.english}`,
      value: surah.id,
    }));

  const paraOptions = [...paras]
    .sort((a, b) => a.number - b.number)
    .map((para) => ({
      label: `Para ${para.number}`,
      value: para.id,
    }));

  const isLoadingReferences = isLoadingSurahs || isLoadingParas;

  const onSubmit = async (data: TCreateAyah) => {
    try {
      const res = await createAyah(data).unwrap();

      if (res.success) {
        toast.success("Ayah documented successfully!", {
          description: "Verse has been integrated into the central database.",
        });
      }
    } catch (error: unknown) {
      const apiError = error as TApiError;

      toast.error(apiError.data?.message || "Data synchronization failed!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-12 font-poppins">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Navigation */}
        <nav className="flex items-center justify-between pb-6 border-b border-gray-200">
          <Link
            href="/dashboard/admin/manage/ayahs"
            className="group flex items-center gap-2 text-gray-500 hover:text-teal-600 font-semibold uppercase text-xs tracking-widest transition-all"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Ayahs</span>
          </Link>

          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-widest">
            <Sparkles className="h-3 w-3 text-teal-400" />
            New Verse
          </div>
        </nav>

        {/* Header */}
        <header className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="bg-teal-600 p-4 rounded-2xl shadow-xl shadow-teal-100">
              <Book className="h-8 w-8 text-white" />
            </div>

            <div>
              <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
                Create Ayah
              </h1>

              <p className="text-gray-500 font-medium mt-2 text-lg">
                Record Quranic verse with all translations
              </p>
            </div>
          </div>
        </header>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-16 pointer-events-none opacity-5">
            <Book className="h-64 w-64 text-teal-900" />
          </div>

          <div className="p-10 lg:p-16 relative">
            <FormContainer
              onSubmit={onSubmit}
              resolver={zodResolver(AyahSchema)}
              defaultValues={{
                number: 1,
              }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Sidebar */}
                <aside className="lg:col-span-4 space-y-10">
                  <div className="space-y-8">
                    <div className="flex items-center gap-3">
                      <div className="h-1 w-12 bg-teal-600 rounded-full" />

                      <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">
                        Verse Metadata
                      </h3>
                    </div>

                    <div className="space-y-6">
                      {/* Surah */}
                      <FormSelect
                        name="surahId"
                        label="Surah *"
                        placeholder={
                          isLoadingSurahs ? "Loading Surahs..." : "Select Surah"
                        }
                        options={surahOptions}
                        required
                        disabled={isLoadingSurahs}
                      />

                      {/* Para */}
                      <FormSelect
                        name="paraId"
                        label="Para *"
                        placeholder={
                          isLoadingParas ? "Loading Paras..." : "Select Para"
                        }
                        options={paraOptions}
                        required
                        disabled={isLoadingParas}
                      />

                      {/* Ayah Number */}
                      <FormInput
                        name="number"
                        label="Verse Number *"
                        type="number"
                        placeholder="1-286"
                        required
                      />
                    </div>
                  </div>

                  {/* Guidelines */}
                  <div className="p-8 bg-teal-50/50 rounded-2xl border border-teal-100/50 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-teal-600 text-white p-2 rounded-lg shadow-sm">
                        <Sparkles className="h-5 w-5" />
                      </div>

                      <span className="text-sm font-black text-gray-800 uppercase tracking-widest">
                        Guidelines
                      </span>
                    </div>

                    <ul className="space-y-3">
                      {[
                        "Select valid Surah",
                        "Select valid Para",
                        "Correct Verse Number",
                        "All translations required",
                      ].map((rule, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-3 text-xs font-bold text-gray-600 uppercase tracking-tight"
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-teal-300" />
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                </aside>

                {/* Main Content */}
                <main className="lg:col-span-8 space-y-10">
                  <div className="space-y-8">
                    {/* Arabic */}
                    <div className="flex items-center gap-3">
                      <div className="h-1 w-12 bg-purple-500 rounded-full" />

                      <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">
                        Arabic Text
                      </h3>
                    </div>

                    <FormTextarea
                      name="arabic"
                      label="Arabic Text *"
                      rows={5}
                      placeholder="Enter Arabic text..."
                      className="h-32"
                      required
                    />

                    {/* Translations */}
                    <div className="flex items-center gap-3">
                      <div className="h-1 w-12 bg-blue-500 rounded-full" />

                      <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">
                        Translations
                      </h3>
                    </div>

                    <FormTextarea
                      name="transliteration"
                      label="Transliteration"
                      rows={3}
                      placeholder="Transliteration..."
                    />

                    <FormTextarea
                      name="bangla"
                      label="Bangla Translation"
                      rows={4}
                      placeholder="Bangla translation..."
                    />

                    <FormTextarea
                      name="english"
                      label="English Translation"
                      rows={4}
                      placeholder="English translation..."
                    />
                  </div>

                  {/* Submit */}
                  <div className="pt-12 border-t border-gray-100 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting || isLoadingReferences}
                      className="w-full sm:w-auto px-12 py-6 bg-teal-600 hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center gap-4 shadow-xl shadow-teal-200 font-bold uppercase text-sm transition-all"
                    >
                      {isSubmitting ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                      ) : (
                        <Save className="h-5 w-5" />
                      )}

                      <span>
                        {isSubmitting ? "Adding Ayah..." : "Add Ayah"}
                      </span>
                    </button>
                  </div>
                </main>
              </div>
            </FormContainer>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center pb-12">
          <p className="text-xs font-black uppercase text-gray-400 tracking-widest">
            Almunji Global Archival System • Verse Services
          </p>
        </footer>
      </div>
    </div>
  );
};

export default CreateAyahPage;
