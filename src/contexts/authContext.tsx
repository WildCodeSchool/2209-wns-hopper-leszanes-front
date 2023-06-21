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
import { getCurrentUser } from "../graphql/user/getCurrentUser";

type AuthContextData = {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

type GetCurrentUser = {
  getCurrentUser: User | null;
};

const useProvideAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const { data, loading } = useQuery<GetCurrentUser>(getCurrentUser);

  const fetchCurentUser = useCallback(() => {
    if (!data) {
      return;
    }
    if (data.getCurrentUser) {
      setUser(data.getCurrentUser);
    }
  }, [data]);

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
  const { user, setUser, loading } = useProvideAuth();
  const value = useMemo(
    () => ({ user, setUser, loading }),
    [user, setUser, loading]
  );

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
