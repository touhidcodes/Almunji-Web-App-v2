import z from "zod/v3";

export const TafsirSchema = z.object({
  id: z.string().uuid().optional(),
  ayahId: z.string().uuid(),
  heading: z.string().optional(),
  summaryBn: z.string().optional(),
  summaryEn: z.string().optional(),
  detailBn: z.string().optional(),
  detailEn: z.string().optional(),
  scholar: z.string().optional(),
  reference: z.string().optional(),
  tags: z.string().optional(),
  isDeleted: z.boolean().optional(),
});
