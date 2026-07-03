import { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
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
  const location = useLocation();

  // Check if user is logged in
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Check if user has required role
  if (allowedRoles) {
    const user = getUserInfo();
    if (!user || !allowedRoles.includes(user.role)) {
      return <Navigate to="/login" replace state={{ from: location }} />;
    }
  }

  // If children are provided, render them; otherwise render Outlet for nested routes
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;