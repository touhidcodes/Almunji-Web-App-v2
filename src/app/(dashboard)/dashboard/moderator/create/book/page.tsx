"use client";

import { useCreateBookMutation } from "@/redux/api/bookApi";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";
import FormTextarea from "@/components/forms/FormTextarea";

export default function ModeratorCreateBookPage() {
  const [createBook, { isLoading }] = useCreateBookMutation();

  const onSubmit = async (data: any) => {
    try {
      const res = await createBook(data).unwrap();
      if (res.success) {
        toast.success("Book created!");
        setTimeout(() => Link.push("/dashboard/moderator/manage/book"), 1000);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create book");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <nav className="flex items-center gap-2 mb-6">
          <Link href="/dashboard/moderator/manage/book" className="text-gray-500"><ArrowLeft className="w-4 h-4" /></Link>
          <h1 className="text-xl font-bold text-gray-900">Add Book</h1>
        </nav>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <FormContainer onSubmit={onSubmit}>
            <FormInput name="name" label="Book Name *" placeholder="Book name" required />
            <FormInput name="slug" label="Slug *" placeholder="book-slug" required />
            <FormInput name="categoryId" label="Category ID *" placeholder="Category UUID" required />
            <FormTextarea name="description" label="Description" rows={2} />
            <FormInput name="cover" label="Cover URL" placeholder="Image URL" />
            
            <button type="submit" disabled={isLoading} className="mt-4 w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 disabled:opacity-50">
              <Save className="w-4 h-4 inline mr-2" />
              {isLoading ? "Adding..." : "Create Book"}
            </button>
          </FormContainer>
        </div>
      </div>
    </div>
  );
}