"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Edit,
  Folder,
  FolderPlus,
  Loader2,
  Plus,
  Search,
  Trash2,
  X,
  AlertTriangle,
  Save,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import z from "zod/v3";
import Link from "next/link";

import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";
import { useDebounce } from "@/hooks/useDebounce";

import {
  useCreateCategoryMutation,
  useGetAllCategoriesAdminQuery,
  useSoftDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from "@/redux/api/categoryApi";

/* ──────────────────────── Schema & types ──────────────────────── */

const CategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
});

type TCategoryFormValues = z.infer<typeof CategorySchema>;

type TCategory = {
  id: string;
  name: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

/* ──────────────────────── Error helper ────────────────────────── */

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof (error as { data: unknown }).data === "object" &&
    (error as { data: unknown }).data !== null &&
    "message" in (error as { data: { message: unknown } }).data &&
    typeof (error as { data: { message: unknown } }).data.message === "string"
  ) {
    return (error as { data: { message: string } }).data.message;
  }
  return fallback;
};

/* ──────────────────────────── Page ────────────────────────────── */

const ManageCategoryPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<TCategory | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<TCategory | null>(null);

  const debouncedSearch = useDebounce(searchTerm, 400);

  const { data: categoriesData, isLoading } = useGetAllCategoriesAdminQuery(undefined);
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [softDeleteCategory, { isLoading: isDeleting }] = useSoftDeleteCategoryMutation();

  const allCategories = (categoriesData?.data as TCategory[] | undefined) ?? [];

  const categories = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    if (!term) return allCategories;
    return allCategories.filter((c) =>
      c.name.toLowerCase().includes(term),
    );
  }, [allCategories, debouncedSearch]);

  /* ── Handlers ── */

  const handleCreate = async (data: TCategoryFormValues) => {
    try {
      await createCategory(data).unwrap();
      toast.success("Category created successfully!");
      setIsCreateOpen(false);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to create category."));
    }
  };

  const handleUpdate = async (data: TCategoryFormValues) => {
    if (!editingCategory) return;
    try {
      await updateCategory({ id: editingCategory.id, data }).unwrap();
      toast.success("Category updated successfully.");
      setEditingCategory(null);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to update category."));
    }
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;
    try {
      await softDeleteCategory(deletingCategory.id).unwrap();
      toast.success("Category deleted successfully.");
      setDeletingCategory(null);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to delete category."));
    }
  };

  const clearSearch = () => setSearchTerm("");

  /* ───────────────────────── Render ──────────────────────────── */

  return (
    <main className="min-h-screen bg-gray-50/70 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl space-y-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500">
          <Link href="/dashboard/admin" className="transition hover:text-teal-700">
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4 shrink-0" />
          <span className="font-medium text-slate-800">Manage Categories</span>
        </nav>

        {/* Page header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-teal-600 p-3">
              <Folder className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                Manage Categories
              </h1>
              <p className="mt-0.5 text-sm text-gray-500">
                Create, edit and delete content categories.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Create Category
          </button>
        </header>

        {/* Stats */}
        <section className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:gap-4 sm:p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700 sm:h-11 sm:w-11">
              <Folder className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 sm:text-sm">Total</p>
              <p className="mt-0.5 text-xl font-bold text-gray-900 sm:mt-1 sm:text-2xl">
                {allCategories.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:gap-4 sm:p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700 sm:h-11 sm:w-11">
              <Search className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 sm:text-sm">Showing</p>
              <p className="mt-0.5 text-xl font-bold text-gray-900 sm:mt-1 sm:text-2xl">
                {categories.length}
              </p>
            </div>
          </div>
        </section>

        {/* Search & table section */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          {/* Toolbar */}
          <div className="flex flex-col gap-4 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <h2 className="text-base font-semibold text-gray-900">All Categories</h2>
              <p className="mt-0.5 text-sm text-gray-500">
                Search and manage your content categories.
              </p>
            </div>
            <div className="relative w-full sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search categories..."
                aria-label="Search categories"
                className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              />
            </div>
          </div>

          {/* Loading */}
          {isLoading ? (
            <div className="space-y-3 p-4 sm:p-5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-14 animate-pulse rounded-xl bg-gray-100" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            /* Empty state */
            <div className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                {searchTerm ? (
                  <Search className="h-6 w-6" />
                ) : (
                  <FolderPlus className="h-6 w-6" />
                )}
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900">
                {searchTerm ? "No matching categories" : "No categories yet"}
              </h3>
              <p className="mt-1 max-w-sm text-sm text-gray-500">
                {searchTerm
                  ? "Try a different search term."
                  : "Create your first content category to get started."}
              </p>
              {searchTerm ? (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="mt-4 rounded-lg px-3 py-2 text-sm font-semibold text-teal-700 transition hover:bg-teal-50"
                >
                  Clear search
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(true)}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  <Plus className="h-4 w-4" />
                  Create Category
                </button>
              )}
            </div>
          ) : (
            <>
              {/* ── Mobile / sm: card list (hidden on md+) ── */}
              <ul className="divide-y divide-gray-100 md:hidden">
                {categories.map((cat) => (
                  <li
                    key={cat.id}
                    className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                        <Folder className="h-4 w-4" />
                      </div>
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {cat.name}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingCategory(cat)}
                        aria-label={`Edit ${cat.name}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingCategory(cat)}
                        aria-label={`Delete ${cat.name}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {/* ── Desktop: table (hidden below md) ── */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50/80">
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Category Name
                      </th>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                        ID
                      </th>
                      <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {categories.map((cat) => (
                      <tr
                        key={cat.id}
                        className="align-middle transition hover:bg-gray-50/80"
                      >
                        {/* Name */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                              <Folder className="h-4 w-4" />
                            </div>
                            <span className="font-semibold text-gray-900">
                              {cat.name}
                            </span>
                          </div>
                        </td>

                        {/* ID */}
                        <td className="px-5 py-4">
                          <span className="font-mono text-xs text-gray-400">
                            {cat.id}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingCategory(cat)}
                              aria-label={`Edit ${cat.name}`}
                              title="Edit category"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingCategory(cat)}
                              aria-label={`Delete ${cat.name}`}
                              title="Delete category"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
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
            </>
          )}

          {/* Footer */}
          {!isLoading && (
            <div className="flex flex-col gap-1 border-t border-gray-200 bg-gray-50/60 px-4 py-3 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <span>
                Showing {categories.length} of {allCategories.length} categories
              </span>
              <span>Category management</span>
            </div>
          )}
        </section>
      </div>

      {/* ══════════════════════ Create modal ══════════════════════ */}
      {isCreateOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setIsCreateOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-category-title"
            className="w-full overflow-hidden rounded-t-2xl border border-gray-100 bg-white shadow-xl sm:max-w-md sm:rounded-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                  <FolderPlus className="h-5 w-5" />
                </div>
                <div>
                  <h2
                    id="create-category-title"
                    className="text-base font-semibold text-gray-900"
                  >
                    Create Category
                  </h2>
                  <p className="text-xs text-gray-500">
                    Add a new content category
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                disabled={isCreating}
                aria-label="Close create modal"
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-6">
              <FormContainer
                onSubmit={handleCreate}
                resolver={zodResolver(CategorySchema)}
              >
                <div className="space-y-5">
                  <FormInput
                    name="name"
                    label="Category Name"
                    placeholder="e.g. Islamic History"
                    required
                  />

                  <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={() => setIsCreateOpen(false)}
                      disabled={isCreating}
                      className="inline-flex min-h-10 items-center justify-center rounded-xl border border-gray-200 px-5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isCreating}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isCreating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      {isCreating ? "Creating..." : "Create Category"}
                    </button>
                  </div>
                </div>
              </FormContainer>
            </div>
          </section>
        </div>
      )}

      {/* ══════════════════════ Edit modal ════════════════════════ */}
      {editingCategory && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !isUpdating)
              setEditingCategory(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-category-title"
            className="w-full overflow-hidden rounded-t-2xl border border-gray-100 bg-white shadow-xl sm:max-w-md sm:rounded-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
                  <Edit className="h-5 w-5" />
                </div>
                <div>
                  <h2
                    id="edit-category-title"
                    className="text-base font-semibold text-gray-900"
                  >
                    Edit Category
                  </h2>
                  <p className="max-w-[200px] truncate text-xs text-gray-500">
                    {editingCategory.name}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                disabled={isUpdating}
                aria-label="Close edit modal"
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-6">
              <FormContainer
                key={editingCategory.id}
                onSubmit={handleUpdate}
                resolver={zodResolver(CategorySchema)}
                defaultValues={{ name: editingCategory.name }}
              >
                <div className="space-y-5">
                  <FormInput
                    name="name"
                    label="Category Name"
                    placeholder="e.g. Islamic History"
                    required
                  />

                  <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={() => setEditingCategory(null)}
                      disabled={isUpdating}
                      className="inline-flex min-h-10 items-center justify-center rounded-xl border border-gray-200 px-5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
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

      {/* ══════════════════ Delete confirmation ═══════════════════ */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-category-title"
            className="w-full overflow-hidden rounded-t-2xl border border-gray-100 bg-white shadow-xl sm:max-w-md sm:rounded-2xl"
          >
            <div className="flex items-start gap-3 p-5 sm:p-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h2
                  id="delete-category-title"
                  className="text-base font-bold text-gray-900 sm:text-lg"
                >
                  Delete Category?
                </h2>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-gray-800">
                    &ldquo;{deletingCategory.name}&rdquo;
                  </span>
                  ? This will soft-delete it and remove it from active records.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDeletingCategory(null)}
                disabled={isDeleting}
                aria-label="Close delete dialog"
                className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-gray-200 bg-gray-50/70 p-4 sm:flex-row sm:justify-end sm:px-6">
              <button
                type="button"
                onClick={() => setDeletingCategory(null)}
                disabled={isDeleting}
                className="inline-flex min-h-10 items-center justify-center rounded-xl border border-gray-200 bg-white px-5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
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
                {isDeleting ? "Deleting..." : "Delete Category"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
};

export default ManageCategoryPage;
