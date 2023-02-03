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
  setUser: (user: User | null | undefined) => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

type GetCurrentUser = {
  getCurrentUser: {
    user: User | null;
  };
};

const useProvideAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const { data, refetch, loading } = useQuery<GetCurrentUser>(getCurrentUser);

  const fetchCurentUser = useCallback(async () => {
    if (!data) {
      setUser(null);
      return;
    }
    if (data.getCurrentUser) {
      setUser(null);
      await refetch();
      setUser(data.getCurrentUser);
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
    loading,
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

  // if (context === ({} as AuthContextData)) {
  //   throw new Error("useAuth must be used within an AuthProvider");
  // }

  return context;
};

export const AuthProvider = memo(AuthProviderComponent);
