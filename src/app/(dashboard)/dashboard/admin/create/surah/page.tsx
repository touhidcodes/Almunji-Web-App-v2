"use client";

import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";
import FormSelect from "@/components/forms/FormSelect";
import FormTextarea from "@/components/forms/FormTextarea";
import { useCreateSurahMutation } from "@/redux/api/surahApi";
import { SurahSchema } from "@/schema/surahSchema";
import { TCreateSurahPayload } from "@/types/surah";
import { zodResolver } from "@hookform/resolvers/zod";
import { Book, Save } from "lucide-react";
import React from "react";
import { toast } from "sonner";

const CreateSurahPage: React.FC = () => {
  const [createSurah, { isLoading: isSubmitting }] = useCreateSurahMutation();

  const revelationOptions = [
    { label: "Meccan", value: "Meccan" },
    { label: "Medinan", value: "Medinan" },
  ];

  const onSubmit = async (data: TCreateSurahPayload) => {
    try {
      const res = await createSurah(data).unwrap();
      if (res.success) {
        toast.success("Surah created successfully!");
      } else {
        toast.error(res.message || "Failed to create surah");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-poppins">
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

        {/* Main Form */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <FormContainer
              onSubmit={onSubmit}
              resolver={zodResolver(SurahSchema)}
              defaultValues={{
                chapter: 1,
                totalAyah: 1,
                revelation: "Meccan",
              }}
            >
              {/* Basic Information Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    name="chapter"
                    label="Chapter Number *"
                    type="number"
                    placeholder="1-114"
                    required
                  />
                  <FormInput
                    name="totalAyah"
                    label="Total Ayahs *"
                    type="number"
                    placeholder="7"
                    required
                  />
                </div>
              </div>

              {/* Names Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Names & Translation
                </h3>

                <div className="space-y-4">
                  <FormInput
                    name="arabic"
                    label="Arabic Name *"
                    placeholder="الفاتحة"
                    className="text-right text-xl"
                    required
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      name="english"
                      label="English Name *"
                      placeholder="Al-Fatihah"
                      required
                    />
                    <FormInput
                      name="bangla"
                      label="Bangla Name"
                      placeholder="আল-ফাতিহা"
                    />
                  </div>
                </div>
              </div>

              {/* Revelation Information Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Revelation Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormSelect
                    name="revelation"
                    label="Revelation Type *"
                    options={revelationOptions}
                    placeholder="Select Type"
                    required
                  />
                </div>
              </div>

              {/* Content Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Historical Context
                </h3>

                <div className="space-y-4">
                  <FormTextarea
                    name="history"
                    label="History & Description"
                    rows={5}
                    placeholder="Brief introduction and historical background about this Surah..."
                  />
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
                      Creating Surah...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Create Surah
                    </>
                  )}
                </button>
              </div>
            </FormContainer>
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
      </div>
    </div>
  );
};

export default CreateSurahPage;
