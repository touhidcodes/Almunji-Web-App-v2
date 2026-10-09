"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Plus, Search, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";
import FormSelect from "@/components/forms/FormSelect";
import FormTextarea from "@/components/forms/FormTextarea";
import { useDebounce } from "@/hooks/useDebounce";

import {
  useGetAllAyahsQuery,
  useSoftDeleteAyahMutation,
  useUpdateAyahMutation,
} from "@/redux/api/ayahApi";
import { useGetAllParaQuery } from "@/redux/api/paraApi";
import { useGetAllSurahQuery } from "@/redux/api/surahApi";

import { AyahSchema } from "@/schema/ayahSchema";
import type { TAyah, TUpdateAyahPayload } from "@/types/ayah";

type RelatedSurah = {
  id?: string;
  chapter?: number;
  arabic?: string;
  english?: string;
  bangla?: string;
};

type RelatedPara = {
  id?: string;
  number?: number;
  arabic?: string;
  english?: string;
  bangla?: string;
};

type TAyahWithRelations = TAyah & {
  surah?: RelatedSurah | null;
  para?: RelatedPara | null;
};

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

const ManageAyahsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSurah, setSelectedSurah] = useState("");
  const [editingAyah, setEditingAyah] = useState<TAyahWithRelations | null>(
    null,
  );
  const [deletingAyah, setDeletingAyah] = useState<TAyahWithRelations | null>(
    null,
  );

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: ayahsData, isLoading: isLoadingAyahs } = useGetAllAyahsQuery({
    searchTerm: debouncedSearchTerm,
    surahId: selectedSurah || undefined,
  });

  const { data: surahsData } = useGetAllSurahQuery({});
  const { data: parasData } = useGetAllParaQuery({});

  const [updateAyah, { isLoading: isUpdating }] = useUpdateAyahMutation();

  const [softDeleteAyah, { isLoading: isDeleting }] =
    useSoftDeleteAyahMutation();

  const ayahs = (ayahsData?.data ?? []) as TAyahWithRelations[];
  const surahs = surahsData?.data ?? [];
  const paras = parasData?.data ?? [];

  const surahOptions = surahs.map((surah) => ({
    label: `${surah.chapter}. ${surah.english || surah.arabic}`,
    value: surah.id,
  }));

  const paraOptions = paras.map((para) => ({
    label: `Para ${para.number} - ${para.english || para.arabic}`,
    value: para.id,
  }));

  // Resolve Surah from the nested relation first.
  const getSurah = (ayah: TAyahWithRelations) => {
    return (
      ayah.surah ?? surahs.find((surah) => surah.id === ayah.surahId) ?? null
    );
  };

  // Resolve Para from the nested relation first.
  const getPara = (ayah: TAyahWithRelations) => {
    return ayah.para ?? paras.find((para) => para.id === ayah.paraId) ?? null;
  };

  const getSurahLabel = (ayah: TAyahWithRelations) => {
    const surah = getSurah(ayah);

    if (!surah) return "Surah unavailable";

    const number = surah.chapter;
    const name = surah.english || surah.arabic || surah.bangla;

    return `${number ? `${number}. ` : ""}${name || "Unnamed Surah"}`;
  };

  const getParaLabel = (ayah: TAyahWithRelations) => {
    const para = getPara(ayah);

    if (!para) return "Para unavailable";

    const number = para.number;
    const name = para.english || para.arabic || para.bangla;

    return `Para ${number ?? ""}${name ? ` · ${name}` : ""}`.trim();
  };

  // The form uses relation IDs, so resolve them from the nested
  // relation when the response does not provide the foreign key.
  const getSurahId = (ayah: TAyahWithRelations): string => {
    if (ayah.surahId) return ayah.surahId;

    const relatedSurah = ayah.surah;

    if (!relatedSurah) return "";

    const matchedSurah = surahs.find(
      (surah) =>
        (relatedSurah.chapter !== undefined &&
          surah.chapter === relatedSurah.chapter) ||
        (!!relatedSurah.english && surah.english === relatedSurah.english),
    );

    return relatedSurah.id || matchedSurah?.id || "";
  };

  const getParaId = (ayah: TAyahWithRelations): string => {
    if (ayah.paraId) return ayah.paraId;

    const relatedPara = ayah.para;

    if (!relatedPara) return "";

    const matchedPara = paras.find(
      (para) =>
        (relatedPara.number !== undefined &&
          para.number === relatedPara.number) ||
        (!!relatedPara.english && para.english === relatedPara.english),
    );

    return relatedPara.id || matchedPara?.id || "";
  };

  const closeEditModal = () => {
    setEditingAyah(null);
  };

  const handleUpdate = async (payload: TUpdateAyahPayload) => {
    if (!editingAyah) return;

    try {
      const response = await updateAyah({
        ayahId: editingAyah.id,
        payload,
      }).unwrap();

      if (response.success) {
        toast.success("Ayah updated successfully.");
        closeEditModal();
      }
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to update Ayah."));
    }
  };

  const handleSoftDelete = async () => {
    if (!deletingAyah) return;

    try {
      await softDeleteAyah(deletingAyah.id).unwrap();

      toast.success("Ayah deleted successfully.");
      setDeletingAyah(null);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to delete Ayah."));
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedSurah("");
  };

  return (
    <main className="min-h-screen bg-gray-50/70 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Page header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Manage Ayahs
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage Quranic verses and their translations.
            </p>
          </div>

          <Link
            href="/dashboard/admin/create/ayah"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Create Ayah
          </Link>
        </header>

        {/* Search and filters */}
        <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(240px,1fr)_minmax(200px,0.7fr)_auto]">
            <label className="relative block">
              <span className="sr-only">Search Ayahs</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search Ayah text..."
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </label>

            <label className="block">
              <span className="sr-only">Filter by Surah</span>

              <select
                value={selectedSurah}
                onChange={(event) => setSelectedSurah(event.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="">All Surahs</option>

                {surahOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              onClick={clearFilters}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
            >
              Clear filters
            </button>
          </div>
        </section>

        {/* Dynamic Ayah table */}
        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 sm:px-5">
            <h2 className="text-sm font-semibold text-gray-800">
              Ayah Records
            </h2>

            <span className="text-xs text-gray-500">
              {isLoadingAyahs ? "Loading..." : `${ayahs.length} records`}
            </span>
          </div>

          {isLoadingAyahs ? (
            <div className="space-y-3 p-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-16 animate-pulse rounded-lg bg-gray-100"
                />
              ))}
            </div>
          ) : ayahs.length === 0 ? (
            <div className="px-4 py-16 text-center">
              <h3 className="text-base font-semibold text-gray-800">
                No Ayahs found
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Try changing your search or filters.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Number</th>
                    <th className="px-4 py-3 font-semibold">Surah / Para</th>
                    <th className="px-4 py-3 font-semibold">Arabic</th>
                    <th className="px-4 py-3 font-semibold">Translation</th>
                    <th className="px-4 py-3 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {ayahs.map((ayah) => (
                    <tr
                      key={ayah.id}
                      className="align-top transition hover:bg-gray-50/70"
                    >
                      <td className="whitespace-nowrap px-4 py-4">
                        <span className="inline-flex min-w-9 items-center justify-center rounded-md bg-emerald-50 px-2.5 py-1.5 font-semibold text-emerald-700">
                          {ayah.number}
                        </span>
                      </td>

                      <td className="max-w-[240px] px-4 py-4">
                        <p className="font-medium text-gray-800">
                          {getSurahLabel(ayah)}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {getParaLabel(ayah)}
                        </p>
                      </td>

                      <td className="max-w-[280px] px-4 py-4">
                        <p
                          dir="rtl"
                          className="line-clamp-3 text-right font-arabic text-xl leading-loose text-gray-900"
                        >
                          {ayah.arabic}
                        </p>
                      </td>

                      <td className="max-w-[360px] px-4 py-4">
                        <p className="line-clamp-2 leading-6 text-gray-700">
                          {ayah.english || "—"}
                        </p>

                        {ayah.bangla && (
                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500">
                            {ayah.bangla}
                          </p>
                        )}

                        {ayah.transliteration && (
                          <p className="mt-1 line-clamp-1 text-xs italic text-gray-400">
                            {ayah.transliteration}
                          </p>
                        )}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingAyah(ayah)}
                            aria-label={`Edit Ayah ${ayah.number}`}
                            className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                          >
                            <Edit className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeletingAyah(ayah)}
                            aria-label={`Delete Ayah ${ayah.number}`}
                            className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* Edit modal */}
      {editingAyah && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeEditModal();
            }
          }}
        >
          <section className="flex max-h-[95vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <header className="flex items-center justify-between border-b border-gray-200 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Edit Ayah
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Update the Ayah details below.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                aria-label="Close edit modal"
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="overflow-y-auto p-5 sm:p-6">
              <FormContainer
                key={editingAyah.id}
                onSubmit={handleUpdate}
                resolver={zodResolver(AyahSchema)}
                defaultValues={{
                  surahId: getSurahId(editingAyah),
                  paraId: getParaId(editingAyah),
                  number: editingAyah.number,
                  arabic: editingAyah.arabic,
                  transliteration: editingAyah.transliteration || "",
                  english: editingAyah.english || "",
                  bangla: editingAyah.bangla || "",
                }}
              >
                <div className="space-y-5">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <FormSelect
                      name="surahId"
                      label="Surah"
                      options={surahOptions}
                      required
                    />

                    <FormSelect
                      name="paraId"
                      label="Para"
                      options={paraOptions}
                      required
                    />

                    <FormInput
                      name="number"
                      label="Ayah number"
                      type="number"
                      required
                    />
                  </div>

                  <FormTextarea
                    name="arabic"
                    label="Arabic text"
                    rows={4}
                    required
                    className="text-right font-arabic text-2xl leading-loose"
                  />

                  <FormTextarea
                    name="transliteration"
                    label="Transliteration"
                    rows={2}
                  />

                  <FormTextarea
                    name="english"
                    label="English translation"
                    rows={3}
                  />

                  <FormTextarea
                    name="bangla"
                    label="Bangla translation"
                    rows={3}
                  />

                  <footer className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={closeEditModal}
                      className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isUpdating ? "Saving..." : "Save changes"}
                    </button>
                  </footer>
                </div>
              </FormContainer>
            </div>
          </section>
        </div>
      )}

      {/* Soft-delete confirmation */}
      {deletingAyah && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 p-4 backdrop-blur-sm">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-ayah-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <Trash2 className="h-5 w-5" />
            </div>

            <h2
              id="delete-ayah-title"
              className="mt-4 text-lg font-semibold text-gray-900"
            >
              Delete Ayah?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Ayah {deletingAyah.number} from {getSurahLabel(deletingAyah)} will
              be soft-deleted, not permanently removed from the database.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingAyah(null)}
                disabled={isDeleting}
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSoftDelete}
                disabled={isDeleting}
                className="rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
};

export default ManageAyahsPage;
