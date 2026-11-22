"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  BookOpen,
  Search,
  X,
  ArrowUpRight,
  Heart,
  Loader2,
} from "lucide-react";

import { useGetAllDuasQuery } from "@/redux/api/duaApi";
import type { TDua } from "@/types/dua";

const getDuaTags = (tags: TDua["tags"]): string[] => {
  if (!Array.isArray(tags)) return [];

  return [
    ...new Set(
      tags.filter(
        (tag): tag is string =>
          typeof tag === "string" && tag.trim().length > 0,
      ),
    ),
  ];
};

export default function DuasPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");

  const {
    data: response,
    isLoading,
    isError,
  } = useGetAllDuasQuery({
    searchTerm: searchTerm.trim() || undefined,
    page: 1,
    limit: 100,
  });

  const duas = response?.data ?? [];

  const availableTags = useMemo(() => {
    const tags = duas.flatMap((dua) => getDuaTags(dua.tags));
    return [...new Set(tags)].sort((a, b) => a.localeCompare(b));
  }, [duas]);

  const filteredDuas = useMemo(() => {
    if (selectedTag === "all") return duas;

    return duas.filter((dua) => getDuaTags(dua.tags).includes(selectedTag));
  }, [duas, selectedTag]);

  return (
    <main className="min-h-screen bg-[#fafaf8]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#103d32]">
        <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-amber-300/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-emerald-100">
              <BookOpen size={16} />
              <span>Almunji Islamic Library</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Daily Duas
              <span className="mt-2 block font-serif font-normal text-emerald-200">
                Supplications for Every Moment
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-emerald-50/75 sm:text-lg">
              Explore a collection of Islamic supplications with Arabic text,
              transliteration, and translations to help you understand and
              remember each Dua.
            </p>

            <div className="mx-auto mt-9 max-w-xl">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white px-4 py-3 shadow-xl shadow-black/10">
                <Search className="shrink-0 text-gray-400" size={20} />

                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search Duas..."
                  className="min-w-0 flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                />

                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    aria-label="Clear search"
                    className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                  >
                    <X size={17} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dua listing */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Islamic Supplications
            </p>
            <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
              Explore Duas
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              {duas.length} {duas.length === 1 ? "Dua" : "Duas"} available
            </p>
          </div>
        </div>

        {/* Tag filters */}
        {availableTags.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedTag("all")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedTag === "all"
                  ? "bg-[#103d32] text-white"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-emerald-700 hover:text-emerald-800"
              }`}
            >
              All Duas
            </button>

            {availableTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  selectedTag === tag
                    ? "bg-[#103d32] text-white"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-emerald-700 hover:text-emerald-800"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex min-h-64 items-center justify-center">
            <Loader2 className="animate-spin text-emerald-700" size={32} />
          </div>
        )}

        {/* Error */}
        {isError && !isLoading && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
            <p className="font-medium text-red-700">Unable to load Duas.</p>
            <p className="mt-2 text-sm text-red-600">Please try again later.</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && filteredDuas.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-800">
              <BookOpen size={25} />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-gray-900">
              No Duas found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Try another search term or select a different category.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSelectedTag("all");
              }}
              className="mt-5 text-sm font-semibold text-emerald-800 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Dua cards */}
        {!isLoading && !isError && filteredDuas.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredDuas.map((dua) => (
              <article
                key={dua.id}
                className="group flex flex-col rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg sm:p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
                    <Heart size={19} />
                  </div>

                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
                    Dua
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-bold text-gray-900 transition group-hover:text-emerald-800">
                  {dua.name}
                </h3>

                <p
                  dir="rtl"
                  lang="ar"
                  className="dua-arabic mt-5 line-clamp-3 text-right text-2xl leading-[2.2] text-gray-800"
                >
                  {dua.arabic}
                </p>

                <p className="mt-4 line-clamp-3 text-sm leading-7 text-gray-600">
                  {dua.bangla}
                </p>

                {getDuaTags(dua.tags).length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {getDuaTags(dua.tags)
                      .slice(0, 3)
                      .map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>
                )}

                <div className="mt-auto border-t border-gray-100 pt-5">
                  <Link
                    href={`/duas/${dua.id}`}
                    className="inline-flex w-full items-center justify-between rounded-xl bg-[#103d32] px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
                  >
                    Read full Dua
                    <ArrowUpRight size={17} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
