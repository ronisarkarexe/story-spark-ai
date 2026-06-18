import { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isLoggedIn, getUserInfo } from "../services/auth.service";

interface ProtectedRouteProps {
  allowedRoles?: string[];
  children?: ReactNode;
}

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles) {
    const user = getUserInfo();
    if (!user || !allowedRoles.includes(user.role)) {
      return <Navigate to="/login" replace />;
    }
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
