import { z } from "zod/v3";

/*  Shared Schemas  */

export const CategorySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, "Category name is required"),
  isDeleted: z.boolean().optional(),
});

export const BookContentFormSchema = z.object({
  section: z.string().trim().min(1, "Section title is required"),
  index: z
    .number()
    .int("Section index must be an integer")
    .min(1, "Section index must be at least 1"),
  text: z.string().trim().min(1, "Content text is required"),
});

export const BookContentSchema = BookContentFormSchema.extend({
  id: z.string().uuid().optional(),
  bookId: z.string().uuid("Invalid book ID"),
  isDeleted: z.boolean().optional(),
});

export const CreateBookSchema = z.object({
  name: z.string().trim().min(1, "Book name is required"),
  description: z.string().optional(),
  cover: z.string().url("Enter a valid cover image URL"),
  categoryId: z.string().uuid("Select a valid book category"),
  isFeatured: z.boolean().default(true),
});

export const BookSchema = CreateBookSchema.extend({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).optional(),
  isDeleted: z.boolean().optional(),
  contents: z.array(BookContentSchema).optional(),
});

export const CreateBookWithContentsSchema = CreateBookSchema.extend({
  contents: z
    .array(BookContentFormSchema)
    .min(1, "Add at least one book section"),
});

/*  Types   */
export type TCategory = z.infer<typeof CategorySchema>;
export type TBookContentForm = z.infer<typeof BookContentFormSchema>;
export type TBookContent = z.infer<typeof BookContentSchema>;
export type TCreateBook = z.infer<typeof CreateBookSchema>;
export type TBook = z.infer<typeof BookSchema>;
export type TCreateBookWithContents = z.infer<
  typeof CreateBookWithContentsSchema
>;
