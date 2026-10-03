"use client";

import { useState, useEffect } from "react";
import { useGetAllPermissionsQuery, useAssignBulkPermissionsMutation, useGetUserPermissionsQuery, useRemovePermissionMutation } from "@/redux/api/permissionApi";
import { useGetAllUsersQuery } from "@/redux/api/userApi";
import { Shield, Users, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Permission = {
  id: string;
  resource: string;
  action: string;
  createdAt: string;
  users: { userId: string; assignedBy: string; assignedAt: string }[];
};

type User = {
  id: string;
  username: string;
  email: string;
  role: string;
};

export default function PermissionsPage() {
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [currentPermissions, setCurrentPermissions] = useState<string[]>([]);

  const [assignBulkPermissions, { isLoading: isAssigning }] = useAssignBulkPermissionsMutation();
  const [removePermission] = useRemovePermissionMutation();

  const { data: permissionsData, isLoading: permissionsLoading } = useGetAllPermissionsQuery();
  const { data: usersData, isLoading: usersLoading } = useGetAllUsersQuery();
  
  // Fetch user's current permissions when user is selected
  const { data: userPermissionsData, isLoading: userPermissionsLoading } = useGetUserPermissionsQuery(selectedUser, { skip: !selectedUser });

  const permissions: Permission[] = permissionsData?.data?.permissions || [];
  const users: User[] = usersData?.data || [];

  // Update current permissions when user permissions are loaded
  useEffect(() => {
    if (userPermissionsData?.data) {
      // Map the user permissions to permission IDs
      const permIds = (userPermissionsData.data as any[]).map((up: any) => up.permission.id);
      setCurrentPermissions(permIds);
      setSelectedPermissions(permIds); // Initialize selection
    } else {
      setCurrentPermissions([]);
      setSelectedPermissions([]);
    }
  }, [userPermissionsData]);

  const handleTogglePermission = (permissionId: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleRemovePermission = async (permissionId: string) => {
    try {
      await removePermission({ userId: selectedUser, permissionId }).unwrap();
      toast.success("Permission removed successfully");
      setCurrentPermissions(prev => prev.filter(id => id !== permissionId));
      setSelectedPermissions(prev => prev.filter(id => id !== permissionId));
    } catch {
      toast.error("Failed to remove permission");
    }
  };

  const isLoading = permissionsLoading || usersLoading || userPermissionsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
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
              permissions.map((permission: Permission) => (
                <div key={permission.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="bg-teal-50 p-2 rounded-lg">
                      <Shield className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {permission.resource} - {permission.action}
                      </div>
                      <div className="text-xs text-gray-500">
                        {permission.users.length} user(s) assigned
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-100 bg-white"
                disabled={usersLoading}
              >
                <option value="">Choose a user...</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username || user.email} ({user.role})
                  </option>
                ))}
              </select>
            </div>

            {selectedUser && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Permissions ({currentPermissions.length})
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto border rounded-lg p-2 bg-gray-50 mb-4">
                  {currentPermissions.length > 0 ? (
                    currentPermissions.map((permId) => {
                      const perm = permissions.find(p => p.id === permId);
                      if (!perm) return null;
                      return (
                        <div key={permId} className="flex items-center justify-between p-2 bg-white rounded-lg border border-teal-200">
                          <span className="text-sm text-gray-700">
                            {perm.resource}:{perm.action}
                          </span>
                          <button
                            onClick={() => handleRemovePermission(permId)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-full p-4 text-center text-gray-500 text-sm">
                      No permissions assigned
                    </div>
                  )}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Permissions to Add
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-80 overflow-y-auto border rounded-lg p-2 bg-gray-50">
                {permissions.length > 0 ? (
                  permissions.map((permission: Permission) => {
                    const isAssigned = currentPermissions.includes(permission.id);
                    return (
                      <label
                        key={permission.id}
                        className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                          selectedPermissions.includes(permission.id)
                            ? "bg-teal-50 border-teal-200"
                            : "bg-white border-gray-200 hover:bg-gray-100"
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
                    );
                  })
                ) : (
                  <div className="col-span-full p-4 text-center text-gray-500 text-sm">
                    No permissions available
                  </div>
                )}
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
                  
                  toast.success(`Assigned ${selectedPermissions.length} permissions successfully!`);
                  setSelectedUser("");
                  setSelectedPermissions([]);
                  setCurrentPermissions([]);
                } catch (error) {
                  toast.error("Failed to assign permissions");
                }
              }}
              disabled={!selectedUser || selectedPermissions.length === 0 || isAssigning || usersLoading}
              className="w-full py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isAssigning ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Assigning...
                </span>
              ) : (
                "Assign Selected Permissions"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
