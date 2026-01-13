"use client";

import { AlertCircle, Book, Calendar, Check, Save, X } from "lucide-react";
import React, { useState } from "react";

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

interface SurahFormData {
  chapter: string;
  arabic: string;
  english: string;
  bangla: string;
  totalAyah: string;
  revelation: string;
  history: string;
}

interface FormErrors {
  [key: string]: string;
}

const CreateSurahPage: React.FC = () => {
  const [formData, setFormData] = useState<SurahFormData>({
    chapter: "",
    arabic: "",
    english: "",
    bangla: "",
    totalAyah: "",
    revelation: "",
    history: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  const revelationTypes = ["Meccan", "Medinan"];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const chapterValue = parseInt(formData.chapter, 10);
    if (
      !formData.chapter ||
      isNaN(chapterValue) ||
      chapterValue < 1 ||
      chapterValue > 114
    ) {
      newErrors.chapter = "Chapter number must be between 1 and 114";
    }

    if (!formData.arabic.trim()) {
      newErrors.arabic = "Arabic name is required";
    }

    if (!formData.english.trim()) {
      newErrors.english = "English name is required";
    }

    if (!formData.revelation) {
      newErrors.revelation = "Revelation type is required";
    }

    const totalAyahValue = parseInt(formData.totalAyah, 10);
    if (!formData.totalAyah || isNaN(totalAyahValue) || totalAyahValue < 1) {
      newErrors.totalAyah = "Total ayahs must be a positive number";
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
      // Create the surah object matching TSurah type
      const now = new Date().toISOString();
      const newSurah: TSurah = {
        id: Date.now().toString(),
        chapter: parseInt(formData.chapter),
        totalAyah: parseInt(formData.totalAyah),
        arabic: formData.arabic,
        english: formData.english,
        bangla: formData.bangla || null,
        revelation: formData.revelation,
        history: formData.history || null,
        createdAt: now,
        updatedAt: now,
      };

      // Simulate API call
      await new Promise<void>((resolve) => setTimeout(resolve, 1500));

      console.log("Created Surah:", newSurah);
      setSubmitSuccess(true);

      // Reset form after successful submission
      setTimeout(() => {
        resetFormData();
        setSubmitSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error submitting surah:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetFormData = (): void => {
    setFormData({
      chapter: "",
      arabic: "",
      english: "",
      bangla: "",
      totalAyah: "",
      revelation: "",
      history: "",
    });
  };

  const handleReset = (): void => {
    resetFormData();
    setErrors({});
    setSubmitSuccess(false);
  };

  const renderInputField = (
    name: keyof SurahFormData,
    label: string,
    type: string = "text",
    placeholder: string = "",
    required: boolean = false,
    min?: string | number,
    max?: string | number,
    additionalProps?: React.InputHTMLAttributes<HTMLInputElement>
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleInputChange}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
          errors[name] ? "border-red-500" : "border-gray-300"
        }`}
        placeholder={placeholder}
        min={min}
        max={max}
        {...additionalProps}
      />
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {errors[name]}
        </p>
      )}
    </div>
  );

  const renderSelectField = (
    name: keyof SurahFormData,
    label: string,
    options: readonly string[],
    required: boolean = false,
    defaultOption: string = "Select"
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={formData[name]}
        onChange={handleInputChange}
        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
          errors[name] ? "border-red-500" : "border-gray-300"
        }`}
      >
        <option value="">{defaultOption}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {errors[name]}
        </p>
      )}
    </div>
  );

  const renderTextAreaField = (
    name: keyof SurahFormData,
    label: string,
    rows: number = 3,
    placeholder: string = ""
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <textarea
        name={name}
        value={formData[name]}
        onChange={handleInputChange}
        rows={rows}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Book className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Create New Surah
            </h1>
          </div>
          <p className="text-gray-600">
            Add a new Surah to the database with complete information and
            metadata.
          </p>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600" />
            <span className="text-green-800 font-medium">
              Surah created successfully!
            </span>
          </div>
        )}

        {/* Main Form */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            {/* Basic Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderInputField(
                  "chapter",
                  "Chapter Number",
                  "number",
                  "1-114",
                  true,
                  1,
                  114
                )}
                {renderInputField(
                  "totalAyah",
                  "Total Ayahs",
                  "number",
                  "7",
                  true,
                  1
                )}
              </div>
            </div>

            {/* Names Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                Names & Translation
              </h3>

              <div className="space-y-4">
                {renderInputField(
                  "arabic",
                  "Arabic Name",
                  "text",
                  "الفاتحة",
                  true,
                  undefined,
                  undefined,
                  {
                    style: {
                      fontFamily: "Arial, sans-serif",
                      fontSize: "18px",
                      textAlign: "right" as const,
                    },
                  }
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {renderInputField(
                    "english",
                    "English Name",
                    "text",
                    "Al-Fatihah",
                    true
                  )}
                  {renderInputField(
                    "bangla",
                    "Bangla Name",
                    "text",
                    "আল-ফাতিহা"
                  )}
                </div>
              </div>
            </div>

            {/* Revelation Information Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                Revelation Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderSelectField(
                  "revelation",
                  "Revelation Type",
                  revelationTypes,
                  true,
                  "Select Type"
                )}
              </div>
            </div>

            {/* Content Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                Historical Context
              </h3>

              <div className="space-y-4">
                {renderTextAreaField(
                  "history",
                  "History & Description",
                  5,
                  "Brief introduction and historical background about this Surah..."
                )}
              </div>
            </div>

            {/* Preview Section */}
            {(formData.arabic || formData.english) && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Preview
                </h3>
                <div className="bg-linear-to-r from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div className="flex-1">
                      {formData.chapter && (
                        <div className="text-sm text-purple-700 font-medium mb-1">
                          Chapter {formData.chapter}
                        </div>
                      )}

                      <div className="flex items-center gap-4 mb-2 flex-wrap">
                        {formData.arabic && (
                          <div
                            className="text-2xl font-bold text-gray-900"
                            style={{ fontFamily: "Arial, sans-serif" }}
                          >
                            {formData.arabic}
                          </div>
                        )}
                        {formData.english && (
                          <div className="text-xl font-bold text-gray-800">
                            {formData.english}
                          </div>
                        )}
                      </div>

                      {formData.bangla && (
                        <div className="text-lg text-gray-600 mb-2">
                          {formData.bangla}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 md:mt-0 text-sm text-gray-600 space-y-1">
                      {formData.revelation && (
                        <div className="flex items-center gap-1">
                          <span
                            className={`inline-block w-2 h-2 rounded-full ${
                              formData.revelation === "Meccan"
                                ? "bg-orange-400"
                                : "bg-green-400"
                            }`}
                          ></span>
                          {formData.revelation}
                        </div>
                      )}
                      {formData.totalAyah && (
                        <div>{formData.totalAyah} Ayahs</div>
                      )}
                    </div>
                  </div>

                  {formData.history && (
                    <div className="text-gray-700 leading-relaxed mt-4 pt-4 border-t border-purple-200">
                      <p className="font-medium text-sm text-purple-700 mb-2">
                        History & Context:
                      </p>
                      {formData.history}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Creating Surah...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Create Surah
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
          </div>
        </div>

        {/* Guidelines */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mt-6">
          <h4 className="font-semibold text-amber-900 mb-3">
            Guidelines for Adding Surahs
          </h4>
          <ul className="text-amber-800 text-sm space-y-2">
            <li>• Ensure Arabic names are accurate and properly formatted</li>
            <li>• Verify chapter number and total ayah count</li>
            <li>• Include both English and Bangla names if available</li>
            <li>• Specify revelation type (Meccan/Medinan)</li>
            <li>• Add relevant historical context and description</li>
            <li>• Double-check all numerical data before submission</li>
          </ul>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-lg border p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">114</div>
            <div className="text-sm text-gray-600">Total Surahs</div>
          </div>
          <div className="bg-white rounded-lg border p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">86</div>
            <div className="text-sm text-gray-600">Meccan Surahs</div>
          </div>
          <div className="bg-white rounded-lg border p-4 text-center">
            <div className="text-2xl font-bold text-green-600">28</div>
            <div className="text-sm text-gray-600">Medinan Surahs</div>
          </div>
          <div className="bg-white rounded-lg border p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">6,236</div>
            <div className="text-sm text-gray-600">Total Ayahs</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSurahPage;
