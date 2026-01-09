"use client";

import { AlertCircle, BookOpen, Check, Save, X } from "lucide-react";
import React, { ChangeEvent, useState } from "react";

interface FormData {
  number: string;
  arabic: string;
  english: string;
  bangla: string;
  startAyahRef: string;
  endAyahRef: string;
}

interface FormErrors {
  [key: string]: string;
}

const CreateParaPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    number: "",
    arabic: "",
    english: "",
    bangla: "",
    startAyahRef: "",
    endAyahRef: "",
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

  const validateAyahRef = (ref: string): boolean => {
    // Format: Surah:Ayah (e.g., "1:1" or "2:255")
    const ayahRefPattern = /^\d+:\d+$/;
    return ayahRefPattern.test(ref);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const paraNum = parseInt(formData.number);
    if (!formData.number || isNaN(paraNum) || paraNum < 1 || paraNum > 30) {
      newErrors.number = "Para number must be between 1 and 30";
    }

    if (!formData.arabic.trim()) {
      newErrors.arabic = "Arabic name is required";
    }

    if (!formData.startAyahRef.trim()) {
      newErrors.startAyahRef = "Start Ayah reference is required";
    } else if (!validateAyahRef(formData.startAyahRef)) {
      newErrors.startAyahRef = "Invalid format. Use Surah:Ayah (e.g., 1:1)";
    }

    if (!formData.endAyahRef.trim()) {
      newErrors.endAyahRef = "End Ayah reference is required";
    } else if (!validateAyahRef(formData.endAyahRef)) {
      newErrors.endAyahRef = "Invalid format. Use Surah:Ayah (e.g., 2:141)";
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
          number: "",
          arabic: "",
          english: "",
          bangla: "",
          startAyahRef: "",
          endAyahRef: "",
        });
        setSubmitSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error submitting para:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = (): void => {
    setFormData({
      number: "",
      arabic: "",
      english: "",
      bangla: "",
      startAyahRef: "",
      endAyahRef: "",
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
              Create New Para (Juz)
            </h1>
          </div>
          <p className="text-gray-600">
            Add a new Quranic Para (Juz) to the database with complete details
            and references.
          </p>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-2">
            <Check className="h-5 w-5 text-green-600" />
            <span className="text-green-800 font-medium">
              Para created successfully!
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

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Para Number *
                    </label>
                    <input
                      type="number"
                      name="number"
                      value={formData.number}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        errors.number ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="1-30"
                      min="1"
                      max="30"
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

              {/* Names Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Para Names
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Arabic Name *
                    </label>
                    <input
                      type="text"
                      name="arabic"
                      value={formData.arabic}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-right ${
                        errors.arabic ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="الم"
                      style={{
                        fontFamily: "Arial, sans-serif",
                        fontSize: "18px",
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
                      English Name
                    </label>
                    <input
                      type="text"
                      name="english"
                      value={formData.english}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Alif Lam Meem"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bangla Name
                    </label>
                    <input
                      type="text"
                      name="bangla"
                      value={formData.bangla}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="আলিফ লাম মীম"
                    />
                  </div>
                </div>
              </div>

              {/* Reference Information Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Ayah Range
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Ayah Reference *
                    </label>
                    <input
                      type="text"
                      name="startAyahRef"
                      value={formData.startAyahRef}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        errors.startAyahRef
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="1:1"
                    />
                    {errors.startAyahRef && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.startAyahRef}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Format: Surah:Ayah (e.g., 1:1)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Ayah Reference *
                    </label>
                    <input
                      type="text"
                      name="endAyahRef"
                      value={formData.endAyahRef}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        errors.endAyahRef ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="2:141"
                    />
                    {errors.endAyahRef && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.endAyahRef}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Format: Surah:Ayah (e.g., 2:141)
                    </p>
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
                      Creating Para...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Create Para
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
          {(formData.arabic || formData.number) && (
            <div className="p-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Preview
              </h3>
              <div className="bg-linear-to-r from-emerald-50 to-teal-50 rounded-lg p-6 border border-emerald-200">
                {formData.number && (
                  <div className="text-sm text-emerald-700 font-medium mb-3">
                    Para {formData.number}
                    {formData.startAyahRef &&
                      formData.endAyahRef &&
                      ` (${formData.startAyahRef} - ${formData.endAyahRef})`}
                  </div>
                )}

                {formData.arabic && (
                  <div
                    className="text-right mb-3 text-2xl"
                    style={{ fontFamily: "Arial, sans-serif" }}
                  >
                    {formData.arabic}
                  </div>
                )}

                {formData.english && (
                  <div className="text-gray-800 text-lg mb-2">
                    {formData.english}
                  </div>
                )}

                {formData.bangla && (
                  <div className="text-gray-700 text-base">
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
            Guidelines for Adding Para
          </h4>
          <ul className="text-blue-800 text-sm space-y-2">
            <li>• Para numbers range from 1 to 30</li>
            <li>• Arabic name is required for identification</li>
            <li>• English and Bangla names are optional but recommended</li>
            <li>
              • Start and End Ayah references must be in Surah:Ayah format
            </li>
            <li>• Verify the Ayah range is accurate</li>
            <li>
              • Each Para (Juz) contains approximately 20 pages of the Quran
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateParaPage;

