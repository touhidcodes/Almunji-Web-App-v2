"use client";

import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";
import FormTextarea from "@/components/forms/FormTextarea";
import RichTextEditor from "@/components/forms/RichTextEditor";

import { useCreateBlogMutation } from "@/redux/api/blogApi";
import { BlogSchema } from "@/schema/blogSchema";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, BookOpen, Save, Sparkles } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { z } from "zod";

type TCreateBlogForm = z.infer<typeof BlogSchema>;

type TApiError = {
  data?: {
    message?: string;
  };
};

const CreateBlogPage: React.FC = () => {
  const [createBlog, { isLoading: isSubmitting }] = useCreateBlogMutation();

  const onSubmit = async (data: TCreateBlogForm) => {
    try {
      const res = await createBlog({
        ...data,
        isPublished: true,
      }).unwrap();

      if (res.success) {
        toast.success("Blog published successfully!", {
          description: "Post is now live and visible to all users.",
        });
      }
    } catch (error: unknown) {
      const apiError = error as TApiError;

      toast.error(apiError.data?.message || "Failed to publish blog!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-poppins lg:p-12">
      <div className="mx-auto max-w-7xl space-y-12">
        {/* Navigation */}
        <nav className="flex items-center justify-between border-b border-gray-200 pb-6">
          <Link
            href="/dashboard/admin/manage/blog"
            className="group flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-500 transition-all hover:text-teal-600"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Blogs</span>
          </Link>

          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
            <Sparkles className="h-3 w-3 text-teal-400" />
            New Post
          </div>
        </nav>

        {/* Header */}
        <header className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-teal-600 p-4 shadow-xl shadow-teal-100">
              <BookOpen className="h-8 w-8 text-white" />
            </div>

            <div>
              <h1 className="text-4xl font-black tracking-tight text-gray-900 lg:text-5xl">
                Create Blog Post
              </h1>

              <p className="mt-2 text-lg font-medium text-gray-500">
                Share insights, knowledge and updates
              </p>
            </div>
          </div>
        </header>

        {/* Form Card */}
        <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl shadow-gray-200/50">
          {/* Decorative Element */}
          <div className="pointer-events-none absolute right-0 top-0 p-16 opacity-5">
            <BookOpen className="h-56 w-56 text-teal-900" />
          </div>

          <div className="relative p-8 lg:p-14">
            <FormContainer
              onSubmit={onSubmit}
              resolver={zodResolver(BlogSchema)}
            >
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
                {/* Sidebar */}
                <aside className="space-y-10 lg:col-span-4">
                  {/* Metadata */}
                  <div className="space-y-8">
                    <div className="flex items-center gap-3">
                      <div className="h-1 w-12 rounded-full bg-teal-600" />

                      <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">
                        Metadata
                      </h3>
                    </div>

                    <div className="space-y-6">
                      <FormInput
                        name="title"
                        label="Post Title *"
                        placeholder="Enter an engaging blog title"
                        required
                      />

                      <FormInput
                        name="thumbnail"
                        label="Thumbnail URL"
                        placeholder="https://example.com/image.jpg"
                      />

                      <FormTextarea
                        name="summary"
                        label="Summary"
                        rows={5}
                        placeholder="Write a short summary of your article..."
                      />
                    </div>
                  </div>

                  {/* Guidelines */}
                  <div className="space-y-5 rounded-2xl border border-teal-100/50 bg-teal-50/50 p-7">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-teal-600 p-2 text-white shadow-sm">
                        <Sparkles className="h-5 w-5" />
                      </div>

                      <span className="text-sm font-black uppercase tracking-widest text-gray-800">
                        Writing Guidelines
                      </span>
                    </div>

                    <ul className="space-y-3">
                      {[
                        "Use a clear and meaningful title",
                        "Keep the summary concise",
                        "Use headings to structure content",
                        "Use lists where appropriate",
                        "Add relevant links when necessary",
                        "Keep content readable and informative",
                      ].map((rule) => (
                        <li
                          key={rule}
                          className="flex items-start gap-3 text-xs font-bold uppercase tracking-tight text-gray-600"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                </aside>

                {/* Content */}
                <main className="space-y-10 lg:col-span-8">
                  <div className="space-y-8">
                    <div className="flex items-center gap-3">
                      <div className="h-1 w-12 rounded-full bg-teal-600" />

                      <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">
                        Article Content
                      </h3>
                    </div>

                    <RichTextEditor
                      name="content"
                      label="Full Content"
                      required
                      placeholder="Start writing your article..."
                    />
                  </div>

                  {/* Submit */}
                  <div className="flex justify-end border-t border-gray-100 pt-10">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex w-full items-center justify-center gap-3 rounded-xl bg-teal-600 px-12 py-5 text-sm font-bold uppercase tracking-wide text-white shadow-xl shadow-teal-200 transition-all hover:bg-teal-700 hover:shadow-teal-300 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                      {isSubmitting ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        <Save className="h-5 w-5" />
                      )}

                      <span>
                        {isSubmitting ? "Publishing..." : "Publish Post"}
                      </span>
                    </button>
                  </div>
                </main>
              </div>
            </FormContainer>
          </div>
        </div>

        {/* Footer */}
        <footer className="pb-12 text-center">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400">
            Almunji Blog Management System
          </p>
        </footer>
      </div>
    </div>
  );
};

export default CreateBlogPage;
