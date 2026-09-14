"use client";

import { useCreateDuaMutation } from "@/redux/api/duaApi";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";
import FormTextarea from "@/components/forms/FormTextarea";

export default function ModeratorCreateDuaPage() {
  const [createDua, { isLoading }] = useCreateDuaMutation();

  const onSubmit = async (data: any) => {
    try {
      const res = await createDua(data).unwrap();
      if (res.success) {
        toast.success("Dua created!");
        setTimeout(() => Link.push("/dashboard/moderator/manage/dua"), 1000);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create dua");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <nav className="flex items-center gap-2 mb-6">
          <Link href="/dashboard/moderator/manage/dua" className="text-gray-500"><ArrowLeft className="w-4 h-4" /></Link>
          <h1 className="text-xl font-bold text-gray-900">Add Dua</h1>
        </nav>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <FormContainer onSubmit={onSubmit}>
            <FormInput name="name" label="Dua Name *" placeholder="Dua name" required />
            <FormTextarea name="arabic" label="Arabic *" rows={3} placeholder="Arabic text" required />
            <FormTextarea name="bangla" label="Bangla *" rows={3} placeholder="Bangla translation" required />
            <FormTextarea name="english" label="English" rows={3} placeholder="English translation" />
            <FormInput name="reference" label="Reference" placeholder="Reference" />
            
            <button type="submit" disabled={isLoading} className="mt-4 w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 disabled:opacity-50">
              <Save className="w-4 h-4 inline mr-2" />
              {isLoading ? "Adding..." : "Add Dua"}
            </button>
          </FormContainer>
        </div>
      </div>
    </div>
  );
}