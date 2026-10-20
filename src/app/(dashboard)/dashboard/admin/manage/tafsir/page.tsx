"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  FileText,
  LoaderCircle,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
  Pencil,
  BookMarked,
} from "lucide-react";
import { toast } from "sonner";

import { useGetAyahsWithTafsirQuery } from "@/redux/api/ayahApi";
import { useGetAllSurahQuery } from "@/redux/api/surahApi";
import { useGetAllParaQuery } from "@/redux/api/paraApi";
import {
  useCreateTafsirMutation,
  useUpdateTafsirMutation,
  useSoftDeleteTafsirMutation,
} from "@/redux/api/tafsirApi";

import type { TAyah } from "@/types/ayah";
import type { TSurah } from "@/types/surah";
import type { TPara } from "@/types/para";

type TTafsir = {
  id: string;
  heading?: string | null;
  summaryBn?: string | null;
  summaryEn?: string | null;
  detailBn?: string | null;
  detailEn?: string | null;
  scholar?: string | null;
  reference?: string | null;
  tags?: string | null;
  isDeleted?: boolean;
};

type TAyahWithTafsir = TAyah & {
  surah?: {
    id: string;
    chapter: number;
    arabic: string;
    english: string;
    bangla: string;
  } | null;
  para?: {
    id: string;
    number: number;
    arabic: string;
    english: string;
    bangla: string;
  } | null;
  tafsir?: TTafsir | null;
};

type TPageMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

type TFormValues = {
  heading: string;
  summaryBn: string;
  summaryEn: string;
  detailBn: string;
  detailEn: string;
  scholar: string;
  reference: string;
  tags: string;
};

type TApiError = {
  data?: {
    message?: string;
  };
  message?: string;
};

const INITIAL_FORM: TFormValues = {
  heading: "",
  summaryBn: "",
  summaryEn: "",
  detailBn: "",
  detailEn: "",
  scholar: "",
  reference: "",
  tags: "",
};

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null) {
    const apiError = error as TApiError;

    return (
      apiError.data?.message ??
      apiError.message ??
      "Something went wrong. Please try again."
    );
  }

  return "Something went wrong. Please try again.";
};

const getTafsir = (ayah: TAyahWithTafsir): TTafsir | undefined => {
  if (ayah.tafsir && !ayah.tafsir.isDeleted) {
    return ayah.tafsir;
  }

  return undefined;
};

