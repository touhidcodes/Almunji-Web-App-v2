"use client";

import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";
import { Button } from "@/components/ui/button";
import { loginValidationSchema } from "@/schema/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
    <div className="w-full max-w-sm space-y-5 mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          Welcome Back to Almunji!
        </h2>
        <p className="text-sm text-gray-500 mt-2">Sign in to your account</p>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <FormContainer
        onSubmit={onSubmit}
        resolver={zodResolver(loginValidationSchema)}
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
