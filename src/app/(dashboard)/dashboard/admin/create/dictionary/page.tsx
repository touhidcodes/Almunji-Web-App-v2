"use client";
import { AlertCircle, ArrowLeft, Book, Save } from "lucide-react";
import React, { useState } from "react";

interface DictionaryEntry {
  id?: string;
  word: string;
  pronunciation: string;
  definition: string;
  isDeleted?: boolean;
}

interface FormErrors {
  word?: string;
  pronunciation?: string;
  definition?: string;
}

const CreateDictionaryPage: React.FC = () => {
  const [formData, setFormData] = useState<DictionaryEntry>({
    word: "",
    pronunciation: "",
    definition: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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

  const handleInputChange = (
    field: keyof DictionaryEntry,
    value: string
  ): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.word.trim()) {
      newErrors.word = "Word is required";
    } else if (formData.word.trim().length < 1) {
      newErrors.word = "Word must be at least 1 character";
    }

    if (!formData.pronunciation.trim()) {
      newErrors.pronunciation = "Pronunciation is required";
    } else if (formData.pronunciation.trim().length < 1) {
      newErrors.pronunciation = "Pronunciation must be at least 1 character";
    }

    if (!formData.definition.trim()) {
      newErrors.definition = "Definition is required";
    } else if (formData.definition.trim().length < 1) {
      newErrors.definition = "Definition must be at least 1 character";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newEntry: DictionaryEntry = {
        ...formData,
        id: generateUUID(),
        isDeleted: false,
      };

      console.log("Created dictionary entry:", newEntry);

      // Show success message
      setSubmitSuccess(true);
      setIsSubmitting(false);

      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({
          word: "",
          pronunciation: "",
          definition: "",
        });
        setSubmitSuccess(false);
      }, 2000);
    }, 1000);
  };

  const handleReset = (): void => {
    setFormData({
      word: "",
      pronunciation: "",
      definition: "",
    });
    setErrors({});
    setSubmitSuccess(false);
  };

  const isFormValid = (): boolean => {
    return !!(
      formData.word.trim() &&
      formData.pronunciation.trim() &&
      formData.definition.trim()
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center space-x-3">
            <Book className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              Create New Dictionary Entry
            </h1>
          </div>
          <p className="text-gray-600 mt-2">
            Add a new word to your dictionary with its pronunciation and
            definition.
          </p>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center space-x-3">
            <div className="shrink-0">
              <svg
                className="h-5 w-5 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-green-800">
                Dictionary entry created successfully!
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-8 space-y-6">
            {/* Word Field */}
            <div>
              <label
                htmlFor="word"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Word <span className="text-red-500">*</span>
              </label>
              <input
                id="word"
                type="text"
                value={formData.word}
                onChange={(e) => handleInputChange("word", e.target.value)}
                placeholder="e.g., Ephemeral"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                  errors.word
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {errors.word && (
                <div className="mt-2 flex items-center space-x-1 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.word}</span>
                </div>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Enter the word you want to add to the dictionary
              </p>
            </div>

            {/* Pronunciation Field */}
            <div>
              <label
                htmlFor="pronunciation"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Pronunciation <span className="text-red-500">*</span>
              </label>
              <input
                id="pronunciation"
                type="text"
                value={formData.pronunciation}
                onChange={(e) =>
                  handleInputChange("pronunciation", e.target.value)
                }
                placeholder="e.g., /ɪˈfɛm(ə)r(ə)l/"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                  errors.pronunciation
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {errors.pronunciation && (
                <div className="mt-2 flex items-center space-x-1 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.pronunciation}</span>
                </div>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Enter the phonetic pronunciation of the word
              </p>
            </div>

            {/* Definition Field */}
            <div>
              <label
                htmlFor="definition"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Definition <span className="text-red-500">*</span>
              </label>
              <textarea
                id="definition"
                value={formData.definition}
                onChange={(e) =>
                  handleInputChange("definition", e.target.value)
                }
                placeholder="Enter the definition of the word"
                rows={6}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none ${
                  errors.definition
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {errors.definition && (
                <div className="mt-2 flex items-center space-x-1 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.definition}</span>
                </div>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Provide a clear and concise definition
              </p>
            </div>

            {/* Character Count */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Form Summary
              </h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Word:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {formData.word.length} chars
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Pronunciation:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {formData.pronunciation.length} chars
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Definition:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {formData.definition.length} chars
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-between items-center p-6 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              disabled={isSubmitting}
            >
              Reset Form
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isFormValid() || isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg flex items-center space-x-2 transition-colors font-medium shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>Create Entry</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            Tips for creating entries:
          </h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>
              All fields are required and must contain at least 1 character
            </li>
            <li>
              Use IPA (International Phonetic Alphabet) for pronunciation when
              possible
            </li>
            <li>Keep definitions clear, concise, and accurate</li>
            <li>You can edit entries later from the Manage Dictionary page</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateDictionaryPage;
