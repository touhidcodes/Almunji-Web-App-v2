import z from "zod/v3";

export const DictionarySchema = z.object({
  id: z.string().uuid().optional(),
  word: z.string().min(1),
  definition: z.string().min(1),
  pronunciation: z.string().min(1),
  isDeleted: z.boolean().optional(),
});
