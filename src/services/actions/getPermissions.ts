"use server";

import { getPermissionsCookie } from "./setPermissionsCookie";

export const getPermissions = async (): Promise<any[]> => {
  return await getPermissionsCookie();
};
