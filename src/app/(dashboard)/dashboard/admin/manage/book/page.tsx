"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  BookOpen,
  BookMarked,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  FileText,
  LoaderCircle,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
  Star,
  Layers3,
} from "lucide-react";
import { toast } from "sonner";

import {
  useGetAllBooksAdminQuery,
  useUpdateBookMutation,
  useSoftDeleteBookMutation,
  useGetContentsByBookQuery,
  useUpdateBookContentMutation,
  useCreateBookContentMutation,
  useSoftDeleteBookContentMutation,
} from "@/redux/api/bookApi";

import { useGetAllCategoriesAdminQuery } from "@/redux/api/categoryApi";

import type { TBook, TBookContent } from "@/types/book";
import type { TApiError } from "@/types/api";

// ============================================================
// Types
// ============================================================

interface TBookCategoryOption {
  id: string;
  name: string;
  isDeleted?: boolean;
}

interface TBookContentDraft {
  id?: string;
  section: string;
  index: number;
  text: string;
}

interface TBookFormValues {
  name: string;
  description: string;
  cover: string;
  categoryId: string;
  isFeatured: boolean;
}

interface TBookEditModalProps {
  book: TBook;
  onClose: () => void;
  onSaved: () => Promise<void>;
}

interface TStatCardProps {
  label: string;
  value: string;
  description: string;
  icon: ReactNode;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// ============================================================
// Helpers
// ============================================================

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null) {
    const apiError = error as TApiError;

    return (
      apiError.data?.message ??
      apiError.message ??
      "Something went wrong. Please try again."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

/**
 * Safely extracts arrays from common API response structures:
 *
 * data: []
 * data: { data: [] }
 * data: { contents: [] }
 * data: { results: [] }
 *
 * This prevents runtime errors when API responses are nested.
 */
const extractArray = <T,>(value: unknown): T[] => {
  if (Array.isArray(value)) {
    return value as T[];
  }

  if (!isRecord(value)) {
    return [];
  }

  const possibleKeys = [
    "data",
    "contents",
    "categories",
    "books",
    "results",
  ] as const;

  for (const key of possibleKeys) {
    const nestedValue = value[key];

    if (Array.isArray(nestedValue)) {
      return nestedValue as T[];
    }

    if (isRecord(nestedValue)) {
      const nestedArray = extractArray<T>(nestedValue);

      if (nestedArray.length > 0) {
        return nestedArray;
      }
    }
  }

  return [];
};

const truncateText = (
  text: string | null | undefined,
  maxLength = 45,
): string => {
  if (!text) return "—";

  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

const formatDate = (date: string | Date): string => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ============================================================
// Reusable Components
// ============================================================

const StatCard = ({ label, value, description, icon }: TStatCardProps) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{label}</p>

          <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </h3>

          <p className="mt-1 text-xs text-slate-400">{description}</p>
        </div>

        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
          {icon}
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="px-5 py-16 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-slate-100">
        <BookOpen className="size-7 text-slate-400" />
      </div>

      <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>

      <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
};

// ============================================================
// Book Content Editor
// ============================================================

interface TBookContentEditorProps {
  contents: TBookContentDraft[];
  onChange: (contents: TBookContentDraft[]) => void;
  disabled: boolean;
}

const BookContentEditor = ({
  contents,
  onChange,
  disabled,
}: TBookContentEditorProps) => {
  const updateContent = (
    index: number,
    field: keyof TBookContentDraft,
    value: string | number,
  ) => {
    const updatedContents = contents.map((content, currentIndex) =>
      currentIndex === index
        ? {
            ...content,
            [field]: value,
          }
        : content,
    );

    onChange(updatedContents);
  };

  const addContent = () => {
    const nextIndex =
      contents.length > 0
        ? Math.max(...contents.map((content) => content.index)) + 1
        : 1;

    onChange([
      ...contents,
      {
        section: "",
        index: nextIndex,
        text: "",
      },
    ]);
  };

  const removeContent = (index: number) => {
    onChange(contents.filter((_, currentIndex) => currentIndex !== index));
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">Book Contents</h3>

          <p className="mt-1 text-xs text-slate-500">
            Manage individual sections of this book.
          </p>
        </div>

        <span className="w-fit rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
          {contents.length} Sections
        </span>
      </div>

      {contents.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center">
          <FileText className="mx-auto size-8 text-slate-400" />

          <p className="mt-3 text-sm font-semibold text-slate-700">
            No sections available
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Add a section to start building this book.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {contents.map((content, index) => (
            <div
              key={content.id ?? `new-${index}`}
              className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-xs font-bold text-emerald-700">
                    {index + 1}
                  </span>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800">
                      Section {index + 1}
                    </p>

                    <p className="text-xs text-slate-400">
                      {content.id ? "Existing section" : "New section"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => removeContent(index)}
                  className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-rose-100 bg-white text-rose-500 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label={`Remove section ${index + 1}`}
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                <div className="sm:col-span-3">
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    Section Title
                  </label>

                  <input
                    type="text"
                    value={content.section}
                    disabled={disabled}
                    onChange={(event) =>
                      updateContent(index, "section", event.target.value)
                    }
                    placeholder="Enter section title"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    Section Index
                  </label>

                  <input
                    type="number"
                    min={1}
                    step={1}
                    value={content.index}
                    disabled={disabled}
                    onChange={(event) =>
                      updateContent(
                        index,
                        "index",
                        event.target.value === ""
                          ? 1
                          : Number(event.target.value),
                      )
                    }
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="mt-3">
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                  Section Content
                </label>

                <textarea
                  value={content.text}
                  disabled={disabled}
                  onChange={(event) =>
                    updateContent(index, "text", event.target.value)
                  }
                  placeholder="Write or edit the section content..."
                  rows={6}
                  className="w-full resize-y rounded-xl border border-slate-200 bg-white p-3 text-sm leading-6 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:opacity-60"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        disabled={disabled}
        onClick={addContent}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-3 text-sm font-semibold text-slate-500 transition hover:border-emerald-400 hover:bg-emerald-50/50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Plus className="size-4" />
        Add Another Section
      </button>
    </section>
  );
};

// ============================================================
// Book Edit Modal
// ============================================================

const BookEditModal = ({ book, onClose, onSaved }: TBookEditModalProps) => {
  const [updateBook] = useUpdateBookMutation();
  const [updateBookContent] = useUpdateBookContentMutation();
  const [createBookContent] = useCreateBookContentMutation();
  const [softDeleteBookContent] = useSoftDeleteBookContentMutation();

  const {
    data: contentResponse,
    isLoading: isContentsLoading,
    isError: isContentsError,
    refetch: refetchContents,
  } = useGetContentsByBookQuery(book.id ?? "", {
    skip: !book.id,
  });

  const contents = useMemo(
    () => extractArray<TBookContent>(contentResponse),
    [contentResponse],
  );

  const [isSaving, setIsSaving] = useState(false);

  const [formValues, setFormValues] = useState<TBookFormValues>({
    name: book.name,
    description: book.description ?? "",
    cover: book.cover,
    categoryId: book.categoryId,
    isFeatured: book.isFeatured,
  });

  const [bookContents, setBookContents] = useState<TBookContentDraft[]>([]);

  const originalContentIds = useMemo(
    () => new Set(contents.map((content) => content.id)),
    [contents],
  );

  // Initialize the form only after the contents query finishes.
  // Memoizing contents prevents unnecessary form resets.
  useEffect(() => {
    if (isContentsLoading) return;

    setFormValues({
      name: book.name,
      description: book.description ?? "",
      cover: book.cover,
      categoryId: book.categoryId,
      isFeatured: book.isFeatured,
    });

    setBookContents(
      contents.map((content) => ({
        id: content.id,
        section: content.section,
        index: content.index,
        text: content.text,
      })),
    );
  }, [book, contents, isContentsLoading]);

  const updateBookField = <K extends keyof TBookFormValues>(
    field: K,
    value: TBookFormValues[K],
  ) => {
    setFormValues((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!book.id) {
      toast.error("Invalid book ID.");
      return;
    }

    if (!formValues.name.trim()) {
      toast.error("Book name is required.");
      return;
    }

    if (!formValues.cover.trim()) {
      toast.error("Book cover URL is required.");
      return;
    }

    if (!formValues.categoryId) {
      toast.error("Please select a category.");
      return;
    }

    if (isContentsLoading || isContentsError) {
      toast.error("Please load the book contents before saving.");
      return;
    }

    const invalidContent = bookContents.some(
      (content) =>
        !content.section.trim() ||
        !content.text.trim() ||
        !Number.isInteger(content.index) ||
        content.index < 1,
    );

    if (invalidContent) {
      toast.error("Every section needs a title, content, and a valid index.");
      return;
    }

    const indexes = bookContents.map((content) => content.index);

    if (new Set(indexes).size !== indexes.length) {
      toast.error("Section indexes must be unique.");
      return;
    }

    setIsSaving(true);

    try {
      // Step 1: Update book information.
      await updateBook({
        id: book.id,
        data: {
          name: formValues.name.trim(),
          description: formValues.description.trim() || undefined,
          cover: formValues.cover.trim(),
          categoryId: formValues.categoryId,
          isFeatured: formValues.isFeatured,
        },
      }).unwrap();

      // Step 2: Soft-delete removed sections.
      const currentContentIds = new Set(
        bookContents
          .map((content) => content.id)
          .filter((id): id is string => Boolean(id)),
      );

      const removedContentIds = [...originalContentIds].filter(
        (id) => !currentContentIds.has(id),
      );

      for (const contentId of removedContentIds) {
        await softDeleteBookContent(contentId).unwrap();
      }

      // Step 3: Update existing sections and create new sections.
      const sortedContents = [...bookContents].sort(
        (a, b) => a.index - b.index,
      );

      for (const content of sortedContents) {
        const payload = {
          section: content.section.trim(),
          index: content.index,
          text: content.text,
        };

        if (content.id) {
          await updateBookContent({
            id: content.id,
            data: payload,
          }).unwrap();
        } else {
          await createBookContent({
            bookId: book.id,
            ...payload,
          }).unwrap();
        }
      }

      toast.success("Book updated successfully.");

      await onSaved();
      onClose();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (isSaving) return;
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-2 backdrop-blur-sm sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="flex max-h-[95vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Pencil className="size-5" />
            </div>

            <div className="min-w-0">
              <h2 className="font-bold text-slate-900">Edit Book</h2>

              <p className="truncate text-xs text-slate-500">
                Update book information and contents.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSaving}
            className="flex size-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSave} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-7 overflow-y-auto p-4 sm:p-6">
            {/* Book Information */}
            <section className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900">
                  Book Information
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Update the basic information of this book.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    Book Name
                  </label>

                  <input
                    type="text"
                    value={formValues.name}
                    onChange={(event) =>
                      updateBookField("name", event.target.value)
                    }
                    disabled={isSaving}
                    required
                    className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:opacity-60"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    Cover Image URL
                  </label>

                  <input
                    type="url"
                    value={formValues.cover}
                    onChange={(event) =>
                      updateBookField("cover", event.target.value)
                    }
                    disabled={isSaving}
                    required
                    placeholder="https://example.com/book-cover.jpg"
                    className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:opacity-60"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    Description
                  </label>

                  <textarea
                    value={formValues.description}
                    onChange={(event) =>
                      updateBookField("description", event.target.value)
                    }
                    disabled={isSaving}
                    rows={3}
                    placeholder="Write a short description..."
                    className="w-full resize-y rounded-xl border border-slate-200 p-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:opacity-60"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={formValues.isFeatured}
                      disabled={isSaving}
                      onChange={(event) =>
                        updateBookField("isFeatured", event.target.checked)
                      }
                      className="size-4 accent-emerald-600"
                    />

                    <div>
                      <p className="text-sm font-semibold text-slate-700">
                        Featured Book
                      </p>

                      <p className="text-xs text-slate-400">
                        Show this book as a featured item.
                      </p>
                    </div>

                    <Star
                      className={`ml-auto size-5 ${
                        formValues.isFeatured
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300"
                      }`}
                    />
                  </label>
                </div>
              </div>
            </section>

            <div className="border-t border-slate-100" />

            {/* Book Contents */}
            {isContentsLoading ? (
              <div className="flex items-center justify-center gap-2 py-12 text-sm text-slate-500">
                <LoaderCircle className="size-5 animate-spin text-emerald-600" />
                Loading book contents...
              </div>
            ) : isContentsError ? (
              <div className="rounded-xl border border-rose-100 bg-rose-50 p-4 text-center">
                <CircleAlert className="mx-auto size-6 text-rose-500" />

                <p className="mt-2 text-sm font-semibold text-rose-700">
                  Unable to load book contents.
                </p>

                <button
                  type="button"
                  onClick={() => void refetchContents()}
                  className="mt-3 text-xs font-semibold text-rose-700 underline"
                >
                  Try again
                </button>
              </div>
            ) : (
              <BookContentEditor
                contents={bookContents}
                onChange={setBookContents}
                disabled={isSaving}
              />
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-slate-100 bg-white px-4 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSaving}
              className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving || isContentsLoading || isContentsError}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================
// Main Manage Books Page
// ============================================================

const ManageBooksPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const [selectedBook, setSelectedBook] = useState<TBook | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  const [softDeleteBook] = useSoftDeleteBookMutation();

  // ----------------------------------------------------------
  // Debounced Search
  // ----------------------------------------------------------

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedCategory, limit]);

  // ----------------------------------------------------------
  // API Queries
  // ----------------------------------------------------------

  const {
    data: bookResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAllBooksAdminQuery({});

  const { data: categoryResponse, isLoading: isCategoriesLoading } =
    useGetAllCategoriesAdminQuery({});

  // ----------------------------------------------------------
  // Safely Normalize API Responses
  // ----------------------------------------------------------

  const books = useMemo(
    () => extractArray<TBook>(bookResponse),
    [bookResponse],
  );

  // Explicit category type: no implicit any.
  const categories = useMemo(
    () =>
      extractArray<TBookCategoryOption>(categoryResponse).filter(
        (category) => !category.isDeleted,
      ),
    [categoryResponse],
  );

  // ----------------------------------------------------------
  // Filtering
  // ----------------------------------------------------------

  const filteredBooks = useMemo(() => {
    const normalizedSearch = debouncedSearch.toLowerCase();

    return books.filter((book) => {
      const matchesSearch =
        !normalizedSearch ||
        book.name.toLowerCase().includes(normalizedSearch) ||
        (book.slug ?? "").toLowerCase().includes(normalizedSearch);

      const matchesCategory =
        !selectedCategory || book.categoryId === selectedCategory;

      return matchesSearch && matchesCategory && !book.isDeleted;
    });
  }, [books, debouncedSearch, selectedCategory]);

  // ----------------------------------------------------------
  // Pagination
  // ----------------------------------------------------------

  const total = filteredBooks.length;

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const currentPage = Math.min(page, totalPages);

  const startItem = total === 0 ? 0 : (currentPage - 1) * limit + 1;

  const endItem = Math.min(currentPage * limit, total);

  const paginatedBooks = useMemo(() => {
    const startIndex = (currentPage - 1) * limit;

    return filteredBooks.slice(startIndex, startIndex + limit);
  }, [filteredBooks, currentPage, limit]);

  // ----------------------------------------------------------
  // Statistics
  // ----------------------------------------------------------

  const featuredCount = books.filter(
    (book) => book.isFeatured && !book.isDeleted,
  ).length;

  const activeCount = books.filter((book) => !book.isDeleted).length;

  // ----------------------------------------------------------
  // Category Lookup
  // ----------------------------------------------------------

  const getCategoryName = (categoryId: string): string => {
    return (
      categories.find(
        (category: TBookCategoryOption) => category.id === categoryId,
      )?.name ?? "Uncategorized"
    );
  };

  // ----------------------------------------------------------
  // Actions
  // ----------------------------------------------------------

  const handleDelete = async (book: TBook) => {
    if (!book.id) {
      toast.error("Invalid book ID.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${book.name}"?`,
    );

    if (!confirmed) return;

    setIsDeletingId(book.id);

    try {
      await softDeleteBook(book.id).unwrap();

      toast.success("Book deleted successfully.");

      await refetch();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsDeletingId(null);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setSelectedCategory("");
    setPage(1);
  };

  const handleModalSaved = async () => {
    await refetch();
  };

  // ----------------------------------------------------------
  // UI
  // ----------------------------------------------------------

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
                Manage Books
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage books, categories, and individual book contents.
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

        {/* Statistics */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            label="Total Books"
            value={activeCount.toLocaleString()}
            description="All active books"
            icon={<BookMarked className="size-5 text-emerald-600" />}
          />

          <StatCard
            label="Featured Books"
            value={featuredCount.toLocaleString()}
            description="Currently marked as featured"
            icon={<Star className="size-5 fill-amber-400 text-amber-400" />}
          />

          <StatCard
            label="Categories"
            value={categories.length.toLocaleString()}
            description="Available book categories"
            icon={<Layers3 className="size-5 text-emerald-600" />}
          />
        </section>

        {/* Filters */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4">
            <h2 className="font-semibold text-slate-900">Filter Books</h2>

            <p className="mt-1 text-sm text-slate-500">
              Search by book name or slug and filter by category.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search books..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </label>

            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              disabled={isCategoriesLoading}
              aria-label="Filter by category"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="">All Categories</option>

              {categories.map((category: TBookCategoryOption) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              aria-label="Rows per page"
              value={limit}
              onChange={(event) => setLimit(Number(event.target.value))}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-emerald-500"
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
              className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <X className="size-4" />
              Clear Filters
            </button>
          </div>
        </section>

        {/* Books Table */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div>
              <h2 className="font-semibold text-slate-900">Book Records</h2>

              <p className="mt-1 text-xs text-slate-500">
                {total === 0
                  ? "No records found"
                  : `Showing ${startItem.toLocaleString()}–${endItem.toLocaleString()} of ${total.toLocaleString()} books`}
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
                Unable to load books
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
              Loading books...
            </div>
          ) : paginatedBooks.length === 0 ? (
            <EmptyState
              title="No books found"
              description="Try changing your search term or category filter."
            />
          ) : (
            <>
              {/* Responsive table with sticky actions */}
              <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[1050px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <th className="whitespace-nowrap px-5 py-4">#</th>

                      <th className="whitespace-nowrap px-5 py-4">Book</th>

                      <th className="whitespace-nowrap px-5 py-4">Category</th>

                      <th className="whitespace-nowrap px-5 py-4">Slug</th>

                      <th className="whitespace-nowrap px-5 py-4">Featured</th>

                      <th className="whitespace-nowrap px-5 py-4">
                        Created At
                      </th>

                      <th className="sticky right-0 z-20 whitespace-nowrap border-l border-slate-200 bg-slate-50 px-5 py-4 text-center shadow-[-8px_0_12px_-10px_rgba(15,23,42,0.25)]">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {paginatedBooks.map((book, index) => (
                      <tr
                        key={book.id}
                        className="transition hover:bg-slate-50/80"
                      >
                        <td className="whitespace-nowrap px-5 py-4 text-slate-400">
                          {(currentPage - 1) * limit + index + 1}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex min-w-[220px] items-center gap-3">
                            {book.cover ? (
                              <img
                                src={book.cover}
                                alt={book.name}
                                className="size-12 shrink-0 rounded-xl border border-slate-200 bg-slate-50 object-cover"
                              />
                            ) : (
                              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                                <BookOpen className="size-5 text-emerald-600" />
                              </div>
                            )}

                            <div className="min-w-0">
                              <p className="max-w-[220px] truncate font-semibold text-slate-800">
                                {book.name}
                              </p>

                              <p className="mt-1 max-w-[220px] truncate text-xs text-slate-400">
                                {truncateText(book.description, 45)}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                            {getCategoryName(book.categoryId)}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-500">
                          {book.slug ?? "—"}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4">
                          {book.isFeatured ? (
                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-700">
                              <Star className="size-3 fill-amber-500" />
                              Featured
                            </span>
                          ) : (
                            <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-500">
                              Standard
                            </span>
                          )}
                        </td>

                        <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-500">
                          {formatDate(book.createdAt)}
                        </td>

                        {/* Sticky Actions Column */}
                        <td className="sticky right-0 z-10 border-l border-slate-200 bg-white px-5 py-4 shadow-[-8px_0_12px_-10px_rgba(15,23,42,0.25)]">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedBook(book)}
                              className="inline-flex size-9 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100"
                              aria-label={`Edit ${book.name}`}
                              title="Edit book"
                            >
                              <Pencil className="size-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => void handleDelete(book)}
                              disabled={isDeletingId === book.id}
                              className="inline-flex size-9 items-center justify-center rounded-lg border border-rose-100 bg-rose-50 text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                              aria-label={`Delete ${book.name}`}
                              title="Delete book"
                            >
                              {isDeletingId === book.id ? (
                                <LoaderCircle className="size-4 animate-spin" />
                              ) : (
                                <Trash2 className="size-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <p className="text-xs text-slate-500">
                  Page {currentPage} of {totalPages}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => setPage((previous) => previous - 1)}
                    className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft className="size-4" />
                    Previous
                  </button>

                  <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-emerald-50 px-3 text-xs font-bold text-emerald-700">
                    {currentPage}
                  </span>

                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => setPage((previous) => previous + 1)}
                    className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
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

      {/* Edit Modal */}
      {selectedBook && (
        <BookEditModal
          key={selectedBook.id}
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onSaved={handleModalSaved}
        />
      )}
    </main>
  );
};

export default ManageBooksPage;
