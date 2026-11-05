"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  useGetAllBlogsAdminQuery,
  useSoftDeleteBlogMutation,
  useUpdateBlogMutation,
} from "@/redux/api/blogApi";

import {
  AlertTriangle,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  FileText,
  Loader2,
  Plus,
  Search,
  Star,
  Trash2,
  X,
  Save,
  Pencil,
  Link2,
  RefreshCw,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

import FormInput from "@/components/forms/FormInput";
import FormTextarea from "@/components/forms/FormTextarea";
import RichTextEditor from "@/components/forms/RichTextEditor";

import {
  UpdateBlogSchema,
  type TUpdateBlogFormValues,
} from "@/schema/blogSchema";

import type { TUpdateBlog } from "@/types/blog";
import { Button } from "@/components/ui/button";

// ==================================================
// TYPES
// ==================================================

type TBlog = {
  id: string;
  title: string;
  slug: string;
  summary?: string | null;
  thumbnail?: string | null;
  content?: string | null;
  isPublished?: boolean;
  isFeatured?: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type TEditBlogFormProps = {
  blog: TBlog;
  isUpdating: boolean;
  onCancel: () => void;
  onSubmit: (data: TUpdateBlogFormValues) => Promise<void>;
};

type TStatItem = {
  label: string;
  value: number;
  icon: LucideIcon;
  style: string;
};

// ==================================================
// RUNTIME TYPE GUARDS
// ==================================================

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const isOptionalString = (
  value: unknown,
): value is string | null | undefined => {
  return value === undefined || value === null || typeof value === "string";
};

const isOptionalBoolean = (value: unknown): value is boolean | undefined => {
  return value === undefined || typeof value === "boolean";
};

const isBlog = (value: unknown): value is TBlog => {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.slug === "string" &&
    isOptionalString(value.summary) &&
    isOptionalString(value.thumbnail) &&
    isOptionalString(value.content) &&
    isOptionalBoolean(value.isPublished) &&
    isOptionalBoolean(value.isFeatured) &&
    isOptionalString(value.createdAt) &&
    isOptionalString(value.updatedAt)
  );
};

// ==================================================
// API RESPONSE PARSING
// ==================================================

const extractBlogs = (response: unknown): TBlog[] => {
  if (Array.isArray(response)) {
    return response.filter(isBlog);
  }

  if (!isRecord(response)) {
    return [];
  }

  if (Array.isArray(response.blogs)) {
    return response.blogs.filter(isBlog);
  }

  if (Array.isArray(response.data)) {
    return response.data.filter(isBlog);
  }

  return [];
};

// ==================================================
// ERROR HANDLING
// ==================================================

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (!isRecord(error)) {
    return fallback;
  }

  if (isRecord(error.data) && typeof error.data.message === "string") {
    return error.data.message;
  }

  if (typeof error.message === "string") {
    return error.message;
  }

  return fallback;
};

// ==================================================
// HELPERS
// ==================================================

const formatDate = (date?: string | null): string => {
  if (!date) return "—";

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

// ==================================================
// BLOG STATUS CONTROLS
// ==================================================

function BlogStatusControls() {
  const { register } = useFormContext<TUpdateBlogFormValues>();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 p-4 transition hover:border-teal-300 hover:bg-teal-50/40">
        <input
          type="checkbox"
          {...register("isPublished")}
          className="mt-1 h-4 w-4 accent-teal-600"
        />

        <span>
          <span className="block text-sm font-semibold text-gray-800">
            Publish article
          </span>

          <span className="mt-1 block text-xs leading-5 text-gray-500">
            Make this article visible to readers.
          </span>
        </span>
      </label>

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 p-4 transition hover:border-amber-300 hover:bg-amber-50/40">
        <input
          type="checkbox"
          {...register("isFeatured")}
          className="mt-1 h-4 w-4 accent-amber-500"
        />

        <span>
          <span className="flex items-center gap-1.5 text-sm font-semibold text-gray-800">
            <Star className="h-4 w-4 text-amber-500" />
            Featured article
          </span>

          <span className="mt-1 block text-xs leading-5 text-gray-500">
            Highlight this article in featured content.
          </span>
        </span>
      </label>
    </div>
  );
}

