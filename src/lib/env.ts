import { z } from 'zod';

const envSchema = z.object({
  EXPO_PUBLIC_API_BASE_URL: z.string().url().optional(),
  EXPO_PUBLIC_APP_ENV: z.enum(['development', 'staging', 'production']).optional(),
  EXPO_PUBLIC_SENTRY_DSN: z.string().optional(),
  EXPO_PUBLIC_APP_VERSION: z.string().optional(),
  EXPO_PUBLIC_FEATURE_NEW_CHECKOUT: z.string().optional(),
  EXPO_PUBLIC_FEATURE_RECOMMENDATIONS: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

const rawEnv = {
  ...(typeof process !== 'undefined' ? process.env : {}),
  ...(import.meta.env ?? {}),
};

const parsed = envSchema.safeParse(rawEnv);

if (!parsed.success && rawEnv.EXPO_PUBLIC_APP_ENV === 'production') {
  throw new Error('Missing required environment variables');
}

export const env = parsed.success ? parsed.data : (rawEnv as Partial<Env>);
