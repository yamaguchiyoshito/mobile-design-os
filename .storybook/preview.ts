import type { Preview } from '@storybook/react-vite';

const preview: Preview = {
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
        ],
      },
    },
  },
};

export default preview;
