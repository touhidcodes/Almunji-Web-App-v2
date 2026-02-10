"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FEATURED_BOOKS } from "@/lib/demoBookData";
import { TLibraryBook } from "@/types/book";
import {
  Award,
  Bookmark,
  BookOpen,
  Clock,
  Crown,
  Download,
  Eye,
  FileText,
  Filter,
  Globe,
  Grid3X3,
  Headphones,
  Heart,
  Languages,
  Lightbulb,
  List,
  Moon,
  Play,
  Search,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  X,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";

// Type definitions for better type safety

interface Category {
  name: string;
  count: number;
  icon: any;
}

// Extracted constants for better maintainability
const CATEGORIES: Category[] = [
  { name: "All", count: 324, icon: BookOpen },
  { name: "Quran & Tafseer", count: 45, icon: Crown },
  { name: "Hadith Collections", count: 38, icon: Shield },
  { name: "Islamic History", count: 42, icon: Globe },
  { name: "Arabic Language", count: 36, icon: Languages },
  { name: "Fiqh & Jurisprudence", count: 29, icon: Award },
  { name: "Spirituality & Ethics", count: 31, icon: Heart },
  { name: "Biography & Seerah", count: 28, icon: Star },
  { name: "Islamic Finance", count: 18, icon: TrendingUp },
  { name: "Contemporary Issues", count: 22, icon: Lightbulb },
  { name: "Children's Books", count: 35, icon: Moon },
];

const FORMATS = ["All", "PDF", "Audio Book", "Interactive", "Video"];

const LIBRARY_STATS = [
  { number: "324+", label: "Islamic Books", icon: BookOpen },
  { number: "150+", label: "Audio Books", icon: Headphones },
  { number: "50+", label: "Interactive Texts", icon: Play },
  { number: "25+", label: "Languages", icon: Languages },
];

const RECENTLY_ADDED = [
  {
    title: "Principles of Islamic Jurisprudence",
    author: "Dr. Mohammad Hashim Kamali",
    category: "Fiqh",
    date: "3 days ago",
  },
  {
    title: "Women in Islam",
    author: "Dr. Jamal Badawi",
    category: "Contemporary Issues",
    date: "1 week ago",
  },
  {
    title: "The Prophet's Prayer Described",
    author: "Shaykh Al-Albani",
    category: "Spirituality",
    date: "2 weeks ago",
  },
];

// Extracted BookCard component for better organization
const BookCard = ({
  book,
  viewMode,
}: {
  book: TLibraryBook;
  viewMode: string;
}) => {
  const formatIcon = {
    "Audio Book": Headphones,
    Interactive: Play,
    PDF: FileText,
    Video: Play,
  }[book.format];

  const FormatIcon = formatIcon || FileText;

  return (
    <Card
      className={`group border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white rounded-3xl overflow-hidden ${
        viewMode === "list" ? "flex" : ""
      }`}
    >
      <div
        className={`relative ${viewMode === "list" ? "w-48 shrink-0" : "h-64"}`}
      >
        <div className="h-full bg-linear-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
          <BookOpen className="h-12 w-12 text-white opacity-80 group-hover:scale-110 transition-transform duration-300" />
        </div>

        {book.badge && (
          <div className="absolute top-4 left-4">
            <span
              className={`px-3 py-1 bg-linear-to-r ${book.badgeColor} text-white text-xs font-bold rounded-full shadow-lg`}
            >
              <Crown className="inline h-3 w-3 mr-1" />
              {book.badge}
            </span>
          </div>
        )}

        <div className="absolute top-4 right-4 flex space-x-2">
          <div
            className="bg-white/90 backdrop-blur-sm p-1.5 rounded-full"
            aria-label={`Format: ${book.format}`}
          >
            <FormatIcon className="h-4 w-4 text-emerald-600" />
          </div>
        </div>
      </div>

      <CardContent className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
            {book.category}
          </span>
          <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
            {book.format}
          </span>
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
            {book.difficulty}
          </span>
        </div>

        <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-emerald-600 transition-colors duration-300 line-clamp-2">
          {book.title}
        </h3>

        <p className="text-sm text-slate-500 mb-3">By {book.author}</p>

        <p className="text-slate-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {book.description}
        </p>

        <div className="grid grid-cols-2 gap-4 text-sm text-slate-500 mb-4">
          <div className="flex items-center gap-1">
            <FileText className="h-4 w-4 shrink-0" />
            <span>{book.pages} pages</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="h-4 w-4 shrink-0" />
            <span>{book.downloads.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 shrink-0" />
            <span>{book.readTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-amber-400 fill-current shrink-0" />
            <span>
              {book.rating} ({book.reviews})
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 text-xs text-slate-600">
          <span>{book.language}</span>
          <span>{book.fileSize}</span>
        </div>

        <div className="flex gap-2">
          <Button
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            aria-label={`Download ${book.title}`}
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button
            variant="outline"
            className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 rounded-full"
            aria-label={`Preview ${book.title}`}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 rounded-full"
            aria-label={`Bookmark ${book.title}`}
          >
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const LibraryPage = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedFormat, setSelectedFormat] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Memoized filtered books for performance
  const filteredBooks = useMemo(() => {
    return FEATURED_BOOKS.filter((book) => {
      const categoryMatch =
        selectedCategory === "All" || book.category === selectedCategory;
      const formatMatch =
        selectedFormat === "All" || book.format === selectedFormat;
      const searchMatch =
        searchQuery === "" ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.description.toLowerCase().includes(searchQuery.toLowerCase());

      return categoryMatch && formatMatch && searchMatch;
    });
  }, [selectedCategory, selectedFormat, searchQuery]);

  // Callback handlers for better performance
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedCategory(e.target.value);
    },
    []
  );

  const handleFormatChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedFormat(e.target.value);
    },
    []
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-emerald-400 to-teal-500 rounded-full mb-8 shadow-xl">
            <BookOpen className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6 leading-tight">
            Islamic <span className="text-emerald-600">Digital Library</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Access our comprehensive collection of authentic Islamic texts,
            audio books, and interactive resources. From classical works to
            contemporary scholarship.
          </p>

          {/* Enhanced Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <label htmlFor="search-books" className="sr-only">
                Search books, authors, topics
              </label>
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
              <input
                id="search-books"
                type="text"
                placeholder="Search books, authors, topics..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-12 pr-24 py-4 bg-white rounded-full shadow-lg border border-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-24 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
              <Button className="absolute right-2 top-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-full">
                Search
              </Button>
            </div>
            {searchQuery && (
              <p className="text-sm text-slate-600 mt-2">
                Found {filteredBooks.length} book
                {filteredBooks.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>

        {/* Library Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {LIBRARY_STATS.map((stat, index) => (
            <Card
              key={index}
              className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white rounded-2xl overflow-hidden group"
            >
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-linear-to-br from-emerald-100 to-teal-100 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-3xl font-bold text-slate-800 mb-2">
                  {stat.number}
                </h3>
                <p className="text-slate-600 font-medium">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filter and View Controls */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-slate-600" />
                <span className="font-semibold text-slate-700">Filter by:</span>
              </div>

              <div>
                <label htmlFor="category-filter" className="sr-only">
                  Filter by category
                </label>
                <select
                  id="category-filter"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category.name} value={category.name}>
                      {category.name} ({category.count})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="format-filter" className="sr-only">
                  Filter by format
                </label>
                <select
                  id="format-filter"
                  value={selectedFormat}
                  onChange={handleFormatChange}
                  className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {FORMATS.map((format) => (
                    <option key={format} value={format}>
                      {format}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600 mr-2">View:</span>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-full"
                aria-label="Grid view"
                aria-pressed={viewMode === "grid"}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-full"
                aria-label="List view"
                aria-pressed={viewMode === "list"}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Active filters display */}
          {(selectedCategory !== "All" || selectedFormat !== "All") && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200">
              <span className="text-sm text-slate-600">Active filters:</span>
              {selectedCategory !== "All" && (
                <button
                  onClick={() => setSelectedCategory("All")}
                  className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-full flex items-center gap-1 hover:bg-emerald-200 transition-colors"
                >
                  {selectedCategory}
                  <X className="h-3 w-3" />
                </button>
              )}
              {selectedFormat !== "All" && (
                <button
                  onClick={() => setSelectedFormat("All")}
                  className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full flex items-center gap-1 hover:bg-blue-200 transition-colors"
                >
                  {selectedFormat}
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Recently Added Section */}
        <Card className="bg-linear-to-br from-emerald-600 to-teal-700 text-white shadow-xl rounded-3xl overflow-hidden mb-12">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center">
                <Sparkles className="h-6 w-6 mr-3" />
                Recently Added
              </h2>
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 rounded-full"
              >
                View All
              </Button>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {RECENTLY_ADDED.map((book, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <h3 className="font-semibold text-white mb-2 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-emerald-100 text-sm mb-2">
                    By {book.author}
                  </p>
                  <div className="flex justify-between items-center text-xs text-emerald-200">
                    <span className="px-2 py-1 bg-white/20 rounded-full">
                      {book.category}
                    </span>
                    <span>{book.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Books Grid/List */}
        {filteredBooks.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
                : "space-y-6 mb-16"
            }
          >
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} viewMode={viewMode} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 mb-16">
            <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-700 mb-2">
              No books found
            </h3>
            <p className="text-slate-500 mb-6">
              Try adjusting your filters or search query
            </p>
            <Button
              onClick={() => {
                setSelectedCategory("All");
                setSelectedFormat("All");
                setSearchQuery("");
              }}
              variant="outline"
              className="rounded-full"
            >
              Clear all filters
            </Button>
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-white py-16 px-8 rounded-3xl shadow-xl text-center">
          <Shield className="h-16 w-16 text-emerald-600 mx-auto mb-8" />
          <h2 className="text-4xl font-bold text-slate-800 mb-6">
            Expand Your{" "}
            <span className="text-emerald-600">Islamic Knowledge</span>
          </h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Access thousands of authentic Islamic texts, from classical works to
            modern scholarship. Build your personal digital Islamic library
            today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300">
              Browse Full Collection
              <BookOpen className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300"
            >
              Request a Book
              <Heart className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryPage;
