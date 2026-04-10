import { useEffect, type ReactNode } from 'react';

import { selectIsAuthenticated, useAuthStore } from '../stores/authStore';

export type AuthRouteGuardProps = {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
  isAuthenticated?: boolean;
  onRedirect?: (target: string) => void;
};

export function AuthRouteGuard({
  children,
  fallback = null,
  redirectTo = '/',
  isAuthenticated,
  onRedirect,
}: AuthRouteGuardProps) {
  const storeAuthenticated = useAuthStore(selectIsAuthenticated);
  const resolvedAuthenticated = isAuthenticated ?? storeAuthenticated;

  useEffect(() => {
    if (resolvedAuthenticated) {
      onRedirect?.(redirectTo);
    }
  }, [onRedirect, redirectTo, resolvedAuthenticated]);

  if (resolvedAuthenticated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
