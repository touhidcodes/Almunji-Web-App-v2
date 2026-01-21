import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Calendar, Heart, Share2, Star } from "lucide-react";
import { useState } from "react";

export default function DailyQuranPage() {
  const [isFavorited, setIsFavorited] = useState(false);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const dailyDua = {
    arabic:
      "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    transliteration:
      "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhaban-nar",
    translation:
      "Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire.",
    reference: "Surah Al-Baqarah (2:201)",
    benefit:
      "This comprehensive dua is one of the most frequently recited supplications. It asks Allah for goodness in both this life and the Hereafter, encompassing all aspects of well-being, success, and protection.",
  };

  const dailyTafsir = {
    surah: "Al-Fatiha",
    surahNumber: 1,
    ayahNumber: 5,
    arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    transliteration: "Iyyaka na'budu wa iyyaka nasta'een",
    translation: "You alone we worship, and You alone we ask for help.",
    tafsir: [
      {
        title: "The Essence of Worship",
        content:
          "This verse represents the heart of Al-Fatiha and embodies the core principle of Islamic monotheism. By saying 'You alone we worship,' we declare exclusive devotion to Allah, rejecting all forms of idolatry and associating partners with Him.",
      },
      {
        title: "Seeking Divine Assistance",
        content:
          "The phrase 'You alone we ask for help' acknowledges our complete dependence on Allah. We recognize that true success in worship and in all life matters comes only through His guidance and support. This teaches humility and reliance on the Creator.",
      },
      {
        title: "The Order of Priorities",
        content:
          "Scholars note that worship is mentioned before seeking help, teaching us that our relationship with Allah must be based first on devotion and submission, and then on our needs. This ordering reflects proper spiritual priorities.",
      },
      {
        title: "Daily Application",
        content:
          "Reciting this verse reminds us to begin every task with the intention of pleasing Allah and to seek His help in all our endeavors. It encourages a God-conscious approach to life where worship and worldly actions are interconnected.",
      },
    ],
    reflection:
      "How can I implement exclusive worship and reliance on Allah in my daily decisions today?",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <BookOpen className="w-8 h-8 text-emerald-600" />
            <h1 className="text-4xl font-bold text-gray-800">
              Daily Reflection
            </h1>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <p className="text-sm">{today}</p>
          </div>
        </div>

        <Tabs defaultValue="dua" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="dua" className="text-base">
              Daily Dua
            </TabsTrigger>
            <TabsTrigger value="tafsir" className="text-base">
              Daily Tafsir
            </TabsTrigger>
          </TabsList>

          {/* Daily Dua Tab */}
          <TabsContent value="dua" className="space-y-6">
            <Card className="border-emerald-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl text-emerald-800">
                      Dua of the Day
                    </CardTitle>
                    <CardDescription className="text-emerald-600">
                      {dailyDua.reference}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsFavorited(!isFavorited)}
                    className="hover:bg-emerald-100"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isFavorited
                          ? "fill-red-500 text-red-500"
                          : "text-gray-400"
                      }`}
                    />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {/* Arabic Text */}
                <div className="text-center py-6 bg-gradient-to-br from-emerald-50 to-white rounded-lg border border-emerald-100">
                  <p
                    className="text-3xl leading-loose text-gray-800 font-arabic"
                    dir="rtl"
                  >
                    {dailyDua.arabic}
                  </p>
                </div>

                {/* Transliteration */}
                <div className="space-y-2">
                  <Badge
                    variant="outline"
                    className="bg-teal-50 text-teal-700 border-teal-200"
                  >
                    Transliteration
                  </Badge>
                  <p className="text-lg italic text-gray-700 leading-relaxed">
                    {dailyDua.transliteration}
                  </p>
                </div>

                {/* Translation */}
                <div className="space-y-2">
                  <Badge
                    variant="outline"
                    className="bg-emerald-50 text-emerald-700 border-emerald-200"
                  >
                    Translation
                  </Badge>
                  <p className="text-lg text-gray-800 leading-relaxed">
                    {dailyDua.translation}
                  </p>
                </div>

                {/* Benefit */}
                <div className="space-y-2 bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-600" />
                    <Badge
                      variant="outline"
                      className="bg-amber-100 text-amber-700 border-amber-300"
                    >
                      Benefit
                    </Badge>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {dailyDua.benefit}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                  >
                    Save for Later
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Daily Tafsir Tab */}
          <TabsContent value="tafsir" className="space-y-6">
            <Card className="border-teal-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl text-teal-800">
                      Surah {dailyTafsir.surah} - Verse {dailyTafsir.ayahNumber}
                    </CardTitle>
                    <CardDescription className="text-teal-600">
                      Understanding the Quran - Verse by Verse
                    </CardDescription>
                  </div>
                  <Badge className="bg-teal-600 text-white">
                    {dailyTafsir.surahNumber}:{dailyTafsir.ayahNumber}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {/* Arabic Verse */}
                <div className="text-center py-6 bg-gradient-to-br from-teal-50 to-white rounded-lg border border-teal-100">
                  <p
                    className="text-3xl leading-loose text-gray-800 font-arabic"
                    dir="rtl"
                  >
                    {dailyTafsir.arabic}
                  </p>
                </div>

                {/* Transliteration */}
                <div className="space-y-2">
                  <Badge
                    variant="outline"
                    className="bg-cyan-50 text-cyan-700 border-cyan-200"
                  >
                    Transliteration
                  </Badge>
                  <p className="text-lg italic text-gray-700 leading-relaxed">
                    {dailyTafsir.transliteration}
                  </p>
                </div>

                {/* Translation */}
                <div className="space-y-2">
                  <Badge
                    variant="outline"
                    className="bg-teal-50 text-teal-700 border-teal-200"
                  >
                    Translation
                  </Badge>
                  <p className="text-lg text-gray-800 leading-relaxed">
                    {dailyTafsir.translation}
                  </p>
                </div>

                {/* Tafsir Sections */}
                <div className="space-y-4">
                  <Badge
                    variant="outline"
                    className="bg-emerald-50 text-emerald-700 border-emerald-200"
                  >
                    Detailed Commentary
                  </Badge>
                  {dailyTafsir.tafsir.map((section, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-5 rounded-lg border border-gray-200"
                    >
                      <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs flex items-center justify-center">
                          {index + 1}
                        </span>
                        {section.title}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {section.content}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Reflection */}
                <div className="space-y-2 bg-purple-50 p-5 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-purple-600" />
                    <Badge
                      variant="outline"
                      className="bg-purple-100 text-purple-700 border-purple-300"
                    >
                      Today's Reflection
                    </Badge>
                  </div>
                  <p className="text-gray-700 leading-relaxed italic">
                    {dailyTafsir.reflection}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 bg-teal-600 hover:bg-teal-700">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Tafsir
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-teal-600 text-teal-600 hover:bg-teal-50"
                  >
                    Read Full Surah
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer Note */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>
            May Allah accept our worship and grant us understanding of His words
          </p>
        </div>
      </div>
    </div>
  );
}
