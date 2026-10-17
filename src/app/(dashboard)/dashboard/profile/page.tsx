"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Bell,
  Camera,
  Check,
  Edit3,
  Key,
  Loader2,
  MapPin,
  BriefcaseBusiness,
  Save,
  ShieldCheck,
  UserRound,
  X,
  Mail,
  AtSign,
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
import { TUserProfileForm, UserProfileSchema } from "@/schema/userSchema";
import { TApiError, TApiResponse } from "@/types/api";
import { TUserProfile } from "@/types/user";

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

const getValue = (value?: string | null): string => {
  return typeof value === "string" && value.trim() ? value : "Not provided";
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

  const [isEditing, setIsEditing] = useState(false);

  const profile = useMemo<TUserProfile | undefined>(() => {
    const result = response as TApiResponse<TUserProfile> | undefined;
    return result?.data;
  }, [response]);

  const defaultValues = useMemo<TUserProfileForm>(
    () => ({
      name: profile?.name ?? "",
      image: profile?.image ?? "",
      bio: profile?.bio ?? "",
      profession: profile?.profession ?? "",
      address: profile?.address ?? "",
    }),
    [profile],
  );

  const onSubmit = async (data: TUserProfileForm) => {
    try {
      const result = await updateProfile(data).unwrap();

      if (result.success) {
        // Fetch the saved profile before returning to view mode.
        await refetch().unwrap();

        setIsEditing(false);

        toast.success("Profile updated successfully!", {
          description: "Your updated information is now displayed.",
        });
      } else {
        toast.error(result.message || "Failed to update profile.");
      }
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
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
        <UserRound className="h-10 w-10 text-gray-400" />

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

  const initials = profile.name?.trim().charAt(0).toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-10">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Page header */}
        <header className="mb-8">
          <div className="mb-5">
            <Link
              href={`/dashboard/${profile.role?.toLowerCase() ?? "user"}/overview`}
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-teal-600"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>

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
                  View and manage your personal information and account details.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                aria-label="Notifications"
                className="rounded-xl border border-gray-200 bg-white p-3 text-gray-500 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-600"
              >
                <Bell className="h-5 w-5" />
              </button>

              <Link
                href="/dashboard/change-password"
                aria-label="Change password"
                className="rounded-xl border border-gray-200 bg-white p-3 text-gray-500 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-600"
              >
                <Key className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </header>

        {/* Profile information card */}
        <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          {/* Card heading and edit action */}
          <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-5 py-5 sm:px-8">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Personal Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {isEditing
                  ? "Update your information using the form below."
                  : "Your personal details and profile information."}
              </p>
            </div>

            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                aria-label="Edit profile"
                title="Edit profile"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-teal-100 bg-teal-50 px-3 py-2.5 text-sm font-semibold text-teal-700 transition hover:border-teal-200 hover:bg-teal-100 sm:px-4"
              >
                <Edit3 className="h-4 w-4" />
                <span className="hidden sm:inline">Edit Profile</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                aria-label="Cancel editing"
                title="Cancel editing"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50 sm:px-4"
              >
                <X className="h-4 w-4" />
                <span className="hidden sm:inline">Cancel</span>
              </button>
            )}
          </div>

          <div className="p-5 sm:p-8">
            {isEditing ? (
              /* Edit mode */
              <FormContainer
                key={profile.id}
                onSubmit={onSubmit}
                resolver={zodResolver(UserProfileSchema)}
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
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
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
            ) : (
              /* Read-only view mode */
              <div className="space-y-8">
                {/* Profile summary */}
                <div className="flex flex-col gap-5 border-b border-gray-100 pb-8 sm:flex-row sm:items-center">
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-teal-50 text-3xl font-bold text-teal-700 ring-1 ring-teal-100">
                    {profile.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={profile.image}
                        alt={profile.name || "Profile image"}
                        className="h-full w-full object-cover"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      initials
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="break-words text-2xl font-bold text-gray-900">
                      {getValue(profile.name)}
                    </h3>

                    <p className="mt-1 break-words text-sm text-gray-500">
                      {getValue(profile.profession)}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        {getValue(profile.role)}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          profile.status?.toUpperCase() === "ACTIVE"
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {getValue(profile.status)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Information grid */}
                <div className="grid grid-cols-1 gap-x-8 gap-y-7 md:grid-cols-2">
                  <InfoItem
                    icon={<UserRound className="h-4 w-4" />}
                    label="Full Name"
                    value={profile.name}
                  />

                  <InfoItem
                    icon={<AtSign className="h-4 w-4" />}
                    label="Username"
                    value={profile.username}
                  />

                  <InfoItem
                    icon={<Mail className="h-4 w-4" />}
                    label="Email Address"
                    value={profile.email}
                  />

                  <InfoItem
                    icon={<BriefcaseBusiness className="h-4 w-4" />}
                    label="Profession"
                    value={profile.profession}
                  />

                  <InfoItem
                    icon={<MapPin className="h-4 w-4" />}
                    label="Address"
                    value={profile.address}
                  />

                  <div className="md:col-span-2">
                    <InfoItem
                      icon={<UserRound className="h-4 w-4" />}
                      label="About Me"
                      value={profile.bio}
                    />
                  </div>
                </div>

                {isFetching && (
                  <p className="flex items-center gap-2 text-xs text-gray-400">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Refreshing profile information...
                  </p>
                )}
              </div>
            )}
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

type TInfoItemProps = {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
};

function InfoItem({ icon, label, value }: TInfoItemProps) {
  return (
    <div className="min-w-0">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
        <span className="text-teal-600">{icon}</span>
        {label}
      </p>

      <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-gray-800">
        {getValue(value)}
      </p>
    </div>
  );
}

export default ProfilePage;
