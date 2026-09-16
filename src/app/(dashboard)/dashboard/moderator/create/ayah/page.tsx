"use client";

import { useCreateAyahMutation } from "@/redux/api/ayahApi";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";
import FormTextarea from "@/components/forms/FormTextarea";

export default function ModeratorCreateAyahPage() {
  const [createAyah, { isLoading }] = useCreateAyahMutation();

  const onSubmit = async (data: any) => {
    try {
      const res = await createAyah(data).unwrap();
      if (res.success) {
        toast.success("Ayah created!");
        setTimeout(() => Link.push("/dashboard/moderator/manage/ayahs"), 1000);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create ayah");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <nav className="flex items-center gap-2 mb-6">
          <Link href="/dashboard/moderator/manage/ayahs" className="text-gray-500"><ArrowLeft className="w-4 h-4" /></Link>
          <h1 className="text-xl font-bold text-gray-900">Add Ayah</h1>
        </nav>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <FormContainer onSubmit={onSubmit}>
            <FormInput name="surahId" label="Surah ID *" placeholder="Surah UUID" required />
            <FormInput name="paraId" label="Para ID *" placeholder="Para UUID" required />
            <FormInput name="number" label="Ayah Number *" type="number" placeholder="1" required />
            <FormTextarea name="arabic" label="Arabic *" rows={3} placeholder="Arabic text" required />
            <FormTextarea name="transliteration" label="Transliteration" rows={2} />
            <FormTextarea name="bangla" label="Bangla" rows={3} />
            <FormTextarea name="english" label="English" rows={3} />
            
            <button type="submit" disabled={isLoading} className="mt-4 w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 disabled:opacity-50">
              <Save className="w-4 h-4 inline mr-2" />
              {isLoading ? "Adding..." : "Add Ayah"}
            </button>
          </FormContainer>
        </div>
      </div>
    </div>
  );
}