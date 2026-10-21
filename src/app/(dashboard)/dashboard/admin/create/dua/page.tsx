"use client";

import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";
import FormTextarea from "@/components/forms/FormTextarea";
import { useCreateDuaMutation } from "@/redux/api/duaApi";
import { CreateDuaSchema, type TDuaFormValues } from "@/schema/duaSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Book,
  Check,
  LoaderCircle,
  Plus,
  Save,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type KeyboardEvent } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { toast } from "sonner";

const MANAGEMENT_URL = "/dashboard/admin/manage/dua";

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = error.data;

    if (
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
    ) {
      return data.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

function DuaTagsInput() {
  const { control, setValue, getValues } = useFormContext<TDuaFormValues>();

  const tags = useWatch({ control, name: "tags" }) ?? [];
  const [input, setInput] = useState("");

  const addTag = () => {
    const normalizedTag = input.trim().replace(/,+$/, "").trim();

    if (!normalizedTag) return;

    const currentTags = getValues("tags") ?? [];

    if (
      currentTags.some(
        (tag) => tag.toLowerCase() === normalizedTag.toLowerCase(),
      )
    ) {
      toast.info("This tag has already been added.");
      return;
    }

    setValue("tags", [...currentTags, normalizedTag], {
      shouldDirty: true,
      shouldValidate: true,
    });

    setInput("");
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = getValues("tags") ?? [];

    setValue(
      "tags",
      currentTags.filter((tag) => tag !== tagToRemove),
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTag();
    }
  };

  return (
    <div className="space-y-3">
      <label
        htmlFor="dua-tags-input"
        className="block text-sm font-semibold text-gray-700"
      >
        Tags
      </label>

      <div className="flex gap-2">
        <input
          id="dua-tags-input"
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a tag and press Enter"
          className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        />

        <button
          type="button"
          onClick={addTag}
          disabled={!input.trim()}
          aria-label="Add tag"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>

      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-3 py-1.5 text-sm font-medium text-teal-800"
            >
              {tag}

              <button
                type="button"
                onClick={() => removeTag(tag)}
                aria-label={`Remove ${tag}`}
                className="rounded-full p-0.5 transition hover:bg-teal-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-400">
          No tags added yet. Tags help categorize and find Duas.
        </p>
      )}
    </div>
  );
}

const defaultValues: TDuaFormValues = {
  name: "",
  arabic: "",
  transliteration: "",
  bangla: "",
  english: "",
  reference: "",
  tags: [],
};

