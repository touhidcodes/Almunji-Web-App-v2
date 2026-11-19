"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useWatch,
  type FieldPath,
} from "react-hook-form";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Edit,
  Loader2,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import {
  useGetAllBooksWithContentsQuery,
  useUpdateBookMutation,
  useSoftDeleteBookMutation,
  useUpdateBookContentMutation,
  useCreateBookContentMutation,
  useSoftDeleteBookContentMutation,
} from "@/redux/api/bookApi";
import { useGetAllCategoriesAdminQuery } from "@/redux/api/categoryApi";
import RichTextEditor from "@/components/forms/RichTextEditor";

import type {
  TBookWithContents,
  TBookContentQueryParams,
  TUpdateBookPayload,
  TUpdateBookContentPayload,
  TCreateBookContentPayload,
} from "@/types/book";

// ------------------------------------------------------
// Types
// ------------------------------------------------------

interface TBookCategory {
  id: string;
  name: string;
  isDeleted?: boolean;
}

interface TBookContentForm {
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
  contents: TBookContentForm[];
}

interface TEditBookModalProps {
  book: TBookWithContents;
  categories: TBookCategory[];
  onClose: () => void;
  onSuccess: () => void;
}

// ------------------------------------------------------
// Helpers
// ------------------------------------------------------

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isBookCategory = (value: unknown): value is TBookCategory => {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    (value.isDeleted === undefined || typeof value.isDeleted === "boolean")
  );
};

const getErrorMessage = (error: unknown): string => {
  if (isRecord(error)) {
    if (typeof error.message === "string") return error.message;

    if (isRecord(error.data) && typeof error.data.message === "string") {
      return error.data.message;
    }
  }

  return "Something went wrong. Please try again.";
};

const formatDate = (date: string): string => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getCategoryId = (
  categoryName: string,
  categories: TBookCategory[],
): string => {
  return (
    categories.find(
      (category) =>
        !category.isDeleted &&
        category.name.toLowerCase() === categoryName.toLowerCase(),
    )?.id ?? ""
  );
};

const getNextContentIndex = (contents: TBookContentForm[]): number => {
  return (
    contents.reduce(
      (maximum, content) => Math.max(maximum, content.index || 0),
      0,
    ) + 1
  );
};

const hasDuplicateIndexes = (contents: TBookContentForm[]): boolean => {
  const indexes = contents.map((content) => content.index);
  return new Set(indexes).size !== indexes.length;
};

const hasEditorContent = (html: string): boolean => {
  const text = html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&#160;/gi, " ")
    .trim();

  return text.length > 0;
};

// ------------------------------------------------------
// Manage Books Page
// ------------------------------------------------------

