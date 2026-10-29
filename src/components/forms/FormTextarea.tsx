"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";

type TFormTextareaProps = {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  rows?: number;
  maxWords?: number;
  maxLength?: number;
  optionalLabel?: string;
  showWordCount?: boolean;
};

const FormTextarea = ({
  name,
  label,
  placeholder,
  required = false,
  disabled = false,
  className,
  rows = 4,
  maxWords,
  maxLength,
  optionalLabel = "Optional",
  showWordCount = true,
}: TFormTextareaProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const value = String(field.value ?? "");
        const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

        const isWordLimitExceeded =
          maxWords !== undefined && wordCount > maxWords;

        const isCharacterLimitExceeded =
          maxLength !== undefined && value.length > maxLength;

        const hasLimitError = isWordLimitExceeded || isCharacterLimitExceeded;

        return (
          <div className="w-full space-y-2">
            {(label || !required) && (
              <div className="flex items-center justify-between gap-3">
                {label ? (
                  <Label
                    htmlFor={name}
                    className={cn(
                      "text-sm font-medium",
                      (error || hasLimitError) && "text-destructive",
                    )}
                  >
                    {label}
                    {required && (
                      <span className="ml-1 text-destructive">*</span>
                    )}
                  </Label>
                ) : (
                  <span />
                )}

                {!required && (
                  <span className="text-xs text-muted-foreground">
                    {optionalLabel}
                  </span>
                )}
              </div>
            )}

            <Textarea
              {...field}
              value={value}
              id={name}
              rows={rows}
              required={required}
              disabled={disabled}
              maxLength={maxLength}
              placeholder={
                placeholder ||
                (label ? `Enter ${label.toLowerCase()}...` : "Enter text...")
              }
              aria-invalid={!!error || hasLimitError}
              className={cn(
                "w-full resize-y bg-secondary shadow-none",
                "focus-visible:border-teal-500 focus-visible:ring-2 focus-visible:ring-teal-100",
                (error || hasLimitError) &&
                  "border-destructive focus-visible:ring-destructive",
                disabled && "cursor-not-allowed opacity-60",
                className,
              )}
            />

            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                {error?.message ? (
                  <p className="text-xs text-destructive">
                    {String(error.message)}
                  </p>
                ) : hasLimitError ? (
                  <p className="text-xs text-destructive">
                    {isWordLimitExceeded
                      ? `Maximum ${maxWords} words allowed.`
                      : `Maximum ${maxLength} characters allowed.`}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    {required
                      ? "This field is required."
                      : "You can leave this field empty."}
                  </p>
                )}
              </div>

              {showWordCount && (
                <div className="flex shrink-0 items-center gap-2 text-xs tabular-nums text-muted-foreground">
                  <span
                    className={cn(
                      maxWords !== undefined &&
                        wordCount > maxWords &&
                        "font-medium text-destructive",
                    )}
                  >
                    {wordCount}
                    {maxWords !== undefined ? `/${maxWords}` : ""} words
                  </span>

                  {maxLength !== undefined && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span
                        className={cn(
                          value.length >= maxLength && "text-destructive",
                        )}
                      >
                        {value.length}/{maxLength} characters
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      }}
    />
  );
};

export default FormTextarea;
