"use client";

import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";
import { Button } from "@/components/ui/button";
import { registerValidationSchema } from "@/schema/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { FieldValues } from "react-hook-form";
import { z } from "zod";

interface RegisterFormProps {
  onSubmit: (values: FieldValues) => void;
  schema: z.ZodSchema;
  error?: string;
  toggle: () => void;
  onTestRegister: (type: "user" | "admin") => void;
  loading: boolean;
}

const RegisterForm = ({
  onSubmit,
  schema,
  error,
  toggle,
  onTestRegister,
  loading,
}: RegisterFormProps) => {
  return (
    <div className="w-full max-w-sm space-y-5">
      <div className="text-left">
        <h2 className="text-2xl font-semibold text-gray-800">
          Welcome to ApartSol!
          <br />
          <span>Create your account</span>
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          Register to enjoy all features of ApartSol
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

      <div className="flex justify-between">
        <Button
          variant="outline"
          className="bg-transparent border-slate-600 hover:bg-slate-800 hover:text-white hover:border-white rounded-full px-6 py-2 font-medium transition-all duration-200 group"
          onClick={() => onTestRegister("user")}
        >
          User Demo
          <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
        <Button
          variant="outline"
          className="bg-transparent border-slate-600 hover:bg-slate-800 hover:text-white hover:border-white rounded-full px-6 py-2 font-medium transition-all duration-200 group"
          onClick={() => onTestRegister("admin")}
        >
          Admin Demo
          <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
      </div>

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
