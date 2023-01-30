import {
  createContext,
  useMemo,
  useState,
  memo,
  type PropsWithChildren,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { useQuery } from "@apollo/client";
import type { User } from "../types/User";
import { getCurrentUser } from "../graphql/getCurrentUser";

type AuthContextData = {
  user: User | null | undefined;
  setUser: (user: User) => void;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

type GetCurrentUser = {
  getCurrentUser: {
    user: User | null;
  };
};

const useProvideAuth = () => {
  console.log("useProvideAuth");
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const { data, refetch } = useQuery<GetCurrentUser>(getCurrentUser);

  const fetchCurentUser = useCallback(async () => {
    console.log("fetchCurentUser");
    if (!data) {
      return;
    }
    console.log(data);
    if (data.getCurrentUser.user) {
      await refetch();
      setUser(data.getCurrentUser.user);
    } else {
      setUser(null);
    }
  }, [data, refetch]);

  useEffect(() => {
    fetchCurentUser();
  }, [data, fetchCurentUser]);

  return {
    user,
    setUser,
  };
};

const AuthProviderComponent = ({ children }: PropsWithChildren) => {
  const { user, setUser } = useProvideAuth();
  const value = useMemo(() => ({ user, setUser }), [user, setUser]);

  return (
    <AuthContext.Provider value={value}> {children} </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  console.log("useAuth");

  if (context === ({} as AuthContextData)) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export const AuthProvider = memo(AuthProviderComponent);
