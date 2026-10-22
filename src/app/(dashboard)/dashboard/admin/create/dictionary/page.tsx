"use client";

import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";
import FormTextarea from "@/components/forms/FormTextarea";
import { useCreateWordMutation } from "@/redux/api/dictionaryApi";
import {
  CreateDictionarySchema,
  type TDictionaryFormValues,
} from "@/schema/dictionarySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  BookA,
  Check,
  Languages,
  LoaderCircle,
  Save,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const MANAGEMENT_URL = "/dashboard/admin/manage/dictionary";

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

const defaultValues: TDictionaryFormValues = {
  persianWord: "",
  transliteration: "",
  banglaMeaning: "",
  englishMeaning: "",
  exampleFA: "",
  exampleEN: "",
  exampleBN: "",
};

const CreateDictionaryPage = () => {
  const router = useRouter();

  const [createDictionaryWord, { isLoading: isSubmitting }] =
    useCreateWordMutation();

  const onSubmit = async (data: TDictionaryFormValues): Promise<void> => {
    try {
      const payload: TDictionaryFormValues = {
        persianWord: data.persianWord.trim(),
        transliteration: data.transliteration?.trim() || undefined,
        banglaMeaning: data.banglaMeaning.trim(),
        englishMeaning: data.englishMeaning?.trim() || undefined,
        exampleFA: data.exampleFA?.trim() || undefined,
        exampleEN: data.exampleEN?.trim() || undefined,
        exampleBN: data.exampleBN?.trim() || undefined,
      };

      const response = await createDictionaryWord(payload).unwrap();

      if (!response.success) {
        toast.error("Unable to create dictionary word", {
          description: "The server did not confirm the creation.",
        });
        return;
      }

      toast.success("Dictionary word created successfully!");
      router.push(MANAGEMENT_URL);
      router.refresh();
    } catch (error: unknown) {
      toast.error("Failed to create dictionary word", {
        description: getErrorMessage(
          error,
          "Something went wrong while saving the dictionary word.",
        ),
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-poppins sm:p-6 lg:p-12">
      <div className="mx-auto max-w-6xl space-y-8 sm:space-y-12">
        {/* Navigation */}
        <nav className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <Link
            href={MANAGEMENT_URL}
            className="group flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-500 transition hover:text-teal-600"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Dictionary
          </Link>

          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
            <Sparkles className="h-3 w-3 text-teal-500" />
            New Dictionary Entry
          </div>
        </nav>

        {/* Header */}
        <header>
          <div className="flex items-center gap-4">
            <div className="shrink-0 rounded-2xl bg-teal-600 p-3 shadow-xl shadow-teal-100 sm:p-4">
              <BookA className="h-7 w-7 text-white sm:h-8 sm:w-8" />
            </div>

            <div>
              <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
                Create Dictionary Word
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Add a Persian word with its transliteration, meanings, and
                multilingual examples.
              </p>
            </div>
          </div>
        </header>

        {/* Form Card */}
        <section className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl shadow-gray-200/50">
          <div className="pointer-events-none absolute right-0 top-0 p-8 opacity-[0.04] sm:p-16">
            <Languages className="h-40 w-40 text-teal-900 sm:h-64 sm:w-64" />
          </div>

          <div className="relative p-5 sm:p-8 lg:p-12">
            <FormContainer
              onSubmit={onSubmit}
              resolver={zodResolver(CreateDictionarySchema)}
              defaultValues={defaultValues}
            >
              <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
                {/* Sidebar */}
                <aside className="space-y-8 lg:col-span-4 lg:space-y-10">
                  <section className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="h-1 w-10 rounded-full bg-teal-600" />
                      <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 sm:text-sm">
                        Word Metadata
                      </h2>
                    </div>

                    <div className="space-y-6">
                      <FormInput
                        name="persianWord"
                        label="Persian Word *"
                        placeholder="Enter the Persian word"
                        required
                      />

                      <FormInput
                        name="transliteration"
                        label="Transliteration"
                        placeholder="Enter pronunciation"
                      />

                      <FormInput
                        name="englishMeaning"
                        label="English Meaning"
                        placeholder="Enter the English meaning"
                      />
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
                        "Enter the correct Persian spelling.",
                        "Add transliteration when available.",
                        "Provide a clear Bangla meaning.",
                        "Keep example sentences consistent across languages.",
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

                {/* Main Content */}
                <main className="min-w-0 space-y-8 lg:col-span-8 lg:space-y-10">
                  <section className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="h-1 w-10 rounded-full bg-teal-600" />
                      <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 sm:text-sm">
                        Meaning
                      </h2>
                    </div>

                    <FormTextarea
                      name="banglaMeaning"
                      label="Bangla Meaning *"
                      rows={4}
                      placeholder="বাংলা অর্থ লিখুন..."
                      required
                    />
                  </section>

                  <section className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="h-1 w-10 rounded-full bg-teal-600" />
                      <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 sm:text-sm">
                        Usage Examples
                      </h2>
                    </div>

                    <div className="space-y-6">
                      <FormTextarea
                        name="exampleFA"
                        label="Persian Example"
                        rows={3}
                        placeholder="Enter an example sentence in Persian..."
                      />

                      <FormTextarea
                        name="exampleEN"
                        label="English Example"
                        rows={3}
                        placeholder="Enter the English example..."
                      />

                      <FormTextarea
                        name="exampleBN"
                        label="Bangla Example"
                        rows={3}
                        placeholder="উদাহরণ বাক্য লিখুন..."
                      />
                    </div>
                  </section>

                  {/* Actions */}
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
                            Creating Word...
                          </>
                        ) : (
                          <>
                            <Save className="h-5 w-5" />
                            Create Word
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

        {/* Footer */}
        <footer className="pb-8 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 sm:text-xs">
            Almunji Global Archival System · Dictionary Services
          </p>
        </footer>
      </div>
    </div>
  );
};

export default CreateDictionaryPage;
