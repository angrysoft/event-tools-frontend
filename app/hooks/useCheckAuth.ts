"use client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

export interface User {
  username: string;
  enabled: boolean;
  authorities: { [key: string]: string }[];
}

export function useCheckAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const authState = useMemo(() => ({ isLoading, user }), [isLoading, user]);

  const fetchState = useCallback(async () => {
    const res = await fetch("/api/user", {
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    });
    console.log(res);
    if (res.ok) {
      const data = await res.json();
      console.log(data);
      setUser(data);
    } else {
      router.replace("/login");
    }
    setIsLoading(false);
  }, [router]);

  useEffect(() => {
    fetchState();
  }, [fetchState]);

  return authState;
}
