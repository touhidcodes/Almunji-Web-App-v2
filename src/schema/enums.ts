import z from "zod/v3";

export const UserRoleEnum = z.enum([
  "SUPERADMIN",
  "ADMIN",
  "MODERATOR",
  "USER",
]);

export const UserStatusEnum = z.enum(["ACTIVE", "BLOCKED"]);

export const StatusEnum = z.enum(["PENDING", "BOOKED", "REJECTED"]);
