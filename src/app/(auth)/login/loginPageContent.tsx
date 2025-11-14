"use client";

import LoginForm from "@/components/Pages/Auth/LoginForm";
import RegisterForm from "@/components/Pages/Auth/RegisterForm";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import {
  loginValidationSchema,
  registerValidationSchema,
} from "@/schema/authSchema";
import { userLogin } from "@/services/actions/userLogin";
import { userRegister } from "@/services/actions/userRegister";
import { AxiosError } from "axios";
import Autoplay from "embla-carousel-autoplay";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";

const carouselImages = [
  {
    id: 1,
    image: "/assets/images/auth/auth1.jpg",
    heading: "Find Your Sweet Home",
    subtext: "Schedule visits in just a few clicks",
  },
  {
    id: 2,
    image: "/assets/images/auth/auth2.jpg",
    heading: "Live Better With Families",
    subtext: "Connect with people who match your lifestyle",
  },
  {
    id: 3,
    image: "/assets/images/auth/auth3.jpg",
    heading: "Safe & Verified Listings",
    subtext: "Find trusted homes in your city easily",
  },
];

const AuthPageContent = () => {
  const searchParams = useSearchParams();
  const formType = searchParams.get("type");
  const [loading, setLoading] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(formType !== "register");
  const router = useRouter();

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const toggleForm = () => {
    const newType = isLogin ? "register" : "login";
    router.replace(`/auth?type=${newType}`);
    setIsLogin(!isLogin);
    setError("");
  };

  const handleLogin = async (values: FieldValues) => {
    try {
      setLoading(true);
      const res = await userLogin(values);
      // console.log(res);
      if (res?.data?.token) {
        toast.success(res?.message);
        router.push("/");
        setLoading(false);
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
      const res = await userRegister(data);
      if (res?.data?.id) {
        toast.success(res.message);
        router.push("/");
        setLoading(false);
      }
      if (res?.success === false) {
        setError(res?.message || "Registration failed!");
        setLoading(false);
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        const errorMessage =
          err.response?.data?.message || "Registration failed";
        setError(errorMessage);
      } else {
        setError("Unexpected error");
      }
      setLoading(false);
    } finally {
      setLoading(true);
    }
  };

  const handleTestLogin = async (role: "admin" | "user") => {
    const credentials =
      role === "admin"
        ? {
            identifier: `${process.env.NEXT_PUBLIC_ADMIN_EMAIL}`,
            password: `${process.env.NEXT_PUBLIC_ADMIN_PASSWORD}`,
          }
        : {
            identifier: `${process.env.NEXT_PUBLIC_USER_EMAIL}`,
            password: `${process.env.NEXT_PUBLIC_USER_PASSWORD}`,
          };
    handleLogin(credentials);
  };

  return (
    <div className="w-screen h-screen grid grid-cols-1 lg:grid-cols-2 overflow-x-hidden">
      {/* Carousel Section - Hidden on mobile/tablet */}
      <div className="w-full h-full relative hidden lg:block">
        {/* Carousel */}
        <Carousel
          className="w-full h-full"
          plugins={[Autoplay({ delay: 5000, stopOnInteraction: false })]}
          opts={{ align: "start", loop: true }}
          setApi={setApi}
        >
          <CarouselContent className="h-full">
            {carouselImages.map((item) => (
              <CarouselItem
                key={item.id}
                className="relative w-full h-full shrink-0 grow-0 basis-full"
              >
                <Image
                  src={item.image}
                  alt={`Slide ${item.id}`}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-[#0D1B2A]/50 z-10" />
                <div className="relative w-full h-full min-h-screen">
                  {/* Logo and Back to Home Link */}
                  <div className="absolute top-10 left-10 z-40">
                    <Link href="/" className="text-2xl font-bold">
                      <div className="flex items-center gap-2">
                        <Image
                          src="/assets/images/logo/white.png"
                          alt="ApartSol Logo"
                          width={50}
                          height={50}
                          className="object-contain"
                          priority
                        />

                        <span className="flex flex-col leading-4 items-center">
                          <span className="text-white">APARTSOL</span>
                          <span className="text-xs text-gray-300 tracking-wide pt-1">
                            LIVING SOLUTIONS
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-white text-sm lg:text-base font-medium mt-2 hover:text-gray-300">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Home</span>
                      </div>
                    </Link>
                  </div>

                  <div className="absolute bottom-28 left-6 lg:left-10 text-white space-y-2 z-20">
                    <h2 className="text-3xl font-bold">{item.heading}</h2>
                    <p className="text-sm">{item.subtext}</p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  "transition-all duration-300 rounded-full bg-white/80",
                  current === index ? "w-8 h-1.5" : "w-3 h-1.5 opacity-50"
                )}
              />
            ))}
          </div>
        </Carousel>
      </div>

      {/* Form Section */}
      <div className="flex justify-center items-center bg-white px-6 sm:px-10 overflow-y-auto">
        {isLogin ? (
          <LoginForm
            onSubmit={handleLogin}
            schema={loginValidationSchema}
            error={error}
            toggle={toggleForm}
            onTestLogin={handleTestLogin}
            loading={loading}
          />
        ) : (
          <RegisterForm
            onSubmit={handleRegister}
            schema={registerValidationSchema}
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
