"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  LoaderCircle,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";
import { Button } from "@/components/ui/button";
import { useChangePasswordMutation } from "@/redux/api/authApi";
import { ChangePasswordSchema, TChangePasswordForm } from "@/schema/authSchema";
import { TApiError } from "@/types/api";
import { userLogout } from "@/services/actions/logoutUser";

const ChangePasswordPage: React.FC = () => {
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const onSubmit = async (data: TChangePasswordForm) => {
    try {
      const result = await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }).unwrap();

      if (result.success) {
        toast.success(result.message || "Password changed successfully.");

        // Log out the user after changing the password.
        await userLogout();
        return;
      }

      toast.error(result.message || "Failed to change password.");
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
                onSubmit={onSubmit}
                resolver={zodResolver(ChangePasswordSchema)}
                defaultValues={{
                  currentPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                }}
              >
                <div className="space-y-6">
                  <FormInput
                    name="currentPassword"
                    label="Current Password"
                    placeholder="Enter your current password"
                    type="password"
                    required
                  />

                  <FormInput
                    name="newPassword"
                    label="New Password"
                    placeholder="Enter your new password"
                    type="password"
                    required
                  />

                  <FormInput
                    name="confirmPassword"
                    label="Confirm New Password"
                    placeholder="Re-enter your new password"
                    type="password"
                    required
                  />

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-teal-600 text-white hover:bg-teal-700 sm:w-auto"
                  >
                    {isLoading ? (
                      <>
                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        Updating Password...
                      </>
                    ) : (
                      <>
                        <LockKeyhole className="mr-2 h-4 w-4" />
                        Update Password
                      </>
                    )}
                  </Button>
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

        {/* Footer */}
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
