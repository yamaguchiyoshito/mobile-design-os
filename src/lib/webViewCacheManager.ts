import { logger } from './logger';

type WebViewCacheResetStrategy = () => Promise<void> | void;

const resetStrategies = new Set<WebViewCacheResetStrategy>();

export function registerWebViewCacheResetStrategy(strategy: WebViewCacheResetStrategy) {
  resetStrategies.add(strategy);

  return () => {
    resetStrategies.delete(strategy);
  };
}

export async function clearWebViewCache() {
  const tasks: Promise<unknown>[] = [];

  if (typeof window !== 'undefined' && 'caches' in window) {
    const cacheStorage = window.caches;
    tasks.push(
      cacheStorage
        .keys()
        .then((keys) => Promise.all(keys.map((key) => cacheStorage.delete(key)))),
    );
  }

  resetStrategies.forEach((strategy) => {
    tasks.push(Promise.resolve().then(strategy));
  });

  const results = await Promise.allSettled(tasks);

  results.forEach((result) => {
    if (result.status === 'rejected') {
      logger.warn('webViewCacheManager: failed to clear cache', {
        reason: result.reason,
      });
    }
  });
}
