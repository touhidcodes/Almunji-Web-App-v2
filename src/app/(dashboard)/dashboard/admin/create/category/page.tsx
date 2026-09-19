"use client";

import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";
import { useCreateCategoryMutation } from "@/redux/api/categoryApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const CreateCategoryPage: React.FC = () => {
  const [createCategory, { isLoading: isSubmitting }] = useCreateCategoryMutation();

  const onSubmit = async (data: any) => {
    try {
      const res = await createCategory(data).unwrap();
      if (res.success) {
        toast.success("Category created successfully!", {
          description: "Category has been added to the system.",
        });
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create category!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-12 font-poppins">
      <div className="max-w-4xl mx-auto space-y-12">
        <nav className="flex items-center justify-between pb-6 border-b border-gray-200">
          <Link href="/dashboard/admin/manage/category" className="group flex items-center gap-2 text-gray-500 hover:text-indigo-600 font-semibold uppercase text-xs tracking-widest transition-all">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Categories</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-widest">
            <Sparkles className="h-3 w-3 text-indigo-400" />
            New Category
          </div>
        </nav>

        <header className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-xl shadow-indigo-100">
              <div className="text-white font-bold text-2xl">C</div>
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">Create Category</h1>
              <p className="text-gray-500 font-medium mt-2 text-lg">Organize your content</p>
            </div>
          </div>
        </header>

        <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative p-10 lg:p-16">
          <FormContainer onSubmit={onSubmit} resolver={zodResolver({ name: zodResolver })}>
            <div className="max-w-xl space-y-10">
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="h-1 w-12 bg-indigo-600 rounded-full"></div>
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Category Details</h3>
                </div>
                <FormInput name="name" label="Category Name *" placeholder="Enter category name" required />
              </div>

              <div className="pt-8 border-t border-gray-100 flex justify-end">
                <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto px-12 py-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center gap-4 shadow-xl shadow-indigo-200 font-bold uppercase text-sm">
                  {isSubmitting ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div> : <Save className="h-5 w-5" />}
                  <span>Create Category</span>
                </button>
              </div>
            </div>
          </FormContainer>
        </div>

        <footer className="text-center pb-12">
          <p className="text-xs font-black uppercase text-gray-400 tracking-widest">Almunji Content Organization</p>
        </footer>
      </div>
    </div>
  );
};

export default CreateCategoryPage;
