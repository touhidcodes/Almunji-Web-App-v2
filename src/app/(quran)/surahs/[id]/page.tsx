"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useGetChapterVersesQuery } from "@/redux/api/quranApi";
import {
  setCurrentVerse,
  setIsPlaying,
  setPlaybackSpeed,
  setRepeatMode,
} from "@/redux/features/playerSlice";
import { RootState } from "@/redux/store";
import {
  Bookmark,
  Check,
  Copy,
  Pause,
  Play,
  Repeat,
  Repeat1,
  SkipBack,
  SkipForward,
  Volume2,
  Sparkles,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// Define types for audio data
interface AudioReciter {
  reciter: string;
  url: string;
  verses?: string[];
}

interface AudioData {
  [key: string]: AudioReciter;
}

// Full Surah Skeleton Loading Component
const SurahPageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-gray-950/60 pb-32">
      {/* Header Skeleton */}
      <div className="bg-linear-to-r from-emerald-800 via-teal-800 to-cyan-900 text-white shadow-xl rounded-b-3xl p-6 md:p-8 max-w-4xl mx-auto mb-8 animate-pulse">
        <div className="text-center space-y-4">
          {/* Arabic Title Skeleton */}
          <div className="h-14 w-48 bg-white/20 rounded-2xl mx-auto mb-2" />
          {/* Title & Metadata Skeleton */}
          <div className="h-7 w-36 bg-white/20 rounded-lg mx-auto" />
          <div className="flex justify-center gap-3">
            <div className="h-5 w-24 bg-white/15 rounded-full" />
            <div className="h-5 w-20 bg-white/15 rounded-full" />
            <div className="h-5 w-28 bg-white/15 rounded-full" />
          </div>
        </div>

        {/* Audio Control Bar Skeleton */}
        <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl" />
            <div className="w-36 h-9 bg-white/20 rounded-lg" />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl" />
            <div className="w-14 h-14 bg-white/30 rounded-full" />
            <div className="w-10 h-10 bg-white/20 rounded-xl" />
          </div>
          <div className="w-16 h-9 bg-white/20 rounded-lg" />
        </div>
      </div>

      {/* Bismillah Skeleton */}
      <div className="max-w-4xl mx-auto px-4 py-4 mb-6">
        <div className="h-10 w-72 bg-emerald-200/50 dark:bg-emerald-900/30 rounded-full mx-auto animate-pulse" />
      </div>

      {/* Ayah Card Skeletons */}
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 space-y-5 animate-pulse"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800/60 pb-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60" />
                <Skeleton className="w-20 h-5" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="w-9 h-9 rounded-lg" />
                <Skeleton className="w-9 h-9 rounded-lg" />
                <Skeleton className="w-9 h-9 rounded-lg" />
              </div>
            </div>

            {/* Arabic Text Skeleton */}
            <div className="space-y-3 pt-2">
              <Skeleton className="h-9 w-full ml-auto rounded-lg" />
              <Skeleton className="h-9 w-4/5 ml-auto rounded-lg" />
            </div>

            {/* Bengali Box Skeleton */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-gray-800/40 border-l-4 border-emerald-500/40 space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
            </div>

            {/* English Translation Skeleton */}
            <div className="space-y-2 pt-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const QuranChapterDisplay: React.FC = () => {
  const dispatch = useDispatch();

  // Redux state
  const {
    isPlaying,
    volume,
    fontSize,
    currentVerse,
    repeatMode,
    playbackSpeed,
  } = useSelector((state: RootState) => state.player);

  // Local UI state
  const [bookmarkedVerses, setBookmarkedVerses] = useState<number[]>([]);
  const [selectedReciter, setSelectedReciter] = useState("1");
  const [currentVerseIndex, setCurrentVerseIndex] = useState<number | null>(
    null
  );
  const [copiedVerse, setCopiedVerse] = useState<number | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const verseRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const params = useParams();
  const router = useRouter();
  const surahId = parseInt(params.id as string);
  const { data: versesData, isLoading } = useGetChapterVersesQuery(surahId);

  // Load bookmarks from localStorage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem(`bookmarks_surah_${surahId}`);
    if (savedBookmarks) {
      try {
        setBookmarkedVerses(JSON.parse(savedBookmarks));
      } catch (e) {
        console.error("Error parsing saved bookmarks", e);
      }
    }
  }, [surahId]);

  // Save bookmarks to localStorage
  useEffect(() => {
    localStorage.setItem(
      `bookmarks_surah_${surahId}`,
      JSON.stringify(bookmarkedVerses)
    );
  }, [bookmarkedVerses, surahId]);

  // Set audio volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Set playback speed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Auto-scroll to playing verse with offset
  useEffect(() => {
    if (currentVerse && verseRefs.current[currentVerse]) {
      const element = verseRefs.current[currentVerse];
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [currentVerse]);

  // Update audio when reciter changes
  useEffect(() => {
    if (versesData && selectedReciter && audioRef.current && currentVerse) {
      const audioData = versesData.audio as AudioData;
      const reciterData = audioData[selectedReciter];
      if (reciterData?.verses) {
        audioRef.current.src =
          reciterData.verses[currentVerse - 1] || reciterData.url;
        if (isPlaying) {
          audioRef.current.play().catch(console.error);
        }
      }
    }
  }, [selectedReciter, versesData, currentVerse, isPlaying]);

  const playVerse = (index: number) => {
    if (!versesData?.ayahs?.[index]) {
      dispatch(setIsPlaying(false));
      dispatch(setCurrentVerse(null));
      setCurrentVerseIndex(null);
      return;
    }

    const verseNumber = index + 1;
    const audioData = versesData.audio as AudioData;
    const reciterData = audioData[selectedReciter];
    const audioSrc = reciterData?.verses?.[index] || reciterData?.url || "";

    const audio = audioRef.current;
    if (!audio) return;

    audio.src = audioSrc;
    audio.play().catch((err) => {
      console.error("Audio play error:", err);
      dispatch(setIsPlaying(false));
    });

    setCurrentVerseIndex(index);
    dispatch(setCurrentVerse(verseNumber));
  };

  const handlePlayFullSurah = () => {
    if (!versesData?.ayahs?.length) return;

    if (isPlaying) {
      audioRef.current?.pause();
      dispatch(setIsPlaying(false));
      return;
    }

    const startIndex = currentVerse ? currentVerse - 1 : 0;
    setCurrentVerseIndex(startIndex);
    dispatch(setIsPlaying(true));
    playVerse(startIndex);
  };

  const handlePauseAll = () => {
    audioRef.current?.pause();
    dispatch(setIsPlaying(false));
  };

  const handlePlayPauseVerse = (verseNumber: number) => {
    if (currentVerse === verseNumber && isPlaying) {
      handlePauseAll();
    } else {
      dispatch(setCurrentVerse(verseNumber));
      setCurrentVerseIndex(verseNumber - 1);
      dispatch(setIsPlaying(true));

      if (audioRef.current && versesData) {
        const audioData = versesData.audio as AudioData;
        const reciterData = audioData[selectedReciter];
        audioRef.current.src =
          reciterData?.verses?.[verseNumber - 1] || reciterData?.url || "";
        audioRef.current.play().catch((err) => {
          console.error("Audio play error:", err);
          handlePauseAll();
        });
      }
    }
  };

  const handleAudioEnded = () => {
    if (!versesData) return;

    if (repeatMode === "one" && currentVerse) {
      audioRef.current?.play();
      return;
    }

    if (currentVerseIndex !== null) {
      const nextIndex = currentVerseIndex + 1;

      if (nextIndex < versesData.ayahs.length) {
        playVerse(nextIndex);
      } else if (repeatMode === "all") {
        playVerse(0);
      } else {
        dispatch(setIsPlaying(false));
        dispatch(setCurrentVerse(null));
        setCurrentVerseIndex(null);
      }
    }
  };

  const handleSkipVerse = (direction: "next" | "prev") => {
    if (!versesData) return;

    const baseVerse = currentVerse || 1;
    const newVerse =
      direction === "next"
        ? Math.min(baseVerse + 1, versesData.totalAyah)
        : Math.max(baseVerse - 1, 1);

    if (newVerse !== currentVerse) {
      dispatch(setCurrentVerse(newVerse));
      setCurrentVerseIndex(newVerse - 1);

      const audioData = versesData.audio as AudioData;
      const reciterData = audioData[selectedReciter];
      if (reciterData?.verses?.[newVerse - 1] && audioRef.current) {
        audioRef.current.src = reciterData.verses[newVerse - 1];
        if (isPlaying) {
          audioRef.current.play().catch(console.error);
        }
      }
    }
  };

  const handleBookmarkToggle = (verseNumber: number) => {
    setBookmarkedVerses((prev) =>
      prev.includes(verseNumber)
        ? prev.filter((v) => v !== verseNumber)
        : [...prev, verseNumber]
    );
  };

  const handleCopyAyah = (verseNumber: number, index: number) => {
    if (!versesData) return;
    const textToCopy = `Surah ${versesData.surahName} [${versesData.surahNo}:${verseNumber}]\n\n${versesData.arabic1[index]}\n\n${versesData.bengali[index]}\n\n${versesData.english[index]}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedVerse(verseNumber);
    setTimeout(() => setCopiedVerse(null), 2000);
  };

  const toggleRepeatMode = () => {
    const modes: Array<"none" | "all" | "one"> = ["none", "all", "one"];
    const currentIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    dispatch(setRepeatMode(nextMode));
  };

  const cyclePlaybackSpeed = () => {
    const speeds = [0.75, 1, 1.25, 1.5];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    dispatch(setPlaybackSpeed(nextSpeed));
  };

  // Improved Skeleton Loading
  if (isLoading) {
    return <SurahPageSkeleton />;
  }

  // Error State
  if (!versesData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl max-w-md w-full border border-gray-100 dark:border-gray-800">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Failed to Load Verses
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
            Please try again or return to the main surahs catalog.
          </p>
          <button
            onClick={() => router.push("/")}
            className="w-full py-2.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20"
          >
            Go Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  const audioData = versesData.audio as AudioData;

  return (
    <div className="min-h-screen pb-32">
      {/* Header Surah Banner Card */}
      <div className="bg-linear-to-r from-emerald-800 via-teal-800 to-cyan-900 text-white shadow-xl rounded-b-3xl p-6 md:p-8 mb-8 border-b border-emerald-600/30">
        <div className="max-w-4xl mx-auto">
          {/* Surah Titles */}
          <div className="text-center space-y-2">
            <div className="text-5xl md:text-6xl font-arabic mb-3 drop-shadow-md text-amber-200">
              {versesData.surahNameArabic}
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {versesData.surahName}
            </h1>
            <div className="flex items-center justify-center gap-2 flex-wrap text-sm text-emerald-100/90 pt-1">
              <span>{versesData.surahNameTranslation}</span>
              <span>•</span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-xs font-semibold uppercase tracking-wider">
                {versesData.revelationPlace}
              </span>
              <span>•</span>
              <span>{versesData.totalAyah} Verses</span>
            </div>
          </div>

          {/* Integrated Audio Control Bar (No Settings Icon required!) */}
          <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 shadow-inner">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Left: Repeat Mode & Reciter Select */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
                <button
                  onClick={toggleRepeatMode}
                  className={`p-2.5 rounded-xl transition-all border ${
                    repeatMode !== "none"
                      ? "bg-white text-emerald-800 border-white font-semibold shadow-sm"
                      : "bg-white/10 text-white/80 border-white/20 hover:bg-white/20"
                  }`}
                  title={`Repeat: ${repeatMode}`}
                >
                  {repeatMode === "one" ? (
                    <Repeat1 className="w-4 h-4" />
                  ) : (
                    <Repeat className="w-4 h-4" />
                  )}
                </button>

                {/* Reciter Selector */}
                <div className="flex items-center gap-2 bg-white/15 border border-white/20 rounded-xl px-3 py-1.5">
                  <Volume2 className="w-4 h-4 text-emerald-200" />
                  <select
                    value={selectedReciter}
                    onChange={(e) => setSelectedReciter(e.target.value)}
                    className="bg-transparent text-white text-xs font-medium focus:outline-none cursor-pointer pr-1 [&>option]:text-gray-900 [&>option]:bg-white"
                  >
                    {Object.entries(audioData).map(
                      ([key, value]: [string, AudioReciter]) => (
                        <option key={key} value={key}>
                          {value.reciter}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              {/* Center: Play/Pause and Skip Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleSkipVerse("prev")}
                  disabled={!currentVerse || currentVerse <= 1}
                  className="p-2.5 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Previous verse"
                >
                  <SkipBack className="w-5 h-5" />
                </button>

                <button
                  onClick={handlePlayFullSurah}
                  className="p-4 bg-white hover:bg-emerald-50 text-emerald-800 rounded-full transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                  title={isPlaying ? "Pause" : "Play Surah"}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 fill-current" />
                  ) : (
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  )}
                </button>

                <button
                  onClick={() => handleSkipVerse("next")}
                  disabled={
                    !currentVerse || currentVerse >= versesData.totalAyah
                  }
                  className="p-2.5 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Next verse"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>

              {/* Right: Playback Speed Button & Active Status */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
                <button
                  onClick={cyclePlaybackSpeed}
                  className="bg-white/15 hover:bg-white/25 border border-white/20 rounded-xl px-3 py-1.5 text-xs font-semibold text-white transition-colors"
                  title="Playback speed"
                >
                  {playbackSpeed}x Speed
                </button>
              </div>
            </div>

            {/* Currently Active Ayah Status Pill */}
            {currentVerse !== null && currentVerse > 0 && (
              <div className="mt-3 pt-3 border-t border-white/15 flex items-center justify-center">
                <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-400/30 text-white text-xs font-medium shadow-inner animate-pulse">
                  {isPlaying ? (
                    <span className="flex items-center gap-0.5 h-3">
                      <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce" />
                    </span>
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                  )}
                  <span>
                    Active Ayah: <strong className="text-amber-300">{currentVerse}</strong> of {versesData.totalAyah}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bismillah Header */}
      {versesData.surahNo !== 1 && versesData.surahNo !== 9 && (
        <div className="max-w-4xl mx-auto px-4 py-4 mb-6">
          <div className="text-center text-3xl md:text-4xl font-arabic text-emerald-700 dark:text-emerald-400 drop-shadow-sm py-4 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xs rounded-2xl border border-emerald-100 dark:border-emerald-900/50 shadow-2xs">
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </div>
        </div>
      )}

      {/* Ayahs Display */}
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {versesData.arabic1.map((arabicText: string, index: number) => {
          const verseNumber = index + 1;
          const isPlayingVerse = currentVerse === verseNumber && isPlaying;
          const isBookmarked = bookmarkedVerses.includes(verseNumber);
          const isCopied = copiedVerse === verseNumber;

          return (
            <div
              key={verseNumber}
              ref={(el) => {
                verseRefs.current[verseNumber] = el;
              }}
              className={`bg-white dark:bg-gray-900 rounded-2xl shadow-sm border transition-all duration-300 relative overflow-hidden ${
                isPlayingVerse
                  ? "ring-2 ring-emerald-500 dark:ring-emerald-400 border-emerald-400/50 dark:border-emerald-500/50 shadow-lg shadow-emerald-500/10 scale-[1.01] bg-linear-to-r from-emerald-50/80 via-teal-50/50 to-emerald-50/80 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-emerald-950/30"
                  : "border-gray-100 dark:border-gray-800 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-md"
              }`}
            >
              {/* Now Playing Banner Indicator on Card */}
              {isPlayingVerse && (
                <div className="absolute top-0 right-0 left-0 h-1 bg-linear-to-r from-emerald-500 via-teal-400 to-emerald-500" />
              )}

              <div className="p-6">
                {/* Verse Header Actions */}
                <div className="flex items-center justify-between mb-5 border-b border-gray-100 dark:border-gray-800/80 pb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 shadow-2xs ${
                        isPlayingVerse
                          ? "bg-linear-to-br from-emerald-500 to-teal-600 text-white ring-2 ring-emerald-300 dark:ring-emerald-700 shadow-md scale-105"
                          : "bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                      }`}
                    >
                      {verseNumber}
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Ayah {verseNumber}
                      </span>
                      {isPlayingVerse && (
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                          Playing Now
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions (Play, Bookmark, Copy) */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handlePlayPauseVerse(verseNumber)}
                      className={`p-2 rounded-xl transition-all duration-200 ${
                        isPlayingVerse
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "hover:bg-emerald-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400"
                      }`}
                      title={isPlayingVerse ? "Pause verse" : "Play verse"}
                    >
                      {isPlayingVerse ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </button>

                    <button
                      onClick={() => handleBookmarkToggle(verseNumber)}
                      className={`p-2 rounded-xl transition-all duration-200 ${
                        isBookmarked
                          ? "text-amber-500 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40"
                          : "text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300"
                      }`}
                      title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                    >
                      <Bookmark
                        className="w-4 h-4"
                        fill={isBookmarked ? "currentColor" : "none"}
                      />
                    </button>

                    <button
                      onClick={() => handleCopyAyah(verseNumber, index)}
                      className="p-2 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 rounded-xl transition-all duration-200"
                      title="Copy Ayah text"
                    >
                      {isCopied ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Arabic Text */}
                <div
                  className="text-right mb-6 font-arabic leading-loose text-gray-900 dark:text-gray-100 select-text"
                  style={{ fontSize: `${fontSize + 10}px`, lineHeight: "2.2" }}
                >
                  {arabicText}
                </div>

                {/* Bengali Translation */}
                <div
                  className="text-left mb-4 leading-relaxed text-gray-800 dark:text-gray-200 border-l-4 border-emerald-500 dark:border-emerald-400 pl-4 py-2 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-r-xl"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {versesData.bengali[index]}
                </div>

                {/* English Translation */}
                <div
                  className="text-left leading-relaxed text-gray-600 dark:text-gray-400 italic pl-4"
                  style={{ fontSize: `${fontSize - 2}px` }}
                >
                  {versesData.english[index]}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bookmarked Verses Pill Bar */}
      {bookmarkedVerses.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 mt-8">
          <div className="bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-2xl p-4 backdrop-blur-xs">
            <div className="flex items-center gap-2 mb-3">
              <Bookmark
                className="w-4 h-4 text-amber-600 dark:text-amber-400"
                fill="currentColor"
              />
              <span className="font-semibold text-sm text-amber-900 dark:text-amber-200">
                Bookmarked Verses ({bookmarkedVerses.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {bookmarkedVerses
                .sort((a, b) => a - b)
                .map((verseNum) => (
                  <button
                    key={verseNum}
                    onClick={() => {
                      verseRefs.current[verseNum]?.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }}
                    className="px-3 py-1 bg-amber-200/70 dark:bg-amber-900/60 text-amber-900 dark:text-amber-100 rounded-full text-xs font-semibold hover:bg-amber-300 dark:hover:bg-amber-800 transition-colors shadow-2xs"
                  >
                    Ayah {verseNum}
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Invisible Audio Element */}
      <audio ref={audioRef} onEnded={handleAudioEnded} />
    </div>
  );
};

export default QuranChapterDisplay;
