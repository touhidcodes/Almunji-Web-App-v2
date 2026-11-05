"use client";

import { cn } from "@/lib/utils";
import {
  Controller,
  useFormContext,
  type FieldValues,
  type Path,
} from "react-hook-form";

import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

type TFormCheckboxProps<TFieldValues extends FieldValues = FieldValues> = {
  name: Path<TFieldValues>;
  label: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

function FormCheckbox<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  description,
  required = false,
  disabled = false,
  className,
}: TFormCheckboxProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div
          className={cn(
            "rounded-xl border border-gray-200 bg-white p-4 transition-all",
            !disabled && "hover:border-teal-300 hover:bg-teal-50/30",
            error && "border-destructive",
            disabled && "cursor-not-allowed opacity-60",
            className,
          )}
        >
          <div className="flex items-start gap-3">
            <Checkbox
              id={name}
              checked={Boolean(field.value)}
              onCheckedChange={(checked) => {
                field.onChange(checked === true);
              }}
              onBlur={field.onBlur}
              disabled={disabled}
              aria-invalid={Boolean(error)}
              className="mt-0.5"
            />

            <div className="min-w-0 flex-1 space-y-1">
              <Label
                htmlFor={name}
                className={cn(
                  "cursor-pointer text-sm font-semibold text-gray-800",
                  disabled && "cursor-not-allowed",
                  error && "text-destructive",
                )}
              >
                {label}

                {required && <span className="ml-1 text-destructive">*</span>}
              </Label>

              {description && (
                <p className="text-xs leading-5 text-gray-500">{description}</p>
              )}

              {error?.message && (
                <p className="text-xs text-destructive">
                  {String(error.message)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    />
  );
}

export default FormCheckbox;
