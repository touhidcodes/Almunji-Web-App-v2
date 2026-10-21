"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { Edit, Plus, Search, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import FormInput from "@/components/forms/FormInput";
import FormTextarea from "@/components/forms/FormTextarea";
import FormTags from "@/components/forms/FormTags";
import { useDebounce } from "@/hooks/useDebounce";

import {
  useGetAllDuasQuery,
  useSoftDeleteDuaMutation,
  useUpdateDuaMutation,
} from "@/redux/api/duaApi";

import { UpdateDuaSchema, type TDuaFormValues } from "@/schema/duaSchema";

import type { TDuaData, TUpdateDuaPayload } from "@/types/dua";
import { TApiError } from "@/types/api";

const CREATE_URL = "/dashboard/admin/create/dua";

type TManagedDua = TDuaData & {
  id: string;
};

type TEditDuaFormProps = {
  dua: TManagedDua;
  isUpdating: boolean;
  onCancel: () => void;
  onSubmit: (data: TDuaFormValues) => Promise<void>;
};

// Convert API values and custom input values to string arrays.
const normalizeTags = (value: unknown): string[] => {
  let tags: unknown = value;

  // Support JSON-encoded arrays returned as strings.
  if (typeof tags === "string") {
    const trimmed = tags.trim();

    if (!trimmed) return [];

    try {
      const parsed: unknown = JSON.parse(trimmed);

      if (Array.isArray(parsed)) {
        tags = parsed;
      } else {
        tags = trimmed.split(",");
      }
    } catch {
      tags = trimmed.split(",");
    }
  }

  if (!Array.isArray(tags)) return [];

  return [
    ...new Set(
      tags
        .filter((tag): tag is string => typeof tag === "string")
        .flatMap((tag) => tag.split(","))
        .map((tag) => tag.trim())
        .filter(Boolean),
    ),
  ];
};

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error !== "object" || error === null) {
    return fallback;
  }

  const apiError = error as TApiError;

  if (
    typeof apiError.data?.message === "string" &&
    apiError.data.message.trim()
  ) {
    return apiError.data.message;
  }

  if (typeof apiError.message === "string" && apiError.message.trim()) {
    return apiError.message;
  }

  return fallback;
};

function EditFormValidationErrors() {
  const {
    formState: { errors },
  } = useFormContext<TDuaFormValues>();

  const fieldLabels: Record<string, string> = {
    name: "Dua name",
    arabic: "Arabic text",
    transliteration: "Transliteration",
    bangla: "Bangla translation",
    english: "English translation",
    reference: "Reference",
    tags: "Tags",
  };

  const entries = Object.entries(errors).filter(
    ([, error]) => typeof error?.message === "string",
  );

  if (!entries.length) return null;

  return (
    <div
      role="alert"
      className="space-y-1 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"
    >
      <p className="font-semibold">
        Please correct these fields before saving:
      </p>

      {entries.map(([field, error]) => (
        <p key={field}>
          <span className="font-medium">{fieldLabels[field] ?? field}:</span>{" "}
          {typeof error?.message === "string" ? error.message : "Invalid value"}
        </p>
      ))}
    </div>
  );
}

function EditDuaForm({
  dua,
  isUpdating,
  onCancel,
  onSubmit,
}: TEditDuaFormProps) {
  const form = useForm<TDuaFormValues>({
    resolver: zodResolver(UpdateDuaSchema),
    defaultValues: {
      name: dua.name ?? "",
      arabic: dua.arabic ?? "",
      transliteration: dua.transliteration ?? "",
      bangla: dua.bangla ?? "",
      english: dua.english ?? "",
      reference: dua.reference ?? "",
      tags: normalizeTags(dua.tags),
    },
    mode: "onSubmit",
  });

  const handleValidSubmit = async (values: TDuaFormValues): Promise<void> => {
    await onSubmit({
      ...values,
      tags: normalizeTags(values.tags),
    });
  };

  const handleInvalidSubmit = (): void => {
    const firstError = Object.entries(form.formState.errors)[0];

    if (firstError) {
      const [field, error] = firstError;

      toast.error("Form validation failed", {
        description:
          typeof error?.message === "string"
            ? `${field}: ${error.message}`
            : `Please check the ${field} field.`,
      });
    }
  };

  const isBusy = isUpdating || form.formState.isSubmitting;

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(handleValidSubmit, handleInvalidSubmit)}
        noValidate
        className="space-y-5"
      >
        <FormInput name="name" label="Dua name" required />

        <FormTextarea
          name="arabic"
          label="Arabic text"
          rows={4}
          required
          className="text-right text-2xl leading-loose"
        />

        <FormTextarea name="transliteration" label="Transliteration" rows={2} />

        <FormTextarea
          name="bangla"
          label="Bangla translation"
          rows={3}
          required
        />

        <FormTextarea name="english" label="English translation" rows={3} />

        <FormInput
          name="reference"
          label="Reference"
          placeholder="e.g. Sahih al-Bukhari 1234"
        />

        <FormTags
          name="tags"
          label="Tags"
          placeholder="Type a tag and press Enter"
        />

        <EditFormValidationErrors />

        <footer className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isBusy}
            className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isBusy}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isBusy ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Saving...
              </>
            ) : (
              "Save changes"
            )}
          </button>
        </footer>
      </form>
    </FormProvider>
  );
}

const ManageDuasPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingDua, setEditingDua] = useState<TManagedDua | null>(null);
  const [deletingDua, setDeletingDua] = useState<TManagedDua | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const {
    data: duasData,
    isLoading: isLoadingDuas,
    isFetching: isFetchingDuas,
    refetch: refetchDuas,
  } = useGetAllDuasQuery({
    searchTerm: debouncedSearchTerm,
  });

  const [updateDua, { isLoading: isUpdating }] = useUpdateDuaMutation();

  const [softDeleteDua, { isLoading: isDeleting }] = useSoftDeleteDuaMutation();

  const duas: TManagedDua[] = (duasData?.data ?? []) as TManagedDua[];

  const closeEditModal = () => {
    if (!isUpdating) setEditingDua(null);
  };

  const handleUpdate = async (values: TDuaFormValues): Promise<void> => {
    if (!editingDua || isUpdating) return;

    const name = values.name.trim();
    const arabic = values.arabic.trim();
    const bangla = values.bangla.trim();

    if (!name || !arabic || !bangla) {
      toast.error("Required fields are missing", {
        description:
          "Dua name, Arabic text, and Bangla translation are required.",
      });
      return;
    }

    // Always send tags as string[], never as a raw string.
    // Empty optional strings are retained so users can clear fields.
    const payload: TUpdateDuaPayload = {
      name,
      arabic,
      bangla,
      transliteration: values.transliteration?.trim() ?? "",
      english: values.english?.trim() ?? "",
      reference: values.reference?.trim() ?? "",
      tags: normalizeTags(values.tags),
    };

    try {
      await updateDua({
        id: editingDua.id,
        data: payload,
      }).unwrap();

      toast.success("Dua updated successfully.");
      setEditingDua(null);

      await refetchDuas();
    } catch (error: unknown) {
      toast.error("Failed to update Dua", {
        description: getErrorMessage(
          error,
          "The server rejected the update. Please verify the fields and try again.",
        ),
        duration: 6000,
      });

      console.error("Update Dua failed:", error);
    }
  };

  const handleSoftDelete = async (): Promise<void> => {
    if (!deletingDua || isDeleting) return;

    try {
      await softDeleteDua(deletingDua.id).unwrap();

      toast.success("Dua deleted successfully.");
      setDeletingDua(null);

      await refetchDuas();
    } catch (error: unknown) {
      toast.error("Failed to delete Dua", {
        description: getErrorMessage(
          error,
          "Could not delete the Dua. Please try again.",
        ),
      });

      console.error("Delete Dua failed:", error);
    }
  };

  const clearFilters = () => setSearchTerm("");

  return (
    <main className="min-h-screen bg-gray-50/70 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Manage Duas
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage Duas, Arabic text, translations, references, and tags.
            </p>
          </div>

          <Link
            href={CREATE_URL}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Create Dua
          </Link>
        </header>

        <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(240px,1fr)_auto]">
            <label className="relative block">
              <span className="sr-only">Search Duas</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search Dua name, Arabic, translation, or reference..."
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </label>

            <button
              type="button"
              onClick={clearFilters}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
            >
              Clear search
            </button>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 sm:px-5">
            <h2 className="text-sm font-semibold text-gray-800">Dua Records</h2>
            <span className="text-xs text-gray-500">
              {isLoadingDuas
                ? "Loading..."
                : `${duas.length} records${isFetchingDuas ? " · Updating..." : ""}`}
            </span>
          </div>

          {isLoadingDuas ? (
            <div className="space-y-3 p-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-16 animate-pulse rounded-lg bg-gray-100"
                />
              ))}
            </div>
          ) : duas.length === 0 ? (
            <div className="px-4 py-16 text-center">
              <h3 className="text-base font-semibold text-gray-800">
                No Duas found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try changing your search term or create a new Dua.
              </p>
              {searchTerm && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="w-[190px] px-4 py-3 font-semibold">
                      Dua Name
                    </th>
                    <th className="w-[240px] px-4 py-3 font-semibold">
                      Arabic
                    </th>
                    <th className="w-[300px] px-4 py-3 font-semibold">
                      Translations
                    </th>
                    <th className="w-[160px] px-4 py-3 font-semibold">
                      Reference
                    </th>
                    <th className="w-[170px] px-4 py-3 font-semibold">Tags</th>
                    <th className="sticky right-0 z-20 w-[100px] bg-gray-50 px-4 py-3 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {duas.map((dua) => {
                    const tags = normalizeTags(dua.tags);

                    return (
                      <tr
                        key={dua.id}
                        className="align-top transition hover:bg-gray-50/70"
                      >
                        <td className="max-w-[190px] px-4 py-4">
                          <p className="break-words font-medium text-gray-800">
                            {dua.name}
                          </p>
                          <p className="mt-1 break-all text-xs text-gray-400">
                            {dua.id}
                          </p>
                        </td>

                        <td className="max-w-[240px] px-4 py-4">
                          <p
                            dir="rtl"
                            lang="ar"
                            className="line-clamp-4 text-right text-xl leading-loose text-gray-900"
                          >
                            {dua.arabic}
                          </p>
                          {dua.transliteration && (
                            <p className="mt-2 line-clamp-2 text-xs italic leading-5 text-gray-500">
                              {dua.transliteration}
                            </p>
                          )}
                        </td>

                        <td className="max-w-[300px] px-4 py-4">
                          <div className="space-y-2">
                            <div>
                              <p className="mb-1 text-xs font-medium text-gray-400">
                                Bangla
                              </p>
                              <p className="line-clamp-3 break-words leading-6 text-gray-700">
                                {dua.bangla || "—"}
                              </p>
                            </div>
                            {dua.english && (
                              <div>
                                <p className="mb-1 text-xs font-medium text-gray-400">
                                  English
                                </p>
                                <p className="line-clamp-3 break-words leading-6 text-gray-600">
                                  {dua.english}
                                </p>
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="max-w-[160px] px-4 py-4">
                          <p className="line-clamp-3 break-words leading-6 text-gray-600">
                            {dua.reference || "—"}
                          </p>
                        </td>

                        <td className="max-w-[170px] px-4 py-4">
                          {tags.length ? (
                            <div className="flex flex-wrap gap-1.5">
                              {tags.slice(0, 3).map((tag, index) => (
                                <span
                                  key={`${tag}-${index}`}
                                  className="max-w-full break-words rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600"
                                >
                                  {tag}
                                </span>
                              ))}
                              {tags.length > 3 && (
                                <span className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-500">
                                  +{tags.length - 3}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>

                        <td className="sticky right-0 z-10 whitespace-nowrap border-l border-gray-100 bg-white px-4 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingDua(dua)}
                              aria-label={`Edit ${dua.name}`}
                              className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingDua(dua)}
                              aria-label={`Delete ${dua.name}`}
                              className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {editingDua && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isUpdating) {
              closeEditModal();
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-dua-title"
            className="flex max-h-[95vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <header className="flex shrink-0 items-center justify-between border-b border-gray-200 px-5 py-4 sm:px-6">
              <div>
                <h2
                  id="edit-dua-title"
                  className="text-lg font-semibold text-gray-900"
                >
                  Edit Dua
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Update the Dua details below.
                </p>
              </div>
              <button
                type="button"
                onClick={closeEditModal}
                disabled={isUpdating}
                aria-label="Close edit modal"
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="overflow-y-auto p-5 sm:p-6">
              <EditDuaForm
                key={editingDua.id}
                dua={editingDua}
                isUpdating={isUpdating}
                onCancel={closeEditModal}
                onSubmit={handleUpdate}
              />
            </div>
          </section>
        </div>
      )}

      {deletingDua && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 p-4 backdrop-blur-sm">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dua-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <Trash2 className="h-5 w-5" />
            </div>

            <h2
              id="delete-dua-title"
              className="mt-4 text-lg font-semibold text-gray-900"
            >
              Delete Dua?
            </h2>

            <p className="mt-2 break-words text-sm leading-6 text-gray-500">
              <span className="font-medium text-gray-700">
                {deletingDua.name}
              </span>{" "}
              will be removed from the active Dua list. This uses soft-delete
              rather than permanently removing the record.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeletingDua(null)}
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

export default ManageDuasPage;
