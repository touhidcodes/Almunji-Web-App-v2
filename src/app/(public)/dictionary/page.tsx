"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronRight,
  Languages,
  Loader2,
  Search,
  Sparkles,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useGetDictionarySuggestionsQuery,
  useGetDictionaryWordQuery,
} from "@/redux/api/dictionaryApi";

/**
 * Matches the actual Prisma Dictionary model.
 */
type DictionaryWord = {
  id: string;
  persianWord: string;
  transliteration: string | null;
  banglaMeaning: string;
  englishMeaning: string | null;
  exampleFA: string | null;
  exampleEN: string | null;
  exampleBN: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

/**
 * Normalize optional text fields.
 */
const cleanText = (value?: string | null): string => {
  const text = value?.trim();

  if (
    !text ||
    text === "-" ||
    text.toLowerCase() === "null" ||
    text.toLowerCase() === "undefined"
  ) {
    return "";
  }

  return text;
};

/**
 * Empty state component.
 */
function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed bg-muted/30 px-4 py-4">
      <p className="text-sm leading-6 text-muted-foreground">{message}</p>
    </div>
  );
}

/**
 * Section heading.
 */
function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-3">
      <h3 className="text-sm font-semibold tracking-tight">{title}</h3>

      {subtitle && (
        <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}

/**
 * Meaning card.
 */
function MeaningCard({
  title,
  subtitle,
  value,
}: {
  title: string;
  subtitle: string;
  value: string;
}) {
  return (
    <section>
      <SectionHeader title={title} subtitle={subtitle} />

      {value ? (
        <div className="rounded-xl border bg-card p-4 sm:p-5">
          <p className="whitespace-pre-wrap text-sm leading-7 text-foreground sm:text-base">
            {value}
          </p>
        </div>
      ) : (
        <EmptyState
          message={`${title} has not been added to this dictionary entry yet.`}
        />
      )}
    </section>
  );
}

export default function DictionaryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm.trim(), 400);

  // Dictionary suggestions
  const {
    data: suggestionsData,
    isLoading: isSuggestionsLoading,
    isFetching: isSuggestionsFetching,
    isError: isSuggestionsError,
  } = useGetDictionarySuggestionsQuery(
    { search: debouncedSearchTerm },
    { skip: !debouncedSearchTerm },
  );

  // Selected dictionary entry
  const {
    data: wordDetailsData,
    isLoading: isWordDetailsLoading,
    isFetching: isWordDetailsFetching,
    isError: isWordDetailsError,
  } = useGetDictionaryWordQuery(selectedWordId ?? "", {
    skip: !selectedWordId,
  });

  /**
   * API response data.
   *
   * The endpoint response is typed at the component boundary
   * because the actual response type depends on dictionaryApi.
   */
  const suggestions =
    (suggestionsData?.data as DictionaryWord[] | undefined) ?? [];

  const selectedWord =
    (wordDetailsData?.data as DictionaryWord | undefined) ?? null;

  /**
   * Clear search and selection.
   */
  const clearSearch = () => {
    setSearchTerm("");
    setSelectedWordId(null);
  };

  /**
   * Update search and reset selected entry.
   */
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setSelectedWordId(null);
  };

  /**
   * Select dictionary entry.
   */
  const handleSelectWord = (id: string) => {
    setSelectedWordId(id);
  };

  // Selected word properties
  const wordTitle = cleanText(selectedWord?.persianWord);

  const transliteration = cleanText(selectedWord?.transliteration);

  const banglaMeaning = cleanText(selectedWord?.banglaMeaning);

  const englishMeaning = cleanText(selectedWord?.englishMeaning);

  // Structured examples
  const examples = selectedWord
    ? [
        {
          key: "exampleFA",
          title: "Persian example",
          subtitle: "مثال فارسی",
          value: cleanText(selectedWord.exampleFA),
          dir: "rtl" as const,
        },
        {
          key: "exampleBN",
          title: "Bangla example",
          subtitle: "বাংলা উদাহরণ",
          value: cleanText(selectedWord.exampleBN),
          dir: "auto" as const,
        },
        {
          key: "exampleEN",
          title: "English example",
          subtitle: "English usage",
          value: cleanText(selectedWord.exampleEN),
          dir: "auto" as const,
        },
      ]
    : [];

  const hasExamples = examples.some((example) => example.value);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-teal-700 text-white shadow-sm">
              <BookOpen className="size-5" />
            </span>

            <span>
              <span className="block text-lg font-bold tracking-tight">
                Almunji
              </span>
              <span className="hidden text-xs text-muted-foreground sm:block">
                Language & Quran resources
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/"
              className="hidden rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground sm:inline-flex"
            >
              Home
            </Link>

            <Link
              href="/dictionary"
              aria-current="page"
              className="rounded-lg bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-800 dark:bg-teal-950 dark:text-teal-200"
            >
              Dictionary
            </Link>

            <Link
              href="/about"
              className="hidden rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground sm:inline-flex"
            >
              About
            </Link>

            <div className="ml-1 hidden items-center gap-2 border-l pl-3 md:flex">
              <Link href="/auth?type=login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>

              <Link href="/auth?type=register">
                <Button
                  size="sm"
                  className="bg-teal-700 text-white hover:bg-teal-800"
                >
                  Get started
                </Button>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {/* Hero */}
        <section className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-teal-950 via-teal-900 to-emerald-800 px-6 py-8 text-white shadow-sm sm:px-10 sm:py-10">
          <div className="pointer-events-none absolute -right-12 -top-20 size-64 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-2 -top-10 size-44 rounded-full border border-white/10" />

          <div className="relative max-w-2xl">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-teal-50">
              <Sparkles className="size-3.5" />
              Explore words with context
            </span>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Persian Dictionary
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-teal-50/85 sm:text-base">
              Explore Persian words with Bangla and English meanings,
              transliteration, usage examples, and multilingual support.
            </p>

            <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium text-teal-50">
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
                فارسی
              </span>
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
                বাংলা
              </span>
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
                English
              </span>
            </div>
          </div>
        </section>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(300px,0.85fr)_minmax(0,1.4fr)]">
          {/* Search and results */}
          <section className="min-w-0">
            <Card className="overflow-hidden rounded-2xl border-border/80 shadow-sm">
              <div className="border-b px-5 py-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="font-semibold">Find a word</h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Search in Persian, Bangla, or English
                    </p>
                  </div>

                  <span className="flex size-10 items-center justify-center rounded-xl bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-200">
                    <Search className="size-4" />
                  </span>
                </div>

                {/* Search input */}
                <div className="relative mt-4">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    type="text"
                    placeholder="Type a word to search..."
                    value={searchTerm}
                    onChange={(event) => handleSearchChange(event.target.value)}
                    className="h-12 rounded-xl pl-10 pr-11 focus-visible:ring-teal-600"
                    aria-label="Search dictionary"
                  />

                  {isSuggestionsFetching && debouncedSearchTerm && (
                    <Loader2 className="pointer-events-none absolute right-11 top-1/2 size-4 -translate-y-1/2 animate-spin text-teal-700" />
                  )}

                  {/* Single clear button */}
                  {searchTerm.length > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Clear search"
                      onClick={clearSearch}
                      className="absolute right-1 top-1/2 size-9 -translate-y-1/2 rounded-lg"
                    >
                      <X className="size-4" />
                    </Button>
                  )}
                </div>
              </div>

              <CardContent className="p-0">
                <div className="flex min-h-11 items-center justify-between gap-2 px-5 py-3 text-xs text-muted-foreground">
                  <span>
                    {!debouncedSearchTerm
                      ? "Search to explore dictionary entries"
                      : isSuggestionsLoading || isSuggestionsFetching
                        ? "Searching dictionary..."
                        : `${suggestions.length} ${
                            suggestions.length === 1 ? "result" : "results"
                          }`}
                  </span>

                  {debouncedSearchTerm && suggestions.length > 0 && (
                    <span className="hidden sm:inline">Select an entry</span>
                  )}
                </div>

                <ScrollArea className="h-[min(62vh,620px)]">
                  <div className="space-y-1.5 px-3 pb-3">
                    {isSuggestionsLoading ||
                    (isSuggestionsFetching && !suggestionsData) ? (
                      <div className="flex flex-col items-center gap-3 py-16 text-sm text-muted-foreground">
                        <Loader2 className="size-6 animate-spin text-teal-700" />
                        Searching words...
                      </div>
                    ) : isSuggestionsError ? (
                      <div className="px-4 py-12 text-center">
                        <p className="font-medium">
                          We couldn’t load the results
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Please try searching again.
                        </p>
                      </div>
                    ) : suggestions.length > 0 ? (
                      suggestions.map((word) => {
                        const title = cleanText(word.persianWord);

                        const meaning =
                          cleanText(word.banglaMeaning) ||
                          cleanText(word.englishMeaning);

                        const pronunciation = cleanText(word.transliteration);

                        const isSelected = selectedWordId === word.id;

                        return (
                          <button
                            key={word.id}
                            type="button"
                            onClick={() => handleSelectWord(word.id)}
                            aria-pressed={isSelected}
                            className={`group w-full rounded-xl border p-4 text-left transition-all ${
                              isSelected
                                ? "border-teal-700/40 bg-teal-50/80 shadow-sm dark:bg-teal-950/40"
                                : "border-transparent hover:border-border hover:bg-muted/60"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <p
                                  dir="rtl"
                                  className="text-xl font-semibold leading-8"
                                >
                                  {title || "Untitled word"}
                                </p>

                                {pronunciation && (
                                  <p className="mt-0.5 text-xs italic text-muted-foreground">
                                    {pronunciation}
                                  </p>
                                )}

                                {meaning && (
                                  <p className="mt-2 line-clamp-2 text-sm leading-5 text-muted-foreground">
                                    {meaning}
                                  </p>
                                )}
                              </div>

                              <span
                                className={`mt-1 flex size-7 shrink-0 items-center justify-center rounded-full transition ${
                                  isSelected
                                    ? "bg-teal-700 text-white"
                                    : "bg-muted text-muted-foreground group-hover:bg-teal-100 group-hover:text-teal-800"
                                }`}
                              >
                                {isSelected ? (
                                  <Check className="size-3.5" />
                                ) : (
                                  <ChevronRight className="size-4" />
                                )}
                              </span>
                            </div>
                          </button>
                        );
                      })
                    ) : debouncedSearchTerm ? (
                      <div className="px-4 py-16 text-center">
                        <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                          <Search className="size-5" />
                        </span>

                        <p className="mt-4 font-semibold">No matching words</p>

                        <p className="mx-auto mt-1 max-w-xs text-sm leading-5 text-muted-foreground">
                          Try another spelling or search in Persian, Bangla, or
                          English.
                        </p>
                      </div>
                    ) : (
                      <div className="px-4 py-16 text-center">
                        <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-200">
                          <Languages className="size-5" />
                        </span>

                        <p className="mt-4 font-semibold">Start exploring</p>

                        <p className="mx-auto mt-1 max-w-xs text-sm leading-5 text-muted-foreground">
                          Enter a word above to discover its meaning and usage.
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </section>

          {/* Word details */}
          <section className="min-w-0">
            {isWordDetailsLoading || isWordDetailsFetching ? (
              <Card className="rounded-2xl shadow-sm">
                <CardContent className="flex min-h-[420px] flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
                  <Loader2 className="size-7 animate-spin text-teal-700" />
                  Loading word details...
                </CardContent>
              </Card>
            ) : isWordDetailsError && selectedWordId ? (
              <Card className="rounded-2xl shadow-sm">
                <CardContent className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">
                  <p className="font-semibold">Unable to load this word</p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Please select it again or try another search.
                  </p>

                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setSelectedWordId(null)}
                  >
                    <ArrowLeft className="mr-2 size-4" />
                    Back to results
                  </Button>
                </CardContent>
              </Card>
            ) : selectedWord ? (
              <Card className="overflow-hidden rounded-2xl border-border/80 shadow-sm">
                {/* Word heading */}
                <div className="border-b bg-gradient-to-br from-card to-muted/40 px-5 py-6 sm:px-7 sm:py-8">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                      <BookOpen className="size-3.5" />
                      Dictionary entry
                    </span>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="lg:hidden"
                      onClick={() => setSelectedWordId(null)}
                    >
                      <ArrowLeft className="mr-1 size-4" />
                      Results
                    </Button>
                  </div>

                  <h2
                    dir="rtl"
                    className="mt-5 break-words text-4xl font-bold leading-tight tracking-tight sm:text-5xl"
                  >
                    {wordTitle || "Dictionary entry"}
                  </h2>

                  {transliteration ? (
                    <p className="mt-3 text-sm italic text-muted-foreground">
                      {transliteration}
                    </p>
                  ) : (
                    <p className="mt-3 text-sm text-muted-foreground">
                      Pronunciation has not been provided.
                    </p>
                  )}
                </div>

                <CardContent className="space-y-7 p-5 sm:p-7">
                  {/* Bangla meaning */}
                  <MeaningCard
                    title="Bangla meaning"
                    subtitle="বাংলা অর্থ"
                    value={banglaMeaning}
                  />

                  {/* English meaning */}
                  <MeaningCard
                    title="English meaning"
                    subtitle="English translation"
                    value={englishMeaning}
                  />

                  {/* Usage examples */}
                  <section>
                    <SectionHeader
                      title="Usage examples"
                      subtitle="Examples in Persian, Bangla, and English"
                    />

                    {hasExamples ? (
                      <div className="space-y-3">
                        {examples.map((example) => (
                          <div
                            key={example.key}
                            className="rounded-xl border bg-card p-4"
                          >
                            <div className="mb-2 flex items-center justify-between gap-2">
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                  {example.title}
                                </p>

                                <p className="mt-1 text-xs text-muted-foreground">
                                  {example.subtitle}
                                </p>
                              </div>

                              {example.value && (
                                <span className="size-2 rounded-full bg-teal-600" />
                              )}
                            </div>

                            {example.value ? (
                              <p
                                dir={example.dir}
                                className="whitespace-pre-wrap text-sm leading-7 text-foreground"
                              >
                                {example.value}
                              </p>
                            ) : (
                              <p className="text-sm italic text-muted-foreground">
                                No {example.title.toLowerCase()} available yet.
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState message="No usage examples have been added for this word yet." />
                    )}
                  </section>

                  {/* Entry metadata */}
                  <section className="border-t pt-5">
                    <p className="text-xs text-muted-foreground">
                      Dictionary entry
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Last updated:{" "}
                      {selectedWord.updatedAt
                        ? new Date(selectedWord.updatedAt).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )
                        : "Not available"}
                    </p>
                  </section>

                  <div className="border-t pt-5">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full rounded-xl"
                      onClick={() => setSelectedWordId(null)}
                    >
                      <ArrowLeft className="mr-2 size-4" />
                      Back to search results
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="overflow-hidden rounded-2xl border-border/80 shadow-sm">
                <CardContent className="flex min-h-[540px] flex-col items-center justify-center px-6 py-16 text-center">
                  <span className="flex size-16 items-center justify-center rounded-3xl bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-200">
                    <BookOpen className="size-7" />
                  </span>

                  <h2 className="mt-5 text-xl font-semibold tracking-tight">
                    Your word, explained
                  </h2>

                  <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                    Select a word from the search results to explore its
                    meanings, transliteration, and usage examples in one place.
                  </p>

                  <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded-full border px-3 py-1.5">
                      Persian
                    </span>
                    <span className="rounded-full border px-3 py-1.5">
                      বাংলা
                    </span>
                    <span className="rounded-full border px-3 py-1.5">
                      English
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/20">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-center text-xs text-muted-foreground sm:px-6 md:flex-row md:items-center md:justify-between md:text-left lg:px-8">
          <p>© {new Date().getFullYear()} Almunji. All rights reserved.</p>
          <p>A thoughtful space for language and Quran learning.</p>
        </div>
      </footer>
    </div>
  );
}
