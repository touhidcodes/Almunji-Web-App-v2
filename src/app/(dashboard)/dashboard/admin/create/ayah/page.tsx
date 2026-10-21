"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Book,
  BookOpenText,
  CheckCircle2,
  FileText,
  LoaderCircle,
  Plus,
  Save,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";
import FormSelect from "@/components/forms/FormSelect";
import FormTextarea from "@/components/forms/FormTextarea";
import FormTags from "@/components/forms/FormTags";

import { useCreateAyahMutation } from "@/redux/api/ayahApi";
import { useGetAllParaQuery } from "@/redux/api/paraApi";
import { useGetAllSurahQuery } from "@/redux/api/surahApi";
import { useCreateTafsirMutation } from "@/redux/api/tafsirApi";

import { type TCreateAyah } from "@/schema/ayahSchema";
import {
  CreateAyahWithTafsirSchema,
  type TCreateAyahWithTafsir,
} from "@/schema/ayahWithTafsirSchema";

import type { TCreateTafsirPayload } from "@/types/tafsir";
import type { TCreatedAyahResponse } from "@/types/ayah";

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof error.data === "object" &&
    error.data !== null &&
    "message" in error.data &&
    typeof error.data.message === "string"
  ) {
    return error.data.message;
  }

  return fallback;
};

