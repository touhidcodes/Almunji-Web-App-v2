"use client";

import {
  Book,
  Edit,
  MapPin,
  Plus,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";
import React, { ChangeEvent, useEffect, useState } from "react";

// Correct types matching your schema
type TSurah = {
  id: string;
  chapter: number;
  totalAyah: number;
  arabic: string;
  english: string;
  bangla?: string | null;
  history?: string | null;
  revelation: string;
  createdAt: string;
  updatedAt: string;
};

type TNewSurah = {
  chapter: string;
  totalAyah: string;
  arabic: string;
  english: string;
  bangla: string;
  history: string;
  revelation: string;
};

const ManageSurahsPage: React.FC = () => {
  const [surahs, setSurahs] = useState<TSurah[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedRevelation, setSelectedRevelation] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingSurah, setEditingSurah] = useState<TSurah | null>(null);
  const [newSurah, setNewSurah] = useState<TNewSurah>({
    chapter: "",
    arabic: "",
    english: "",
    bangla: "",
    totalAyah: "",
    revelation: "Meccan",
    history: "",
  });

  // Sample data
  useEffect(() => {
    const sampleSurahs: TSurah[] = [
      {
        id: "1",
        chapter: 1,
        arabic: "الفاتحة",
        english: "Al-Fatihah",
        bangla: "আল-ফাতিহা",
        totalAyah: 7,
        revelation: "Meccan",
        history:
          "The opening chapter of the Quran, recited in every unit of prayer.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        chapter: 2,
        arabic: "البقرة",
        english: "Al-Baqarah",
        bangla: "আল-বাকারা",
        totalAyah: 286,
        revelation: "Medinan",
        history:
          "The longest chapter of the Quran, containing many laws and stories.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "3",
        chapter: 3,
        arabic: "آل عمران",
        english: "Ali Imran",
        bangla: "আলে ইমরান",
        totalAyah: 200,
        revelation: "Medinan",
        history:
          "Discusses the stories of Jesus and Mary, and events from the Battle of Uhud.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "4",
        chapter: 114,
        arabic: "الناس",
        english: "An-Nas",
        bangla: "আন-নাস",
        totalAyah: 6,
        revelation: "Meccan",
        history:
          "The final chapter of the Quran, seeking protection from evil whispers.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
    setSurahs(sampleSurahs);
  }, []);

  const handleAddSurah = (): void => {
    if (
      newSurah.chapter &&
      newSurah.english &&
      newSurah.arabic &&
      newSurah.totalAyah
    ) {
      const now = new Date().toISOString();
      const surah: TSurah = {
        id: Date.now().toString(),
        chapter: parseInt(newSurah.chapter),
        totalAyah: parseInt(newSurah.totalAyah),
        arabic: newSurah.arabic,
        english: newSurah.english,
        bangla: newSurah.bangla || null,
        revelation: newSurah.revelation,
        history: newSurah.history || null,
        createdAt: now,
        updatedAt: now,
      };
      setSurahs([...surahs, surah]);
      resetForm();
    }
  };

  const handleEditSurah = (surah: TSurah): void => {
    setEditingSurah(surah);
    setNewSurah({
      chapter: surah.chapter.toString(),
      totalAyah: surah.totalAyah.toString(),
      arabic: surah.arabic,
      english: surah.english,
      bangla: surah.bangla || "",
      revelation: surah.revelation,
      history: surah.history || "",
    });
    setIsAddModalOpen(true);
  };

  const handleUpdateSurah = (): void => {
    if (!editingSurah) return;

    const updatedSurah: TSurah = {
      ...editingSurah,
      chapter: parseInt(newSurah.chapter),
      totalAyah: parseInt(newSurah.totalAyah),
      arabic: newSurah.arabic,
      english: newSurah.english,
      bangla: newSurah.bangla || null,
      revelation: newSurah.revelation,
      history: newSurah.history || null,
      updatedAt: new Date().toISOString(),
    };
    setSurahs(
      surahs.map((surah) =>
        surah.id === editingSurah.id ? updatedSurah : surah
      )
    );
    resetForm();
  };

  const handleDeleteSurah = (id: string): void => {
    if (window.confirm("Are you sure you want to delete this Surah?")) {
      setSurahs(surahs.filter((surah) => surah.id !== id));
    }
  };

  const resetForm = (): void => {
    setIsAddModalOpen(false);
    setEditingSurah(null);
    setNewSurah({
      chapter: "",
      arabic: "",
      english: "",
      bangla: "",
      totalAyah: "",
      revelation: "Meccan",
      history: "",
    });
  };

  // Filter surahs
  const filteredSurahs = surahs.filter((surah) => {
    const matchesSearch =
      !searchTerm ||
      surah.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
      surah.arabic.includes(searchTerm) ||
      (surah.bangla && surah.bangla.includes(searchTerm)) ||
      (surah.history &&
        surah.history.toLowerCase().includes(searchTerm.toLowerCase())) ||
      surah.chapter.toString().includes(searchTerm);

    const matchesRevelation =
      selectedRevelation === "all" || surah.revelation === selectedRevelation;

    return matchesSearch && matchesRevelation;
  });

  // Sort surahs by chapter
  const sortedSurahs = [...filteredSurahs].sort(
    (a, b) => a.chapter - b.chapter
  );

  // Calculate stats
  const totalAyahs = surahs.reduce((sum, surah) => sum + surah.totalAyah, 0);
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

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search surahs by name, number, or history..."
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
                setSelectedRevelation(e.target.value)
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
                    {surah.chapter}
                  </div>
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
                    {surah.arabic}
                  </p>
                </div>

                {/* English & Bangla Names */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {surah.english}
                  </h3>
                  {surah.bangla && (
                    <p className="text-sm text-gray-600 mt-1">{surah.bangla}</p>
                  )}
                </div>

                {/* Ayah Count */}
                <div className="flex items-center justify-between py-2 border-t border-gray-100">
                  <span className="text-sm text-gray-600">Total Ayahs:</span>
                  <span className="font-bold text-emerald-600">
                    {surah.totalAyah}
                  </span>
                </div>

                {/* History */}
                {surah.history && (
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">
                      History:
                    </p>
                    <p className="text-sm text-gray-700">{surah.history}</p>
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
                        Chapter Number *
                      </label>
                      <input
                        type="number"
                        value={newSurah.chapter}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleInputChange("chapter", e.target.value)
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
                        value={newSurah.totalAyah}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleInputChange("totalAyah", e.target.value)
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
                      value={newSurah.arabic}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleInputChange("arabic", e.target.value)
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
                        value={newSurah.english}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleInputChange("english", e.target.value)
                        }
                        placeholder="Al-Fatihah"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bangla Name
                      </label>
                      <input
                        type="text"
                        value={newSurah.bangla}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleInputChange("bangla", e.target.value)
                        }
                        placeholder="আল-ফাতিহা"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Revelation Period *
                    </label>
                    <select
                      value={newSurah.revelation}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                        handleInputChange("revelation", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="Meccan">Meccan</option>
                      <option value="Medinan">Medinan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      History
                    </label>
                    <textarea
                      value={newSurah.history}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                        handleInputChange("history", e.target.value)
                      }
                      placeholder="Brief history and description of the surah"
                      rows={4}
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
                      !newSurah.chapter ||
                      !newSurah.english ||
                      !newSurah.arabic ||
                      !newSurah.totalAyah
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