export default function ManageBooksPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedBook, setSelectedBook] = useState<TBookWithContents | null>(
    null,
  );

  const queryParams: TBookContentQueryParams = {
    page: currentPage,
    limit: pageSize,
    ...(searchTerm.trim() ? { searchTerm: searchTerm.trim() } : {}),
  };

  const {
    data: booksResponse,
    isLoading: isBooksLoading,
    isFetching: isBooksFetching,
    isError: isBooksError,
    refetch: refetchBooks,
  } = useGetAllBooksWithContentsQuery(queryParams);

  const { data: categoriesResponse } = useGetAllCategoriesAdminQuery({});

  const categories = useMemo<TBookCategory[]>(() => {
    const data: unknown = categoriesResponse?.data;

    if (!Array.isArray(data)) return [];

    return data.filter(isBookCategory);
  }, [categoriesResponse]);

  const books = booksResponse?.data ?? [];
  const meta = booksResponse?.meta;

  // This filter applies to the currently loaded page.
  const filteredBooks = useMemo(() => {
    if (categoryFilter === "all") return books;

    return books.filter((book) => book.category.name === categoryFilter);
  }, [books, categoryFilter]);

  const totalBooks = meta?.total ?? books.length;
  const totalPages = Math.max(1, meta?.totalPages ?? 1);

  const [softDeleteBook, { isLoading: isDeletingBook }] =
    useSoftDeleteBookMutation();

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, pageSize]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleDeleteBook = async (book: TBookWithContents) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${book.name}"?`,
    );

    if (!confirmed) return;

    try {
      await softDeleteBook(book.id).unwrap();
      toast.success("Book deleted successfully.");
      await refetchBooks();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleEditSuccess = async () => {
    await refetchBooks();
    setSelectedBook(null);
  };

  const featuredBooks = books.filter((book) => book.isFeatured).length;

  const totalContents = books.reduce(
    (total, book) => total + book.contents.length,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Books</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage books, sections, and their formatted content.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5">
          <BookOpen className="h-5 w-5 text-teal-600" />
          <span className="text-sm font-medium text-gray-700">
            {totalBooks} Books
          </span>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Total Books</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{totalBooks}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Featured Books</p>
          <p className="mt-2 text-2xl font-bold text-teal-600">
            {featuredBooks}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Loaded Sections</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {totalContents}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by book name or slug..."
            className="h-11 w-full rounded-lg border border-gray-200 pl-10 pr-4 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-50"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-teal-500"
        >
          <option value="all">All Categories</option>
          {categories
            .filter((category) => !category.isDeleted)
            .map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
        </select>

        <select
          value={pageSize}
          onChange={(event) => setPageSize(Number(event.target.value))}
          className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-teal-500"
        >
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
        </select>
      </div>

      {/* Books Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {isBooksLoading ? (
          <div className="flex min-h-64 items-center justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-teal-600" />
          </div>
        ) : isBooksError ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-4 text-center">
            <p className="font-semibold text-red-600">Failed to load books</p>
            <p className="mt-1 text-sm text-gray-500">Please try again.</p>
            <button
              type="button"
              onClick={() => void refetchBooks()}
              className="mt-4 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
            >
              Retry
            </button>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-4 text-center">
            <BookOpen className="mb-3 h-10 w-10 text-gray-300" />
            <h3 className="font-semibold text-gray-800">No books found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try changing your search or category filter.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-5 py-4">Book</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Sections</th>
                    <th className="px-5 py-4">Featured</th>
                    <th className="px-5 py-4">Created</th>
                    <th className="sticky right-0 z-10 bg-gray-50 px-5 py-4 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredBooks.map((book) => (
                    <tr
                      key={book.id}
                      className="transition hover:bg-gray-50/70"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={book.cover}
                            alt={book.name}
                            className="h-12 w-10 rounded-md border border-gray-200 object-cover"
                            loading="lazy"
                          />
                          <div className="min-w-0">
                            <p className="max-w-xs truncate font-semibold text-gray-800">
                              {book.name}
                            </p>
                            <p className="mt-1 max-w-xs truncate text-xs text-gray-400">
                              {book.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {book.category.name}
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                          {book.contents.length} Sections
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {book.isFeatured ? (
                          <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700">
                            Featured
                          </span>
                        ) : (
                          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
                            Standard
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-gray-500">
                        {formatDate(book.createdAt)}
                      </td>

                      <td className="sticky right-0 z-[1] bg-white px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedBook(book)}
                            title="Edit book"
                            aria-label={`Edit ${book.name}`}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
                          >
                            <Edit className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => void handleDeleteBook(book)}
                            disabled={isDeletingBook}
                            title="Delete book"
                            aria-label={`Delete ${book.name}`}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 text-red-500 transition hover:bg-red-50 disabled:opacity-50"
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

            {/* Pagination */}
            <div className="flex flex-col justify-between gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center">
              <p className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
                {isBooksFetching && (
                  <span className="ml-2 inline-flex items-center gap-1 text-teal-600">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Updating
                  </span>
                )}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((previous) => Math.max(1, previous - 1))
                  }
                  disabled={currentPage === 1 || isBooksFetching}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <span className="min-w-16 text-center text-sm text-gray-600">
                  {currentPage} / {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((previous) =>
                      Math.min(totalPages, previous + 1),
                    )
                  }
                  disabled={currentPage === totalPages || isBooksFetching}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Edit Modal */}
      {selectedBook && (
        <EditBookModal
          key={selectedBook.id}
          book={selectedBook}
          categories={categories}
          onClose={() => setSelectedBook(null)}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}

// ------------------------------------------------------
// Edit Book Modal
// ------------------------------------------------------

function EditBookModal({
  book,
  categories,
  onClose,
  onSuccess,
}: TEditBookModalProps) {
  const [updateBook, { isLoading: isUpdatingBook }] = useUpdateBookMutation();

  const [updateBookContent] = useUpdateBookContentMutation();
  const [createBookContent] = useCreateBookContentMutation();
  const [softDeleteBookContent] = useSoftDeleteBookContentMutation();

  const [removedContentIds, setRemovedContentIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const methods = useForm<TBookFormValues>({
    defaultValues: {
      name: book.name,
      description: book.description ?? "",
      cover: book.cover,
      categoryId: getCategoryId(book.category.name, categories),
      isFeatured: book.isFeatured,
      contents: [...book.contents]
        .sort((a, b) => a.index - b.index)
        .map((content) => ({
          id: content.id,
          section: content.section,
          index: content.index,
          text: content.text,
        })),
    },
    mode: "onSubmit",
  });

  const {
    register,
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "contents",
    keyName: "fieldId",
  });

  const watchedContents = useWatch({
    control,
    name: "contents",
  });

  // Categories may arrive after the modal has mounted.
  useEffect(() => {
    const currentCategoryId = getValues("categoryId");

    if (currentCategoryId) return;

    const resolvedCategoryId = getCategoryId(book.category.name, categories);

    if (resolvedCategoryId) {
      setValue("categoryId", resolvedCategoryId, {
        shouldValidate: true,
      });
    }
  }, [book.category.name, categories, getValues, setValue]);

  const handleAddSection = () => {
    const nextIndex = getNextContentIndex(watchedContents ?? []);

    append({
      section: "",
      index: nextIndex,
      text: "<p></p>",
    });
  };

  const handleRemoveSection = (fieldIndex: number) => {
    // Read the actual database ID from form values, not the RHF key.
    const contentId = getValues(`contents.${fieldIndex}.id`);

    if (typeof contentId === "string" && contentId.length > 0) {
      setRemovedContentIds((previous) =>
        previous.includes(contentId) ? previous : [...previous, contentId],
      );
    }

    remove(fieldIndex);
  };

  const onSubmit = async (values: TBookFormValues) => {
    const bookName = values.name.trim();
    const cover = values.cover.trim();

    if (!bookName) {
      toast.error("Book name is required.");
      return;
    }

    if (!cover) {
      toast.error("Cover image URL is required.");
      return;
    }

    if (!values.categoryId) {
      toast.error("Please select a book category.");
      return;
    }

    const invalidContentIndex = values.contents.findIndex(
      (content) =>
        !content.section.trim() ||
        !Number.isInteger(content.index) ||
        content.index < 1 ||
        !hasEditorContent(content.text),
    );

    if (invalidContentIndex !== -1) {
      toast.error(
        `Please complete the heading, index, and content for section ${invalidContentIndex + 1}.`,
      );
      return;
    }

    if (hasDuplicateIndexes(values.contents)) {
      toast.error("Each section must have a unique index.");
      return;
    }

    setIsSaving(true);

    try {
      // 1. Update book metadata. Never send slug from the frontend.
      const bookPayload: TUpdateBookPayload = {
        name: bookName,
        description: values.description.trim() || null,
        cover,
        categoryId: values.categoryId,
        isFeatured: values.isFeatured,
      };

      await updateBook({
        id: book.id,
        data: bookPayload,
      }).unwrap();

      // 2. Soft-delete removed existing sections.
      for (const contentId of removedContentIds) {
        await softDeleteBookContent(contentId).unwrap();
      }

      // 3. Update existing sections and create new sections.
      for (const content of values.contents) {
        const section = content.section.trim();

        if (typeof content.id === "string" && content.id.length > 0) {
          const updatePayload: TUpdateBookContentPayload = {
            section,
            index: content.index,
            text: content.text,
          };

          await updateBookContent({
            id: content.id,
            data: updatePayload,
          }).unwrap();
        } else {
          // Explicit required fields: do not spread an optional update type.
          const createPayload: TCreateBookContentPayload = {
            bookId: book.id,
            section,
            index: content.index,
            text: content.text,
          };

          await createBookContent(createPayload).unwrap();
        }
      }

      toast.success("Book and contents updated successfully.");
      onSuccess();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const isBusy = isSaving || isUpdatingBook;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-3 backdrop-blur-[2px] sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-book-title"
    >
      <div className="my-auto w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4 sm:px-7">
          <div>
            <h2
              id="edit-book-title"
              className="text-lg font-bold text-gray-900"
            >
              Edit Book
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Update book information and manage its sections.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isBusy}
            aria-label="Close edit modal"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-7 px-5 py-6 sm:px-7"
          >
            {/* Book Information */}
            <section className="space-y-5">
              <div>
                <h3 className="font-semibold text-gray-900">
                  Book Information
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Update the basic information of this book.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="book-name"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Book Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="book-name"
                    {...register("name", {
                      required: "Book name is required.",
                      validate: (value) =>
                        value.trim().length > 0 || "Book name cannot be empty.",
                    })}
                    placeholder="Enter book name"
                    className="h-11 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-50"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="book-category"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="book-category"
                    {...register("categoryId", {
                      required: "Select a category.",
                    })}
                    className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-teal-500"
                  >
                    <option value="">Select category</option>
                    {categories
                      .filter((category) => !category.isDeleted)
                      .map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                  </select>
                  {errors.categoryId && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.categoryId.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="book-cover"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Cover Image URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="book-cover"
                    type="url"
                    {...register("cover", {
                      required: "Cover image URL is required.",
                      pattern: {
                        value: /^https?:\/\/.+/i,
                        message: "Enter a valid HTTP or HTTPS URL.",
                      },
                    })}
                    placeholder="https://example.com/book-cover.jpg"
                    className="h-11 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-50"
                  />
                  {errors.cover && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.cover.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="book-description"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    id="book-description"
                    {...register("description")}
                    rows={3}
                    placeholder="Write a short description..."
                    className="w-full resize-y rounded-lg border border-gray-200 px-3 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-50"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      {...register("isFeatured")}
                      className="h-4 w-4 rounded border-gray-300 accent-teal-600"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Mark this book as featured
                    </span>
                  </label>
                </div>
              </div>
            </section>

            <div className="border-t border-gray-100" />

            {/* Book Contents */}
            <section className="space-y-5">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h3 className="font-semibold text-gray-900">Book Contents</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Each section has its own heading, index, and rich-text
                    content.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700">
                    {fields.length} Sections
                  </span>

                  <button
                    type="button"
                    onClick={handleAddSection}
                    className="inline-flex h-9 items-center gap-2 rounded-lg bg-teal-600 px-3 text-sm font-semibold text-white transition hover:bg-teal-700"
                  >
                    <Plus className="h-4 w-4" />
                    Add Section
                  </button>
                </div>
              </div>

              {fields.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 py-12 text-center">
                  <BookOpen className="mb-3 h-9 w-9 text-gray-300" />
                  <p className="font-medium text-gray-700">
                    No sections available
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Add a section to start writing book content.
                  </p>
                  <button
                    type="button"
                    onClick={handleAddSection}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
                  >
                    <Plus className="h-4 w-4" />
                    Add First Section
                  </button>
                </div>
              )}

              {fields.map((field, fieldIndex) => {
                const currentContent = watchedContents?.[fieldIndex];
                const contentIndex = currentContent?.index ?? fieldIndex + 1;
                const sectionPath = `contents.${fieldIndex}.section` as const;
                const indexPath = `contents.${fieldIndex}.index` as const;
                const textPath =
                  `contents.${fieldIndex}.text` as FieldPath<TBookFormValues>;

                return (
                  <div
                    key={field.fieldId}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white"
                  >
                    {/* Section Header */}
                    <div className="flex items-center justify-between gap-3 border-b border-gray-100 bg-gray-50 px-4 py-3 sm:px-5">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-100 text-sm font-bold text-teal-700">
                          {Number.isInteger(contentIndex) && contentIndex > 0
                            ? contentIndex
                            : fieldIndex + 1}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-semibold text-gray-800">
                            {currentContent?.section?.trim() ||
                              `Untitled Section ${fieldIndex + 1}`}
                          </p>
                          <p className="text-xs text-gray-400">
                            {getValues(`contents.${fieldIndex}.id`)
                              ? "Existing section"
                              : "New section"}
                            {" · "}
                            Content index: {contentIndex || "Not set"}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveSection(fieldIndex)}
                        title="Remove section"
                        aria-label={`Remove section ${fieldIndex + 1}`}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-100 bg-white text-red-500 transition hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Section Fields */}
                    <div className="space-y-5 p-4 sm:p-5">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        <div className="md:col-span-3">
                          <label
                            htmlFor={`section-title-${field.fieldId}`}
                            className="mb-2 block text-sm font-medium text-gray-700"
                          >
                            Section Heading{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            id={`section-title-${field.fieldId}`}
                            {...register(sectionPath, {
                              required: "Section heading is required.",
                              validate: (value) =>
                                value.trim().length > 0 ||
                                "Section heading cannot be empty.",
                            })}
                            placeholder="Enter section heading"
                            className="h-11 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-50"
                          />
                          {errors.contents?.[fieldIndex]?.section && (
                            <p className="mt-1 text-xs text-red-500">
                              {errors.contents[fieldIndex]?.section?.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor={`section-index-${field.fieldId}`}
                            className="mb-2 block text-sm font-medium text-gray-700"
                          >
                            Content Index{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            id={`section-index-${field.fieldId}`}
                            type="number"
                            min={1}
                            step={1}
                            {...register(indexPath, {
                              required: "Index is required.",
                              valueAsNumber: true,
                              min: {
                                value: 1,
                                message: "Index must be at least 1.",
                              },
                              validate: (value) =>
                                Number.isInteger(value) ||
                                "Index must be a whole number.",
                            })}
                            className="h-11 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-50"
                          />
                          {errors.contents?.[fieldIndex]?.index && (
                            <p className="mt-1 text-xs text-red-500">
                              {errors.contents[fieldIndex]?.index?.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <RichTextEditor
                          name={textPath}
                          label={`Section ${contentIndex || fieldIndex + 1} Content`}
                          required
                          placeholder="Start writing this section..."
                          minHeight={300}
                        />
                        {errors.contents?.[fieldIndex]?.text && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.contents[fieldIndex]?.text?.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </section>

            {/* Footer */}
            <div className="sticky bottom-0 z-10 -mx-5 flex flex-col-reverse justify-end gap-3 border-t border-gray-200 bg-white px-5 py-4 sm:-mx-7 sm:flex-row sm:px-7">
              <button
                type="button"
                onClick={onClose}
                disabled={isBusy}
                className="h-11 rounded-lg border border-gray-200 px-5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isBusy}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-teal-600 px-6 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isBusy ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
