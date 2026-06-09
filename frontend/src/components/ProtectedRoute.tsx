import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isLoggedIn, getUserInfo } from '../services/auth.service';

interface ProtectedRouteProps {
  allowedRoles?: string[];
  children?: React.ReactNode;
}

/**
 * ProtectedRoute Component
 * Guards a route by verifying the stored token is present, decodable,
 * not past its `exp` claim, and that the user's role is permitted.
 * Redirects to /login immediately when any check fails.
 */
const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  // isLoggedIn reads the token from localStorage, decodes it with
  // jwtDecode, and returns false if the token is missing, malformed,
  // or if Date.now() is past the `exp` claim.
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles) {
    const userInfo = getUserInfo();
    const userRole = userInfo?.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return <Navigate to="/login" replace />;
    }
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
