import { ReactNode, useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isLoggedIn, getUserInfo } from '../services/auth.service';
import { bootstrapAuthSession } from "../services/auth.bootstrap";


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
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    bootstrapAuthSession().finally(() => {
      if (mounted) {
        setIsReady(true);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  if (!isReady) {
    return (
      <div className="grid min-h-screen place-items-center bg-black text-gray-300">
        <div className="space-y-3 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
            Loading session
          </p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
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
