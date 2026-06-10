import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isLoggedIn, getUserInfo } from '../services/auth.service';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  allowedRoles?: string[];
}

/**
 * ProtectedRoute Component
 * Guards a route by verifying the stored token is present, decodable,
 * and checking user roles if required.
 */
const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles) {
    const userInfo = getUserInfo();
    const userRole = userInfo?.role || "guest";
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/" replace />;
    }
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
