"use client";

import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Play,
  Pause,
  Bookmark,
  Settings,
  SkipForward,
  SkipBack,
  Repeat,
  Repeat1,
} from "lucide-react";
import { useGetChapterVersesQuery } from "@/redux/api/quranApi";
import { useParams, useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import {
  setIsPlaying,
  setCurrentVerse,
  setRepeatMode,
  setPlaybackSpeed,
} from "@/redux/features/playerSlice";

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
  const [showSettings, setShowSettings] = useState(false);
  const [currentVerseIndex, setCurrentVerseIndex] = useState<number | null>(
    null
  );

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
      setBookmarkedVerses(JSON.parse(savedBookmarks));
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

  // Auto-scroll to playing verse
  useEffect(() => {
    if (currentVerse && verseRefs.current[currentVerse]) {
      const element = verseRefs.current[currentVerse];
      if (element) {
        const headerOffset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
  }, [currentVerse]);

  // Update audio when reciter changes
  useEffect(() => {
    if (versesData && selectedReciter && audioRef.current && currentVerse) {
      const audioData = versesData.audio[selectedReciter];
      if (audioData?.verses) {
        audioRef.current.src =
          audioData.verses[currentVerse - 1] || audioData.url;
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
    const audioData = versesData.audio[selectedReciter];
    const audioSrc = audioData?.verses?.[index] || audioData?.url || "";

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

    setCurrentVerseIndex(0);
    dispatch(setIsPlaying(true));
    playVerse(0);
  };

  const handlePauseAll = () => {
    audioRef.current?.pause();
    dispatch(setIsPlaying(false));
    dispatch(setCurrentVerse(null));
  };

  const handlePlayPauseVerse = (verseNumber: number) => {
    if (currentVerse === verseNumber && isPlaying) {
      handlePauseAll();
    } else {
      dispatch(setCurrentVerse(verseNumber));
      dispatch(setIsPlaying(true));

      if (audioRef.current && versesData) {
        const audioData = versesData.audio[selectedReciter];
        audioRef.current.src =
          audioData?.verses?.[verseNumber - 1] || audioData?.url || "";
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
    if (!versesData || !currentVerse) return;

    const newVerse =
      direction === "next"
        ? Math.min(currentVerse + 1, versesData.totalAyah)
        : Math.max(currentVerse - 1, 1);

    if (newVerse !== currentVerse) {
      dispatch(setCurrentVerse(newVerse));
      setCurrentVerseIndex(newVerse - 1);

      const audioData = versesData.audio[selectedReciter];
      if (audioData?.verses?.[newVerse - 1]) {
        audioRef.current!.src = audioData.verses[newVerse - 1];
        audioRef.current!.play().catch(console.error);
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

  const toggleRepeatMode = () => {
    const modes: Array<"none" | "all" | "one"> = ["none", "all", "one"];
    const currentIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    dispatch(setRepeatMode(nextMode));
  };

  const cyclePlaybackSpeed = () => {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    dispatch(setPlaybackSpeed(nextSpeed));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
            Loading verses...
          </p>
        </div>
      </div>
    );
  }

  if (!versesData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
          <div className="text-red-600 dark:text-red-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
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
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Please try again or select a different Surah
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-32">
      {/* Header Section */}
      <div className="bg-linear-to-r from-emerald-600 to-teal-600 dark:from-emerald-800 dark:to-teal-800 text-white shadow-lg mb-8">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-5xl font-arabic mb-3 drop-shadow-lg">
              {versesData.surahNameArabic}
            </div>
            <div className="text-2xl font-bold mb-2">
              {versesData.surahName}
            </div>
            <div className="text-sm opacity-90 flex items-center justify-center gap-2 flex-wrap">
              <span>{versesData.surahNameTranslation}</span>
              <span>•</span>
              <span>{versesData.revelationPlace}</span>
              <span>•</span>
              <span>{versesData.totalAyah} Ayahs</span>
            </div>
          </div>

          {/* Audio Controls */}
          <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={toggleRepeatMode}
                className={`p-2 rounded-lg transition-all ${
                  repeatMode !== "none"
                    ? "bg-white/30 text-white"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
                title={`Repeat: ${repeatMode}`}
              >
                {repeatMode === "one" ? (
                  <Repeat1 className="w-5 h-5" />
                ) : (
                  <Repeat className="w-5 h-5" />
                )}
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleSkipVerse("prev")}
                  disabled={!currentVerse || currentVerse <= 1}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Previous verse"
                >
                  <SkipBack className="w-5 h-5" />
                </button>

                <button
                  onClick={handlePlayFullSurah}
                  className="p-4 bg-white hover:bg-white/90 text-emerald-600 rounded-full transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  title={isPlaying ? "Pause" : "Play full surah"}
                >
                  {isPlaying && currentVerse ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6" />
                  )}
                </button>

                <button
                  onClick={() => handleSkipVerse("next")}
                  disabled={
                    !currentVerse || currentVerse >= versesData.totalAyah
                  }
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Next verse"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-lg transition-all ${
                  showSettings
                    ? "bg-white/30 text-white"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
                title="Audio settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>

            {currentVerse && (
              <div className="text-center text-sm text-white/90">
                <span className="font-medium">
                  Playing Ayah {currentVerse} of {versesData.totalAyah}
                </span>
              </div>
            )}

            {showSettings && (
              <div className="mt-4 pt-4 border-t border-white/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Reciter</span>
                  <select
                    value={selectedReciter}
                    onChange={(e) => setSelectedReciter(e.target.value)}
                    className="bg-white/20 border border-white/30 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    {Object.entries(versesData.audio).map(
                      ([key, value]: [string, any]) => (
                        <option
                          key={key}
                          value={key}
                          className="text-gray-900 bg-white"
                        >
                          {value.reciter}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Playback Speed</span>
                  <button
                    onClick={cyclePlaybackSpeed}
                    className="bg-white/20 hover:bg-white/30 border border-white/30 rounded-lg px-3 py-1.5 text-sm transition-colors"
                  >
                    {playbackSpeed}x
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bismillah */}
      {versesData.surahNo !== 1 && versesData.surahNo !== 9 && (
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center text-4xl md:text-5xl font-arabic text-emerald-700 dark:text-emerald-400 drop-shadow-sm">
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </div>
        </div>
      )}

      {/* Verses */}
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        {versesData.arabic1.map((arabicText: string, index: number) => {
          const verseNumber = index + 1;
          const isPlayingVerse = currentVerse === verseNumber && isPlaying;
          const isBookmarked = bookmarkedVerses.includes(verseNumber);

          return (
            <div
              key={verseNumber}
              ref={(el) => {
                verseRefs.current[verseNumber] = el;
              }}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 ${
                isPlayingVerse
                  ? "ring-2 ring-emerald-500 dark:ring-emerald-400 shadow-lg shadow-emerald-200 dark:shadow-emerald-900 scale-[1.01]"
                  : "hover:shadow-lg"
              }`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        isPlayingVerse
                          ? "bg-emerald-600 dark:bg-emerald-500 text-white ring-4 ring-emerald-200 dark:ring-emerald-800 shadow-lg"
                          : "bg-emerald-600 dark:bg-emerald-700 text-white"
                      }`}
                    >
                      {verseNumber}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      Ayah {verseNumber}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePlayPauseVerse(verseNumber)}
                      className={`p-2.5 rounded-lg transition-all duration-200 ${
                        isPlayingVerse
                          ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-800 shadow-md"
                          : "hover:bg-emerald-50 dark:hover:bg-gray-700 text-emerald-600 dark:text-emerald-400"
                      }`}
                      title={isPlayingVerse ? "Pause verse" : "Play verse"}
                    >
                      {isPlayingVerse ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleBookmarkToggle(verseNumber)}
                      className={`p-2.5 hover:bg-emerald-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 ${
                        isBookmarked
                          ? "text-amber-500 dark:text-amber-400"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                      title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
                    >
                      <Bookmark
                        className="w-5 h-5"
                        fill={isBookmarked ? "currentColor" : "none"}
                      />
                    </button>
                  </div>
                </div>

                <div
                  className="text-right mb-5 font-arabic leading-loose text-gray-900 dark:text-gray-100"
                  style={{ fontSize: `${fontSize + 10}px`, lineHeight: "2.2" }}
                >
                  {arabicText}
                </div>

                <div
                  className="text-left mb-4 leading-relaxed text-gray-700 dark:text-gray-300 border-l-4 border-emerald-500 dark:border-emerald-400 pl-4 py-1 bg-emerald-50/50 dark:bg-emerald-900/20 rounded-r"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {versesData.bengali[index]}
                </div>

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

      {/* Bookmarked Verses */}
      {bookmarkedVerses.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 mt-8">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Bookmark
                className="w-5 h-5 text-amber-600 dark:text-amber-400"
                fill="currentColor"
              />
              <span className="font-semibold text-amber-900 dark:text-amber-200">
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
                    className="px-3 py-1 bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 rounded-full text-sm hover:bg-amber-300 dark:hover:bg-amber-700 transition-colors"
                  >
                    Ayah {verseNum}
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      <audio ref={audioRef} onEnded={handleAudioEnded} />
    </div>
  );
};

export default QuranChapterDisplay;
