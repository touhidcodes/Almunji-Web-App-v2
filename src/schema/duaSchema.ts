import { z } from "zod/v3";

export const CreateDuaSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  arabic: z.string().trim().min(1, "Arabic text is required"),
  transliteration: z.string().optional(),
  bangla: z.string().trim().min(1, "Bangla text is required"),
  english: z.string().optional(),
  reference: z.string().optional(),
  tags: z.array(z.string().trim().min(1)).optional(),
});

export type TDuaFormValues = z.infer<typeof CreateDuaSchema>;

export const UpdateDuaSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  arabic: z.string().trim().min(1, "Arabic text is required"),
  transliteration: z.string().optional(),
  bangla: z.string().trim().min(1, "Bangla text is required"),
  english: z.string().optional(),
  reference: z.string().optional(),
  tags: z.array(z.string().trim().min(1)).optional(),
});
