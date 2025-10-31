"use client";

import React from "react";
import {
  Play,
  Pause,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Share,
  Bookmark,
  BookmarkCheck,
  Copy,
  MapPin,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { TSurahData } from "@/types/surah";

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

// Surah Header Component
const SurahHeader: React.FC<{
  surah: Surah;
  onNavigate?: (direction: "prev" | "next") => void;
  canNavigatePrev?: boolean;
  canNavigateNext?: boolean;
}> = ({
  surah,
  onNavigate,
  canNavigatePrev = true,
  canNavigateNext = true,
}) => (
  <Card className="mb-8 bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950 dark:via-teal-950 dark:to-cyan-950 border-emerald-200 dark:border-emerald-800">
    <div className="p-8 text-center">
      {/* Badge */}
      <div className="flex items-center justify-center mb-6">
        <Badge
          variant="secondary"
          className="bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700 px-4 py-2 text-sm font-medium"
        >
          <MapPin className="w-4 h-4 mr-2" />
          Surah {surah.id} • {surah.revelationPlace}
        </Badge>
      </div>

      {/* Title */}
      <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
        {surah.name}
      </h1>

      {/* Arabic Name */}
      <p
        className="text-5xl lg:text-6xl font-arabic mb-6 text-gray-800 dark:text-gray-200 leading-relaxed"
        dir="rtl"
      >
        {surah.nameArabic}
      </p>

      {/* Translation */}
      <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-6 font-medium">
        {surah.nameTranslation}
      </p>

      {/* Info */}
      <div className="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-8">
        <div className="flex items-center gap-2">
          <Hash className="w-4 h-4" />
          <span>{surah.totalVerses} verses</span>
        </div>
        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
        <span>Revealed in {surah.revelationPlace}</span>
      </div>

      {/* Navigation */}
      {onNavigate && (
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => onNavigate("prev")}
            disabled={!canNavigatePrev}
            className="flex items-center gap-2 px-6 py-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => onNavigate("next")}
            disabled={!canNavigateNext}
            className="flex items-center gap-2 px-6 py-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  </Card>
);

// Individual Verse Component
const VerseCard: React.FC<{
  verse: Verse;
  surahId: number;
  fontSize: number;
  isPlaying: boolean;
  isCurrentPlaying: boolean;
  isBookmarked: boolean;
  onPlay: () => void;
  onBookmarkToggle: () => void;
}> = ({
  verse,
  surahId,
  fontSize,
  isPlaying,
  isCurrentPlaying,
  isBookmarked,
  onPlay,
  onBookmarkToggle,
}) => {
  const copyVerse = async () => {
    const text = `${verse.arabicText}\n\n${verse.translation}\n\n— Quran ${surahId}:${verse.number}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {}
  };

  const shareVerse = async () => {
    const text = `${verse.arabicText}\n\n${verse.translation}\n\n— Quran ${surahId}:${verse.number}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Quran ${surahId}:${verse.number}`,
          text: text,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copy
      copyVerse();
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-800">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-bold">
            {verse.number}
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onPlay}
                    className={cn(
                      "h-9 w-9 p-0 hover:bg-emerald-50 dark:hover:bg-emerald-950",
                      isCurrentPlaying &&
                        "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950"
                    )}
                  >
                    {isCurrentPlaying && isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isCurrentPlaying && isPlaying
                    ? "Pause recitation"
                    : "Play recitation"}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onBookmarkToggle}
                    className={cn(
                      "h-9 w-9 p-0 hover:bg-amber-50 dark:hover:bg-amber-950",
                      isBookmarked &&
                        "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950"
                    )}
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="h-4 w-4" />
                    ) : (
                      <Bookmark className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isBookmarked ? "Remove bookmark" : "Bookmark verse"}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyVerse}
                    className="h-9 w-9 p-0 hover:bg-blue-50 dark:hover:bg-blue-950"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy verse</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={shareVerse}
                    className="h-9 w-9 p-0 hover:bg-green-50 dark:hover:bg-green-950"
                  >
                    <Share className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Share verse</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Arabic Text */}
        <div className="text-right mb-6" dir="rtl">
          <p
            className="font-arabic leading-loose text-gray-900 dark:text-white selection:bg-emerald-100 dark:selection:bg-emerald-900"
            style={{
              fontSize: `${fontSize + 10}px`,
              lineHeight: 2.2,
            }}
          >
            {verse.arabicText}
          </p>
        </div>

        {/* Transliteration */}
        {verse.transliteration && (
          <div className="mb-4 pb-4 border-b border-gray-100 dark:border-gray-700">
            <p
              className="text-gray-600 dark:text-gray-400 italic font-medium"
              style={{ fontSize: `${fontSize - 1}px` }}
            >
              {verse.transliteration}
            </p>
          </div>
        )}

        {/* Translation */}
        <div>
          <p
            className="leading-relaxed text-gray-700 dark:text-gray-300 selection:bg-blue-100 dark:selection:bg-blue-900"
            style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
          >
            {verse.translation}
          </p>
        </div>
      </div>
    </Card>
  );
};

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
      {/* <SurahHeader
        surah={surah}
        onNavigate={onNavigate}
        canNavigatePrev={canNavigatePrev}
        canNavigateNext={canNavigateNext}
      /> */}

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
