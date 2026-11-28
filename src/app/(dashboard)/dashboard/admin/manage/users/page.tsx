"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useGetAllUsersQuery,
  useUpdateUserStatusMutation,
} from "@/redux/api/userApi";
import {
  useGetAllPermissionsQuery,
  useAssignBulkPermissionsMutation,
  useGetUserPermissionsQuery,
  useRemovePermissionMutation,
} from "@/redux/api/permissionApi";
import type { TUser, UserRole, UserStatus } from "@/types/user";
import type { Permission } from "@/types/permission";
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
  Shield,
  Award,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconClass: string;
}

const ROLE_OPTIONS: { label: string; value: UserRole }[] = [
  { label: "User", value: "USER" as UserRole },
  { label: "Moderator", value: "MODERATOR" as UserRole },
  { label: "Admin", value: "ADMIN" as UserRole },
];

const STATUS_OPTIONS: { label: string; value: UserStatus }[] = [
  { label: "Active", value: "ACTIVE" as UserStatus },
  { label: "Blocked", value: "BLOCKED" as UserStatus },
];

export default function ManageUsersPage() {
  // Selected user and modal state
  const [selectedUser, setSelectedUser] = useState<TUser | null>(null);
  const [status, setStatus] = useState<UserStatus>("ACTIVE" as UserStatus);
  const [role, setRole] = useState<UserRole>("USER" as UserRole);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [assignedPermissions, setAssignedPermissions] = useState<string[]>([]);

  // Directory filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [roleFilter, setRoleFilter] = useState("ALL");

  // Users query
  const {
    data: usersData,
    isLoading: usersLoading,
    isError: usersError,
    refetch: refetchUsers,
  } = useGetAllUsersQuery();

  // Available permissions
  const { data: permissionsData, isLoading: permissionsLoading } =
    useGetAllPermissionsQuery(undefined, { skip: role !== "MODERATOR" || !selectedUser });

  // User permissions
  // currentData belongs to the currently selected query argument.
  const {
    currentData: currentUserPermissionsData,
    isLoading: userPermissionsLoading,
    isFetching: userPermissionsFetching,
    isError: userPermissionsError,
  } = useGetUserPermissionsQuery(selectedUser?.id ?? "", {
    skip: !selectedUser?.id || role !== "MODERATOR",
  });

  // Mutations
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserStatusMutation();

  const [assignPermissions, { isLoading: isAssigning }] =
    useAssignBulkPermissionsMutation();

  const [removePermission, { isLoading: isRemoving }] =
    useRemovePermissionMutation();

  // API data
  const users: TUser[] = usersData?.data ?? [];
  const permissions: Permission[] = permissionsData?.data?.permissions ?? [];

  // Synchronize modal state when the selected user changes.
  useEffect(() => {
    if (!selectedUser) {
      return;
    }

    setStatus(selectedUser.status);
    setRole(selectedUser.role);
    setSelectedPermissions([]);
    setAssignedPermissions([]);
  }, [selectedUser?.id]);

  // Load permissions only from the currently selected user's query.
  useEffect(() => {
    if (!selectedUser || !currentUserPermissionsData) {
      return;
    }

    const permissionIds = (currentUserPermissionsData.data ?? [])
      .filter((permission) => Boolean(permission?.id))
      .map((permission) => permission.id);

    setSelectedPermissions(permissionIds);
    setAssignedPermissions(permissionIds);
  }, [selectedUser?.id, currentUserPermissionsData]);

  // Filter users
  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        [user.username, user.email, user.status, user.role].some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(query),
        );

      const matchesStatus =
        statusFilter === "ALL" || user.status === statusFilter;

      const matchesRole =
        roleFilter === "ALL" || String(user.role).toUpperCase() === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, searchTerm, statusFilter, roleFilter]);

  // Statistics
  const activeCount = users.filter((user) => user.status === "ACTIVE").length;

  const blockedCount = users.filter((user) => user.status === "BLOCKED").length;

  const isSaving = isUpdating || isAssigning || isRemoving;

  // Modal handlers
  const handleOpenModal = (user: TUser) => {
    setSelectedPermissions([]);
    setAssignedPermissions([]);
    setSelectedUser(user);
  };

  const handleCloseModal = () => {
    if (isSaving) return;

    setSelectedUser(null);
    setSelectedPermissions([]);
  };

  const handleTogglePermission = (permissionId: string) => {
    setSelectedPermissions((previous) =>
      previous.includes(permissionId)
        ? previous.filter((id) => id !== permissionId)
        : [...previous, permissionId],
    );
  };

  // Update user role and status
  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    const hasChanges =
      status !== selectedUser.status || role !== selectedUser.role;

    if (!hasChanges) {
      toast.info("No changes to update.");
      return;
    }

    try {
      await updateUser({
        userId: selectedUser.id,
        data: { status, role },
      }).unwrap();

      toast.success("User updated successfully.");
      setSelectedUser(null);
      setSelectedPermissions([]);
    } catch {
      toast.error("Failed to update user. Please try again.");
    }
  };

  // Assign selected permissions
  const handleAssignPermissions = async () => {
    if (!selectedUser || role !== "MODERATOR" || selectedUser.role !== "MODERATOR") return;

    if (userPermissionsLoading || userPermissionsFetching) {
      toast.info("Please wait until the user's permissions finish loading.");
      return;
    }

    if (userPermissionsError) {
      toast.error("Unable to load the user's current permissions.");
      return;
    }

    const newPermissionIds = selectedPermissions.filter(
      (id) => !assignedPermissions.includes(id),
    );
    if (newPermissionIds.length === 0) {
      toast.error("Please select at least one permission.");
      return;
    }

    try {
      await assignPermissions({
        userId: selectedUser.id,
        permissionIds: newPermissionIds,
      }).unwrap();

      toast.success(
        `${newPermissionIds.length} permissions assigned successfully.`,
      );
    } catch {
      toast.error("Failed to assign permissions.");
    }
  };

  // Remove a permission
  const handleRemovePermission = async (permissionId: string) => {
    if (!selectedUser || role !== "MODERATOR" || selectedUser.role !== "MODERATOR") return;

    try {
      await removePermission({
        userId: selectedUser.id,
        permissionId,
      }).unwrap();

      setSelectedPermissions((previous) =>
        previous.filter((id) => id !== permissionId),
      );
      setAssignedPermissions((previous) => previous.filter((id) => id !== permissionId));

      toast.success("Permission removed successfully.");
    } catch {
      toast.error("Failed to remove permission.");
    }
  };

  // Loading state
  if (usersLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  // Error state
  if (usersError) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center gap-3 px-6 text-center">
        <AlertCircle className="h-9 w-9 text-red-500" />

        <div>
          <h2 className="font-semibold text-gray-900">Unable to load users</h2>
          <p className="mt-1 text-sm text-gray-500">
            Something went wrong while retrieving user accounts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void refetchUsers()}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50/70 p-4 sm:p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Page header */}
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
                  View user accounts and manage their access.
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
            <Link href="/dashboard/admin/create/users" className="rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-700">Create User</Link>
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
                    placeholder="Search username, email, or role..."
                    aria-label="Search users"
                    className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  {/* Status filter */}
                  <div className="relative w-full sm:w-48">
                    <select
                      value={statusFilter}
                      onChange={(event) => setStatusFilter(event.target.value)}
                      aria-label="Filter users by status"
                      className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white px-3.5 pr-10 text-sm text-gray-700 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                    >
                      <option value="ALL">All statuses</option>
                      <option value="ACTIVE">Active only</option>
                      <option value="BLOCKED">Blocked only</option>
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  </div>

                  {/* Role filter */}
                  <div className="relative w-full sm:w-48">
                    <select
                      value={roleFilter}
                      onChange={(event) => setRoleFilter(event.target.value)}
                      aria-label="Filter users by role"
                      className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white px-3.5 pr-10 text-sm text-gray-700 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                    >
                      <option value="ALL">All roles</option>
                      <option value="ADMIN">Admin</option>
                      <option value="MODERATOR">Moderator</option>
                      <option value="USER">User</option>
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Empty state */}
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
                    : "Try another search term or filter."}
                </p>

                {(searchTerm ||
                  statusFilter !== "ALL" ||
                  roleFilter !== "ALL") && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("ALL");
                      setRoleFilter("ALL");
                    }}
                    className="mt-4 rounded-lg px-3 py-2 text-sm font-semibold text-teal-700 transition hover:bg-teal-50"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              /* Users table */
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
                        Role
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
                              user.role === "ADMIN"
                                ? "bg-purple-50 text-purple-700"
                                : user.role === "MODERATOR"
                                  ? "bg-blue-50 text-blue-700"
                                  : "bg-gray-50 text-gray-700"
                            }`}
                          >
                            <Award className="h-3 w-3" />
                            {user.role || "USER"}
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

            {/* Table footer */}
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

      {/* Manage user modal */}
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
            className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl"
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
                  Update account access status and permissions.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isSaving}
                aria-label="Close modal"
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal body */}
            <div className="flex-1 space-y-6 overflow-y-auto p-6">
              {/* User information */}
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 font-bold uppercase text-teal-700">
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

              {/* Role and status */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="user-role"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    User Role
                  </label>

                  <select
                    id="user-role"
                    value={role}
                    onChange={(event) =>
                      setRole(event.target.value as UserRole)
                    }
                    disabled={isSaving}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm text-gray-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                  >
                    {ROLE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <p className="mt-2 text-xs leading-5 text-gray-500">
                    Role determines the user&apos;s overall access level.
                  </p>
                </div>

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
                    onChange={(event) =>
                      setStatus(event.target.value as UserStatus)
                    }
                    disabled={isSaving}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm text-gray-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <p className="mt-2 text-xs leading-5 text-gray-500">
                    Blocked users may lose access to protected resources.
                  </p>
                </div>
              </div>

              {/* Permissions */}
              {role === "MODERATOR" && (
              <div className="space-y-4 border-t border-gray-100 pt-6">
                {selectedUser.role !== "MODERATOR" && (
                  <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">Save the moderator role before assigning permissions.</p>
                )}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-teal-600" />
                    <h3 className="text-base font-semibold text-gray-900">
                      Permissions
                    </h3>
                    <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">
                      {selectedPermissions.length} selected
                    </span>
                  </div>
                </div>

                {/* Permissions loading */}
                {(userPermissionsLoading || userPermissionsFetching) && (
                  <div className="flex min-h-32 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50">
                    <Loader2 className="h-5 w-5 animate-spin text-teal-600" />
                    <span className="text-sm text-gray-500">
                      Loading user permissions...
                    </span>
                  </div>
                )}

                {/* Permissions error */}
                {userPermissionsError &&
                  !userPermissionsLoading &&
                  !userPermissionsFetching && (
                    <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
                      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                      <div>
                        <p className="text-sm font-medium text-red-700">
                          Unable to load user permissions
                        </p>
                        <p className="mt-1 text-xs text-red-600">
                          Close the modal and try again.
                        </p>
                      </div>
                    </div>
                  )}

                {/* Current assigned permissions */}
                {!userPermissionsLoading &&
                  !userPermissionsFetching &&
                  !userPermissionsError &&
                  selectedPermissions.length > 0 && (
                    <div>
                      <p className="mb-3 text-xs font-medium text-gray-500">
                        Currently selected permissions
                      </p>

                      <div className="grid grid-cols-1 gap-2">
                        {selectedPermissions.map((permissionId) => {
                          const permission = permissions.find(
                            (item) => item.id === permissionId,
                          );

                          if (!permission) return null;

                          return (
                            <div
                              key={permissionId}
                              className="flex items-center gap-3 rounded-lg border border-teal-100 bg-teal-50 px-4 py-3"
                            >
                              <ShieldCheck className="h-5 w-5 shrink-0 text-teal-600" />

                              <div className="min-w-0 flex-1">
                                <span className="text-sm font-medium text-gray-700">
                                  {permission.resource}:{permission.action}
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() =>
                                  handleRemovePermission(permissionId)
                                }
                                disabled={isSaving || selectedUser.role !== "MODERATOR"}
                                aria-label={`Remove ${permission.resource} ${permission.action} permission`}
                                className="rounded-md p-1 text-red-500 transition hover:bg-red-100 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {isRemoving ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <X className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                {/* Available permissions */}
                <div>
                  <p className="mb-3 text-xs font-medium text-gray-500">
                    Available permissions
                  </p>

                  {permissionsLoading ? (
                    <div className="flex min-h-32 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50">
                      <Loader2 className="h-5 w-5 animate-spin text-teal-600" />
                      <span className="text-sm text-gray-500">
                        Loading available permissions...
                      </span>
                    </div>
                  ) : permissions.length === 0 ? (
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center">
                      <Shield className="mx-auto h-6 w-6 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">
                        No permissions are available.
                      </p>
                    </div>
                  ) : (
                    <div className="grid max-h-80 grid-cols-1 gap-3 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50 p-3 sm:grid-cols-2 lg:grid-cols-3">
                      {permissions.map((permission) => {
                        const isSelected = selectedPermissions.includes(
                          permission.id,
                        );

                        return (
                          <label
                            key={permission.id}
                            className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 transition ${
                              isSelected
                                ? "border-teal-200 bg-teal-50"
                                : "border-gray-200 bg-white hover:bg-gray-50"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              disabled={
                                isSaving ||
                                selectedUser.role !== "MODERATOR" ||
                                userPermissionsLoading ||
                                userPermissionsFetching ||
                                userPermissionsError ||
                                assignedPermissions.includes(permission.id)
                              }
                              onChange={() =>
                                handleTogglePermission(permission.id)
                              }
                              className="mt-1 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                            />

                            <div className="min-w-0 flex-1">
                              <span
                                className={`text-sm font-medium ${
                                  isSelected ? "text-teal-700" : "text-gray-700"
                                }`}
                              >
                                {permission.resource}:{permission.action}
                              </span>

                              {isSelected && (
                                <div className="mt-1 flex items-center gap-1 text-xs text-teal-600">
                                  <ShieldCheck className="h-3 w-3" />
                                  Selected
                                </div>
                              )}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              )}

              {/* Block account warning */}
              {status === "BLOCKED" && selectedUser.status !== "BLOCKED" && (
                <div className="flex gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
                  <ShieldBan className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                  <div>
                    <p className="text-sm font-medium text-red-700">
                      You are about to block this account.
                    </p>
                    <p className="mt-1 text-xs leading-5 text-red-600">
                      This user may lose access to protected resources.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="flex flex-col-reverse gap-3 border-t border-gray-100 px-6 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isSaving}
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleUpdateUser}
                disabled={
                  isSaving ||
                  (status === selectedUser.status && role === selectedUser.role)
                }
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
                {isUpdating ? "Updating..." : "Update User"}
              </button>

              {role === "MODERATOR" && selectedUser.role === "MODERATOR" && <button
                type="button"
                onClick={handleAssignPermissions}
                disabled={
                  isSaving ||
                  userPermissionsLoading ||
                  userPermissionsFetching ||
                  userPermissionsError ||
                  permissionsLoading ||
                  selectedPermissions.every((id) => assignedPermissions.includes(id))
                }
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isAssigning ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Assigning...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4" />
                    Assign Permissions
                  </>
                )}
              </button>}
            </div>
          </div>
        </div>
      )}
    </>
  );
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
