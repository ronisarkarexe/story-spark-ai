import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isLoggedIn, getUserInfo } from '../services/auth.service';
import { USER_ROLE } from '../constants/role';

interface ProtectedRouteProps {
  allowedRoles?: USER_ROLE[];
  children?: React.ReactNode;
}

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  const user = getUserInfo();
  if (allowedRoles && user && !allowedRoles.includes(user.role as USER_ROLE)) {
    return <Navigate to="/" replace />;
  }

  return <>{children ? children : <Outlet />}</>;
};

export default ProtectedRoute;
