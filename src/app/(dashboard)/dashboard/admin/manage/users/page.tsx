"use client";

import { useMemo, useState } from "react";
import {
  useGetAllUsersQuery,
  useUpdateUserStatusMutation,
} from "@/redux/api/userApi";
import { TUser } from "@/types/user";
import {
  Users,
  X,
  Settings,
  Loader2,
  Search,
  ShieldCheck,
  ShieldBan,
  UserRound,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

type UserStatus = "ACTIVE" | "BLOCKED";
type StatusFilter = "ALL" | UserStatus;

export default function ManageUsersPage() {
  const { data: usersData, isLoading, isError } = useGetAllUsersQuery({});

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserStatusMutation();

  const [selectedUser, setSelectedUser] = useState<TUser | null>(null);
  const [status, setStatus] = useState<UserStatus>("ACTIVE");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  const users: TUser[] = usersData?.data ?? [];

  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        [user.username, user.email, user.status].some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(query),
        );

      const matchesStatus =
        statusFilter === "ALL" || user.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [users, searchTerm, statusFilter]);

  const activeCount = users.filter((user) => user.status === "ACTIVE").length;

  const blockedCount = users.filter((user) => user.status === "BLOCKED").length;

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
        data: { status },
      }).unwrap();

      toast.success("User status updated successfully.");
      setSelectedUser(null);
    } catch {
      toast.error("Failed to update user status. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center gap-2 px-6 text-center">
        <Users className="h-8 w-8 text-slate-400" />
        <h2 className="font-semibold text-slate-900">Unable to load users</h2>
        <p className="text-sm text-slate-500">
          Please refresh the page or try again later.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50/70 p-4 sm:p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header */}
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-teal-600 p-3">
                <Users className="h-6 w-6 text-white" />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                  Manage Users
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  View user accounts and manage their access status.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-4 py-3">
              <UserRound className="h-4 w-4 text-teal-700" />
              <span className="text-sm font-semibold text-gray-900">
                {users.length}
              </span>
              <span className="text-sm text-gray-500">total users</span>
            </div>
          </header>

          {/* Statistics */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              label="Total Users"
              value={users.length}
              icon={<Users className="h-5 w-5" />}
              iconClass="bg-slate-100 text-slate-700"
            />

            <StatCard
              label="Active Users"
              value={activeCount}
              icon={<ShieldCheck className="h-5 w-5" />}
              iconClass="bg-emerald-50 text-emerald-700"
            />

            <StatCard
              label="Blocked Users"
              value={blockedCount}
              icon={<ShieldBan className="h-5 w-5" />}
              iconClass="bg-red-50 text-red-700"
            />
          </section>

          {/* User directory */}
          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-gray-200 p-5">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  User directory
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Search accounts, filter by status, and manage access.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Search */}
                <div className="relative w-full sm:max-w-sm">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search username or email..."
                    aria-label="Search users"
                    className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  />
                </div>

                {/* Status filter */}
                <div className="relative w-full sm:w-48">
                  <select
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(event.target.value as StatusFilter)
                    }
                    aria-label="Filter users by status"
                    className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white px-3.5 pr-10 text-sm text-gray-700 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  >
                    <option value="ALL">All statuses</option>
                    <option value="ACTIVE">Active only</option>
                    <option value="BLOCKED">Blocked only</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Table */}
            {filteredUsers.length === 0 ? (
              <div className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                  <Search className="h-6 w-6" />
                </div>

                <h3 className="mt-4 font-semibold text-gray-900">
                  {users.length === 0 ? "No users found" : "No matching users"}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {users.length === 0
                    ? "User accounts will appear here."
                    : "Try another search term or status filter."}
                </p>

                {(searchTerm || statusFilter !== "ALL") && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("ALL");
                    }}
                    className="mt-4 rounded-lg px-3 py-2 text-sm font-semibold text-teal-700 transition hover:bg-teal-50"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50/80">
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                        User
                      </th>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Email
                      </th>
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Account status
                      </th>
                      <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="transition hover:bg-gray-50/80"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-sm font-bold uppercase text-teal-700">
                              {user.username?.trim().charAt(0) || "U"}
                            </div>

                            <div className="min-w-0">
                              <p className="max-w-64 truncate text-sm font-semibold text-gray-900">
                                {user.username || "Unnamed user"}
                              </p>
                              <p className="mt-1 text-xs text-gray-400">
                                User account
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="text-sm text-gray-600">
                            {user.email}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                              user.status === "ACTIVE"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                user.status === "ACTIVE"
                                  ? "bg-emerald-500"
                                  : "bg-red-500"
                              }`}
                            />
                            {user.status}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => handleOpenModal(user)}
                              aria-label={`Manage ${user.username}`}
                              title="Manage user status"
                              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            >
                              <Settings className="h-4 w-4" />
                              Manage
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {filteredUsers.length > 0 && (
              <div className="flex flex-col gap-1 border-t border-gray-200 bg-gray-50/60 px-5 py-3 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
                <span>
                  Showing {filteredUsers.length} of {users.length} users
                </span>
                <span>
                  {activeCount} active · {blockedCount} blocked
                </span>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Status management modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleCloseModal();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="manage-user-title"
            className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl"
          >
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h2
                  id="manage-user-title"
                  className="text-lg font-semibold text-gray-900"
                >
                  Manage User
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Update account access status.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isUpdating}
                aria-label="Close modal"
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal body */}
            <div className="space-y-5 p-6">
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 font-bold uppercase text-teal-700">
                    {selectedUser.username?.trim().charAt(0) || "U"}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-semibold text-gray-900">
                      {selectedUser.username}
                    </p>
                    <p className="truncate text-sm text-gray-500">
                      {selectedUser.email}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="user-status"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Account status
                </label>

                <select
                  id="user-status"
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value as UserStatus)
                  }
                  disabled={isUpdating}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm text-gray-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="BLOCKED">Blocked</option>
                </select>

                <p className="mt-2 text-xs leading-5 text-gray-500">
                  Blocked users may lose access to protected resources,
                  depending on your backend authorization rules.
                </p>
              </div>

              {status === "BLOCKED" && selectedUser.status !== "BLOCKED" && (
                <div className="flex gap-3 rounded-xl border border-red-100 bg-red-50 p-3">
                  <ShieldBan className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                  <p className="text-sm leading-5 text-red-700">
                    You are about to block this account. Confirm that you want
                    to change this user&apos;s access status.
                  </p>
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isUpdating}
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleUpdateStatus}
                disabled={isUpdating || status === selectedUser.status}
                className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
                {isUpdating ? "Updating..." : "Update status"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconClass: string;
}

function StatCard({ label, value, icon, iconClass }: StatCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
