"use client";

import { AlertCircle, BookOpen, Check, Save, X } from "lucide-react";
import React, { ChangeEvent, useState } from "react";

interface FormData {
  surahId: string;
  paraId: string;
  number: number;
  arabic: string;
  transliteration?: string | null;
  bangla?: string | null;
  english?: string | null;
}

interface FormErrors {
  [key: string]: string;
}

const CreateAyahPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    surahId: "",
    paraId: "",
    number: 0,
    arabic: "",
    transliteration: "",
    bangla: "",
    english: "",
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
      [name]: name === "number" ? parseInt(value) || 0 : value,
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

    if (!formData.surahId.trim()) {
      newErrors.surahId = "Surah ID is required";
    }

    if (!formData.paraId.trim()) {
      newErrors.paraId = "Para ID is required";
    }

    if (!formData.number || formData.number < 1) {
      newErrors.number = "Valid ayah number is required";
    }

    if (!formData.arabic.trim()) {
      newErrors.arabic = "Arabic text is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
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
          surahId: "",
          paraId: "",
          number: 0,
          arabic: "",
          transliteration: "",
          bangla: "",
          english: "",
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
      surahId: "",
      paraId: "",
      number: 0,
      arabic: "",
      transliteration: "",
      bangla: "",
      english: "",
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
            <div>
              {/* Basic Information Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Surah ID *
                    </label>
                    <input
                      type="text"
                      name="surahId"
                      value={formData.surahId}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        errors.surahId ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="surah-001"
                    />
                    {errors.surahId && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.surahId}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Para ID *
                    </label>
                    <input
                      type="text"
                      name="paraId"
                      value={formData.paraId}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        errors.paraId ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="para-001"
                    />
                    {errors.paraId && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.paraId}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ayah Number *
                    </label>
                    <input
                      type="number"
                      name="number"
                      value={formData.number}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        errors.number ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="1"
                      min="1"
                    />
                    {errors.number && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.number}
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
                      name="arabic"
                      value={formData.arabic}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right ${
                        errors.arabic ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ"
                      style={{
                        fontFamily: "Arial, sans-serif",
                        fontSize: "18px",
                        lineHeight: "1.8",
                      }}
                    />
                    {errors.arabic && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.arabic}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transliteration
                    </label>
                    <textarea
                      name="transliteration"
                      value={formData.transliteration || ""}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Bismillaahir Rahmaanir Raheem"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      English Translation
                    </label>
                    <textarea
                      name="english"
                      value={formData.english || ""}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="In the name of Allah, the Most Gracious, the Most Merciful"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bangla Translation
                    </label>
                    <textarea
                      name="bangla"
                      value={formData.bangla || ""}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="পরম করুণাময় অসীম দয়ালু আল্লাহর নামে"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSubmit}
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
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  <X className="h-4 w-4" />
                  Reset Form
                </button>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          {(formData.arabic || formData.english) && (
            <div className="p-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Preview
              </h3>
              <div className="bg-linear-to-r from-emerald-50 to-teal-50 rounded-lg p-6 border border-emerald-200">
                {formData.surahId && formData.number > 0 && (
                  <div className="text-sm text-emerald-700 font-medium mb-3">
                    {formData.surahId} - Ayah {formData.number}
                    {formData.paraId && ` (Para: ${formData.paraId})`}
                  </div>
                )}

                {formData.arabic && (
                  <div
                    className="text-right mb-4 text-xl leading-relaxed"
                    style={{ fontFamily: "Arial, sans-serif" }}
                  >
                    {formData.arabic}
                  </div>
                )}

                {formData.transliteration && (
                  <div className="italic text-gray-600 mb-3 text-lg">
                    {formData.transliteration}
                  </div>
                )}

                {formData.english && (
                  <div className="text-gray-800 text-lg leading-relaxed mb-3">
                    <span className="font-medium text-sm text-gray-600">
                      English:{" "}
                    </span>
                    {formData.english}
                  </div>
                )}

                {formData.bangla && (
                  <div className="text-gray-800 text-lg leading-relaxed">
                    <span className="font-medium text-sm text-gray-600">
                      বাংলা:{" "}
                    </span>
                    {formData.bangla}
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
            <li>
              • Provide clear and faithful translations in English and Bangla
            </li>
            <li>• Include transliteration to help with pronunciation</li>
            <li>• Use proper Surah ID and Para ID references</li>
            <li>• Verify Ayah numbers are correct</li>
            <li>• All required fields must be filled before submission</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateAyahPage;
