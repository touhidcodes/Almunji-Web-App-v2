"use client";

import {
  useGetAllBlogsAdminQuery,
  useSoftDeleteBlogMutation,
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
  Trash2,
  X,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type TBlog = {
  id: string;
  title: string;
  slug: string;
  summary?: string | null;
  thumbnail?: string | null;
  content?: string | null;
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type TApiError = {
  data?: {
    message?: string;
  };
};

export default function ManageBlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBlog, setSelectedBlog] = useState<TBlog | null>(null);

  const [deleteBlog, { isLoading: isDeleting }] = useSoftDeleteBlogMutation();

  const {
    data: blogsData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAllBlogsAdminQuery({ searchTerm });

  // Supports both a direct array and a nested paginated API response.
  const blogs: TBlog[] = useMemo(() => {
    const response = blogsData?.data;

    if (Array.isArray(response)) {
      return response as TBlog[];
    }

    if (
      response &&
      typeof response === "object" &&
      "data" in response &&
      Array.isArray(response.data)
    ) {
      return response.data as TBlog[];
    }

    return [];
  }, [blogsData]);

  const filteredBlogs = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return blogs;

    return blogs.filter(
      (blog) =>
        blog.title?.toLowerCase().includes(query) ||
        blog.slug?.toLowerCase().includes(query),
    );
  }, [blogs, searchTerm]);

  const handleDelete = async () => {
    if (!selectedBlog) return;

    try {
      await deleteBlog(selectedBlog.id).unwrap();

      toast.success("Blog deleted successfully", {
        description: `"${selectedBlog.title}" has been removed.`,
      });

      setSelectedBlog(null);
    } catch (error: unknown) {
      const apiError = error as TApiError;

      toast.error(apiError.data?.message || "Failed to delete the blog.");
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-poppins sm:p-6 lg:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Navigation */}
        <nav className="flex items-center justify-between border-b border-gray-200 pb-5">
          <Link
            href="/dashboard/admin"
            className="text-xs font-semibold uppercase tracking-widest text-gray-500 transition-colors hover:text-teal-600"
          >
            Admin Dashboard
          </Link>

          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
            <BookOpen className="h-4 w-4 text-teal-500" />
            Blog Services
          </div>
        </nav>

        {/* Header */}
        <header className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
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

              <p className="mt-2 text-sm text-gray-500 sm:text-base">
                Create, review, and manage your blog articles.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/admin/create/blog"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-teal-100 transition-all hover:bg-teal-700"
          >
            <Plus className="h-5 w-5" />
            Create Blog
          </Link>
        </header>

        {/* Statistics */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Loaded Blog Posts
                </p>

                <p className="mt-2 text-3xl font-black text-gray-900">
                  {blogs.length}
                </p>
              </div>

              <div className="rounded-xl bg-teal-50 p-3">
                <FileText className="h-6 w-6 text-teal-600" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Published Posts
                </p>

                <p className="mt-2 text-3xl font-black text-gray-900">
                  {blogs.filter((blog) => blog.isPublished === true).length}
                </p>
              </div>

              <div className="rounded-xl bg-green-50 p-3">
                <ArrowUpRight className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </section>

        {/* Blog Table */}
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          {/* Search */}
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

          {isFetching && !isLoading && (
            <div className="flex items-center gap-2 border-b border-gray-100 bg-teal-50/50 px-5 py-2 text-xs font-medium text-teal-700">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Updating blog posts...
            </div>
          )}

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
                className="mt-5 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
              >
                Try Again
              </button>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="rounded-2xl bg-gray-100 p-4">
                <BookOpen className="h-8 w-8 text-gray-400" />
              </div>

              <h3 className="mt-4 font-bold text-gray-900">
                {searchTerm ? "No matching blogs" : "No blogs found"}
              </h3>

              <p className="mt-2 max-w-sm text-sm text-gray-500">
                {searchTerm
                  ? "Try another title or slug, or clear your search."
                  : "You haven't created any blog posts yet. Create your first post to get started."}
              </p>

              {!searchTerm && (
                <Link
                  href="/dashboard/admin/create/blog"
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
                >
                  <Plus className="h-4 w-4" />
                  Create Your First Blog
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] border-collapse text-left">
                  <thead>
                    <tr className="bg-gray-50/80 text-xs font-bold uppercase tracking-wider text-gray-500">
                      <th className="px-6 py-4">Blog Post</th>
                      <th className="px-6 py-4">Slug</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Last Updated</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredBlogs.map((blog) => (
                      <tr
                        key={blog.id}
                        className="transition-colors hover:bg-gray-50/70"
                      >
                        {/* Blog Information */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="relative flex h-14 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-100">
                              {blog.thumbnail ? (
                                <Image
                                  src={blog.thumbnail}
                                  alt={blog.title}
                                  fill
                                  sizes="64px"
                                  className="object-cover"
                                  unoptimized
                                />
                              ) : (
                                <BookOpen className="h-6 w-6 text-gray-400" />
                              )}
                            </div>

                            <div className="max-w-xs">
                              <p className="line-clamp-2 font-bold text-gray-900">
                                {blog.title}
                              </p>

                              {blog.summary && (
                                <p className="mt-1 line-clamp-1 text-xs text-gray-500">
                                  {blog.summary}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Slug */}
                        <td className="px-6 py-5">
                          <span className="block max-w-[220px] truncate rounded-md bg-gray-100 px-2.5 py-1.5 font-mono text-xs text-gray-600">
                            {blog.slug}
                          </span>
                        </td>

                        {/* Publication Status */}
                        <td className="px-6 py-5">
                          {blog.isPublished === true ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                              Published
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                              Draft / Unpublished
                            </span>
                          )}
                        </td>

                        {/* Date */}
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <CalendarDays className="h-4 w-4 shrink-0" />

                            <span>
                              {blog.updatedAt
                                ? new Date(blog.updatedAt).toLocaleDateString(
                                    "en-GB",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    },
                                  )
                                : blog.createdAt
                                  ? new Date(blog.createdAt).toLocaleDateString(
                                      "en-GB",
                                      {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                      },
                                    )
                                  : "—"}
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedBlog(blog)}
                              aria-label={`Delete ${blog.title}`}
                              title="Delete blog"
                              className="inline-flex items-center gap-2 rounded-lg border border-red-100 px-3 py-2 text-xs font-bold text-red-600 transition hover:border-red-200 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

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

        {/* Delete Confirmation Modal */}
        {selectedBlog && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 p-4 backdrop-blur-sm"
            onClick={() => {
              if (!isDeleting) setSelectedBlog(null);
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-blog-title"
              className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl sm:p-8"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between">
                <div className="rounded-xl bg-red-50 p-3">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedBlog(null)}
                  disabled={isDeleting}
                  aria-label="Close confirmation dialog"
                  className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <h2
                id="delete-blog-title"
                className="mt-5 text-xl font-black text-gray-900"
              >
                Delete this blog?
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Are you sure you want to delete{" "}
                <span className="font-bold text-gray-800">
                  &quot;{selectedBlog.title}&quot;
                </span>
                ? This action will remove the blog from the active listing.
              </p>

              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedBlog(null)}
                  disabled={isDeleting}
                  className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-bold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}

                  {isDeleting ? "Deleting..." : "Confirm Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="pb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Almunji Global Archival System • Blog Services
          </p>
        </footer>
      </div>
    </div>
  );
}
