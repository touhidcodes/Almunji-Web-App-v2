"use client";

import { useGetAllPermissionsQuery } from "@/redux/api/permissionApi";
import { Shield, Plus, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ResourceList = ["SURAH", "PARA", "AYAH", "TAFSIR", "DICTIONARY", "BOOK", "BOOKCATEGORY", "BOOKCONTENT", "BLOG", "DUA", "USER", "PERMISSION", "BOOKMARK"];
const ActionList = ["READ", "CREATE", "UPDATE", "DELETE"];

export default function PermissionsPage() {
  const [isAdding, setIsAdding] = useState(false);

  const { data: permissionsData, isLoading } = useGetAllPermissionsQuery();
  const permissions = permissionsData?.data || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-poppins">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-teal-600" />
            <h1 className="text-2xl font-bold text-gray-900">Access Control</h1>
          </div>
          <p className="text-gray-500">Manage permissions for different user roles</p>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-700">
              All Permissions ({permissions.length})
            </h2>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Permission
            </button>
          </div>

          <div className="divide-y divide-gray-100">
            {permissions.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No permissions found</div>
            ) : (
              permissions.map((permission: any) => (
                <div key={permission.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-50 p-2 rounded-lg">
                      <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {permission.resource} - {permission.action}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {permission.id.slice(0, 8)}...
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