const truncateText = (
  text: string | null | undefined,
  maxLength = 20,
): string => {
  if (!text) return "—";

  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

const getSurahLabel = (surah: TSurah): string => {
  const name = surah.english || surah.bangla || surah.arabic;
  return `${surah.chapter}. ${name}`;
};

const getParaLabel = (para: TPara): string => {
  const name = para.english || para.bangla || "";
  return `Para ${para.number}${name ? ` - ${name}` : ""}`;
};

const ManageTafsirsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSurah, setSelectedSurah] = useState("");
  const [selectedPara, setSelectedPara] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAyah, setSelectedAyah] = useState<TAyahWithTafsir | null>(
    null,
  );
  const [editingTafsir, setEditingTafsir] = useState<TTafsir | null>(null);
  const [formValues, setFormValues] = useState<TFormValues>(INITIAL_FORM);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [isDeletePending, setIsDeletePending] = useState(false);

  // Debounce search to avoid requesting the API on every keystroke.
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [selectedSurah, selectedPara, debouncedSearch, limit]);

  const queryParams = useMemo(
    () => ({
      page,
      limit,
      surahId: selectedSurah || undefined,
      paraId: selectedPara || undefined,
      searchTerm: debouncedSearch || undefined,
      sortBy: "number",
      sortOrder: "asc" as const,
    }),
    [page, limit, selectedSurah, selectedPara, debouncedSearch],
  );

  const {
    data: ayahResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAyahsWithTafsirQuery(queryParams);

  const { data: surahResponse, isLoading: isLoadingSurahs } =
    useGetAllSurahQuery({});

  const { data: paraResponse, isLoading: isLoadingParas } = useGetAllParaQuery(
    {},
  );

  const [createTafsir, { isLoading: isCreating }] = useCreateTafsirMutation();

  const [updateTafsir, { isLoading: isUpdating }] = useUpdateTafsirMutation();

  const [softDeleteTafsir] = useSoftDeleteTafsirMutation();

  const ayahs = (ayahResponse?.data ?? []) as TAyahWithTafsir[];
  const surahs = surahResponse?.data ?? [];
  const paras = paraResponse?.data ?? [];

  const meta = (
    ayahResponse as
      | {
          meta?: TPageMeta;
        }
      | undefined
  )?.meta;

  const total = meta?.total ?? ayahs.length;
  const currentPage = meta?.page ?? page;
  const totalPages = Math.max(1, meta?.totalPages ?? Math.ceil(total / limit));

  const startItem = total === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, total);

  const isSaving = isCreating || isUpdating;

  const tafsirCount = ayahs.filter((ayah) => Boolean(getTafsir(ayah))).length;

  const missingCount = ayahs.length - tafsirCount;

  const closeModal = () => {
    if (isSaving) return;

    setIsModalOpen(false);
    setSelectedAyah(null);
    setEditingTafsir(null);
    setFormValues(INITIAL_FORM);
  };

  const openCreateModal = (ayah: TAyahWithTafsir) => {
    setSelectedAyah(ayah);
    setEditingTafsir(null);
    setFormValues(INITIAL_FORM);
    setIsModalOpen(true);
  };

  const openEditModal = (ayah: TAyahWithTafsir, tafsir: TTafsir) => {
    setSelectedAyah(ayah);
    setEditingTafsir(tafsir);

    setFormValues({
      heading: tafsir.heading ?? "",
      summaryBn: tafsir.summaryBn ?? "",
      summaryEn: tafsir.summaryEn ?? "",
      detailBn: tafsir.detailBn ?? "",
      detailEn: tafsir.detailEn ?? "",
      scholar: tafsir.scholar ?? "",
      reference: tafsir.reference ?? "",
      tags: tafsir.tags ?? "",
    });

    setIsModalOpen(true);
  };

  const updateField = (field: keyof TFormValues, value: string) => {
    setFormValues((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedAyah) {
      toast.error("Please select an Ayah.");
      return;
    }

    const hasContent = Object.values(formValues).some(
      (value) => value.trim().length > 0,
    );

    if (!hasContent) {
      toast.error("Enter at least one Tafsir field.");
      return;
    }

    const payload = {
      heading: formValues.heading.trim() || undefined,
      summaryBn: formValues.summaryBn.trim() || undefined,
      summaryEn: formValues.summaryEn.trim() || undefined,
      detailBn: formValues.detailBn.trim() || undefined,
      detailEn: formValues.detailEn.trim() || undefined,
      scholar: formValues.scholar.trim() || undefined,
      reference: formValues.reference.trim() || undefined,
      tags: formValues.tags.trim() || undefined,
    };

    try {
      if (editingTafsir) {
        await updateTafsir({
          id: editingTafsir.id,
          data: payload,
        }).unwrap();

        toast.success("Tafsir updated successfully.");
      } else {
        await createTafsir({
          ayahId: selectedAyah.id,
          ...payload,
        }).unwrap();

        toast.success("Tafsir created successfully.");
      }

      setIsModalOpen(false);
      setSelectedAyah(null);
      setEditingTafsir(null);
      setFormValues(INITIAL_FORM);

      await refetch();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleDelete = async (tafsir: TTafsir) => {
    const confirmed = window.confirm(
      "Are you sure you want to soft-delete this Tafsir?",
    );

    if (!confirmed) return;

    setIsDeletingId(tafsir.id);
    setIsDeletePending(true);

    try {
      await softDeleteTafsir(tafsir.id).unwrap();
      toast.success("Tafsir deleted successfully.");
      await refetch();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsDeletingId(null);
      setIsDeletePending(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setSelectedSurah("");
    setSelectedPara("");
    setPage(1);
  };

  return (
    <main className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
              <BookOpen className="size-6" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Manage Tafsirs
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Manage verse explanations, translations, and scholarly
                references.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void refetch()}
            disabled={isFetching}
            className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
          >
            <RefreshCw
              className={`size-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </header>

        {/* Stats */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label="Matching Ayahs"
            value={total.toLocaleString()}
            description="Across the selected filters"
            icon={<FileText className="size-5 text-emerald-600" />}
          />

          <StatCard
            label="Tafsir Available"
            value={tafsirCount.toLocaleString()}
            description="On the current page"
            icon={<CheckCircle2 className="size-5 text-emerald-600" />}
          />

          <StatCard
            label="Tafsir Missing"
            value={missingCount.toLocaleString()}
            description="On the current page"
            icon={<CircleAlert className="size-5 text-amber-600" />}
          />
        </section>

        {/* Filters */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4">
            <h2 className="font-semibold text-slate-900">Filter Ayahs</h2>
            <p className="mt-1 text-sm text-slate-500">
              Filter by Surah, Para, or text. Filters can be combined.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search verse or Tafsir..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </label>

            <select
              value={selectedSurah}
              onChange={(event) => setSelectedSurah(event.target.value)}
              disabled={isLoadingSurahs}
              aria-label="Filter by Surah"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="">All Surahs</option>
              {surahs.map((surah: TSurah) => (
                <option key={surah.id} value={surah.id}>
                  {getSurahLabel(surah)}
                </option>
              ))}
            </select>

            <select
              value={selectedPara}
              onChange={(event) => setSelectedPara(event.target.value)}
              disabled={isLoadingParas}
              aria-label="Filter by Para"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="">All Paras</option>
              {paras.map((para: TPara) => (
                <option key={para.id} value={para.id}>
                  {getParaLabel(para)}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <select
                aria-label="Rows per page"
                value={limit}
                onChange={(event) => setLimit(Number(event.target.value))}
                className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-emerald-500"
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size} per page
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                <X className="size-4" />
                Clear
              </button>
            </div>
          </div>
        </section>

        {/* Table */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div>
              <h2 className="font-semibold text-slate-900">
                Ayah and Tafsir Records
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                {total === 0
                  ? "No records found"
                  : `Showing ${startItem.toLocaleString()}–${endItem.toLocaleString()} of ${total.toLocaleString()} records`}
              </p>
            </div>

            {isFetching && (
              <span className="inline-flex items-center gap-2 text-xs font-medium text-emerald-700">
                <LoaderCircle className="size-4 animate-spin" />
                Updating records...
              </span>
            )}
          </div>

          {isError ? (
            <div className="px-5 py-16 text-center">
              <CircleAlert className="mx-auto size-10 text-rose-500" />
              <h3 className="mt-3 font-semibold text-slate-900">
                Unable to load Tafsir records
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Check your connection and try again.
              </p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Try again
              </button>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center gap-3 px-5 py-20 text-sm text-slate-500">
              <LoaderCircle className="size-5 animate-spin text-emerald-600" />
              Loading Ayah and Tafsir records...
            </div>
          ) : ayahs.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-slate-100">
                <BookOpen className="size-7 text-slate-400" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">
                No Ayahs found
              </h3>
              <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                Try changing the Surah or Para filters, or use a different
                search term.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] table-fixed text-left">
                  <thead className="bg-slate-50/80">
                    <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <th className="w-20 px-4 py-3">Ayah</th>
                      <th className="w-[30%] px-4 py-3">Surah &amp; Verse</th>
                      <th className="w-[32%] px-4 py-3">Tafsir</th>
                      <th className="w-32 px-4 py-3">Status</th>
                      <th className="w-28 px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {ayahs.map((ayah) => {
                      const tafsir = getTafsir(ayah);

                      return (
                        <tr
                          key={ayah.id}
                          className="align-top transition hover:bg-slate-50/70"
                        >
                          <td className="px-4 py-4">
                            <span className="inline-flex min-w-10 items-center justify-center rounded-lg bg-emerald-50 px-2 py-1.5 text-sm font-bold text-emerald-700">
                              {ayah.number}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            <div className="space-y-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="truncate text-sm font-semibold text-slate-800">
                                    {ayah.surah?.english ?? "Unknown Surah"}
                                  </p>
                                  {ayah.surah?.chapter != null && (
                                    <span className="shrink-0 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
                                      {ayah.surah.chapter}
                                    </span>
                                  )}
                                </div>

                                <p className="mt-0.5 truncate text-xs text-slate-500">
                                  {ayah.surah?.bangla ?? "—"}
                                </p>

                                {ayah.surah?.arabic && (
                                  <p
                                    dir="rtl"
                                    className="mt-1 text-sm text-slate-600"
                                  >
                                    {ayah.surah.arabic}
                                  </p>
                                )}
                              </div>

                              <div className="rounded-lg bg-slate-50 px-3 py-2">
                                <p
                                  dir="rtl"
                                  title={ayah.arabic}
                                  className="text-right text-base leading-7 text-slate-800"
                                >
                                  {truncateText(ayah.arabic, 20)}
                                </p>

                                <p
                                  title={ayah.english ?? ""}
                                  className="mt-1 text-xs leading-5 text-slate-500"
                                >
                                  {truncateText(ayah.english, 20)}
                                </p>

                                {ayah.para && (
                                  <p className="mt-2 border-t border-slate-200 pt-2 text-[11px] text-slate-400">
                                    Para {ayah.para.number}
                                    {ayah.para.english
                                      ? ` · ${ayah.para.english}`
                                      : ""}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            {tafsir ? (
                              <div className="space-y-1.5">
                                <p className="line-clamp-1 text-sm font-semibold text-slate-800">
                                  {tafsir.heading || "Untitled Tafsir"}
                                </p>

                                <p
                                  title={
                                    tafsir.summaryBn || tafsir.summaryEn || ""
                                  }
                                  className="text-xs leading-5 text-slate-500"
                                >
                                  {truncateText(
                                    tafsir.summaryBn || tafsir.summaryEn,
                                    20,
                                  )}
                                </p>

                                {tafsir.scholar && (
                                  <p className="truncate text-[11px] text-slate-400">
                                    Scholar: {tafsir.scholar}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <p className="pt-1 text-sm text-slate-400">
                                No Tafsir added yet
                              </p>
                            )}
                          </td>

                          <td className="px-4 py-4">
                            {tafsir ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700">
                                <CheckCircle2 className="size-3.5" />
                                Available
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-700">
                                Missing
                              </span>
                            )}
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex justify-end gap-1">
                              {tafsir ? (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => openEditModal(ayah, tafsir)}
                                    title="Edit Tafsir"
                                    aria-label={`Edit Tafsir for Ayah ${ayah.number}`}
                                    className="inline-flex size-9 items-center justify-center rounded-lg text-emerald-700 transition hover:bg-emerald-50"
                                  >
                                    <Pencil className="size-4" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => void handleDelete(tafsir)}
                                    disabled={
                                      isDeletePending &&
                                      isDeletingId === tafsir.id
                                    }
                                    title="Delete Tafsir"
                                    aria-label={`Delete Tafsir for Ayah ${ayah.number}`}
                                    className="inline-flex size-9 items-center justify-center rounded-lg text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
                                  >
                                    {isDeletingId === tafsir.id ? (
                                      <LoaderCircle className="size-4 animate-spin" />
                                    ) : (
                                      <Trash2 className="size-4" />
                                    )}
                                  </button>
                                </>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => openCreateModal(ayah)}
                                  title="Add Tafsir"
                                  aria-label={`Add Tafsir for Ayah ${ayah.number}`}
                                  className="inline-flex size-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100"
                                >
                                  <Plus className="size-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <p className="text-xs text-slate-500">
                  Showing{" "}
                  <span className="font-semibold text-slate-700">
                    {startItem.toLocaleString()}–{endItem.toLocaleString()}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-700">
                    {total.toLocaleString()}
                  </span>
                  {" · "}Page {currentPage} of {totalPages}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setPage((previous) => Math.max(1, previous - 1))
                    }
                    disabled={currentPage <= 1 || isFetching}
                    className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft className="size-4" />
                    Previous
                  </button>

                  <span className="min-w-10 text-center text-sm font-semibold text-slate-700">
                    {currentPage}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setPage((previous) => Math.min(totalPages, previous + 1))
                    }
                    disabled={currentPage >= totalPages || isFetching}
                    className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>

      {/* Add / Edit Tafsir modal */}
      {isModalOpen && selectedAyah && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="tafsir-modal-title"
            className="flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
              <div>
                <h2
                  id="tafsir-modal-title"
                  className="text-lg font-bold text-slate-900"
                >
                  {editingTafsir ? "Edit Tafsir" : "Add Tafsir"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedAyah.surah?.english ?? "Surah"} · Ayah{" "}
                  {selectedAyah.number}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={isSaving}
                aria-label="Close modal"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="overflow-y-auto px-5 py-5 sm:px-6">
              <div className="mb-5 rounded-xl bg-slate-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-500">
                  <BookMarked className="size-4" />
                  {selectedAyah.surah?.english ?? "Unknown Surah"}
                  {selectedAyah.surah?.chapter != null &&
                    ` · Surah ${selectedAyah.surah.chapter}`}
                  {" · "}Ayah {selectedAyah.number}
                </div>

                <p
                  dir="rtl"
                  className="text-right text-xl leading-10 text-slate-900"
                >
                  {selectedAyah.arabic}
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {selectedAyah.english}
                </p>
              </div>

              <form
                id="tafsir-form"
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div>
                  <label
                    htmlFor="heading"
                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                  >
                    Heading
                  </label>
                  <input
                    id="heading"
                    value={formValues.heading}
                    onChange={(event) =>
                      updateField("heading", event.target.value)
                    }
                    placeholder="Enter Tafsir heading"
                    className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormTextarea
                    id="summaryBn"
                    label="Summary (Bangla)"
                    placeholder="সংক্ষিপ্ত তাফসির লিখুন"
                    value={formValues.summaryBn}
                    onChange={(value) => updateField("summaryBn", value)}
                    rows={3}
                  />

                  <FormTextarea
                    id="summaryEn"
                    label="Summary (English)"
                    placeholder="Write a short explanation"
                    value={formValues.summaryEn}
                    onChange={(value) => updateField("summaryEn", value)}
                    rows={3}
                  />

                  <FormTextarea
                    id="detailBn"
                    label="Detailed Tafsir (Bangla)"
                    placeholder="বিস্তারিত তাফসির লিখুন"
                    value={formValues.detailBn}
                    onChange={(value) => updateField("detailBn", value)}
                    rows={6}
                  />

                  <FormTextarea
                    id="detailEn"
                    label="Detailed Tafsir (English)"
                    placeholder="Write the detailed explanation"
                    value={formValues.detailEn}
                    onChange={(value) => updateField("detailEn", value)}
                    rows={6}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <FormInput
                    id="scholar"
                    label="Scholar"
                    placeholder="Scholar name"
                    value={formValues.scholar}
                    onChange={(value) => updateField("scholar", value)}
                  />

                  <FormInput
                    id="reference"
                    label="Reference"
                    placeholder="Book, volume, page..."
                    value={formValues.reference}
                    onChange={(value) => updateField("reference", value)}
                  />

                  <FormInput
                    id="tags"
                    label="Tags"
                    placeholder="Comma-separated tags"
                    value={formValues.tags}
                    onChange={(value) => updateField("tags", value)}
                  />
                </div>
              </form>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              <button
                type="button"
                onClick={closeModal}
                disabled={isSaving}
                className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                form="tafsir-form"
                disabled={isSaving}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving && <LoaderCircle className="size-4 animate-spin" />}
                {isSaving
                  ? "Saving..."
                  : editingTafsir
                    ? "Save Changes"
                    : "Create Tafsir"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
};

type TStatCardProps = {
  label: string;
  value: string;
  description: string;
  icon: React.ReactNode;
};

function StatCard({ label, value, description, icon }: TStatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        {icon}
      </div>
      <p className="mt-3 text-3xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{description}</p>
    </div>
  );
}

type TFormTextareaProps = {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  rows: number;
};

function FormTextarea({
  id,
  label,
  placeholder,
  value,
  onChange,
  rows,
}: TFormTextareaProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full resize-y rounded-xl border border-slate-200 px-3 py-2.5 text-sm leading-6 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      />
    </div>
  );
}

type TFormInputProps = {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};

function FormInput({
  id,
  label,
  placeholder,
  value,
  onChange,
}: TFormInputProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      />
    </div>
  );
}

export default ManageTafsirsPage;
