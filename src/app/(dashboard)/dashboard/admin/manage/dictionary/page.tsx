"use client";
import { Book, Edit, Plus, Save, Search, Trash2, X } from "lucide-react";
import React, { useEffect, useState } from "react";

interface DictionaryEntry {
  id?: string;
  word: string;
  pronunciation: string;
  definition: string;
  isDeleted?: boolean;
}

interface NewEntryForm {
  word: string;
  pronunciation: string;
  definition: string;
}

const ManageDictionaryPage: React.FC = () => {
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DictionaryEntry | null>(
    null
  );
  const [newEntry, setNewEntry] = useState<NewEntryForm>({
    word: "",
    pronunciation: "",
    definition: "",
  });

  // Generate UUID v4
  const generateUUID = (): string => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  };

  // Sample data
  useEffect(() => {
    const sampleEntries: DictionaryEntry[] = [
      {
        id: generateUUID(),
        word: "Ephemeral",
        pronunciation: "/ɪˈfɛm(ə)r(ə)l/",
        definition: "Lasting for a very short time; transitory.",
        isDeleted: false,
      },
      {
        id: generateUUID(),
        word: "Serendipity",
        pronunciation: "/ˌsɛrənˈdɪpɪti/",
        definition:
          "The occurrence of events by chance in a happy or beneficial way.",
        isDeleted: false,
      },
      {
        id: generateUUID(),
        word: "Ameliorate",
        pronunciation: "/əˈmiːliəreɪt/",
        definition: "To make something bad or unsatisfactory better.",
        isDeleted: false,
      },
    ];
    setEntries(sampleEntries);
  }, []);

  const handleAddEntry = (): void => {
    if (newEntry.word && newEntry.definition && newEntry.pronunciation) {
      const entry: DictionaryEntry = {
        ...newEntry,
        id: generateUUID(),
        isDeleted: false,
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
      definition: entry.definition,
    });
    setIsAddModalOpen(true);
  };

  const handleUpdateEntry = (): void => {
    if (!editingEntry) return;

    const updatedEntry: DictionaryEntry = {
      ...newEntry,
      id: editingEntry.id,
      isDeleted: editingEntry.isDeleted,
    };

    setEntries(
      entries.map((entry) =>
        entry.id === editingEntry.id ? updatedEntry : entry
      )
    );
    resetForm();
    setIsAddModalOpen(false);
  };

  const handleDeleteEntry = (id?: string): void => {
    if (!id) return;
    if (window.confirm("Are you sure you want to delete this word?")) {
      setEntries(
        entries.map((entry) =>
          entry.id === id ? { ...entry, isDeleted: true } : entry
        )
      );
    }
  };

  const resetForm = (): void => {
    setEditingEntry(null);
    setNewEntry({
      word: "",
      pronunciation: "",
      definition: "",
    });
  };

  const resetModal = (): void => {
    setIsAddModalOpen(false);
    resetForm();
  };

  const filteredEntries = entries.filter((entry) => {
    if (entry.isDeleted) return false;

    const matchesSearch =
      !searchTerm ||
      entry.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.pronunciation.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const handleInputChange = (
    field: keyof NewEntryForm,
    value: string
  ): void => {
    setNewEntry((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = (): boolean => {
    return !!(newEntry.word && newEntry.definition && newEntry.pronunciation);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
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

        {/* Search Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search words, definitions, pronunciation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Stats */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredEntries.length} of{" "}
            {entries.filter((e) => !e.isDeleted).length} words
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
                {searchTerm
                  ? "Try adjusting your search criteria."
                  : "Start by adding your first word."}
              </p>
              {!searchTerm && (
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
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Word *
                  </label>
                  <input
                    type="text"
                    value={newEntry.word}
                    onChange={(e) => handleInputChange("word", e.target.value)}
                    placeholder="e.g., Ephemeral"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pronunciation *
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
                    rows={4}
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
