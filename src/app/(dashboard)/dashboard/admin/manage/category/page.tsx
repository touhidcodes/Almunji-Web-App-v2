"use client";

import { useGetAllCategoriesQuery, useSoftDeleteCategoryMutation } from "@/redux/api/categoryApi";
import { Folder } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ManageCategoryPage() {
  const [deleteCategory] = useSoftDeleteCategoryMutation();

  const { data: categoriesData, isLoading } = useGetAllCategoriesQuery();
  const categories = categoriesData?.data || [];

  const handleDelete = async (id: string) => {
    if (confirm("Delete this category?")) {
      try {
        await deleteCategory(id).unwrap();
        toast.success("Category deleted");
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
              <Folder className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Categories</h1>
          </div>
          <Link href="/dashboard/admin/create/category" className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700">
            + Add Category
          </Link>
        </header>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {categories.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No categories found</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {categories.map((cat: any) => (
                <div key={cat.id} className="flex items-center justify-between p-4">
                  <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                  <button onClick={() => handleDelete(cat.id)} className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg">
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
