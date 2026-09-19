"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { X, Plus } from "lucide-react";

interface FormTagsProps {
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
}

const FormTags = ({
  name,
  label = "Tags",
  placeholder = "Type a tag and press Enter...",
  description,
}: FormTagsProps) => {
  const { watch, setValue } = useFormContext();
  const [inputValue, setInputValue] = useState("");

  const tags: string[] = watch(name) || [];

  const addTag = () => {
    const tag = inputValue.trim();
    if (!tag) return;
    if (tags.some((existingTag) => existingTag.toLowerCase() === tag.toLowerCase())) {
      setInputValue("");
      return;
    }
    setValue(name, [...tags, tag], {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setInputValue("");
  };

  const removeTag = (tagToRemove: string) => {
    setValue(
      name,
      tags.filter((tag) => tag !== tagToRemove),
      { shouldDirty: true, shouldTouch: true, shouldValidate: true }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
    if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}

      <div
        className="min-h-12 w-full rounded-xl border border-gray-200 bg-secondary px-3 py-2 shadow-none 
        focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100 focus-within:bg-white
        transition-all"
      >
        <div className="flex flex-wrap items-center gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 rounded-lg bg-teal-50 px-3 py-1.5 text-sm font-medium text-teal-700 border border-teal-100"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="rounded-full p-0.5 text-teal-500 hover:bg-teal-100 hover:text-teal-800 transition-colors"
                aria-label={`Remove ${tag}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={addTag}
            placeholder={tags.length === 0 ? placeholder : "Add another tag..."}
            className="min-w-[180px] flex-1 border-none bg-transparent py-1 text-sm text-gray-900 outline-none placeholder:text-gray-400"
          />

          {inputValue.trim() && (
            <button
              type="button"
              onClick={addTag}
              className="flex items-center gap-1 rounded-lg bg-teal-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-teal-700 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Add
            </button>
          )}
        </div>
      </div>

      {description && (
        <p className="text-xs text-gray-400">{description}</p>
      )}
    </div>
  );
};

export default FormTags;
