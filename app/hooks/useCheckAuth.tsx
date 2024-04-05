"use client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

interface UserResponse {
  status: boolean;
  error?: string;
  data?: UserInfo;
}

interface UserInfo {
  username: string;
  authorities: Authorities[];
}

interface Authorities {
  authority: string;
}

export function useCheckAuth() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null | undefined>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const authState = useMemo(() => ({ isLoading, user }), [isLoading, user]);

  const fetchState = useCallback(async () => {
    const res = await fetch("/api/user", {
      cache: "no-store",
      credentials: "include",
    });
    console.log(res);
    if (res.ok) {
      const data: UserResponse = await res.json();
      setUser(data?.data);
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

export type { UserResponse, UserInfo, Authorities };
