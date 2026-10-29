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
import { useCreateTafsirMutation } from "@/redux/api/tafsirApi";
import { useGetAllParaQuery } from "@/redux/api/paraApi";
import { useGetAllSurahQuery } from "@/redux/api/surahApi";

import {
  CreateAyahWithTafsirSchema,
  type TCreateAyahWithTafsir,
} from "@/schema/ayahWithTafsirSchema";

import type { TCreateAyahPayload } from "@/types/ayah";
import type { TCreateTafsirPayload } from "@/types/tafsir";
import type { TApiResponse } from "@/types/api";
import type { TAyah } from "@/types/ayah";

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error === "object" && error !== null) {
    const apiError = error as {
      data?: { message?: string };
      error?: string;
      message?: string;
    };

    return (
      apiError.data?.message || apiError.message || apiError.error || fallback
    );
  }

  return fallback;
};

const getCreatedAyahId = (response: TApiResponse<TAyah>): string | null => {
  const data = response.data;

  if (
    data &&
    typeof data === "object" &&
    "id" in data &&
    typeof data.id === "string" &&
    data.id.length > 0
  ) {
    return data.id;
  }

  return null;
};

const CreateAyahPage = () => {
  const searchParams = useSearchParams();

  const [createAyah, { isLoading: isCreatingAyah }] = useCreateAyahMutation();

  const [createTafsir, { isLoading: isCreatingTafsir }] =
    useCreateTafsirMutation();

  const { data: surahsData, isLoading: isLoadingSurahs } =
    useGetAllSurahQuery();

  const { data: parasData, isLoading: isLoadingParas } = useGetAllParaQuery();

  const [addTafsirMode, setAddTafsirMode] = useState(
    () => searchParams.get("withTafsir") === "true",
  );

  const [createdAyahId, setCreatedAyahId] = useState<string | null>(null);

  const [isAyahCreated, setIsAyahCreated] = useState(false);
  const [isTafsirCreated, setIsTafsirCreated] = useState(false);

  const surahs = surahsData?.data ?? [];
  const paras = parasData?.data ?? [];

  const isLoadingReferences = isLoadingSurahs || isLoadingParas;
  const isSubmitting = isCreatingAyah || isCreatingTafsir;

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

  const handleEnableTafsir = () => {
    if (isSubmitting || isTafsirCreated) return;

    if (isAyahCreated && !createdAyahId) {
      toast.error("The Ayah was created, but its ID could not be recovered.", {
        description: "Check the create Ayah API response before continuing.",
      });
      return;
    }

    setAddTafsirMode(true);
  };

  const handleSubmit = async (data: TCreateAyahWithTafsir) => {
    if (isSubmitting || isTafsirCreated) return;

    let ayahId = createdAyahId;

    try {
      // Step 1: Create the Ayah only if it has not been saved.
      if (!isAyahCreated) {
        const ayahPayload: TCreateAyahPayload = {
          surahId: data.surahId,
          paraId: data.paraId,
          number: Number(data.number),
          arabic: data.arabic.trim(),
          transliteration: data.transliteration?.trim() || undefined,
          bangla: data.bangla?.trim() || undefined,
          english: data.english?.trim() || undefined,
        };

        const response = await createAyah(ayahPayload).unwrap();

        if (!response.success) {
          toast.error("Failed to create Ayah.", {
            description: response.message,
          });
          return;
        }

        ayahId = getCreatedAyahId(response);

        // The Ayah exists even if its ID is unexpectedly missing.
        // Record success so retrying cannot blindly create it again.
        setIsAyahCreated(true);
        setCreatedAyahId(ayahId);

        if (!ayahId) {
          toast.error("Ayah created, but its ID was not returned.", {
            description:
              "Do not submit again until the create Ayah API response is corrected. Otherwise, a duplicate Ayah may be created.",
          });
          return;
        }

        toast.success("Ayah created successfully!");
      }

      // Step 2: Stop if the user only wants to create an Ayah.
      if (!addTafsirMode) return;

      // Step 3: Tafsir must reference the saved Ayah.
      if (!ayahId) {
        toast.error("Unable to create Tafsir without an Ayah ID.");
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
        tags: data.tags?.map((tag) => tag.trim()).filter(Boolean),
      };

      const tafsirResponse = await createTafsir(tafsirPayload).unwrap();

      if (!tafsirResponse.success) {
        toast.error("Ayah created, but Tafsir creation failed.", {
          description: tafsirResponse.message,
        });
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
          isAyahCreated ? "Tafsir creation failed." : "Failed to create Ayah.",
        ),
        {
          description:
            isAyahCreated && addTafsirMode
              ? "The Ayah has already been saved. Retry Tafsir creation without creating the Ayah again."
              : undefined,
        },
      );
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 font-poppins sm:p-6 lg:p-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <nav className="flex items-center justify-between border-b border-gray-200 pb-5">
          <Link
            href="/dashboard/admin/manage/ayah"
            className="flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-teal-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Ayahs
          </Link>

          <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
            <Sparkles className="h-4 w-4 text-teal-500" />
            Verse Services
          </span>
        </nav>

        <header>
          <div className="flex items-center gap-4">
            <div className="shrink-0 rounded-2xl bg-teal-600 p-3 shadow-xl shadow-teal-100 sm:p-4">
              <Book className="h-7 w-7 text-white sm:h-8 sm:w-8" />
            </div>

            <div>
              <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
                Create Ayah
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Create a Quranic verse independently or include its Tafsir.
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
            tags: [],
          }}
        >
          <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl shadow-gray-200/40">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 sm:px-8">
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
                <span className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">
                  <CheckCircle2 className="h-4 w-4" />
                  Created
                </span>
              )}
            </div>

            <div className="space-y-7 p-5 sm:p-8">
              {isAyahCreated && (
                <div className="rounded-xl border border-green-100 bg-green-50 p-4">
                  <p className="text-sm font-semibold text-green-800">
                    Ayah saved successfully
                  </p>
                  {createdAyahId && (
                    <p className="mt-1 break-all font-mono text-xs text-green-700">
                      Ayah ID: {createdAyahId}
                    </p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormTextarea
                  name="transliteration"
                  label="Transliteration"
                  rows={3}
                  placeholder="Enter transliteration..."
                  disabled={isAyahCreated}
                  maxWords={200}
                />

                <FormTextarea
                  name="bangla"
                  label="Bangla Translation"
                  rows={3}
                  placeholder="Enter Bangla translation..."
                  disabled={isAyahCreated}
                />
              </div>

              <FormTextarea
                name="english"
                label="English Translation"
                rows={4}
                placeholder="Enter English translation..."
                disabled={isAyahCreated}
              />

              <div className="flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-gray-500">
                  {isAyahCreated
                    ? "The Ayah has been saved."
                    : addTafsirMode
                      ? "Submitting will create the Ayah first, then its Tafsir."
                      : "Create the Ayah alone or add its Tafsir."}
                </p>

                <div className="flex flex-col gap-3 sm:flex-row">
                  {!addTafsirMode && !isTafsirCreated && (
                    <button
                      type="button"
                      onClick={handleEnableTafsir}
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-teal-600 px-5 py-3 text-sm font-bold text-teal-700 transition hover:bg-teal-50 disabled:opacity-50"
                    >
                      <Plus className="h-4 w-4" />
                      Add Tafsir
                    </button>
                  )}

                  {!isAyahCreated && !addTafsirMode && (
                    <button
                      type="submit"
                      disabled={isSubmitting || isLoadingReferences}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
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
              </div>
            </div>
          </section>

          {addTafsirMode && !isTafsirCreated && (
            <section className="mt-8 space-y-7 rounded-3xl border border-gray-100 bg-white p-5 shadow-xl shadow-gray-200/40 sm:p-8">
              <div className="flex items-center gap-3">
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

              <FormInput
                name="heading"
                label="Tafsir Heading"
                placeholder="Enter a descriptive heading..."
              />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormTextarea
                  name="summaryBn"
                  label="Bangla Summary"
                  rows={5}
                  placeholder="সংক্ষিপ্ত তাফসির লিখুন..."
                />

                <FormTextarea
                  name="summaryEn"
                  label="English Summary"
                  rows={5}
                  placeholder="Enter the English summary..."
                />

                <FormTextarea
                  name="detailBn"
                  label="Detailed Tafsir (Bangla)"
                  rows={8}
                  placeholder="বিস্তারিত তাফসির লিখুন..."
                />

                <FormTextarea
                  name="detailEn"
                  label="Detailed Tafsir (English)"
                  rows={8}
                  placeholder="Enter detailed English Tafsir..."
                />

                <FormInput
                  name="scholar"
                  label="Scholar"
                  placeholder="e.g. Ibn Kathir"
                />

                <FormInput
                  name="reference"
                  label="Reference"
                  placeholder="Book, volume, page, or source..."
                />
              </div>

              <FormTags
                name="tags"
                label="Tafsir Tags"
                placeholder="Type a tag and press Enter..."
                description="Add topics such as Tawheed, patience, guidance, or prayer."
              />

              <div className="flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-gray-500">
                  {createdAyahId
                    ? "The saved Ayah will not be created again."
                    : "The Ayah will be created first, followed by its Tafsir."}
                </p>

                <button
                  type="submit"
                  disabled={
                    isSubmitting || isTafsirCreated || isLoadingReferences
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
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
                    Both records have been saved successfully.
                  </p>
                </div>
              </div>

              <Link
                href="/dashboard/admin/manage/ayah"
                className="mt-4 inline-flex text-sm font-semibold text-green-800 underline"
              >
                Return to Ayah management
              </Link>
            </section>
          )}
        </FormContainer>

        <footer className="pb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Almunji Global Archival System · Verse Services
          </p>
        </footer>
      </div>
    </main>
  );
};

export default CreateAyahPage;
