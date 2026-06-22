import { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isLoggedIn, getUserInfo } from '../services/auth.service';

interface ProtectedRouteProps {
  allowedRoles?: string[];
  children?: ReactNode;
}

/**
 * ProtectedRoute Component
 * Guards a route by verifying the stored token is present, decodable,
 * and checks the user's role if allowedRoles is provided.
 */
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
