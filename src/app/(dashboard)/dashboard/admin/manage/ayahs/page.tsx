"use client";

import { Book, Edit, Plus, Save, Search, Trash2, X } from "lucide-react";
import React, { useEffect, useState } from "react";

interface Ayah {
  id: string;
  surahId: string;
  paraId: string;
  number: number;
  arabic: string;
  transliteration?: string | null;
  bangla?: string | null;
  english?: string | null;
}

interface NewAyahForm {
  surahId: string;
  paraId: string;
  number: string;
  arabic: string;
  transliteration: string;
  bangla: string;
  english: string;
}

const ManageAyahsPage: React.FC = () => {
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedSurah, setSelectedSurah] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingAyah, setEditingAyah] = useState<Ayah | null>(null);
  const [newAyah, setNewAyah] = useState<NewAyahForm>({
    surahId: "",
    paraId: "",
    number: "",
    arabic: "",
    transliteration: "",
    bangla: "",
    english: "",
  });

  // Sample data - in a real app, this would come from an API
  useEffect(() => {
    const sampleAyahs: Ayah[] = [
      {
        id: "ayah-001",
        surahId: "surah-001",
        paraId: "para-001",
        number: 1,
        arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        transliteration: "Bismillaahir Rahmaanir Raheem",
        english: "In the name of Allah, the Most Gracious, the Most Merciful.",
        bangla: "পরম করুণাময় অসীম দয়ালু আল্লাহর নামে",
      },
      {
        id: "ayah-002",
        surahId: "surah-001",
        paraId: "para-001",
        number: 2,
        arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
        transliteration: "Alhamdu lillaahi Rabbil aalameen",
        english: "All praise is due to Allah, Lord of all the worlds.",
        bangla: "সমস্ত প্রশংসা আল্লাহর জন্য যিনি সকল জগতের প্রতিপালক",
      },
      {
        id: "ayah-003",
        surahId: "surah-002",
        paraId: "para-001",
        number: 1,
        arabic: "الم",
        transliteration: "Alif Laam Meem",
        english: "Alif, Lam, Meem.",
        bangla: "আলিফ-লাম-মীম",
      },
    ];
    setAyahs(sampleAyahs);
  }, []);

  const handleAddAyah = (): void => {
    if (newAyah.surahId && newAyah.number && newAyah.arabic) {
      const ayah: Ayah = {
        id: `ayah-${Date.now()}`,
        surahId: newAyah.surahId,
        paraId: newAyah.paraId,
        number: parseInt(newAyah.number, 10),
        arabic: newAyah.arabic,
        transliteration: newAyah.transliteration || null,
        bangla: newAyah.bangla || null,
        english: newAyah.english || null,
      };
      setAyahs([...ayahs, ayah]);
      setNewAyah({
        surahId: "",
        paraId: "",
        number: "",
        arabic: "",
        transliteration: "",
        bangla: "",
        english: "",
      });
      setIsAddModalOpen(false);
    }
  };

  const handleEditAyah = (ayah: Ayah): void => {
    setEditingAyah(ayah);
    setNewAyah({
      surahId: ayah.surahId,
      paraId: ayah.paraId,
      number: ayah.number.toString(),
      arabic: ayah.arabic,
      transliteration: ayah.transliteration || "",
      bangla: ayah.bangla || "",
      english: ayah.english || "",
    });
    setIsAddModalOpen(true);
  };

  const handleUpdateAyah = (): void => {
    if (!editingAyah) return;

    const updatedAyah: Ayah = {
      id: editingAyah.id,
      surahId: newAyah.surahId,
      paraId: newAyah.paraId,
      number: parseInt(newAyah.number, 10),
      arabic: newAyah.arabic,
      transliteration: newAyah.transliteration || null,
      bangla: newAyah.bangla || null,
      english: newAyah.english || null,
    };

    setAyahs(
      ayahs.map((ayah) => (ayah.id === editingAyah.id ? updatedAyah : ayah))
    );
    setEditingAyah(null);
    setNewAyah({
      surahId: "",
      paraId: "",
      number: "",
      arabic: "",
      transliteration: "",
      bangla: "",
      english: "",
    });
    setIsAddModalOpen(false);
  };

  const handleDeleteAyah = (id: string): void => {
    if (window.confirm("Are you sure you want to delete this Ayah?")) {
      setAyahs(ayahs.filter((ayah) => ayah.id !== id));
    }
  };

  const resetModal = (): void => {
    setIsAddModalOpen(false);
    setEditingAyah(null);
    setNewAyah({
      surahId: "",
      paraId: "",
      number: "",
      arabic: "",
      transliteration: "",
      bangla: "",
      english: "",
    });
  };

  // Filter ayahs based on search term and selected surah
  const filteredAyahs = ayahs.filter((ayah) => {
    const matchesSearch =
      !searchTerm ||
      ayah.surahId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ayah.arabic.includes(searchTerm) ||
      (ayah.english &&
        ayah.english.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (ayah.bangla && ayah.bangla.includes(searchTerm)) ||
      (ayah.transliteration &&
        ayah.transliteration.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSurah =
      selectedSurah === "all" ||
      ayah.surahId.toLowerCase() === selectedSurah.toLowerCase();

    return matchesSearch && matchesSurah;
  });

  // Get unique surah IDs for filter dropdown
  const uniqueSurahs = [...new Set(ayahs.map((ayah) => ayah.surahId))];

  const handleInputChange = (field: keyof NewAyahForm, value: string): void => {
    setNewAyah((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = (): boolean => {
    return !!(
      newAyah.surahId &&
      newAyah.paraId &&
      newAyah.number &&
      newAyah.arabic
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Book className="h-8 w-8 text-emerald-600" />
              <h1 className="text-3xl font-bold text-gray-800">Manage Ayahs</h1>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Add Ayah</span>
            </button>
          </div>

          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search ayahs by surah, text, translation, or transliteration..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <select
              value={selectedSurah}
              onChange={(e) => setSelectedSurah(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Surahs</option>
              {uniqueSurahs.map((surah) => (
                <option key={surah} value={surah}>
                  {surah}
                </option>
              ))}
            </select>
          </div>

          {/* Stats */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredAyahs.length} of {ayahs.length} ayahs
          </div>
        </div>

        {/* Ayahs List */}
        <div className="space-y-4">
          {filteredAyahs.map((ayah) => (
            <div
              key={ayah.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                    {ayah.surahId} - Ayah {ayah.number}
                  </div>
                  <div className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                    {ayah.paraId}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditAyah(ayah)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                    title="Edit Ayah"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteAyah(ayah.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                    title="Delete Ayah"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-right">
                  <p
                    className="text-2xl font-arabic leading-relaxed text-gray-800"
                    style={{ fontFamily: "Arial, sans-serif" }}
                  >
                    {ayah.arabic}
                  </p>
                </div>

                {ayah.transliteration && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Transliteration:
                    </p>
                    <p className="text-gray-700 italic">
                      {ayah.transliteration}
                    </p>
                  </div>
                )}

                {ayah.english && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      English Translation:
                    </p>
                    <p className="text-gray-800">{ayah.english}</p>
                  </div>
                )}

                {ayah.bangla && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      বাংলা অনুবাদ:
                    </p>
                    <p className="text-gray-800">{ayah.bangla}</p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {filteredAyahs.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No ayahs found
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || selectedSurah !== "all"
                  ? "Try adjusting your search criteria or filters."
                  : "Start by adding your first ayah."}
              </p>
              {!searchTerm && selectedSurah === "all" && (
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
                >
                  Add First Ayah
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
                    {editingAyah ? "Edit Ayah" : "Add New Ayah"}
                  </h2>
                  <button
                    onClick={resetModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Surah ID *
                      </label>
                      <input
                        type="text"
                        value={newAyah.surahId}
                        onChange={(e) =>
                          handleInputChange("surahId", e.target.value)
                        }
                        placeholder="surah-001"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Para ID *
                      </label>
                      <input
                        type="text"
                        value={newAyah.paraId}
                        onChange={(e) =>
                          handleInputChange("paraId", e.target.value)
                        }
                        placeholder="para-001"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ayah Number *
                      </label>
                      <input
                        type="number"
                        value={newAyah.number}
                        onChange={(e) =>
                          handleInputChange("number", e.target.value)
                        }
                        placeholder="1"
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Arabic Text *
                    </label>
                    <textarea
                      value={newAyah.arabic}
                      onChange={(e) =>
                        handleInputChange("arabic", e.target.value)
                      }
                      placeholder="بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-right"
                      style={{ fontFamily: "Arial, sans-serif" }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transliteration
                    </label>
                    <textarea
                      value={newAyah.transliteration}
                      onChange={(e) =>
                        handleInputChange("transliteration", e.target.value)
                      }
                      placeholder="Bismillaahir Rahmaanir Raheem"
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      English Translation
                    </label>
                    <textarea
                      value={newAyah.english}
                      onChange={(e) =>
                        handleInputChange("english", e.target.value)
                      }
                      placeholder="In the name of Allah, the Most Gracious, the Most Merciful"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bangla Translation
                    </label>
                    <textarea
                      value={newAyah.bangla}
                      onChange={(e) =>
                        handleInputChange("bangla", e.target.value)
                      }
                      placeholder="পরম করুণাময় অসীম দয়ালু আল্লাহর নামে"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={resetModal}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingAyah ? handleUpdateAyah : handleAddAyah}
                    disabled={!isFormValid()}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    <span>{editingAyah ? "Update" : "Add"} Ayah</span>
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

export default ManageAyahsPage;
