import type { Meta, StoryObj } from '@storybook/react-vite';

import { PaymentResultScreen } from './PaymentResultScreen';

const meta: Meta<typeof PaymentResultScreen> = {
  title: 'Feature/Payment/PaymentResultScreen',
  component: PaymentResultScreen,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof PaymentResultScreen>;

export const Success: Story = {
  args: {
    status: 'success',
    transactionId: 'txn-001',
    orderId: 'order-1001',
    amountLabel: '¥12,800',
    onPrimaryAction: () => undefined,
    onSecondaryAction: () => undefined,
  },
};

export const Error: Story = {
  args: {
    status: 'error',
    transactionId: 'txn-002',
    amountLabel: '¥12,800',
    errorMessage: '3D セキュア認証がタイムアウトしました。',
    onPrimaryAction: () => undefined,
    onSecondaryAction: () => undefined,
  },
};

export const Cancelled: Story = {
  args: {
    status: 'cancelled',
    orderId: 'order-1002',
    amountLabel: '¥7,400',
    onPrimaryAction: () => undefined,
    onSecondaryAction: () => undefined,
  },
};
