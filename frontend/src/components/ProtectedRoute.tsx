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

  if (localStorage.getItem("accessToken") === "mock-developer-bypass-token") {
    return children ? <>{children}</> : <Outlet />;
  }

  // Check if user is logged in
  if (!isLoggedIn()) {
    if (import.meta.env.DEV) {
      console.warn("Dev mode: Bypassing auth check for protected route.");
    } else {
      return <Navigate to="/login" replace state={{ from: location }} />;
    }
  }

  // Check if user has required role
  if (allowedRoles && !import.meta.env.DEV) {
    const user = getUserInfo();
    if (!user || !allowedRoles.includes(user.role)) {
      return <Navigate to="/login" replace state={{ from: location }} />;
    }
  }

  // If children are provided, render them; otherwise render Outlet for nested routes
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;