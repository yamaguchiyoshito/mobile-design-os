import type { Preview } from '@storybook/react-vite';
import { Fragment, createElement, type ReactNode, useLayoutEffect } from 'react';
import '../src/styles/global.css';

const PREVIEW_WIDTHS = {
  responsive: null,
  mobile320: 320,
  mobile375: 375,
  mobile390: 390,
  mobile430: 430,
  tablet768: 768,
} as const;

type PreviewWidthKey = keyof typeof PREVIEW_WIDTHS;

function isPreviewWidthKey(value: unknown): value is PreviewWidthKey {
  return typeof value === 'string' && value in PREVIEW_WIDTHS;
}

function PreviewWidthController({
  viewportKey,
  children,
}: {
  viewportKey: PreviewWidthKey;
  children: ReactNode;
}) {
  useLayoutEffect(() => {
    const frame = window.frameElement as HTMLIFrameElement | null;

    if (!frame) {
      return undefined;
    }

    const original = {
      width: frame.style.width,
      maxWidth: frame.style.maxWidth,
      margin: frame.style.margin,
      display: frame.style.display,
      borderRadius: frame.style.borderRadius,
      boxShadow: frame.style.boxShadow,
    };
    const width = PREVIEW_WIDTHS[viewportKey];

    frame.style.display = 'block';
    frame.style.maxWidth = '100%';
    frame.style.width = width ? `${width}px` : '100%';
    frame.style.margin = width ? '16px auto' : '0';
    frame.style.borderRadius = width ? '24px' : '0';
    frame.style.boxShadow = width
      ? '0 0 0 1px rgba(15, 23, 42, 0.08), 0 16px 40px rgba(15, 23, 42, 0.18)'
      : 'none';

    return () => {
      frame.style.width = original.width;
      frame.style.maxWidth = original.maxWidth;
      frame.style.margin = original.margin;
      frame.style.display = original.display;
      frame.style.borderRadius = original.borderRadius;
      frame.style.boxShadow = original.boxShadow;
    };
  }, [viewportKey]);

  return createElement(Fragment, null, children);
}

const preview: Preview = {
  globalTypes: {
    previewWidth: {
      name: 'Width',
      description: 'Preview viewport width',
      defaultValue: 'responsive',
      toolbar: {
        icon: 'browser',
        dynamicTitle: true,
        items: [
          { value: 'responsive', title: 'Responsive' },
          { value: 'mobile320', title: '320px' },
          { value: 'mobile375', title: '375px' },
          { value: 'mobile390', title: '390px' },
          { value: 'mobile430', title: '430px' },
          { value: 'tablet768', title: '768px' },
        ],
      },
    },
  },
  decorators: [
    (Story, context) =>
      createElement(
        PreviewWidthController,
        {
          viewportKey: isPreviewWidthKey(context.globals.previewWidth)
            ? context.globals.previewWidth
            : 'responsive',
          children: createElement(Story),
        },
      ),
  ],
  parameters: {
    options: {
      storySort: {
        method: 'alphabetical',
        locales: 'ja',
        order: [
          'Architecture',
          [
            'Handbook',
            [
              'Overview',
              'Foundation',
              [
                'Principles',
                'UI System',
                'Data and State',
                'Screen Composition',
                'Message Display',
              ],
              'Quality',
              [
                'Quality Assurance',
                'Accessibility',
                'Test Strategy',
                'Performance',
                'Animation',
                'Observability',
                'Storybook Guide',
              ],
              'Operations',
              ['Operations', 'Library Update', 'Dev Environment', 'Store Publishing'],
              'Platform',
              [
                'WebView',
                'Push Notifications',
                'Device Permissions',
                'Deep Link',
                'Offline Sync',
                'Biometric Auth',
                'File and Media',
                'I18n',
                'Feature Flags',
              ],
              'Integrations',
              ['API Communication', 'Firebase', 'AWS Mobile Services'],
            ],
          ],
          'Reference',
          [['API', ['Example OpenAPI']]],
          'App',
          [['AppErrorBoundary', 'AuthRouteGuard', 'MainAppNavigator', 'MainRouteGuard', 'RootAppShell']],
          'Feature',
          [
            ['Auth', ['LogoutButton']],
            ['Onboarding', ['PrivacyConsentScreen']],
            ['Orders', ['OrderDetailScreen', 'OrdersOverviewScreen']],
            ['Payment', ['PaymentCheckoutScreen', 'PaymentResultScreen', 'PaymentWebView']],
            ['Settings', ['AppPreferencesScreen']],
          ],
          'UI',
          [
            'Banner',
            'Button',
            'Card',
            'ConfirmDialog',
            'EmptyState',
            'ErrorState',
            'FormError',
            'FormField',
            'IconButton',
            'ImagePreview',
            'LoadingSkeleton',
            'Modal',
            'PermissionDeniedPrompt',
            'SearchBar',
            'Select',
            'Skeleton',
            'Snackbar',
            'Switch',
            'TabBar',
            'TextInput',
            'Toast',
            'WebViewContainer',
            'Layout',
            ['AuthLayout', 'MainLayout', 'Section'],
          ],
        ],
      },
    },
  },
};

export default preview;
