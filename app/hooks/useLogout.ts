"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useLogout() {
  const router = useRouter();

  const callLogoutController = useCallback(async () => {
    const res = await fetch("/api/user/logout", {
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    });
    console.log("logout ", res);
    if (res.ok) {

     router.replace("/login")
    }
  }, [router]);

  return callLogoutController;
}
