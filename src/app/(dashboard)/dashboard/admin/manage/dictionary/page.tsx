"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  BookOpenText,
  Languages,
  Plus,
  Save,
  Search,
  Sparkles,
  Trash2,
  X,
  Pencil,
  Loader2,
  AlertTriangle,
  BookMarked,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";
import FormTextarea from "@/components/forms/FormTextarea";

import {
  useGetAllWordsAdminQuery,
  useSoftDeleteWordMutation,
  useUpdateWordMutation,
} from "@/redux/api/dictionaryApi";

import { DictionarySchema } from "@/schema/dictionarySchema";

type TDictionaryFormValues = z.infer<typeof DictionarySchema>;

type TDictionaryWord = {
  id: string;
  persianWord: string;
  transliteration?: string;
  banglaMeaning: string;
  englishMeaning?: string;
  exampleFA?: string;
  exampleEN?: string;
  exampleBN?: string;
};

type TDictionaryApiWord = Partial<TDictionaryWord> & {
  _id?: string;
  word?: string;
  pronunciation?: string;
  meaning?: string;
  definition?: string;
};

type TApiError = {
  data?: {
    message?: string;
  };
  message?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (!isRecord(error)) return fallback;

  const data = error.data;

  if (isRecord(data) && typeof data.message === "string") {
    return data.message;
  }

  return typeof error.message === "string" ? error.message : fallback;
}

function normalizeWord(value: unknown): TDictionaryWord | null {
  if (!isRecord(value)) return null;

  const item = value as TDictionaryApiWord;
  const id = getString(item.id ?? item._id);

  if (!id) return null;

  return {
    id,
    persianWord: getString(item.persianWord ?? item.word),
    transliteration: getString(item.transliteration ?? item.pronunciation),
    banglaMeaning: getString(item.banglaMeaning ?? item.meaning),
    englishMeaning: getString(item.englishMeaning ?? item.definition),
    exampleFA: getString(item.exampleFA),
    exampleEN: getString(item.exampleEN),
    exampleBN: getString(item.exampleBN),
  };
}

function extractWords(response: unknown): TDictionaryWord[] {
  if (!isRecord(response)) return [];

  const result = response.data;

  if (!isRecord(result) || !Array.isArray(result.data)) {
    return [];
  }

  return result.data
    .map(normalizeWord)
    .filter((word): word is TDictionaryWord => word !== null);
}

const ManageDictionaryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingWord, setEditingWord] = useState<TDictionaryWord | null>(null);
  const [deletingWord, setDeletingWord] = useState<TDictionaryWord | null>(
    null,
  );

  const {
    data: wordsData,
    isLoading,
    isFetching,
  } = useGetAllWordsAdminQuery({ searchTerm });

  const [updateWord, { isLoading: isUpdating }] = useUpdateWordMutation();

  const [softDeleteWord, { isLoading: isDeleting }] =
    useSoftDeleteWordMutation();

  const words = useMemo(() => {
    const normalizedWords = extractWords(wordsData);
    const term = searchTerm.trim().toLowerCase();

    if (!term) return normalizedWords;

    return normalizedWords.filter((word) =>
      [
        word.persianWord,
        word.transliteration,
        word.banglaMeaning,
        word.englishMeaning,
        word.exampleFA,
        word.exampleEN,
        word.exampleBN,
      ].some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(term),
      ),
    );
  }, [wordsData, searchTerm]);

  const closeEditModal = () => {
    if (isUpdating) return;
    setEditingWord(null);
  };

  const closeDeleteModal = () => {
    if (isDeleting) return;
    setDeletingWord(null);
  };

  const handleUpdate = async (data: TDictionaryFormValues) => {
    if (!editingWord) return;

    try {
      const response: unknown = await updateWord({
        id: editingWord.id,
        data,
      }).unwrap();

      if (isRecord(response) && response.success === false) {
        toast.error(
          getString(response.message) || "Failed to update dictionary word.",
        );
        return;
      }

      toast.success("Dictionary word updated successfully.");
      setEditingWord(null);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to update dictionary word."));
    }
  };

  const handleDelete = async () => {
    if (!deletingWord) return;

    try {
      await softDeleteWord(deletingWord.id).unwrap();

      toast.success("Dictionary word deleted successfully.");

      if (editingWord?.id === deletingWord.id) {
        setEditingWord(null);
      }

      setDeletingWord(null);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to delete dictionary word."));
    }
  };

  const totalWords = extractWords(wordsData).length;

  return (
    <main className="min-h-screen bg-slate-50/70 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500">
          <Link
            href="/dashboard/admin"
            className="transition hover:text-teal-700"
          >
            Dashboard
          </Link>

          <ChevronRight className="h-4 w-4" />

          <span className="font-medium text-slate-800">Manage Dictionary</span>
        </nav>

        {/* Header */}
        <section className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <Languages className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Manage Dictionary
              </h1>

              <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                Search, edit, and manage Persian words, translations, and usage
                examples.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/admin/create/dictionary"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800"
          >
            <Plus className="h-4 w-4" />
            Create Dictionary Entry
          </Link>
        </section>

        {/* Statistics */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <BookMarked className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Records received
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {totalWords}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
              <Search className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">Displaying</p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {words.length}
              </p>
            </div>
          </div>
        </section>

        {/* Dictionary table */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Dictionary directory
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage words, meanings, transliterations, and examples.
              </p>
            </div>

            <div className="relative w-full sm:max-w-sm">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search words or meanings..."
                aria-label="Search dictionary"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3">
              <Loader2 className="h-7 w-7 animate-spin text-teal-700" />
              <p className="text-sm text-slate-500">
                Loading dictionary entries...
              </p>
            </div>
          ) : (
            <>
              {isFetching && (
                <div className="h-0.5 w-full overflow-hidden bg-teal-50">
                  <div className="h-full w-1/3 animate-pulse bg-teal-600" />
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80">
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Persian Word
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Transliteration
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Bangla Meaning
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        English Meaning
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Usage Examples
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {words.map((word) => (
                      <tr
                        key={word.id}
                        className="transition hover:bg-slate-50/80"
                      >
                        {/* Persian word */}
                        <td className="px-5 py-4">
                          <div className="flex max-w-56 items-start gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-teal-700">
                              <Languages className="h-4 w-4" />
                            </span>

                            <div className="min-w-0">
                              <p
                                dir="rtl"
                                className="break-words text-right text-xl font-semibold leading-8 text-slate-900"
                              >
                                {word.persianWord || "Untitled word"}
                              </p>

                              {word.transliteration && (
                                <p className="mt-1 break-words text-xs text-slate-500">
                                  {word.transliteration}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Transliteration */}
                        <td className="px-5 py-4">
                          <p className="max-w-44 whitespace-normal text-sm leading-6 text-slate-700">
                            {word.transliteration || "—"}
                          </p>
                        </td>

                        {/* Bangla */}
                        <td className="px-5 py-4">
                          <p className="max-w-56 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                            {word.banglaMeaning || "—"}
                          </p>
                        </td>

                        {/* English */}
                        <td className="px-5 py-4">
                          <p className="max-w-56 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                            {word.englishMeaning || "—"}
                          </p>
                        </td>

                        {/* Examples */}
                        <td className="px-5 py-4">
                          <div className="flex max-w-64 flex-col items-start gap-2">
                            {word.exampleFA && (
                              <p className="line-clamp-2 text-sm leading-5 text-slate-700">
                                <span className="font-medium text-slate-500">
                                  FA:
                                </span>{" "}
                                {word.exampleFA}
                              </p>
                            )}

                            {word.exampleEN && (
                              <p className="line-clamp-2 text-sm leading-5 text-slate-700">
                                <span className="font-medium text-slate-500">
                                  EN:
                                </span>{" "}
                                {word.exampleEN}
                              </p>
                            )}

                            {word.exampleBN && (
                              <p className="line-clamp-2 text-xs leading-5 text-slate-500">
                                <span className="font-medium">BN:</span>{" "}
                                {word.exampleBN}
                              </p>
                            )}

                            {!word.exampleFA &&
                              !word.exampleEN &&
                              !word.exampleBN && (
                                <span className="text-xs text-slate-400">
                                  No examples
                                </span>
                              )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingWord(word)}
                              aria-label={`Edit ${word.persianWord}`}
                              title="Edit word"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeletingWord(word)}
                              aria-label={`Delete ${word.persianWord}`}
                              title="Delete word"
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

              {/* Empty state */}
              {words.length === 0 && (
                <div className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                    <Search className="h-6 w-6" />
                  </div>

                  <h3 className="mt-4 text-base font-semibold text-slate-900">
                    No dictionary entries found
                  </h3>

                  <p className="mt-1 max-w-sm text-sm text-slate-500">
                    Try another search term or create a new dictionary entry.
                  </p>

                  {!searchTerm.trim() && (
                    <Link
                      href="/dashboard/admin/create/dictionary"
                      className="mt-5 inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
                    >
                      <Plus className="h-4 w-4" />
                      Create Dictionary Entry
                    </Link>
                  )}
                </div>
              )}
            </>
          )}

          <div className="flex flex-col gap-2 border-t border-slate-200 bg-slate-50/60 px-5 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Displaying {words.length} of {totalWords} received records
            </span>

            <span>Dictionary management</span>
          </div>
        </section>
      </div>

      {/* Edit modal */}
      {editingWord && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeEditModal();
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-dictionary-title"
            className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  <Pencil className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <h2
                    id="edit-dictionary-title"
                    className="text-lg font-bold text-slate-900"
                  >
                    Edit Dictionary Word
                  </h2>

                  <p className="truncate text-sm text-slate-500">
                    {editingWord.persianWord}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                disabled={isUpdating}
                aria-label="Close edit modal"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-5 sm:p-6">
              <FormContainer
                key={editingWord.id}
                onSubmit={handleUpdate}
                resolver={zodResolver(DictionarySchema)}
                defaultValues={{
                  persianWord: editingWord.persianWord,
                  transliteration: editingWord.transliteration ?? "",
                  banglaMeaning: editingWord.banglaMeaning,
                  englishMeaning: editingWord.englishMeaning ?? "",
                  exampleFA: editingWord.exampleFA ?? "",
                  exampleEN: editingWord.exampleEN ?? "",
                  exampleBN: editingWord.exampleBN ?? "",
                }}
              >
                <div className="space-y-7">
                  {/* Word information */}
                  <section className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-1 w-10 rounded-full bg-teal-600" />
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                        Word Information
                      </h3>
                    </div>

                    <FormInput
                      name="persianWord"
                      label="Persian Word"
                      placeholder="مثلاً: کتاب"
                      className="text-right text-xl"
                      required
                    />

                    <FormInput
                      name="transliteration"
                      label="Transliteration"
                      placeholder="e.g., Ketab"
                    />
                  </section>

                  {/* Meanings */}
                  <section className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-1 w-10 rounded-full bg-purple-500" />
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                        Meanings & Translations
                      </h3>
                    </div>

                    <FormTextarea
                      name="banglaMeaning"
                      label="Bangla Meaning"
                      rows={4}
                      placeholder="বাংলা অর্থ লিখুন..."
                      required
                    />

                    <FormTextarea
                      name="englishMeaning"
                      label="English Meaning"
                      rows={4}
                      placeholder="Enter English meaning..."
                    />
                  </section>

                  {/* Examples */}
                  <section className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-1 w-10 rounded-full bg-teal-500" />
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                        Usage Examples
                      </h3>
                    </div>

                    <FormTextarea
                      name="exampleFA"
                      label="Persian Example"
                      rows={3}
                      placeholder="جمله فارسی را وارد کنید..."
                    />

                    <FormTextarea
                      name="exampleEN"
                      label="English Example"
                      rows={3}
                      placeholder="Enter the English example..."
                    />

                    <FormTextarea
                      name="exampleBN"
                      label="Bangla Example"
                      rows={3}
                      placeholder="বাংলা উদাহরণ বাক্য লিখুন..."
                    />
                  </section>

                  {/* Guidelines */}
                  <section className="space-y-4 rounded-2xl border border-teal-100 bg-teal-50/50 p-5">
                    <div className="flex items-center gap-3">
                      <Sparkles className="h-5 w-5 text-teal-700" />
                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-700">
                        Entry Guidelines
                      </h3>
                    </div>

                    <ul className="grid grid-cols-1 gap-3 text-xs text-slate-600 sm:grid-cols-2">
                      {[
                        "Provide the correct Persian word",
                        "Use accurate transliteration",
                        "Bangla meaning is required",
                        "Keep translations accurate",
                        "Use natural Persian examples",
                        "English meaning is optional",
                      ].map((rule) => (
                        <li key={rule} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </section>

                  {/* Actions */}
                  <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={closeEditModal}
                      disabled={isUpdating}
                      className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isUpdating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}

                      {isUpdating ? "Saving changes..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </FormContainer>
            </div>
          </section>
        </div>
      )}

      {/* Soft-delete confirmation modal */}
      {deletingWord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dictionary-title"
            className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
          >
            <div className="flex items-start gap-3 p-5 sm:p-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <AlertTriangle className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <h2
                  id="delete-dictionary-title"
                  className="text-lg font-bold text-slate-900"
                >
                  Delete Dictionary Word?
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-slate-700">
                    {deletingWord.persianWord || "this word"}
                  </span>
                  ? This will soft-delete the entry and remove it from active
                  dictionary records.
                </p>
              </div>

              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={isDeleting}
                aria-label="Close delete dialog"
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50/70 p-5 sm:flex-row sm:justify-end sm:px-6">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => void handleDelete()}
                disabled={isDeleting}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}

                {isDeleting ? "Deleting..." : "Delete Word"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
};

export default ManageDictionaryPage;
