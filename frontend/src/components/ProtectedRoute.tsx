import { Navigate } from 'react-router-dom';
import { isLoggedIn } from '../services/auth.service';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * SimpleProtectedRoute Component
 * Guards a route by verifying the stored token is present, structurally valid,
 * and not expired. Redirects to /login immediately when any check fails.
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // isLoggedIn decodes the JWT and checks the `exp` claim, so expired or
  // malformed tokens are treated the same as a missing token.
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
