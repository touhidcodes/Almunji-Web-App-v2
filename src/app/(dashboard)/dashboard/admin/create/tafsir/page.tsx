"use client";

import { useMemo, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { BookOpen, CheckCircle2, Layers3, Loader2, Search } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";
import FormSelect from "@/components/forms/FormSelect";
import FormTextarea from "@/components/forms/FormTextarea";
import RichTextEditor from "@/components/forms/RichTextEditor";

import { useCreateTafsirMutation } from "@/redux/api/tafsirApi";
import { useGetAllParaQuery } from "@/redux/api/paraApi";
import {
  useGetAyahsByParaQuery,
  useGetAyahsBySurahQuery,
} from "@/redux/api/ayahApi";
import { useGetAllSurahQuery } from "@/redux/api/surahApi";

import type { TApiError } from "@/types/api";

const TafsirFormSchema = z.object({
  heading: z.string().optional(),
  summaryBn: z.string().optional(),
  summaryEn: z.string().optional(),
  detailBn: z.string().optional(),
  detailEn: z.string().optional(),
  scholar: z.string().optional(),
  reference: z.string().optional(),
  tags: z.string().optional(),
});

type TTafsirFormValues = z.infer<typeof TafsirFormSchema>;

type TAyah = {
  id: string;
  number: number;
  arabic: string;
  transliteration?: string | null;
  bangla?: string | null;
  english?: string | null;
  surahId: string;
  paraId: string;
};

type TFinderMode = "surah" | "para";

const defaultValues: TTafsirFormValues = {
  heading: "",
  summaryBn: "",
  summaryEn: "",
  detailBn: "",
  detailEn: "",
  scholar: "",
  reference: "",
  tags: "",
};

export default function CreateTafsirPage() {
  const [finderMode, setFinderMode] = useState<TFinderMode>("surah");

  const [selectedSurahId, setSelectedSurahId] = useState("");
  const [selectedParaId, setSelectedParaId] = useState("");

  const [ayahSearch, setAyahSearch] = useState("");
  const [selectedAyah, setSelectedAyah] = useState<TAyah | null>(null);

  const [createTafsir, { isLoading: isCreating }] = useCreateTafsirMutation();

  // ---------------------------------------------
  // Surahs
  // ---------------------------------------------

  const { data: surahResponse, isLoading: isSurahLoading } =
    useGetAllSurahQuery();

  // ---------------------------------------------
  // Paras
  // ---------------------------------------------

  const { data: paraResponse, isLoading: isParaLoading } = useGetAllParaQuery();

  // ---------------------------------------------
  // Ayahs by Surah
  // ---------------------------------------------

  const { data: surahAyahResponse, isLoading: isSurahAyahLoading } =
    useGetAyahsBySurahQuery(selectedSurahId, {
      skip: finderMode !== "surah" || !selectedSurahId,
    });

  // ---------------------------------------------
  // Ayahs by Para
  // ---------------------------------------------

  const { data: paraAyahResponse, isLoading: isParaAyahLoading } =
    useGetAyahsByParaQuery(selectedParaId, {
      skip: finderMode !== "para" || !selectedParaId,
    });

  // ---------------------------------------------
  // API data
  // ---------------------------------------------

  const surahs = surahResponse?.data ?? [];
  const paras = paraResponse?.data ?? [];

  const ayahs = useMemo<TAyah[]>(() => {
    if (finderMode === "surah") {
      return (surahAyahResponse?.data ?? []) as TAyah[];
    }

    return (paraAyahResponse?.data ?? []) as TAyah[];
  }, [finderMode, surahAyahResponse, paraAyahResponse]);

  // ---------------------------------------------
  // Loading state
  // ---------------------------------------------

  const isAyahLoading =
    finderMode === "surah" ? isSurahAyahLoading : isParaAyahLoading;

  // ---------------------------------------------
  // Surah options
  // ---------------------------------------------

  const surahOptions = useMemo(
    () =>
      [...surahs]
        .sort((a, b) => a.chapter - b.chapter)
        .map((surah) => ({
          label: `${surah.chapter}. ${surah.english}`,
          value: surah.id,
        })),
    [surahs],
  );

  // ---------------------------------------------
  // Para options
  // ---------------------------------------------

  const paraOptions = useMemo(
    () =>
      [...paras]
        .sort((a, b) => a.number - b.number)
        .map((para) => ({
          label: `${para.number}. ${para.english ?? para.arabic}`,
          value: para.id,
        })),
    [paras],
  );

  // ---------------------------------------------
  // Search Ayahs
  // ---------------------------------------------

  const filteredAyahs = useMemo(() => {
    const search = ayahSearch.trim().toLowerCase();

    if (!search) {
      return ayahs;
    }

    return ayahs.filter((ayah) => {
      return (
        ayah.number.toString().includes(search) ||
        ayah.arabic.toLowerCase().includes(search) ||
        ayah.bangla?.toLowerCase().includes(search) ||
        ayah.english?.toLowerCase().includes(search) ||
        ayah.transliteration?.toLowerCase().includes(search)
      );
    });
  }, [ayahs, ayahSearch]);

  // ---------------------------------------------
  // Finder mode
  // ---------------------------------------------

  const handleModeChange = (mode: TFinderMode) => {
    setFinderMode(mode);

    setSelectedSurahId("");
    setSelectedParaId("");

    setAyahSearch("");
    setSelectedAyah(null);
  };

  // ---------------------------------------------
  // Surah selection
  // ---------------------------------------------

  const handleSurahChange = (value: string) => {
    setSelectedSurahId(value);

    setSelectedParaId("");
    setAyahSearch("");
    setSelectedAyah(null);
  };

  // ---------------------------------------------
  // Para selection
  // ---------------------------------------------

  const handleParaChange = (value: string) => {
    setSelectedParaId(value);

    setSelectedSurahId("");
    setAyahSearch("");
    setSelectedAyah(null);
  };

  // ---------------------------------------------
  // Submit Tafsir
  // ---------------------------------------------

  const handleSubmit = async (values: TTafsirFormValues) => {
    if (!selectedAyah) {
      toast.error("Please select an Ayah first.");
      return;
    }

    try {
      await createTafsir({
        ayahId: selectedAyah.id,

        heading: values.heading?.trim() || undefined,

        summaryBn: values.summaryBn?.trim() || undefined,

        summaryEn: values.summaryEn?.trim() || undefined,

        detailBn: values.detailBn?.trim() || undefined,

        detailEn: values.detailEn?.trim() || undefined,

        scholar: values.scholar?.trim() || undefined,

        reference: values.reference?.trim() || undefined,

        tags: values.tags?.trim() || undefined,
      }).unwrap();

      toast.success("Tafsir created successfully.");
    } catch (error: unknown) {
      const apiError = error as TApiError;

      toast.error(
        apiError?.data?.message ||
          apiError?.message ||
          "Failed to create Tafsir.",
      );
    }
  };

  return (
    <FormContainer
      onSubmit={handleSubmit}
      defaultValues={defaultValues}
      resolver={zodResolver(TafsirFormSchema)}
    >
      <div className="space-y-6">
        {/* =========================================
            Header
        ========================================= */}

        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Create Tafsir
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Select an Ayah and add its Tafsir information.
          </p>
        </div>

        {/* =========================================
            Ayah Finder
        ========================================= */}

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="mb-5">
            <div className="flex items-center gap-2">
              <BookOpen className="size-5 text-teal-600" />

              <h2 className="text-lg font-semibold">Find Ayah</h2>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Choose a Surah or Para to find the Ayah you want to add Tafsir
              for.
            </p>
          </div>

          {/* Finder mode */}
          <div className="mb-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleModeChange("surah")}
              className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition ${
                finderMode === "surah"
                  ? "border-teal-600 bg-teal-50 text-teal-700"
                  : "hover:bg-muted"
              }`}
            >
              <BookOpen className="size-4" />
              By Surah
            </button>

            <button
              type="button"
              onClick={() => handleModeChange("para")}
              className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition ${
                finderMode === "para"
                  ? "border-teal-600 bg-teal-50 text-teal-700"
                  : "hover:bg-muted"
              }`}
            >
              <Layers3 className="size-4" />
              By Para
            </button>
          </div>

          {/* Surah / Para selector */}
          {finderMode === "surah" ? (
            <FormSelect
              name="surahFinder"
              label="Select Surah"
              placeholder={
                isSurahLoading ? "Loading Surahs..." : "Select a Surah"
              }
              options={surahOptions}
              value={selectedSurahId}
              onValueChange={handleSurahChange}
              disabled={isSurahLoading}
            />
          ) : (
            <FormSelect
              name="paraFinder"
              label="Select Para"
              placeholder={isParaLoading ? "Loading Paras..." : "Select a Para"}
              options={paraOptions}
              value={selectedParaId}
              onValueChange={handleParaChange}
              disabled={isParaLoading}
            />
          )}

          {/* Search */}
          {(selectedSurahId || selectedParaId) && (
            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium">
                Search Ayah
              </label>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <input
                  type="text"
                  value={ayahSearch}
                  onChange={(event) => setAyahSearch(event.target.value)}
                  placeholder="Search by Ayah number, Arabic, Bangla or English..."
                  className="h-11 w-full rounded-lg border bg-background pl-10 pr-4 text-sm outline-none transition focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
                />
              </div>
            </div>
          )}

          {/* Ayah list */}
          {(selectedSurahId || selectedParaId) && (
            <div className="mt-5">
              {isAyahLoading ? (
                <div className="flex items-center justify-center rounded-lg border py-10">
                  <Loader2 className="mr-2 size-5 animate-spin text-teal-600" />

                  <span className="text-sm text-muted-foreground">
                    Loading Ayahs...
                  </span>
                </div>
              ) : filteredAyahs.length === 0 ? (
                <div className="rounded-lg border border-dashed py-10 text-center">
                  <p className="text-sm font-medium">No Ayah found</p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Try another search term.
                  </p>
                </div>
              ) : (
                <div className="max-h-[500px] space-y-3 overflow-y-auto pr-1">
                  {filteredAyahs.map((ayah) => {
                    const isSelected = selectedAyah?.id === ayah.id;

                    return (
                      <button
                        key={ayah.id}
                        type="button"
                        onClick={() => setSelectedAyah(ayah)}
                        className={`w-full rounded-xl border p-4 text-left transition ${
                          isSelected
                            ? "border-teal-600 bg-teal-50/50 ring-1 ring-teal-600"
                            : "hover:border-teal-300 hover:bg-muted/50"
                        }`}
                      >
                        {/* Ayah header */}
                        <div className="mb-3 flex items-center justify-between">
                          <span className="rounded-md bg-muted px-2 py-1 text-xs font-semibold">
                            Ayah {ayah.number}
                          </span>

                          {isSelected && (
                            <span className="flex items-center gap-1 text-xs font-medium text-teal-700">
                              <CheckCircle2 className="size-4" />
                              Selected
                            </span>
                          )}
                        </div>

                        {/* Arabic */}
                        <p
                          dir="rtl"
                          className="text-right text-xl font-medium leading-[2]"
                        >
                          {ayah.arabic}
                        </p>

                        {/* Transliteration */}
                        {ayah.transliteration && (
                          <p className="mt-3 text-sm italic text-muted-foreground">
                            {ayah.transliteration}
                          </p>
                        )}

                        {/* English */}
                        {ayah.english && (
                          <p className="mt-2 text-sm leading-6">
                            {ayah.english}
                          </p>
                        )}

                        {/* Bangla */}
                        {ayah.bangla && (
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            {ayah.bangla}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* =========================================
            Selected Ayah
        ========================================= */}

        {selectedAyah && (
          <div className="rounded-xl border border-teal-200 bg-teal-50/40 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-teal-700">
                  Selected Ayah
                </p>

                <h3 className="mt-1 text-lg font-semibold">
                  Ayah {selectedAyah.number}
                </h3>
              </div>

              <CheckCircle2 className="size-6 text-teal-600" />
            </div>

            <p
              dir="rtl"
              className="text-right text-2xl font-medium leading-[2]"
            >
              {selectedAyah.arabic}
            </p>

            {selectedAyah.transliteration && (
              <p className="mt-3 text-sm italic text-muted-foreground">
                {selectedAyah.transliteration}
              </p>
            )}

            {selectedAyah.english && (
              <p className="mt-3 text-sm leading-6">{selectedAyah.english}</p>
            )}

            {selectedAyah.bangla && (
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {selectedAyah.bangla}
              </p>
            )}
          </div>
        )}

        {/* =========================================
            Tafsir Information
        ========================================= */}

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Tafsir Information</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Add the explanation, summary and source information for the
              selected Ayah.
            </p>
          </div>

          <div className="space-y-6">
            {/* Basic information */}
            <div className="grid gap-5 md:grid-cols-2">
              <FormInput
                name="heading"
                label="Heading"
                placeholder="Enter Tafsir heading"
              />

              <FormInput
                name="scholar"
                label="Scholar"
                placeholder="e.g. Ibn Kathir"
              />
            </div>

            {/* Summaries */}
            <div className="grid gap-5 md:grid-cols-2">
              <FormTextarea
                name="summaryBn"
                label="Bangla Summary"
                placeholder="Write a short Bangla summary..."
                rows={5}
              />

              <FormTextarea
                name="summaryEn"
                label="English Summary"
                placeholder="Write a short English summary..."
                rows={5}
              />
            </div>

            {/* Detailed Tafsir */}
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-semibold">Detailed Tafsir</h3>

                <p className="mt-1 text-xs text-muted-foreground">
                  You can use formatting such as headings, bold, lists,
                  quotations and links.
                </p>
              </div>

              <RichTextEditor
                name="detailBn"
                label="Detailed Tafsir — Bangla"
                placeholder="Write detailed Bangla Tafsir..."
              />

              <RichTextEditor
                name="detailEn"
                label="Detailed Tafsir — English"
                placeholder="Write detailed English Tafsir..."
              />
            </div>

            {/* Source and metadata */}
            <div className="grid gap-5 md:grid-cols-2">
              <FormInput
                name="reference"
                label="Reference"
                placeholder="Enter source or reference"
              />

              <FormInput
                name="tags"
                label="Tags"
                placeholder="e.g. tawheed, prayer, patience"
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end border-t pt-5">
              <button
                type="submit"
                disabled={!selectedAyah || isCreating}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-teal-600 px-6 text-sm font-medium text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCreating && <Loader2 className="size-4 animate-spin" />}

                {isCreating ? "Creating..." : "Create Tafsir"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </FormContainer>
  );
}
