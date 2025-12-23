"use client";
import { Book, Edit, Globe, Plus, Save, Search, Trash2, X } from "lucide-react";
import React, { useEffect, useState } from "react";

interface DictionaryEntry {
  id: number;
  word: string;
  pronunciation: string;
  partOfSpeech: string;
  definition: string;
  example: string;
  synonyms: string;
  antonyms: string;
  origin: string;
  category: string;
}

interface NewEntryForm {
  word: string;
  pronunciation: string;
  partOfSpeech: string;
  definition: string;
  example: string;
  synonyms: string;
  antonyms: string;
  origin: string;
  category: string;
}

const ManageDictionaryPage: React.FC = () => {
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPartOfSpeech, setSelectedPartOfSpeech] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DictionaryEntry | null>(
    null
  );
  const [newEntry, setNewEntry] = useState<NewEntryForm>({
    word: "",
    pronunciation: "",
    partOfSpeech: "noun",
    definition: "",
    example: "",
    synonyms: "",
    antonyms: "",
    origin: "",
    category: "General",
  });

  const partsOfSpeech = [
    "noun",
    "verb",
    "adjective",
    "adverb",
    "pronoun",
    "preposition",
    "conjunction",
    "interjection",
  ];

  // Sample data
  useEffect(() => {
    const sampleEntries: DictionaryEntry[] = [
      {
        id: 1,
        word: "Ephemeral",
        pronunciation: "/ɪˈfɛm(ə)r(ə)l/",
        partOfSpeech: "adjective",
        definition: "Lasting for a very short time; transitory.",
        example:
          "The beauty of cherry blossoms is ephemeral, lasting only a few weeks each spring.",
        synonyms: "fleeting, transient, momentary, brief",
        antonyms: "permanent, lasting, enduring, eternal",
        origin: "Greek ephēmeros 'lasting only a day'",
        category: "Academic",
      },
      {
        id: 2,
        word: "Serendipity",
        pronunciation: "/ˌsɛr(ə)nˈdɪpɪti/",
        partOfSpeech: "noun",
        definition:
          "The occurrence of events by chance in a happy or beneficial way.",
        example:
          "Finding that rare book at the garage sale was pure serendipity.",
        synonyms: "luck, fortune, chance, providence",
        antonyms: "misfortune, bad luck, design, intention",
        origin: "Coined by Horace Walpole in 1754",
        category: "General",
      },
      {
        id: 3,
        word: "Ameliorate",
        pronunciation: "/əˈmiːlɪəreɪt/",
        partOfSpeech: "verb",
        definition: "To make something bad or unsatisfactory better.",
        example:
          "The new policies were designed to ameliorate working conditions.",
        synonyms: "improve, enhance, better, upgrade",
        antonyms: "worsen, deteriorate, decline, degrade",
        origin: "Latin melior 'better'",
        category: "Academic",
      },
    ];
    setEntries(sampleEntries);
  }, []);

  const handleAddEntry = (): void => {
    if (newEntry.word && newEntry.definition) {
      const entry: DictionaryEntry = {
        ...newEntry,
        id: Date.now(),
      };
      setEntries([...entries, entry]);
      resetForm();
      setIsAddModalOpen(false);
    }
  };

  const handleEditEntry = (entry: DictionaryEntry): void => {
    setEditingEntry(entry);
    setNewEntry({
      word: entry.word,
      pronunciation: entry.pronunciation,
      partOfSpeech: entry.partOfSpeech,
      definition: entry.definition,
      example: entry.example,
      synonyms: entry.synonyms,
      antonyms: entry.antonyms,
      origin: entry.origin,
      category: entry.category,
    });
    setIsAddModalOpen(true);
  };

  const handleUpdateEntry = (): void => {
    if (!editingEntry) return;

    const updatedEntry: DictionaryEntry = {
      ...newEntry,
      id: editingEntry.id,
    };

    setEntries(
      entries.map((entry) =>
        entry.id === editingEntry.id ? updatedEntry : entry
      )
    );
    resetForm();
    setIsAddModalOpen(false);
  };

  const handleDeleteEntry = (id: number): void => {
    if (window.confirm("Are you sure you want to delete this word?")) {
      setEntries(entries.filter((entry) => entry.id !== id));
    }
  };

  const resetForm = (): void => {
    setEditingEntry(null);
    setNewEntry({
      word: "",
      pronunciation: "",
      partOfSpeech: "noun",
      definition: "",
      example: "",
      synonyms: "",
      antonyms: "",
      origin: "",
      category: "General",
    });
  };

  const resetModal = (): void => {
    setIsAddModalOpen(false);
    resetForm();
  };

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      !searchTerm ||
      entry.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.example.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.synonyms.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      entry.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesPartOfSpeech =
      selectedPartOfSpeech === "all" ||
      entry.partOfSpeech.toLowerCase() === selectedPartOfSpeech.toLowerCase();

    return matchesSearch && matchesCategory && matchesPartOfSpeech;
  });

  const uniqueCategories = [...new Set(entries.map((entry) => entry.category))];

  const handleInputChange = (
    field: keyof NewEntryForm,
    value: string
  ): void => {
    setNewEntry((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = (): boolean => {
    return !!(newEntry.word && newEntry.definition);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <Book className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              Manage Dictionary
            </h1>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Word</span>
          </button>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search words, definitions, examples..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Categories</option>
              {uniqueCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={selectedPartOfSpeech}
              onChange={(e) => setSelectedPartOfSpeech(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Parts of Speech</option>
              {partsOfSpeech.map((pos) => (
                <option key={pos} value={pos}>
                  {pos.charAt(0).toUpperCase() + pos.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Stats */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredEntries.length} of {entries.length} words
          </div>
        </div>

        {/* Dictionary Entries List */}
        <div className="space-y-4">
          {filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-2xl font-bold text-indigo-900">
                      {entry.word}
                    </h3>
                    <span className="text-gray-500 text-sm">
                      {entry.pronunciation}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {entry.partOfSpeech}
                    </span>
                    <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {entry.category}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditEntry(entry)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                    title="Edit Word"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteEntry(entry.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                    title="Delete Word"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="font-semibold text-gray-700">
                    Definition:{" "}
                  </span>
                  <span className="text-gray-600">{entry.definition}</span>
                </div>

                {entry.example && (
                  <div>
                    <span className="font-semibold text-gray-700">
                      Example:{" "}
                    </span>
                    <span className="text-gray-600 italic">
                      "{entry.example}"
                    </span>
                  </div>
                )}

                {entry.synonyms && (
                  <div>
                    <span className="font-semibold text-gray-700">
                      Synonyms:{" "}
                    </span>
                    <span className="text-gray-600">{entry.synonyms}</span>
                  </div>
                )}

                {entry.antonyms && (
                  <div>
                    <span className="font-semibold text-gray-700">
                      Antonyms:{" "}
                    </span>
                    <span className="text-gray-600">{entry.antonyms}</span>
                  </div>
                )}

                {entry.origin && (
                  <div className="flex items-start space-x-2">
                    <Globe className="h-4 w-4 text-gray-400 mt-0.5" />
                    <div>
                      <span className="font-semibold text-gray-700">
                        Origin:{" "}
                      </span>
                      <span className="text-gray-600 text-sm">
                        {entry.origin}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {filteredEntries.length === 0 && (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Book className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No words found
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ||
                selectedCategory !== "all" ||
                selectedPartOfSpeech !== "all"
                  ? "Try adjusting your search criteria or filters."
                  : "Start by adding your first word."}
              </p>
              {!searchTerm &&
                selectedCategory === "all" &&
                selectedPartOfSpeech === "all" && (
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                  >
                    Add First Word
                  </button>
                )}
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingEntry ? "Edit Word" : "Add New Word"}
                </h2>
                <button
                  onClick={resetModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Word *
                    </label>
                    <input
                      type="text"
                      value={newEntry.word}
                      onChange={(e) =>
                        handleInputChange("word", e.target.value)
                      }
                      placeholder="e.g., Ephemeral"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pronunciation
                    </label>
                    <input
                      type="text"
                      value={newEntry.pronunciation}
                      onChange={(e) =>
                        handleInputChange("pronunciation", e.target.value)
                      }
                      placeholder="e.g., /ɪˈfɛm(ə)r(ə)l/"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Part of Speech
                    </label>
                    <select
                      value={newEntry.partOfSpeech}
                      onChange={(e) =>
                        handleInputChange("partOfSpeech", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {partsOfSpeech.map((pos) => (
                        <option key={pos} value={pos}>
                          {pos.charAt(0).toUpperCase() + pos.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <input
                      type="text"
                      value={newEntry.category}
                      onChange={(e) =>
                        handleInputChange("category", e.target.value)
                      }
                      placeholder="e.g., Academic, General"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Definition *
                  </label>
                  <textarea
                    value={newEntry.definition}
                    onChange={(e) =>
                      handleInputChange("definition", e.target.value)
                    }
                    placeholder="Enter the definition"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Example
                  </label>
                  <textarea
                    value={newEntry.example}
                    onChange={(e) =>
                      handleInputChange("example", e.target.value)
                    }
                    placeholder="Enter an example sentence"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Synonyms
                  </label>
                  <input
                    type="text"
                    value={newEntry.synonyms}
                    onChange={(e) =>
                      handleInputChange("synonyms", e.target.value)
                    }
                    placeholder="e.g., fleeting, transient, momentary (comma separated)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Antonyms
                  </label>
                  <input
                    type="text"
                    value={newEntry.antonyms}
                    onChange={(e) =>
                      handleInputChange("antonyms", e.target.value)
                    }
                    placeholder="e.g., permanent, lasting, enduring (comma separated)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Origin/Etymology
                  </label>
                  <input
                    type="text"
                    value={newEntry.origin}
                    onChange={(e) =>
                      handleInputChange("origin", e.target.value)
                    }
                    placeholder="e.g., Greek ephēmeros 'lasting only a day'"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 p-6 border-t bg-gray-50">
                <button
                  onClick={resetModal}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingEntry ? handleUpdateEntry : handleAddEntry}
                  disabled={!isFormValid()}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span>{editingEntry ? "Update" : "Add"} Word</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageDictionaryPage;
