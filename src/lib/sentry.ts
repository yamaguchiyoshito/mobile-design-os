const PII_FIELDS = [
  'email',
  'phone',
  'name',
  'address',
  'password',
  'token',
  'authorization',
  'cookie',
  'secret',
  'card_number',
  'cvv',
  'birth_date',
] as const;

const PII_PATTERN = new RegExp(PII_FIELDS.join('|'), 'i');

type SentryPrimitive = string | number | boolean | null | undefined;
type SentryContext = Record<string, unknown>;
type BreadcrumbLevel = 'debug' | 'info' | 'warning' | 'error';
type CaptureLevel = 'info' | 'warning' | 'error';

export type SentryAdapter = {
  addBreadcrumb: (payload: {
    level: BreadcrumbLevel;
    message: string;
    category: string;
    data?: Record<string, unknown>;
  }) => Promise<void> | void;
  captureMessage: (message: string, payload: {
    level: CaptureLevel;
    extra?: Record<string, unknown>;
  }) => Promise<void> | void;
  captureException: (error: unknown, payload?: {
    extra?: Record<string, unknown>;
  }) => Promise<void> | void;
  setUser: (user: { id: string } | null) => Promise<void> | void;
  setTag: (key: string, value: string) => Promise<void> | void;
};

function sanitizeValue(key: string, value: unknown): unknown {
  if (typeof value === 'string' && PII_PATTERN.test(key)) {
    return '[Filtered]';
  }

  if (Array.isArray(value)) {
    return value.map((entry) => {
      if (entry && typeof entry === 'object') {
        return sanitizeContext(entry as Record<string, unknown>);
      }

      return entry as SentryPrimitive;
    });
  }

  if (value && typeof value === 'object') {
    return sanitizeContext(value as Record<string, unknown>);
  }

  return value as SentryPrimitive;
}

export function sanitizeContext(context?: SentryContext) {
  if (!context) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(context).map(([key, value]) => [key, sanitizeValue(key, value)]),
  );
}

let adapter: SentryAdapter = {
  async addBreadcrumb() {},
  async captureMessage() {},
  async captureException() {},
  async setUser() {},
  async setTag() {},
};

export function configureSentryAdapter(nextAdapter: SentryAdapter) {
  adapter = nextAdapter;
}

export function resetSentryAdapter() {
  adapter = {
    async addBreadcrumb() {},
    async captureMessage() {},
    async captureException() {},
    async setUser() {},
    async setTag() {},
  };
}

export const sentryService = {
  addBreadcrumb(level: BreadcrumbLevel, message: string, context?: SentryContext) {
    return Promise.resolve(
      adapter.addBreadcrumb({
        level,
        message,
        category: 'app',
        data: sanitizeContext(context),
      }),
    );
  },

  captureMessage(message: string, level: CaptureLevel, context?: SentryContext) {
    return Promise.resolve(
      adapter.captureMessage(message, {
        level,
        extra: sanitizeContext(context),
      }),
    );
  },

  captureException(error: unknown, context?: SentryContext) {
    return Promise.resolve(
      adapter.captureException(error, {
        extra: sanitizeContext(context),
      }),
    );
  },

  setUserId(userId: string | null) {
    return Promise.resolve(adapter.setUser(userId ? { id: userId } : null));
  },

  setTag(key: string, value: string) {
    return Promise.resolve(adapter.setTag(key, value));
  },
};
