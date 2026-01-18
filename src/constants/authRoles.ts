export const authRole = {
  ADMIN: "ADMIN",
  MODERATOR: "MODERATOR",
  USER: "USER",
};

export type TAuthRole = keyof typeof authRole;
