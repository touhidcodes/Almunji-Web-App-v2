"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  ArrowLeft,
  BookOpen,
  BookOpenText,
  FileText,
  Image as ImageIcon,
  LoaderCircle,
  Save,
  Sparkles,
} from "lucide-react";

import { toast } from "sonner";

import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";
import FormTextarea from "@/components/forms/FormTextarea";
import RichTextEditor from "@/components/forms/RichTextEditor";

import { useCreateBlogMutation } from "@/redux/api/blogApi";

import {
  CreateBlogSchema,
  type TCreateBlogFormValues,
} from "@/schema/blogSchema";
import { TApiError } from "@/types/api";

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error === "object" && error !== null) {
    const apiError = error as TApiError;

    return apiError.data?.message || apiError.message || fallback;
  }

  return fallback;
};

const CreateBlogPage = () => {
  const [createBlog, { isLoading: isCreatingBlog }] = useCreateBlogMutation();

  const handleSubmit = async (data: TCreateBlogFormValues): Promise<void> => {
    try {
      const blogPayload = {
        title: data.title.trim(),
        thumbnail: data.thumbnail?.trim() || undefined,
        summary: data.summary?.trim() || undefined,
        content: data.content,
      };

      const response = await createBlog(blogPayload).unwrap();

      if (!response.success) {
        toast.error("Failed to create blog.", {
          description: response.message,
        });

        return;
      }

      toast.success("Blog published successfully!", {
        description: "Your article is now live and visible to readers.",
      });
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to create blog."));
    }
  };

  const writingGuidelines = [
    "Use a clear and meaningful title",
    "Keep the summary concise and informative",
    "Use headings to structure your article",
    "Use lists where appropriate",
    "Add relevant links and references",
    "Keep your content readable and engaging",
  ];

  return (
    <main className="min-h-screen bg-gray-50 p-4 font-poppins sm:p-6 lg:p-12">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Navigation */}
        <nav className="flex items-center justify-between border-b border-gray-200 pb-5">
          <Link
            href="/dashboard/admin/manage/blog"
            className="flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-teal-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blogs
          </Link>

          <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
            <Sparkles className="h-4 w-4 text-teal-500" />
            Blog Services
          </span>
        </nav>

        {/* Header */}
        <header>
          <div className="flex items-center gap-4">
            <div className="shrink-0 rounded-2xl bg-teal-600 p-3 shadow-xl shadow-teal-100 sm:p-4">
              <BookOpen className="h-7 w-7 text-white sm:h-8 sm:w-8" />
            </div>

            <div>
              <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
                Create Blog Post
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Create and publish an informative article for your readers.
              </p>
            </div>
          </div>
        </header>

        {/* Blog Form */}
        <FormContainer
          onSubmit={handleSubmit}
          resolver={zodResolver(CreateBlogSchema)}
          defaultValues={{
            title: "",
            thumbnail: "",
            summary: "",
            content: "",
          }}
        >
          <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl shadow-gray-200/40">
            {/* Section Header */}
            <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-5 sm:px-8">
              <div className="rounded-xl bg-teal-50 p-2.5 text-teal-700">
                <BookOpenText className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-bold text-gray-900">Blog Information</h2>

                <p className="text-xs text-gray-500">
                  Step 1 · Article metadata and content
                </p>
              </div>
            </div>

            <div className="space-y-8 p-5 sm:p-8">
              {/* Metadata */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-teal-600" />

                  <h3 className="text-sm font-bold text-gray-800">
                    Article Metadata
                  </h3>
                </div>

                <FormInput
                  name="title"
                  label="Blog Title *"
                  placeholder="Enter an engaging blog title..."
                  required
                />

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-gray-500" />

                    <span className="text-sm font-semibold text-gray-700">
                      Thumbnail Image
                    </span>
                  </div>

                  <FormInput
                    name="thumbnail"
                    label="Thumbnail URL"
                    placeholder="https://example.com/image.jpg"
                  />

                  <p className="text-xs text-gray-400">
                    Provide a publicly accessible image URL for your blog
                    thumbnail. Leave empty if no thumbnail is needed.
                  </p>
                </div>

                <FormTextarea
                  name="summary"
                  label="Blog Summary"
                  rows={4}
                  placeholder="Write a concise introduction to your article..."
                />
              </div>

              {/* Article Content */}
              <div className="space-y-6 border-t border-gray-100 pt-8">
                <div className="flex items-center gap-2">
                  <BookOpenText className="h-4 w-4 text-teal-600" />

                  <div>
                    <h3 className="text-sm font-bold text-gray-800">
                      Article Content
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      Write the complete article using the rich text editor.
                    </p>
                  </div>
                </div>

                <RichTextEditor
                  name="content"
                  label="Full Article Content *"
                  required
                  placeholder="Start writing your article..."
                />
              </div>

              {/* Writing Guidelines */}
              <div className="space-y-5 rounded-2xl border border-teal-100 bg-teal-50/50 p-5 sm:p-7">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-teal-600 p-2.5 text-white shadow-sm">
                    <Sparkles className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      Writing Guidelines
                    </h3>

                    <p className="text-xs text-gray-500">
                      Keep your article informative and reader-friendly.
                    </p>
                  </div>
                </div>

                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {writingGuidelines.map((rule) => (
                    <li
                      key={rule}
                      className="flex items-start gap-2 text-xs font-medium text-gray-600"
                    >
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />

                      {rule}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Submit */}
              <div className="flex flex-col gap-4 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-gray-500">
                  Review your article before publishing. It will be published
                  immediately.
                </p>

                <button
                  type="submit"
                  disabled={isCreatingBlog}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-teal-100 transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isCreatingBlog ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}

                  {isCreatingBlog ? "Publishing Blog..." : "Publish Blog"}
                </button>
              </div>
            </div>
          </section>
        </FormContainer>

        {/* Footer */}
        <footer className="pb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Almunji Global Archival System · Blog Services
          </p>
        </footer>
      </div>
    </main>
  );
};

export default CreateBlogPage;
