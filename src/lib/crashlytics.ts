import { env } from './env';
import { logger } from './logger';

export type CrashlyticsAdapter = {
  setUserId: (userId: string) => Promise<void> | void;
  setAttributes: (attributes: Record<string, string>) => Promise<void> | void;
  recordError: (error: Error) => Promise<void> | void;
  log: (message: string) => Promise<void> | void;
  setCrashlyticsEnabled: (enabled: boolean) => Promise<void> | void;
};

let adapter: CrashlyticsAdapter = {
  async setUserId() {},
  async setAttributes() {},
  async recordError() {},
  async log() {},
  async setCrashlyticsEnabled() {},
};

export function configureCrashlyticsAdapter(nextAdapter: CrashlyticsAdapter) {
  adapter = nextAdapter;
}

export function resetCrashlyticsAdapter() {
  adapter = {
    async setUserId() {},
    async setAttributes() {},
    async recordError() {},
    async log() {},
    async setCrashlyticsEnabled() {},
  };
}

export function getCrashlyticsDefaultAttributes() {
  return {
    app_env: env.EXPO_PUBLIC_APP_ENV ?? 'unknown',
    app_version: env.EXPO_PUBLIC_APP_VERSION ?? 'unknown',
  };
}

export const crashlyticsService = {
  setUserId(userId: string) {
    return Promise.resolve(adapter.setUserId(userId)).catch((error) => {
      logger.warn('crashlytics: setUserId failed', { error });
    });
  },

  setAttributes(attributes: Record<string, string>) {
    return Promise.resolve(adapter.setAttributes(attributes)).catch((error) => {
      logger.warn('crashlytics: setAttributes failed', { error });
    });
  },

  recordError(error: Error, context?: string) {
    return Promise.resolve(adapter.recordError(error))
      .then(() => {
        if (!context) {
          return undefined;
        }

        return Promise.resolve(adapter.log(`Context: ${context}`));
      })
      .catch((cause) => {
        logger.warn('crashlytics: recordError failed', { error, cause });
      });
  },

  log(message: string) {
    return Promise.resolve(adapter.log(message)).catch((error) => {
      logger.warn('crashlytics: log failed', { error });
    });
  },

  setCrashlyticsEnabled(enabled: boolean) {
    return Promise.resolve(adapter.setCrashlyticsEnabled(enabled)).catch((error) => {
      logger.warn('crashlytics: setCrashlyticsEnabled failed', { enabled, error });
    });
  },
};
