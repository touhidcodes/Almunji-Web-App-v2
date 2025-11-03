"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { CirclePlus, XIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type TFormTagsInputProps = {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
};

const FormTagsInput = ({
  name,
  label,
  placeholder,
  required,
  className,
}: TFormTagsInputProps) => {
  const { setValue, control } = useFormContext();
  const value: string[] = useWatch({ name, control }) || [];

  const [input, setInput] = useState("");

  const handleAdd = () => {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) {
      setValue(name, [...value, trimmed]);
      setInput("");
    }
  };

  const handleRemove = (index: number) => {
    const updated = [...value];
    updated.splice(index, 1);
    setValue(name, updated);
  };

  return (
    <div className="w-full space-y-2">
      {label && (
        <Label htmlFor={name}>
          {label}
          {required && <span className="text-destructive">{` `}*</span>}
        </Label>
      )}

      <div className="flex items-center gap-2">
        <Input
          id={name}
          placeholder={placeholder}
          value={input}
          className={cn(className, "w-full bg-secondary shadow-none")}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
        />
        <Button
          onClick={handleAdd}
          type="button"
          className="bg-white hover:bg-secondary transition-colors p-2 rounded shadow-none"
        >
          <CirclePlus className="w-7 h-7 text-black hover:text-white transition-colors" />
        </Button>
      </div>

      {value?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {value.map((item, idx) => (
            <div
              key={`${item}-${idx}`}
              className="px-3 py-1 bg-secondary rounded-full flex items-center gap-2 text-sm"
            >
              <span>{item}</span>
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="text-destructive"
              >
                <XIcon size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormTagsInput;
