"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type TFormInputProps = {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

const FormInput = ({
  name,
  label,
  type = "text",
  placeholder,
  required,
  disabled = false,
  className,
}: TFormInputProps) => {
  const { control } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="w-full space-y-2">
          {label && (
            <Label htmlFor={name} className={cn(error && "text-destructive")}>
              {label}
              {required && <span className="text-destructive"> *</span>}
            </Label>
          )}

          <div className="relative">
            <Input
              {...field}
              id={name}
              type={inputType}
              required={required}
              disabled={disabled}
              placeholder={placeholder || label}
              className={cn(
                "focus-visible:border-teal-500 focus-visible:ring-2 focus-visible:ring-teal-100",
                isPassword && "pr-11",
                className || "w-full bg-secondary shadow-none",
                error && "border-destructive focus-visible:ring-destructive",
                disabled && "cursor-not-allowed opacity-60",
              )}
            />

            {isPassword && (
              <button
                type="button"
                disabled={disabled}
                onClick={() => setShowPassword((previous) => !previous)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-md text-muted-foreground transition-colors hover:text-teal-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-500"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            )}
          </div>

          {error?.message && (
            <p className="text-[0.8rem] text-destructive">
              {String(error.message)}
            </p>
          )}
        </div>
      )}
    />
  );
};

export default FormInput;
