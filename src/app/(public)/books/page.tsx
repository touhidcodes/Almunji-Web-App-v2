"use client";

import { books } from "@/lib/demoBookData";
import {
  BookOpen,
  Download,
  Eye,
  Filter,
  Grid,
  List,
  Search,
  Sparkles,
  Star,
  TrendingUp,
  X,
} from "lucide-react";
import { useState } from "react";

export default function BooksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("popular");

  const categories = [
    "all",
    "tafsir",
    "hadith",
    "translation",
    "fiqh",
    "biography",
  ];
  const languages = ["all", "english", "arabic", "urdu"];

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || book.category === selectedCategory;
    const matchesLanguage =
      selectedLanguage === "all" || book.language === selectedLanguage;
    return matchesSearch && matchesCategory && matchesLanguage;
  });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortBy === "popular") return b.downloads - a.downloads;
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "pages") return b.pages - a.pages;
    return 0;
  });

  const activeFiltersCount = [
    selectedCategory !== "all",
    selectedLanguage !== "all",
    searchQuery !== "",
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedLanguage("all");
  };

  const mostPopular = books.sort((a, b) => b.downloads - a.downloads)[0];

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Hero Header */}
      <div className="bg-linear-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
                  <BookOpen className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold tracking-tight">
                    Islamic Library
                  </h1>
                  <p className="text-emerald-100 mt-1 text-lg">
                    Your gateway to authentic Islamic knowledge
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-6 text-center">
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl">
                <div className="text-3xl font-bold">{books.length}</div>
                <div className="text-emerald-100 text-sm">Books</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl">
                <div className="text-3xl font-bold">
                  {(
                    books.reduce((sum, b) => sum + b.downloads, 0) / 1000
                  ).toFixed(0)}
                  K
                </div>
                <div className="text-emerald-100 text-sm">Downloads</div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-3xl">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
            <input
              type="text"
              placeholder="Search for books, authors, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-4 py-6 text-lg bg-white text-gray-900 shadow-xl border-0 rounded-2xl focus:ring-4 focus:ring-white/30 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white shadow-md border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "all"
                        ? "All Categories"
                        : cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>

              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="appearance-none px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang === "all"
                      ? "All Languages"
                      : lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </option>
                ))}
              </select>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-10 pr-8 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="pages">Most Pages</option>
                </select>
                <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>

              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-3 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear ({activeFiltersCount})
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">View:</span>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 ${
                    viewMode === "grid"
                      ? "bg-emerald-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  } transition-colors`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 ${
                    viewMode === "list"
                      ? "bg-emerald-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  } transition-colors`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-2 rounded-lg">
              <BookOpen className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Showing Results</p>
              <p className="font-bold text-gray-900">
                {sortedBooks.length} of {books.length} books
              </p>
            </div>
          </div>

          {mostPopular && (
            <div className="flex items-center gap-3 bg-linear-to-r from-emerald-50 to-teal-50 px-4 py-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-xs text-gray-500">Most Popular</p>
                <p className="font-semibold text-gray-900 text-sm">
                  {mostPopular.title}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Books Display */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedBooks.map((book) => (
              <div
                key={book.id}
                className="group overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-500 bg-white rounded-lg relative"
              >
                <div className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  {book.isPremium && (
                    <div className="absolute top-3 right-3 bg-linear-to-r from-amber-400 via-yellow-500 to-amber-500 text-white px-2 py-1 rounded-md text-xs font-semibold shadow-lg z-20 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Premium
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition-colors mb-1 line-clamp-1">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-600 font-medium mb-3">
                    by {book.author}
                  </p>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                    {book.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                      {book.category}
                    </span>
                    <span className="px-2 py-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded">
                      {book.language}
                    </span>
                    <span className="px-2 py-1 text-xs bg-gray-50 text-gray-700 border border-gray-200 rounded">
                      {book.pages}p
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="flex items-center gap-1.5 bg-yellow-50 px-2 py-1 rounded-full">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-gray-900">
                        {book.rating}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Download className="w-4 h-4 text-emerald-600" />
                      <span className="font-medium">
                        {(book.downloads / 1000).toFixed(1)}K
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      <Eye className="w-4 h-4" />
                      Read Now
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 border border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      <Download className="w-4 h-4" />
                      Save
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-5">
            {sortedBooks.map((book) => (
              <div
                key={book.id}
                className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden bg-white rounded-lg"
              >
                <div className="flex p-5 gap-5">
                  <div className="relative shrink-0">
                    <div className="relative overflow-hidden rounded-lg">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-28 h-40 object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                      {book.isPremium && (
                        <div className="absolute -top-2 -right-2 bg-linear-to-r from-amber-400 via-yellow-500 to-amber-500 text-white px-2 py-1 rounded text-xs font-semibold shadow-lg z-10 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Premium
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors cursor-pointer mb-1">
                          {book.title}
                        </h3>
                        <p className="text-sm text-gray-600 font-medium">
                          by {book.author}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-sm ml-4">
                        <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-full">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold text-gray-900">
                            {book.rating}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Download className="w-4 h-4 text-emerald-600" />
                          <span className="font-medium">
                            {book.downloads.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                      {book.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                          {book.category}
                        </span>
                        <span className="px-2 py-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded">
                          {book.language}
                        </span>
                        <span className="px-2 py-1 text-xs bg-gray-50 text-gray-700 border border-gray-200 rounded">
                          {book.pages} pages
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                          <Eye className="w-4 h-4" />
                          Read Now
                        </button>
                        <button className="flex items-center justify-center border border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-lg transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {sortedBooks.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-md">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              No books found
            </h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search criteria or filters
            </p>
            <button
              onClick={clearFilters}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
