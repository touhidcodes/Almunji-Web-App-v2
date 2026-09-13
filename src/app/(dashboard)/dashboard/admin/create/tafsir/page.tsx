"use client";

import { useCreateTafsirMutation } from "@/redux/api/tafsirApi";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";
import FormTextarea from "@/components/forms/FormTextarea";

export default function CreateTafsirPage() {
  const [createTafsir, { isLoading }] = useCreateTafsirMutation();

  const onSubmit = async (data: any) => {
    try {
      const res = await createTafsir(data).unwrap();
      if (res.success) {
        toast.success("Tafsir created!");
        setTimeout(() => Link.push("/dashboard/admin/manage/tafsir"), 1000);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create tafsir");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <nav className="flex items-center gap-2 mb-6">
          <Link href="/dashboard/admin/manage/tafsir" className="text-gray-500">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Create Tafsir</h1>
        </nav>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <FormContainer onSubmit={onSubmit}>
            <FormInput name="ayahId" label="Ayah ID *" placeholder="Ayah UUID" required />
            <FormInput name="heading" label="Heading" placeholder="Tafsir heading" />
            <FormTextarea name="summaryBn" label="Summary (Bangla)" rows={3} />
            <FormTextarea name="summaryEn" label="Summary (English)" rows={3} />
            <FormTextarea name="detailBn" label="Detail (Bangla)" rows={5} />
            <FormTextarea name="detailEn" label="Detail (English)" rows={5} />
            <FormInput name="scholar" label="Scholar" placeholder="Scholar name" />
            <FormInput name="reference" label="Reference" placeholder="Reference" />
            
            <button type="submit" disabled={isLoading} className="mt-4 w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 disabled:opacity-50">
              <Save className="w-4 h-4 inline mr-2" />
              {isLoading ? "Creating..." : "Create Tafsir"}
            </button>
          </FormContainer>
        </div>
      </div>
    </div>
  );
}