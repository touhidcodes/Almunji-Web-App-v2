import { z } from "zod";

// Create Blog
export const CreateBlogSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  thumbnail: z.string().optional(),
  summary: z.string().optional(),
  content: z.string().trim().min(1, "Content is required"),
});

// Update Blog
export const UpdateBlogSchema = z.object({
  title: z.string().trim().min(1, "Blog title is required"),
  slug: z.string().trim().min(1, "Blog slug is required"),
  thumbnail: z.string().optional(),
  summary: z.string().optional(),
  content: z.string().trim().min(1, "Article content is required"),
  isPublished: z.boolean(),
  isFeatured: z.boolean(),
});

// Inferred Types
export type TCreateBlogFormValues = z.infer<typeof CreateBlogSchema>;
export type TUpdateBlogFormValues = z.infer<typeof UpdateBlogSchema>;
