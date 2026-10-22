import { z } from "zod/v3";

export const CreateDictionarySchema = z.object({
  persianWord: z.string().trim().min(1, "Persian word is required."),
  transliteration: z.string().optional(),
  banglaMeaning: z.string().trim().min(1, "Bangla meaning is required."),
  englishMeaning: z.string().optional(),
  exampleFA: z.string().optional(),
  exampleEN: z.string().optional(),
  exampleBN: z.string().optional(),
});

export type TDictionaryFormValues = z.infer<typeof CreateDictionarySchema>;
