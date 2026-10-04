"use client";

import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";
import FormSelect from "@/components/forms/FormSelect";
import FormTextarea from "@/components/forms/FormTextarea";

import {
  useCreateSurahMutation,
  useGetAllSurahQuery,
} from "@/redux/api/surahApi";

import { SurahSchema } from "@/schema/surahSchema";

import { zodResolver } from "@hookform/resolvers/zod";

import { Book, CheckCircle2, Save, Sparkles } from "lucide-react";

import { toast } from "sonner";
import { z } from "zod";

type TCreateSurah = z.infer<typeof SurahSchema>;

type TApiError = {
  data?: {
    message?: string;
  };
};

const CreateSurahPage: React.FC = () => {
  const { data: surahsData, isLoading: isLoadingSurahs } = useGetAllSurahQuery(
    {},
  );

  const [createSurah, { isLoading: isSubmitting }] = useCreateSurahMutation();

  const surahs = surahsData?.data || [];

  // Existing Surah chapter numbers
  const existingSurahNumbers = new Set(
    surahs.map((surah) => Number(surah.chapter)),
  );

  // Valid Surah numbers: 1-114
  const allSurahNumbers = Array.from({ length: 114 }, (_, index) => index + 1);

  // Only missing Surahs can be created
  const missingSurahNumbers = allSurahNumbers.filter(
    (number) => !existingSurahNumbers.has(number),
  );

  const allSurahsCreated = missingSurahNumbers.length === 0;

  const defaultChapter = missingSurahNumbers[0] || 1;

  const revelationOptions = [
    {
      label: "Meccan",
      value: "Meccan",
    },
    {
      label: "Medinan",
      value: "Medinan",
    },
  ];

  const chapterOptions = missingSurahNumbers.map((number) => ({
    label: `Surah ${number}`,
    value: String(number),
  }));

  const onSubmit = async (data: TCreateSurah) => {
    const chapter = Number(data.chapter);

    // Validate chapter range
    if (chapter < 1 || chapter > 114) {
      toast.error("Invalid Surah number", {
        description: "Surah chapter number must be between 1 and 114.",
      });

      return;
    }

    // Prevent duplicate Surah
    if (existingSurahNumbers.has(chapter)) {
      toast.error("Surah already exists", {
        description: `Surah ${chapter} has already been created.`,
      });

      return;
    }

    try {
      const res = await createSurah({
        ...data,
        chapter,
      }).unwrap();

      if (res.success) {
        toast.success("Surah documented successfully!", {
          description:
            "Chapter record has been integrated into the central database.",
        });
      }
    } catch (error: unknown) {
      const apiError = error as TApiError;

      toast.error(apiError.data?.message || "Data synchronization failed!");
    }
  };

  // Loading Surahs
  if (isLoadingSurahs) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />

          <p className="text-sm font-semibold uppercase tracking-widest text-gray-400">
            Loading Surahs...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-poppins lg:p-12">
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Header */}
        <header className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-teal-600 p-4 shadow-xl shadow-teal-100">
              <Book className="h-8 w-8 text-white" />
            </div>

            <div>
              <h1 className="text-4xl font-black tracking-tight text-gray-900 lg:text-5xl">
                Create Surah
              </h1>

              <p className="mt-2 text-lg font-medium text-gray-500">
                Establish chapter structure & metadata
              </p>
            </div>
          </div>
        </header>

        {/* Surah Progress */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-gray-900">Surah Progress</h2>

              <p className="mt-1 text-sm text-gray-500">
                {surahs.length} of 114 Surahs have been created.
              </p>
            </div>

            <div className="rounded-full bg-teal-50 px-4 py-2 text-sm font-bold text-teal-700">
              {surahs.length}/114
            </div>
          </div>

          {/* 1-114 Grid */}
          <div className="grid grid-cols-6 gap-2 sm:grid-cols-10 md:grid-cols-15 lg:grid-cols-19">
            {allSurahNumbers.map((number) => {
              const exists = existingSurahNumbers.has(number);

              return (
                <div
                  key={number}
                  className={`flex h-9 items-center justify-center rounded-lg text-xs font-bold transition ${
                    exists
                      ? "bg-teal-600 text-white"
                      : "bg-gray-100 text-gray-400"
                  }`}
                  title={
                    exists
                      ? `Surah ${number} exists`
                      : `Surah ${number} is missing`
                  }
                >
                  {number}
                </div>
              );
            })}
          </div>
        </div>

        {/* All Surahs Created */}
        {allSurahsCreated ? (
          <div className="rounded-3xl border border-green-100 bg-white p-12 text-center shadow-xl shadow-gray-200/50">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>

            <h2 className="text-2xl font-black text-gray-900">
              All 114 Surahs Are Created
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-gray-500">
              The Quranic Surah structure is complete. No additional Surah can
              be created because all chapter numbers from 1 to 114 already
              exist.
            </p>
          </div>
        ) : (
          /* Create Form */
          <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl shadow-gray-200/50">
            <div className="pointer-events-none absolute right-0 top-0 p-16 opacity-5">
              <Book className="h-64 w-64 text-teal-900" />
            </div>

            <div className="relative p-10 lg:p-16">
              <FormContainer
                onSubmit={onSubmit}
                resolver={zodResolver(SurahSchema)}
                defaultValues={{
                  chapter: defaultChapter,
                  totalAyah: 1,
                  revelation: "Meccan",
                }}
              >
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
                  {/* Sidebar */}
                  <aside className="space-y-10 lg:col-span-4">
                    <div className="space-y-8">
                      <div className="flex items-center gap-3">
                        <div className="h-1 w-12 rounded-full bg-teal-600" />

                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">
                          Chapter Taxonomy
                        </h3>
                      </div>

                      <div className="space-y-6">
                        {/* Chapter */}
                        <FormSelect
                          name="chapter"
                          label="Chapter Index Number *"
                          options={chapterOptions}
                          placeholder="Select Surah"
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

                    {/* Taxonomy Rules */}
                    <div className="space-y-4 rounded-2xl border border-teal-100/50 bg-teal-50/50 p-8">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-teal-600 p-2 text-white shadow-sm">
                          <Sparkles className="h-5 w-5" />
                        </div>

                        <span className="text-sm font-black uppercase tracking-widest text-gray-800">
                          Taxonomy Rules
                        </span>
                      </div>

                      <ul className="space-y-3">
                        {[
                          "Only chapter numbers 1-114",
                          "Only missing Surahs",
                          "Sequential indexing",
                          "Verified verse count",
                          "Revelation context",
                        ].map((rule) => (
                          <li
                            key={rule}
                            className="flex items-center gap-3 text-xs font-bold uppercase tracking-tight text-gray-600"
                          >
                            <div className="h-1.5 w-1.5 rounded-full bg-teal-300" />

                            {rule}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </aside>

                  {/* Main */}
                  <main className="space-y-10 lg:col-span-8">
                    <div className="space-y-8">
                      <div className="flex items-center gap-3">
                        <div className="h-1 w-12 rounded-full bg-purple-500" />

                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">
                          Nomenclature
                        </h3>
                      </div>

                      <div className="grid gap-8">
                        <FormInput
                          name="arabic"
                          label="Original Arabic Title *"
                          placeholder="الفاتحة"
                          className="h-20 px-8 text-right text-3xl font-bold"
                          required
                        />

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
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

                        <div className="flex items-center gap-3">
                          <div className="h-1 w-12 rounded-full bg-fuchsia-500" />

                          <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">
                            Historical Record
                          </h3>
                        </div>

                        <FormTextarea
                          name="history"
                          label="Historical Context & Significance"
                          rows={6}
                          placeholder="Document the primary context and thematic history..."
                        />
                      </div>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end border-t border-gray-100 pt-12">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex w-full items-center justify-center gap-4 rounded-xl bg-teal-600 px-12 py-6 text-sm font-bold uppercase text-white shadow-xl shadow-teal-200 transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                      >
                        {isSubmitting ? (
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                          <Save className="h-5 w-5" />
                        )}

                        <span>
                          {isSubmitting ? "Creating..." : "Commit Chapter"}
                        </span>
                      </button>
                    </div>
                  </main>
                </div>
              </FormContainer>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="pb-12 text-center">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400">
            Almunji Global Archival System • Chapter Services
          </p>
        </footer>
      </div>
    </div>
  );
};

export default CreateSurahPage;
