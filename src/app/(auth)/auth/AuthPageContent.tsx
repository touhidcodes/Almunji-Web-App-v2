"use client";

import LoginForm from "@/components/pages/Auth/LoginForm";
import RegisterForm from "@/components/pages/Auth/RegisterForm";
import { userLogin } from "@/services/actions/userLogin";
import { userRegister } from "@/services/actions/userRegister";
import getErrorMessage from "@/utils/getErrorMessage";
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

      if (res?.authenticated) {
        toast.success(res.message);
        router.push("/");
      } else {
        setError(getErrorMessage(res, "Login failed"));
      }
    } catch (err) {
      setError(getErrorMessage(err, "Login failed"));
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
        setError(getErrorMessage(res, "Registration failed"));
      }
    } catch (err) {
      setError(getErrorMessage(err, "Registration failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <div className="w-full max-w-md">
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