const CreateDuaPage = () => {
  const router = useRouter();
  const [createDua, { isLoading: isSubmitting }] = useCreateDuaMutation();

  const onSubmit = async (data: TDuaFormValues): Promise<void> => {
    try {
      const payload: TDuaFormValues = {
        ...data,
        name: data.name.trim(),
        arabic: data.arabic.trim(),
        bangla: data.bangla.trim(),
        transliteration: data.transliteration?.trim() || undefined,
        english: data.english?.trim() || undefined,
        reference: data.reference?.trim() || undefined,
        tags: data.tags?.length ? data.tags : undefined,
      };

      const response = await createDua(payload).unwrap();

      if (!response.success) {
        toast.error("Unable to create Dua", {
          description: "The server did not confirm the creation.",
        });
        return;
      }

      toast.success("Dua created successfully!");
      router.push(MANAGEMENT_URL);
      router.refresh();
    } catch (error: unknown) {
      toast.error("Failed to create Dua", {
        description: getErrorMessage(
          error,
          "Something went wrong while saving the supplication.",
        ),
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-poppins sm:p-6 lg:p-12">
      <div className="mx-auto max-w-6xl space-y-8 sm:space-y-12">
        <nav className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <Link
            href={MANAGEMENT_URL}
            className="group flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-500 transition hover:text-teal-600"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Duas
          </Link>

          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
            <Sparkles className="h-3 w-3 text-teal-500" />
            New Supplication
          </div>
        </nav>

        <header>
          <div className="flex items-center gap-4">
            <div className="shrink-0 rounded-2xl bg-teal-600 p-3 shadow-xl shadow-teal-100 sm:p-4">
              <Book className="h-7 w-7 text-white sm:h-8 sm:w-8" />
            </div>

            <div>
              <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
                Create Dua
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Record a supplication with its translations and reference.
              </p>
            </div>
          </div>
        </header>

        <section className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl shadow-gray-200/50">
          <div className="pointer-events-none absolute right-0 top-0 p-8 opacity-[0.04] sm:p-16">
            <Book className="h-40 w-40 text-teal-900 sm:h-64 sm:w-64" />
          </div>

          <div className="relative p-5 sm:p-8 lg:p-12">
            <FormContainer
              onSubmit={onSubmit}
              resolver={zodResolver(CreateDuaSchema)}
              defaultValues={defaultValues}
            >
              <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
                <aside className="space-y-8 lg:col-span-4 lg:space-y-10">
                  <section className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="h-1 w-10 rounded-full bg-teal-600" />
                      <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 sm:text-sm">
                        Metadata
                      </h2>
                    </div>

                    <div className="space-y-6">
                      <FormInput
                        name="name"
                        label="Dua Name *"
                        placeholder="Enter Dua name"
                        required
                      />

                      <FormInput
                        name="reference"
                        label="Reference"
                        placeholder="Book, chapter, or source"
                      />

                      <DuaTagsInput />
                    </div>
                  </section>

                  <section className="space-y-5 rounded-2xl border border-teal-100 bg-teal-50/60 p-5 sm:p-7">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-teal-600 p-2 text-white shadow-sm">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <h2 className="text-sm font-black uppercase tracking-widest text-gray-800">
                        Guidelines
                      </h2>
                    </div>

                    <ul className="space-y-4">
                      {[
                        "Provide a clear, descriptive name.",
                        "Verify the Arabic text carefully.",
                        "Add the Bangla translation.",
                        "Use reliable references when available.",
                      ].map((rule) => (
                        <li
                          key={rule}
                          className="flex items-start gap-3 text-xs font-semibold leading-5 text-gray-600"
                        >
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                </aside>

                <main className="min-w-0 space-y-8 lg:col-span-8 lg:space-y-10">
                  <section className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="h-1 w-10 rounded-full bg-teal-600" />
                      <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 sm:text-sm">
                        Arabic Text
                      </h2>
                    </div>

                    <FormTextarea
                      name="arabic"
                      label="Arabic Text *"
                      rows={5}
                      placeholder="Enter the original Arabic supplication..."
                      className="min-h-36 text-right text-xl leading-loose"
                      required
                    />
                  </section>

                  <section className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="h-1 w-10 rounded-full bg-teal-600" />
                      <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 sm:text-sm">
                        Translations
                      </h2>
                    </div>

                    <div className="space-y-6">
                      <FormTextarea
                        name="transliteration"
                        label="Transliteration"
                        rows={3}
                        placeholder="Enter the transliteration..."
                      />

                      <FormTextarea
                        name="bangla"
                        label="Bangla Translation *"
                        rows={4}
                        placeholder="বাংলা অনুবাদ লিখুন..."
                        required
                      />

                      <FormTextarea
                        name="english"
                        label="English Translation"
                        rows={4}
                        placeholder="Enter the English translation..."
                      />
                    </div>
                  </section>

                  <div className="border-t border-gray-100 pt-7 sm:pt-10">
                    <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row sm:items-center">
                      <Link
                        href={MANAGEMENT_URL}
                        className="inline-flex min-h-12 items-center justify-center rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                      >
                        Cancel
                      </Link>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-teal-600 px-8 py-4 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-teal-200 transition hover:bg-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                      >
                        {isSubmitting ? (
                          <>
                            <LoaderCircle className="h-5 w-5 animate-spin" />
                            Creating Dua...
                          </>
                        ) : (
                          <>
                            <Save className="h-5 w-5" />
                            Create Dua
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </main>
              </div>
            </FormContainer>
          </div>
        </section>

        <footer className="pb-8 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 sm:text-xs">
            Almunji Global Archival System · Supplication Services
          </p>
        </footer>
      </div>
    </div>
  );
};

export default CreateDuaPage;
