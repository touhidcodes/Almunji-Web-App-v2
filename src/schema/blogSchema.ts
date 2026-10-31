import { z } from "zod";

// Create Blog
export const CreateBlogSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  thumbnail: z.string().optional(),
  summary: z.string().optional(),
  content: z.string().trim().min(1, "Content is required"),
});

// Update Blog
export const UpdateBlogSchema = z
  .object({
    title: z.string().trim().min(1, "Title cannot be empty").optional(),
    thumbnail: z.string().optional(),
    summary: z.string().optional(),
    content: z.string().trim().min(1, "Content cannot be empty").optional(),
    isPublished: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field is required to update a blog",
  );

// Inferred Types
export type TCreateBlogFormValues = z.infer<typeof CreateBlogSchema>;
export type TUpdateBlogFormValues = z.infer<typeof UpdateBlogSchema>;
