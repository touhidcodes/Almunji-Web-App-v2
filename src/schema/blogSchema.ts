import z from "zod/v3";

export const BlogSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1),
  slug: z.string().min(1),
  thumbnail: z.string().url().optional(),
  summary: z.string().optional(),
  content: z.string().min(1),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
});
