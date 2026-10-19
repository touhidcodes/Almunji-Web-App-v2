"use client";

import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";
import { Button } from "@/components/ui/button";
import { registerValidationSchema } from "@/schema/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, UserPlus, Sparkles } from "lucide-react";
import Link from "next/link";
import { FieldValues } from "react-hook-form";

interface RegisterFormProps {
  onSubmit: (values: FieldValues) => void;
  error?: string;
  toggle: () => void;
  loading: boolean;
}

const RegisterForm = ({
  onSubmit,
  error,
  toggle,
  loading,
}: RegisterFormProps) => {
  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* Decorative background blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-indigo-100 opacity-50 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-violet-100 opacity-40 blur-3xl"
      />

      {/* Card */}
      <div className="relative space-y-7 rounded-2xl border border-gray-200/70 bg-white/80 px-8 py-8 shadow-xl shadow-gray-200/60 backdrop-blur-md sm:py-10">
        {/* Back to Home */}
        <Link
          href="/"
          className="group inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 transition-colors hover:text-teal-600"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-white shadow-md shadow-teal-200">
              <Sparkles className="h-4 w-4" />
            </span>

            <span className="text-xs font-semibold uppercase tracking-widest text-teal-600">
              Almunji
            </span>
          </div>

          <h1 className="pt-1 text-2xl font-bold tracking-tight text-gray-900">
            Create your account
          </h1>

          <p className="text-sm text-gray-500">
            Join Almunji and get started today
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-lg border border-red-100 bg-red-50 px-4 py-3"
          >
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Form */}
        <FormContainer
          onSubmit={onSubmit}
          resolver={zodResolver(registerValidationSchema)}
          defaultValues={{
            username: "",
            email: "",
            password: "",
          }}
        >
          <div className="space-y-4">
            <FormInput name="username" label="Username" type="text" required />

            <FormInput
              name="email"
              label="Email Address"
              type="email"
              required
            />

            <FormInput
              name="password"
              label="Password"
              type="password"
              required
            />
          </div>

          {/* Terms & Privacy Policy */}
          <div className="mb-5 mt-4 flex items-start gap-2">
            <input
              id="accept-terms"
              type="checkbox"
              required
              className="mt-0.5 h-3.5 w-3.5 shrink-0 cursor-pointer rounded border-gray-300 accent-teal-600"
            />

            <label
              htmlFor="accept-terms"
              className="cursor-pointer text-xs leading-relaxed text-gray-500"
            >
              I agree to the{" "}
              <Link
                href="#"
                className="font-semibold text-teal-600 underline decoration-teal-300 underline-offset-2 transition-colors hover:text-teal-700"
              >
                Terms & Privacy Policy
              </Link>
            </label>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-teal-600 font-semibold text-white shadow-md shadow-indigo-200 transition-all duration-150 hover:bg-teal-700 active:bg-teal-800"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                Create account
              </>
            )}
          </Button>
        </FormContainer>

        {/* Divider */}
        <div className="relative flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-100" />
          <span className="text-xs text-gray-400">or</span>
          <div className="h-px flex-1 bg-gray-100" />
        </div>

        {/* Login toggle */}
        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <button
            type="button"
            onClick={toggle}
            className="font-semibold text-teal-600 underline decoration-teal-300 underline-offset-2 transition-colors hover:text-teal-700"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
