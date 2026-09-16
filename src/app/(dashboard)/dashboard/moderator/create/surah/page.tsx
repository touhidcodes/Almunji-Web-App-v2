"use client";

import { useCreateSurahMutation } from "@/redux/api/surahApi";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";
import FormTextarea from "@/components/forms/FormTextarea";

export default function ModeratorCreateSurahPage() {
  const [createSurah, { isLoading }] = useCreateSurahMutation();

  const onSubmit = async (data: any) => {
    try {
      const res = await createSurah(data).unwrap();
      if (res.success) {
        toast.success("Surah created!");
        setTimeout(() => Link.push("/dashboard/moderator/manage/surahs"), 1000);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create surah");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <nav className="flex items-center gap-2 mb-6">
          <Link href="/dashboard/moderator/manage/surahs" className="text-gray-500"><ArrowLeft className="w-4 h-4" /></Link>
          <h1 className="text-xl font-bold text-gray-900">Add Surah</h1>
        </nav>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <FormContainer onSubmit={onSubmit}>
            <FormInput name="chapter" label="Chapter Number *" type="number" placeholder="1" required />
            <FormInput name="arabic" label="Arabic Name *" placeholder="Al-Fatihah" required />
            <FormInput name="english" label="English Name *" placeholder="The Opening" required />
            <FormInput name="bangla" label="Bangla Name" placeholder="আল-ফাতিহা" />
            <FormTextarea name="history" label="History" rows={3} placeholder="Revelation history" />
            <FormInput name="revelation" label="Revelation Type" placeholder="Makki/Madani" />
            
            <button type="submit" disabled={isLoading} className="mt-4 w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 disabled:opacity-50">
              <Save className="w-4 h-4 inline mr-2" />
              {isLoading ? "Adding..." : "Add Surah"}
            </button>
          </FormContainer>
        </div>
      </div>
    </div>
  );
}