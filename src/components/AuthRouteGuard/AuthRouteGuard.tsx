import { PropsWithChildren, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { LoadingLayout } from "../LoadingLayout/LoadingLayout";

export const AuthRouteGuard = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (user === null) {
      navigate("/login", { replace: true, state: { from: location.pathname } });
    }
  }, [user, location.pathname, navigate]);

  const renderChildren = () => {
    if (loading) {
      return <LoadingLayout />;
    }
    if (user === null) {
      return (
        <Navigate to="/login" replace state={{ from: location.pathname }} />
      );
    }

    return children;
  };

  return <>{renderChildren()}</>;
};
