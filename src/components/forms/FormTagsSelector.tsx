"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

type TFormTagsSelectorProps = {
  name: string;
  tags: readonly string[] | string[];
  label?: string;
  required?: boolean;
  className?: string;
  onSelectionChange?: (selectedTags: string[]) => void;
};

const FormTagsSelector = ({
  name,
  tags,
  label,
  required,
  className,
  onSelectionChange,
}: TFormTagsSelectorProps) => {
  const { setValue, control } = useFormContext();
  const selectedTags: string[] = useWatch({ name, control }) || [];

  const handleAdd = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      const updatedTags = [...selectedTags, tag];
      setValue(name, updatedTags);
      onSelectionChange?.(updatedTags);
    }
  };

  const handleRemove = (tag: string) => {
    const updatedTags = selectedTags.filter((item) => item !== tag);
    setValue(name, updatedTags);
    onSelectionChange?.(updatedTags);
  };

  const isSelected = (tag: string) => selectedTags.includes(tag);

  return (
    <div className={cn("w-full space-y-4", className)}>
      {label && (
        <Label htmlFor={name}>
          {label}
          {required && <span className="text-destructive">{` `}*</span>}
        </Label>
      )}

      {/* Available Tags */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground">
          Available Tags (Click to add)
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {tags.map((tag) => (
            <Button
              key={tag}
              type="button"
              variant="outline"
              size="sm"
              disabled={isSelected(tag)}
              onClick={() => handleAdd(tag)}
              className={cn(
                "justify-start text-left h-auto py-2 px-3",
                isSelected(tag) && "opacity-50 cursor-not-allowed"
              )}
            >
              <Plus className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="text-xs">{tag}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">
            Selected Tags ({selectedTags.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <div
                key={tag}
                className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full flex items-center gap-2 text-sm"
              >
                <span className="text-primary font-medium">{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemove(tag)}
                  className="text-destructive hover:text-destructive/80 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {selectedTags.length > 0 && (
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setValue(name, []);
              onSelectionChange?.([]);
            }}
          >
            Clear All
          </Button>
          <span className="text-sm text-muted-foreground flex items-center">
            Total: {selectedTags.length} tags selected
          </span>
        </div>
      )}
    </div>
  );
};

export default FormTagsSelector;