// ==================================================
// EDIT BLOG FORM
// ==================================================

function EditBlogForm({
  blog,
  isUpdating,
  onCancel,
  onSubmit,
}: TEditBlogFormProps) {
  const form = useForm<TUpdateBlogFormValues>({
    resolver: zodResolver(UpdateBlogSchema),

    defaultValues: {
      title: blog.title,
      slug: blog.slug,
      thumbnail: blog.thumbnail ?? "",
      summary: blog.summary ?? "",
      content: blog.content ?? "",
      isPublished: blog.isPublished ?? false,
      isFeatured: blog.isFeatured ?? false,
    },

    mode: "onSubmit",
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = form;

  const handleValidSubmit = async (
    values: TUpdateBlogFormValues,
  ): Promise<void> => {
    await onSubmit(values);
  };

  const handleInvalidSubmit = (): void => {
    const firstError = Object.entries(errors)[0];

    if (!firstError) return;

    const [field, error] = firstError;

    toast.error("Form validation failed", {
      description:
        typeof error?.message === "string"
          ? `${field}: ${error.message}`
          : `Please check the ${field} field.`,
    });
  };

  const isBusy = isUpdating || isSubmitting;

  return (
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit(handleValidSubmit, handleInvalidSubmit)}
        noValidate
        className="space-y-6"
      >
        {/* ARTICLE INFORMATION */}

        <section className="space-y-5">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-sm font-bold text-gray-900">
              Article Information
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              Update the basic information of your blog.
            </p>
          </div>

          <FormInput
            name="title"
            label="Blog Title"
            required
            placeholder="Enter blog title..."
          />

          {/* READ-ONLY SLUG */}

          <div className="space-y-2">
            <label
              htmlFor="blog-slug"
              className="flex items-center gap-2 text-sm font-semibold text-gray-700"
            >
              Blog Slug
              <span className="text-red-500">*</span>
              <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-500">
                Read only
              </span>
            </label>

            <div className="relative">
              <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                id="blog-slug"
                type="text"
                readOnly
                required
                {...register("slug")}
                placeholder="Generated blog slug"
                className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-600 outline-none"
              />
            </div>

            {errors.slug && (
              <p className="text-xs text-red-500">{errors.slug.message}</p>
            )}

            <p className="text-xs leading-5 text-gray-400">
              This slug was generated during blog creation. It remains unchanged
              to preserve the existing blog URL.
            </p>
          </div>

          <FormInput
            name="thumbnail"
            label="Thumbnail Image URL"
            placeholder="https://example.com/image.jpg"
          />

          <FormTextarea
            name="summary"
            label="Blog Summary"
            rows={3}
            placeholder="Write a short introduction..."
          />
        </section>

        {/* ARTICLE CONTENT */}

        <section className="space-y-4 border-t border-gray-100 pt-6">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Article Content</h3>

            <p className="mt-1 text-xs text-gray-500">
              Edit your article using the rich text editor.
            </p>
          </div>

          <RichTextEditor
            name="content"
            label="Full Article Content"
            required
            placeholder="Start writing your article..."
          />
        </section>

        {/* PUBLICATION SETTINGS */}

        <section className="space-y-4 border-t border-gray-100 pt-6">
          <div>
            <h3 className="text-sm font-bold text-gray-900">
              Publication Settings
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              Control the visibility and featured status of this article.
            </p>
          </div>

          <BlogStatusControls />
        </section>

        {/* FORM ACTIONS */}

        <footer className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isBusy}
            className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isBusy}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isBusy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}

            {isBusy ? "Saving Changes..." : "Save Changes"}
          </button>
        </footer>
      </form>
    </FormProvider>
  );
}

