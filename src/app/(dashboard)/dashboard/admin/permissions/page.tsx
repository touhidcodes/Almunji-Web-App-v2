"use client";

import { useState } from "react";
import { useGetAllPermissionsQuery, useAssignBulkPermissionsMutation } from "@/redux/api/permissionApi";
import { Shield, Trash2, Users } from "lucide-react";
import { toast } from "sonner";

export default function PermissionsPage() {
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [assignBulkPermissions, { isLoading: isAssigning }] = useAssignBulkPermissionsMutation();

  const { data: permissionsData, isLoading } = useGetAllPermissionsQuery();
  
  // Handle different response structures
  const permissions = Array.isArray(permissionsData?.data) 
    ? permissionsData.data 
    : Array.isArray(permissionsData) 
      ? permissionsData 
      : [];

  const handleTogglePermission = (permissionId: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-poppins">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-teal-600" />
            <h1 className="text-2xl font-bold text-gray-900">Access Control</h1>
          </div>
          <p className="text-gray-500">Manage permissions for different user roles</p>
        </header>

        {/* Permissions List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-700">
              All Permissions ({permissions.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-100">
            {permissions.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No permissions found</div>
            ) : (
              permissions.map((permission: any) => (
                <div key={permission.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="bg-teal-50 p-2 rounded-lg">
                      <Shield className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {permission.resource} - {permission.action}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Assign Permissions to User */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-700 flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-600" />
              Assign Permissions to User
            </h2>
          </div>
          
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select User
              </label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              >
                <option value="">Choose a user...</option>
                <option value="user1">User 1</option>
                <option value="user2">User 2</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Permissions
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {permissions.map((permission: any) => (
                  <label
                    key={permission.id}
                    className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                      selectedPermissions.includes(permission.id)
                        ? "bg-teal-50 border-teal-200"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedPermissions.includes(permission.id)}
                      onChange={() => handleTogglePermission(permission.id)}
                      className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                    />
                    <span className="text-sm text-gray-700">
                      {permission.resource}:{permission.action}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={async () => {
                if (!selectedUser || selectedPermissions.length === 0) {
                  toast.error("Please select a user and at least one permission");
                  return;
                }
                
                try {
                  const res = await assignBulkPermissions({
                    userId: selectedUser,
                    permissionIds: selectedPermissions,
                  }).unwrap();
                  
                  toast.success(`Assigned ${res.assigned || res.length || selectedPermissions.length} permissions successfully!`);
                  setSelectedUser("");
                  setSelectedPermissions([]);
                } catch (error) {
                  toast.error("Failed to assign permissions");
                }
              }}
              disabled={!selectedUser || selectedPermissions.length === 0 || isAssigning}
              className="w-full py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isAssigning ? "Assigning..." : "Assign Selected Permissions"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
