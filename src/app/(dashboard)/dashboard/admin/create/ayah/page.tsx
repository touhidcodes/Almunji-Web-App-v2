"use client";

import { AlertCircle, BookOpen, Check, Save, X } from "lucide-react";
import React, { ChangeEvent, FormEvent, useState } from "react";

interface FormData {
  surahNumber: string;
  surahName: string;
  ayahNumber: string;
  arabicText: string;
  transliteration: string;
  translation: string;
  tafsir: string;
  tags: string;
  juz: string;
  hizb: string;
  rukuh: string;
}

interface FormErrors {
  [key: string]: string;
}

const CreateAyahPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    surahNumber: "",
    surahName: "",
    ayahNumber: "",
    arabicText: "",
    transliteration: "",
    translation: "",
    tafsir: "",
    tags: "",
    juz: "",
    hizb: "",
    rukuh: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev: FormErrors) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const surahNum = parseInt(formData.surahNumber);
    if (
      !formData.surahNumber ||
      isNaN(surahNum) ||
      surahNum < 1 ||
      surahNum > 114
    ) {
      newErrors.surahNumber = "Surah number must be between 1 and 114";
    }

    if (!formData.surahName.trim()) {
      newErrors.surahName = "Surah name is required";
    }

    const ayahNum = parseInt(formData.ayahNumber);
    if (!formData.ayahNumber || isNaN(ayahNum) || ayahNum < 1) {
      newErrors.ayahNumber = "Valid ayah number is required";
    }

    if (!formData.arabicText.trim()) {
      newErrors.arabicText = "Arabic text is required";
    }

    if (!formData.translation.trim()) {
      newErrors.translation = "Translation is required";
    }

    if (formData.juz) {
      const juzNum = parseInt(formData.juz);
      if (isNaN(juzNum) || juzNum < 1 || juzNum > 30) {
        newErrors.juz = "Juz must be between 1 and 30";
      }
    }

    if (formData.hizb) {
      const hizbNum = parseInt(formData.hizb);
      if (isNaN(hizbNum) || hizbNum < 1 || hizbNum > 60) {
        newErrors.hizb = "Hizb must be between 1 and 60";
      }
    }

    if (formData.rukuh) {
      const rukuhNum = parseInt(formData.rukuh);
      if (isNaN(rukuhNum) || rukuhNum < 1 || rukuhNum > 558) {
        newErrors.rukuh = "Rukuh must be between 1 and 558";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      // Simulate API call
      await new Promise<void>((resolve) => setTimeout(resolve, 1500));

      setSubmitSuccess(true);

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          surahNumber: "",
          surahName: "",
          ayahNumber: "",
          arabicText: "",
          transliteration: "",
          translation: "",
          tafsir: "",
          tags: "",
          juz: "",
          hizb: "",
          rukuh: "",
        });
        setSubmitSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error submitting ayah:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = (): void => {
    setFormData({
      surahNumber: "",
      surahName: "",
      ayahNumber: "",
      arabicText: "",
      transliteration: "",
      translation: "",
      tafsir: "",
      tags: "",
      juz: "",
      hizb: "",
      rukuh: "",
    });
    setErrors({});
    setSubmitSuccess(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="h-8 w-8 text-emerald-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Create New Ayah
            </h1>
          </div>
          <p className="text-gray-600">
            Add a new Quranic verse to the database with complete details and
            references.
          </p>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600" />
            <span className="text-green-800 font-medium">
              Ayah created successfully!
            </span>
          </div>
        )}

        {/* Main Form */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              {/* Basic Information Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Surah Number *
                    </label>
                    <input
                      type="number"
                      name="surahNumber"
                      value={formData.surahNumber}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        errors.surahNumber
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="1-114"
                      min="1"
                      max="114"
                    />
                    {errors.surahNumber && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.surahNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Surah Name *
                    </label>
                    <input
                      type="text"
                      name="surahName"
                      value={formData.surahName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        errors.surahName ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Al-Fatiha"
                    />
                    {errors.surahName && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.surahName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ayah Number *
                    </label>
                    <input
                      type="number"
                      name="ayahNumber"
                      value={formData.ayahNumber}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        errors.ayahNumber ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="1"
                      min="1"
                    />
                    {errors.ayahNumber && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.ayahNumber}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Text Content Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Text Content
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Arabic Text *
                    </label>
                    <textarea
                      name="arabicText"
                      value={formData.arabicText}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right ${
                        errors.arabicText ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ"
                      style={{
                        fontFamily: "Arial, sans-serif",
                        fontSize: "18px",
                        lineHeight: "1.8",
                      }}
                    />
                    {errors.arabicText && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.arabicText}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transliteration
                    </label>
                    <textarea
                      name="transliteration"
                      value={formData.transliteration}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Bismillaahir Rahmaanir Raheem"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Translation *
                    </label>
                    <textarea
                      name="translation"
                      value={formData.translation}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        errors.translation
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="In the name of Allah, the Most Gracious, the Most Merciful"
                    />
                    {errors.translation && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.translation}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tafsir (Commentary)
                    </label>
                    <textarea
                      name="tafsir"
                      value={formData.tafsir}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Brief explanation or commentary about this ayah..."
                    />
                  </div>
                </div>
              </div>

              {/* Reference Information Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Reference Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Juz (Para)
                    </label>
                    <input
                      type="number"
                      name="juz"
                      value={formData.juz}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        errors.juz ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="1-30"
                      min="1"
                      max="30"
                    />
                    {errors.juz && (
                      <p className="text-red-500 text-sm mt-1">{errors.juz}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hizb
                    </label>
                    <input
                      type="number"
                      name="hizb"
                      value={formData.hizb}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        errors.hizb ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="1-60"
                      min="1"
                      max="60"
                    />
                    {errors.hizb && (
                      <p className="text-red-500 text-sm mt-1">{errors.hizb}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rukuh
                    </label>
                    <input
                      type="number"
                      name="rukuh"
                      value={formData.rukuh}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        errors.rukuh ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="1-558"
                      min="1"
                      max="558"
                    />
                    {errors.rukuh && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.rukuh}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="prayer, guidance, mercy"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Separate tags with commas
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Creating Ayah...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Create Ayah
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  <X className="h-4 w-4" />
                  Reset Form
                </button>
              </div>
            </form>
          </div>

          {/* Preview Section */}
          {(formData.arabicText || formData.translation) && (
            <div className="p-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Preview
              </h3>
              <div className="bg-linear-to-r from-emerald-50 to-teal-50 rounded-lg p-6 border border-emerald-200">
                {formData.surahName && formData.ayahNumber && (
                  <div className="text-sm text-emerald-700 font-medium mb-3">
                    {formData.surahName} - Ayah {formData.ayahNumber}
                    {formData.juz && ` (Juz ${formData.juz})`}
                  </div>
                )}

                {formData.arabicText && (
                  <div
                    className="text-right mb-4 text-xl leading-relaxed"
                    style={{ fontFamily: "Arial, sans-serif" }}
                  >
                    {formData.arabicText}
                  </div>
                )}

                {formData.transliteration && (
                  <div className="italic text-gray-600 mb-3 text-lg">
                    {formData.transliteration}
                  </div>
                )}

                {formData.translation && (
                  <div className="text-gray-800 text-lg leading-relaxed">
                    {formData.translation}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Guidelines */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h4 className="font-semibold text-blue-900 mb-3">
            Guidelines for Adding Ayahs
          </h4>
          <ul className="text-blue-800 text-sm space-y-2">
            <li>• Ensure Arabic text is accurate and properly formatted</li>
            <li>• Provide clear and faithful translations</li>
            <li>• Include transliteration to help with pronunciation</li>
            <li>• Add relevant tags to help with categorization and search</li>
            <li>• Verify Surah and Ayah numbers are correct</li>
            <li>• Include Juz, Hizb, and Rukuh information when available</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateAyahPage;
