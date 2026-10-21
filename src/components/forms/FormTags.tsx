"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Plus, X } from "lucide-react";

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

  const rawTags = watch(name);

  const tags: string[] = Array.isArray(rawTags)
    ? rawTags
    : typeof rawTags === "string"
      ? rawTags
          .split(",")
          .map((tag: string) => tag.trim())
          .filter(Boolean)
      : [];

  const saveTags = (nextTags: string[]) => {
    setValue(name, nextTags.join(", "), {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const addTag = () => {
    const tag = inputValue.trim().replace(/,+$/, "").trim();

    if (!tag) return;

    if (
      tags.some(
        (existingTag) => existingTag.toLowerCase() === tag.toLowerCase(),
      )
    ) {
      setInputValue("");
      return;
    }

    saveTags([...tags, tag]);
    setInputValue("");
  };

  const removeTag = (tagToRemove: string) => {
    saveTags(tags.filter((tag) => tag !== tagToRemove));
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
        <label className="text-sm font-semibold text-gray-700">{label}</label>
      )}

      <div className="min-h-12 w-full rounded-xl border border-gray-200 bg-secondary px-3 py-2 shadow-none transition-all focus-within:border-teal-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-teal-100">
        <div className="flex flex-wrap items-center gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 rounded-lg border border-teal-100 bg-teal-50 px-3 py-1.5 text-sm font-medium text-teal-700"
            >
              {tag}

              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="rounded-full p-0.5 text-teal-500 transition-colors hover:bg-teal-100 hover:text-teal-800"
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
              className="flex items-center gap-1 rounded-lg bg-teal-600 px-2.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-teal-700"
            >
              <Plus className="h-3.5 w-3.5" />
              Add
            </button>
          )}
        </div>
      </div>

      {description && <p className="text-xs text-gray-400">{description}</p>}
    </div>
  );
};

export default FormTags;
