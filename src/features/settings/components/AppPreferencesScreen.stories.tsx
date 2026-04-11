import type { Meta, StoryObj } from '@storybook/react-vite';

import { PrivacyConsentProvider, ThemeProvider } from '../../../components/providers';
import { themeStore } from '../../../stores/themeStore';
import { AppPreferencesScreen } from './AppPreferencesScreen';

const meta: Meta<typeof AppPreferencesScreen> = {
  title: 'Feature/Settings/AppPreferencesScreen',
  component: AppPreferencesScreen,
  decorators: [
    (Story) => {
      themeStore.getState().setColorScheme('system');
      return (
        <ThemeProvider>
          <PrivacyConsentProvider>
            <Story />
          </PrivacyConsentProvider>
        </ThemeProvider>
      );
    },
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof AppPreferencesScreen>;

export const Default: Story = {};

export const Mobile390: Story = {
  globals: {
    previewWidth: 'mobile390',
  },
};
