"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Search,
  Filter,
  Download,
  Eye,
  Star,
  Clock,
  Grid3X3,
  List,
  Heart,
  Bookmark,
  Play,
  Headphones,
  FileText,
  Crown,
  Shield,
  Globe,
  Award,
  Lightbulb,
  Moon,
  Sparkles,
  TrendingUp,
  Calendar,
  Languages,
} from "lucide-react";

const LibraryPage = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedFormat, setSelectedFormat] = useState("All");

  const categories = [
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

  const formats = ["All", "PDF", "Audio Book", "Interactive", "Video"];

  const featuredBooks = [
    {
      id: 1,
      title: "Tafseer Ibn Kathir - Complete",
      author: "Imam Ibn Kathir",
      category: "Quran & Tafseer",
      format: "PDF",
      pages: 4628,
      downloads: 15420,
      rating: 4.9,
      reviews: 1234,
      language: "Arabic/English",
      publishYear: "Classical",
      description:
        "Complete commentary on the Holy Quran by the renowned Islamic scholar Ibn Kathir. Includes detailed explanations of verses with historical context.",
      cover: "tafseer-cover",
      badge: "Classical Text",
      badgeColor: "from-emerald-500 to-teal-600",
      fileSize: "45 MB",
      difficulty: "Advanced",
      readTime: "200+ hours",
    },
    {
      id: 2,
      title: "Sahih Al-Bukhari Collection",
      author: "Imam Al-Bukhari",
      category: "Hadith Collections",
      format: "Interactive",
      pages: 3200,
      downloads: 12340,
      rating: 4.9,
      reviews: 987,
      language: "Arabic/English/Urdu",
      publishYear: "Classical",
      description:
        "The most authentic collection of Hadith with searchable interface and detailed chain of narration analysis.",
      cover: "bukhari-cover",
      badge: "Most Authentic",
      badgeColor: "from-amber-500 to-orange-600",
      fileSize: "38 MB",
      difficulty: "Intermediate",
      readTime: "150+ hours",
    },
    {
      id: 3,
      title: "The Sealed Nectar (Ar-Raheeq Al-Makhtum)",
      author: "Safiur Rahman Mubarakpuri",
      category: "Biography & Seerah",
      format: "PDF",
      pages: 635,
      downloads: 28950,
      rating: 4.8,
      reviews: 2156,
      language: "English",
      publishYear: "1979",
      description:
        "Award-winning biography of Prophet Muhammad (PBUH) that won first prize in a worldwide competition on the Prophet's biography.",
      cover: "sealed-nectar",
      badge: "Award Winner",
      badgeColor: "from-purple-500 to-violet-600",
      fileSize: "12 MB",
      difficulty: "Beginner",
      readTime: "25 hours",
    },
    {
      id: 4,
      title: "Arabic Grammar for Beginners",
      author: "Dr. Abdur Rahman",
      category: "Arabic Language",
      format: "Interactive",
      pages: 420,
      downloads: 8760,
      rating: 4.7,
      reviews: 543,
      language: "English/Arabic",
      publishYear: "2020",
      description:
        "Modern approach to learning Arabic grammar with interactive exercises and pronunciation guides.",
      cover: "arabic-grammar",
      badge: "Interactive",
      badgeColor: "from-blue-500 to-indigo-600",
      fileSize: "25 MB",
      difficulty: "Beginner",
      readTime: "40 hours",
    },
    {
      id: 5,
      title: "Fortress of the Muslim (Hisn al-Muslim)",
      author: "Sa'id ibn Ali ibn Wahf Al-Qahtani",
      category: "Spirituality & Ethics",
      format: "Audio Book",
      pages: 245,
      downloads: 19870,
      rating: 4.9,
      reviews: 1678,
      language: "Arabic/English",
      publishYear: "1988",
      description:
        "Collection of authentic supplications and dhikr from the Quran and Sunnah for daily spiritual practice.",
      cover: "fortress-muslim",
      badge: "Daily Practice",
      badgeColor: "from-green-500 to-emerald-600",
      fileSize: "15 MB",
      difficulty: "Beginner",
      readTime: "8 hours",
    },
    {
      id: 6,
      title: "Islamic Finance Fundamentals",
      author: "Dr. Omar Al-Muamalat",
      category: "Islamic Finance",
      format: "PDF",
      pages: 380,
      downloads: 4560,
      rating: 4.6,
      reviews: 298,
      language: "English",
      publishYear: "2023",
      description:
        "Comprehensive guide to Islamic banking, finance, and investment principles in the modern world.",
      cover: "islamic-finance",
      badge: "Modern",
      badgeColor: "from-cyan-500 to-blue-600",
      fileSize: "18 MB",
      difficulty: "Intermediate",
      readTime: "30 hours",
    },
  ];

  const libraryStats = [
    { number: "324+", label: "Islamic Books", icon: BookOpen },
    { number: "150+", label: "Audio Books", icon: Headphones },
    { number: "50+", label: "Interactive Texts", icon: Play },
    { number: "25+", label: "Languages", icon: Languages },
  ];

  const recentlyAdded = [
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

  const filteredBooks = featuredBooks.filter((book) => {
    const categoryMatch =
      selectedCategory === "All" || book.category === selectedCategory;
    const formatMatch =
      selectedFormat === "All" || book.format === selectedFormat;
    return categoryMatch && formatMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full mb-8 shadow-xl">
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

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search books, authors, topics..."
                className="w-full pl-12 pr-4 py-4 bg-white rounded-full shadow-lg border border-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg"
              />
              <Button className="absolute right-2 top-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-full">
                Search
              </Button>
            </div>
          </div>
        </div>

        {/* Library Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {libraryStats.map((stat, index) => (
            <Card
              key={index}
              className="text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white rounded-2xl overflow-hidden group"
            >
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
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
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-slate-600" />
                <span className="font-semibold text-slate-700">Filter by:</span>
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {categories.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>

              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {formats.map((format) => (
                  <option key={format} value={format}>
                    {format}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-full"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-full"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Recently Added Section */}
        <Card className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-xl rounded-3xl overflow-hidden mb-12">
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
              {recentlyAdded.map((book, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
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
        <div
          className={
            viewMode === "grid"
              ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
              : "space-y-6 mb-16"
          }
        >
          {filteredBooks.map((book) => (
            <Card
              key={book.id}
              className={`group border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white rounded-3xl overflow-hidden ${
                viewMode === "list" ? "flex" : ""
              }`}
            >
              <div
                className={`relative ${
                  viewMode === "list" ? "w-48 flex-shrink-0" : "h-64"
                }`}
              >
                <div className="h-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-white opacity-80 group-hover:scale-110 transition-transform duration-300" />
                </div>

                {book.badge && (
                  <div className="absolute top-4 left-4">
                    <span
                      className={`px-3 py-1 bg-gradient-to-r ${book.badgeColor} text-white text-xs font-bold rounded-full shadow-lg`}
                    >
                      <Crown className="inline h-3 w-3 mr-1" />
                      {book.badge}
                    </span>
                  </div>
                )}

                <div className="absolute top-4 right-4 flex space-x-2">
                  {book.format === "Audio Book" && (
                    <Headphones className="h-5 w-5 text-white" />
                  )}
                  {book.format === "Interactive" && (
                    <Play className="h-5 w-5 text-white" />
                  )}
                  {book.format === "PDF" && (
                    <FileText className="h-5 w-5 text-white" />
                  )}
                </div>
              </div>

              <CardContent
                className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}
              >
                <div className="flex items-center space-x-2 mb-3">
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                    {book.category}
                  </span>
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                    {book.format}
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
                  <div className="flex items-center space-x-1">
                    <FileText className="h-4 w-4" />
                    <span>{book.pages} pages</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Download className="h-4 w-4" />
                    <span>{book.downloads.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{book.readTime}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-amber-400 fill-current" />
                    <span>
                      {book.rating} ({book.reviews})
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-slate-600">
                    <span className="font-medium">{book.language}</span> •
                    <span className="ml-1">{book.fileSize}</span> •
                    <span className="ml-1">{book.difficulty}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 rounded-full"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 rounded-full"
                  >
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-white py-16 rounded-3xl shadow-xl text-center">
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
