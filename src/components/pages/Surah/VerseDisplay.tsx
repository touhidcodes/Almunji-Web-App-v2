"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { TSurahData } from "@/types/surah";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

interface Surah {
  id: number;
  name: string;
  nameArabic: string;
  nameTranslation: string;
  revelationPlace: "Mecca" | "Madina";
  totalVerses: number;
}

interface Verse {
  number: number;
  arabicText: string;
  translation: string;
  transliteration?: string;
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

// Loading skeleton components
const SurahHeaderSkeleton = () => (
  <Card className="mb-8 p-8">
    <div className="text-center space-y-4">
      <Skeleton className="h-6 w-32 mx-auto" />
      <Skeleton className="h-10 w-48 mx-auto" />
      <Skeleton className="h-12 w-64 mx-auto" />
      <Skeleton className="h-6 w-40 mx-auto" />
      <Skeleton className="h-5 w-56 mx-auto" />
      <div className="flex justify-center gap-4 mt-6">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  </Card>
);

const VerseSkeleton = () => (
  <Card className="p-6">
    <div className="flex justify-between items-start mb-4">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex gap-2">
        <Skeleton className="w-8 h-8 rounded-lg" />
        <Skeleton className="w-8 h-8 rounded-lg" />
        <Skeleton className="w-8 h-8 rounded-lg" />
        <Skeleton className="w-8 h-8 rounded-lg" />
      </div>
    </div>
    <div className="text-right mb-6 space-y-2">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-5/6 ml-auto" />
      <Skeleton className="h-10 w-4/5 ml-auto" />
    </div>
    <div className="space-y-3">
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-5/6" />
      <Skeleton className="h-5 w-4/5" />
    </div>
  </Card>
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
  if (isLoading) {
    return (
      <div className={cn("space-y-6", className)}>
        <SurahHeaderSkeleton />
        <div className="space-y-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <VerseSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!surah) {
    return (
      <div
        className={cn(
          "flex items-center justify-center min-h-[60vh]",
          className
        )}
      >
        <Card className="p-12 text-center max-w-md">
          <BookOpen className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-6" />
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
            Surah not found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            The requested surah could not be loaded.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-6">
        {surah ? (
          surah.bengali.map((ayah, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-800"
            >
              <div className="p-6">
                {/* Arabic Text */}
                <div className="text-right mb-6" dir="rtl">
                  <p
                    className="font-arabic leading-loose text-gray-900 dark:text-white selection:bg-emerald-100 dark:selection:bg-emerald-900"
                    style={{
                      fontSize: `${fontSize + 10}px`,
                      lineHeight: 2.2,
                    }}
                  >
                    {surah.arabic1[index]}
                  </p>
                </div>

                {/* Bangla */}
                {ayah && (
                  <div className="mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
                    <p
                      className="text-gray-600 dark:text-gray-400 italic font-medium"
                      style={{ fontSize: `${fontSize - 1}px` }}
                    >
                      {ayah}
                    </p>
                  </div>
                )}

                {/* English */}
                <div>
                  <p
                    className="leading-relaxed text-gray-700 dark:text-gray-300 selection:bg-blue-100 dark:selection:bg-blue-900"
                    style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
                  >
                    {surah.english[index]}
                  </p>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-12 text-center">
            <BookOpen className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-6" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
              No verses available
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              The verses for this surah are currently loading.
            </p>
          </Card>
        )}
      </div>

      {/* Bottom Navigation */}
      {onNavigate && surah.arabic1.length > 0 && (
        <div className="flex justify-between pt-8 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            size="lg"
            onClick={() => onNavigate("prev")}
            disabled={!canNavigatePrev}
            className="flex items-center gap-2 px-6 py-3"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous Surah
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => onNavigate("next")}
            disabled={!canNavigateNext}
            className="flex items-center gap-2 px-6 py-3"
          >
            Next Surah
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      )}

      {/* Arabic Font Styles */}
      <style jsx>{`
        .font-arabic {
          font-family: "Amiri", "Noto Naskh Arabic", "Times New Roman", serif;
        }
      `}</style>
    </div>
  );
};

export default VerseDisplay;
