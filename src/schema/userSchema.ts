import z from "zod/v3";

export const UserProfileSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid(),
  name: z.string().min(1).optional(),
  image: z.string().url().optional(),
  bio: z.string().optional(),
  profession: z.string().optional(),
  address: z.string().optional(),
});
