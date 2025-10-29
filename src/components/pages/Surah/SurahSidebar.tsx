"use client";

import React, { useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { TChapterData } from "@/types/surah";

interface SurahSidebarProps {
  chapters: TChapterData[];
  isOpen: boolean;
  onToggle: () => void;
  isLoading?: boolean;
  isCollapsed: boolean;
  onCollapse: () => void;
}

const SurahSidebar: React.FC<SurahSidebarProps> = ({
  chapters,
  isOpen,
  onToggle,
  isLoading,
  isCollapsed,
  onCollapse,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

  // Get current surah ID from pathname
  const currentSurahId = pathname.startsWith("/surah/")
    ? parseInt(pathname.split("/")[2])
    : null;

  // Filter chapters based on search
  const filteredChapters = useMemo(() => {
    if (!searchQuery.trim() || !Array.isArray(chapters)) return chapters;

    const query = searchQuery.toLowerCase();
    return chapters.filter(
      (chapter) =>
        chapter.surahName?.toLowerCase().includes(query) ||
        chapter.surahNameArabic?.includes(searchQuery) ||
        chapter.surahNameTranslation?.toLowerCase().includes(query)
    );
  }, [chapters, searchQuery]);

  const handleSurahClick = (chapterId: number) => {
    router.push(`/surah/${chapterId}`);
  };

  // Skeleton Loader
  const SkeletonItem = () => (
    <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 h-screen z-50 lg:z-20",
          "bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700",
          "transition-all duration-300 ease-in-out",
          "flex flex-col",
          isCollapsed ? "w-20" : "w-80",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Sidebar Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="p-4">
            {!isCollapsed ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    <h2 className="font-bold text-gray-900 dark:text-white">
                      Surahs
                    </h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onCollapse}
                    className="h-8 w-8 p-0 hidden lg:flex"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search surah..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-10 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                  />
                </div>

                {/* Results Count */}
                {searchQuery && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {filteredChapters?.length || 0} surah(s) found
                  </p>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCollapse}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-950 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Surah List */}
        <ScrollArea className="flex-1">
          <div className={cn("p-4 space-y-2", isCollapsed && "px-2")}>
            {isLoading ? (
              <>
                {[...Array(10)].map((_, i) => (
                  <SkeletonItem key={i} />
                ))}
              </>
            ) : filteredChapters && filteredChapters.length > 0 ? (
              filteredChapters.map((surah, index) => {
                const isActive = currentSurahId === index + 1;

                return (
                  <button
                    key={index}
                    onClick={() => handleSurahClick(index + 1)}
                    className={cn(
                      "w-full p-3 rounded-lg border transition-all duration-200",
                      "hover:shadow-md hover:scale-[1.02] group",
                      "text-left relative overflow-hidden",
                      isActive
                        ? "bg-linear-to-r from-teal-50 to-emerald-50 dark:from-teal-950 dark:to-emerald-950 border-teal-300 dark:border-teal-700 shadow-sm"
                        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-teal-200 dark:hover:border-teal-800",
                      isCollapsed && "p-2"
                    )}
                  >
                    {/* Active Indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-teal-500 to-emerald-500"></div>
                    )}

                    {!isCollapsed ? (
                      <div className="flex items-center gap-3">
                        {/* Surah Number Badge */}
                        <div
                          className={cn(
                            "shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm transition-colors",
                            isActive
                              ? "bg-linear-to-br from-teal-500 to-emerald-500 text-white shadow-md"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 group-hover:bg-teal-50 dark:group-hover:bg-teal-950"
                          )}
                        >
                          {index + 1}
                        </div>

                        {/* Surah Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h3
                              className={cn(
                                "font-semibold text-sm truncate transition-colors",
                                isActive
                                  ? "text-teal-700 dark:text-teal-300"
                                  : "text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400"
                              )}
                            >
                              {surah.surahName}
                            </h3>
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                surah.revelationPlace.toLowerCase() === "mecca"
                                  ? "bg-amber-100 text-amber-700 border border-amber-200"
                                  : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                              }`}
                            >
                              {surah.revelationPlace}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {surah.surahNameTranslation}
                            </p>
                            <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
                              {surah.totalAyah} verses
                            </span>
                          </div>

                          {/* Arabic Name */}
                          <p
                            className="text-lg font-amiri text-gray-700 dark:text-gray-300 text-right mt-1"
                            dir="rtl"
                          >
                            {surah.surahNameArabic}
                          </p>
                        </div>
                      </div>
                    ) : (
                      // Collapsed View
                      <div className="flex flex-col items-center gap-1">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-lg flex items-center justify-center font-bold transition-colors",
                            isActive
                              ? "bg-linear-to-br from-teal-500 to-emerald-500 text-white shadow-md"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                          )}
                        >
                          {index + 1}
                        </div>
                        {isActive && (
                          <div className="w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                        )}
                      </div>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="text-center py-8">
                <Search className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No surahs found
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </aside>
    </>
  );
};

export default SurahSidebar;
