import z from "zod/v3";

export const ParaSchema = z.object({
  id: z.string().uuid().optional(),
  number: z.coerce.number().int().positive(),
  arabic: z.string().min(1),
  english: z.string().optional(),
  bangla: z.string().optional(),
  startAyahRef: z.string().min(1),
  endAyahRef: z.string().min(1),
});
