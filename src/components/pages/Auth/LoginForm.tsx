"use client";

import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";
import { Button } from "@/components/ui/button";
import { loginValidationSchema } from "@/schema/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, LogIn, Sparkles } from "lucide-react";
import Link from "next/link";
import { FieldValues } from "react-hook-form";

interface LoginFormProps {
  onSubmit: (values: FieldValues) => void;
  error?: string;
  toggle: () => void;
  loading: boolean;
}

const LoginForm = ({ onSubmit, error, toggle, loading }: LoginFormProps) => {
  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Decorative background blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -left-20 w-64 h-64 rounded-full bg-indigo-100 opacity-50 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-violet-100 opacity-40 blur-3xl"
      />

      {/* Card */}
      <div className="relative bg-white/80 backdrop-blur-md border border-gray-200/70 rounded-2xl shadow-xl shadow-gray-200/60 px-8 py-10 space-y-7">
        {/* Back to Home */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-teal-600 transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-teal-600 text-white shadow-md shadow-teal-200">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-semibold tracking-widest uppercase text-teal-600">
              Almunji
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight pt-1">
            Welcome back
          </h1>
          <p className="text-sm text-gray-500">
            Sign in to continue to your account
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2.5 rounded-lg bg-red-50 border border-red-100 px-4 py-3">
            <span className="mt-0.5 shrink-0 w-1.5 h-1.5 rounded-full bg-red-400" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Form */}
        <FormContainer
          onSubmit={onSubmit}
          resolver={zodResolver(loginValidationSchema)}
          defaultValues={{ identifier: "", password: "" }}
        >
          <div className="space-y-4">
            <FormInput
              name="identifier"
              label="Email or Username"
              type="text"
              required
            />
            <FormInput
              name="password"
              label="Password"
              type="password"
              required
            />
          </div>

          {/* Remember me / Forgot password */}
          <div className="flex items-center justify-between mt-4 mb-5">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                className="w-3.5 h-3.5 rounded border-gray-300 text-teal-600 accent-teal-600 cursor-pointer"
              />
              <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors select-none">
                Remember me
              </span>
            </label>
            <Link
              href="#"
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 underline underline-offset-2 decoration-teal-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold rounded-xl shadow-md shadow-indigo-200 transition-all duration-150 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Sign in
              </>
            )}
          </Button>
        </FormContainer>

        {/* Divider */}
        <div className="relative flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* Register toggle */}
        <p className="text-sm text-center text-gray-500">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={toggle}
            className="font-semibold text-teal-600 hover:text-teal-700 underline underline-offset-2 decoration-teal-300 transition-colors"
          >
            Create one
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
