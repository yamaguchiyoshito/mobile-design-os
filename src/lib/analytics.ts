import { logger } from './logger';

const PII_KEYS = ['email', 'name', 'phone', 'address', 'birth_date'] as const;

type AllowedParamValue = string | number | boolean;

export type AnalyticsEventMap = {
  screen_view: { screen_name: string; screen_class?: string };
  view_item: { item_id: string; item_name: string; price: number; currency: string };
  add_to_cart: { item_id: string; item_name: string; quantity: number };
  begin_checkout: { cart_value: number; currency: string; item_count: number };
  purchase: { transaction_id: string; value: number; currency: string };
  login: { method: 'email' | 'sso' | 'biometric' };
  sign_up: { method: 'email' | 'sso' };
  search: { search_term: string; result_count: number };
  share: { content_type: string; item_id: string };
  error: { error_type: string; screen_name: string };
};

export type AnalyticsAdapter = {
  setUserId: (userId: string | null) => Promise<void> | void;
  setUserProperty: (name: string, value: string) => Promise<void> | void;
  logEvent: (event: string, params: Record<string, AllowedParamValue>) => Promise<void> | void;
  logScreenView: (params: {
    screen_name: string;
    screen_class: string;
  }) => Promise<void> | void;
  setEnabled: (enabled: boolean) => Promise<void> | void;
};

function isAllowedParamValue(value: unknown): value is AllowedParamValue {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  );
}

export function sanitizeParams(params: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(params)
      .filter(([key]) => !(PII_KEYS as readonly string[]).includes(key))
      .filter(([, value]) => isAllowedParamValue(value)),
  ) as Record<string, AllowedParamValue>;
}

let adapter: AnalyticsAdapter = {
  async setUserId() {},
  async setUserProperty() {},
  async logEvent() {},
  async logScreenView() {},
  async setEnabled() {},
};

export function configureAnalyticsAdapter(nextAdapter: AnalyticsAdapter) {
  adapter = nextAdapter;
}

export function resetAnalyticsAdapter() {
  adapter = {
    async setUserId() {},
    async setUserProperty() {},
    async logEvent() {},
    async logScreenView() {},
    async setEnabled() {},
  };
}

export const analyticsService = {
  setUserId(userId: string | null) {
    return Promise.resolve(adapter.setUserId(userId)).catch((error) => {
      logger.warn('analytics: setUserId failed', { error });
    });
  },

  setUserProperty(name: string, value: string) {
    return Promise.resolve(adapter.setUserProperty(name, value)).catch((error) => {
      logger.warn('analytics: setUserProperty failed', { error });
    });
  },

  logEvent<K extends keyof AnalyticsEventMap>(event: K, params: AnalyticsEventMap[K]) {
    return Promise.resolve(
      adapter.logEvent(event, sanitizeParams(params as Record<string, unknown>)),
    ).catch((error) => {
      logger.warn('analytics: logEvent failed', { event, error });
    });
  },

  logScreenView(screenName: string, screenClass?: string) {
    return Promise.resolve(
      adapter.logScreenView({
        screen_name: screenName,
        screen_class: screenClass ?? screenName,
      }),
    ).catch((error) => {
      logger.warn('analytics: logScreenView failed', { screenName, error });
    });
  },

  setEnabled(enabled: boolean) {
    return Promise.resolve(adapter.setEnabled(enabled)).catch((error) => {
      logger.warn('analytics: setEnabled failed', { enabled, error });
    });
  },
};
