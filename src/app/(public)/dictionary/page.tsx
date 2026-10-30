"use client";

import { useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronRight,
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

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed bg-muted/30 px-4 py-4">
      <p className="text-sm leading-6 text-muted-foreground">{message}</p>
    </div>
  );
}

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

  // Debounce search input to avoid calling the API on every keystroke.
  const debouncedSearchTerm = useDebounce(searchTerm.trim(), 400);

  // True while the user is typing and the debounced value has not updated.
  const isSearchDebouncing = searchTerm.trim() !== debouncedSearchTerm;

  // Dictionary suggestions
  const {
    currentData: suggestionsResponse,
    isLoading: isSuggestionsLoading,
    isFetching: isSuggestionsFetching,
    isError: isSuggestionsError,
    refetch: refetchSuggestions,
  } = useGetDictionarySuggestionsQuery({
    searchTerm: debouncedSearchTerm,
  });

  // Selected dictionary word details
  const {
    currentData: wordDetailsResponse,
    isLoading: isWordDetailsLoading,
    isFetching: isWordDetailsFetching,
    isError: isWordDetailsError,
    refetch: refetchWordDetails,
  } = useGetDictionaryWordQuery(selectedWordId ?? "", {
    skip: !selectedWordId,
  });

  // Use currentData instead of data to avoid showing results from an older query.
  const suggestions = suggestionsResponse?.data ?? [];
  const selectedWord = wordDetailsResponse?.data ?? null;

  const isSuggestionsPending =
    isSearchDebouncing ||
    isSuggestionsLoading ||
    (isSuggestionsFetching && !suggestionsResponse);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setSelectedWordId(null);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSelectedWordId(null);
  };

  const handleSelectWord = (id: string) => {
    setSelectedWordId(id);
  };

  const handleBackToResults = () => {
    setSelectedWordId(null);
  };

  // Selected word information
  const wordTitle = cleanText(selectedWord?.persianWord);
  const transliteration = cleanText(selectedWord?.transliteration);
  const banglaMeaning = cleanText(selectedWord?.banglaMeaning);
  const englishMeaning = cleanText(selectedWord?.englishMeaning);

  // Examples from the dictionary schema
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

  const hasExamples = examples.some((example) => Boolean(example.value));

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {/* Page Introduction */}
        <section className="relative mb-8 overflow-hidden rounded-3xl bg-linear-to-br from-teal-950 via-teal-900 to-emerald-800 px-6 py-8 text-white shadow-sm sm:px-10 sm:py-10">
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
              Explore Persian words with their Bangla and English meanings,
              transliteration, and multilingual usage examples.
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

        {/* Main Content */}
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(300px,0.85fr)_minmax(0,1.4fr)]">
          {/* Search and Suggestions */}
          <section className="min-w-0">
            <Card className="overflow-hidden rounded-2xl border-border/80 shadow-sm">
              {/* Search Header */}
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

                {/* Search Input */}
                <div className="relative mt-4">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    type="text"
                    placeholder="Type a word to search..."
                    value={searchTerm}
                    onChange={(event) => handleSearchChange(event.target.value)}
                    className="h-12 rounded-xl pl-10 pr-20 focus-visible:ring-teal-600"
                    aria-label="Search dictionary"
                  />

                  {/* Search Loading Indicator */}
                  {(isSearchDebouncing || isSuggestionsFetching) && (
                    <Loader2 className="pointer-events-none absolute right-11 top-1/2 size-4 -translate-y-1/2 animate-spin text-teal-700" />
                  )}

                  {/* Single Clear Button */}
                  {searchTerm.length > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Clear search"
                      onClick={handleClearSearch}
                      className="absolute right-1 top-1/2 size-9 -translate-y-1/2 rounded-lg"
                    >
                      <X className="size-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Results */}
              <CardContent className="p-0">
                <div className="flex min-h-11 items-center justify-between gap-2 px-5 py-3 text-xs text-muted-foreground">
                  <span>
                    {isSuggestionsPending
                      ? "Searching dictionary..."
                      : debouncedSearchTerm
                        ? `${suggestions.length} ${
                            suggestions.length === 1 ? "result" : "results"
                          } found`
                        : `${suggestions.length} dictionary ${
                            suggestions.length === 1 ? "word" : "words"
                          }`}
                  </span>

                  {suggestions.length > 0 && !isSuggestionsPending && (
                    <span className="hidden sm:inline">
                      {debouncedSearchTerm
                        ? "Search results"
                        : "Dictionary entries"}
                    </span>
                  )}
                </div>

                {/* Suggestions List */}
                <ScrollArea className="h-[min(62vh,620px)]">
                  <div className="space-y-1.5 px-3 pb-3">
                    {isSuggestionsPending ? (
                      <div className="flex flex-col items-center gap-3 py-16 text-sm text-muted-foreground">
                        <Loader2 className="size-6 animate-spin text-teal-700" />
                        {debouncedSearchTerm
                          ? "Searching for matching words..."
                          : "Loading dictionary words..."}
                      </div>
                    ) : isSuggestionsError ? (
                      <div className="flex flex-col items-center px-4 py-12 text-center">
                        <p className="font-medium">
                          Unable to load dictionary entries
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                          Please try again.
                        </p>

                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-4"
                          onClick={() => refetchSuggestions()}
                        >
                          Try again
                        </Button>
                      </div>
                    ) : suggestions.length > 0 ? (
                      suggestions.map((word) => {
                        const title = cleanText(word.persianWord);
                        const meaning = cleanText(word.banglaMeaning);
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
                                  {title}
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
                        <Search className="mx-auto size-8 text-muted-foreground" />

                        <p className="mt-4 font-semibold">No matching words</p>

                        <p className="mx-auto mt-1 max-w-xs text-sm leading-5 text-muted-foreground">
                          No dictionary entries match your search. Try another
                          spelling or search in Persian, Bangla, or English.
                        </p>
                      </div>
                    ) : (
                      <div className="px-4 py-16 text-center">
                        <BookOpen className="mx-auto size-8 text-muted-foreground" />

                        <p className="mt-4 font-semibold">
                          No dictionary entries available
                        </p>

                        <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">
                          Dictionary entries will appear here when they become
                          available.
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </section>

          {/* Dictionary Word Details */}
          <section className="min-w-0">
            {selectedWordId &&
            (isWordDetailsLoading || isWordDetailsFetching) ? (
              <Card className="rounded-2xl shadow-sm">
                <CardContent className="flex min-h-[420px] flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
                  <Loader2 className="size-7 animate-spin text-teal-700" />
                  Loading word details...
                </CardContent>
              </Card>
            ) : isWordDetailsError && selectedWordId ? (
              <Card className="rounded-2xl shadow-sm">
                <CardContent className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
                  <p className="font-semibold">Unable to load this word</p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Please try selecting it again.
                  </p>

                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => refetchWordDetails()}
                    >
                      Try again
                    </Button>

                    <Button variant="ghost" onClick={handleBackToResults}>
                      <ArrowLeft className="mr-2 size-4" />
                      Back
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : selectedWord ? (
              <Card className="overflow-hidden rounded-2xl border-border/80 shadow-sm">
                {/* Word Heading */}
                <div className="border-b bg-linear-to-br from-card to-muted/40 px-5 py-6 sm:px-7 sm:py-8">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-teal-700 bg-background/80 px-3 py-1.5 text-xs font-medium text-teal-700">
                      <BookOpen className="size-3.5" />
                      Dictionary entry
                    </span>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="lg:hidden"
                      onClick={handleBackToResults}
                    >
                      <ArrowLeft className="mr-1 size-4" />
                      Results
                    </Button>
                  </div>

                  <h2
                    dir="rtl"
                    className="mt-5 wrap-break-words text-4xl font-bold leading-tight tracking-tight sm:text-5xl"
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

                {/* Word Information */}
                <CardContent className="space-y-7 p-5 sm:p-7">
                  <MeaningCard
                    title="Bangla meaning"
                    subtitle="বাংলা অর্থ"
                    value={banglaMeaning}
                  />

                  <MeaningCard
                    title="English meaning"
                    subtitle="English translation"
                    value={englishMeaning}
                  />

                  {/* Usage Examples */}
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
      </div>
    </main>
  );
}
