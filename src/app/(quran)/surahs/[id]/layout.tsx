"use client";

import SurahSidebar from "@/components/pages/Surah/SurahSidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Settings,
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
  const { isPlaying, volume, fontSize } = useSelector(
    (state: RootState) => state.player
  );

  // Local state (non-player related)
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const { data: chaptersData = [], isLoading } = useGetChaptersQuery({});

  // Get current surah info from pathname
  const currentSurahId = pathname.startsWith("/surahs/")
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
      ? Math.min(28, fontSize + 2)
      : Math.max(12, fontSize - 2);
    dispatch(setFontSize(newSize));
  };

  const handleVolumeChange = (value: number[]) => {
    dispatch(setVolume(value[0] / 100)); // Convert to 0-1 range
  };

  const handleNavigate = (direction: number) => {
    if (!currentSurahId) return;

    const newSurahId = currentSurahId + direction;
    if (newSurahId >= 1 && newSurahId <= 114) {
      router.push(`/surahs/${newSurahId}`);
    }
  };

  // Convert volume to percentage for display
  const volumePercent = Math.round(volume * 100);

  return (
    <div className="flex h-screen overflow-hidden bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
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
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Left side */}
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="h-9 w-9 p-0 lg:hidden hover:bg-teal-50 dark:hover:bg-teal-950"
              >
                {isSidebarOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
              {/* Nav Links - Show only on large devices */}
              <nav className="hidden lg:flex items-center gap-4 mr-2">
                <button
                  onClick={() => router.push("/")}
                  className={cn(
                    "text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors",
                    pathname === "/" &&
                      "text-teal-600 dark:text-teal-400 font-semibold"
                  )}
                >
                  Home
                </button>
                <button
                  onClick={() => router.push("/dictionary")}
                  className={cn(
                    "text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors",
                    pathname.startsWith("/dictionary") &&
                      "text-teal-600 dark:text-teal-400 font-semibold"
                  )}
                >
                  Dictionary
                </button>
              </nav>
              {/* Current Surah Info */}
              {currentSurah && (
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className="font-semibold border-2 border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950 px-3"
                  >
                    {currentSurah.id}
                  </Badge>
                  <Separator
                    orientation="vertical"
                    className="h-8 hidden sm:block"
                  />
                  <div className="hidden sm:block">
                    <h2 className="font-bold text-gray-900 dark:text-white">
                      {currentSurah.surahName}
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {currentSurah.surahNameTranslation} •{" "}
                      {currentSurah.totalAyah} verses
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Audio Controls */}
              <div className="hidden md:flex items-center gap-2 mr-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg px-2 py-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePlayPause}
                  className={cn(
                    "h-8 w-8 p-0 transition-all",
                    isPlaying
                      ? "text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 hover:bg-teal-100"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  )}
                  title={isPlaying ? "Pause full surah" : "Play full surah"}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                  className={cn(
                    "h-8 w-8 p-0",
                    isMuted
                      ? "text-red-500 dark:text-red-400 hover:bg-red-50"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  )}
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>

                {/* Volume Control - Desktop */}
                <div className="hidden lg:flex items-center gap-2 w-24 ml-1">
                  <Slider
                    value={[volumePercent]}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={5}
                    className="flex-1"
                    disabled={isMuted}
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-8 text-right font-medium">
                    {volumePercent}%
                  </span>
                </div>
              </div>

              {/* Font Size Controls - Desktop */}
              <div className="hidden sm:flex items-center gap-1 mr-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => adjustFontSize(false)}
                  disabled={fontSize <= 12}
                  className="h-7 w-7 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
                  title="Decrease font size"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="text-xs text-gray-700 dark:text-gray-300 min-w-10 text-center font-semibold">
                  {fontSize}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => adjustFontSize(true)}
                  disabled={fontSize >= 28}
                  className="h-7 w-7 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
                  title="Increase font size"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              {/* Dark Mode Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className={cn(
                  "h-9 w-9 p-0 transition-all",
                  isDarkMode
                    ? "text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-950"
                    : "text-gray-600 hover:bg-gray-100"
                )}
                title={
                  isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>

              {/* Settings Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 hover:bg-teal-50 dark:hover:bg-teal-950"
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <DropdownMenuLabel className="flex items-center gap-2 text-base">
                    <Settings className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                    Reading Settings
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {/* Mobile Font Size Control */}
                  <div className="sm:hidden px-3 py-3">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium">Font Size</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-medium">
                        {fontSize}px
                      </span>
                    </div>
                    <Slider
                      value={[fontSize]}
                      onValueChange={(value) => dispatch(setFontSize(value[0]))}
                      min={12}
                      max={28}
                      step={2}
                    />
                  </div>

                  <DropdownMenuSeparator className="sm:hidden" />

                  {/* Mobile Audio Controls */}
                  <div className="md:hidden space-y-3 px-3 py-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Audio Controls
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={togglePlayPause}
                          className="h-8 w-8 p-0"
                        >
                          {isPlaying ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={toggleMute}
                          className="h-8 w-8 p-0"
                        >
                          {isMuted ? (
                            <VolumeX className="h-4 w-4" />
                          ) : (
                            <Volume2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm">Volume</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-medium">
                        {volumePercent}%
                      </span>
                    </div>
                    <Slider
                      value={[volumePercent]}
                      onValueChange={handleVolumeChange}
                      max={100}
                      step={5}
                      disabled={isMuted}
                    />
                  </div>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={toggleDarkMode}
                    className="cursor-pointer"
                  >
                    {isDarkMode ? (
                      <>
                        <Sun className="mr-2 h-4 w-4 text-yellow-500" />
                        Switch to Light Mode
                      </>
                    ) : (
                      <>
                        <Moon className="mr-2 h-4 w-4" />
                        Switch to Dark Mode
                      </>
                    )}
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={toggleSidebar}
                    className="cursor-pointer lg:hidden"
                  >
                    <Menu className="mr-2 h-4 w-4" />
                    {isSidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Content - Scrollable with proper padding for footer */}
        <main className="flex-1 overflow-y-auto bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4 py-6 max-w-4xl">
            {/* Pass props to children */}
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
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-20">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => handleNavigate(-1)}
              disabled={!currentSurahId || currentSurahId <= 1}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              All Surahs
            </button>

            <button
              onClick={() => handleNavigate(1)}
              disabled={!currentSurahId || currentSurahId >= 114}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurahLayout;
