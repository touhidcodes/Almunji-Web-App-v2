"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Award,
  BookMarked,
  BookOpen,
  Calendar,
  ChevronRight,
  Clock,
  Flame,
  LayoutGrid,
  List,
  Search,
  Star,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  progress: number;
  totalPages: number;
  currentPage: number;
  totalChapters?: number;
  currentChapter?: number;
  lastRead: string;
  lastReadDate: Date;
  cover: string;
  rating?: number;
  readingTime: string;
  isCompleted: boolean;
  tags: string[];
  description: string;
}

type ViewMode = "grid" | "list";
type CategoryFilter =
  | "all"
  | "hadith"
  | "tafsir"
  | "seerah"
  | "fiqh"
  | "aqidah"
  | "other";

const ReadingsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");

  const books: Book[] = [
    {
      id: "sahih-bukhari",
      title: "Sahih al-Bukhari",
      author: "Imam Muhammad al-Bukhari",
      category: "hadith",
      progress: 42,
      totalPages: 2340,
      currentPage: 983,
      totalChapters: 97,
      currentChapter: 41,
      lastRead: "2 hours ago",
      lastReadDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
      cover: "📚",
      rating: 5,
      readingTime: "12h 30m",
      isCompleted: false,
      tags: ["authentic", "hadith collection", "essential"],
      description: "The most authentic collection of Prophetic traditions",
    },
    {
      id: "tafsir-kathir",
      title: "Tafsir Ibn Kathir",
      author: "Ismail ibn Kathir",
      category: "tafsir",
      progress: 15,
      totalPages: 5430,
      currentPage: 815,
      totalChapters: 114,
      currentChapter: 17,
      lastRead: "Yesterday",
      lastReadDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
      cover: "📖",
      rating: 5,
      readingTime: "8h 15m",
      isCompleted: false,
      tags: ["tafsir", "classical", "comprehensive"],
      description: "Comprehensive commentary on the Holy Quran",
    },
    {
      id: "sealed-nectar",
      title: "The Sealed Nectar",
      author: "Safi-ur-Rahman al-Mubarakpuri",
      category: "seerah",
      progress: 88,
      totalPages: 592,
      currentPage: 521,
      totalChapters: 30,
      currentChapter: 26,
      lastRead: "3 days ago",
      lastReadDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      cover: "🏛️",
      rating: 5,
      readingTime: "24h 45m",
      isCompleted: false,
      tags: ["biography", "prophet", "award-winning"],
      description: "Biography of Prophet Muhammad (peace be upon him)",
    },
    {
      id: "riyadh-salihin",
      title: "Riyad as-Salihin",
      author: "Imam an-Nawawi",
      category: "hadith",
      progress: 100,
      totalPages: 876,
      currentPage: 876,
      totalChapters: 372,
      currentChapter: 372,
      lastRead: "1 week ago",
      lastReadDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      cover: "🌟",
      rating: 5,
      readingTime: "16h 20m",
      isCompleted: true,
      tags: ["hadith", "spirituality", "completed"],
      description: "Gardens of the Righteous - collection of hadith",
    },
    {
      id: "fiqh-sunnah",
      title: "Fiqh us-Sunnah",
      author: "Sayyid Sabiq",
      category: "fiqh",
      progress: 35,
      totalPages: 1240,
      currentPage: 434,
      totalChapters: 52,
      currentChapter: 18,
      lastRead: "5 days ago",
      lastReadDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      cover: "⚖️",
      rating: 4,
      readingTime: "5h 40m",
      isCompleted: false,
      tags: ["fiqh", "jurisprudence", "practical"],
      description: "Comprehensive guide to Islamic jurisprudence",
    },
    {
      id: "fortress-muslim",
      title: "Fortress of the Muslim",
      author: "Sa'id ibn Wahf al-Qahtani",
      category: "other",
      progress: 100,
      totalPages: 156,
      currentPage: 156,
      lastRead: "2 weeks ago",
      lastReadDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      cover: "🛡️",
      rating: 5,
      readingTime: "3h 10m",
      isCompleted: true,
      tags: ["duas", "daily", "completed"],
      description: "Collection of authentic supplications and remembrance",
    },
    {
      id: "purification-soul",
      title: "Purification of the Soul",
      author: "Ibn Rajab, Ibn al-Qayyim, al-Ghazali",
      category: "aqidah",
      progress: 62,
      totalPages: 340,
      currentPage: 211,
      totalChapters: 15,
      currentChapter: 9,
      lastRead: "4 days ago",
      lastReadDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      cover: "💎",
      rating: 5,
      readingTime: "7h 30m",
      isCompleted: false,
      tags: ["spirituality", "self-development", "classical"],
      description: "Concepts and practices for spiritual purification",
    },
    {
      id: "40-hadith",
      title: "Forty Hadith an-Nawawi",
      author: "Imam an-Nawawi",
      category: "hadith",
      progress: 100,
      totalPages: 124,
      currentPage: 124,
      lastRead: "3 weeks ago",
      lastReadDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
      cover: "📜",
      rating: 5,
      readingTime: "4h 00m",
      isCompleted: true,
      tags: ["hadith", "essential", "completed"],
      description:
        "Collection of 40 essential hadith covering Islamic principles",
    },
  ];

  const stats = {
    totalBooks: books.length,
    inProgress: books.filter((b) => !b.isCompleted).length,
    completed: books.filter((b) => b.isCompleted).length,
    totalReadingTime: books.reduce((acc, book) => {
      const [hours, minutes] = book.readingTime.split("h ");
      return acc + parseInt(hours) + parseInt(minutes) / 60;
    }, 0),
    currentStreak: 7,
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || book.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const recentlyRead = [...books]
    .sort((a, b) => b.lastReadDate.getTime() - a.lastReadDate.getTime())
    .slice(0, 3);

  const StatCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: string | number;
    subtitle: string;
    color?: string;
  }> = ({ icon, title, value, subtitle, color = "text-emerald-600" }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={color}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      </CardContent>
    </Card>
  );

  const BookCardGrid: React.FC<{ book: Book }> = ({ book }) => (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="text-5xl">{book.cover}</div>
          <div className="flex-1 space-y-1">
            <CardTitle className="text-lg leading-tight">
              {book.title}
            </CardTitle>
            <CardDescription className="text-sm">
              by {book.author}
            </CardDescription>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {book.category}
              </Badge>
              {book.isCompleted && (
                <Badge className="text-xs bg-green-500">Completed</Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {book.description}
        </p>

        {book.rating && (
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < book.rating!
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {book.totalChapters
                ? `Chapter ${book.currentChapter} of ${book.totalChapters}`
                : `Page ${book.currentPage} of ${book.totalPages}`}
            </span>
            <span className="font-medium">{book.progress}%</span>
          </div>
          <Progress value={book.progress} className="h-2" />
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {book.readingTime} read
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {book.lastRead}
          </span>
        </div>

        <div className="flex flex-wrap gap-1">
          {book.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <BookOpen className="h-4 w-4 mr-2" />
          {book.isCompleted ? "Read Again" : "Continue Reading"}
        </Button>
      </CardFooter>
    </Card>
  );

  const BookCardList: React.FC<{ book: Book }> = ({ book }) => (
    <Card className="group hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-center gap-6">
          <div className="text-5xl">{book.cover}</div>

          <div className="flex-1 min-w-0 space-y-3">
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold">{book.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    by {book.author}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{book.category}</Badge>
                  {book.isCompleted && (
                    <Badge className="bg-green-500">Completed</Badge>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-1">
                {book.description}
              </p>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <BookMarked className="h-4 w-4" />
                {book.totalChapters
                  ? `${book.currentChapter}/${book.totalChapters} chapters`
                  : `${book.currentPage}/${book.totalPages} pages`}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {book.readingTime}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {book.lastRead}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Progress value={book.progress} className="h-2" />
              </div>
              <span className="text-sm font-medium w-12 text-right">
                {book.progress}%
              </span>
            </div>
          </div>

          <Button>
            <BookOpen className="h-4 w-4 mr-2" />
            {book.isCompleted ? "Read Again" : "Continue"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-emerald-600" />
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  My Islamic Library
                </h1>
                <p className="text-sm text-muted-foreground">
                  Track your journey through Islamic knowledge
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search books..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard
            icon={<BookOpen className="h-5 w-5" />}
            title="Total Books"
            value={stats.totalBooks}
            subtitle="In your library"
          />
          <StatCard
            icon={<TrendingUp className="h-5 w-5" />}
            title="In Progress"
            value={stats.inProgress}
            subtitle="Currently reading"
            color="text-blue-600"
          />
          <StatCard
            icon={<Award className="h-5 w-5" />}
            title="Completed"
            value={stats.completed}
            subtitle="Books finished"
            color="text-green-600"
          />
          <StatCard
            icon={<Clock className="h-5 w-5" />}
            title="Reading Time"
            value={`${Math.round(stats.totalReadingTime)}h`}
            subtitle="Total time invested"
            color="text-purple-600"
          />
          <StatCard
            icon={<Flame className="h-5 w-5" />}
            title="Current Streak"
            value={`${stats.currentStreak} days`}
            subtitle="Keep it up!"
            color="text-orange-600"
          />
        </div>

        {/* Recently Read Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5 text-emerald-600" />
              Continue Reading
            </h2>
            <Button variant="ghost" size="sm">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentlyRead.map((book) => (
              <Card key={book.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-4xl">{book.cover}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{book.title}</h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {book.author}
                      </p>
                    </div>
                  </div>
                  <Progress value={book.progress} className="h-2 mb-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <span>{book.progress}% complete</span>
                    <span>{book.lastRead}</span>
                  </div>
                  <Button className="w-full" size="sm">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Continue
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <Tabs
          defaultValue="all"
          className="w-full"
          onValueChange={(val) => setCategoryFilter(val as CategoryFilter)}
        >
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="all">All Books</TabsTrigger>
              <TabsTrigger value="hadith">Hadith</TabsTrigger>
              <TabsTrigger value="tafsir">Tafsir</TabsTrigger>
              <TabsTrigger value="seerah">Seerah</TabsTrigger>
              <TabsTrigger value="fiqh">Fiqh</TabsTrigger>
              <TabsTrigger value="aqidah">Aqidah</TabsTrigger>
              <TabsTrigger value="other">Other</TabsTrigger>
            </TabsList>
            <div className="text-sm text-muted-foreground">
              {filteredBooks.length}{" "}
              {filteredBooks.length === 1 ? "book" : "books"}
            </div>
          </div>

          <TabsContent value={categoryFilter} className="mt-0">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBooks.map((book) => (
                  <BookCardGrid key={book.id} book={book} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBooks.map((book) => (
                  <BookCardList key={book.id} book={book} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ReadingsPage;
