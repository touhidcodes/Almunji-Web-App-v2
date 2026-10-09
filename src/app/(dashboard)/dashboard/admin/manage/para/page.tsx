"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Save,
  Loader2,
  ChevronRight,
  AlertTriangle,
  Languages,
  BookMarked,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";
import {
  useGetAllParaQuery,
  useUpdateParaMutation,
  useSoftDeleteParaMutation,
} from "@/redux/api/paraApi";
import { ParaSchema } from "@/schema/paraSchema";
import type { TPara, TUpdateParaPayload } from "@/types/para";

const ManageParaPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingPara, setEditingPara] = useState<TPara | null>(null);
  const [deletingPara, setDeletingPara] = useState<TPara | null>(null);

  const {
    data: parasData,
    isLoading: isLoadingParas,
    isFetching,
  } = useGetAllParaQuery({ searchTerm });

  const [updatePara, { isLoading: isUpdating }] = useUpdateParaMutation();

  const [softDeletePara, { isLoading: isSoftDeleting }] =
    useSoftDeleteParaMutation();

  const paras = parasData?.data ?? [];

  const totalParas = paras.length;
  const isDeleting = isSoftDeleting;

  const filteredParas = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return paras;

    return paras.filter((para) =>
      [
        String(para.number),
        para.arabic,
        para.english,
        para.bangla,
        para.startAyahRef,
        para.endAyahRef,
      ].some((value) => value?.toLowerCase().includes(term)),
    );
  }, [paras, searchTerm]);

  const closeEditModal = () => {
    if (isUpdating) return;
    setEditingPara(null);
  };

  const handleUpdate = async (data: TUpdateParaPayload) => {
    if (!editingPara) return;

    try {
      const response = await updatePara({
        paraId: editingPara.id,
        payload: data,
      }).unwrap();

      if (response.success) {
        toast.success("Para updated successfully.");
        setEditingPara(null);
      } else {
        toast.error("Unable to update the para.");
      }
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof error.data === "object" &&
        error.data !== null &&
        "message" in error.data &&
        typeof error.data.message === "string"
          ? error.data.message
          : "Failed to update para.";

      toast.error(message);
    }
  };

  const handleDelete = async () => {
    if (!deletingPara) return;

    try {
      await softDeletePara(deletingPara.id).unwrap();

      toast.success("Para deleted successfully.");
      setDeletingPara(null);
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof error.data === "object" &&
        error.data !== null &&
        "message" in error.data &&
        typeof error.data.message === "string"
          ? error.data.message
          : "Failed to delete para.";

      toast.error(message);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50/70 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500">
          <Link
            href="/dashboard/admin"
            className="transition hover:text-emerald-700"
          >
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-slate-800">Manage Paras</span>
        </nav>

        {/* Page header */}
        <section className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <BookOpen className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Manage Paras
              </h1>
              <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                View, update, and manage Quranic para records from one place.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/admin/create/para"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            <Plus className="h-4 w-4" />
            Create New Para
          </Link>
        </section>

        {/* Summary */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <BookMarked className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">
                Records found
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {totalParas}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
              <Languages className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Displaying</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">
                {filteredParas.length}
              </p>
            </div>
          </div>
        </section>

        {/* Table container */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Para directory
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Search records and manage their details.
              </p>
            </div>

            <div className="relative w-full sm:max-w-sm">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search number, name, or ayah..."
                aria-label="Search paras"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>

          {isLoadingParas ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3">
              <Loader2 className="h-7 w-7 animate-spin text-emerald-700" />
              <p className="text-sm text-slate-500">Loading para records...</p>
            </div>
          ) : (
            <>
              {isFetching && (
                <div className="h-0.5 w-full overflow-hidden bg-emerald-50">
                  <div className="h-full w-1/3 animate-pulse bg-emerald-600" />
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80">
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Para
                      </th>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Arabic name
                      </th>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Transliteration
                      </th>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Ayah range
                      </th>
                      <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredParas.map((para) => (
                      <tr
                        key={para.id}
                        className="transition hover:bg-slate-50/80"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-800">
                              {para.number}
                            </span>
                            <div>
                              <p className="text-sm font-semibold text-slate-900">
                                Para {para.number}
                              </p>
                              <p className="mt-0.5 text-xs text-slate-500">
                                Quranic section
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            dir="rtl"
                            className="text-lg font-medium text-slate-800"
                          >
                            {para.arabic || "—"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-slate-700">
                            {para.english || "—"}
                          </p>
                          {para.bangla && (
                            <p className="mt-1 text-xs text-slate-500">
                              {para.bangla}
                            </p>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-1.5 text-xs text-slate-600">
                            <span className="w-fit rounded-md border border-slate-200 bg-white px-2 py-1">
                              Start: {para.startAyahRef}
                            </span>
                            <span className="w-fit rounded-md border border-slate-200 bg-white px-2 py-1">
                              End: {para.endAyahRef}
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingPara(para)}
                              aria-label={`Edit para ${para.number}`}
                              title="Edit para"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setDeletingPara(para);
                              }}
                              aria-label={`Delete para ${para.number}`}
                              title="Delete para"
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

              {filteredParas.length === 0 && (
                <div className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                    <Search className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-slate-900">
                    No para records found
                  </h3>
                  <p className="mt-1 max-w-sm text-sm text-slate-500">
                    Try another search term or create a new para record.
                  </p>
                  {searchTerm.trim() === "" && (
                    <Link
                      href="/dashboard/admin/create/para"
                      className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
                    >
                      <Plus className="h-4 w-4" />
                      Create Para
                    </Link>
                  )}
                </div>
              )}
            </>
          )}

          <div className="flex flex-col gap-2 border-t border-slate-200 bg-slate-50/60 px-5 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Showing {filteredParas.length} of {totalParas} records
            </span>
            <span>Para management</span>
          </div>
        </section>
      </div>

      {/* Edit modal */}
      {editingPara && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeEditModal();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-para-title"
            className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Pencil className="h-5 w-5" />
                </div>
                <div>
                  <h2
                    id="edit-para-title"
                    className="text-lg font-bold text-slate-900"
                  >
                    Edit Para
                  </h2>
                  <p className="text-sm text-slate-500">
                    Update the details for Para {editingPara.number}.
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
                key={editingPara.id}
                onSubmit={handleUpdate}
                resolver={zodResolver(ParaSchema)}
                defaultValues={{
                  number: editingPara.number,
                  arabic: editingPara.arabic,
                  english: editingPara.english || "",
                  bangla: editingPara.bangla || "",
                  startAyahRef: editingPara.startAyahRef,
                  endAyahRef: editingPara.endAyahRef,
                }}
              >
                <div className="space-y-5">
                  <FormInput
                    name="number"
                    label="Para Number"
                    type="number"
                    placeholder="1–30"
                    required
                  />

                  <FormInput
                    name="arabic"
                    label="Arabic Name"
                    placeholder="Enter Arabic name"
                    className="text-right text-2xl"
                    required
                  />

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <FormInput
                      name="english"
                      label="Transliteration"
                      placeholder="e.g. Alif Lam Meem"
                    />
                    <FormInput
                      name="bangla"
                      label="Bangla Name"
                      placeholder="বাংলা নাম"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <FormInput
                      name="startAyahRef"
                      label="Starting Ayah Reference"
                      placeholder="2:1"
                      required
                    />
                    <FormInput
                      name="endAyahRef"
                      label="Ending Ayah Reference"
                      placeholder="2:141"
                      required
                    />
                  </div>

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
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
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

      {/* Delete confirmation modal */}
      {deletingPara && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-para-title"
            className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
          >
            <div className="flex items-start gap-3 p-5 sm:p-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <AlertTriangle className="h-5 w-5" />
              </div>

              <div className="flex-1">
                <h2
                  id="delete-para-title"
                  className="text-lg font-bold text-slate-900"
                >
                  Delete Para {deletingPara.number}?
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Are you sure you want to delete this para? It will be
                  soft-deleted and will no longer appear in the active records.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setDeletingPara(null)}
                disabled={isSoftDeleting}
                aria-label="Close delete dialog"
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50/70 p-5 sm:flex-row sm:justify-end sm:px-6">
              <button
                type="button"
                onClick={() => setDeletingPara(null)}
                disabled={isSoftDeleting}
                className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isSoftDeleting}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSoftDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}

                {isSoftDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
};

export default ManageParaPage;
