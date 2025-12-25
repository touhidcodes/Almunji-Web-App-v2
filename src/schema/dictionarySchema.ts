import z from "zod/v3";

export const dictionaryValidationSchema = z.object({
  word: z.string(),
  pronunciation: z.string(),
  definition: z.string(),
  meaning: z.string(),
});
