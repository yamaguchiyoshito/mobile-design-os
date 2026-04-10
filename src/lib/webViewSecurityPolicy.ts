const DEFAULT_ALLOWED_ORIGINS = ['https://example.com', 'https://docs.example.com'] as const;
const EXTERNAL_SCHEMES = ['mailto:', 'tel:', 'sms:'] as const;

export type UrlDispatchResult =
  | { action: 'allow' }
  | { action: 'external' }
  | { action: 'deeplink' }
  | { action: 'block' };

function toOrigin(url: string) {
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

function createPolicy(allowedOrigins: string[]) {
  return {
    originWhitelist: allowedOrigins,
    isAllowed(url: string) {
      const origin = toOrigin(url);
      if (!origin) {
        return false;
      }

      return allowedOrigins.includes(origin);
    },
  };
}

export function dispatchUrl(url: string): UrlDispatchResult {
  if (url.startsWith('myapp://')) {
    return { action: 'deeplink' };
  }

  if ((EXTERNAL_SCHEMES as readonly string[]).some((scheme) => url.startsWith(scheme))) {
    return { action: 'external' };
  }

  try {
    const parsed = new URL(url);

    if (parsed.protocol === 'myapp:') {
      return { action: 'deeplink' };
    }

    if ((EXTERNAL_SCHEMES as readonly string[]).includes(parsed.protocol)) {
      return { action: 'external' };
    }

    if (parsed.protocol === 'https:') {
      return { action: 'allow' };
    }

    return { action: 'block' };
  } catch {
    return { action: 'block' };
  }
}

const BASE_INJECTED_JS = `
  (function() {
    window.open = function(url) {
      if (window.ReactNativeWebView && typeof window.ReactNativeWebView.postMessage === 'function') {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'OPEN_EXTERNAL',
          payload: { url: String(url) }
        }));
      }
      return null;
    };
    true;
  })();
` as const;

export const webViewSecurityPolicy = {
  baseInjectedJS: BASE_INJECTED_JS,
  default: createPolicy([...DEFAULT_ALLOWED_ORIGINS]),
  createCustomPolicy(allowedOrigins: string[]) {
    return createPolicy(allowedOrigins);
  },
  dispatchUrl,
  openExternal(url: string) {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  },
};
