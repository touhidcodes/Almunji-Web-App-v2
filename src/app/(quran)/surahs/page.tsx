"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { useGetChaptersQuery } from "@/redux/api/quranApi";
import { TChapterData } from "@/types/surah";
import { useRouter } from "next/navigation";
import Navbar from "@/components/shared/Navbar/Navbar";

const SurahsPage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterPlace, setFilterPlace] = useState<string>("all");
  const { data: chaptersData, isLoading, error } = useGetChaptersQuery({});

  // Filter chapters based on search query and place filter
  const filteredChapters = Array.isArray(chaptersData)
    ? chaptersData.filter((chapter: TChapterData) => {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          chapter.surahName.toLowerCase().includes(query) ||
          chapter.surahNameArabic.includes(searchQuery) ||
          chapter.surahNameTranslation.toLowerCase().includes(query);

        const matchesFilter =
          filterPlace === "all" ||
          chapter.revelationPlace.toLowerCase() === filterPlace.toLowerCase();

        return matchesSearch && matchesFilter;
      })
    : [];

  const handleSurahClick = (index: number) => {
    router.push(`/surahs/${index + 1}`);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilterPlace("all");
  };

  const hasActiveFilters = searchQuery !== "" || filterPlace !== "all";

  // Skeleton Loader Component
  const SkeletonCard = () => (
    <div className="relative bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-pulse">
      <div className="flex justify-between items-start mb-3">
        <div className="h-8 w-12 bg-gray-200 rounded"></div>
        <div className="text-right">
          <div className="h-4 w-16 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 w-12 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="mb-4">
        <div className="h-6 w-32 bg-gray-200 rounded mb-2"></div>
        <div className="h-8 w-full bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-40 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen relative">
        <Navbar />
        {/* BG dotted */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#d7dae0_1.5px,transparent_1px)] [bg-size:16px_16px]">
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-teal-600 opacity-20 blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Start the Journey of Enlightenment
            </h1>
          </div>

          {/* Search */}
          <div className="flex justify-center mb-6">
            <div className="relative w-full sm:w-96">
              <input
                type="text"
                placeholder="What do you want to read?"
                disabled
                className="w-full pl-4 pr-12 py-3 rounded-full border border-gray-200 bg-white"
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {/* Filter Buttons Skeleton */}
          <div className="flex justify-center gap-3 mb-6">
            <div className="h-10 w-24 bg-white rounded-full animate-pulse"></div>
            <div className="h-10 w-24 bg-white rounded-full animate-pulse"></div>
            <div className="h-10 w-24 bg-white rounded-full animate-pulse"></div>
          </div>

          {/* Skeleton Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {[...Array(12)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dotted">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-center h-96">
            <div className="text-center bg-white rounded-xl p-8 shadow-md">
              <p className="text-red-600 mb-2 font-semibold">
                Error loading Surahs
              </p>
              <p className="text-gray-600 text-sm">Please try again later</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <Navbar />
      {/* BG dotted */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#d7dae0_1.5px,transparent_1px)] [bg-size:16px_16px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-teal-600 opacity-20 blur-[100px]"></div>
      </div>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Start the Journey of Enlightenment
          </h1>
        </div>

        {/* Search */}
        <div className="flex justify-center mb-6">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="What do you want to read?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-12 py-3 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-3 mb-6 flex-wrap">
          <button
            onClick={() => setFilterPlace("all")}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              filterPlace === "all"
                ? "bg-teal-500 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            All Surahs
          </button>
          <button
            onClick={() => setFilterPlace("mecca")}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              filterPlace === "mecca"
                ? "bg-teal-500 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            Mecca
          </button>
          <button
            onClick={() => setFilterPlace("madina")}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              filterPlace === "madina"
                ? "bg-teal-500 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            Madina
          </button>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-6 py-2 rounded-full font-medium bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-all flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4 text-gray-600 text-sm text-center">
          Showing {filteredChapters.length} Surahs
        </div>

        {/* Surah Grid */}
        {filteredChapters.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {filteredChapters.map((chapter: TChapterData, index: number) => (
              <div
                key={index}
                onClick={() => handleSurahClick(index)}
                className="relative bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all cursor-pointer border border-gray-200 hover:border-teal-500 group overflow-hidden"
              >
                {/* Decorative Corner */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-bl from-teal-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>

                {/* Top Section */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-linear-to-br from-teal-500 to-teal-600 text-white font-bold text-lg shadow-md">
                    {index + 1}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-600">
                        {chapter.totalAyah} verses
                      </span>
                    </div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        chapter.revelationPlace.toLowerCase() === "mecca"
                          ? "bg-amber-100 text-amber-700 border border-amber-200"
                          : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      {chapter.revelationPlace}
                    </span>
                  </div>
                </div>

                {/* Surah Names */}
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-teal-600 transition-colors">
                    {chapter.surahName}
                  </h3>
                  <p
                    className="text-3xl font-amiri text-gray-700 leading-loose text-right"
                    dir="rtl"
                  >
                    {chapter.surahNameArabic}
                  </p>
                  <p className="text-sm text-gray-500 italic">
                    {chapter.surahNameTranslation}
                  </p>
                </div>

                {/* Bottom Accent Line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-teal-500 to-teal-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <div className="text-gray-400 mb-2">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <p className="text-gray-600 font-medium">
              No Surahs found matching your search
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 px-6 py-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SurahsPage;