// ==================================================
// STATISTICS CARD
// ==================================================

function StatCard({ item }: { item: TStatItem }) {
  const Icon = item.icon;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{item.label}</p>

          <p className="mt-2 text-3xl font-black text-gray-900">{item.value}</p>
        </div>

        <div className={`rounded-xl p-3 ${item.style}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

// ==================================================
// MAIN MANAGE BLOG PAGE
// ==================================================

export default function ManageBlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingBlog, setEditingBlog] = useState<TBlog | null>(null);
  const [deletingBlog, setDeletingBlog] = useState<TBlog | null>(null);

  // --------------------------------------------------
  // API
  // --------------------------------------------------

  const {
    data: blogsData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAllBlogsAdminQuery({ searchTerm });

  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();

  const [deleteBlog, { isLoading: isDeleting }] = useSoftDeleteBlogMutation();

  // --------------------------------------------------
  // BLOG DATA
  // --------------------------------------------------

  const blogs = useMemo(() => extractBlogs(blogsData?.data), [blogsData]);

  const filteredBlogs = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return blogs;

    return blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(query) ||
        blog.slug.toLowerCase().includes(query),
    );
  }, [blogs, searchTerm]);

  // --------------------------------------------------
  // STATISTICS
  // --------------------------------------------------

  const publishedCount = blogs.filter((blog) => blog.isPublished).length;

  const featuredCount = blogs.filter((blog) => blog.isFeatured).length;

  const draftCount = blogs.filter((blog) => !blog.isPublished).length;

  const stats: TStatItem[] = [
    {
      label: "Total Blogs",
      value: blogs.length,
      icon: FileText,
      style: "bg-teal-50 text-teal-600",
    },
    {
      label: "Published",
      value: publishedCount,
      icon: ArrowUpRight,
      style: "bg-green-50 text-green-600",
    },
    {
      label: "Featured",
      value: featuredCount,
      icon: Star,
      style: "bg-amber-50 text-amber-600",
    },
    {
      label: "Drafts",
      value: draftCount,
      icon: BookOpen,
      style: "bg-gray-100 text-gray-600",
    },
  ];

  // --------------------------------------------------
  // MODAL CONTROLS
  // --------------------------------------------------

  const closeEditModal = (): void => {
    if (!isUpdating) {
      setEditingBlog(null);
    }
  };

  const closeDeleteModal = (): void => {
    if (!isDeleting) {
      setDeletingBlog(null);
    }
  };

  // --------------------------------------------------
  // EDIT BLOG
  // --------------------------------------------------

  const handleEdit = (blog: TBlog): void => {
    setEditingBlog(blog);
  };

  // --------------------------------------------------
  // UPDATE BLOG
  // --------------------------------------------------

  const handleUpdate = async (values: TUpdateBlogFormValues): Promise<void> => {
    if (!editingBlog || isUpdating) return;

    const title = values.title.trim();
    const content = values.content.trim();

    if (!title || !content || !values.slug.trim()) {
      toast.error("Required fields are missing", {
        description: "Blog title, slug, and article content are required.",
      });

      return;
    }

    // Slug is intentionally excluded.
    // Backend generated it during blog creation.

    const payload: TUpdateBlog = {
      title,
      thumbnail: values.thumbnail?.trim() ?? "",
      summary: values.summary?.trim() ?? "",
      content: values.content,
      isPublished: values.isPublished ?? false,
      isFeatured: values.isFeatured ?? false,
    };

    try {
      await updateBlog({
        id: editingBlog.id,
        data: payload,
      }).unwrap();

      toast.success("Blog updated successfully", {
        description: `"${title}" has been updated.`,
      });

      setEditingBlog(null);
    } catch (error: unknown) {
      toast.error("Failed to update blog", {
        description: getErrorMessage(
          error,
          "The server rejected the update. Please try again.",
        ),
        duration: 6000,
      });

      console.error("Update blog failed:", error);
    }
  };

  // --------------------------------------------------
  // FEATURED TOGGLE
  // --------------------------------------------------

  const handleToggleFeatured = async (blog: TBlog): Promise<void> => {
    if (isUpdating) return;

    const nextFeaturedStatus = !blog.isFeatured;

    try {
      await updateBlog({
        id: blog.id,
        data: {
          isFeatured: nextFeaturedStatus,
        },
      }).unwrap();

      toast.success(
        nextFeaturedStatus
          ? "Blog marked as featured"
          : "Blog removed from featured",
        {
          description: blog.title,
        },
      );
    } catch (error: unknown) {
      toast.error("Failed to update featured status", {
        description: getErrorMessage(
          error,
          "Could not update the blog's featured status.",
        ),
      });

      console.error("Featured update failed:", error);
    }
  };

  // --------------------------------------------------
  // SOFT DELETE
  // --------------------------------------------------

  const handleDeleteClick = (blog: TBlog): void => {
    setDeletingBlog(blog);
  };

  const handleDelete = async (): Promise<void> => {
    if (!deletingBlog || isDeleting) return;

    try {
      await deleteBlog(deletingBlog.id).unwrap();

      toast.success("Blog deleted successfully", {
        description: `"${deletingBlog.title}" has been removed.`,
      });

      setDeletingBlog(null);
    } catch (error: unknown) {
      toast.error("Failed to delete blog", {
        description: getErrorMessage(
          error,
          "Could not delete this blog. Please try again.",
        ),
      });

      console.error("Delete blog failed:", error);
    }
  };

  // --------------------------------------------------
  // INITIAL LOADING
  // --------------------------------------------------

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-9 w-9 animate-spin text-teal-600" />

          <p className="text-sm font-medium text-gray-500">
            Loading blog posts...
          </p>
        </div>
      </div>
    );
  }

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <main className="min-h-screen bg-gray-50/70 p-4 font-poppins sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* NAVIGATION */}

        <nav className="flex items-center justify-between border-b border-gray-200 pb-5">
          <Link
            href="/dashboard/admin"
            className="text-xs font-semibold uppercase tracking-widest text-gray-500 transition hover:text-teal-600"
          >
            Admin Dashboard
          </Link>

          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
            <BookOpen className="h-4 w-4 text-teal-500" />
            Blog Services
          </div>
        </nav>

        {/* HEADER */}

        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-teal-600 p-4 shadow-lg shadow-teal-100">
              <BookOpen className="h-8 w-8 text-white" />
            </div>

            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-teal-600">
                Content Management
              </p>

              <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
                Manage Blogs
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Create, edit, publish, feature, and manage your articles.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/admin/create/blog"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-teal-100 transition hover:bg-teal-700"
          >
            <Plus className="h-5 w-5" />
            Create Blog
          </Link>
        </header>

        {/* STATISTICS */}

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((item) => (
            <StatCard key={item.label} item={item} />
          ))}
        </section>

        {/* BLOG RECORDS */}

        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          {/* SEARCH */}

          <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                All Blog Posts
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Browse and manage your content.
              </p>
            </div>

            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by title or slug..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
              />
            </div>
          </div>

          {/* FETCHING INDICATOR */}

          {isFetching && (
            <div className="flex items-center gap-2 border-b border-gray-100 bg-teal-50/50 px-5 py-2 text-xs font-medium text-teal-700">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Updating blog posts...
            </div>
          )}

          {/* ERROR STATE */}

          {isError ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <AlertTriangle className="h-10 w-10 text-red-400" />

              <h3 className="mt-4 font-bold text-gray-900">
                Unable to load blogs
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Something went wrong while fetching blog posts.
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
            </div>
          ) : filteredBlogs.length === 0 ? (
            /* EMPTY STATE */

            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="rounded-2xl bg-gray-100 p-4">
                <BookOpen className="h-8 w-8 text-gray-400" />
              </div>

              <h3 className="mt-4 font-bold text-gray-900">
                {searchTerm ? "No matching blogs" : "No blogs found"}
              </h3>

              <p className="mt-2 max-w-sm text-sm text-gray-500">
                {searchTerm
                  ? "Try another title or slug."
                  : "Create your first blog post to get started."}
              </p>

              {!searchTerm && (
                <Link
                  href="/dashboard/admin/create/blog"
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
                >
                  <Plus className="h-4 w-4" />
                  Create Your First Blog
                </Link>
              )}
            </div>
          ) : (
            /* RESPONSIVE TABLE */

            <>
              <div className="w-full overflow-hidden">
                <div className="w-full overflow-x-auto">
                  <table className="w-full min-w-[1050px] border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/80 text-xs uppercase tracking-wider text-gray-500">
                        <th className="w-[280px] min-w-[280px] px-5 py-4 font-semibold">
                          Blog
                        </th>

                        <th className="w-[200px] min-w-[200px] px-5 py-4 font-semibold">
                          Slug
                        </th>

                        <th className="w-[130px] min-w-[130px] px-5 py-4 font-semibold">
                          Status
                        </th>

                        <th className="w-[130px] min-w-[130px] px-5 py-4 font-semibold">
                          Featured
                        </th>

                        <th className="w-[150px] min-w-[150px] px-5 py-4 font-semibold">
                          Created At
                        </th>

                        {/* STICKY ACTIONS HEADER */}

                        <th className="sticky right-0 z-30 w-[150px] min-w-[150px] border-l border-gray-200 bg-gray-50 px-4 py-4 text-center font-semibold shadow-[-8px_0_12px_-10px_rgba(0,0,0,0.5)]">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {filteredBlogs.map((blog) => (
                        <tr
                          key={blog.id}
                          className="transition hover:bg-gray-50/70"
                        >
                          {/* BLOG INFORMATION */}

                          <td className="max-w-[280px] px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-100">
                                {blog.thumbnail ? (
                                  <img
                                    src={blog.thumbnail}
                                    alt={blog.title}
                                    loading="lazy"
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full items-center justify-center">
                                    <FileText className="h-5 w-5 text-gray-400" />
                                  </div>
                                )}
                              </div>

                              <div className="min-w-0">
                                <p className="truncate font-semibold text-gray-800">
                                  {blog.title}
                                </p>

                                <p className="mt-1 line-clamp-1 text-xs text-gray-500">
                                  {blog.summary || "No summary available"}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* SLUG */}

                          <td className="px-5 py-4">
                            <span
                              title={blog.slug}
                              className="block max-w-[180px] truncate text-xs text-gray-500"
                            >
                              {blog.slug}
                            </span>
                          </td>

                          {/* PUBLICATION STATUS */}

                          <td className="px-5 py-4">
                            {blog.isPublished ? (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                Published
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600">
                                <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                                Draft
                              </span>
                            )}
                          </td>

                          {/* FEATURED STATUS */}

                          <td className="px-5 py-4">
                            {blog.isFeatured ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                                <Star className="h-3 w-3 fill-current" />
                                Featured
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400">
                                Not Featured
                              </span>
                            )}
                          </td>

                          {/* CREATED DATE */}

                          <td className="whitespace-nowrap px-5 py-4">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <CalendarDays className="h-4 w-4" />
                              {formatDate(blog.createdAt)}
                            </div>
                          </td>

                          {/* STICKY ACTIONS */}

                          <td className="sticky right-0 z-20 border-l border-gray-200 bg-white px-3 py-4 shadow-[-8px_0_12px_-10px_rgba(0,0,0,0.5)]">
                            <div className="flex items-center justify-center gap-1">
                              {/* FEATURED TOGGLE */}

                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                title={
                                  blog.isFeatured
                                    ? "Remove from featured"
                                    : "Mark as featured"
                                }
                                aria-label={
                                  blog.isFeatured
                                    ? `Remove ${blog.title} from featured`
                                    : `Feature ${blog.title}`
                                }
                                disabled={isUpdating}
                                onClick={() => handleToggleFeatured(blog)}
                                className={
                                  blog.isFeatured
                                    ? "text-amber-500 hover:bg-amber-50 hover:text-amber-600"
                                    : "text-gray-400 hover:text-amber-500"
                                }
                              >
                                <Star
                                  className={`h-4 w-4 ${
                                    blog.isFeatured ? "fill-current" : ""
                                  }`}
                                />
                              </Button>

                              {/* EDIT */}

                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                title="Edit blog"
                                aria-label={`Edit ${blog.title}`}
                                onClick={() => handleEdit(blog)}
                                className="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>

                              {/* DELETE */}

                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                title="Delete blog"
                                aria-label={`Delete ${blog.title}`}
                                onClick={() => handleDeleteClick(blog)}
                                className="text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* MOBILE SCROLL HINT */}

                <div className="flex items-center justify-center gap-2 border-t border-gray-100 bg-gray-50 px-4 py-2 text-xs text-gray-400 sm:hidden">
                  Swipe horizontally to view all columns
                  <span aria-hidden="true">↔</span>
                </div>
              </div>

              {/* TABLE FOOTER */}

              <div className="flex flex-col justify-between gap-2 border-t border-gray-100 bg-gray-50/50 px-5 py-4 text-xs text-gray-500 sm:flex-row sm:items-center">
                <p>
                  Showing{" "}
                  <span className="font-bold text-gray-800">
                    {filteredBlogs.length}
                  </span>{" "}
                  blog posts
                </p>

                <p>Almunji Global Archival System</p>
              </div>
            </>
          )}
        </section>

        {/* =========================================
            EDIT BLOG MODAL
        ========================================= */}

        {editingBlog && (
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
              aria-labelledby="edit-blog-title"
              className="flex max-h-[95vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
              {/* MODAL HEADER */}

              <header className="flex shrink-0 items-center justify-between border-b border-gray-200 px-5 py-4 sm:px-6">
                <div>
                  <h2
                    id="edit-blog-title"
                    className="text-lg font-semibold text-gray-900"
                  >
                    Edit Blog
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Update article information and publication settings.
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

              {/* MODAL CONTENT */}

              <div className="overflow-y-auto p-5 sm:p-6">
                <EditBlogForm
                  key={editingBlog.id}
                  blog={editingBlog}
                  isUpdating={isUpdating}
                  onCancel={closeEditModal}
                  onSubmit={handleUpdate}
                />
              </div>
            </section>
          </div>
        )}

        {/* =========================================
            DELETE CONFIRMATION MODAL
        ========================================= */}

        {deletingBlog && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget && !isDeleting) {
                closeDeleteModal();
              }
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-blog-title"
              className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <AlertTriangle className="h-5 w-5" />
              </div>

              <h2
                id="delete-blog-title"
                className="mt-4 text-lg font-semibold text-gray-900"
              >
                Delete Blog?
              </h2>

              <p className="mt-2 break-words text-sm leading-6 text-gray-500">
                <span className="font-semibold text-gray-800">
                  {deletingBlog.title}
                </span>{" "}
                will be removed from the active blog listing. This operation
                uses soft-delete rather than permanently removing the record.
              </p>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  disabled={isDeleting}
                  className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}

                  {isDeleting ? "Deleting..." : "Confirm Delete"}
                </button>
              </div>
            </section>
          </div>
        )}

        {/* FOOTER */}

        <footer className="pb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Almunji Global Archival System • Blog Services
          </p>
        </footer>
      </div>
    </main>
  );
}
