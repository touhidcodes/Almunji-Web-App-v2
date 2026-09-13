"use client";

import { useGetAllUsersQuery } from "@/redux/api/userApi";
import { Users } from "lucide-react";
import { useState } from "react";

export default function ManageUsersPage() {
  const { data: usersData, isLoading } = useGetAllUsersQuery();
  const users = usersData?.data || [];

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 border-2 border-teal-600 rounded-full"></div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center gap-3 mb-6">
          <div className="bg-teal-600 p-3 rounded-xl">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
        </header>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {users.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No users found</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {users.map((user: any) => (
                <div key={user.id} className="flex items-center justify-between p-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{user.name || user.username}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <div className="text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${user.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {user.status}
                    </span>
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
