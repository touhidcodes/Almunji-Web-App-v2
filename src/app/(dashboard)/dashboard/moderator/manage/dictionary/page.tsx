"use client";

import { useState } from "react";
import { useGetAllWordsAdminQuery } from "@/redux/api/dictionaryApi";

export default function ModeratorDictionaryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, isError } = useGetAllWordsAdminQuery({ searchTerm, page: 1, limit: 50 });
  const words = data?.data ?? [];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <p className="text-sm font-medium text-teal-700">Islamic resources</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">Dictionary</h1>
        <p className="mt-2 text-sm text-slate-500">Browse Quranic words and their meanings.</p>
      </header>
      <label className="block max-w-md text-sm font-medium text-slate-700">
        Search words
        <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Persian, Bangla, or English" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-teal-600" />
      </label>
      {isLoading ? <p role="status" className="text-slate-500">Loading words…</p> : isError ? <p role="alert" className="text-red-700">Dictionary words could not be loaded.</p> : words.length === 0 ? <p className="rounded-xl bg-white p-8 text-slate-500">No words found.</p> : (
        <div className="grid gap-4 md:grid-cols-2">
          {words.map((word) => <article key={word.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p dir="rtl" className="text-2xl font-semibold text-teal-800">{word.persianWord}</p>
            {word.transliteration && <p className="mt-1 text-sm italic text-slate-500">{word.transliteration}</p>}
            <p className="mt-4 text-slate-800">{word.banglaMeaning}</p>
            {word.englishMeaning && <p className="mt-1 text-sm text-slate-500">{word.englishMeaning}</p>}
          </article>)}
        </div>
      )}
    </div>
  );
}
