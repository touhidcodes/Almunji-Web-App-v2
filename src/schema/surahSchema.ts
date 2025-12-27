import z from "zod/v3";

export const SurahSchema = z.object({
  id: z.string().uuid().optional(),
  chapter: z.number().int().positive(),
  totalAyah: z.number().int().positive(),
  arabic: z.string().min(1),
  english: z.string().min(1),
  bangla: z.string().optional(),
  history: z.string().optional(),
  revelation: z.string().min(1),
});
