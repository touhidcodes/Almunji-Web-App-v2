"use client";

import SurahSidebar from "@/components/pages/Surah/SurahSidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useGetChaptersQuery } from "@/redux/api/quranApi";
import {
  setFontSize,
  setIsPlaying,
  setVolume,
} from "@/redux/features/playerSlice";
import { RootState } from "@/redux/store";
import { TChapterData } from "@/types/surah";
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  Minus,
  Moon,
  Pause,
  Play,
  Plus,
  Radio,
  Sun,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface SurahLayoutProps {
  children: React.ReactNode;
}

interface ChildProps {
  fontSize?: number;
  isPlaying?: boolean;
  onPlayPause?: () => void;
  volume?: number;
}

const SurahLayout: React.FC<SurahLayoutProps> = ({ children }) => {
  const dispatch = useDispatch();

  // Get state from Redux
  const { isPlaying, volume, fontSize, currentVerse } = useSelector(
    (state: RootState) => state.player
  );

  // Local state
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const { data: chaptersData = [], isLoading } = useGetChaptersQuery({});

  // Get current surah info from pathname
  const currentSurahId =
    pathname.startsWith("/surahs/") || pathname.startsWith("/surah/")
      ? parseInt(pathname.split("/")[2])
      : null;

  const currentSurah = (chaptersData as TChapterData[])?.find(
    (s: TChapterData) => s.id === currentSurahId
  );

  // Initialize settings from localStorage
  useEffect(() => {
    const isDark = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    }

    // Load player settings into Redux
    const savedFontSize = localStorage.getItem("fontSize");
    if (savedFontSize) {
      dispatch(setFontSize(parseInt(savedFontSize)));
    }

    const savedVolume = localStorage.getItem("volume");
    if (savedVolume) {
      dispatch(setVolume(parseInt(savedVolume) / 100)); // Convert to 0-1 range
    }

    const savedSidebarState = localStorage.getItem("sidebarOpen");
    if (savedSidebarState !== null)
      setIsSidebarOpen(savedSidebarState === "true");

    const savedSidebarCollapsed = localStorage.getItem("sidebarCollapsed");
    if (savedSidebarCollapsed !== null)
      setIsSidebarCollapsed(savedSidebarCollapsed === "true");
  }, [dispatch]);

  // Save settings to localStorage when Redux state changes
  useEffect(() => {
    localStorage.setItem("fontSize", fontSize.toString());
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem("volume", Math.round(volume * 100).toString());
  }, [volume]);

  useEffect(() => {
    localStorage.setItem("sidebarOpen", isSidebarOpen.toString());
  }, [isSidebarOpen]);

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", isSidebarCollapsed.toString());
  }, [isSidebarCollapsed]);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("darkMode", newMode.toString());
    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleSidebarCollapse = () =>
    setIsSidebarCollapsed(!isSidebarCollapsed);

  const togglePlayPause = () => {
    dispatch(setIsPlaying(!isPlaying));
  };

  const toggleMute = () => setIsMuted(!isMuted);

  const adjustFontSize = (increment: boolean) => {
    const newSize = increment
      ? Math.min(32, fontSize + 2)
      : Math.max(12, fontSize - 2);
    dispatch(setFontSize(newSize));
  };

  const handleVolumeChange = (value: number[]) => {
    dispatch(setVolume(value[0] / 100));
  };

  const handleNavigate = (direction: number) => {
    if (!currentSurahId) return;

    const newSurahId = currentSurahId + direction;
    if (newSurahId >= 1 && newSurahId <= 114) {
      router.push(`/surahs/${newSurahId}`);
    }
  };

  const volumePercent = Math.round(volume * 100);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Sidebar - Full Height */}
      <SurahSidebar
        chapters={chaptersData as TChapterData[]}
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        isLoading={isLoading}
        isCollapsed={isSidebarCollapsed}
        onCollapse={toggleSidebarCollapse}
      />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header - Sticky */}
        <header className="sticky top-0 z-30 bg-white/85 dark:bg-gray-900/85 backdrop-blur-md border-b border-gray-200/80 dark:border-gray-800/80 shadow-xs">
          <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto w-full">
            {/* Left side */}
            <div className="flex items-center gap-3">
              {/* Mobile Sidebar Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="h-9 w-9 p-0 lg:hidden hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-gray-700 dark:text-gray-300"
              >
                {isSidebarOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>

              {/* Nav Links */}
              <nav className="hidden lg:flex items-center gap-2 mr-2">
                <button
                  onClick={() => router.push("/")}
                  className={cn(
                    "text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800",
                    pathname === "/" &&
                      "text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/50"
                  )}
                >
                  Home
                </button>
                <button
                  onClick={() => router.push("/dictionary")}
                  className={cn(
                    "text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800",
                    pathname.startsWith("/dictionary") &&
                      "text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/50"
                  )}
                >
                  Dictionary
                </button>
              </nav>

              {/* Current Surah & Active Ayah Display */}
              {currentSurah && (
                <div className="flex items-center gap-2 sm:gap-3">
                  <Badge
                    variant="outline"
                    className="font-semibold border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/50 px-2.5 py-1 text-xs shrink-0"
                  >
                    Surah {currentSurah.id}
                  </Badge>

                  <Separator
                    orientation="vertical"
                    className="h-6 hidden sm:block bg-gray-200 dark:bg-gray-700"
                  />

                  <div className="hidden sm:flex flex-col">
                    <h2 className="font-bold text-gray-900 dark:text-white text-sm leading-tight">
                      {currentSurah.surahName}
                    </h2>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      {currentSurah.surahNameTranslation} • {currentSurah.totalAyah} verses
                    </p>
                  </div>

                  {/* Active Ayah Feature Badge */}
                  {currentVerse !== null && currentVerse > 0 && (
                    <div
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 border shadow-xs ml-1",
                        isPlaying
                          ? "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-400/40 dark:border-emerald-600/50 animate-pulse"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700"
                      )}
                    >
                      {isPlaying ? (
                        <span className="flex items-center gap-0.5 h-3">
                          <span className="w-1 h-3 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <span className="w-1 h-3 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <span className="w-1 h-3 bg-emerald-500 rounded-full animate-bounce" />
                        </span>
                      ) : (
                        <Radio className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      )}
                      <span>
                        Ayah {currentVerse}
                        <span className="opacity-60 font-normal hidden md:inline">
                          {" "}/ {currentSurah.totalAyah}
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right side controls */}
            <div className="flex items-center gap-2">
              {/* Audio Controls */}
              <div className="flex items-center gap-1 bg-gray-100/90 dark:bg-gray-800/90 rounded-xl p-1 border border-gray-200/60 dark:border-gray-700/60 shadow-2xs">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePlayPause}
                  className={cn(
                    "h-8 w-8 p-0 transition-all rounded-lg",
                    isPlaying
                      ? "text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 hover:bg-emerald-200"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  )}
                  title={isPlaying ? "Pause audio" : "Play audio"}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4 fill-current" />
                  ) : (
                    <Play className="h-4 w-4 fill-current ml-0.5" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                  className={cn(
                    "h-8 w-8 p-0 rounded-lg",
                    isMuted
                      ? "text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  )}
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>

                {/* Volume Slider - Desktop */}
                <div className="hidden sm:flex items-center gap-2 w-20 px-1">
                  <Slider
                    value={[isMuted ? 0 : volumePercent]}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={5}
                    className="flex-1 cursor-pointer"
                    disabled={isMuted}
                  />
                </div>
              </div>

              {/* Font Size Adjuster */}
              <div className="hidden xs:flex items-center gap-1 bg-gray-100/90 dark:bg-gray-800/90 rounded-xl p-1 border border-gray-200/60 dark:border-gray-700/60 shadow-2xs">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => adjustFontSize(false)}
                  disabled={fontSize <= 12}
                  className="h-7 w-7 p-0 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 rounded-lg"
                  title="Decrease font size"
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <span className="text-xs text-gray-700 dark:text-gray-300 min-w-7 text-center font-bold select-none">
                  {fontSize}px
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => adjustFontSize(true)}
                  disabled={fontSize >= 32}
                  className="h-7 w-7 p-0 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 rounded-lg"
                  title="Increase font size"
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>

              {/* Dark Mode Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className={cn(
                  "h-9 w-9 p-0 rounded-xl transition-all border border-transparent shadow-2xs",
                  isDarkMode
                    ? "text-amber-400 bg-amber-950/40 hover:bg-amber-950/70 border-amber-800/50"
                    : "text-gray-700 bg-gray-100 hover:bg-gray-200 border-gray-200"
                )}
                title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content - Scrollable */}
        <main className="flex-1 overflow-y-auto bg-slate-50/60 dark:bg-gray-950/60 scroll-smooth">
          <div className="container mx-auto px-4 py-6 max-w-4xl">
            {React.Children.map(children, (child) =>
              React.isValidElement<ChildProps>(child)
                ? React.cloneElement(child, {
                    fontSize: fontSize,
                    isPlaying,
                    onPlayPause: togglePlayPause,
                    volume: isMuted ? 0 : volume,
                  })
                : child
            )}
          </div>
        </main>

        {/* Navigation Footer */}
        <footer className="sticky bottom-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200/80 dark:border-gray-800/80 shadow-lg z-20">
          <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => handleNavigate(-1)}
              disabled={!currentSurahId || currentSurahId <= 1}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950 font-medium transition-all disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden xs:inline">Previous Surah</span>
            </Button>

            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="px-4 py-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors text-sm"
            >
              All Surahs
            </Button>

            <Button
              variant="outline"
              onClick={() => handleNavigate(1)}
              disabled={!currentSurahId || currentSurahId >= 114}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950 font-medium transition-all disabled:opacity-40"
            >
              <span className="hidden xs:inline">Next Surah</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default SurahLayout;
