import { Navigate } from 'react-router-dom';
import { getFromLocalStorage } from '../utils/local-storage';
import { AUTH_KEY } from '../constants/storage-key';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * SimpleProtectedRoute Component
 * Synchronously checks if user has valid auth token, Immediately redirects if no token (no loading state)
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  // Get token from localStorage SYNCHRONOUSLY (no useState needed)
  const token = getFromLocalStorage(AUTH_KEY);
  
  // If NO token found → immediately redirect to login
  if (!token) {
    console.log("No token found, redirecting to login");
    return <Navigate to="/login" replace />;
  }
  
  // If token exists → show protected content
  console.log("Token found, showing protected content");
  return <>{children}</>;
};

export default ProtectedRoute;