import { Controller, useFormContext } from "react-hook-form";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";

type TFormTextareaProps = {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  rows?: number;
};

const FormTextarea = ({
  name,
  label,
  placeholder,
  required,
  className,
  rows = 4,
}: TFormTextareaProps) => {
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

          <Textarea
            {...field}
            id={name}
            rows={rows}
            placeholder={placeholder || label}
            className={cn(
              "w-full bg-secondary shadow-none resize-y",
              error && "border-destructive focus-visible:ring-destructive",
              className
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

export default FormTextarea;
