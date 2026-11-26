"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
} from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronUp,
  List,
  Minus,
  Moon,
  Plus,
  Settings2,
  Sun,
} from "lucide-react";

import {
  useGetBookBySlugQuery,
  useGetContentsByBookQuery,
} from "@/redux/api/bookApi";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type ReaderTheme = "light" | "sepia" | "dark";
type ReaderWidth = "narrow" | "comfortable" | "wide";
type ReaderSpacing = "compact" | "normal" | "relaxed";

interface ReaderSettings {
  fontSize: number;
  theme: ReaderTheme;
  width: ReaderWidth;
  spacing: ReaderSpacing;
}

interface TReaderContent {
  id: string;
  section: string;
  index: number;
  text: string;
}

interface TBookContentsResponse {
  content?: unknown;
  contents?: unknown;
  data?: unknown;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const DEFAULT_SETTINGS: ReaderSettings = {
  fontSize: 19,
  theme: "light",
  width: "comfortable",
  spacing: "relaxed",
};

const SETTINGS_STORAGE_KEY = "almunji-book-reader-settings";

const themeClasses: Record<ReaderTheme, string> = {
  light: "bg-white text-slate-800",
  sepia: "bg-[#f4ecd8] text-[#514331]",
  dark: "bg-[#1e293b] text-slate-200",
};

const widthClasses: Record<ReaderWidth, string> = {
  narrow: "max-w-2xl",
  comfortable: "max-w-3xl",
  wide: "max-w-5xl",
};

const spacingClasses: Record<ReaderSpacing, string> = {
  compact: "leading-7",
  normal: "leading-8",
  relaxed: "leading-[2.2]",
};

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const isReaderTheme = (value: unknown): value is ReaderTheme =>
  value === "light" || value === "sepia" || value === "dark";

const isReaderWidth = (value: unknown): value is ReaderWidth =>
  value === "narrow" || value === "comfortable" || value === "wide";

const isReaderSpacing = (value: unknown): value is ReaderSpacing =>
  value === "compact" || value === "normal" || value === "relaxed";

const isReaderContent = (value: unknown): value is TReaderContent => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const content = value as Record<string, unknown>;

  return (
    typeof content.id === "string" &&
    typeof content.section === "string" &&
    typeof content.index === "number" &&
    typeof content.text === "string"
  );
};

/**
 * Supports different API response structures:
 *
 * data: [...]
 * data: { content: [...] }
 * data: { contents: [...] }
 * data: { data: { content: [...] } }
 */
const extractBookContents = (response: unknown): TReaderContent[] => {
  if (Array.isArray(response)) {
    return response.filter(isReaderContent);
  }

  if (typeof response !== "object" || response === null) {
    return [];
  }

  const payload = response as TBookContentsResponse;

  if (Array.isArray(payload.content)) {
    return payload.content.filter(isReaderContent);
  }

  if (Array.isArray(payload.contents)) {
    return payload.contents.filter(isReaderContent);
  }

  if (payload.data !== undefined) {
    return extractBookContents(payload.data);
  }

  return [];
};

