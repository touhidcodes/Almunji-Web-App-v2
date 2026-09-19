"use client";

import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";
import FormTextarea from "@/components/forms/FormTextarea";
import { useCreateBlogMutation } from "@/redux/api/blogApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { BlogSchema } from "@/schema/blogSchema";
import { ArrowLeft, Save, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const CreateBlogPage: React.FC = () => {
  const [createBlog, { isLoading: isSubmitting }] = useCreateBlogMutation();

  const onSubmit = async (data: any) => {
    try {
      const res = await createBlog({ ...data, isPublished: true }).unwrap();
      if (res.success) {
        toast.success("Blog published successfully!", {
          description: "Post is now live and visible to all users.",
        });
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to publish blog!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-12 font-poppins">
      <div className="max-w-6xl mx-auto space-y-12">
        <nav className="flex items-center justify-between pb-6 border-b border-gray-200">
          <Link href="/dashboard/admin/manage/blog" className="group flex items-center gap-2 text-gray-500 hover:text-teal-600 font-semibold uppercase text-xs tracking-widest transition-all">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Blogs</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-widest">
            <Sparkles className="h-3 w-3 text-teal-400" />
            New Post
          </div>
        </nav>

        <header className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="bg-teal-600 p-4 rounded-2xl shadow-xl shadow-teal-100">
              <div className="text-white font-bold text-2xl">B</div>
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">Create Blog Post</h1>
              <p className="text-gray-500 font-medium mt-2 text-lg">Share insights and updates</p>
            </div>
          </div>
        </header>

        <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-16 pointer-events-none opacity-5">
            <div className="text-teal-900 font-bold text-9xl">B</div>
          </div>

          <div className="p-10 lg:p-16 relative">
            <FormContainer onSubmit={onSubmit} resolver={zodResolver(BlogSchema)}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <aside className="lg:col-span-4 space-y-10">
                  <div className="space-y-8">
                    <div className="flex items-center gap-3">
                      <div className="h-1 w-12 bg-teal-600 rounded-full"></div>
                      <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Metadata</h3>
                    </div>
                    <div className="space-y-6">
                      <FormInput name="title" label="Post Title *" placeholder="Enter title" required />
                      <FormInput name="slug" label="URL Slug *" placeholder="blog-title" required />
                      <FormInput name="thumbnail" label="Thumbnail URL" placeholder="Image URL" />
                    </div>
                  </div>
                  <div className="p-8 bg-teal-50/50 rounded-2xl border border-teal-100/50 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-teal-600 text-white p-2 rounded-lg shadow-sm">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-black text-gray-800 uppercase tracking-widest">Guidelines</span>
                    </div>
                    <ul className="space-y-3">
                      {["Clear title", "SEO-friendly slug", "High-quality thumbnail"].map((rule, i) => (
                        <li key={i} className="flex items-center gap-3 text-xs font-bold text-gray-600 uppercase tracking-tight">
                          <div className="h-1.5 w-1.5 rounded-full bg-teal-300"></div>{rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                </aside>

                <main className="lg:col-span-8 space-y-10">
                  <div className="space-y-8">
                    <div className="flex items-center gap-3">
                      <div className="h-1 w-12 bg-teal-600 rounded-full"></div>
                      <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Content</h3>
                    </div>
                    <FormTextarea name="summary" label="Summary *" rows={3} placeholder="Brief summary..." required />
                    <FormTextarea name="content" label="Full Content *" rows={12} placeholder="Write your blog content..." className="h-[500px]" required />
                  </div>
                  <div className="pt-12 border-t border-gray-100 flex justify-end">
                    <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto px-12 py-6 bg-teal-600 hover:bg-teal-700 text-white rounded-xl flex items-center justify-center gap-4 shadow-xl shadow-teal-200 font-bold uppercase text-sm">
                      {isSubmitting ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div> : <Save className="h-5 w-5" />}
                      <span> Publish Post</span>
                    </button>
                  </div>
                </main>
              </div>
            </FormContainer>
          </div>
        </div>

        <footer className="text-center pb-12">
          <p className="text-xs font-black uppercase text-gray-400 tracking-widest">Almunji Blog Management System</p>
        </footer>
      </div>
    </div>
  );
};

export default CreateBlogPage;
