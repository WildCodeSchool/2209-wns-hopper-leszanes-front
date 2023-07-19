import { PropsWithChildren, useMemo } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { LoadingLayout } from "../LoadingLayout/LoadingLayout";

export const AuthRouteGuard = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();

  useMemo(() => {
    if (loading) return;
    if (!user) {
      navigate("/login", { replace: true, state: { from: location.pathname } });
    }
  }, [user, location.pathname, navigate, loading]);

  const renderChildren = useMemo(() => {
    if (loading) {
      return <LoadingLayout />;
    }
    if (!user) {
      return (
        <Navigate to="/login" replace state={{ from: location.pathname }} />
      );
    }

    return children;
  }, [children, loading, location.pathname, user]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{renderChildren}</>;
};
