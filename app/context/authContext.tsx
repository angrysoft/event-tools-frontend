"use client";
import {
  createContext,
  useCallback,
  useEffect,
  useState
} from "react";

interface IProviderProps {
  children: React.ReactNode;
}

export interface IAuthContext {
  isLoading: boolean;
  isLogged: boolean;
  user: UserInfo | null | undefined;
  setIsLogged: (state: boolean) => void;
  setUser: (state: UserInfo | null) => void;
}

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

const AuthContext = createContext<IAuthContext | null>(null);

const AuthProvider = (props: IProviderProps) => {
  const [user, setUser] = useState<UserInfo | null | undefined>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLogged, setIsLogged] = useState<boolean>(false);

  const fetchState = useCallback(async () => {
    const res = await fetch("/api/user", {
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    });
    if (res.ok) {
      const data: UserResponse = await res.json();
      setUser(data.data);
      setIsLogged(true);
    } else {
      setIsLogged(false);
    }
    console.log("call api", user, isLogged);
  }, []);

  useEffect(() => {
    fetchState();
    setIsLoading(false);
  }, [fetchState]);

  return (
    <AuthContext.Provider
      value={{
        isLoading: isLoading,
        user: user,
        isLogged: isLogged,
        setIsLogged: setIsLogged,
        setUser: setUser,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
