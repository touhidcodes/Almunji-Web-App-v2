"use client";

import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";
import { Button } from "@/components/ui/button";
import { loginValidationSchema } from "@/schema/authSchema";
import { userLogin } from "@/services/actions/userLogin";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";

export default function LoginPageContent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (values: FieldValues) => {
    try {
      setLoading(true);
      setError("");
      const res: any = await userLogin(values);

      if (res?.data?.token) {
        toast.success(res?.message);
        router.push("/");
      } else {
        setError(res.message || "Login failed");
      }
    } catch (err) {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleTestLogin = async (role: "admin" | "user") => {
    const credentials =
      role === "admin"
        ? {
            identifier:
              process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@example.com",
            password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123",
          }
        : {
            identifier:
              process.env.NEXT_PUBLIC_USER_EMAIL || "user@example.com",
            password: process.env.NEXT_PUBLIC_USER_PASSWORD || "user123",
          };

    await handleLogin(credentials);
  };

  const handleToggle = () => {
    router.push("/auth/register");
  };

  return (
    <div className="w-full max-w-sm space-y-5">
      <div className="text-left">
        <h2 className="text-2xl font-semibold text-gray-800">
          Welcome Back to Almunji!
          <br />
          <span>Your Living Solutions</span>
        </h2>
        <p className="text-sm text-gray-500 mt-2">Sign in to your account</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded text-sm">
          {error}
        </div>
      )}

      <FormContainer
        onSubmit={handleLogin}
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

      <div className="flex justify-between gap-2">
        <Button
          variant="outline"
          className="bg-transparent border-slate-600 hover:bg-slate-800 hover:text-white hover:border-white rounded-full px-6 py-2 font-medium transition-all duration-200 group"
          onClick={() => handleTestLogin("user")}
          disabled={loading}
        >
          User Login
          <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
        <Button
          variant="outline"
          className="bg-transparent border-slate-600 hover:bg-slate-800 hover:text-white hover:border-white rounded-full px-6 py-2 font-medium transition-all duration-200 group"
          onClick={() => handleTestLogin("admin")}
          disabled={loading}
        >
          Admin Login
          <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
      </div>

      <p className="text-sm text-center mt-3">
        Don&apos;t have any account?{" "}
        <button
          type="button"
          onClick={handleToggle}
          className="text-slate-800 underline cursor-pointer font-semibold"
        >
          Register
        </button>
      </p>
    </div>
  );
}
