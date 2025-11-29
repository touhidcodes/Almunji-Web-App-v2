"use client";

import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";
import { Button } from "@/components/ui/button";
import { registerValidationSchema } from "@/schema/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
    <div className="w-full max-w-sm space-y-5">
      <div className="text-left">
        <h2 className="text-2xl font-semibold text-gray-800">
          Welcome to Almunji!
          <br />
          <span>Create your account</span>
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          Explore more Surahs, Duas and Books
        </p>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <FormContainer
        onSubmit={onSubmit}
        resolver={zodResolver(registerValidationSchema)}
        defaultValues={{ username: "", email: "", password: "" }}
      >
        <div className="space-y-4">
          <FormInput name="username" label="Username" type="text" required />
          <FormInput name="email" label="Email Address" type="email" required />
          <FormInput
            name="password"
            label="Password"
            type="password"
            required
          />
        </div>

        <div className="flex items-center mt-3 mb-2 text-xs text-gray-500">
          <input type="checkbox" className="mr-2" />
          <p>
            I agree to the{" "}
            <Link href="#" className="text-slate-800 underline font-semibold">
              Terms & Privacy Policy
            </Link>
          </p>
        </div>

        <Button
          type="submit"
          className="w-full bg-slate-800 text-white hover:bg-slate-700"
          disabled={loading}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Register"}
        </Button>
      </FormContainer>

      <p className="text-sm text-center mt-3">
        Already have an account?{" "}
        <button
          type="button"
          onClick={toggle}
          className="text-slate-800 underline cursor-pointer font-semibold"
        >
          Login
        </button>
      </p>
    </div>
  );
};

export default RegisterForm;
