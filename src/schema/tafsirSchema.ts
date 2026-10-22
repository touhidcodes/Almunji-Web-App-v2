import z from "zod/v3";

const TafsirTagsSchema = z
  .array(z.string().trim().min(1, "Tags cannot be empty"))
  .optional();

export const CreateTafsirSchema = z.object({
  ayahId: z.string().uuid("Invalid Ayah ID"),
  heading: z.string().optional(),
  summaryBn: z.string().optional(),
  summaryEn: z.string().optional(),
  detailBn: z.string().optional(),
  detailEn: z.string().optional(),
  scholar: z.string().optional(),
  reference: z.string().optional(),
  tags: TafsirTagsSchema,
});

export const UpdateTafsirSchema = z.object({
  heading: z.string().optional(),
  summaryBn: z.string().optional(),
  summaryEn: z.string().optional(),
  detailBn: z.string().optional(),
  detailEn: z.string().optional(),
  scholar: z.string().optional(),
  reference: z.string().optional(),
  tags: TafsirTagsSchema,
});

export type TCreateTafsirForm = z.infer<typeof CreateTafsirSchema>;

export type TUpdateTafsirForm = z.infer<typeof UpdateTafsirSchema>;
