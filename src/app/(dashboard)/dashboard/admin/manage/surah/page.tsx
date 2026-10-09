"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  ChevronRight,
  Loader2,
  Pencil,
  Plus,
  Search,
  Save,
  Trash2,
  X,
  AlertTriangle,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";
import FormSelect from "@/components/forms/FormSelect";
import FormTextarea from "@/components/forms/FormTextarea";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useGetAllSurahQuery,
  useUpdateSurahMutation,
  useHardDeleteSurahMutation,
} from "@/redux/api/surahApi";
import { SurahSchema } from "@/schema/surahSchema";
import type { TSurah, TUpdateSurahPayload } from "@/types/surah";

const revelationOptions = [
  { label: "Meccan", value: "Meccan" },
  { label: "Medinan", value: "Medinan" },
];

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

const ManageSurahPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRevelation, setSelectedRevelation] = useState("");
  const [editingSurah, setEditingSurah] = useState<TSurah | null>(null);
  const [deletingSurah, setDeletingSurah] = useState<TSurah | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const {
    data: surahsData,
    isLoading: isLoadingSurahs,
    isFetching,
  } = useGetAllSurahQuery({
    searchTerm: debouncedSearchTerm,
    revelation: selectedRevelation || undefined,
  });

  const [updateSurah, { isLoading: isUpdating }] = useUpdateSurahMutation();
  const [deleteSurah, { isLoading: isDeleting }] = useHardDeleteSurahMutation();

  const surahs = surahsData?.data ?? [];

  const handleUpdate = async (data: TUpdateSurahPayload) => {
    if (!editingSurah) return;

    try {
      const response = await updateSurah({
        surahId: editingSurah.id,
        payload: data,
      }).unwrap();

      if (response.success) {
        toast.success("Surah updated successfully.");
        setEditingSurah(null);
      } else {
        toast.error("Unable to update the Surah.");
      }
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to update Surah."));
    }
  };

  const handleDelete = async () => {
    if (!deletingSurah) return;

    try {
      await deleteSurah(deletingSurah.id).unwrap();
      toast.success("Surah deleted successfully.");
      setDeletingSurah(null);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to delete Surah."));
    }
  };

  return (
    <main className="min-h-screen bg-slate-50/70 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <nav className="flex items-center gap-2 text-sm text-slate-500">
          <Link
            href="/dashboard/admin"
            className="transition hover:text-emerald-700"
          >
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-slate-800">Manage Surahs</span>
        </nav>

        <section className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Manage Surahs
              </h1>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                View, search, update, and manage Surah records.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/admin/create/surah"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            <Plus className="h-4 w-4" />
            Create New Surah
          </Link>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Surah directory
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {surahs.length} records returned by the current query.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:max-w-xl sm:flex-row">
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search Surahs..."
                  aria-label="Search Surahs"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <select
                value={selectedRevelation}
                onChange={(event) => setSelectedRevelation(event.target.value)}
                aria-label="Filter by revelation period"
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="">All revelation periods</option>
                {revelationOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isLoadingSurahs ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3">
              <Loader2 className="h-7 w-7 animate-spin text-emerald-700" />
              <p className="text-sm text-slate-500">Loading Surahs...</p>
            </div>
          ) : (
            <>
              {isFetching && (
                <div className="h-0.5 w-full overflow-hidden bg-emerald-50">
                  <div className="h-full w-1/3 animate-pulse bg-emerald-600" />
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80">
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Chapter
                      </th>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Surah name
                      </th>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Revelation
                      </th>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Total Ayahs
                      </th>
                      <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {surahs.map((surah) => (
                      <tr
                        key={surah.id}
                        className="transition hover:bg-slate-50/80"
                      >
                        <td className="px-5 py-4">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-800">
                            {surah.chapter}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-1">
                            <span
                              dir="rtl"
                              className="w-fit text-lg font-medium text-slate-800"
                            >
                              {surah.arabic || "—"}
                            </span>
                            <span className="text-sm font-semibold text-slate-900">
                              {surah.english || "—"}
                            </span>
                            {surah.bangla && (
                              <span className="text-xs text-slate-500">
                                {surah.bangla}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                              surah.revelation === "Meccan"
                                ? "bg-violet-50 text-violet-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {surah.revelation || "—"}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-700">
                          {surah.totalAyah}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingSurah(surah)}
                              aria-label={`Edit Surah ${surah.english}`}
                              title="Edit Surah"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingSurah(surah)}
                              aria-label={`Delete Surah ${surah.english}`}
                              title="Delete Surah"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
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

              {surahs.length === 0 && (
                <div className="flex min-h-56 flex-col items-center justify-center px-6 py-12 text-center">
                  <BookOpen className="h-9 w-9 text-slate-300" />
                  <h3 className="mt-3 text-base font-semibold text-slate-900">
                    No Surahs found
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Try changing your search or revelation filter.
                  </p>
                </div>
              )}
            </>
          )}

          <div className="border-t border-slate-200 bg-slate-50/60 px-5 py-3 text-xs text-slate-500">
            Showing {surahs.length} records
          </div>
        </section>
      </div>

      {/* Edit modal */}
      {editingSurah && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isUpdating) {
              setEditingSurah(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-surah-title"
            className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
              <div>
                <h2
                  id="edit-surah-title"
                  className="text-lg font-bold text-slate-900"
                >
                  Edit Surah
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Update {editingSurah.english}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingSurah(null)}
                disabled={isUpdating}
                aria-label="Close edit modal"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-5 sm:p-6">
              <FormContainer
                key={editingSurah.id}
                onSubmit={handleUpdate}
                resolver={zodResolver(SurahSchema)}
                defaultValues={{
                  chapter: editingSurah.chapter,
                  totalAyah: editingSurah.totalAyah,
                  arabic: editingSurah.arabic,
                  english: editingSurah.english,
                  bangla: editingSurah.bangla || "",
                  revelation: editingSurah.revelation,
                  history: editingSurah.history || "",
                }}
              >
                <div className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <FormInput
                      name="chapter"
                      label="Chapter Number"
                      type="number"
                      required
                    />
                    <FormInput
                      name="totalAyah"
                      label="Total Ayahs"
                      type="number"
                      required
                    />
                  </div>

                  <FormInput
                    name="arabic"
                    label="Arabic Name"
                    className="text-right text-2xl"
                    required
                  />

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <FormInput name="english" label="English Name" required />
                    <FormInput name="bangla" label="Bangla Name" />
                  </div>

                  <FormSelect
                    name="revelation"
                    label="Revelation Period"
                    options={revelationOptions}
                    required
                  />

                  <FormTextarea
                    name="history"
                    label="Historical Context"
                    placeholder="Enter historical context..."
                    rows={5}
                  />

                  <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={() => setEditingSurah(null)}
                      disabled={isUpdating}
                      className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isUpdating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      {isUpdating ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </FormContainer>
            </div>
          </section>
        </div>
      )}

      {/* Hard-delete confirmation */}
      {deletingSurah && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-surah-title"
            className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
          >
            <div className="flex items-start gap-3 p-5 sm:p-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h2
                  id="delete-surah-title"
                  className="text-lg font-bold text-slate-900"
                >
                  Delete Surah {deletingSurah.english}?
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  This will delete the Surah and remove it from active records.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDeletingSurah(null)}
                disabled={isDeleting}
                aria-label="Close delete dialog"
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50/70 p-5 sm:flex-row sm:justify-end sm:px-6">
              <button
                type="button"
                onClick={() => setDeletingSurah(null)}
                disabled={isDeleting}
                className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
};

export default ManageSurahPage;
