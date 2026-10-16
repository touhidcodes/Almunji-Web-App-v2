"use client";

import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Bell,
  Camera,
  Key,
  Loader2,
  Save,
  Settings,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { z } from "zod";

import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";
import FormTextarea from "@/components/forms/FormTextarea";

import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/redux/api/userApi";

const ProfileSchema = z.object({
  name: z.string().trim(),
  image: z.string().trim(),
  bio: z.string().trim(),
  profession: z.string().trim(),
  address: z.string().trim(),
});

type TProfileForm = z.infer<typeof ProfileSchema>;

type TProfile = {
  id: string;
  userId?: string;
  name?: string | null;
  username?: string | null;
  email?: string | null;
  image?: string | null;
  bio?: string | null;
  profession?: string | null;
  address?: string | null;
  role?: string | null;
  status?: string | null;
};

type TApiResponse = {
  success?: boolean;
  message?: string;
  data?: TProfile;
};

type TApiError = {
  data?: {
    message?: string;
  };
  message?: string;
};

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "object" && error !== null) {
    const apiError = error as TApiError;

    if (typeof apiError.data?.message === "string") {
      return apiError.data.message;
    }

    if (typeof apiError.message === "string") {
      return apiError.message;
    }
  }

  return "Something went wrong. Please try again.";
};

const ProfilePage: React.FC = () => {
  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetProfileQuery();

  const [updateProfile, { isLoading: isSubmitting }] =
    useUpdateProfileMutation();

  // Your API returns a flattened object inside `data`.
  const profile = useMemo<TProfile | undefined>(() => {
    const result = response as TApiResponse | undefined;

    if (!result) return undefined;

    return result.data;
  }, [response]);

  const defaultValues = useMemo<TProfileForm>(
    () => ({
      name: profile?.name ?? "",
      username: profile?.username ?? "",
      email: profile?.email ?? "",
      image: profile?.image ?? "",
      bio: profile?.bio ?? "",
      profession: profile?.profession ?? "",
      address: profile?.address ?? "",
    }),
    [profile],
  );

  const onSubmit = async (data: TProfileForm) => {
    try {
      const result = await updateProfile({
        name: data.name,
        image: data.image,
        bio: data.bio,
        profession: data.profession,
        address: data.address,
      }).unwrap();

      if (result.success) {
        toast.success("Profile updated successfully!", {
          description: "Your profile information has been saved.",
        });
      } else {
        toast.error(result.message || "Failed to update profile.");
      }
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin text-teal-600" />
          Loading your profile...
        </div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-gray-50 px-5 text-center">
        <div className="rounded-full bg-red-50 p-4 text-red-600">
          <UserRound className="h-8 w-8" />
        </div>

        <h2 className="text-xl font-bold text-gray-900">
          Unable to load your profile
        </h2>

        <p className="max-w-md text-sm text-gray-500">
          We couldn&apos;t retrieve your profile information. Please try again.
        </p>

        <button
          type="button"
          onClick={() => void refetch()}
          className="rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="mb-8">
          {/* Breadcrumb */}
          <div className="mb-5">
            <Link
              href={`/dashboard/${profile.role?.toLowerCase() ?? "user"}/overview`}
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-teal-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>

          {/* Header */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 ring-1 ring-teal-100">
                <UserRound className="h-7 w-7" />
              </div>

              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-teal-600">
                  Account Management
                </p>

                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                  My Profile
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-gray-600 sm:text-base">
                  Manage your personal information, update your profile, and
                  keep your account details up to date.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                aria-label="Notifications"
                className="rounded-xl border border-gray-200 bg-white p-3 text-gray-500 transition-colors hover:border-teal-200 hover:bg-teal-50 hover:text-teal-600"
              >
                <Bell className="h-5 w-5" />
              </button>

              <Link
                href="/dashboard/change-password"
                aria-label="change-password"
                className="rounded-xl border border-gray-200 bg-white p-3 text-gray-500 transition-colors hover:border-teal-200 hover:bg-teal-50 hover:text-teal-600"
              >
                <Key className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Profile form */}
        <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-6 sm:px-8">
            <h2 className="text-lg font-bold text-gray-900">
              Personal Information
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Update the information associated with your account.
            </p>
          </div>

          <div className="p-5 sm:p-8">
            <FormContainer
              key={profile.id}
              onSubmit={onSubmit}
              resolver={zodResolver(ProfileSchema)}
              defaultValues={defaultValues}
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormInput
                  name="name"
                  label="Full Name"
                  placeholder="Enter your full name"
                />

                <FormInput
                  name="profession"
                  label="Profession"
                  placeholder="e.g. Web Developer"
                />

                <div className="md:col-span-2">
                  <FormInput
                    name="image"
                    label="Profile Image URL"
                    placeholder="https://example.com/profile.jpg"
                  />

                  <p className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                    <Camera className="h-3.5 w-3.5" />
                    Provide a publicly accessible image URL.
                  </p>
                </div>

                <div className="md:col-span-2">
                  <FormTextarea
                    name="bio"
                    label="About Me"
                    rows={4}
                    placeholder="Write a short introduction about yourself..."
                  />
                </div>

                <div className="md:col-span-2">
                  <FormTextarea
                    name="address"
                    label="Address"
                    rows={3}
                    placeholder="Enter your address"
                  />
                </div>
              </div>

              <div className="mt-8 flex flex-col-reverse justify-end gap-3 border-t border-gray-100 pt-6 sm:flex-row">
                <button
                  type="button"
                  onClick={() => void refetch()}
                  disabled={isSubmitting}
                  className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Reload Profile
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-teal-100 transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}

                  {isSubmitting ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </FormContainer>
          </div>
        </section>

        <footer className="pb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Almunji • Profile Management
          </p>
        </footer>
      </div>
    </div>
  );
};

export default ProfilePage;
