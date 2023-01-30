import { PropsWithChildren, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";

export const AuthRouteGuard = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (user === undefined) return;
    if (user === null) {
      navigate("/login", { replace: true, state: { from: location.pathname } });
    }
  }, [user, location.pathname, navigate]);

  if (user === null) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  const renderChildren = () => {
    if (user === undefined) {
      return <p>Loading</p>;
    }
    if (user === null) {
      return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
  };

  if (location.pathname === "/login" && user !== null) {
    return <Navigate to="/" replace />;
  }

  return <>{renderChildren()}</>;
};
