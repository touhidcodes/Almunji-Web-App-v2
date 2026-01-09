"use client";
import { Book, Edit, Plus, Save, Search, Trash2, X } from "lucide-react";
import React, { useEffect, useState } from "react";

interface Para {
  id: string;
  number: number;
  arabic: string;
  english?: string;
  bangla?: string;
  startAyahRef: string;
  endAyahRef: string;
}

interface NewParaForm {
  number: string;
  arabic: string;
  english: string;
  bangla: string;
  startAyahRef: string;
  endAyahRef: string;
}

const ManageParaPage: React.FC = () => {
  const [paras, setParas] = useState<Para[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPara, setEditingPara] = useState<Para | null>(null);
  const [newPara, setNewPara] = useState<NewParaForm>({
    number: "",
    arabic: "",
    english: "",
    bangla: "",
    startAyahRef: "",
    endAyahRef: "",
  });

  // Sample data
  useEffect(() => {
    const sampleParas: Para[] = [
      {
        id: "1",
        number: 1,
        arabic: "الم",
        english: "Alif Lam Meem",
        bangla: "আলিফ লাম মীম",
        startAyahRef: "2:1",
        endAyahRef: "2:141",
      },
      {
        id: "2",
        number: 2,
        arabic: "سَيَقُولُ",
        english: "Sayaqulu",
        bangla: "সায়াকুলু",
        startAyahRef: "2:142",
        endAyahRef: "2:252",
      },
      {
        id: "3",
        number: 3,
        arabic: "تِلْكَ الرُّسُلُ",
        english: "Tilkar Rusul",
        bangla: "তিলকার রুসুল",
        startAyahRef: "2:253",
        endAyahRef: "3:92",
      },
    ];
    setParas(sampleParas);
  }, []);

  const generateId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleAddPara = (): void => {
    if (
      newPara.number &&
      newPara.arabic &&
      newPara.startAyahRef &&
      newPara.endAyahRef
    ) {
      const para: Para = {
        id: generateId(),
        number: parseInt(newPara.number, 10),
        arabic: newPara.arabic,
        english: newPara.english || undefined,
        bangla: newPara.bangla || undefined,
        startAyahRef: newPara.startAyahRef,
        endAyahRef: newPara.endAyahRef,
      };
      setParas([...paras, para].sort((a, b) => a.number - b.number));
      resetForm();
    }
  };

  const handleEditPara = (para: Para): void => {
    setEditingPara(para);
    setNewPara({
      number: para.number.toString(),
      arabic: para.arabic,
      english: para.english || "",
      bangla: para.bangla || "",
      startAyahRef: para.startAyahRef,
      endAyahRef: para.endAyahRef,
    });
    setIsAddModalOpen(true);
  };

  const handleUpdatePara = (): void => {
    if (!editingPara) return;

    const updatedPara: Para = {
      id: editingPara.id,
      number: parseInt(newPara.number, 10),
      arabic: newPara.arabic,
      english: newPara.english || undefined,
      bangla: newPara.bangla || undefined,
      startAyahRef: newPara.startAyahRef,
      endAyahRef: newPara.endAyahRef,
    };

    setParas(
      paras
        .map((para) => (para.id === editingPara.id ? updatedPara : para))
        .sort((a, b) => a.number - b.number)
    );
    resetForm();
  };

  const handleDeletePara = (id: string): void => {
    if (window.confirm("Are you sure you want to delete this Para?")) {
      setParas(paras.filter((para) => para.id !== id));
    }
  };

  const resetForm = (): void => {
    setIsAddModalOpen(false);
    setEditingPara(null);
    setNewPara({
      number: "",
      arabic: "",
      english: "",
      bangla: "",
      startAyahRef: "",
      endAyahRef: "",
    });
  };

  const filteredParas = paras.filter((para) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      para.number.toString().includes(search) ||
      para.arabic.includes(searchTerm) ||
      para.english?.toLowerCase().includes(search) ||
      para.bangla?.includes(searchTerm) ||
      para.startAyahRef.toLowerCase().includes(search) ||
      para.endAyahRef.toLowerCase().includes(search)
    );
  });

  const handleInputChange = (field: keyof NewParaForm, value: string): void => {
    setNewPara((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = (): boolean => {
    return !!(
      newPara.number &&
      newPara.arabic &&
      newPara.startAyahRef &&
      newPara.endAyahRef
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-100 p-3 rounded-lg">
                <Book className="h-8 w-8 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Manage Paras
                </h1>
                <p className="text-gray-600">
                  Add, edit, and organize Quranic Paras
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Add Para</span>
            </button>
          </div>
        </div>

        {/* Search Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by para number, Arabic, English, Bangla, or Ayah reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <p className="text-gray-600">
            Showing {filteredParas.length} of {paras.length} paras
          </p>
        </div>

        {/* Paras List */}
        <div className="space-y-4">
          {filteredParas.map((para) => (
            <div
              key={para.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-emerald-100 px-4 py-2 rounded-lg">
                    <span className="text-emerald-700 font-bold text-lg">
                      Para {para.number}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Range:</span>{" "}
                    {para.startAyahRef} → {para.endAyahRef}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditPara(para)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                    title="Edit Para"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeletePara(para.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                    title="Delete Para"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-amber-50 p-4 rounded-lg">
                  <p
                    className="text-2xl text-right"
                    style={{ fontFamily: "Arial, sans-serif" }}
                  >
                    {para.arabic}
                  </p>
                </div>

                {para.english && (
                  <div className="border-l-4 border-emerald-500 pl-4">
                    <p className="text-sm text-gray-600 mb-1">English:</p>
                    <p className="text-gray-800">{para.english}</p>
                  </div>
                )}

                {para.bangla && (
                  <div className="border-l-4 border-teal-500 pl-4">
                    <p className="text-sm text-gray-600 mb-1">বাংলা:</p>
                    <p className="text-gray-800">{para.bangla}</p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {filteredParas.length === 0 && (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <Book className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No paras found
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm
                  ? "Try adjusting your search criteria."
                  : "Start by adding your first para."}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
                >
                  Add First Para
                </button>
              )}
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingPara ? "Edit Para" : "Add New Para"}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Para Number *
                  </label>
                  <input
                    type="number"
                    value={newPara.number}
                    onChange={(e) =>
                      handleInputChange("number", e.target.value)
                    }
                    placeholder="1"
                    min="1"
                    max="30"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Arabic Name *
                  </label>
                  <input
                    type="text"
                    value={newPara.arabic}
                    onChange={(e) =>
                      handleInputChange("arabic", e.target.value)
                    }
                    placeholder="Enter Arabic name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-right"
                    style={{ fontFamily: "Arial, sans-serif" }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    English Name
                  </label>
                  <input
                    type="text"
                    value={newPara.english}
                    onChange={(e) =>
                      handleInputChange("english", e.target.value)
                    }
                    placeholder="Enter English transliteration"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bangla Name
                  </label>
                  <input
                    type="text"
                    value={newPara.bangla}
                    onChange={(e) =>
                      handleInputChange("bangla", e.target.value)
                    }
                    placeholder="বাংলা নাম লিখুন"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Ayah Reference *
                    </label>
                    <input
                      type="text"
                      value={newPara.startAyahRef}
                      onChange={(e) =>
                        handleInputChange("startAyahRef", e.target.value)
                      }
                      placeholder="2:1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Ayah Reference *
                    </label>
                    <input
                      type="text"
                      value={newPara.endAyahRef}
                      onChange={(e) =>
                        handleInputChange("endAyahRef", e.target.value)
                      }
                      placeholder="2:141"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 px-6 py-4 bg-gray-50 rounded-b-xl">
                <button
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingPara ? handleUpdatePara : handleAddPara}
                  disabled={!isFormValid()}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span>{editingPara ? "Update" : "Add"} Para</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageParaPage;
