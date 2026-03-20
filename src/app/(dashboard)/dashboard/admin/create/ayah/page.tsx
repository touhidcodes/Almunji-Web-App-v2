"use client";

import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";
import FormSelect from "@/components/forms/FormSelect";
import FormTextarea from "@/components/forms/FormTextarea";
import Loading from "@/components/shared/Loading/Loading";
import { useCreateAyahMutation } from "@/redux/api/ayahApi";
import { useGetAllParasQuery } from "@/redux/api/paraApi";
import { useGetAllSurahQuery } from "@/redux/api/surahApi";
import { AyahSchema } from "@/schema/ayahSchema";
import { TCreateAyahPayload } from "@/types/ayah";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, Save } from "lucide-react";
import React from "react";
import { toast } from "sonner";

const CreateAyahPage: React.FC = () => {
  const [createAyah, { isLoading: isSubmitting }] = useCreateAyahMutation();
  const { data: surahsData, isLoading: surahsLoading } = useGetAllSurahQuery();
  const { data: parasData, isLoading: parasLoading } = useGetAllParasQuery();

  const surahOptions =
    surahsData?.data?.map((surah) => ({
      label: `${surah.chapter}. ${surah.english} (${surah.arabic})`,
      value: surah.id,
    })) || [];

  const paraOptions =
    parasData?.data?.map((para) => ({
      label: `Para ${para.number} - ${para.name}`,
      value: para.id,
    })) || [];

  const onSubmit = async (data: TCreateAyahPayload) => {
    try {
      const res = await createAyah(data).unwrap();
      if (res.success) {
        toast.success("Ayah created successfully!");
      } else {
        toast.error(res.message || "Failed to create ayah");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong!");
    }
  };

  if (surahsLoading || parasLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-poppins">
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

        {/* Main Form */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <FormContainer
              onSubmit={onSubmit}
              resolver={zodResolver(AyahSchema)}
              defaultValues={{
                number: 1,
              }}
            >
              {/* Basic Information Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormSelect
                    name="surahId"
                    label="Surah *"
                    options={surahOptions}
                    placeholder="Select Surah"
                    required
                  />

                  <FormSelect
                    name="paraId"
                    label="Para *"
                    options={paraOptions}
                    placeholder="Select Para"
                    required
                  />

                  <FormInput
                    name="number"
                    label="Ayah Number *"
                    type="number"
                    placeholder="1"
                    required
                  />
                </div>
              </div>

              {/* Text Content Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Text Content
                </h3>

                <div className="space-y-4">
                  <FormTextarea
                    name="arabic"
                    label="Arabic Text *"
                    rows={3}
                    placeholder="بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ"
                    className="text-right text-xl"
                    required
                  />

                  <FormTextarea
                    name="transliteration"
                    label="Transliteration"
                    rows={2}
                    placeholder="Bismillaahir Rahmaanir Raheem"
                  />

                  <FormTextarea
                    name="english"
                    label="English Translation"
                    rows={3}
                    placeholder="In the name of Allah, the Most Gracious, the Most Merciful"
                  />

                  <FormTextarea
                    name="bangla"
                    label="Bangla Translation"
                    rows={3}
                    placeholder="পরম করুণাময় অসীম দয়ালু আল্লাহর নামে"
                  />
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
              </div>
            </FormContainer>
          </div>
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
            <li>• Use proper Surah and Para references</li>
            <li>• Verify Ayah numbers are correct</li>
            <li>• All required fields must be filled before submission</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateAyahPage;
