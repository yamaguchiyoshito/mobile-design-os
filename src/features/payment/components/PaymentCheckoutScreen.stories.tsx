import type { Meta, StoryObj } from '@storybook/react-vite';

import { FeatureFlagProvider } from '../../../components/providers';
import { PaymentCheckoutScreen } from './PaymentCheckoutScreen';

const meta: Meta<typeof PaymentCheckoutScreen> = {
  title: 'Feature/Payment/PaymentCheckoutScreen',
  component: PaymentCheckoutScreen,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof PaymentCheckoutScreen>;

export const NewCheckout: Story = {
  args: {
    paymentUrl: 'https://payment.example.com/checkout',
    orderId: 'order-1001',
    amountLabel: '¥12,800',
  },
  render: (args) => (
    <FeatureFlagProvider overrides={{ newCheckout: true }}>
      <PaymentCheckoutScreen {...args} />
    </FeatureFlagProvider>
  ),
};

export const LegacyCheckout: Story = {
  args: {
    paymentUrl: 'https://payment.example.com/checkout',
    orderId: 'order-1002',
    amountLabel: '¥7,400',
  },
  render: (args) => (
    <FeatureFlagProvider overrides={{ newCheckout: false }}>
      <PaymentCheckoutScreen {...args} />
    </FeatureFlagProvider>
  ),
};
