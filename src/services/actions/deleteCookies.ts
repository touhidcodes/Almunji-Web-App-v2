"use server";

import { cookies } from "next/headers";

export const deleteCookies = async (keys: string[]) => {
  const cookiesInstance = await cookies();
  keys.forEach((key) => {
    cookiesInstance.delete(key);
  });
};
