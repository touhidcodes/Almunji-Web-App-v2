import { Controller, useFormContext } from "react-hook-form";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/lib/utils";

type TSelectOption = {
  label: string;
  value: string | boolean;
};

type TFormSelectProps = {
  name: string;
  label?: string;
  options: TSelectOption[];
  placeholder?: string;
  required?: boolean;
  className?: string;
};

const FormSelect = ({
  name,
  label,
  options,
  placeholder,
  required,
  className,
}: TFormSelectProps) => {
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

          <Select
            value={field.value ? String(field.value) : undefined}
            onValueChange={(val) => {
              const parsedValue =
                val === "true" ? true : val === "false" ? false : val;
              field.onChange(parsedValue);
            }}
          >
            <SelectTrigger
              className={cn(
                className || "w-full bg-secondary shadow-none",
                error && "border-destructive focus-visible:ring-destructive"
              )}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={String(opt.value)} value={String(opt.value)}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {error?.message && (
            <p className="text-[0.8rem] text-destructive">{error.message}</p>
          )}
        </div>
      )}
    />
  );
};

export default FormSelect;
