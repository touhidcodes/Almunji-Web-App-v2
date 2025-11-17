// components/Auth/LoginForm.tsx
"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues } from "react-hook-form";
import FormContainer from "@/components/Forms/FormContainer";
import FormInput from "@/components/Forms/FormInput";
import Link from "next/link";
import { z } from "zod";
import { ArrowRight, Loader2 } from "lucide-react";

interface LoginFormProps {
  onSubmit: (values: FieldValues) => void;
  schema: z.ZodSchema;
  error?: string;
  toggle: () => void;
  onTestLogin: (type: "user" | "admin") => void;
  loading: boolean;
}

const LoginForm = ({
  onSubmit,
  schema,
  error,
  toggle,
  onTestLogin,
  loading,
}: LoginFormProps) => {
  return (
    <div className="w-full max-w-sm space-y-5">
      <div className="text-left">
        <h2 className="text-2xl font-semibold text-gray-800">
          Welcome Back to ApartSol!
          <br />
          <span>Your Living Solutions</span>
        </h2>
        <p className="text-sm text-gray-500 mt-2">Sign in to your account</p>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <FormContainer
        onSubmit={onSubmit}
        resolver={zodResolver(schema)}
        defaultValues={{ identifier: "", password: "" }}
      >
        <div className="space-y-4">
          <FormInput
            name="identifier"
            label="Your Email or Username"
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

        <div className="flex items-center justify-between mt-3 mb-2 space-x-6">
          <div className="flex items-center text-xs text-gray-500">
            <input type="checkbox" className="mr-2" />
            <p>Remember Me</p>
          </div>
          <Link
            href="#"
            className="text-xs text-slate-800 underline cursor-pointer font-semibold"
          >
            Forgot Password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full bg-slate-800 text-white hover:bg-slate-700"
          disabled={loading}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Login"}
        </Button>
      </FormContainer>
      <div className="flex justify-between">
        <Button
          variant="outline"
          className="bg-transparent border-slate-600 hover:bg-slate-800 hover:text-white hover:border-white rounded-full px-6 py-2 font-medium transition-all duration-200 group"
          onClick={() => onTestLogin("user")}
        >
          User Login
          <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
        <Button
          variant="outline"
          className="bg-transparent border-slate-600 hover:bg-slate-800 hover:text-white hover:border-white rounded-full px-6 py-2 font-medium transition-all duration-200 group"
          onClick={() => onTestLogin("admin")}
        >
          Admin Login
          <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
      </div>

      <p className="text-sm text-center mt-3">
        Don&apos;t have any account?{" "}
        <button
          type="button"
          onClick={toggle}
          className=" text-slate-800 underline cursor-pointer font-semibold"
        >
          Register
        </button>
      </p>
    </div>
  );
};

export default LoginForm;
