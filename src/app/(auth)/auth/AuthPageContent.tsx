"use client";

import LoginForm from "@/components/pages/Auth/LoginForm";
import RegisterForm from "@/components/pages/Auth/RegisterForm";
import { userLogin } from "@/services/actions/userLogin";
import { userRegister } from "@/services/actions/userRegister";
import { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";

const AuthPageContent = () => {
  const searchParams = useSearchParams();
  const formType = searchParams.get("type");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(formType !== "register");
  const router = useRouter();

  useEffect(() => {
    setIsLogin(formType !== "register");
    setError("");
  }, [formType]);

  const toggleForm = () => {
    const newType = isLogin ? "register" : "login";
    router.replace(`/auth?type=${newType}`);
  };

  const handleLogin = async (values: FieldValues) => {
    try {
      setLoading(true);
      setError("");
      const res = await userLogin(values);

      if (res?.data?.token) {
        toast.success(res?.message);
        router.push("/");
      } else {
        setError(res.message);
      }
    } catch {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data: FieldValues) => {
    try {
      setLoading(true);
      setError("");
      const res = await userRegister(data);

      if (res?.data?.id) {
        toast.success(res.message);
        router.push("/");
      } else if (res?.success === false) {
        setError(res?.message || "Registration failed!");
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        const errorMessage =
          err.response?.data?.message || "Registration failed";
        setError(errorMessage);
      } else {
        setError("Unexpected error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen grid grid-cols-1 lg:grid-cols-2 overflow-x-hidden">
      <div className="flex justify-center items-center bg-white px-6 sm:px-10 overflow-y-auto">
        {isLogin ? (
          <LoginForm
            onSubmit={handleLogin}
            error={error}
            toggle={toggleForm}
            loading={loading}
          />
        ) : (
          <RegisterForm
            onSubmit={handleRegister}
            error={error}
            toggle={toggleForm}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
};

export default AuthPageContent;
