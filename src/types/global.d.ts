declare module '*.css';

declare module 'swagger-ui-react' {
  import type { ComponentType } from 'react';

  const SwaggerUI: ComponentType<Record<string, unknown>>;
  export default SwaggerUI;
}

interface ImportMetaEnv {
  readonly EXPO_PUBLIC_API_BASE_URL?: string;
  readonly EXPO_PUBLIC_APP_ENV?: 'development' | 'staging' | 'production';
  readonly EXPO_PUBLIC_SENTRY_DSN?: string;
  readonly EXPO_PUBLIC_APP_VERSION?: string;
  readonly EXPO_PUBLIC_FEATURE_NEW_CHECKOUT?: string;
  readonly EXPO_PUBLIC_FEATURE_RECOMMENDATIONS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