const CreateAyahPage: React.FC = () => {
  const searchParams = useSearchParams();

  const [createAyah, { isLoading: isCreatingAyah }] = useCreateAyahMutation();

  const [createTafsir, { isLoading: isCreatingTafsir }] =
    useCreateTafsirMutation();

  const { data: surahsData, isLoading: isLoadingSurahs } =
    useGetAllSurahQuery();

  const { data: parasData, isLoading: isLoadingParas } = useGetAllParaQuery();

  const [addTafsirMode, setAddTafsirMode] = useState(
    searchParams.get("withTafsir") === "true",
  );

  const [createdAyahId, setCreatedAyahId] = useState<string | null>(null);

  const [isAyahCreated, setIsAyahCreated] = useState(false);
  const [isTafsirCreated, setIsTafsirCreated] = useState(false);

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
  const isSubmitting = isCreatingAyah || isCreatingTafsir;

  const handleEnableTafsir = () => {
    if (isTafsirCreated) {
      toast.info("Tafsir has already been created for this Ayah.");
      return;
    }

    if (isAyahCreated && !createdAyahId) {
      toast.error(
        "The Ayah was created, but its ID was not returned by the API.",
        {
          description:
            "Check the create Ayah response before adding its Tafsir.",
        },
      );
      return;
    }

    setAddTafsirMode(true);
  };

  const handleSubmit = async (data: TCreateAyahWithTafsir) => {
    let ayahId = createdAyahId;

    try {
      /*
       * STEP 1:
       * Create the Ayah if it has not already been saved.
       */
      if (!isAyahCreated) {
        const ayahPayload: TCreateAyah = {
          surahId: data.surahId,
          paraId: data.paraId,
          number: data.number,
          arabic: data.arabic,
          transliteration: data.transliteration,
          bangla: data.bangla,
          english: data.english,
        };

        const ayahResponse = await createAyah(ayahPayload).unwrap();

        if (!ayahResponse.success) {
          toast.error("Failed to create Ayah.");
          return;
        }

        const responseData = ayahResponse.data as
          | TCreatedAyahResponse
          | undefined;

        ayahId = responseData?.id ?? responseData?.data?.id ?? null;

        // Save the Ayah state immediately after a successful API response.
        setIsAyahCreated(true);
        setCreatedAyahId(ayahId);

        toast.success("Ayah created successfully!");
      }

      /*
       * STEP 2:
       * If Tafsir mode is disabled, stop here.
       * This allows the admin to create only an Ayah.
       */
      if (!addTafsirMode) {
        return;
      }

      /*
       * STEP 3:
       * Tafsir requires the ID of the saved Ayah.
       */
      if (!ayahId) {
        toast.error("The Ayah was created, but its ID is missing.", {
          description:
            "The API must return the created Ayah ID to associate a Tafsir.",
        });
        return;
      }

      const tafsirPayload: TCreateTafsirPayload = {
        ayahId,
        heading: data.heading?.trim() || undefined,
        summaryBn: data.summaryBn?.trim() || undefined,
        summaryEn: data.summaryEn?.trim() || undefined,
        detailBn: data.detailBn?.trim() || undefined,
        detailEn: data.detailEn?.trim() || undefined,
        scholar: data.scholar?.trim() || undefined,
        reference: data.reference?.trim() || undefined,
        tags: data.tags?.trim() || undefined,
      };

      const tafsirResponse = await createTafsir(tafsirPayload).unwrap();

      if (!tafsirResponse.success) {
        toast.error("Ayah created, but Tafsir creation failed.");
        return;
      }

      setIsTafsirCreated(true);
      setAddTafsirMode(false);

      toast.success("Ayah and Tafsir created successfully!", {
        description: "Both records have been saved.",
      });
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(
          error,
          addTafsirMode ? "Failed to create Tafsir." : "Failed to create Ayah.",
        ),
        {
          description:
            isAyahCreated && addTafsirMode
              ? "The Ayah is already saved. Retry Tafsir creation without duplicating the Ayah."
              : undefined,
        },
      );
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 font-poppins sm:p-6 lg:p-12">
      <div className="mx-auto max-w-6xl space-y-8 sm:space-y-10">
        {/* Navigation */}
        <nav className="flex items-center justify-between gap-3 border-b border-gray-200 pb-5">
          <Link
            href="/dashboard/admin/manage/ayah"
            className="group flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-500 transition hover:text-teal-600"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Ayahs
          </Link>

          <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
            <Sparkles className="h-4 w-4 text-teal-500" />
            Verse Services
          </span>
        </nav>

        {/* Header */}
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-teal-600 p-3 shadow-lg shadow-teal-100 sm:p-4">
              <Book className="h-7 w-7 text-white sm:h-8 sm:w-8" />
            </div>

            <div>
              <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
                Create Ayah
              </h1>
              <p className="mt-2 text-sm text-gray-500 sm:text-base">
                Create a verse independently or include its Tafsir.
              </p>
            </div>
          </div>
        </header>

        <FormContainer
          onSubmit={handleSubmit}
          resolver={zodResolver(CreateAyahWithTafsirSchema)}
          defaultValues={{
            number: 1,
            surahId: "",
            paraId: "",
            arabic: "",
            transliteration: "",
            bangla: "",
            english: "",
            heading: "",
            summaryBn: "",
            summaryEn: "",
            detailBn: "",
            detailEn: "",
            scholar: "",
            reference: "",
            tags: "",
          }}
        >
          {/* Ayah section */}
          <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl shadow-gray-200/40">
            <div className="flex items-center justify-between gap-3 border-b border-gray-100 bg-white px-5 py-5 sm:px-8">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-teal-50 p-2.5 text-teal-700">
                  <BookOpenText className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-bold text-gray-900">Ayah Information</h2>
                  <p className="text-xs text-gray-500">
                    Step 1 · Verse metadata and translations
                  </p>
                </div>
              </div>

              {isAyahCreated && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">
                  <CheckCircle2 className="h-4 w-4" />
                  Created
                </span>
              )}
            </div>

            <div className="p-5 sm:p-8 lg:p-10">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
                {/* Metadata */}
                <aside className="space-y-6 lg:col-span-4">
                  <div className="flex items-center gap-3">
                    <div className="h-1 w-10 rounded-full bg-teal-600" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">
                      Verse Metadata
                    </h3>
                  </div>

                  <FormSelect
                    name="surahId"
                    label="Surah *"
                    placeholder={
                      isLoadingSurahs ? "Loading Surahs..." : "Select Surah"
                    }
                    options={surahOptions}
                    required
                    disabled={isLoadingSurahs || isAyahCreated}
                  />

                  <FormSelect
                    name="paraId"
                    label="Para *"
                    placeholder={
                      isLoadingParas ? "Loading Paras..." : "Select Para"
                    }
                    options={paraOptions}
                    required
                    disabled={isLoadingParas || isAyahCreated}
                  />

                  <FormInput
                    name="number"
                    label="Verse Number *"
                    type="number"
                    placeholder="Enter verse number"
                    required
                    disabled={isAyahCreated}
                  />

                  <div className="rounded-2xl border border-teal-100 bg-teal-50/60 p-5">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-teal-600" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-800">
                        Guidelines
                      </h3>
                    </div>

                    <ul className="mt-4 space-y-2 text-xs leading-5 text-gray-600">
                      <li>• Verify the Surah and Para.</li>
                      <li>• Confirm the verse number.</li>
                      <li>• Check the Arabic text carefully.</li>
                      <li>• Review all translations before saving.</li>
                    </ul>
                  </div>
                </aside>

                {/* Verse text */}
                <div className="space-y-7 lg:col-span-8">
                  <div className="flex items-center gap-3">
                    <div className="h-1 w-10 rounded-full bg-purple-500" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">
                      Arabic Text
                    </h3>
                  </div>

                  <FormTextarea
                    name="arabic"
                    label="Arabic Text *"
                    rows={5}
                    placeholder="Enter the original Arabic verse..."
                    required
                    disabled={isAyahCreated}
                    className="text-right font-arabic text-2xl leading-loose"
                  />

                  <div className="flex items-center gap-3 pt-2">
                    <div className="h-1 w-10 rounded-full bg-blue-500" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">
                      Translations
                    </h3>
                  </div>

                  <FormTextarea
                    name="transliteration"
                    label="Transliteration"
                    rows={3}
                    placeholder="Enter transliteration..."
                    disabled={isAyahCreated}
                  />

                  <FormTextarea
                    name="bangla"
                    label="Bangla Translation"
                    rows={4}
                    placeholder="Enter the Bangla translation..."
                    disabled={isAyahCreated}
                  />

                  <FormTextarea
                    name="english"
                    label="English Translation"
                    rows={4}
                    placeholder="Enter the English translation..."
                    disabled={isAyahCreated}
                  />
                </div>
              </div>

              {/* Ayah submission actions */}
              <div className="mt-8 flex flex-col gap-4 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-5 text-gray-400">
                  {isAyahCreated
                    ? "The Ayah has been saved successfully."
                    : addTafsirMode
                      ? "Tafsir mode is enabled. Submit both records below."
                      : "Create the Ayah alone or include its Tafsir."}
                </p>

                {!isTafsirCreated && (
                  <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                    {/* Add Tafsir */}
                    {!addTafsirMode && (
                      <button
                        type="button"
                        onClick={handleEnableTafsir}
                        disabled={
                          isSubmitting ||
                          isLoadingReferences ||
                          (isAyahCreated && !createdAyahId)
                        }
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-100 transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                      >
                        <Plus className="h-4 w-4" />
                        Add Tafsir
                      </button>
                    )}

                    {/* Create Ayah only */}
                    {!isAyahCreated && !addTafsirMode && (
                      <button
                        type="submit"
                        disabled={isSubmitting || isLoadingReferences}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-100 transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                      >
                        {isCreatingAyah ? (
                          <LoaderCircle className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        {isCreatingAyah ? "Creating Ayah..." : "Create Ayah"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Tafsir section */}
          {addTafsirMode && !isTafsirCreated && (
            <section className="mt-8 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl shadow-gray-200/40">
              <div className="flex items-center gap-3 border-b border-gray-100 bg-white px-5 py-5 sm:px-8">
                <div className="rounded-xl bg-teal-50 p-2.5 text-teal-700">
                  <FileText className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-bold text-gray-900">
                    Tafsir Information
                  </h2>
                  <p className="text-xs text-gray-500">
                    Step 2 · Explanation, summaries, and sources
                  </p>
                </div>
              </div>

              <div className="space-y-7 p-5 sm:p-8 lg:p-10">
                {createdAyahId && (
                  <div className="rounded-xl border border-green-100 bg-green-50 p-4">
                    <p className="text-sm font-semibold text-green-800">
                      Ayah already created
                    </p>
                    <p className="mt-1 break-all font-mono text-xs text-green-700">
                      Ayah ID: {createdAyahId}
                    </p>
                    <p className="mt-2 text-xs text-green-700">
                      Submitting will create only the Tafsir.
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="h-1 w-10 rounded-full bg-purple-500" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">
                    Overview
                  </h3>
                </div>

                <FormInput
                  name="heading"
                  label="Tafsir Heading"
                  placeholder="Enter a descriptive heading..."
                  disabled={isTafsirCreated}
                />

                <div className="flex items-center gap-3 pt-2">
                  <div className="h-1 w-10 rounded-full bg-blue-500" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">
                    Summaries
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormTextarea
                    name="summaryBn"
                    label="Bangla Summary"
                    rows={5}
                    placeholder="সংক্ষিপ্ত তাফসির লিখুন..."
                    disabled={isTafsirCreated}
                  />

                  <FormTextarea
                    name="summaryEn"
                    label="English Summary"
                    rows={5}
                    placeholder="Enter the English summary..."
                    disabled={isTafsirCreated}
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <div className="h-1 w-10 rounded-full bg-teal-500" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">
                    Detailed Explanation
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormTextarea
                    name="detailBn"
                    label="Detailed Tafsir (Bangla)"
                    rows={8}
                    placeholder="বিস্তারিত তাফসির লিখুন..."
                    disabled={isTafsirCreated}
                  />

                  <FormTextarea
                    name="detailEn"
                    label="Detailed Tafsir (English)"
                    rows={8}
                    placeholder="Enter the detailed English Tafsir..."
                    disabled={isTafsirCreated}
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <div className="h-1 w-10 rounded-full bg-amber-500" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">
                    Source and Attribution
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormInput
                    name="scholar"
                    label="Scholar"
                    placeholder="e.g. Ibn Kathir"
                    disabled={isTafsirCreated}
                  />

                  <FormInput
                    name="reference"
                    label="Reference"
                    placeholder="Book, volume, page, or source..."
                    disabled={isTafsirCreated}
                  />
                </div>

                <FormTags
                  name="tags"
                  label="Tafsir Tags"
                  placeholder="Type a tag and press Enter..."
                  description="Add relevant topics such as Tawheed, patience, guidance, or prayer."
                />

                <div className="flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs leading-5 text-gray-400">
                    {createdAyahId
                      ? "The existing Ayah will not be recreated."
                      : "The Ayah is created first, then its Tafsir."}
                  </p>

                  <button
                    type="submit"
                    disabled={isSubmitting || isTafsirCreated}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-100 transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                  >
                    {isSubmitting ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}

                    {isCreatingAyah
                      ? "Creating Ayah..."
                      : isCreatingTafsir
                        ? "Creating Tafsir..."
                        : createdAyahId
                          ? "Create Tafsir"
                          : "Create Ayah & Tafsir"}
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Success state */}
          {isAyahCreated && !addTafsirMode && !isTafsirCreated && (
            <section className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-5">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                <div>
                  <h2 className="font-semibold text-green-900">
                    Ayah created successfully
                  </h2>
                  <p className="mt-1 text-sm text-green-800">
                    The Ayah has been saved. You can finish here or add its
                    Tafsir using the button above.
                  </p>
                </div>
              </div>
            </section>
          )}

          {isTafsirCreated && (
            <section className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-5">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                <div>
                  <h2 className="font-semibold text-green-900">
                    Ayah and Tafsir created successfully
                  </h2>
                  <p className="mt-1 text-sm text-green-800">
                    Both records have been saved.
                  </p>
                </div>
              </div>
            </section>
          )}
        </FormContainer>

        <footer className="pb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Almunji Global Archival System • Verse Services
          </p>
        </footer>
      </div>
    </main>
  );
};

export default CreateAyahPage;
