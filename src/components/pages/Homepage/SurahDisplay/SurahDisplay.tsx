"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

const SurahDisplay = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("Surah");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Ascending");

  // Sample Surah data - in a real app, this would come from an API
  const surahs = [
    {
      id: 1,
      number: "01",
      name: "Al-Fatihah",
      arabicName: "الفاتحة",
      englishName: "The Opener",
      verses: 7,
    },
    {
      id: 2,
      number: "02",
      name: "Al-Baqarah",
      arabicName: "البقرة",
      englishName: "The Cow",
      verses: 286,
    },
    {
      id: 3,
      number: "03",
      name: "Al-Imran",
      arabicName: "آل عمران",
      englishName: "Family of Imran",
      verses: 200,
    },
    {
      id: 4,
      number: "04",
      name: "An-Nisa",
      arabicName: "النساء",
      englishName: "The Women",
      verses: 176,
    },
    {
      id: 5,
      number: "05",
      name: "Al-Maidah",
      arabicName: "المائدة",
      englishName: "The Table Spread",
      verses: 120,
    },
    {
      id: 6,
      number: "06",
      name: "Al-Anam",
      arabicName: "الأنعام",
      englishName: "The Cattle",
      verses: 165,
    },
    {
      id: 7,
      number: "07",
      name: "Al-Araf",
      arabicName: "الأعراف",
      englishName: "The Heights",
      verses: 206,
    },
    {
      id: 8,
      number: "08",
      name: "Al-Anfal",
      arabicName: "الأنفال",
      englishName: "The Spoils of War",
      verses: 75,
    },
    {
      id: 9,
      number: "09",
      name: "At-Taubah",
      arabicName: "التوبة",
      englishName: "The Repentance",
      verses: 129,
    },
    {
      id: 10,
      number: "10",
      name: "Yunus",
      arabicName: "يونس",
      englishName: "Jonah",
      verses: 109,
    },
    {
      id: 11,
      number: "11",
      name: "Hud",
      arabicName: "هود",
      englishName: "Hud",
      verses: 123,
    },
    {
      id: 12,
      number: "12",
      name: "Yusuf",
      arabicName: "يوسف",
      englishName: "Joseph",
      verses: 111,
    },
  ];

  const filteredSurahs = surahs.filter(
    (surah) =>
      surah.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.arabicName.includes(searchQuery) ||
      surah.englishName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedSurahs = [...filteredSurahs].sort((a, b) => {
    if (sortBy === "Ascending") {
      return a.id - b.id;
    } else {
      return b.id - a.id;
    }
  });

  // Navigation handlers
  const handleSurahClick = (surahId: number) => {
    router.push(`/surahs/${surahId}`);
  };

  const handleShowAllClick = () => {
    router.push("/surahs");
  };
  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Start the Journey of Enlightenment
        </h1>
      </div>

      {/* Navigation Tabs */}
      <div className="flex justify-center mb-6">
        <div className="flex bg-white rounded-full p-1 shadow-sm">
          {["Surah", "Juz", "Revelation Order"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedTab === tab
                  ? "bg-linear-to-r from-emerald-500 via-teal-500 to-emerald-500 hover:from-emerald-600 hover:via-teal-600 hover:to-emerald-600 text-white"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Sort */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="What do you want to read?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-12 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-600 text-sm">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
          >
            <option value="Ascending">Ascending</option>
            <option value="Descending">Descending</option>
          </select>
        </div>
      </div>

      {/* Surah Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {sortedSurahs.map((surah) => (
          <div
            key={surah.id}
            onClick={() => handleSurahClick(surah.id)}
            className={`relative bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-teal-500 bg-teal-50" : "border-gray-200
            `}
          >
            {/* Surah Number */}
            <div className="flex justify-between items-start mb-3">
              <span className="text-2xl font-bold text-gray-400">
                {surah.number}
              </span>
              <span className="text-sm text-gray-500">
                {surah.verses} verses
              </span>
            </div>

            {/* Surah Names */}
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-800 mb-1">
                {surah.name}
              </h3>
              <p
                className="text-2xl font-arabic text-gray-700 mb-2 text-right"
                dir="rtl"
              >
                {surah.arabicName}
              </p>
              <p className="text-sm text-gray-600">{surah.englishName}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Show All Button */}
      <div className="text-center">
        <button
          onClick={handleShowAllClick}
          className="bg-linear-to-r from-emerald-500 via-teal-500 to-emerald-500 hover:from-emerald-600 hover:via-teal-600 hover:to-emerald-600 text-white font-semibold px-8 py-3 rounded-full transition-colors"
        >
          Show All Surah
        </button>
      </div>

      <style jsx>{`
        .font-arabic {
          font-family: "Amiri", "Scheherazade New", "Times New Roman", serif;
        }
      `}</style>
    </div>
  );
};

export default SurahDisplay;
