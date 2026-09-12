import z from "zod/v3";

export const DictionarySchema = z.object({
  id: z.string().uuid().optional(),
  word: z.string().min(1, "Word is required"),
  pronunciation: z.string().min(1, "Pronunciation is required"),
  definition: z.string().min(1, "Definition is required"),
  meaning: z.string().optional(),
  isDeleted: z.boolean().optional(),
});
