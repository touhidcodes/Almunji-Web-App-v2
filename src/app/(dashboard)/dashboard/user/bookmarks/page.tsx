"use client";

import { useMemo, useState } from "react";
import {
  Bookmark,
  BookOpen,
  Check,
  ChevronRight,
  Languages,
  LoaderCircle,
  Search,
  Trash2,
} from "lucide-react";

export type BookmarkItemType = "DUA" | "AYAH";

export interface BookmarkEntry {
  id: string;
  itemId: string;
  itemType: BookmarkItemType;
  createdAt: string;
  title: string;
  arabic: string;
  transliteration?: string | null;
  bangla?: string | null;
  english?: string | null;
  reference?: string | null;
  tags?: string[];
}

interface BookmarkPageProps {
  bookmarks: BookmarkEntry[];
  isLoading?: boolean;
  error?: string | null;
  removingBookmarkId?: string | null;
  onRemove: (bookmark: BookmarkEntry) => void | Promise<void>;
  onOpen?: (bookmark: BookmarkEntry) => void;
}

type BookmarkFilter = "ALL" | BookmarkItemType;

const formatDate = (date: string): string => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Saved bookmark";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
};

const BookmarkPage = ({
  bookmarks,
  isLoading = false,
  error = null,
  removingBookmarkId = null,
  onRemove,
  onOpen,
}: BookmarkPageProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<BookmarkFilter>("ALL");

  const filteredBookmarks = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return bookmarks.filter((bookmark) => {
      const matchesFilter =
        activeFilter === "ALL" || bookmark.itemType === activeFilter;

      const searchableContent = [
        bookmark.title,
        bookmark.arabic,
        bookmark.transliteration,
        bookmark.bangla,
        bookmark.english,
        bookmark.reference,
        bookmark.itemType,
        ...(bookmark.tags ?? []),
      ];

      const matchesSearch =
        !query ||
        searchableContent.some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(query),
        );

      return matchesFilter && matchesSearch;
    });
  }, [bookmarks, searchTerm, activeFilter]);

  const duaCount = bookmarks.filter(
    (bookmark) => bookmark.itemType === "DUA",
  ).length;

  const ayahCount = bookmarks.filter(
    (bookmark) => bookmark.itemType === "AYAH",
  ).length;

  return (
    <main className="min-h-screen bg-slate-50/70 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Page heading */}
        <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <Bookmark className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                My Bookmarks
              </h1>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Your saved Ayahs and Duas, all in one place.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5">
            <Bookmark className="h-4 w-4 text-teal-700" />
            <span className="text-sm font-semibold text-slate-900">
              {bookmarks.length}
            </span>
            <span className="text-sm text-slate-500">saved items</span>
          </div>
        </section>

        {/* Summary cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SummaryCard
            label="Total bookmarks"
            value={bookmarks.length}
            icon={<Bookmark className="h-5 w-5" />}
          />
          <SummaryCard
            label="Saved Ayahs"
            value={ayahCount}
            icon={<BookOpen className="h-5 w-5" />}
          />
          <SummaryCard
            label="Saved Duas"
            value={duaCount}
            icon={<Languages className="h-5 w-5" />}
          />
        </section>

        {/* Bookmark directory */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Saved collection
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Search your collection or filter by content type.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-sm">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search title, Arabic, translation..."
                  aria-label="Search bookmarks"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ["ALL", "All items"],
                    ["AYAH", "Ayahs"],
                    ["DUA", "Duas"],
                  ] as const
                ).map(([value, label]) => {
                  const isActive = activeFilter === value;

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setActiveFilter(value)}
                      aria-pressed={isActive}
                      className={`inline-flex h-10 items-center gap-2 rounded-lg border px-3.5 text-sm font-medium transition ${
                        isActive
                          ? "border-teal-700 bg-teal-700 text-white"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {isActive && <Check className="h-4 w-4" />}
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex min-h-64 flex-col items-center justify-center gap-3">
              <LoaderCircle className="h-7 w-7 animate-spin text-teal-700" />
              <p className="text-sm text-slate-500">
                Loading your bookmarks...
              </p>
            </div>
          ) : error ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
              <p className="font-semibold text-rose-700">
                Unable to load bookmarks
              </p>
              <p className="mt-2 max-w-md text-sm text-slate-500">{error}</p>
            </div>
          ) : filteredBookmarks.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                <Bookmark className="h-6 w-6" />
              </div>

              <h3 className="mt-4 text-base font-semibold text-slate-900">
                {bookmarks.length === 0
                  ? "No bookmarks yet"
                  : "No matching bookmarks"}
              </h3>

              <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
                {bookmarks.length === 0
                  ? "Bookmarks you save while reading will appear here."
                  : "Try another search term or choose a different filter."}
              </p>

              {(searchTerm || activeFilter !== "ALL") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setActiveFilter("ALL");
                  }}
                  className="mt-4 rounded-lg px-4 py-2 text-sm font-semibold text-teal-700 transition hover:bg-teal-50"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredBookmarks.map((bookmark) => {
                const isRemoving = removingBookmarkId === bookmark.id;

                return (
                  <article
                    key={bookmark.id}
                    className="p-5 transition hover:bg-slate-50/70 sm:p-6"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-teal-700">
                            {bookmark.itemType === "AYAH" ? (
                              <BookOpen className="h-5 w-5" />
                            ) : (
                              <Languages className="h-5 w-5" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <h3 className="font-semibold text-slate-900">
                              {bookmark.title}
                            </h3>

                            <div className="mt-1 flex flex-wrap items-center gap-2">
                              <span className="rounded-md bg-teal-50 px-2 py-1 text-xs font-medium text-teal-700">
                                {bookmark.itemType === "AYAH" ? "Ayah" : "Dua"}
                              </span>

                              {bookmark.reference && (
                                <span className="text-xs text-slate-500">
                                  {bookmark.reference}
                                </span>
                              )}

                              <span className="text-xs text-slate-400">
                                Saved {formatDate(bookmark.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemove(bookmark)}
                          disabled={isRemoving}
                          aria-label={`Remove ${bookmark.title} from bookmarks`}
                          title="Remove bookmark"
                          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isRemoving ? (
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                      <div
                        dir="rtl"
                        lang="ar"
                        className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-5 text-right text-2xl leading-[2.2] text-slate-800 sm:px-6"
                      >
                        {bookmark.arabic || "Arabic text unavailable"}
                      </div>

                      {bookmark.transliteration && (
                        <p className="text-sm leading-6 text-slate-600">
                          {bookmark.transliteration}
                        </p>
                      )}

                      {bookmark.english && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            English translation
                          </p>
                          <p className="mt-1 text-sm leading-7 text-slate-700">
                            {bookmark.english}
                          </p>
                        </div>
                      )}

                      {bookmark.bangla && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            বাংলা অনুবাদ
                          </p>
                          <p className="mt-1 text-sm leading-7 text-slate-700">
                            {bookmark.bangla}
                          </p>
                        </div>
                      )}

                      {bookmark.tags && bookmark.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {bookmark.tags.map((tag, index) => (
                            <span
                              key={`${tag}-${index}`}
                              className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {onOpen && (
                        <div className="flex justify-end border-t border-slate-100 pt-3">
                          <button
                            type="button"
                            onClick={() => onOpen(bookmark)}
                            className="inline-flex items-center gap-1 text-sm font-semibold text-teal-700 transition hover:text-teal-900"
                          >
                            Open {bookmark.itemType === "AYAH" ? "Ayah" : "Dua"}
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {!isLoading && !error && filteredBookmarks.length > 0 && (
            <div className="flex flex-col gap-1 border-t border-slate-200 bg-slate-50/60 px-5 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <span>
                Showing {filteredBookmarks.length} of {bookmarks.length}{" "}
                bookmarks
              </span>
              <span>Your saved collection</span>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

interface SummaryCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
}

const SummaryCard = ({ label, value, icon }: SummaryCardProps) => (
  <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  </div>
);

export default BookmarkPage;
