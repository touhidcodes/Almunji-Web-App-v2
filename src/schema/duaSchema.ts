import z from "zod/v3";

export const DuaSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  arabic: z.string().min(1),
  transliteration: z.string().optional(),
  bangla: z.string().min(1),
  english: z.string().optional(),
  reference: z.string().optional(),
  tags: z.string().optional(),
  isDeleted: z.boolean().optional(),
});
