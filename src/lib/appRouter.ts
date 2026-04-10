import { useSyncExternalStore } from 'react';

export const APP_ROUTE_CHANGE_EVENT = 'app-router:change';

export type AppRouterAdapter = {
  getHref: () => string;
  getPathname: () => string;
  getSearch: () => string;
  push: (path: string) => void;
  replace: (path: string) => void;
  back: () => void;
  subscribe: (listener: () => void) => () => void;
};

function dispatchRouteChange() {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new Event(APP_ROUTE_CHANGE_EVENT));
}

function getBrowserPathname() {
  if (typeof window === 'undefined') {
    return '/';
  }

  return window.location.pathname || '/';
}

function getBrowserSearch() {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.location.search || '';
}

function getBrowserHref() {
  if (typeof window === 'undefined') {
    return '/';
  }

  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

function parseOverrideLocation(override?: string) {
  if (!override) {
    return null;
  }

  const parsed = new URL(override, 'https://app.local');

  return {
    href: `${parsed.pathname}${parsed.search}${parsed.hash}`,
    pathname: parsed.pathname || '/',
    search: parsed.search || '',
  };
}

function createBrowserRouter(): AppRouterAdapter {
  return {
    getHref: getBrowserHref,
    getPathname: getBrowserPathname,
    getSearch: getBrowserSearch,

    push(path) {
      if (typeof window === 'undefined') {
        return;
      }

      window.history.pushState({}, '', path);
      dispatchRouteChange();
    },

    replace(path) {
      if (typeof window === 'undefined') {
        return;
      }

      window.history.replaceState({}, '', path);
      dispatchRouteChange();
    },

    back() {
      if (typeof window === 'undefined') {
        return;
      }

      window.history.back();
      dispatchRouteChange();
    },

    subscribe(listener) {
      if (typeof window === 'undefined') {
        return () => undefined;
      }

      window.addEventListener('popstate', listener);
      window.addEventListener(APP_ROUTE_CHANGE_EVENT, listener);

      return () => {
        window.removeEventListener('popstate', listener);
        window.removeEventListener(APP_ROUTE_CHANGE_EVENT, listener);
      };
    },
  };
}

let appRouterAdapter: AppRouterAdapter = createBrowserRouter();

export function configureAppRouter(nextAdapter: AppRouterAdapter) {
  appRouterAdapter = nextAdapter;
}

export function resetAppRouter() {
  appRouterAdapter = createBrowserRouter();
}

export const appRouter = {
  getHref() {
    return appRouterAdapter.getHref();
  },

  getPathname() {
    return appRouterAdapter.getPathname();
  },

  getSearch() {
    return appRouterAdapter.getSearch();
  },

  push(path: string) {
    appRouterAdapter.push(path);
  },

  replace(path: string) {
    appRouterAdapter.replace(path);
  },

  back() {
    appRouterAdapter.back();
  },

  subscribe(listener: () => void) {
    return appRouterAdapter.subscribe(listener);
  },
};

export function useAppPathname(pathname?: string) {
  const currentPathname = useSyncExternalStore(
    appRouter.subscribe,
    appRouter.getPathname,
    appRouter.getPathname,
  );

  return parseOverrideLocation(pathname)?.pathname ?? currentPathname;
}

export function useAppLocation(pathname?: string) {
  const overrideLocation = parseOverrideLocation(pathname);
  const href = useSyncExternalStore(
    appRouter.subscribe,
    appRouter.getHref,
    appRouter.getHref,
  );

  return {
    href: overrideLocation?.href ?? href,
    pathname: overrideLocation?.pathname ?? appRouter.getPathname(),
    search: overrideLocation?.search ?? appRouter.getSearch(),
  };
}

export function useAppRouter() {
  return appRouter;
}
