"use client";

import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { z } from "zod";
import {
  Book,
  ChevronDown,
  FileText,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import FormContainer from "@/components/forms/FormContainer";
import FormInput from "@/components/forms/FormInput";
import FormSelect from "@/components/forms/FormSelect";
import FormTextarea from "@/components/forms/FormTextarea";
import RichTextEditor from "@/components/forms/RichTextEditor";

import { useCreateBookMutation } from "@/redux/api/bookApi";
import { useCreateBookContentMutation } from "@/redux/api/bookApi";
import { useGetAllCategoriesAdminQuery } from "@/redux/api/categoryApi";

const MAX_CONTENT_LENGTH = 100000;

/* -------------------------------------------------------------------------- */
/*                                   Schema                                   */
/* -------------------------------------------------------------------------- */

const BookSectionSchema = z.object({
  section: z.string({
    required_error: "Section title is required",
  }),
  index: z
    .number({
      required_error: "Index number is required",
    })
    .int()
    .min(1, "Index must be a positive integer"),
  text: z
    .string({
      required_error: "Content text is required",
    })
    .min(1, "Content text is required")
    .max(
      MAX_CONTENT_LENGTH,
      `Content must be under ${MAX_CONTENT_LENGTH} characters`,
    ),
});

const BookSchema = z.object({
  name: z.string({
    required_error: "Book name is required",
  }),
  description: z.string().optional(),
  cover: z.string({
    required_error: "Cover is required",
  }),
  categoryId: z.string({
    required_error: "Category ID is required",
  }),
  isFeatured: z.boolean().default(true),
  contents: z
    .array(BookSectionSchema)
    .min(1, "At least one book section is required"),
});

type TBookFormValues = z.infer<typeof BookSchema>;

type TApiError = {
  data?: {
    message?: string;
  };
};

/* -------------------------------------------------------------------------- */
/*                              Section Header                                */
/* -------------------------------------------------------------------------- */

const SectionHeader = ({
  number,
  onRemove,
}: {
  number: number;
  onRemove: () => void;
}) => {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-sm font-bold text-teal-600">
          {number}
        </div>

        <div>
          <h3 className="text-sm font-bold text-gray-800">Section {number}</h3>

          <p className="text-xs text-gray-400">
            Add the content for this section
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
        title={`Remove section ${number}`}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                              Featured Toggle                               */
/* -------------------------------------------------------------------------- */

const FeaturedToggle = () => {
  const { register } = useFormContext<TBookFormValues>();

  return (
    <div className="flex items-center justify-between rounded-2xl border border-teal-100 bg-teal-50/50 p-5">
      <div>
        <p className="text-sm font-bold text-gray-800">Featured Book</p>

        <p className="mt-1 text-xs font-medium text-gray-500">
          Show this book in featured library sections.
        </p>
      </div>

      <label className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          defaultChecked
          {...register("isFeatured")}
        />

        <div className="h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-teal-600 peer-checked:after:translate-x-full peer-checked:after:border-white" />
      </label>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                              Category Select                               */
/* -------------------------------------------------------------------------- */

const CategorySelect = () => {
  const {
    data: categoryResponse,
    isLoading,
    isError,
  } = useGetAllCategoriesAdminQuery({});

  const categories = categoryResponse?.data ?? [];

  const options = [...categories]
    .filter((category) => !category.isDeleted)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((category) => ({
      label: category.name,
      value: category.id,
    }));

  return (
    <FormSelect
      name="categoryId"
      label="Book Category"
      placeholder={
        isLoading
          ? "Loading categories..."
          : isError
            ? "Failed to load categories"
            : "Select a category"
      }
      options={options}
      required
      disabled={isLoading || isError}
    />
  );
};

/* -------------------------------------------------------------------------- */
/*                              Book Content Item                             */
/* -------------------------------------------------------------------------- */

const BookContentItem = ({
  index,
  sectionNumber,
  onRemove,
}: {
  index: number;
  sectionNumber: number;
  onRemove: () => void;
}) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <SectionHeader number={sectionNumber} onRemove={onRemove} />

      <div className="space-y-6 p-6">
        <FormInput
          name={`contents.${index}.section`}
          label="Section Title"
          placeholder="e.g. Introduction, Chapter One, Conclusion"
          required
        />

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500">
            Section Content
          </label>

          <RichTextEditor
            name={`contents.${index}.text`}
            placeholder="Write the book content here..."
          />

          <p className="mt-2 text-xs text-gray-400">
            Use the editor toolbar to format headings, paragraphs, lists,
            quotes, links and other content.
          </p>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                              Book Contents                                 */
/* -------------------------------------------------------------------------- */

const BookContents = () => {
  const { control } = useFormContext<TBookFormValues>();

  const { fields, append, remove } = useFieldArray<TBookFormValues, "contents">(
    {
      control,
      name: "contents",
    },
  );

  const addSection = () => {
    append({
      section: "",
      index: fields.length + 1,
      text: "",
    });
  };

  return (
    <div className="space-y-6">
      {fields.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
            <FileText className="h-6 w-6 text-gray-400" />
          </div>

          <h3 className="mt-5 text-sm font-bold text-gray-700">
            No book sections yet
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm text-gray-400">
            Add your first section to start building the book content.
          </p>

          <button
            type="button"
            onClick={addSection}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-xs font-bold uppercase tracking-wide text-white shadow-sm transition-colors hover:bg-teal-700"
          >
            <Plus className="h-4 w-4" />
            Add First Section
          </button>
        </div>
      ) : (
        <>
          {fields.map((field, index) => (
            <BookContentItem
              key={field.id}
              index={index}
              sectionNumber={index + 1}
              onRemove={() => remove(index)}
            />
          ))}

          <button
            type="button"
            onClick={addSection}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 py-5 text-sm font-bold text-gray-500 transition-all hover:border-teal-300 hover:bg-teal-50 hover:text-teal-600"
          >
            <Plus className="h-5 w-5" />
            Add Another Section
          </button>
        </>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                              Main Page                                     */
/* -------------------------------------------------------------------------- */

const CreateBookPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createBook] = useCreateBookMutation();
  const [createBookContent] = useCreateBookContentMutation();

  const defaultValues: TBookFormValues = {
    name: "",
    description: "",
    cover: "",
    categoryId: "",
    isFeatured: true,
    contents: [],
  };

  const handleSubmit = async (data: TBookFormValues) => {
    setIsSubmitting(true);

    try {
      /* -------------------------------------------------------------------- */
      /* Step 1: Create the book                                             */
      /* -------------------------------------------------------------------- */

      const bookResponse = await createBook({
        name: data.name.trim(),
        description: data.description?.trim() || undefined,
        cover: data.cover.trim(),
        categoryId: data.categoryId,
        isFeatured: data.isFeatured,
      }).unwrap();

      if (!bookResponse.success || !bookResponse.data?.id) {
        throw new Error("Book creation failed.");
      }

      const bookId = bookResponse.data.id;

      /* -------------------------------------------------------------------- */
      /* Step 2: Create book contents section by section                     */
      /* -------------------------------------------------------------------- */

      for (const [index, content] of data.contents.entries()) {
        await createBookContent({
          bookId,
          section: content.section.trim(),
          index: index + 1,
          text: content.text,
        }).unwrap();
      }

      /* -------------------------------------------------------------------- */
      /* Step 3: Success                                                      */
      /* -------------------------------------------------------------------- */

      toast.success("Book created successfully!", {
        description: `${data.name} and all ${data.contents.length} sections have been added.`,
      });
    } catch (error: unknown) {
      const apiError = error as TApiError;

      toast.error(
        apiError.data?.message ||
          (error instanceof Error ? error.message : "Failed to create book."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* ---------------------------------------------------------------- */}
        {/* Page Header                                                      */}
        {/* ---------------------------------------------------------------- */}

        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-600">
              <Book className="h-4 w-4" />
              Library
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Create Book
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Create a new book and organize its content into sections.
            </p>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Form                                                              */}
        {/* ---------------------------------------------------------------- */}

        <FormContainer
          onSubmit={handleSubmit}
          defaultValues={defaultValues}
          resolver={async (values) => {
            const result = BookSchema.safeParse(values);

            if (result.success) {
              return {
                values: result.data,
                errors: {},
              };
            }

            const errors = result.error.issues.reduce<
              Record<string, { type: string; message: string }>
            >((accumulator, issue) => {
              const path = issue.path.join(".");

              if (!accumulator[path]) {
                accumulator[path] = {
                  type: "validation",
                  message: issue.message,
                };
              }

              return accumulator;
            }, {});

            return {
              values: {},
              errors,
            };
          }}
        >
          <div className="space-y-8">
            {/* ------------------------------------------------------------ */}
            {/* Book Information                                             */}
            {/* ------------------------------------------------------------ */}

            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50">
                    <Book className="h-5 w-5 text-teal-600" />
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-gray-800">
                      Book Information
                    </h2>

                    <p className="text-xs text-gray-400">
                      Add the basic information about the book.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 p-6">
                {/* Book name + category */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormInput
                    name="name"
                    label="Book Name"
                    placeholder="Enter book name"
                    required
                  />

                  <CategorySelect />
                </div>

                {/* Cover */}
                <FormInput
                  name="cover"
                  label="Cover Image URL"
                  placeholder="https://example.com/book-cover.jpg"
                  required
                />

                {/* Description */}
                <FormTextarea
                  name="description"
                  label="Description"
                  placeholder="Write a short description about this book..."
                  rows={5}
                />

                {/* Featured */}
                <FeaturedToggle />
              </div>
            </section>

            {/* ------------------------------------------------------------ */}
            {/* Book Content                                                  */}
            {/* ------------------------------------------------------------ */}

            <section>
              <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-teal-600" />

                    <h2 className="text-lg font-bold text-gray-900">
                      Book Content
                    </h2>
                  </div>

                  <p className="mt-1 text-sm text-gray-500">
                    Add and organize the book content section by section.
                  </p>
                </div>
              </div>

              <BookContents />
            </section>

            {/* ------------------------------------------------------------ */}
            {/* Submit                                                        */}
            {/* ------------------------------------------------------------ */}

            <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex min-w-40 items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-teal-100 transition-all hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating Book...
                  </>
                ) : (
                  <>
                    <Book className="h-4 w-4" />
                    Create Book
                  </>
                )}
              </button>
            </div>
          </div>
        </FormContainer>
        <footer className="flex flex-col items-center gap-4 py-8">
          <div className="h-1 w-16 bg-gray-200 rounded-full" />

          <p className="text-xs font-semibold uppercase text-gray-400 tracking-widest">
            Almunji Global Archival System • Library Services
          </p>
        </footer>
      </div>
    </div>
  );
};

export default CreateBookPage;
