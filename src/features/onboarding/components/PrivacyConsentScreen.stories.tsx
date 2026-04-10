import type { Meta, StoryObj } from '@storybook/react-vite';

import { PrivacyConsentProvider } from '../../../components/providers';
import { themeStore } from '../../../stores/themeStore';
import { PrivacyConsentScreen } from './PrivacyConsentScreen';

const meta: Meta<typeof PrivacyConsentScreen> = {
  title: 'Feature/Onboarding/PrivacyConsentScreen',
  component: PrivacyConsentScreen,
  decorators: [
    (Story) => {
      themeStore.getState().setColorScheme('system');
      return (
        <PrivacyConsentProvider>
          <Story />
        </PrivacyConsentProvider>
      );
    },
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof PrivacyConsentScreen>;

export const Default: Story = {};
