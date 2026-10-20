import z from "zod/v3";
import { CreateAyahSchema } from "./ayahSchema";
import { CreateTafsirSchema } from "./tafsirSchema";

export const CreateAyahWithTafsirSchema = CreateAyahSchema.extend({
  ...CreateTafsirSchema.shape,
});

export type TCreateAyahWithTafsir = z.infer<typeof CreateAyahWithTafsirSchema>;
