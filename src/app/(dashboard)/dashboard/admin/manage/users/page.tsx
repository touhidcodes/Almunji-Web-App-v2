"use client";

import { useState } from "react";
import {
  useGetAllUsersQuery,
  useUpdateUserStatusMutation,
} from "@/redux/api/userApi";
import { TUser } from "@/types/user";
import { Users, X, Settings, Loader2 } from "lucide-react";

type UserStatus = "ACTIVE" | "BLOCKED";

export default function ManageUsersPage() {
  const { data: usersData, isLoading } = useGetAllUsersQuery({});

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserStatusMutation();

  const [selectedUser, setSelectedUser] = useState<TUser | null>(null);
  const [status, setStatus] = useState<UserStatus>("ACTIVE");

  const users = usersData?.data || [];

  const handleOpenModal = (user: TUser) => {
    setSelectedUser(user);
    setStatus(user.status as UserStatus);
  };

  const handleCloseModal = () => {
    if (isUpdating) return;

    setSelectedUser(null);
  };

  const handleUpdateStatus = async () => {
    if (!selectedUser) return;

    try {
      await updateUser({
        id: selectedUser.id,
        data: {
          status,
        },
      }).unwrap();

      handleCloseModal();
    } catch (error) {
      console.error("Failed to update user status:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <header className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-teal-600 p-3">
              <Users className="h-6 w-6 text-white" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
              <p className="text-sm text-gray-500">
                Manage user accounts and their access status.
              </p>
            </div>
          </header>

          {/* Users */}
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            {users.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No users found
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {users.map((user: TUser) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between gap-4 p-4 transition hover:bg-gray-50"
                  >
                    {/* User info */}
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-gray-900">
                        {user.username}
                      </h3>

                      <p className="truncate text-sm text-gray-500">
                        {user.email}
                      </p>
                    </div>

                    {/* Status + Action */}
                    <div className="flex shrink-0 items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          user.status === "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.status}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleOpenModal(user)}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
                      >
                        <Settings className="h-4 w-4" />
                        Manage User
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseModal();
            }
          }}
        >
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Manage User
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Update account status
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isUpdating}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-5 p-6">
              {/* User */}
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  User
                </p>

                <p className="mt-1 font-semibold text-gray-900">
                  {selectedUser.username}
                </p>

                <p className="text-sm text-gray-500">{selectedUser.email}</p>
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="user-status"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Account Status
                </label>

                <select
                  id="user-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as UserStatus)}
                  disabled={isUpdating}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="BLOCKED">Blocked</option>
                </select>

                <p className="mt-2 text-xs text-gray-500">
                  Blocked users will not be able to access the application.
                </p>
              </div>

              {/* Warning */}
              {status === "BLOCKED" && selectedUser.status !== "BLOCKED" && (
                <div className="rounded-lg border border-red-100 bg-red-50 p-3">
                  <p className="text-sm text-red-700">
                    This will block the user`&apos`s account. They may no longer
                    be able to access protected resources.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isUpdating}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleUpdateStatus}
                disabled={isUpdating || status === selectedUser.status}
                className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}

                {isUpdating ? "Updating..." : "Update Status"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
