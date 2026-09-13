"use client";

import { useCreateBlogMutation } from "@/redux/api/blogApi";
import { BlogSchema } from "@/schema/blogSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";
import FormTextarea from "@/components/forms/FormTextarea";

export default function CreateBlogPage() {
  const [createBlog, { isLoading }] = useCreateBlogMutation();
  const [isPublishing, setIsPublishing] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      const res = await createBlog({ ...data, isPublished: isPublishing }).unwrap();
      if (res.success) {
        toast.success("Blog created successfully!");
        setTimeout(() => Link.push("/dashboard/admin/manage/blog"), 1000);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create blog");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <nav className="flex items-center gap-2 mb-6">
          <Link href="/dashboard/admin/manage/blog" className="text-gray-500 hover:text-teal-600">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Create Blog Post</h1>
        </nav>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <FormContainer onSubmit={onSubmit} resolver={zodResolver(BlogSchema)}>
            <div className="space-y-4">
              <FormInput name="title" label="Title *" placeholder="Enter blog title" required />
              <FormInput name="slug" label="Slug *" placeholder="blog-slug" required />
              <FormTextarea name="summary" label="Summary *" rows={3} placeholder="Short summary" required />
              <FormTextarea name="content" label="Content *" rows={10} placeholder="Blog content" required />
              
              <div className="flex items-center gap-2 pt-4">
                <button type="submit" className="flex-1 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700">
                  <Save className="w-4 h-4 inline mr-2" />
                  {isPublishing ? "Publish Blog" : "Save Draft"}
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsPublishing(!isPublishing)}
                  className={`px-4 py-2 rounded-lg ${isPublishing ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600"}`}
                >
                  {isPublishing ? "Publishing" : "Save as Draft"}
                </button>
              </div>
            </div>
          </FormContainer>
        </div>
      </div>
    </div>
  );
}