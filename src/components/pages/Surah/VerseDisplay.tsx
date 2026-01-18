"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Bookmark,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react";
import React from "react";

interface TSurahData {
  arabic1: string[];
  bengali: string[];
  english: string[];
}

interface VerseDisplayProps {
  surah: TSurahData | null;
  isLoading?: boolean;
  fontSize?: number;
  isPlaying?: boolean;
  currentPlayingVerse?: number;
  onPlayPause?: (verseNumber: number) => void;
  onNavigate?: (direction: "prev" | "next") => void;
  canNavigatePrev?: boolean;
  canNavigateNext?: boolean;
  bookmarkedVerses?: number[];
  onBookmarkToggle?: (verseNumber: number) => void;
  className?: string;
}

// Loading Skeleton Component
const VerseSkeleton: React.FC = () => (
  <div className="py-8 border-b border-gray-100 dark:border-gray-800 last:border-0">
    <div className="flex items-center justify-between mb-6">
      <Skeleton className="w-8 h-8 rounded-full" />
      <div className="flex gap-2">
        <Skeleton className="w-8 h-8 rounded-md" />
        <Skeleton className="w-8 h-8 rounded-md" />
      </div>
    </div>
    <div className="space-y-4">
      <div className="text-right space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-5/6 ml-auto" />
      </div>
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-full" />
    </div>
  </div>
);

// Main Component
const VerseDisplay: React.FC<VerseDisplayProps> = ({
  surah,
  isLoading = false,
  fontSize = 18,
  isPlaying = false,
  currentPlayingVerse,
  onPlayPause,
  onNavigate,
  canNavigatePrev = true,
  canNavigateNext = true,
  bookmarkedVerses = [],
  onBookmarkToggle,
  className,
}) => {
  // Loading State
  if (isLoading) {
    return (
      <div className={cn("max-w-4xl mx-auto px-4", className)}>
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <VerseSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Empty State
  if (!surah) {
    return (
      <div className={cn("max-w-4xl mx-auto px-4 py-20", className)}>
        <div className="text-center">
          <BookOpen className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Surah not found
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            The requested surah could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("max-w-4xl mx-auto px-4 pb-8", className)}>
      {/* Verses Container */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        {surah.bengali.map((bengaliText, index) => {
          const verseNumber = index + 1;
          const isCurrentlyPlaying =
            isPlaying && currentPlayingVerse === verseNumber;
          const isBookmarked = bookmarkedVerses.includes(verseNumber);

          return (
            <div
              key={index}
              className={cn(
                "py-8 px-6 border-b border-gray-100 dark:border-gray-800 last:border-0 transition-colors",
                isCurrentlyPlaying && "bg-emerald-50/50 dark:bg-emerald-950/20"
              )}
            >
              {/* Verse Header */}
              <div className="flex items-center justify-between mb-6">
                <div
                  className={cn(
                    "flex items-center justify-center w-9 h-9 rounded-full text-sm font-semibold transition-all",
                    isCurrentlyPlaying
                      ? "bg-emerald-600 text-white scale-110"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  )}
                >
                  {verseNumber}
                </div>

                <div className="flex items-center gap-1">
                  {onPlayPause && (
                    <button
                      onClick={() => onPlayPause(verseNumber)}
                      className={cn(
                        "p-2 rounded-md transition-colors",
                        isCurrentlyPlaying
                          ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                      )}
                      aria-label={isCurrentlyPlaying ? "Pause" : "Play"}
                    >
                      {isCurrentlyPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </button>
                  )}

                  {onBookmarkToggle && (
                    <button
                      onClick={() => onBookmarkToggle(verseNumber)}
                      className={cn(
                        "p-2 rounded-md transition-colors",
                        isBookmarked
                          ? "text-amber-500 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20"
                          : "text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                      )}
                      aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
                    >
                      <Bookmark
                        className="w-4 h-4"
                        fill={isBookmarked ? "currentColor" : "none"}
                      />
                    </button>
                  )}
                </div>
              </div>

              {/* Arabic Text */}
              <div className="mb-6" dir="rtl">
                <p
                  className="font-arabic text-gray-900 dark:text-white leading-loose text-right"
                  style={{
                    fontSize: `${fontSize + 10}px`,
                    lineHeight: 2,
                  }}
                >
                  {surah.arabic1[index]}
                </p>
              </div>

              {/* Bengali Translation */}
              <div className="mb-4">
                <p
                  className="text-gray-600 dark:text-gray-400 leading-relaxed"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {bengaliText}
                </p>
              </div>

              {/* English Translation */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <p
                  className="text-gray-700 dark:text-gray-300 leading-relaxed"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {surah.english[index]}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      {onNavigate && surah.arabic1.length > 0 && (
        <div className="flex items-center justify-between mt-8 gap-4">
          <Button
            variant="outline"
            onClick={() => onNavigate("prev")}
            disabled={!canNavigatePrev}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </Button>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            {surah.arabic1.length}{" "}
            {surah.arabic1.length === 1 ? "verse" : "verses"}
          </div>

          <Button
            variant="outline"
            onClick={() => onNavigate("next")}
            disabled={!canNavigateNext}
            className="flex items-center gap-2"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Arabic Font */}
      <style jsx>{`
        .font-arabic {
          font-family: "Amiri", "Noto Naskh Arabic", "Traditional Arabic", serif;
        }
      `}</style>
    </div>
  );
};

export default VerseDisplay;
