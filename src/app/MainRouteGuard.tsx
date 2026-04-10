import { useEffect, type ReactNode } from 'react';

import { selectIsAuthenticated, useAuthStore } from '../stores/authStore';

export type MainRouteGuardProps = {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
  isAuthenticated?: boolean;
  onRedirect?: (target: string) => void;
};

export function MainRouteGuard({
  children,
  fallback = null,
  redirectTo = '/(auth)/login',
  isAuthenticated,
  onRedirect,
}: MainRouteGuardProps) {
  const storeAuthenticated = useAuthStore(selectIsAuthenticated);
  const resolvedAuthenticated = isAuthenticated ?? storeAuthenticated;

  useEffect(() => {
    if (!resolvedAuthenticated) {
      onRedirect?.(redirectTo);
    }
  }, [onRedirect, redirectTo, resolvedAuthenticated]);

  if (!resolvedAuthenticated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