const parseReaderSettings = (value: string): ReaderSettings => {
  const parsed: unknown = JSON.parse(value);

  if (typeof parsed !== "object" || parsed === null) {
    return DEFAULT_SETTINGS;
  }

  const saved = parsed as Partial<ReaderSettings>;

  return {
    fontSize:
      typeof saved.fontSize === "number" && Number.isFinite(saved.fontSize)
        ? Math.min(30, Math.max(14, saved.fontSize))
        : DEFAULT_SETTINGS.fontSize,

    theme: isReaderTheme(saved.theme) ? saved.theme : DEFAULT_SETTINGS.theme,

    width: isReaderWidth(saved.width) ? saved.width : DEFAULT_SETTINGS.width,

    spacing: isReaderSpacing(saved.spacing)
      ? saved.spacing
      : DEFAULT_SETTINGS.spacing,
  };
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export default function BookReader() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  const [settings, setSettings] = useState<ReaderSettings>(DEFAULT_SETTINGS);

  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMobileContents, setShowMobileContents] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  // ---------------------------------------------------------------------------
  // Reading preferences
  // ---------------------------------------------------------------------------

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);

      if (savedSettings) {
        setSettings(parseReaderSettings(savedSettings));
      }
    } catch {
      setSettings(DEFAULT_SETTINGS);
    } finally {
      setSettingsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!settingsLoaded) return;

    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Reading preferences remain usable even if storage is unavailable.
    }
  }, [settings, settingsLoaded]);

  // ---------------------------------------------------------------------------
  // Book API
  // ---------------------------------------------------------------------------

  const {
    data: bookResponse,
    isLoading: isBookLoading,
    isError: isBookError,
  } = useGetBookBySlugQuery(slug);

  const book = bookResponse?.data;

  // ---------------------------------------------------------------------------
  // Book contents API
  // ---------------------------------------------------------------------------

  const {
    data: contentsResponse,
    isLoading: isContentsLoading,
    isError: isContentsError,
  } = useGetContentsByBookQuery(book?.id ?? "", {
    skip: !book?.id,
  });

  // Extract contents safely instead of spreading an unknown object.
  const contents = useMemo(
    () =>
      extractBookContents(contentsResponse).sort(
        (first, second) => first.index - second.index,
      ),
    [contentsResponse],
  );

  // ---------------------------------------------------------------------------
  // Reading progress
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const updateProgress = () => {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      if (scrollableHeight <= 0) {
        setReadingProgress(0);
        return;
      }

      const progress = (window.scrollY / scrollableHeight) * 100;

      setReadingProgress(Math.min(100, Math.max(0, progress)));
    };

    updateProgress();

    window.addEventListener("scroll", updateProgress, {
      passive: true,
    });

    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [contents.length]);

  // ---------------------------------------------------------------------------
  // Settings handlers
  // ---------------------------------------------------------------------------

  const updateSettings = useCallback(
    <K extends keyof ReaderSettings>(key: K, value: ReaderSettings[K]) => {
      setSettings((previous) => ({
        ...previous,
        [key]: value,
      }));
    },
    [],
  );

  const increaseFontSize = () => {
    updateSettings("fontSize", Math.min(settings.fontSize + 1, 30));
  };

  const decreaseFontSize = () => {
    updateSettings("fontSize", Math.max(settings.fontSize - 1, 14));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  // ---------------------------------------------------------------------------
  // Navigation handlers
  // ---------------------------------------------------------------------------

  const scrollToSection = useCallback((id: string) => {
    document.getElementById(`section-${id}`)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    setShowMobileContents(false);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ---------------------------------------------------------------------------
  // Computed styles
  // ---------------------------------------------------------------------------

  const currentThemeClass = themeClasses[settings.theme];

  const readerStyle = {
    "--reader-font-size": `${settings.fontSize}px`,
  } as CSSProperties;

  // ---------------------------------------------------------------------------
  // Loading state
  // ---------------------------------------------------------------------------

  if (isBookLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <BookOpen className="mx-auto mb-3 h-9 w-9 animate-pulse text-emerald-600" />
          <p className="text-sm text-slate-500">Loading your book...</p>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Book not found
  // ---------------------------------------------------------------------------

  if (isBookError || !book) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md text-center">
          <BookOpen className="mx-auto mb-4 h-12 w-12 text-slate-400" />

          <h2 className="text-xl font-semibold text-slate-800">
            Book not found
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            This book may have been removed or is currently unavailable.
          </p>

          <Link
            href="/books"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800"
          >
            <ArrowLeft size={16} />
            Back to library
          </Link>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Main reader
  // ---------------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-white text-slate-800 dark:bg-slate-950 dark:text-slate-200">
      {/* Reading progress bar */}
      <div className="fixed left-0 right-0 top-0 z-[60] h-1 bg-emerald-100">
        <div
          className="h-full bg-emerald-600 transition-[width] duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Reader header */}
      <header className="sticky top-1 z-50 border-b border-slate-200/70 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/books"
              aria-label="Back to books"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ArrowLeft size={19} />
            </Link>

            <div className="min-w-0">
              <h1 className="truncate text-sm font-semibold sm:text-base">
                {book.name}
              </h1>

              <p className="text-xs text-slate-500">
                {Math.round(readingProgress)}% completed
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            {/* Mobile contents */}
            <button
              type="button"
              onClick={() => setShowMobileContents((previous) => !previous)}
              aria-label="Toggle table of contents"
              aria-expanded={showMobileContents}
              className="flex h-9 items-center gap-2 rounded-lg px-3 text-sm transition hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            >
              <List size={18} />
            </button>

            {/* Reading settings */}
            <button
              type="button"
              onClick={() => setShowSettings((previous) => !previous)}
              aria-expanded={showSettings}
              className={`flex h-9 items-center gap-2 rounded-lg px-3 text-sm transition ${
                showSettings
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Settings2 size={18} />
              <span className="hidden sm:inline">Reading settings</span>
            </button>
          </div>
        </div>

        {/* Settings panel */}
        {showSettings && (
          <div className="border-t border-slate-200 bg-white px-4 py-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* Font size */}
              <div>
                <p className="mb-3 text-sm font-semibold">Font size</p>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={decreaseFontSize}
                    disabled={settings.fontSize <= 14}
                    aria-label="Decrease font size"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    <Minus size={16} />
                  </button>

                  <span className="min-w-12 text-center text-sm tabular-nums">
                    {settings.fontSize}px
                  </span>

                  <button
                    type="button"
                    onClick={increaseFontSize}
                    disabled={settings.fontSize >= 30}
                    aria-label="Increase font size"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-800"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Theme */}
              <div>
                <p className="mb-3 text-sm font-semibold">Reading theme</p>

                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      ["light", "Light", Sun],
                      ["sepia", "Sepia", BookOpen],
                      ["dark", "Dark", Moon],
                    ] as const
                  ).map(([value, label, Icon]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => updateSettings("theme", value)}
                      className={`flex h-9 items-center gap-2 rounded-lg border px-3 text-xs transition ${
                        settings.theme === value
                          ? "border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                          : "border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Icon size={14} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reading width */}
              <div>
                <p className="mb-3 text-sm font-semibold">Reading width</p>

                <select
                  value={settings.width}
                  onChange={(event) => {
                    const value = event.target.value;

                    if (isReaderWidth(value)) {
                      updateSettings("width", value);
                    }
                  }}
                  className="h-9 w-full rounded-lg border border-slate-200 bg-transparent px-3 text-sm outline-none focus:border-emerald-600 dark:border-slate-700"
                >
                  <option value="narrow">Narrow</option>
                  <option value="comfortable">Comfortable</option>
                  <option value="wide">Wide</option>
                </select>
              </div>

              {/* Line spacing */}
              <div>
                <p className="mb-3 text-sm font-semibold">Line spacing</p>

                <select
                  value={settings.spacing}
                  onChange={(event) => {
                    const value = event.target.value;

                    if (isReaderSpacing(value)) {
                      updateSettings("spacing", value);
                    }
                  }}
                  className="h-9 w-full rounded-lg border border-slate-200 bg-transparent px-3 text-sm outline-none focus:border-emerald-600 dark:border-slate-700"
                >
                  <option value="compact">Compact</option>
                  <option value="normal">Normal</option>
                  <option value="relaxed">Relaxed</option>
                </select>
              </div>
            </div>

            <div className="mx-auto mt-5 flex max-w-5xl justify-end">
              <button
                type="button"
                onClick={resetSettings}
                className="text-xs font-medium text-emerald-700 hover:underline dark:text-emerald-400"
              >
                Reset preferences
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main reader layout */}
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* Desktop table of contents */}
        <aside className="hidden border-r border-slate-200/70 lg:sticky lg:top-[68px] lg:block lg:h-[calc(100vh-68px)] lg:overflow-y-auto dark:border-slate-800">
          <div className="p-5">
            <div className="mb-5 flex items-center gap-2">
              <List size={18} className="text-emerald-700" />
              <h2 className="font-semibold">Contents</h2>
            </div>

            <p className="mb-4 text-xs text-slate-500">
              {contents.length} sections
            </p>

            {isContentsLoading ? (
              <p className="text-sm text-slate-500">Loading contents...</p>
            ) : isContentsError ? (
              <p className="text-sm text-red-500">
                Unable to load book contents.
              </p>
            ) : contents.length === 0 ? (
              <p className="text-sm text-slate-500">No sections available.</p>
            ) : (
              <nav className="space-y-1">
                {contents.map((content, index) => (
                  <button
                    key={content.id}
                    type="button"
                    onClick={() => scrollToSection(content.id)}
                    className="flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left text-sm text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-emerald-400"
                  >
                    <span className="mt-0.5 text-xs text-slate-400">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="line-clamp-2">{content.section}</span>
                  </button>
                ))}
              </nav>
            )}
          </div>
        </aside>

        {/* Mobile table of contents */}
        {showMobileContents && (
          <div className="border-b border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 lg:hidden">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-semibold">Table of contents</h2>

              <button
                type="button"
                onClick={() => setShowMobileContents(false)}
                aria-label="Close contents"
                className="rounded-lg p-1 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ChevronUp size={20} />
              </button>
            </div>

            {contents.length === 0 ? (
              <p className="py-3 text-sm text-slate-500">
                No sections available.
              </p>
            ) : (
              <nav className="max-h-72 space-y-1 overflow-y-auto">
                {contents.map((content, index) => (
                  <button
                    key={content.id}
                    type="button"
                    onClick={() => scrollToSection(content.id)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition hover:bg-emerald-50 dark:hover:bg-slate-800"
                  >
                    <span className="text-xs text-slate-400">
                      {String(index + 1).padStart(2, "0")}.
                    </span>

                    {content.section}
                  </button>
                ))}
              </nav>
            )}
          </div>
        )}

        {/* Book display */}
        <main className="min-w-0 px-4 py-8 sm:px-8 lg:px-12 lg:py-12">
          <div
            className={`mx-auto ${widthClasses[settings.width]}`}
            style={readerStyle}
          >
            {/* Book introduction */}
            <div className="mb-12 border-b border-slate-200 pb-10 dark:border-slate-800">
              <div className="mb-6 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                <BookOpen size={15} />
                <span>{book.category?.name ?? "Almunji Library"}</span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {book.name}
              </h1>

              {book.description && (
                <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-500 dark:text-slate-400">
                  {book.description}
                </p>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <span>{contents.length} sections</span>
                <span>•</span>
                <span>{Math.round(readingProgress)}% read</span>
              </div>
            </div>

            {/* Book contents */}
            {isContentsLoading ? (
              <div className="py-20 text-center">
                <BookOpen className="mx-auto mb-3 h-8 w-8 animate-pulse text-emerald-600" />
                <p className="text-sm text-slate-500">
                  Loading book contents...
                </p>
              </div>
            ) : isContentsError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30">
                Unable to load this book&apos;s contents. Please try again.
              </div>
            ) : contents.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">
                <BookOpen className="mx-auto mb-3 h-8 w-8 text-slate-400" />

                <h2 className="font-semibold">No content available</h2>

                <p className="mt-2 text-sm text-slate-500">
                  The content for this book has not been added yet.
                </p>
              </div>
            ) : (
              <div className="space-y-16">
                {contents.map((content, index) => (
                  <section
                    key={content.id}
                    id={`section-${content.id}`}
                    className="scroll-mt-28"
                  >
                    {/* Section heading */}
                    <div className="mb-7 flex items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
                        {index + 1}
                      </span>

                      <h2 className="text-xl font-bold sm:text-2xl">
                        {content.section}
                      </h2>
                    </div>

                    {/* Rich text content */}
                    <div
                      className={[
                        "book-reader-content",
                        currentThemeClass,
                        spacingClasses[settings.spacing],
                      ].join(" ")}
                      style={{
                        fontSize: "var(--reader-font-size)",
                      }}
                    >
                      <div
                        dangerouslySetInnerHTML={{
                          __html: content.text,
                        }}
                      />
                    </div>

                    {/* Section navigation */}
                    <div className="mt-8 flex items-center justify-between gap-3 border-b border-slate-200 pb-8 dark:border-slate-800">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => {
                          const previousContent = contents[index - 1];

                          if (previousContent) {
                            scrollToSection(previousContent.id);
                          }
                        }}
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:text-emerald-400"
                      >
                        <ArrowLeft size={16} />
                        Previous
                      </button>

                      {index < contents.length - 1 ? (
                        <button
                          type="button"
                          onClick={() => {
                            const nextContent = contents[index + 1];

                            if (nextContent) {
                              scrollToSection(nextContent.id);
                            }
                          }}
                          className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800"
                        >
                          Next section
                          <ArrowRight size={16} />
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                          <Check size={17} />
                          End of book
                        </span>
                      )}
                    </div>
                  </section>
                ))}
              </div>
            )}

            {/* Back to top */}
            <div className="mt-12 flex justify-center">
              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-sm text-slate-600 transition hover:border-emerald-600 hover:text-emerald-700 dark:border-slate-700 dark:text-slate-300"
              >
                <ChevronUp size={16} />
                Back to top
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
