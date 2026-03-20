"use client";

import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";
import { useCreateParaMutation } from "@/redux/api/paraApi";
import { ParaSchema } from "@/schema/paraSchema";
import { TCreateParaPayload } from "@/types/para";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, Save } from "lucide-react";
import React from "react";
import { toast } from "sonner";

const CreateParaPage: React.FC = () => {
  const [createPara, { isLoading: isSubmitting }] = useCreateParaMutation();

  const onSubmit = async (data: TCreateParaPayload) => {
    try {
      const res = await createPara(data).unwrap();
      if (res.success) {
        toast.success("Para created successfully!");
      } else {
        toast.error(res.message || "Failed to create para");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-poppins">
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

        {/* Main Form */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <FormContainer
              onSubmit={onSubmit}
              resolver={zodResolver(ParaSchema)}
              defaultValues={{
                number: 1,
              }}
            >
              {/* Basic Information Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  <FormInput
                    name="number"
                    label="Para Number *"
                    type="number"
                    placeholder="1-30"
                    required
                  />
                </div>
              </div>

              {/* Names Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                  Para Names
                </h3>

                <div className="space-y-4">
                  <FormInput
                    name="arabic"
                    label="Arabic Name *"
                    placeholder="الم"
                    className="text-right text-xl"
                    required
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      name="english"
                      label="English Name"
                      placeholder="Alif Lam Meem"
                    />
                    <FormInput
                      name="bangla"
                      label="Bangla Name"
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
                  <FormInput
                    name="startAyahRef"
                    label="Start Ayah Reference *"
                    placeholder="1:1"
                    required
                  />

                  <FormInput
                    name="endAyahRef"
                    label="End Ayah Reference *"
                    placeholder="2:141"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Format: Surah:Ayah (e.g., 1:1, 2:141)
                </p>
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
                      Creating Para...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Create Para
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
