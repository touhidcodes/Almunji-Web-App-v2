import z from "zod/v3";

import { CreateAyahSchema } from "@/schema/ayahSchema";

const optionalText = z.string().optional();

const TafsirTagsSchema = z
  .array(z.string().trim().min(1, "Tags cannot be empty"))
  .optional();

export const CreateAyahWithTafsirSchema = CreateAyahSchema.extend({
  heading: optionalText,
  summaryBn: optionalText,
  summaryEn: optionalText,
  detailBn: optionalText,
  detailEn: optionalText,
  scholar: optionalText,
  reference: optionalText,
  tags: TafsirTagsSchema,
});

export type TCreateAyahWithTafsir = z.infer<typeof CreateAyahWithTafsirSchema>;
