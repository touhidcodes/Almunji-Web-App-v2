"use client";

import { useGetAllBlogsAdminQuery, useSoftDeleteBlogMutation } from "@/redux/api/blogApi";
import { Blog } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function ManageBlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteBlog] = useSoftDeleteBlogMutation();

  const { data: blogsData, isLoading } = useGetAllBlogsAdminQuery({ searchTerm });
  const blogs = blogsData?.data || [];

  const handleDelete = async (id: string) => {
    if (confirm("Delete this blog?")) {
      try {
        await deleteBlog(id).unwrap();
        toast.success("Blog deleted");
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to delete");
      }
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 border-2 border-teal-600 rounded-full"></div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-teal-600 p-3 rounded-xl">
              <Blog className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Blogs</h1>
          </div>
          <Link href="/dashboard/admin/create/blog" className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700">
            + Add Blog
          </Link>
        </header>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {blogs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No blogs found</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {blogs.map((blog: any) => (
                <div key={blog.id} className="flex items-center justify-between p-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{blog.title}</h3>
                    <p className="text-sm text-gray-500">{blog.slug}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg">
                      Delete
                    </button>
                    <button onClick={() => handleDelete(blog.id)} className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg">
                      <Blog className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
