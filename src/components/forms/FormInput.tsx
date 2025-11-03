import { Controller, useFormContext } from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";

type TFormInputProps = {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
};

const FormInput = ({
  name,
  label,
  type = "text",
  placeholder,
  required,
  className,
}: TFormInputProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="w-full space-y-2">
          {label && (
            <Label htmlFor={name} className={cn(error && "text-destructive")}>
              {label}
              {required && <span className="text-destructive">{` `}*</span>}
            </Label>
          )}

          <Input
            {...field}
            id={name}
            type={type}
            placeholder={placeholder || label}
            className={cn(
              className || "w-full bg-secondary shadow-none",
              error && "border-destructive focus-visible:ring-destructive"
            )}
          />

          {error?.message && (
            <p className="text-[0.8rem] text-destructive">{error.message}</p>
          )}
        </div>
      )}
    />
  );
};

export default FormInput;
