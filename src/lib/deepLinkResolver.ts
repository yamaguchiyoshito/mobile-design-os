import { authStore } from '../stores/authStore';
import { appRouter } from './appRouter';
import { logger } from './logger';

export const ALLOWED_HOSTS = ['myapp.internal', 'example.com', 'staging.example.com'] as const;
export const PENDING_DEEP_LINK_KEY = 'pending_deep_link';

export type RouteRule = {
  pattern: RegExp;
  toPath: (match: RegExpMatchArray, params: string) => string;
  requiresAuth: boolean;
};

export const ROUTE_RULES: RouteRule[] = [
  {
    pattern: /^\/order\/([^/?]+)/,
    toPath: (match, params) =>
      `/(main)/orders/${match[1]}${params ? `?${params}` : ''}`,
    requiresAuth: true,
  },
  {
    pattern: /^\/orders\/([^/?]+)/,
    toPath: (match, params) =>
      `/(main)/orders/${match[1]}${params ? `?${params}` : ''}`,
    requiresAuth: true,
  },
  {
    pattern: /^\/orders\/?$/,
    toPath: (_match, params) => (params ? `/(main)/orders?${params}` : '/(main)/orders'),
    requiresAuth: true,
  },
  {
    pattern: /^\/search\/?$/,
    toPath: (_match, params) => (params ? `/(main)/search?${params}` : '/(main)/search'),
    requiresAuth: false,
  },
  {
    pattern: /^\/profile\/settings\/?$/,
    toPath: () => '/(main)/profile/settings',
    requiresAuth: true,
  },
  {
    pattern: /^\/profile\/?$/,
    toPath: () => '/(main)/profile',
    requiresAuth: true,
  },
  {
    pattern: /^\/notifications\/?$/,
    toPath: () => '/(main)/notifications',
    requiresAuth: true,
  },
  {
    pattern: /^\/campaign\/([^/?]+)/,
    toPath: (match) => `/(main)/campaign/${match[1]}`,
    requiresAuth: false,
  },
  {
    pattern: /^\/auth\/verify\/?$/,
    toPath: (_match, params) => (params ? `/(auth)/verify?${params}` : '/(auth)/verify'),
    requiresAuth: false,
  },
];

type RouterAdapter = {
  push: (path: string) => void;
  replace: (path: string) => void;
};

type PendingStorage = {
  get: () => Promise<string | null>;
  set: (url: string) => Promise<void>;
  clear: () => Promise<void>;
};

type DeepLinkResolverConfig = {
  router: RouterAdapter;
  openExternalUrl: (url: string) => Promise<void> | void;
  pendingStorage: PendingStorage;
};

function createDefaultRouter(): RouterAdapter {
  return {
    push(path) {
      appRouter.push(path);
    },
    replace(path) {
      appRouter.replace(path);
    },
  };
}

function createDefaultPendingStorage(): PendingStorage {
  return {
    async get() {
      if (typeof window === 'undefined') {
        return null;
      }

      return window.localStorage.getItem(PENDING_DEEP_LINK_KEY);
    },
    async set(url) {
      if (typeof window === 'undefined') {
        return;
      }

      window.localStorage.setItem(PENDING_DEEP_LINK_KEY, url);
    },
    async clear() {
      if (typeof window === 'undefined') {
        return;
      }

      window.localStorage.removeItem(PENDING_DEEP_LINK_KEY);
    },
  };
}

function createDefaultConfig(): DeepLinkResolverConfig {
  return {
    router: createDefaultRouter(),
    openExternalUrl: async (url) => {
      if (typeof window === 'undefined') {
        return;
      }

      window.open(url, '_blank', 'noopener,noreferrer');
    },
    pendingStorage: createDefaultPendingStorage(),
  };
}

let config = createDefaultConfig();

function isAllowedHost(hostname: string) {
  return (ALLOWED_HOSTS as readonly string[]).includes(hostname);
}

function normalizeUrl(url: string) {
  return url
    .replace('myapp://', 'https://myapp.internal/')
    .replace('https://example.com', 'https://myapp.internal')
    .replace('https://staging.example.com', 'https://myapp.internal');
}

function parseUrl(url: string) {
  try {
    const parsed = new URL(normalizeUrl(url));

    return {
      hostname: parsed.hostname,
      path: parsed.pathname,
      params: parsed.searchParams.toString(),
      protocol: parsed.protocol,
      allowedHost: isAllowedHost(parsed.hostname),
    };
  } catch {
    return null;
  }
}

export function configureDeepLinkResolver(overrides: Partial<DeepLinkResolverConfig>) {
  config = {
    ...config,
    ...overrides,
    pendingStorage: overrides.pendingStorage ?? config.pendingStorage,
    router: overrides.router ?? config.router,
    openExternalUrl: overrides.openExternalUrl ?? config.openExternalUrl,
  };
}

export function resetDeepLinkResolverConfig() {
  config = createDefaultConfig();
}

export async function navigate(url: string): Promise<boolean> {
  const extracted = parseUrl(url);

  if (!extracted) {
    logger.warn('deepLinkResolver: cannot extract path', { url });
    return false;
  }

  const { path, params, hostname, allowedHost, protocol } = extracted;

  for (const rule of ROUTE_RULES) {
    const match = path.match(rule.pattern);

    if (!match) {
      continue;
    }

    if (!allowedHost) {
      logger.warn('deepLinkResolver: disallowed host', { url, hostname });
      return false;
    }

    const targetPath = rule.toPath(match, params);

    if (rule.requiresAuth && !authStore.getState().isLoggedIn) {
      await config.pendingStorage.set(url);
      config.router.replace('/(auth)/login');
      return true;
    }

    config.router.push(targetPath);
    return true;
  }

  if (protocol === 'https:') {
    await config.openExternalUrl(url);
    return true;
  }

  logger.warn('deepLinkResolver: unmatched path', { url, path });
  return false;
}

export async function consumePendingDeepLink(): Promise<void> {
  const url = await config.pendingStorage.get();

  if (!url) {
    return;
  }

  await config.pendingStorage.clear();
  await navigate(url);
}

export const deepLinkResolver = { navigate, consumePendingDeepLink };
