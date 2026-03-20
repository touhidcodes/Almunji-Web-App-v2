import z from "zod/v3";
import { TafsirSchema } from "./tafsirSchema";

export const AyahSchema = z.object({
  id: z.string().uuid().optional(),
  surahId: z.string().uuid(),
  paraId: z.string().uuid(),
  number: z.coerce.number().int().positive(),
  arabic: z.string().min(1),
  transliteration: z.string().optional(),
  bangla: z.string().optional(),
  english: z.string().optional(),
  isDeleted: z.boolean().optional(),
  tafsir: TafsirSchema.optional(),
});
