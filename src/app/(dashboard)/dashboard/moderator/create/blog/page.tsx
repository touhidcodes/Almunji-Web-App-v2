"use client";

import { useCreateBlogMutation } from "@/redux/api/blogApi";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";
import FormTextarea from "@/components/forms/FormTextarea";

export default function ModeratorCreateBlogPage() {
  const [createBlog, { isLoading }] = useCreateBlogMutation();

  const onSubmit = async (data: any) => {
    try {
      const res = await createBlog({ ...data, isPublished: true }).unwrap();
      if (res.success) {
        toast.success("Blog published!");
        setTimeout(() => Link.push("/dashboard/moderator/manage/blog"), 1000);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create blog");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <nav className="flex items-center gap-2 mb-6">
          <Link href="/dashboard/moderator/manage/blog" className="text-gray-500"><ArrowLeft className="w-4 h-4" /></Link>
          <h1 className="text-xl font-bold text-gray-900">Create Blog</h1>
        </nav>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <FormContainer onSubmit={onSubmit}>
            <FormInput name="title" label="Title *" placeholder="Blog title" required />
            <FormInput name="slug" label="Slug *" placeholder="blog-title" required />
            <FormTextarea name="summary" label="Summary *" rows={2} placeholder="Short summary" required />
            <FormTextarea name="content" label="Content *" rows={8} placeholder="Blog content" required />
            
            <button type="submit" disabled={isLoading} className="mt-4 w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 disabled:opacity-50">
              <Save className="w-4 h-4 inline mr-2" />
              {isLoading ? "Publishing..." : "Publish Blog"}
            </button>
          </FormContainer>
        </div>
      </div>
    </div>
  );
}