import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, useAuthStore } from '@/stores/auth';
import type { UserRole } from '@/types';

interface RouteGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requireAuth?: boolean;
}

export function RouteGuard({ 
  children, 
  requiredRole, 
  requireAuth = true 
}: RouteGuardProps) {
  const { user, isAuthenticated } = useAuth();
  const { setLoading } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    setLoading(false);
  }, [setLoading]);

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // If user is authenticated but accessing auth pages, redirect to their dashboard
  if (isAuthenticated && location.pathname.startsWith('/auth')) {
    return <Navigate to={`/${user?.role}`} replace />;
  }

  // If specific role is required and user doesn't have it
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to their appropriate dashboard or show access denied
    if (user?.role) {
      return <Navigate to={`/${user.role}`} replace />;
    }
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
}