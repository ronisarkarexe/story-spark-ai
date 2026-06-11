import { Navigate, Outlet } from 'react-router-dom';
import { isLoggedIn, getUserInfo } from '../services/auth.service';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  allowedRoles?: string[];
}

/**
 * ProtectedRoute Component
 * Guards a route by verifying the stored token is present, decodable,
 * and not past its `exp` claim. Redirects to /login immediately when
 * any check fails.
 */
const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  // isLoggedIn reads the token from localStorage, decodes it with
  // jwtDecode, and returns false if the token is missing, malformed,
  // or if Date.now() is past the `exp` claim.
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles) {
    const user = getUserInfo();
    const role = user?.role;
    if (!role || !allowedRoles.includes(role)) {
      return <Navigate to="/login" replace />;
    }
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
