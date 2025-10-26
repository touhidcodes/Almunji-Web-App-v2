// // "use server";

// import { FieldValues } from "react-hook-form";

// export const userRegister = async (data: FieldValues) => {
//   console.log(`${process.env.NEXT_PUBLIC_LOCAL_URL}/register`);

//   // TODO: change URL before build
//   // const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/register`, {
//   const res = await fetch(`${process.env.V_LOCAL_URL}/register`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//     cache: "no-store",
//   });

//   const userInfo = await res.json();
//   console.log(userInfo);
//   return userInfo;
// };

// "use server";

import { FieldValues } from "react-hook-form";
import setAccessToken from "./setAccessToken";

export const userRegister = async (data: FieldValues) => {
  // TODO: change URL before build
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/register`, {
    // const res = await fetch(`${process.env.NEXT_PUBLIC_LOCAL_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
    // cache: "no-store",
  });

  const userInfo = await res.json();

  if (userInfo.data?.token) {
    setAccessToken(userInfo.data.token);
  }

  return userInfo;
};
