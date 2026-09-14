"use client";

import { useCreateWordMutation } from "@/redux/api/dictionaryApi";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";
import FormTextarea from "@/components/forms/FormTextarea";

export default function ModeratorCreateDictionaryPage() {
  const [createWord, { isLoading }] = useCreateWordMutation();

  const onSubmit = async (data: any) => {
    try {
      const apiData = {
        persianWord: data.word,
        transliteration: data.pronunciation,
        englishMeaning: data.definition,
        banglaMeaning: data.meaning || "",
      };
      const res = await createWord(apiData).unwrap();
      if (res.success) {
        toast.success("Word created!");
        setTimeout(() => Link.push("/dashboard/moderator/dictionary"), 1000);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create word");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <nav className="flex items-center gap-2 mb-6">
          <Link href="/dashboard/moderator/dictionary" className="text-gray-500">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Add Word</h1>
        </nav>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <FormContainer onSubmit={onSubmit}>
            <FormInput name="word" label="Persian Word *" placeholder="Persian word" required />
            <FormInput name="pronunciation" label="Transliteration" placeholder="Pronunciation" />
            <FormTextarea name="definition" label="English Meaning *" rows={3} placeholder="English meaning" required />
            <FormTextarea name="meaning" label="Bangla Meaning" rows={3} placeholder="Bangla meaning" />
            
            <button type="submit" disabled={isLoading} className="mt-4 w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 disabled:opacity-50">
              <Save className="w-4 h-4 inline mr-2" />
              {isLoading ? "Adding..." : "Add Word"}
            </button>
          </FormContainer>
        </div>
      </div>
    </div>
  );
}