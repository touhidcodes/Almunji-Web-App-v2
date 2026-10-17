"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";
import { useChangePasswordMutation } from "@/redux/api/authApi";

const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must not exceed 128 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must differ from your current password",
    path: ["newPassword"],
  });

type TChangePasswordForm = z.infer<typeof ChangePasswordSchema>;

type TApiError = {
  data?: {
    message?: string;
  };
  message?: string;
};

const ChangePasswordPage: React.FC = () => {
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (data: TChangePasswordForm) => {
    try {
      const result = await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }).unwrap();

      if (result.success) {
        toast.success(result.message || "Password changed successfully.");
      } else {
        toast.error(result.message || "Failed to change password.");
        return;
      }

      // Never keep password values in the form after a successful update.
      window.location.reload();
    } catch (error: unknown) {
      const apiError = error as TApiError;

      toast.error(
        apiError.data?.message ||
          apiError.message ||
          "Unable to change your password. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-10">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Breadcrumb */}
        <nav>
          <Link
            href="/dashboard/profile"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-teal-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Profile
          </Link>
        </nav>

        {/* Page header */}
        <header className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
            <KeyRound className="h-8 w-8" />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-600">
              Security Settings
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Change Password
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
              Update your password regularly to help keep your Almunji account
              secure.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Password form */}
          <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm lg:col-span-2">
            <div className="border-b border-gray-100 px-5 py-6 sm:px-8">
              <div className="flex items-center gap-3">
                <LockKeyhole className="h-5 w-5 text-teal-600" />

                <h2 className="text-lg font-bold text-gray-900">
                  Update your credentials
                </h2>
              </div>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Enter your current password, then choose a new one.
              </p>
            </div>

            <div className="p-5 sm:p-8">
              <FormContainer
                key={String(isLoading)}
                onSubmit={onSubmit}
                resolver={zodResolver(ChangePasswordSchema)}
              >
                <div className="space-y-6">
                  <div className="relative">
                    <FormInput
                      name="currentPassword"
                      label="Current Password"
                      placeholder="Enter your current password"
                      type={showCurrentPassword ? "text" : "password"}
                      required
                    />

                    <button
                      type="button"
                      aria-label={
                        showCurrentPassword
                          ? "Hide current password"
                          : "Show current password"
                      }
                      onClick={() =>
                        setShowCurrentPassword((visible) => !visible)
                      }
                      className="absolute right-3 top-[38px] rounded-md p-1 text-gray-400 transition hover:text-teal-600"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  <div className="relative">
                    <FormInput
                      name="newPassword"
                      label="New Password"
                      placeholder="Enter your new password"
                      type={showNewPassword ? "text" : "password"}
                      required
                    />

                    <button
                      type="button"
                      aria-label={
                        showNewPassword
                          ? "Hide new password"
                          : "Show new password"
                      }
                      onClick={() => setShowNewPassword((visible) => !visible)}
                      className="absolute right-3 top-[38px] rounded-md p-1 text-gray-400 transition hover:text-teal-600"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  <div className="relative">
                    <FormInput
                      name="confirmPassword"
                      label="Confirm New Password"
                      placeholder="Re-enter your new password"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                    />

                    <button
                      type="button"
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                      onClick={() =>
                        setShowConfirmPassword((visible) => !visible)
                      }
                      className="absolute right-3 top-[38px] rounded-md p-1 text-gray-400 transition hover:text-teal-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                  >
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-teal-100 transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoading ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <LockKeyhole className="h-4 w-4" />
                    )}

                    {isLoading ? "Updating Password..." : "Update Password"}
                  </button>
                </div>
              </FormContainer>
            </div>
          </section>

          {/* Security guidance */}
          <aside className="space-y-5">
            <div className="rounded-3xl border border-teal-100 bg-teal-50/70 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-600 text-white">
                <ShieldCheck className="h-6 w-6" />
              </div>

              <h3 className="mt-5 text-base font-bold text-gray-900">
                Password security
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Follow these recommendations to protect your account.
              </p>

              <ul className="mt-5 space-y-4">
                {[
                  "Use at least 8 characters.",
                  "Choose a password you do not use elsewhere.",
                  "Avoid sharing your password with anyone.",
                  "Never include your password in messages or emails.",
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                    <span className="text-sm leading-5 text-gray-700">
                      {tip}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="flex items-start gap-3">
                <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />

                <div>
                  <h3 className="text-sm font-bold text-gray-800">
                    Keep your account safe
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Your current password is required to authorize this change.
                    Your new password should remain private.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <footer className="pb-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Almunji • Account Security
          </p>
        </footer>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
