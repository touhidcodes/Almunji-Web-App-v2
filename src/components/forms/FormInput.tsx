import { TLoginFormData, TRegisterFormData } from "@/types/auth";
import { FormInput, Loader2 } from "lucide-react";
import { useState } from "react";
import FormContainer from "./FormContainer";

interface AuthPageContentProps {
  onToggle: () => void;
}

// Login Component
function LoginPageContent({ onToggle }: AuthPageContentProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleLogin = async (data: TLoginFormData) => {
    try {
      setLoading(true);
      setError("");

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Login successful:", data);
      alert("Login successful! Welcome back.");
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm space-y-5">
      <div className="text-left">
        <h2 className="text-2xl font-semibold text-gray-800">
          Welcome Back to Almunji!
          <br />
          <span className="text-xl">Your Living Solutions</span>
        </h2>
        <p className="text-sm text-gray-500 mt-2">Sign in to your account</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded text-sm">
          {error}
        </div>
      )}

      <FormContainer<TLoginFormData>
        onSubmit={handleLogin}
        defaultValues={{
          identifier: "",
          password: "",
          remember: false,
        }}
      >
        <FormInput
          name="identifier"
          label="Your Email or Username"
          type="text"
          required
        />

        <FormInput name="password" label="Password" type="password" required />

        <div className="flex items-center justify-between mt-3 mb-2 space-x-6">
          <div className="flex items-center text-xs text-gray-500">
            <input type="checkbox" name="remember" className="mr-2" />
            <p>Remember Me</p>
          </div>
          <button
            type="button"
            className="text-xs text-slate-800 underline cursor-pointer font-semibold"
          >
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-slate-800 text-white hover:bg-slate-700 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
          ) : (
            "Login"
          )}
        </button>
      </FormContainer>

      <p className="text-sm text-center mt-3">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onToggle}
          className="text-slate-800 underline cursor-pointer font-semibold"
        >
          Register
        </button>
      </p>
    </div>
  );
}

// Register Component
function RegisterPageContent({ onToggle }: AuthPageContentProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const handleRegister = async (data: TRegisterFormData) => {
    try {
      setLoading(true);
      setError("");
      setSuccess(false);

      // Validation
      if (data.password !== data.confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }

      if (!data.agreeTerms) {
        setError("Please agree to the Terms & Conditions");
        setLoading(false);
        return;
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Registration successful:", data);
      setSuccess(true);

      // Auto-switch to login after 2 seconds
      setTimeout(() => {
        onToggle();
      }, 2000);
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm space-y-5">
      <div className="text-left">
        <h2 className="text-2xl font-semibold text-gray-800">
          Join Almunji Today!
          <br />
          <span className="text-xl">Your Living Solutions</span>
        </h2>
        <p className="text-sm text-gray-500 mt-2">Create your account</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-3 py-2 rounded text-sm">
          Registration successful! Redirecting to login...
        </div>
      )}

      <FormContainer<TRegisterFormData>
        onSubmit={handleRegister}
        defaultValues={{
          name: "",
          email: "",
          username: "",
          password: "",
          confirmPassword: "",
          agreeTerms: false,
        }}
      >
        <FormInput name="name" label="Full Name" type="text" required />

        <FormInput name="email" label="Email Address" type="email" required />

        <FormInput name="username" label="Username" type="text" required />

        <FormInput name="password" label="Password" type="password" required />

        <FormInput
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          required
        />

        <div className="flex items-center mt-3 mb-2 text-xs text-gray-500">
          <input type="checkbox" name="agreeTerms" className="mr-2" />
          <p>I agree to the Terms & Conditions</p>
        </div>

        <button
          type="submit"
          className="w-full bg-slate-800 text-white hover:bg-slate-700 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || success}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
          ) : (
            "Register"
          )}
        </button>
      </FormContainer>

      <p className="text-sm text-center mt-3">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onToggle}
          className="text-slate-800 underline cursor-pointer font-semibold"
        >
          Login
        </button>
      </p>
    </div>
  );
}

// Main Auth Page
export default function AuthPage() {
  const [isLogin, setIsLogin] = useState<boolean>(true);

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        {isLogin ? (
          <LoginPageContent onToggle={toggleAuthMode} />
        ) : (
          <RegisterPageContent onToggle={toggleAuthMode} />
        )}
      </div>
    </div>
  );
}
