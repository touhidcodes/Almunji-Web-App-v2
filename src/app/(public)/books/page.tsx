"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  BookOpen,
  BookText,
  Grid2X2,
  List,
  Search,
  SlidersHorizontal,
  Star,
} from "lucide-react";

import { useGetAllBooksQuery } from "@/redux/api/bookApi";

type TViewMode = "grid" | "list";
type TSortOption = "newest" | "name-asc" | "name-desc";

export default function BooksPage() {
  const { data, isLoading, isError, refetch } = useGetAllBooksQuery();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<TViewMode>("grid");
  const [sortBy, setSortBy] = useState<TSortOption>("newest");

  const books = data?.data ?? [];

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          books
            .map((book) => book.category?.name)
            .filter((name): name is string => Boolean(name)),
        ),
      ).sort((a, b) => a.localeCompare(b)),
    [books],
  );

  const filteredBooks = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filtered = books.filter((book) => {
      const matchesSearch =
        !normalizedSearch ||
        book.name.toLowerCase().includes(normalizedSearch) ||
        book.description?.toLowerCase().includes(normalizedSearch) ||
        book.category?.name.toLowerCase().includes(normalizedSearch);

      const matchesCategory =
        selectedCategory === "all" || book.category?.name === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name);
      }

      if (sortBy === "name-desc") {
        return b.name.localeCompare(a.name);
      }

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [books, searchTerm, selectedCategory, sortBy]);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900 text-white">
        <div className="pointer-events-none absolute -right-20 -top-32 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-teal-300/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-emerald-100">
              <BookOpen className="h-4 w-4" />
              Almunji Islamic Library
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Explore the world of
              <span className="mt-2 block text-emerald-300">
                Islamic knowledge
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-emerald-100/80 sm:text-lg">
              Discover Islamic books, explore authentic knowledge, and continue
              your journey of learning and understanding.
            </p>

            <div className="mt-9 flex flex-wrap gap-6">
              <div>
                <p className="text-3xl font-bold">{books.length}</p>
                <p className="mt-1 text-sm text-emerald-200">Available books</p>
              </div>

              <div className="h-12 w-px bg-white/20" />

              <div>
                <p className="text-3xl font-bold">{categories.length}</p>
                <p className="mt-1 text-sm text-emerald-200">Categories</p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mt-10 max-w-2xl">
            <div className="flex items-center gap-3 rounded-2xl bg-white p-2 shadow-2xl shadow-black/10">
              <Search className="ml-3 h-5 w-5 shrink-0 text-slate-400" />

              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search books, topics, or categories..."
                className="h-12 min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 sm:text-base"
              />

              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Library */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
              Discover and read
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
              Islamic Books
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {filteredBooks.length} books found
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="h-11 rounded-xl border border-slate-200 bg-white pl-9 pr-8 text-sm text-slate-700 outline-none focus:border-emerald-500"
              >
                <option value="all">All categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as TSortOption)}
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-emerald-500"
            >
              <option value="newest">Recently added</option>
              <option value="name-asc">Name: A–Z</option>
              <option value="name-desc">Name: Z–A</option>
            </select>

            <div className="flex h-11 items-center rounded-xl border border-slate-200 bg-white p-1">
              <button
                type="button"
                aria-label="Grid view"
                aria-pressed={viewMode === "grid"}
                onClick={() => setViewMode("grid")}
                className={`rounded-lg p-2 transition ${
                  viewMode === "grid"
                    ? "bg-emerald-700 text-white"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                <Grid2X2 className="h-4 w-4" />
              </button>

              <button
                type="button"
                aria-label="List view"
                aria-pressed={viewMode === "list"}
                onClick={() => setViewMode("list")}
                className={`rounded-lg p-2 transition ${
                  viewMode === "list"
                    ? "bg-emerald-700 text-white"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-80 animate-pulse rounded-2xl bg-white shadow-sm"
              />
            ))}
          </div>
        )}

        {isError && !isLoading && (
          <div className="rounded-2xl border border-red-100 bg-white px-6 py-16 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-red-400" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              Unable to load books
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Something went wrong while loading the library.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-5 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Try again
            </button>
          </div>
        )}

        {!isLoading && !isError && filteredBooks.length > 0 && (
          <div
            className={
              viewMode === "grid"
                ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "flex flex-col gap-4"
            }
          >
            {filteredBooks.map((book) => (
              <article
                key={book.id}
                className={`group overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl ${
                  viewMode === "list"
                    ? "flex flex-col sm:flex-row"
                    : "flex flex-col"
                }`}
              >
                <Link
                  href={`/books/${book.slug}`}
                  className={`relative block shrink-0 overflow-hidden bg-emerald-50 ${
                    viewMode === "list"
                      ? "h-56 sm:h-auto sm:w-52"
                      : "h-60 w-full"
                  }`}
                >
                  <Image
                    src={book.cover}
                    alt={`${book.name} book cover`}
                    fill
                    unoptimized
                    sizes={
                      viewMode === "list"
                        ? "(max-width: 640px) 100vw, 208px"
                        : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    }
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />

                  {book.isFeatured && (
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1.5 text-xs font-semibold text-amber-950 shadow-sm">
                      <Star className="h-3 w-3 fill-current" />
                      Featured
                    </span>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition group-hover:opacity-100" />
                </Link>

                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-3">
                    <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                      {book.category?.name ?? "Uncategorized"}
                    </span>
                  </div>

                  <Link href={`/books/${book.slug}`}>
                    <h3 className="line-clamp-2 text-lg font-bold text-slate-900 transition group-hover:text-emerald-700">
                      {book.name}
                    </h3>
                  </Link>

                  <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-slate-500">
                    {book.description ||
                      "Explore this book in the Almunji library."}
                  </p>

                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs text-slate-400">
                        Added {new Date(book.createdAt).toLocaleDateString()}
                      </span>

                      <Link
                        href={`/books/${book.slug}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
                      >
                        <BookOpen className="h-4 w-4" />
                        Read book
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {!isLoading && !isError && filteredBooks.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-20 text-center">
            <BookText className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-4 text-xl font-bold text-slate-800">
              No books found
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Try another search term or select a different category.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              className="mt-5 text-sm font-semibold text-emerald-700 hover:text-emerald-900"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
