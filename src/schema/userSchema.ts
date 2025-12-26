import z from "zod/v3";
import { UserRoleEnum, UserStatusEnum } from "./enums";

export const UserProfileSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid(),
  name: z.string().min(1).optional(),
  image: z.string().url().optional(),
  bio: z.string().optional(),
  profession: z.string().optional(),
  address: z.string().optional(),
});

export const UserSchema = z.object({
  id: z.string().uuid().optional(),
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  role: UserRoleEnum,
  status: UserStatusEnum.optional(),
  UserProfile: UserProfileSchema.optional(),
});
