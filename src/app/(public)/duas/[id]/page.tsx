"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Check,
  Copy,
  ExternalLink,
  Loader2,
  Share2,
} from "lucide-react";
import { toast } from "sonner";

import { useGetSingleDuaQuery } from "@/redux/api/duaApi";
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

export default function DuaDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [copied, setCopied] = useState(false);

  const {
    data: response,
    isLoading,
    isError,
  } = useGetSingleDuaQuery(id, {
    skip: !id,
  });

  const dua = response?.data;

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch {
      toast.error("Unable to copy. Please check your browser permissions.");
    }
  };

  const getFullDuaText = () => {
    if (!dua) return "";

    return [
      dua.name,
      dua.arabic,
      dua.transliteration,
      dua.bangla,
      dua.english,
      dua.reference ? `Reference: ${dua.reference}` : null,
    ]
      .filter((value): value is string => Boolean(value?.trim()))
      .join("\n\n");
  };

  const handleCopyFullDua = async () => {
    await copyText(getFullDuaText());
    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleShare = async () => {
    if (!dua) return;

    const shareData = {
      title: dua.name,
      text: `${dua.name}\n\n${dua.arabic}\n\n${dua.bangla}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(
          `${shareData.text}\n\n${shareData.url}`,
        );
        toast.success("Dua link copied!");
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;

      toast.error("Unable to share this Dua.");
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#fafaf8]">
        <Loader2 className="animate-spin text-emerald-700" size={34} />
      </main>
    );
  }

  if (isError || !dua) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#fafaf8] px-4">
        <div className="max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <BookOpen className="mx-auto text-emerald-700" size={36} />

          <h1 className="mt-5 text-xl font-bold text-gray-900">
            Dua not found
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            This Dua may have been removed or is currently unavailable.
          </p>

          <Link
            href="/duas"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#103d32] px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            <ArrowLeft size={17} />
            Back to Duas
          </Link>
        </div>
      </main>
    );
  }

  const tags = getDuaTags(dua.tags);

  return (
    <main className="min-h-screen bg-[#fafaf8]">
      {/* Header */}
      <section className="bg-[#103d32]">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <Link
            href="/duas"
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-100 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            All Duas
          </Link>

          <div className="mt-9">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-emerald-100">
              <BookOpen size={14} />
              Islamic Supplication
            </div>

            <h1 className="mt-5 text-3xl font-bold leading-tight text-white sm:text-4xl">
              {dua.name}
            </h1>

            {tags.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-emerald-50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Dua content */}
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="space-y-6">
          {/* Arabic */}
          <article className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-7">
              <h2 className="text-sm font-bold text-gray-900">Arabic</h2>

              <button
                type="button"
                onClick={() => copyText(dua.arabic)}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-50"
              >
                <Copy size={15} />
                Copy Arabic
              </button>
            </div>

            <div className="px-5 py-10 sm:px-10 sm:py-14">
              <p
                dir="rtl"
                lang="ar"
                className="dua-arabic text-center text-3xl leading-[2.5] text-gray-900 sm:text-4xl sm:leading-[2.4]"
              >
                {dua.arabic}
              </p>
            </div>
          </article>

          {/* Transliteration */}
          {dua.transliteration && (
            <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-sm font-bold text-gray-900">
                  Transliteration
                </h2>

                <button
                  type="button"
                  onClick={() => copyText(dua.transliteration ?? "")}
                  aria-label="Copy transliteration"
                  className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-emerald-800"
                >
                  <Copy size={16} />
                </button>
              </div>

              <p className="text-base italic leading-8 text-gray-600 sm:text-lg">
                {dua.transliteration}
              </p>
            </article>
          )}

          {/* Bangla translation */}
          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-sm font-bold text-gray-900">বাংলা অর্থ</h2>

              <button
                type="button"
                onClick={() => copyText(dua.bangla)}
                aria-label="Copy Bangla translation"
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-emerald-800"
              >
                <Copy size={16} />
              </button>
            </div>

            <p className="whitespace-pre-line text-base leading-9 text-gray-700 sm:text-lg">
              {dua.bangla}
            </p>
          </article>

          {/* English translation */}
          {dua.english && (
            <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-sm font-bold text-gray-900">
                  English Translation
                </h2>

                <button
                  type="button"
                  onClick={() => copyText(dua.english ?? "")}
                  aria-label="Copy English translation"
                  className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-emerald-800"
                >
                  <Copy size={16} />
                </button>
              </div>

              <p className="whitespace-pre-line text-base leading-8 text-gray-700">
                {dua.english}
              </p>
            </article>
          )}

          {/* Reference */}
          {dua.reference && (
            <article className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 sm:p-7">
              <h2 className="text-sm font-bold text-gray-900">Reference</h2>

              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-700">
                {dua.reference}
              </p>
            </article>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row">
            <button
              type="button"
              onClick={handleCopyFullDua}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#103d32] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              {copied ? <Check size={17} /> : <Copy size={17} />}
              {copied ? "Copied!" : "Copy Full Dua"}
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3.5 text-sm font-semibold text-gray-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
            >
              <Share2 size={17} />
              Share Dua
            </button>
          </div>

          <div className="pt-3 text-center">
            <Link
              href="/duas"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 transition hover:text-emerald-950"
            >
              <ExternalLink size={15} />
              Explore more Duas
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
