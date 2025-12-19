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
  BookMarked,
  BookOpen,
  Clock,
  Eye,
  Heart,
  Play,
  Plus,
  Search,
  Star,
  Trash2,
  TrendingUp,
  Zap,
} from "lucide-react";
import React, { useState } from "react";

interface Surah {
  id: number;
  name: string;
  arabicName: string;
  chapter: number;
  verses: number;
  progress: number;
  lastRead: string;
  isFavorite: boolean;
}

interface Ayah {
  id: string;
  title: string;
  surah: string;
  reference: string;
  arabicText: string;
  translation: string;
  tags: string[];
  savedDate: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  progress: number;
  totalChapters: number;
  currentChapter: number;
  lastRead: string;
  cover: string;
}

interface Dua {
  id: string;
  title: string;
  arabicText: string;
  transliteration: string;
  translation: string;
  category: string;
  frequency: string;
  isFavorite: boolean;
}

type BookmarkType = "surah" | "ayah" | "book" | "dua";

const DashboardBookmarkPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Sample bookmark data
  const bookmarkData = {
    surahs: [
      {
        id: 1,
        name: "Al-Fatiha",
        arabicName: "الفاتحة",
        chapter: 1,
        verses: 7,
        progress: 100,
        lastRead: "2 hours ago",
        isFavorite: true,
      },
      {
        id: 2,
        name: "Al-Baqarah",
        arabicName: "البقرة",
        chapter: 2,
        verses: 286,
        progress: 65,
        lastRead: "1 day ago",
        isFavorite: false,
      },
      {
        id: 36,
        name: "Ya-Sin",
        arabicName: "يس",
        chapter: 36,
        verses: 83,
        progress: 90,
        lastRead: "3 days ago",
        isFavorite: true,
      },
    ] as Surah[],
    ayahs: [
      {
        id: "2:255",
        title: "Ayat al-Kursi",
        surah: "Al-Baqarah",
        reference: "2:255",
        arabicText: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
        translation:
          "Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence.",
        tags: ["protection", "daily"],
        savedDate: "Jan 15, 2024",
      },
      {
        id: "2:286",
        title: "Last Ayah of Al-Baqarah",
        surah: "Al-Baqarah",
        reference: "2:286",
        arabicText: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
        translation:
          "Allah does not charge a soul except [with that within] its capacity.",
        tags: ["comfort", "guidance"],
        savedDate: "Jan 12, 2024",
      },
    ] as Ayah[],
    books: [
      {
        id: "sahih-bukhari",
        title: "Sahih al-Bukhari",
        author: "Imam Bukhari",
        category: "Hadith",
        progress: 28,
        totalChapters: 97,
        currentChapter: 27,
        lastRead: "Yesterday",
        cover: "📚",
      },
      {
        id: "tafsir-kathir",
        title: "Tafsir Ibn Kathir",
        author: "Ibn Kathir",
        category: "Tafsir",
        progress: 15,
        totalChapters: 114,
        currentChapter: 17,
        lastRead: "1 week ago",
        cover: "📖",
      },
      {
        id: "sealed-nectar",
        title: "The Sealed Nectar",
        author: "Safi-ur-Rahman al-Mubarakpuri",
        category: "Seerah",
        progress: 72,
        totalChapters: 30,
        currentChapter: 22,
        lastRead: "2 days ago",
        cover: "🏛️",
      },
    ] as Book[],
    duas: [
      {
        id: "morning-dhikr",
        title: "Morning Remembrance",
        arabicText: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ",
        transliteration: "Asbahnā wa asbaha-l-mulku lillāh",
        translation:
          "We have reached the morning and at this very time unto Allah belongs all sovereignty.",
        category: "Daily Dhikr",
        frequency: "Morning",
        isFavorite: true,
      },
      {
        id: "evening-dhikr",
        title: "Evening Protection",
        arabicText: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ",
        transliteration: "Amsaynā wa amsa-l-mulku lillāh",
        translation:
          "We have reached the evening and at this very time unto Allah belongs all sovereignty.",
        category: "Daily Dhikr",
        frequency: "Evening",
        isFavorite: false,
      },
      {
        id: "istighfar",
        title: "Seeking Forgiveness",
        arabicText:
          "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْحَيَّ الْقَيُّومَ وَأَتُوبُ إِلَيْهِ",
        transliteration:
          "Astaghfiru-llāha-l-ʿaẓīma-lladhī lā ilāha illā huwa-l-ḥayya-l-qayyūma wa atūbu ilayh",
        translation:
          "I seek forgiveness of Allah the Mighty, Whom there is none worthy of worship except Him, The Living, The Eternal, and I repent unto Him.",
        category: "Repentance",
        frequency: "Anytime",
        isFavorite: true,
      },
    ] as Dua[],
  };

  const totalStats = {
    surahs: bookmarkData.surahs.length,
    ayahs: bookmarkData.ayahs.length,
    books: bookmarkData.books.length,
    duas: bookmarkData.duas.length,
    totalBookmarks:
      bookmarkData.surahs.length +
      bookmarkData.ayahs.length +
      bookmarkData.books.length +
      bookmarkData.duas.length,
  };

  const handleRemoveBookmark = (type: BookmarkType, id: string | number) => {
    console.log(`Removing ${type} bookmark: ${id}`);
  };

  const handleReadBookmark = (type: BookmarkType, id: string | number) => {
    console.log(`Reading ${type}: ${id}`);
  };

  const StatCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: number;
    subtitle: string;
    trend?: boolean;
  }> = ({ icon, title, value, subtitle, trend }) => (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
      {trend && (
        <div className="absolute top-2 right-2">
          <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
      )}
    </Card>
  );

  const SurahCard: React.FC<{ surah: Surah }> = ({ surah }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-linear-to-r from-emerald-500 to-blue-500 text-white text-sm font-bold flex items-center justify-center">
                {surah.chapter}
              </span>
              {surah.name}
              {surah.isFavorite && (
                <Heart className="h-4 w-4 fill-red-500 text-red-500" />
              )}
            </CardTitle>
            <CardDescription className="text-lg" style={{ direction: "rtl" }}>
              {surah.arabicName}
            </CardDescription>
          </div>
          <Badge variant="outline">{surah.verses} verses</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {surah.lastRead}
          </span>
          <span>{surah.progress}% complete</span>
        </div>
        <Progress value={surah.progress} className="h-2" />
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          className="flex-1"
          onClick={() => handleReadBookmark("surah", surah.id)}
        >
          <Play className="h-4 w-4 mr-2" />
          Continue
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleRemoveBookmark("surah", surah.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );

  const AyahCard: React.FC<{ ayah: Ayah }> = ({ ayah }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{ayah.title}</CardTitle>
            <CardDescription>
              {ayah.surah} {ayah.reference}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className="text-xl leading-relaxed text-right"
          style={{ direction: "rtl", fontFamily: "Arabic" }}
        >
          {ayah.arabicText}
        </div>
        <p className="text-sm text-muted-foreground italic leading-relaxed">
          {ayah.translation}
        </p>
        <div className="flex flex-wrap gap-2">
          {ayah.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Saved {ayah.savedDate}
        </span>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => handleReadBookmark("ayah", ayah.id)}>
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleRemoveBookmark("ayah", ayah.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );

  const BookCard: React.FC<{ book: Book }> = ({ book }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="text-3xl">{book.cover}</div>
          <div className="flex-1">
            <CardTitle className="text-lg">{book.title}</CardTitle>
            <CardDescription>by {book.author}</CardDescription>
            <Badge variant="outline" className="mt-1">
              {book.category}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Chapter {book.currentChapter} of {book.totalChapters}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {book.lastRead}
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{book.progress}%</span>
          </div>
          <Progress value={book.progress} className="h-2" />
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          className="flex-1"
          onClick={() => handleReadBookmark("book", book.id)}
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Continue Reading
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleRemoveBookmark("book", book.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );

  const DuaCard: React.FC<{ dua: Dua }> = ({ dua }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {dua.title}
              {dua.isFavorite && (
                <Heart className="h-4 w-4 fill-red-500 text-red-500" />
              )}
            </CardTitle>
            <CardDescription>{dua.category}</CardDescription>
          </div>
          <Badge variant="outline">{dua.frequency}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className="text-lg leading-relaxed text-right"
          style={{ direction: "rtl" }}
        >
          {dua.arabicText}
        </div>
        <div className="text-sm text-muted-foreground italic">
          {dua.transliteration}
        </div>
        <p className="text-sm leading-relaxed">{dua.translation}</p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          className="flex-1"
          variant="outline"
          onClick={() => handleReadBookmark("dua", dua.id)}
        >
          <Heart className="h-4 w-4 mr-2" />
          View Dua
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleRemoveBookmark("dua", dua.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <BookMarked className="h-8 w-8 text-emerald-600" />
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Quran Bookmarks
                </h1>
                <p className="text-sm text-muted-foreground">
                  Your Islamic knowledge collection
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search bookmarks..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchQuery(e.target.value)
                  }
                  className="pl-10 w-64"
                />
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Bookmark
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard
            icon={<Zap className="h-5 w-5" />}
            title="Total Bookmarks"
            value={totalStats.totalBookmarks}
            subtitle="All saved items"
          />
          <StatCard
            icon={<BookOpen className="h-5 w-5" />}
            title="Surahs"
            value={totalStats.surahs}
            subtitle="Chapters bookmarked"
          />
          <StatCard
            icon={<Star className="h-5 w-5" />}
            title="Ayahs"
            value={totalStats.ayahs}
            subtitle="Verses saved"
          />
          <StatCard
            icon={<BookMarked className="h-5 w-5" />}
            title="Books"
            value={totalStats.books}
            subtitle="In your library"
          />
          <StatCard
            icon={<Heart className="h-5 w-5" />}
            title="Duas"
            value={totalStats.duas}
            subtitle="Supplications"
          />
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="surahs" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="surahs" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Surahs ({totalStats.surahs})
            </TabsTrigger>
            <TabsTrigger value="ayahs" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Ayahs ({totalStats.ayahs})
            </TabsTrigger>
            <TabsTrigger value="books" className="flex items-center gap-2">
              <BookMarked className="h-4 w-4" />
              Books ({totalStats.books})
            </TabsTrigger>
            <TabsTrigger value="duas" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Duas ({totalStats.duas})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="surahs">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarkData.surahs.map((surah) => (
                <SurahCard key={surah.id} surah={surah} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ayahs">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarkData.ayahs.map((ayah) => (
                <AyahCard key={ayah.id} ayah={ayah} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="books">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarkData.books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="duas">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarkData.duas.map((dua) => (
                <DuaCard key={dua.id} dua={dua} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default DashboardBookmarkPage;
