"use server";

import { cookies } from "next/headers";

export const deleteCookies = (keys: string[]) => {
  const cookiesInstance = cookies();
  keys.forEach((key) => {
    cookiesInstance.delete(key);
  });
};
