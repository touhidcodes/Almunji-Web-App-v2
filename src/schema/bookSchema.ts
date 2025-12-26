import z from "zod/v3";

export const CategorySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  isDeleted: z.boolean().optional(),
});

export const BookContentSchema = z.object({
  id: z.string().uuid().optional(),
  bookId: z.string().uuid(),
  title: z.string().min(1),
  order: z.number().int().nonnegative(),
  text: z.string().min(1),
  isDeleted: z.boolean().optional(),
});

export const BookSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  cover: z.string().url(),
  categoryId: z.string().uuid(),
  isFeatured: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
  contents: z.array(BookContentSchema).optional(),
});
