"use client";

import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";
import FormTextarea from "@/components/forms/FormTextarea";
import { useCreateWordMutation } from "@/redux/api/dictionaryApi";
import { DictionarySchema } from "@/schema/dictionarySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Book, Save } from "lucide-react";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

const CreateDictionaryPage: React.FC = () => {
  const [createWord, { isLoading: isSubmitting }] = useCreateWordMutation();

  const onSubmit = async (data: any) => {
    try {
      const res = await createWord(data).unwrap();
      if (res.success) {
        toast.success("Dictionary entry created successfully!");
      } else {
        toast.error(res.message || "Failed to create entry");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 font-poppins">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/admin/manage/dictionary"
            className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Manage</span>
          </Link>
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

        {/* Form Container */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-indigo-100">
          <div className="p-8">
            <FormContainer
              onSubmit={onSubmit}
              resolver={zodResolver(DictionarySchema)}
            >
              <div className="space-y-6">
                <FormInput
                  name="word"
                  label="Word *"
                  placeholder="e.g., Ephemeral"
                  required
                />

                <FormInput
                  name="pronunciation"
                  label="Pronunciation *"
                  placeholder="e.g., /ɪˈfɛm(ə)r(ə)l/"
                  required
                />

                <FormTextarea
                  name="definition"
                  label="Definition *"
                  placeholder="Enter the definition of the word"
                  rows={6}
                  required
                />

                {/* Form Actions */}
                <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg flex items-center space-x-2 transition-all font-medium shadow-md hover:shadow-lg active:scale-95"
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
            </FormContainer>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-indigo-50 border border-indigo-100 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center gap-2">
            <Book className="h-5 w-5" />
            Tips for creating entries:
          </h3>
          <ul className="text-indigo-800 space-y-3">
            <li className="flex items-start gap-2">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0"></span>
              All fields marked with * are required.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0"></span>
              Use IPA (International Phonetic Alphabet) for pronunciation when
              possible.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0"></span>
              Keep definitions clear, concise, and accurate.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0"></span>
              You can manage and edit entries later from the management page.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateDictionaryPage;
