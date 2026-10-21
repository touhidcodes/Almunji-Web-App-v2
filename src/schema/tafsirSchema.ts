import { normalizeTags } from "@/utils/normalizeTags";
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

export const CreateTafsirSchema = z.object({
  heading: z.string().optional(),
  summaryBn: z.string().optional(),
  summaryEn: z.string().optional(),
  detailBn: z.string().optional(),
  detailEn: z.string().optional(),
  scholar: z.string().optional(),
  reference: z.string().optional(),
  tags: z.array(z.string().trim().min(1)).optional(),
});

export type TCreateTafsirForm = z.infer<typeof CreateTafsirSchema>;

export const EditTafsirSchema = CreateTafsirSchema.extend({
  tags: z.preprocess(
    normalizeTags,
    z.array(z.string().trim().min(1)).optional(),
  ),
});
