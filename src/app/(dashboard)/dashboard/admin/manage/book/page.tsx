"use client";

import { useGetAllBooksAdminQuery, useSoftDeleteBookMutation } from "@/redux/api/bookApi";
import { Book } from "lucide-react";
import { toast } from "sonner";

export default function ManageBookPage() {
  const [deleteBook] = useSoftDeleteBookMutation();

  const { data: booksData, isLoading } = useGetAllBooksAdminQuery();
  const books = booksData?.data || [];

  const handleDelete = async (id: string) => {
    if (confirm("Delete this book?")) {
      try {
        await deleteBook(id).unwrap();
        toast.success("Book deleted");
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
        <header className="flex items-center gap-3 mb-6">
          <div className="bg-teal-600 p-3 rounded-xl">
            <Book className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Books</h1>
        </header>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {books.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No books found</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {books.map((b: any) => (
                <div key={b.id} className="flex items-center justify-between p-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{b.name}</h3>
                    <p className="text-sm text-gray-500">{b.slug}</p>
                  </div>
                  <button onClick={() => handleDelete(b.id)} className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg">
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
