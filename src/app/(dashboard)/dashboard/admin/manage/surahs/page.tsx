"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Book,
  Save,
  X,
  MapPin,
  Calendar,
} from "lucide-react";
import { TNewSurah, TSurah } from "@/types/surah";

const ManageSurahsPage: React.FC = () => {
  const [surahs, setSurahs] = useState<TSurah[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedRevelation, setSelectedRevelation] = useState<
    "all" | "Meccan" | "Medinan"
  >("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingSurah, setEditingSurah] = useState<TSurah | null>(null);
  const [newSurah, setNewSurah] = useState<TNewSurah>({
    number: "",
    nameArabic: "",
    nameEnglish: "",
    nameTransliteration: "",
    meaning: "",
    totalAyahs: "",
    revelation: "Meccan",
    revelationOrder: "",
    mainThemes: "",
    description: "",
  });

  // Sample data - in a real app, this would come from an API
  useEffect(() => {
    const sampleSurahs: TSurah[] = [
      {
        id: 1,
        number: 1,
        nameArabic: "الفاتحة",
        nameEnglish: "Al-Fatihah",
        nameTransliteration: "Al-Faatihah",
        meaning: "The Opening",
        totalAyahs: 7,
        revelation: "Meccan",
        revelationOrder: 5,
        mainThemes: "Prayer, Praise of Allah, Guidance",
        description:
          "The opening chapter of the Quran, recited in every unit of prayer.",
      },
      {
        id: 2,
        number: 2,
        nameArabic: "البقرة",
        nameEnglish: "Al-Baqarah",
        nameTransliteration: "Al-Baqarah",
        meaning: "The Cow",
        totalAyahs: 286,
        revelation: "Medinan",
        revelationOrder: 87,
        mainThemes: "Laws, Stories of previous nations, Faith and disbelief",
        description:
          "The longest chapter of the Quran, containing many laws and stories.",
      },
      {
        id: 3,
        number: 3,
        nameArabic: "آل عمران",
        nameEnglish: "Ali Imran",
        nameTransliteration: "Aali Imraan",
        meaning: "The Family of Imran",
        totalAyahs: 200,
        revelation: "Medinan",
        revelationOrder: 89,
        mainThemes: "Jesus, Mary, Unity of Allah, Battle of Uhud",
        description:
          "Discusses the stories of Jesus and Mary, and events from the Battle of Uhud.",
      },
      {
        id: 4,
        number: 114,
        nameArabic: "الناس",
        nameEnglish: "An-Nas",
        nameTransliteration: "An-Naas",
        meaning: "The People",
        totalAyahs: 6,
        revelation: "Meccan",
        revelationOrder: 21,
        mainThemes: "Protection from evil, Seeking refuge in Allah",
        description:
          "The final chapter of the Quran, seeking protection from evil whispers.",
      },
    ];
    setSurahs(sampleSurahs);
  }, []);

  const handleAddSurah = (): void => {
    if (
      newSurah.number &&
      newSurah.nameEnglish &&
      newSurah.nameArabic &&
      newSurah.totalAyahs
    ) {
      const surah: TSurah = {
        ...newSurah,
        id: Date.now(),
        number: parseInt(newSurah.number),
        totalAyahs: parseInt(newSurah.totalAyahs),
        revelationOrder: newSurah.revelationOrder
          ? parseInt(newSurah.revelationOrder)
          : null,
      };
      setSurahs([...surahs, surah]);
      resetForm();
    }
  };

  const handleEditSurah = (surah: TSurah): void => {
    setEditingSurah(surah);
    setNewSurah({
      ...surah,
      number: surah.number.toString(),
      totalAyahs: surah.totalAyahs.toString(),
      revelationOrder: surah.revelationOrder
        ? surah.revelationOrder.toString()
        : "",
    });
    setIsAddModalOpen(true);
  };

  const handleUpdateSurah = (): void => {
    if (!editingSurah) return;

    const updatedSurah: TSurah = {
      ...newSurah,
      id: editingSurah.id,
      number: parseInt(newSurah.number),
      totalAyahs: parseInt(newSurah.totalAyahs),
      revelationOrder: newSurah.revelationOrder
        ? parseInt(newSurah.revelationOrder)
        : null,
    };
    setSurahs(
      surahs.map((surah) =>
        surah.id === editingSurah.id ? updatedSurah : surah
      )
    );
    resetForm();
  };

  const handleDeleteSurah = (id: number): void => {
    if (window.confirm("Are you sure you want to delete this Surah?")) {
      setSurahs(surahs.filter((surah) => surah.id !== id));
    }
  };

  const resetForm = (): void => {
    setIsAddModalOpen(false);
    setEditingSurah(null);
    setNewSurah({
      number: "",
      nameArabic: "",
      nameEnglish: "",
      nameTransliteration: "",
      meaning: "",
      totalAyahs: "",
      revelation: "Meccan",
      revelationOrder: "",
      mainThemes: "",
      description: "",
    });
  };

  // Filter surahs based on search term and revelation period
  const filteredSurahs = surahs.filter((surah) => {
    const matchesSearch =
      !searchTerm ||
      surah.nameEnglish.toLowerCase().includes(searchTerm.toLowerCase()) ||
      surah.nameArabic.includes(searchTerm) ||
      surah.nameTransliteration
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      surah.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
      surah.mainThemes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      surah.number.toString().includes(searchTerm);

    const matchesRevelation =
      selectedRevelation === "all" || surah.revelation === selectedRevelation;

    return matchesSearch && matchesRevelation;
  });

  // Sort surahs by number
  const sortedSurahs = [...filteredSurahs].sort((a, b) => a.number - b.number);

  // Calculate stats
  const totalAyahs = surahs.reduce((sum, surah) => sum + surah.totalAyahs, 0);
  const meccanCount = surahs.filter((s) => s.revelation === "Meccan").length;
  const medinanCount = surahs.filter((s) => s.revelation === "Medinan").length;

  const handleInputChange = (field: keyof TNewSurah, value: string): void => {
    setNewSurah({ ...newSurah, [field]: value });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Book className="h-8 w-8 text-emerald-600" />
              <h1 className="text-3xl font-bold text-gray-800">
                Manage Surahs
              </h1>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Add Surah</span>
            </button>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search surahs by name, number, meaning, or themes..."
                value={searchTerm}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <select
              value={selectedRevelation}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setSelectedRevelation(
                  e.target.value as "all" | "Meccan" | "Medinan"
                )
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Revelations</option>
              <option value="Meccan">Meccan</option>
              <option value="Medinan">Medinan</option>
            </select>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-emerald-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-emerald-600">
                {surahs.length}
              </div>
              <div className="text-sm text-gray-600">Total Surahs</div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {totalAyahs}
              </div>
              <div className="text-sm text-gray-600">Total Ayahs</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {meccanCount}
              </div>
              <div className="text-sm text-gray-600">Meccan</div>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {medinanCount}
              </div>
              <div className="text-sm text-gray-600">Medinan</div>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {sortedSurahs.length} of {surahs.length} surahs
          </div>
        </div>

        {/* Surahs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedSurahs.map((surah) => (
            <div
              key={surah.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                    {surah.number}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`px-2 py-1 rounded text-xs ${
                        surah.revelation === "Meccan"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      <MapPin className="h-3 w-3 inline mr-1" />
                      {surah.revelation}
                    </div>
                    {surah.revelationOrder && (
                      <div className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        Order: {surah.revelationOrder}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditSurah(surah)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                    title="Edit Surah"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSurah(surah.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                    title="Delete Surah"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {/* Arabic Name */}
                <div className="text-right">
                  <p
                    className="text-2xl font-bold text-gray-800"
                    style={{ fontFamily: "Arial, sans-serif" }}
                  >
                    {surah.nameArabic}
                  </p>
                </div>

                {/* English Names */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {surah.nameEnglish}
                  </h3>
                  {surah.nameTransliteration && (
                    <p className="text-sm text-gray-600 italic">
                      {surah.nameTransliteration}
                    </p>
                  )}
                  {surah.meaning && (
                    <p className="text-sm text-emerald-600 font-medium">
                      "{surah.meaning}"
                    </p>
                  )}
                </div>

                {/* Ayah Count */}
                <div className="flex items-center justify-between py-2 border-t border-gray-100">
                  <span className="text-sm text-gray-600">Total Ayahs:</span>
                  <span className="font-bold text-emerald-600">
                    {surah.totalAyahs}
                  </span>
                </div>

                {/* Main Themes */}
                {surah.mainThemes && (
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">
                      Main Themes:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {surah.mainThemes.split(",").map((theme, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                        >
                          {theme.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                {surah.description && (
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">
                      Description:
                    </p>
                    <p className="text-sm text-gray-700">{surah.description}</p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {sortedSurahs.length === 0 && (
            <div className="col-span-full bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No surahs found
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || selectedRevelation !== "all"
                  ? "Try adjusting your search criteria or filters."
                  : "Start by adding your first surah."}
              </p>
              {!searchTerm && selectedRevelation === "all" && (
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
                >
                  Add First Surah
                </button>
              )}
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editingSurah ? "Edit Surah" : "Add New Surah"}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Surah Number *
                      </label>
                      <input
                        type="number"
                        value={newSurah.number}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleInputChange("number", e.target.value)
                        }
                        placeholder="1"
                        min="1"
                        max="114"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Ayahs *
                      </label>
                      <input
                        type="number"
                        value={newSurah.totalAyahs}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleInputChange("totalAyahs", e.target.value)
                        }
                        placeholder="7"
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Arabic Name *
                    </label>
                    <input
                      type="text"
                      value={newSurah.nameArabic}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleInputChange("nameArabic", e.target.value)
                      }
                      placeholder="الفاتحة"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-right"
                      style={{ fontFamily: "Arial, sans-serif" }}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        English Name *
                      </label>
                      <input
                        type="text"
                        value={newSurah.nameEnglish}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleInputChange("nameEnglish", e.target.value)
                        }
                        placeholder="Al-Fatihah"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Transliteration
                      </label>
                      <input
                        type="text"
                        value={newSurah.nameTransliteration}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleInputChange(
                            "nameTransliteration",
                            e.target.value
                          )
                        }
                        placeholder="Al-Faatihah"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meaning
                    </label>
                    <input
                      type="text"
                      value={newSurah.meaning}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleInputChange("meaning", e.target.value)
                      }
                      placeholder="The Opening"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Revelation Period
                      </label>
                      <select
                        value={newSurah.revelation}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                          handleInputChange(
                            "revelation",
                            e.target.value as "Meccan" | "Medinan"
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      >
                        <option value="Meccan">Meccan</option>
                        <option value="Medinan">Medinan</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Revelation Order
                      </label>
                      <input
                        type="number"
                        value={newSurah.revelationOrder}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleInputChange("revelationOrder", e.target.value)
                        }
                        placeholder="5"
                        min="1"
                        max="114"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Main Themes
                    </label>
                    <input
                      type="text"
                      value={newSurah.mainThemes}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleInputChange("mainThemes", e.target.value)
                      }
                      placeholder="Prayer, Praise of Allah, Guidance (separate with commas)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newSurah.description}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder="Brief description of the surah's content and significance"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingSurah ? handleUpdateSurah : handleAddSurah}
                    disabled={
                      !newSurah.number ||
                      !newSurah.nameEnglish ||
                      !newSurah.nameArabic ||
                      !newSurah.totalAyahs
                    }
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>{editingSurah ? "Update" : "Add"} Surah</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageSurahsPage;
