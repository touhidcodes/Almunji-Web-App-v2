"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  BookText,
  ChevronRight,
  Menu,
} from "lucide-react";

import {
  useGetBookBySlugQuery,
  useGetContentsByBookQuery,
} from "@/redux/api/bookApi";

export default function BookReaderPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const {
    data: bookResponse,
    isLoading: isBookLoading,
    isError: isBookError,
  } = useGetBookBySlugQuery(slug);

  const book = bookResponse?.data;

  const {
    data: contentsResponse,
    isLoading: isContentsLoading,
    isError: isContentsError,
  } = useGetContentsByBookQuery(book?.id ?? "", {
    skip: !book?.id,
  });

  const contents = useMemo(
    () => [...(contentsResponse?.data ?? [])].sort((a, b) => a.index - b.index),
    [contentsResponse?.data],
  );

  if (isBookLoading) {
    return (
      <div className="mx-auto max-w-5xl animate-pulse px-4 py-16">
        <div className="h-8 w-48 rounded bg-slate-200" />
        <div className="mt-8 h-16 w-3/4 rounded bg-slate-200" />
        <div className="mt-5 h-5 w-1/2 rounded bg-slate-200" />
        <div className="mt-12 h-96 rounded-2xl bg-slate-200" />
      </div>
    );
  }

  if (isBookError || !book) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <BookOpen className="mx-auto h-12 w-12 text-slate-300" />
        <h1 className="mt-5 text-2xl font-bold text-slate-900">
          Book not found
        </h1>
        <p className="mt-2 text-slate-500">
          The requested book may not exist or may no longer be available.
        </p>
        <Link
          href="/books"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to library
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Reader header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/books"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-emerald-700"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to library</span>
          </Link>

          <div className="flex min-w-0 items-center gap-2 text-sm text-slate-400">
            <BookOpen className="h-4 w-4 shrink-0 text-emerald-700" />
            <span className="truncate font-medium text-slate-700">
              {book.name}
            </span>
          </div>

          <span className="hidden rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 sm:inline-block">
            Reading mode
          </span>
        </div>
      </header>

      {/* Book introduction */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-7 sm:flex-row sm:items-center">
            <div className="flex h-40 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-emerald-50 shadow-md">
              <img
                src={book.cover}
                alt={`${book.name} cover`}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="max-w-3xl">
              <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                {book.category?.name ?? "Islamic Book"}
              </span>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {book.name}
              </h1>

              {book.description && (
                <p className="mt-3 leading-7 text-slate-500">
                  {book.description}
                </p>
              )}

              <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                <span className="inline-flex items-center gap-2">
                  <BookText className="h-4 w-4 text-emerald-700" />
                  {contents.length} sections
                </span>

                {book.isFeatured && (
                  <span className="text-amber-600">Featured book</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reading area */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8">
        {/* Table of contents */}
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 lg:sticky lg:top-6">
          <div className="mb-5 flex items-center gap-2">
            <Menu className="h-5 w-5 text-emerald-700" />
            <h2 className="font-bold text-slate-900">Table of Contents</h2>
          </div>

          {isContentsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="h-9 animate-pulse rounded-lg bg-slate-100"
                />
              ))}
            </div>
          ) : isContentsError ? (
            <p className="text-sm text-red-500">
              Unable to load the table of contents.
            </p>
          ) : contents.length === 0 ? (
            <p className="text-sm leading-6 text-slate-500">
              No sections have been added to this book yet.
            </p>
          ) : (
            <nav className="max-h-[65vh] space-y-1 overflow-y-auto">
              {contents.map((content) => (
                <a
                  key={content.id}
                  href={`#section-${content.id}`}
                  className="group flex items-start gap-3 rounded-lg px-3 py-3 text-sm text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-800"
                >
                  <span className="mt-0.5 shrink-0 text-xs font-semibold text-slate-400 group-hover:text-emerald-700">
                    {content.index}.
                  </span>

                  <span className="min-w-0 flex-1">{content.section}</span>

                  <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 opacity-0 transition group-hover:opacity-100" />
                </a>
              ))}
            </nav>
          )}
        </aside>

        {/* Book content */}
        <div className="min-w-0">
          {isContentsLoading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8">
              <div className="h-8 w-2/3 animate-pulse rounded bg-slate-200" />
              <div className="mt-8 space-y-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-4 animate-pulse rounded bg-slate-100"
                  />
                ))}
              </div>
            </div>
          ) : isContentsError ? (
            <div className="rounded-2xl border border-red-100 bg-white p-8 text-center">
              <p className="text-sm text-red-500">
                Unable to load book contents. Please try again later.
              </p>
            </div>
          ) : contents.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center">
              <BookText className="mx-auto h-12 w-12 text-slate-300" />
              <h2 className="mt-4 text-xl font-bold text-slate-800">
                No content available
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                The contents of this book have not been published yet.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {contents.map((content) => (
                <article
                  key={content.id}
                  id={`section-${content.id}`}
                  className="scroll-mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9"
                >
                  <div className="mb-7 border-b border-slate-100 pb-5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">
                      Section {content.index}
                    </p>

                    <h2 className="mt-2 text-2xl font-bold leading-tight text-slate-900">
                      {content.section}
                    </h2>
                  </div>

                  <div
                    className="book-content"
                    dangerouslySetInnerHTML={{
                      __html: content.text,
                    }}
                  />
                </article>
              ))}
            </div>
          )}

          {contents.length > 0 && !isContentsLoading && (
            <div className="mt-8 flex justify-center">
              <Link
                href="/books"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-emerald-300 hover:text-emerald-700"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to all books
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
