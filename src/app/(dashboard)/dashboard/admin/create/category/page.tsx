"use client";

import { useCreateCategoryMutation } from "@/redux/api/categoryApi";
import { CategorySchema } from "@/schema/categorySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";

export default function CreateCategoryPage() {
  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  const onSubmit = async (data: any) => {
    try {
      const res = await createCategory(data).unwrap();
      if (res.success) {
        toast.success("Category created!");
        setTimeout(() => Link.push("/dashboard/admin/manage/category"), 1000);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create category");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <nav className="flex items-center gap-2 mb-6">
          <Link href="/dashboard/admin/manage/category" className="text-gray-500">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Create Category</h1>
        </nav>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <FormContainer onSubmit={onSubmit} resolver={zodResolver(CategorySchema)}>
            <FormInput name="name" label="Category Name *" placeholder="Enter category name" required />
            <button type="submit" disabled={isLoading} className="mt-4 w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 disabled:opacity-50">
              <Save className="w-4 h-4 inline mr-2" />
              {isLoading ? "Creating..." : "Create Category"}
            </button>
          </FormContainer>
        </div>
      </div>
    </div>
  );
}