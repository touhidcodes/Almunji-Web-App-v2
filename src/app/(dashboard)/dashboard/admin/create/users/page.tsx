"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useRegisterMutation } from "@/redux/api/authApi";
import { useUpdateUserStatusMutation } from "@/redux/api/userApi";
import {
  useAssignBulkPermissionsMutation,
  useGetAllPermissionsQuery,
} from "@/redux/api/permissionApi";
import { UserRole } from "@/types/user";
import type { TApiResponse } from "@/types/api";

type CreatedUser = { id: string };

export default function CreateUserPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>(UserRole.USER);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [createdUserId, setCreatedUserId] = useState<string | null>(null);
  const [register] = useRegisterMutation();
  const [updateUser] = useUpdateUserStatusMutation();
  const [assignPermissions] = useAssignBulkPermissionsMutation();
  const { data: permissionsData, isLoading: permissionsLoading } =
    useGetAllPermissionsQuery(undefined, { skip: role !== UserRole.MODERATOR });
  const permissions = permissionsData?.data?.permissions ?? [];
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    let userId = createdUserId;
    try {
      if (!userId) {
        const response = (await register({
          username,
          email,
          password,
        }).unwrap()) as TApiResponse<CreatedUser>;
        userId = response.data?.id ?? null;
      }
      if (!userId)
        throw new Error(
          "Account created, but the server did not return its ID.",
        );
      setCreatedUserId(userId);
      if (role !== UserRole.USER) {
        await updateUser({ userId, data: { role } }).unwrap();
      }
      if (role === UserRole.MODERATOR && selectedPermissions.length > 0) {
        await assignPermissions({
          userId,
          permissionIds: selectedPermissions,
        }).unwrap();
      }
      toast.success("User created successfully.");
      window.location.href = "/dashboard/admin/manage/users";
    } catch (error) {
      toast.error(
        userId
          ? "Account created, but access setup failed. Retry here or finish in Manage Users."
          : error instanceof Error
            ? error.message
            : "Could not create user.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-4 sm:p-8">
      <div>
        <Link
          href="/dashboard/admin/manage/users"
          className="text-sm font-medium text-teal-700 hover:underline"
        >
          ← Manage Users
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-gray-900">Create User</h1>
        <p className="mt-1 text-sm text-gray-500">
          Create an account and set its access level.
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-gray-700">
            Username
            <input
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-gray-200 p-3"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-gray-700">
            Email
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-200 p-3"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-gray-700">
            Password
            <input
              required
              minLength={8}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-200 p-3"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-gray-700">
            Role
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value as UserRole);
                setSelectedPermissions([]);
              }}
              className="w-full rounded-xl border border-gray-200 p-3"
            >
              <option value={UserRole.USER}>User</option>
              <option value={UserRole.MODERATOR}>Moderator</option>
              <option value={UserRole.ADMIN}>Admin</option>
            </select>
          </label>
        </div>
        {role === UserRole.MODERATOR && (
          <section className="space-y-3 border-t border-gray-100 pt-5">
            <h2 className="font-semibold text-gray-900">
              Moderator permissions
            </h2>
            <p className="text-sm text-gray-500">
              Choose the resources and actions this moderator can access.
            </p>
            {permissionsLoading ? (
              <p className="text-sm text-gray-500">Loading permissions…</p>
            ) : (
              <div className="grid max-h-72 gap-2 overflow-y-auto sm:grid-cols-2">
                {permissions.map((permission) => (
                  <label
                    key={permission.id}
                    className="flex items-center gap-2 rounded-lg border border-gray-200 p-3 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={selectedPermissions.includes(permission.id)}
                      onChange={() =>
                        setSelectedPermissions((current) =>
                          current.includes(permission.id)
                            ? current.filter((id) => id !== permission.id)
                            : [...current, permission.id],
                        )
                      }
                    />
                    <span>
                      {permission.resource}:{permission.action}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </section>
        )}
        <div className="flex justify-end">
          <button
            disabled={
              isSaving || (role === UserRole.MODERATOR && permissionsLoading)
            }
            className="rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {isSaving ? "Creating…" : "Create User"}
          </button>
        </div>
      </form>
    </main>
  );
}
