"use client";

import { AlertCircle, Check, Heart, Save, X } from "lucide-react";
import React, { ChangeEvent, FormEvent, useState } from "react";

interface FormData {
  title: string;
  arabicText: string;
  transliteration: string;
  translation: string;
  category: string;
  source: string;
  hadithReference: string;
  occasion: string;
  benefits: string;
  tags: string;
  difficulty: string;
  frequency: string;
}

interface FormErrors {
  [key: string]: string;
}

type Category =
  | "Morning & Evening"
  | "Prayer (Salah)"
  | "Before & After Meals"
  | "Travel"
  | "Sleep & Waking"
  | "Protection"
  | "Forgiveness"
  | "Guidance"
  | "Health & Healing"
  | "Family & Relationships"
  | "Work & Study"
  | "Gratitude"
  | "Repentance (Tawbah)"
  | "Special Occasions"
  | "General Supplications";

type Difficulty = "Beginner" | "Intermediate" | "Advanced";

type Frequency =
  | "Daily"
  | "Weekly"
  | "As needed"
  | "Special occasions"
  | "Regularly";

const CreateDuaPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    arabicText: "",
    transliteration: "",
    translation: "",
    category: "",
    source: "",
    hadithReference: "",
    occasion: "",
    benefits: "",
    tags: "",
    difficulty: "",
    frequency: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  const categories: Category[] = [
    "Morning & Evening",
    "Prayer (Salah)",
    "Before & After Meals",
    "Travel",
    "Sleep & Waking",
    "Protection",
    "Forgiveness",
    "Guidance",
    "Health & Healing",
    "Family & Relationships",
    "Work & Study",
    "Gratitude",
    "Repentance (Tawbah)",
    "Special Occasions",
    "General Supplications",
  ];

  const difficulties: Difficulty[] = ["Beginner", "Intermediate", "Advanced"];

  const frequencies: Frequency[] = [
    "Daily",
    "Weekly",
    "As needed",
    "Special occasions",
    "Regularly",
  ];

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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

    if (!formData.title.trim()) {
      newErrors.title = "Dua title is required";
    }

    if (!formData.arabicText.trim()) {
      newErrors.arabicText = "Arabic text is required";
    }

    if (!formData.translation.trim()) {
      newErrors.translation = "Translation is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
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
          title: "",
          arabicText: "",
          transliteration: "",
          translation: "",
          category: "",
          source: "",
          hadithReference: "",
          occasion: "",
          benefits: "",
          tags: "",
          difficulty: "",
          frequency: "",
        });
        setSubmitSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error submitting dua:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = (): void => {
    setFormData({
      title: "",
      arabicText: "",
      transliteration: "",
      translation: "",
      category: "",
      source: "",
      hadithReference: "",
      occasion: "",
      benefits: "",
      tags: "",
      difficulty: "",
      frequency: "",
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
            <Heart className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">Create New Dua</h1>
          </div>
          <p className="text-gray-600">
            Add a new Islamic supplication (dua) to the database with complete
            details and references.
          </p>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600" />
            <span className="text-green-800 font-medium">
              Dua created successfully!
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dua Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.title ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="e.g., Morning Dhikr, Dua for Protection, Before Eating"
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.title}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.category ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat: Category) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.category}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Occasion/When to Recite
                    </label>
                    <input
                      type="text"
                      name="occasion"
                      value={formData.occasion}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., After Fajr prayer, Before sleeping, When traveling"
                    />
                  </div>
                </div>
              </div>

              {/* Text Content Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Dua Content
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
                      rows={4}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-right ${
                        errors.arabicText ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ"
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
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Allahumma a'inni 'ala dhikrika wa shukrika wa husni 'ibadatika"
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
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.translation
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="O Allah, help me to remember You, thank You, and worship You in the best manner"
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
                      Benefits & Virtues
                    </label>
                    <textarea
                      name="benefits"
                      value={formData.benefits}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Describe the spiritual benefits, rewards, or significance of this dua..."
                    />
                  </div>
                </div>
              </div>

              {/* Source & Reference Information Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Source & References
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Source
                    </label>
                    <input
                      type="text"
                      name="source"
                      value={formData.source}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., Quran, Sahih Bukhari, Sahih Muslim, Abu Dawud"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hadith Reference
                    </label>
                    <input
                      type="text"
                      name="hadithReference"
                      value={formData.hadithReference}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., Sahih Bukhari 6306, Abu Dawud 1522"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Additional Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty Level
                    </label>
                    <select
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select difficulty</option>
                      {difficulties.map((diff: Difficulty) => (
                        <option key={diff} value={diff}>
                          {diff}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Recommended Frequency
                    </label>
                    <select
                      name="frequency"
                      value={formData.frequency}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select frequency</option>
                      {frequencies.map((freq: Frequency) => (
                        <option key={freq} value={freq}>
                          {freq}
                        </option>
                      ))}
                    </select>
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="protection, gratitude, peace"
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
                  className="flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Creating Dua...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Create Dua
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
              <div className="bg-linear-to-r from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-200">
                {formData.title && (
                  <div className="text-lg font-semibold text-purple-900 mb-2">
                    {formData.title}
                  </div>
                )}

                {(formData.category || formData.occasion) && (
                  <div className="text-sm text-purple-700 mb-4">
                    {formData.category && `Category: ${formData.category}`}
                    {formData.category && formData.occasion && " • "}
                    {formData.occasion && `Occasion: ${formData.occasion}`}
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
                  <div className="text-gray-800 text-lg leading-relaxed mb-4">
                    {formData.translation}
                  </div>
                )}

                {formData.source && (
                  <div className="text-sm text-purple-700 font-medium">
                    Source: {formData.source}
                    {formData.hadithReference &&
                      ` (${formData.hadithReference})`}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Guidelines */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h4 className="font-semibold text-blue-900 mb-3">
            Guidelines for Adding Duas
          </h4>
          <ul className="text-blue-800 text-sm space-y-2">
            <li>• Ensure Arabic text is accurate and properly formatted</li>
            <li>• Provide authentic sources and references when available</li>
            <li>• Include clear translations and transliterations</li>
            <li>
              • Select appropriate categories and occasions for easy discovery
            </li>
            <li>• Add relevant tags to help with search and organization</li>
            <li>• Mention spiritual benefits and virtues when known</li>
            <li>• Verify authenticity from reliable Islamic sources</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateDuaPage;
