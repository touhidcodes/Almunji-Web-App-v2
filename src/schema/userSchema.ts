import z from "zod/v3";
import { UserRoleEnum, UserStatusEnum } from "./enums";

export const UserProfileSchema = z.object({
  name: z.string().trim(),
  image: z.string().trim(),
  bio: z.string().trim(),
  profession: z.string().trim(),
  address: z.string().trim(),
});

export type TUserProfileForm = z.infer<typeof UserProfileSchema>;

export const UserSchema = z.object({
  id: z.string().uuid().optional(),
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  role: UserRoleEnum,
  status: UserStatusEnum.optional(),
  UserProfile: UserProfileSchema.optional(),
});
