"use server";

import { cookies } from "next/headers";

export default async function useCookie() {
  const cookieStore = await cookies();
  const authValue = cookieStore.get("auth-value")?.value;
  const fuid = cookieStore.get("fuid")?.value;

}